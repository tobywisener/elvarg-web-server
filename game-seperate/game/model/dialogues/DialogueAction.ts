import { Player } from "../../entity/impl/player/Player";

export interface DialogueAction {
    execute(player: Player): void;
}