import { Player } from "../../../entity/impl/player/Player";

export interface Skillable {
    start(player: Player): void;
    cancel(player: Player): void;
    hasRequirements(player: Player): boolean;
    startAnimationLoop(player: Player): void;
    cyclesRequired(player: Player): number;
    onCycle(player: Player): void;
    finishedCycle(player: Player): void;
}