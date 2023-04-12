"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundEffectCommand = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var Sound_1 = require("../../../../game/Sound");
var Sounds_1 = require("../../../../game/Sounds");
var SoundEffectCommand = /** @class */ (function () {
    function SoundEffectCommand() {
    }
    SoundEffectCommand.prototype.execute = function (player, command, parts) {
        var soundId = new Sound_1.Sound(parseInt(parts[1]), null, null, null);
        var delay = parts.length == 3 ? parseInt(parts[2]) : 0;
        var loopType = parts.length == 4 ? parseInt(parts[3]) : 0;
        var volume = parts.length == 5 ? parseInt(parts[4]) : 2;
        Sounds_1.Sounds.sendSound(player, soundId);
    };
    SoundEffectCommand.prototype.canUse = function (player) {
        return player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return SoundEffectCommand;
}());
exports.SoundEffectCommand = SoundEffectCommand;
//# sourceMappingURL=SoundEffectCommand.js.map