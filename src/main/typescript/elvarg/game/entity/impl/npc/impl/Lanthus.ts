import { CastleWars } from "../../../../content/minigames/impl/CastleWars";
import { NPC } from "../NPC";
import { NPCInteraction } from "../NPCInteraction";
import { Player } from "../../player/Player";
import { Ids } from "../../../../model/Ids";
import { Item } from "../../../../model/Item";
import { Location } from "../../../../model/Location";
import { Shop } from "../../../../model/container/shop/Shop";
import { ShopManager } from "../../../../model/container/shop/ShopManager";
import { ShopCurrencies } from "../../../../model/container/shop/currency/ShopCurrencies";
import { DialogueChainBuilder } from "../../../../model/dialogues/builders/DialogueChainBuilder";
import { ActionDialogue } from "../../../../model/dialogues/entries/impl/ActionDialogue";
import { EndDialogue } from "../../../../model/dialogues/entries/impl/EndDialogue";
import { ItemStatementDialogue } from "../../../../model/dialogues/entries/impl/ItemStatementDialogue";
import { NpcDialogue } from "../../../../model/dialogues/entries/impl/NpcDialogue";
import { OptionDialogue } from "../../../../model/dialogues/entries/impl/OptionDialogue";
import { OptionsDialogue } from "../../../../model/dialogues/entries/impl/OptionsDialogue";
import { PlayerDialogue } from "../../../../model/dialogues/entries/impl/PlayerDialogue";
import { StatementDialogue } from "../../../../model/dialogues/entries/impl/StatementDialogue";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { DialogueOptionsAction } from "../../../../model/dialogues/DialogueOptionsAction";
import { DialogueExpression } from "../../../../model/dialogues/DialogueExpression";

class LanthusDialogue implements DialogueOptionsAction{
    constructor(private readonly execFunc: Function){

    }
    execute(player: Player): void {
        this.execFunc();
    }

}

export class Lanthus extends NPC implements NPCInteraction {
    private dialogueBuilder: DialogueChainBuilder;


    private player: Player


    private static readonly CASTLE_WARS_SHOP: Shop = new Shop(
        "Castle Wars Ticket Exchange",
        [
            new Item(ItemIdentifiers.CASTLEWARS_HELM_RED, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_PLATE_RED, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SWORD_RED, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SHIELD_RED, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_LEGS_RED, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_HELM_WHITE, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_PLATE_WHITE, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SWORD_WHITE, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SHIELD_WHITE, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_LEGS_WHITE, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_HELM_GOLD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_PLATE_GOLD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SWORD_GOLD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_SHIELD_GOLD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_LEGS_GOLD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_HOOD, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_CLOAK, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_HOOD_2, Shop.INFINITY),
            new Item(ItemIdentifiers.CASTLEWARS_CLOAK_2, Shop.INFINITY),
        ],
        ShopCurrencies.CASTLE_WARS_TICKET
    );

    static {
        ShopManager.shops.set(Lanthus.CASTLE_WARS_SHOP.getId(), Lanthus.CASTLE_WARS_SHOP);
    }

    constructor(id: number, position: Location) {
        super(id, position);
        this.buildDialogues();

        CastleWars.LOBBY_AREA.setLanthus(this);
    }

    firstOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().startDialog(this.dialogueBuilder, 0);
    }

    secondOptionClick(player: Player, npc: NPC): void { }

    thirdOptionClick(player: Player, npc: NPC): void {
        ShopManager.opens(player, Lanthus.CASTLE_WARS_SHOP.getId());
    }

    forthOptionClick(player: Player, npc: NPC): void { }
    private message = "Lanthus gives you a Castlewars Manual.";


    useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void { }

    private buildDialogues(): void {
        this.dialogueBuilder = new DialogueChainBuilder();
        this.dialogueBuilder.add(
            new NpcDialogue(0, NpcIdentifiers.LANTHUS, "Good day, how may I help you?"),
            new OptionsDialogue(
                1, null,
                new Map([
                    [
                        "What is this place?",
                        new LanthusDialogue((player: Player) => player.getDialogueManager().startDialogue(2)),
                    ],
                    [
                        "What do you have for trade?",
                        new LanthusDialogue((player: Player) => {
                            ShopManager.opens(player, Lanthus.CASTLE_WARS_SHOP.getId())}),
                    ],
                    [
                        "Do you have a manual? I'd like to learn how to play!",
                        new LanthusDialogue((player: Player) => player.getDialogueManager().startDialogue(4)),
                    ],
                ])
            ),
            new PlayerDialogue(2, "What is this place?"),
            new NpcDialogue(3, NpcIdentifiers.LANTHUS,
                "This is the great Castle Wars arena! Here you can " +
                "fight for the glory of Saradomin or Zamorak.",
                (this.player.getDialogueManager().startDialog(this.dialogueBuilder, 1))),
            new PlayerDialogue(4, "Do you have a manual? I'd like to learn how to play!"),
            new NpcDialogue(5, NpcIdentifiers.LANTHUS, "Sure, here you go.", new ItemStatementDialogue.send(this.player, "", [this.message], CastleWars.MANUAL.getId(), 200),
            ),
            new EndDialogue(6)
        )
    }
}


class LanthusExpression extends DialogueExpression{
    constructor(n1: number){
        super(n1)
    }
}
