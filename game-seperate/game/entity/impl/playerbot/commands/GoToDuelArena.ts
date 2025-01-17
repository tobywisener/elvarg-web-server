import { PlayerBot } from "../PlayerBot";
import { TeleportHandler } from "../../../../model/teleportation/TeleportHandler";
import { TeleportType } from "../../../../model/teleportation/TeleportType";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { BotCommand } from "./BotCommand";
import { CommandType } from "./CommandType";
import { Teleportable } from "../../../../model/teleportation/Teleportable";

class GoToDuelArenaTask extends Task{
    constructor(p: number, private readonly execFunc:Function){
        super(5,false)
    }
    execute(): void {
        this.execFunc()
        this.stop()
    }
    
}

export class GoToDuelArena implements BotCommand {
    triggers(): string[] {
        return ["duel arena"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        playerBot.sendChat("Going to Duel Arena - see ya soon!");
        const goToDuelArenaTask = new GoToDuelArenaTask(playerBot.getIndex(), () => {TeleportHandler.teleport(playerBot, Teleportable.DUEL_ARENA.getPosition(), TeleportType.NORMAL, false)});
        TaskManager.submit(goToDuelArenaTask);
        playerBot.stopCommand();
    }

    stop(playerBot: PlayerBot): void {
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT, CommandType.PRIVATE_CHAT, CommandType.CLAN_CHAT];
    }
}