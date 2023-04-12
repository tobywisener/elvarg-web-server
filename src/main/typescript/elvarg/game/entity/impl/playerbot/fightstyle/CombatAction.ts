import {Mobile} from '../../Mobile'
import {PlayerBot} from '../PlayerBot'

export interface CombatAction {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean;
    perform(playerBot: PlayerBot, enemy: Mobile);
    stopAfter(): boolean
}