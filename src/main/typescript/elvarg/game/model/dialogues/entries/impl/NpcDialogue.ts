import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueExpression } from "../../DialogueExpression";
import { Misc } from "../../../../../util/Misc";
import { NpcDefinition } from "../../../../definition/NpcDefinition";
import { DialogueAction } from '../../../../model/dialogues/DialogueAction'

export class NpcDialogue extends Dialogue {
    private static readonly CHATBOX_INTERFACES = [4885, 4890, 4896, 4903];
    private npcId: number;
    private text: string;
    private expression: DialogueExpression;

    constructor(index: number, npcId: number, text: string, expression: DialogueExpression);
    constructor(index: number, npcId: number, text: string);
    constructor(index: number, npcId: number, text: string, expression: DialogueExpression, continueAction: DialogueAction);

    constructor(index: number, npcId: number, text: string, expression?: DialogueExpression, continueAction?: DialogueAction) {
        super(index);
        this.npcId = npcId;
        this.text = text;
        this.expression = expression || DialogueExpression.CALM;
        if (continueAction) {
            this.setContinueAction(continueAction);
        }
    }
    public send(player: Player): void {
        NpcDialogue.send(player, this.npcId, this.text, this.expression);
    }
    
    public static send(player: Player, npcId: number, text: string, expression: DialogueExpression): void {
        const lines = Misc.wrapText(text, 53);
        let length = lines.length;
        if (length > 5) {
            length = 5;
        }
        const startDialogueChildId = NpcDialogue.CHATBOX_INTERFACES[length - 1];
        const headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendNpcHeadOnInterface(npcId, headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(
                NpcDefinition.forId(npcId) != null ? NpcDefinition.forId(npcId).getName().replace("_", " ") : "",startDialogueChildId - 1);
        for (let i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    }

    public static sendStatement(player: Player, npcId: number, lines: string[], expression: DialogueExpression): void {
        const length = Math.min(lines.length, 5);
        const startDialogueChildId = NpcDialogue.CHATBOX_INTERFACES[length - 1];
        const headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendNpcHeadOnInterface(npcId, headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(
        NpcDefinition.forId(npcId)?.getName()?.replace("_", " ") || "", startDialogueChildId - 1
        );
        for (let i = 0; i < length; i++) {
          player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
      }
}