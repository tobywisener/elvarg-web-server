import { Player } from "../../../../entity/impl/player/Player";
export interface ShopCurrency {
    /**
    
    Gets the name of the currency - as displayed in messages and dialogues.
    */
    getName(): string;
    /**
    
    Gets the total amount of currency currently spendable by the Player.
    @param player
    */
    getAmountForPlayer(player: Player): number;
    /**
    
    Decrements the currency by a given amount for the Player.
    @param player
    @param amount
    */
    decrementForPlayer(player: Player, amount: number): void;
    /**
    
    Increments the currency by a given amount for the Player.
    @param player
    @param amount
    */
    incrementForPlayer(player: Player, amount: number): void;
    }