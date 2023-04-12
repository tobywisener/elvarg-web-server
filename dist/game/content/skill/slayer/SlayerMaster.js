"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlayerMaster = void 0;
var SlayerMaster = exports.SlayerMaster = /** @class */ (function () {
    function SlayerMaster(combatLevel, basePoints, consecutiveTaskPoints) {
        this.combatLevel = combatLevel;
        this.basePoints = basePoints;
        this.consecutiveTaskPoints = consecutiveTaskPoints;
    }
    SlayerMaster.prototype.getCombatLevel = function () {
        return this.combatLevel;
    };
    SlayerMaster.prototype.getBasePoints = function () {
        return this.basePoints;
    };
    SlayerMaster.prototype.getConsecutiveTaskPoints = function () {
        return this.consecutiveTaskPoints;
    };
    SlayerMaster.prototype.canAssign = function (player) {
        if (player.getSkillManager().getCombatLevel() < this.combatLevel) {
            return false;
        }
    };
    SlayerMaster.TURAEL = new SlayerMaster(3, 1, [[10, 3], [50, 10], [100, 25], [250, 50], [1000, 75]]);
    SlayerMaster.MAZCHNA = new SlayerMaster(20, 2, [[10, 5], [50, 15], [100, 50], [250, 70], [1000, 100]]);
    SlayerMaster.VANNAKA = new SlayerMaster(40, 4, [[10, 20], [50, 60], [100, 100], [250, 140], [1000, 200]]);
    SlayerMaster.CHAELDAR = new SlayerMaster(70, 10, [[10, 50], [50, 150], [100, 250], [250, 350], [1000, 500]]);
    SlayerMaster.NIEVE = new SlayerMaster(85, 12, [[10, 60], [50, 180], [100, 300], [250, 420], [1000, 600]]);
    SlayerMaster.DURADEL = new SlayerMaster(100, 15, [[10, 75], [50, 225], [100, 375], [250, 525], [1000, 750]]);
    return SlayerMaster;
}());
//# sourceMappingURL=SlayerMaster.js.map