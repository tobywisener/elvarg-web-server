"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sounds = void 0;
var Sounds = /** @class */ (function () {
    function Sounds() {
    }
    Sounds.sendSound = function (player, sound) {
        if (!player || !sound || player.isPlayerBot()) {
            return;
        }
        this.sendSound(player, sound);
    };
    Sounds.sendSoundEffect = function (player, soundId, loopType, delay, volume) {
        player.getPacketSender().sendSoundEffect(soundId, loopType, delay, volume);
    };
    return Sounds;
}());
exports.Sounds = Sounds;
//# sourceMappingURL=Sounds.js.map