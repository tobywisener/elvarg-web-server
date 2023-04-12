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
exports.RestoreSpecialAttackTask = void 0;
var Task_1 = require("../Task");
var CombatSpecial_1 = require("../../content/combat/CombatSpecial");
var RestoreSpecialAttackTask = /** @class */ (function (_super) {
    __extends(RestoreSpecialAttackTask, _super);
    function RestoreSpecialAttackTask(character) {
        var _this = _super.call(this, 50) || this;
        _this.character = character;
        _this.character = character;
        character.setRecoveringSpecialAttack(true);
        return _this;
    }
    RestoreSpecialAttackTask.prototype.execute = function () {
        if (this.character == null || !this.character.isRegistered() || this.character.getSpecialPercentage() >= 100 || !this.character.isRecoveringSpecialAttack()) {
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
            return;
        }
        var amount = this.character.getSpecialPercentage() + 10;
        if (amount >= 100) {
            amount = 100;
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
        }
        this.character.setSpecialPercentage(amount);
        if (this.character.isPlayer()) {
            var player = this.character.getAsPlayer();
            CombatSpecial_1.CombatSpecial.updateBar(player);
        }
    };
    return RestoreSpecialAttackTask;
}(Task_1.Task));
exports.RestoreSpecialAttackTask = RestoreSpecialAttackTask;
//# sourceMappingURL=RestoreSpecialAttackTask.js.map