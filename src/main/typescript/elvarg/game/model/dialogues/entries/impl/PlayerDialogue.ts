import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueExpression } from "../../DialogueExpression";
import { Misc } from "../../../../../util/Misc";

export class PlayerDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [971, 976, 982, 989];
    private text: string;
    private expression: DialogueExpression;

    constructor(index: number, text: string, expression?: DialogueExpression) {
        super(index);
        this.text = text;
        this.expression = expression;
    }

    send(player: Player) {
        PlayerDialogue.send(player, this.text, this.expression);
    }

    static send(player: Player, text: string, expression: DialogueExpression) {
        let lines = Misc.wrapText(text, 53);
        let length = lines.length;
        if (length > 5) {
            length = 5;
        }
        let startDialogueChildId = PlayerDialogue.CHATBOX_INTERFACES[length - 1];
        let headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendPlayerHeadOnInterface(headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString( player.getUsername(), startDialogueChildId - 1);
        for (let i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    }
}