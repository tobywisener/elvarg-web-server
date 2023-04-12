import { Player } from "../../../../entity/impl/player/Player"; 
import { Dialogue } from "../Dialogue";

export class EndDialogue extends Dialogue {
    constructor(index: number) {
        super(index);
    }

    public send(player: Player) {
        player.getPacketSender().sendInterfaceRemoval();
    }
}