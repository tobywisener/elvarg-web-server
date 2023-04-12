"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbyssalWhipCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatSpecial_1 = require("../../../CombatSpecial");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var AbyssalWhipCombatMethod = exports.AbyssalWhipCombatMethod = /** @class */ (function (_super) {
    __extends(AbyssalWhipCombatMethod, _super);
    function AbyssalWhipCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbyssalWhipCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ABYSSAL_WHIP.getDrainAmount());
        character.performAnimation(AbyssalWhipCombatMethod.ANIMATION);
    };
    AbyssalWhipCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        var target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(AbyssalWhipCombatMethod.GRAPHIC);
        if (target.isPlayer()) {
            var player = target;
            var totalRunEnergy = player.getRunEnergy() - 25;
            if (totalRunEnergy < 0) {
                totalRunEnergy = 0;
            }
            player.setRunEnergy(totalRunEnergy);
            player.getPacketSender().sendRunEnergy();
            if (totalRunEnergy === 0) {
                player.setRunning(false);
                player.getPacketSender().sendRunStatus();
            }
        }
    };
    AbyssalWhipCombatMethod.ANIMATION = new Animation_1.Animation(1658);
    AbyssalWhipCombatMethod.GRAPHIC = new Graphic_1.Graphic(341, GraphicHeight_1.GraphicHeight.HIGH);
    return AbyssalWhipCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=AbyssalWhipCombatMethod.js.map