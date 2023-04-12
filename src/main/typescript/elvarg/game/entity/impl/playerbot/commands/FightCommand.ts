import { World } from "../../../../World";
import { PlayerBot } from "../PlayerBot";
import { CommandType } from "./CommandType";
import { BotCommand } from "./BotCommand";


export class FightCommand implements BotCommand {
    triggers(): string[] {
        return ["fight"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        if (!args || args.length == 0 || args[0].toLowerCase() == "me") {
            playerBot.getCombat().attack(playerBot.getInteractingWith());
            playerBot.getInteractingWith().getCombat().attack(playerBot);
            playerBot.sendChat("Sure, Good luck!");
            return;
        }

        let searchName = args.join(" ");

        if (searchName.toLowerCase() == playerBot.getUsername() || !World.getPlayerBots().has(searchName)) {
            playerBot.sendChat("Sorry, can't find " + searchName + "...");
            return;
        }

        let targetBot = World.getPlayerBots().get(searchName);

        if (playerBot.getLocation().getDistance(targetBot.getLocation()) >= 40) {
            playerBot.sendChat("Sorry, " + searchName + " is too far away.");
            return;
        }

        playerBot.getCombat().attack(targetBot);
        targetBot.getCombat().attack(playerBot);
    }

    stop(playerBot: PlayerBot): void {
        playerBot.getCombat().reset();
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT];
    }
}