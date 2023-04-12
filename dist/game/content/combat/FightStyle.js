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
exports.FightStyle = void 0;
var CombatType_1 = require("./CombatType");
var Skill_1 = require("../../model/Skill");
var FightStyle = exports.FightStyle = /** @class */ (function () {
    function FightStyle() {
    }
    FightStyle.ACCURATE = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.skill = function (type) {
            return type === CombatType_1.CombatType.RANGED ? [Skill_1.Skill.RANGED] : [Skill_1.Skill.ATTACK];
        };
        return class_1;
    }(FightStyle));
    FightStyle.AGGRESSIVE = new /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_2.prototype.skill = function (type) {
            return type === CombatType_1.CombatType.RANGED ? [Skill_1.Skill.RANGED] : [Skill_1.Skill.STRENGTH];
        };
        return class_2;
    }(FightStyle));
    FightStyle.DEFENSIVE = new /** @class */ (function (_super) {
        __extends(class_3, _super);
        function class_3() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_3.prototype.skill = function (type) {
            return type === CombatType_1.CombatType.RANGED ? [Skill_1.Skill.RANGED, Skill_1.Skill.DEFENCE] : [Skill_1.Skill.DEFENCE];
        };
        return class_3;
    }(FightStyle));
    FightStyle.CONTROLLED = new /** @class */ (function (_super) {
        __extends(class_4, _super);
        function class_4() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_4.prototype.skill = function () {
            return [Skill_1.Skill.ATTACK, Skill_1.Skill.STRENGTH, Skill_1.Skill.DEFENCE];
        };
        return class_4;
    }(FightStyle));
    return FightStyle;
}());
//# sourceMappingURL=FightStyle.js.map