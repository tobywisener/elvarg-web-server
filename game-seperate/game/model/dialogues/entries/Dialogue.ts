import { Player } from "../../../entity/impl/player/Player";
import { DialogueAction } from "../DialogueAction";

export abstract class Dialogue {
    private index: number;
    private continueAction: DialogueAction;

    constructor(index: number) {
        this.index = index;
    }

    abstract send(player: Player);

    getIndex(): number {
        return this.index;
    }

    getContinueAction(): DialogueAction {
        return this.continueAction;
    }

    setContinueAction(action: DialogueAction) {
        this.continueAction = action;
    }
}