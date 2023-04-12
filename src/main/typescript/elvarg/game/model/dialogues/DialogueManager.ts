import { Player } from "../../entity/impl/player/Player";
import { DynamicDialogueBuilder } from "./builders/DynamicDialogueBuilder";
import { DialogueBuilder } from "./builders/DialogueBuilder";
import { Dialogue } from "./entries/Dialogue";
import { TestStaticDialogue } from '../../model/dialogues/builders/impl/TestStaticDialogue'
import { DialogueOption } from "./DialogueOption";
import { OptionsDialogue } from "./entries/impl/OptionsDialogue";
import { OptionDialogue } from "./entries/impl/OptionDialogue";
import { DialogueExpression } from "./DialogueExpression";

export class DialogueManager {
    public static readonly STATIC_DIALOGUES: Map<number, DialogueBuilder> = new Map<number, DialogueBuilder>([
        [0, new TestStaticDialogue()]
    ]);

    private readonly player: Player;

    /**
     * A {@link Map} which holds all of the current dialogue entries and indexes.
     */
    private dialogues: Map<number, Dialogue> = new Map<number, Dialogue>();

    /**
     * The current dialogue's index.
     */
    private index: number;

    /**
     * Creates a new {@link DialogueManager} for the given {@link Player}.
     *
     * @param player
     */
    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Resets all of the attributes of the {@link DialogueManager}.
     */
    public reset() {
        this.dialogues.clear();
        this.index = -1;
    }

    /**
     * Advances, starting the next dialogue.
     */
    public advance() {
        let current = this.dialogues.get(this.index);
        if (current == null) {
            this.reset();
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }

        let continueAction = current.getContinueAction();
        if (continueAction != null) {
            // This dialogue has a custom continue action
            continueAction.execute(this.player);
            this.reset();
            return;
        }

        this.startDialogue(this.index + 1);
    }

    public startDialogue(index: number) {
        this.index = index;
        this.startDialogueOption();
    }

    public startStaticDialogue(id: number) {
        const builder = DialogueManager.STATIC_DIALOGUES.get(id);
        if (builder) {
            this.startDialogueOption();
        }
    }

    public startDialogues(builder: DialogueBuilder) {
        this.startDialogue(0);
    }

    public startDialog(builder: DialogueBuilder, index: number): DialogueExpression {
        if (builder instanceof DynamicDialogueBuilder) {
            (builder as DynamicDialogueBuilder).build(this.player);
        }
        this.startDialogueMap(builder.getDialogues(), index);

        return new DialogueExpression(index);
    }

    private startDialogueMap(entries: Map<number, Dialogue>, index: number) {
        this.reset();
        this.dialogues.clear();
        entries.forEach((value, key) => {
            this.dialogues.set(key, value);
        });
        this.startDialogueOption();
    }

    private startDialogueOption() {
        const dialogue = this.dialogues.get(this.index);
        if (!dialogue) {
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        dialogue.send(this.player);
    }

    public handleOption(option: DialogueOption): void {
        const dialogue = this.dialogues.get(this.index);
        if (dialogue instanceof OptionsDialogue) {
            (dialogue as OptionsDialogue).execute(option, this.player);
            return;
        }
        if (!(dialogue instanceof OptionDialogue)) {
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        (dialogue as OptionDialogue).execute(option);
    }

}
