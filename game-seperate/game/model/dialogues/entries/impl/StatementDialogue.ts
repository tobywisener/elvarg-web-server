import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { Misc } from "../../../../../util/Misc";

export class StatementDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [356, 359, 363, 368, 374];
    private text: string;

    constructor(index: number, text: string) {
        super(index);
        this.text = text;
    }

    send(player: Player) {
        StatementDialogue.send(player, this.text);
    }

    static send(player: Player, text: string) {
        let lines = Misc.wrapText(text, 60);
        let length = lines.length > 5 ? 5 : lines.length;
        let chatboxInterface = StatementDialogue.CHATBOX_INTERFACES[length - 1];
        for (let i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], (chatboxInterface + 1) + i);
        }
        player.getPacketSender().sendChatboxInterface(chatboxInterface);
    }

    public static sends(player: Player, lines: string[]): void {
        const length = lines.length > 5 ? 5 : lines.length;
        const chatboxInterface = StatementDialogue.CHATBOX_INTERFACES[length - 1];
        for (let i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], (chatboxInterface + 1) + i);
        }
        player.getPacketSender().sendChatboxInterface(chatboxInterface);
    }
}