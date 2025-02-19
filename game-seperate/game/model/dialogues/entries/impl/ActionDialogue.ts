import { Action } from "../../../Action";
import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
export class ActionDialogue extends Dialogue {
    private action: Action;

    constructor(index: number, action: Action) {
        super(index);
        this.action = action;
    }

    public send(player: Player) {
        this.action.execute();
    }
}