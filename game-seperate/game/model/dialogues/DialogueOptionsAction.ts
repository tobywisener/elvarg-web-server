import { Player } from "../../entity/impl/player/Player";

export interface DialogueOptionsAction {
    execute(player: Player): void;
}