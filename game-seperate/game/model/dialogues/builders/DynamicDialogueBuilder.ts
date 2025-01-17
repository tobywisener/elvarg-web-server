import { DialogueBuilder } from "./DialogueBuilder";
import { Player } from "../../../entity/impl/player/Player";

export abstract class DynamicDialogueBuilder extends DialogueBuilder {
    public abstract build(player: Player): void;
}
