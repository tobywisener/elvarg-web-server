import { Player } from '../../../entity/impl/player/Player';
import { Command } from '../../../model/commands/Command';

export class CreationDate implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let calendar = new Date(player.getCreationDate().getTime());

        let dateSuffix;
        switch (calendar.getDate() % 10) {
            case 1:
                dateSuffix = "st";
                break;
            case 2:
                dateSuffix = "nd";
                break;
            case 3:
                dateSuffix = "rd";
                break;
            default:
                dateSuffix = "th";
                break;
        }

        player.forceChat("I started playing on the " + calendar.getDate() + dateSuffix + " of "
            + new Intl.DateTimeFormat('en-US', { month: 'long' }).format(calendar) + ", "
            + calendar.getFullYear() + "!");
    }

    canUse(player: Player) {
        return true;
    }

    private getDateSuffix(date: number): string {
        switch (date % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
}