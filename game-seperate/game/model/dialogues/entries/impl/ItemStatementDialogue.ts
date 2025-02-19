
import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";

export class ItemStatementDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [4885, 4890, 4896, 4903];
    private title: string;
    private text: string[];
    private itemId: number;
    private modelZoom: number;

    constructor(index: number, title: string, text: string[], itemId: number, modelZoom: number) {
        super(index);
        this.title = title;
        this.text = text;
        this.itemId = itemId;
        this.modelZoom = modelZoom;
    }

    public send(player: Player) {
        ItemStatementDialogue.send(player, this.title, this.text, this.itemId, this.modelZoom);
    }

    public static send(player: Player, title: string, statements: string[], itemId: number, modelZoom: number) {
        let length = statements.length > 5 ? 5 : statements.length;
        let startDialogueChildId = ItemStatementDialogue.CHATBOX_INTERFACES[length - 1];
        let headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendInterfaceModel(headChildId, itemId, modelZoom);
        player.getPacketSender().sendString(title, startDialogueChildId - 1,);
        for (let i = 0; i < statements.length; i++) {
            player.getPacketSender().sendString(statements[i],startDialogueChildId + i,);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    }
}