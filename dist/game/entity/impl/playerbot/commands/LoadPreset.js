"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadPreset = void 0;
var CommandType_1 = require("./CommandType");
var Presetables_1 = require("../../../../content/presets/Presetables");
var Misc_1 = require("../../../../../util/Misc");
var LoadPreset = exports.LoadPreset = /** @class */ (function () {
    function LoadPreset() {
    }
    LoadPreset.prototype.triggers = function () {
        return ["load preset"];
    };
    LoadPreset.prototype.start = function (playerBot, args) {
        var preset;
        if (!args || args.length == 0 || args.length != 1 || parseInt(args[0]) == 0 || parseInt(args[0]) > Presetables_1.Presetables.GLOBAL_PRESETS.length) {
            // Player hasn't specified a valid Preset ID
            preset = Presetables_1.Presetables.GLOBAL_PRESETS[Misc_1.Misc.randomInclusive(0, Presetables_1.Presetables.GLOBAL_PRESETS.length - 1)];
        }
        else {
            preset = Presetables_1.Presetables.GLOBAL_PRESETS[parseInt(args[0]) - 1 /* Player will specify 1-n */];
        }
        playerBot.setCurrentPreset(preset);
        Presetables_1.Presetables.handleButton(playerBot, LoadPreset.LOAD_PRESET_BUTTON_ID);
        playerBot.updateLocalPlayers();
        // Indicate the command is finished straight away
        playerBot.stopCommand();
    };
    LoadPreset.prototype.stop = function (playerBot) {
        // Command auto-stops
    };
    LoadPreset.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT];
    };
    LoadPreset.LOAD_PRESET_BUTTON_ID = 45064;
    return LoadPreset;
}());
//# sourceMappingURL=LoadPreset.js.map