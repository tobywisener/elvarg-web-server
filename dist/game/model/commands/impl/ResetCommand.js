"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Skill_1 = require("../../Skill");
var SkillManager_1 = require("../../../content/skill/SkillManager");
var WeaponInterfaces_1 = require("../../../content/combat/WeaponInterfaces");
var ResetCommand = /** @class */ (function () {
    function ResetCommand() {
    }
    ResetCommand.prototype.execute = function (player, command, parts) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                var level = skill === Skill_1.Skill.HITPOINTS ? 10 : 1;
                player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill, SkillManager_1.SkillManager.getExperienceForLevel(level));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        WeaponInterfaces_1.WeaponInterfaces.assign(player);
    };
    ResetCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights === PlayerRights_1.PlayerRights.OWNER || rights === PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ResetCommand;
}());
exports.ResetCommand = ResetCommand;
//# sourceMappingURL=ResetCommand.js.map