"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chance = void 0;
var Misc_1 = require("./Misc");
var Chance = exports.Chance = /** @class */ (function () {
    function Chance(percentage) {
        this.percentage = percentage;
    }
    Chance.prototype.success = function () {
        return (Misc_1.Misc.getRandom(100)) <= this.percentage;
    };
    Chance.prototype.getPercentage = function () {
        return this.percentage;
    };
    Chance.ALWAYS = new Chance(100);
    Chance.VERY_COMMON = new Chance(90);
    Chance.COMMON = new Chance(75);
    Chance.SOMETIMES = new Chance(50);
    Chance.UNCOMMON = new Chance(35);
    Chance.VERY_UNCOMMON = new Chance(10);
    Chance.EXTREMELY_RARE = new Chance(5);
    Chance.ALMOST_IMPOSSIBLE = new Chance(1);
    return Chance;
}());
//# sourceMappingURL=Chance.js.map