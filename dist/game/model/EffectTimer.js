"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectTimer = void 0;
var EffectTimer = exports.EffectTimer = /** @class */ (function () {
    function EffectTimer(clientSprite) {
        this.clientSprite = clientSprite;
    }
    EffectTimer.prototype.getClientSprite = function () {
        return this.clientSprite;
    };
    EffectTimer.prototype.setClientSprite = function (sprite) {
        this.clientSprite = sprite;
    };
    EffectTimer.VENGEANCE = new EffectTimer(157);
    EffectTimer.FREEZE = new EffectTimer(158);
    EffectTimer.ANTIFIRE = new EffectTimer(159);
    EffectTimer.readonlyOVERLOAD = new EffectTimer(160);
    EffectTimer.TELE_BLOCK = new EffectTimer(161);
    return EffectTimer;
}());
//# sourceMappingURL=EffectTimer.js.map