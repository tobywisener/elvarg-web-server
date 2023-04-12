import * as schedule from 'node-schedule';

import { ClanChatManager } from './content/clan/ClanChatManager';
import { GameConstants } from './GameConstants';
import { World } from '../game/World';


/**
 * The engine which processes the game.
 *
 * @author Professor Oak
 */
export class GameEngine  {
    private scheduler: schedule.Job;
    
    constructor() {
        // ...
    }
    
    public init() {
        this.scheduler = schedule.scheduleJob(`*/${GameConstants.GAME_ENGINE_PROCESSING_CYCLE_RATE} * * * * *`, this.run.bind(this));
    }
    
    public async run() {
        try {
            await World.process();
        } catch (e) {
            console.log(e);
            World.savePlayers();
            ClanChatManager.save();
        }
    }
}
