    import { Player } from '../../../entity/impl/player/Player';

export class TargetPair {
    private player1: Player;
    private player2: Player;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
    }

    getPlayer1(): Player {
        return this.player1;
    }

    getPlayer2(): Player {
        return this.player2;
    }
}
