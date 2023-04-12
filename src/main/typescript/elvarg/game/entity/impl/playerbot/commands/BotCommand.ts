import { PlayerBot } from '../PlayerBot'
import { CommandType } from './CommandType'

export interface BotCommand {
    triggers(): string[];
    start(playerBot: PlayerBot, args: string[]): void;
    stop(playerBot: PlayerBot): void;
    supportedTypes(): CommandType[];
}