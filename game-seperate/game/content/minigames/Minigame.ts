import { Player } from '../../entity/impl/player/Player';
import { GameObject } from '../../entity/impl/object/GameObject';

export interface Minigame {
    firstClickObject(player: Player, object: GameObject): boolean;
    handleButtonClick(player: Player, button: number): boolean;
    process(): void;
}
