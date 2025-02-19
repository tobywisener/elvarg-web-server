import { Equipment } from "../../../../model/container/impl/Equipment";
import { BotCommand } from "./BotCommand";
import { TaskManager } from "../../../../task/TaskManager";
import { PlayerBot } from "../PlayerBot";
import { Task } from "../../../../task/Task";
import { Animation } from "../../../../model/Animation";
import { CommandType } from "./CommandType";
import { CastleWars } from "../../../../content/minigames/impl/CastleWars";
import { Team } from "../../../../content/minigames/impl/CastleWars";

class PlayCastleWarsTask extends Task{
    constructor(p: number, private readonly exeFunc: Function){
        super(5,false);
    }
    execute(): void {
        this.exeFunc();
        this.stop();
    }
    
}
export class PlayCastleWars implements BotCommand {

    private static readonly WAVE_ANIM: Animation = new Animation(863);

    public triggers(): string[] {
        return ["castlewars", " cw"];
    }

    public start(playerBot: PlayerBot, args: string[]): void {
        // Remove head and cape
        playerBot.getEquipment().set(Equipment.CAPE_SLOT, Equipment.NO_ITEM);
        playerBot.getEquipment().set(Equipment.HEAD_SLOT, Equipment.NO_ITEM);

        playerBot.updateLocalPlayers();

        playerBot.sendChat("Going to play Castlewars, BRB!");

        playerBot.performAnimation(PlayCastleWars.WAVE_ANIM);

        TaskManager.submit(new PlayCastleWarsTask(playerBot.getIndex(), () => CastleWars.addToWaitingRoom(playerBot, Team.GUTHIX)));
    }

    public stop(playerBot: PlayerBot): void {
        playerBot.getCombatInteraction().reset();
    }

    public supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT, CommandType.PRIVATE_CHAT, CommandType.CLAN_CHAT];
    }
}



