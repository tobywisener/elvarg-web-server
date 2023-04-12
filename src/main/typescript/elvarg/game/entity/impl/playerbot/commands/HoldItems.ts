import { PlayerBot } from "../PlayerBot";
import { BotCommand } from "./BotCommand";
import { CommandType } from "./CommandType";


export class HoldItems implements BotCommand {
    triggers(): string[] {
        return ["hold items", "hold my items", "hold my stuff", "keep my things", "store items", "store my items"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        if (playerBot.getTradingInteraction().holdingItems.has(playerBot.getInteractingWith())) {
            // Player bots can only store one set of items for a given player
            playerBot.sendChat("Sorry, " + playerBot.getInteractingWith().getUsername() + ", I'm already holding items for you.");
            playerBot.stopCommand();
            return;
        }

        playerBot.sendChat("Sure, just trade me your items.");
        playerBot.getInteractingWith().getPacketSender().sendMessage("Warning: These items will be lost if the server restarts.");
        playerBot.getTrading().requestTrade(playerBot.getInteractingWith());
    }

    stop(playerBot: PlayerBot): void {
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT];
    }
}
