import { PlayerBot } from "../PlayerBot";
import { FollowPlayerPacketListener } from "../../../../../net/packet/impl/FollowPlayerPacketListener"
import { BotCommand } from "./BotCommand"
import { CommandType } from "./CommandType";

export class FollowPlayer implements BotCommand {

    triggers(): string[] {
        return ["follow me"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        FollowPlayerPacketListener.follow(playerBot, playerBot.getInteractingWith());
    }

    stop(playerBot: PlayerBot): void {
        playerBot.getMovementQueue().walkToReset();
        playerBot.setMobileInteraction(null);
        playerBot.updateLocalPlayers();
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT];
    }
}