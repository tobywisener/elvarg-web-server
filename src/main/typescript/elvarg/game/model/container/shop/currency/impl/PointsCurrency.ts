import { ShopCurrency } from '../../../../../model/container/shop/currency/ShopCurrency'
import { Player } from '../../../../../entity/impl/player/Player';

export class PointsCurrency implements ShopCurrency {
    getName(): string {
        return "Points";
    }
    getAmountForPlayer(player: Player): number {
        return player.getPoints();
    }
    decrementForPlayer(player: Player, amount: number) {
        player.setPoints(player.getPoints() - amount);
    }
    incrementForPlayer(player: Player, amount: number) {
        player.setPoints(player.getPoints() + amount);
    }
}