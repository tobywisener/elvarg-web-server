import { PlayerBot } from "../PlayerBot";
import { CommandType } from "./CommandType";
import { Presetables } from '../../../../content/presets/Presetables'
import { Presetable } from '../../../../content/presets/Presetable'
import { Misc } from '../../../../../util/Misc'
import { BotCommand } from "./BotCommand";

export class LoadPreset implements BotCommand {

    public static readonly LOAD_PRESET_BUTTON_ID: number = 45064;

    triggers(): string[] {
        return ["load preset"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        let preset: Presetable;
        if (!args || args.length == 0 || args.length != 1 || parseInt(args[0]) == 0 || parseInt(args[0]) > Presetables.GLOBAL_PRESETS.length) {
            // Player hasn't specified a valid Preset ID
            preset = Presetables.GLOBAL_PRESETS[Misc.randomInclusive(0, Presetables.GLOBAL_PRESETS.length - 1)];
        } else {
            preset = Presetables.GLOBAL_PRESETS[parseInt(args[0]) - 1 /* Player will specify 1-n */];
        }

        playerBot.setCurrentPreset(preset);
        Presetables.handleButton(playerBot, LoadPreset.LOAD_PRESET_BUTTON_ID);

        playerBot.updateLocalPlayers();

        // Indicate the command is finished straight away
        playerBot.stopCommand();
    }

    stop(playerBot: PlayerBot): void {
        // Command auto-stops
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT];
    }
}
