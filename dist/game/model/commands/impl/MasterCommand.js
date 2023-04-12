"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var SkillManager_1 = require("../../../content/skill/SkillManager");
var WeaponInterfaces_1 = require("../../../content/combat/WeaponInterfaces");
var Flag_1 = require("../../Flag");
var Skill_1 = require("../../Skill");
var MasterCommand = /** @class */ (function () {
    function MasterCommand() {
    }
    MasterCommand.prototype.execute = function (player, command, parts) {
        for (var skillName in Skill_1.Skill) {
            var skill = Skill_1.Skill[skillName];
            var level = SkillManager_1.SkillManager.getMaxAchievingLevel(skill);
            player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill, SkillManager_1.SkillManager.getExperienceForLevel(level));
        }
        WeaponInterfaces_1.WeaponInterfaces.assign(player);
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    MasterCommand.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return MasterCommand;
}());
exports.MasterCommand = MasterCommand;
//# sourceMappingURL=MasterCommand.js.map