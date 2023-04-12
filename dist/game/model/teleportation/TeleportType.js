"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportType = void 0;
var Priority_1 = require("../Priority");
var Graphic_1 = require("../Graphic");
var Animation_1 = require("../Animation");
var TeleportType = exports.TeleportType = /** @class */ (function () {
    function TeleportType(startTick, startAnim, middleAnim, endAnim, startGraphic, middleGraphic, endGraphic) {
        this.startTick = startTick;
        this.startAnim = startAnim;
        this.middleAnim = middleAnim;
        this.endAnim = endAnim;
        this.startGraphic = startGraphic;
        this.middleGraphic = middleGraphic;
        this.endGraphic = endGraphic;
    }
    TeleportType.prototype.getStartAnimation = function () {
        return this.startAnim;
    };
    TeleportType.prototype.getEndAnimation = function () {
        return this.endAnim;
    };
    TeleportType.prototype.getStartGraphic = function () {
        return this.startGraphic;
    };
    TeleportType.prototype.getEndGraphic = function () {
        return this.endGraphic;
    };
    TeleportType.prototype.getStartTick = function () {
        return this.startTick;
    };
    TeleportType.prototype.getMiddleAnim = function () {
        return this.middleAnim;
    };
    TeleportType.prototype.getMiddleGraphic = function () {
        return this.middleGraphic;
    };
    // Spellbooks
    TeleportType.NORMAL = new TeleportType(3, new Animation_1.Animation(714), null, new Animation_1.Animation(715), new Graphic_1.Graphic(308, 50), null, null);
    TeleportType.ANCIENT = new TeleportType(5, new Animation_1.Animation(1979), null, Animation_1.Animation.DEFAULT_RESET_ANIMATION, new Graphic_1.Graphic(392, Priority_1.Priority.HIGH), null, null);
    TeleportType.LUNAR = new TeleportType(4, new Animation_1.Animation(1816), null, new Animation_1.Animation(715), new Graphic_1.Graphic(308, Priority_1.Priority.HIGH), null, null);
    // Ladders
    TeleportType.LADDER_DOWN = new TeleportType(1, new Animation_1.Animation(827), null, Animation_1.Animation.DEFAULT_RESET_ANIMATION, null, null, null);
    TeleportType.LADDER_UP = new TeleportType(1, new Animation_1.Animation(828), null, Animation_1.Animation.DEFAULT_RESET_ANIMATION, null, null, null);
    // Misc
    TeleportType.LEVER = new TeleportType(3, new Animation_1.Animation(2140), new Animation_1.Animation(714), new Animation_1.Animation(715), null, null, new Graphic_1.Graphic(308, 50));
    TeleportType.TELE_TAB = new TeleportType(3, new Animation_1.Animation(4071), null, Animation_1.Animation.DEFAULT_RESET_ANIMATION, new Graphic_1.Graphic(678, Priority_1.Priority.HIGH), null, null);
    TeleportType.PURO_PURO = new TeleportType(9, new Animation_1.Animation(6601), null, Animation_1.Animation.DEFAULT_RESET_ANIMATION, new Graphic_1.Graphic(1118, Priority_1.Priority.HIGH), null, null);
    return TeleportType;
}());
//# sourceMappingURL=TeleportType.js.map