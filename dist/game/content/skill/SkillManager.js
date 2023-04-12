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
exports.Skills = exports.SkillManager = void 0;
var Skill_1 = require("../../model/Skill");
var Graphic_1 = require("../../model/Graphic");
var GameConstants_1 = require("../../GameConstants");
var PlayerRights_1 = require("../../model/rights/PlayerRights");
var Flag_1 = require("../../model/Flag");
var World_1 = require("../../World");
var WildernessArea_1 = require("../../model/areas/impl/WildernessArea");
var Runecrafting_1 = require("./skillable/impl/Runecrafting");
var PrayerHandler_1 = require("../PrayerHandler");
var WeaponInterfaces_1 = require("../combat/WeaponInterfaces");
var BonusManager_1 = require("../../model/equipment/BonusManager");
var BountyHunter_1 = require("../combat/bountyhunter/BountyHunter");
var Mining_1 = require("../../content/skill/skillable/impl/Mining");
var SkillEntered = /** @class */ (function () {
    function SkillEntered(execFunc) {
        this.execFunc = execFunc;
    }
    SkillEntered.prototype.execute = function (amount) {
        this.execFunc();
    };
    return SkillEntered;
}());
var SkillManager = exports.SkillManager = /** @class */ (function () {
    function SkillManager(player) {
        this.player = player;
        this.skills = new Skills();
        for (var i = 0; i < SkillManager.AMOUNT_OF_SKILLS; i++) {
            this.skills.level[i] = this.skills.maxLevel[i] = 1;
            this.skills.experience[i] = 0;
        }
        this.skills.level[Skill_1.Skill.HITPOINTS.getButton()] = this.skills.maxLevel[Skill_1.Skill.HITPOINTS.getButton()] = 10;
        this.skills.experience[Skill_1.Skill.HITPOINTS.getButton()] = 1184;
    }
    SkillManager.getExperienceForLevel = function (level) {
        if (level <= 99) {
            return SkillManager.EXP_ARRAY[--level > 98 ? 98 : level];
        }
        else {
            var points = 0;
            var output = 0;
            for (var lvl = 1; lvl <= level; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                if (lvl >= level) {
                    return output;
                }
                output = Math.floor(points / 4);
            }
        }
        return 0;
    };
    SkillManager.getLevelForExperience = function (experience) {
        if (experience <= SkillManager.EXPERIENCE_FOR_99) {
            for (var j = 98; j >= 0; j--) {
                if (SkillManager.EXP_ARRAY[j] <= experience) {
                    return j + 1;
                }
            }
        }
        else {
            var points = 0, output = 0;
            for (var lvl = 1; lvl <= 99; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                output = Math.floor(points / 4);
                if (output >= experience) {
                    return lvl;
                }
            }
        }
        return 99;
    };
    SkillManager.getMaxAchievingLevel = function (skill) {
        return 99;
    };
    SkillManager.prototype.addExperiences = function (skill, experience) {
        return this.addExperience(skill, experience, true);
    };
    SkillManager.prototype.addExperience = function (skill, experience, multipliers) {
        // Multipliers...
        if (multipliers) {
            if (skill == Skill_1.Skill.ATTACK || skill == Skill_1.Skill.DEFENCE || skill == Skill_1.Skill.STRENGTH || skill == Skill_1.Skill.HITPOINTS
                || skill == Skill_1.Skill.RANGED || skill == Skill_1.Skill.MAGIC) {
                experience *= GameConstants_1.GameConstants.COMBAT_SKILLS_EXP_MULTIPLIER;
            }
            else {
                experience *= GameConstants_1.GameConstants.REGULAR_SKILLS_EXP_MULTIPLIER;
            }
        }
        // Send exp drop..
        this.player.getPacketSender().sendExpDrop(skill, experience);
        // Don't add the experience if it has been locked..
        if (this.player.experienceLockedReturn())
            return this;
        // If we already have max exp, don't add any more.
        if (this.skills.experience[skill.getButton()] >= SkillManager.MAX_EXPERIENCE)
            return this;
        // The skill's level before any experience is added
        var startingLevel = this.skills.maxLevel[skill.getButton()];
        // Add experience to the selected skill..
        this.skills.experience[skill.getName()] = this.skills.experience[skill.getName()] + experience > SkillManager.MAX_EXPERIENCE
            ? SkillManager.MAX_EXPERIENCE
            : this.skills.experience[skill.getName()] + experience;
        // Get the skill's new level after experience has been added..
        var newLevel = SkillManager.getLevelForExperience(this.skills.experience[skill.getName()]);
        // Handle level up..
        if (newLevel > startingLevel) {
            var level = newLevel - startingLevel;
            var skillName = skill.toString().toLowerCase().charAt(0).toUpperCase() + skill.toString().toLowerCase().slice(1);
            this.skills.maxLevel[skill.getButton()] += level;
            this.stopSkillable(); // Stop skilling on level up like osrs
            this.setCurrentLevels(skill, this.skills.maxLevel[skill.getButton()]);
            this.player.getPacketSender().sendInterfaceRemoval();
            this.player.getPacketSender().sendString("Congratulations! You have achieved a " + skillName + " level!", 4268);
            this.player.getPacketSender().sendString("Well done. You are now level " + newLevel + ".", 4269);
            this.player.getPacketSender().sendString("Click here to continue.", 358);
            this.player.getPacketSender().sendChatboxInterface(skill.getChatboxInterface());
            this.player.performGraphic(SkillManager.LEVEL_UP_GRAPHIC);
            this.player.getPacketSender().sendMessage("You've just advanced " + skillName + " level! You have reached level " + newLevel);
            if (this.skills.maxLevel[skill.getButton()] == SkillManager.getMaxAchievingLevel(skill)) {
                this.player.getPacketSender().sendMessage("Well done! You've achieved the highest possible level in this skill!");
                World_1.World.sendMessage("<shad=15536940>News: " + this.player.getUsername()
                    + " has just achieved the highest possible level in " + skillName + "!");
            }
            this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        }
        this.updateSkill(skill);
        return this;
    };
    SkillManager.prototype.pressedSkill = function (button) {
        var _this = this;
        var skill = Skill_1.Skill.forButton(button);
        if (skill != null) {
            if (!skill.canSetLevel()) {
                if (this.player.getRights() != PlayerRights_1.PlayerRights.ADMINISTRATOR && this.player.getRights() != PlayerRights_1.PlayerRights.DEVELOPER
                    && this.player.getRights() != PlayerRights_1.PlayerRights.OWNER) {
                    this.player.getPacketSender().sendMessage("You can currently not set that level.");
                    return true;
                }
            }
            this.player.getPacketSender().sendInterfaceRemoval();
            this.player.setEnteredAmountAction(new SkillEntered(function (amount) {
                var max = 99;
                if (_this.player.getRights() == PlayerRights_1.PlayerRights.OWNER
                    || _this.player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
                    max = 9999;
                }
                if (amount <= 0 || amount > max) {
                    _this.player.getPacketSender().sendMessage("Invalid syntax. Please enter a level in the range of 1-99.");
                    return;
                }
                _this.player.getSkillManager().setLevel(skill, amount);
            }));
            this.player.getPacketSender()
                .sendEnterAmountPrompt("Please enter your desired " + skill.getName() + " level below.");
            return true;
        }
        return false;
    };
    SkillManager.prototype.setLevel = function (skill, level) {
        var e_1, _a;
        // Make sure they aren't in wild
        if (this.player.getArea() instanceof WildernessArea_1.WildernessArea) {
            if (this.player.getRights() != PlayerRights_1.PlayerRights.ADMINISTRATOR && this.player.getRights() != PlayerRights_1.PlayerRights.DEVELOPER
                && this.player.getRights() != PlayerRights_1.PlayerRights.OWNER) {
                this.player.getPacketSender().sendMessage("You cannot do this in the Wilderness!");
                return;
            }
        }
        // make sure they aren't wearing any items which arent allowed to be worn at
        // that level.
        if (this.player.getRights() != PlayerRights_1.PlayerRights.DEVELOPER) {
            try {
                for (var _b = __values(this.player.getEquipment().getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (item == null) {
                        continue;
                    }
                    if (item.getDefinition().getRequirements() != null) {
                        if (item.getDefinition().getRequirements()[skill.getButton()] > level) {
                            this.player.getPacketSender().sendMessage("Please unequip your " + item.getDefinition().getName() + " before doing that.");
                            return;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (skill == Skill_1.Skill.HITPOINTS) {
            if (level < 10) {
                this.player.getPacketSender().sendMessage("Hitpoints must be set to at least level 10.");
                return;
            }
        }
        // Set skill level
        this.player.getSkillManager().setCurrentLevel(skill, level, false).setMaxLevels(skill, level, false)
            .setExperience(skill, SkillManager.getExperienceForLevel(level));
        this.updateSkill(skill);
        if (skill == Skill_1.Skill.PRAYER) {
            this.player.getPacketSender().sendConfig(709, PrayerHandler_1.PrayerHandler.canUse(this.player, PrayerHandler_1.PrayerData.PRESERVE, false) ? 1 : 0);
            this.player.getPacketSender().sendConfig(711, PrayerHandler_1.PrayerHandler.canUse(this.player, PrayerHandler_1.PrayerData.RIGOUR, false) ? 1 : 0);
            this.player.getPacketSender().sendConfig(713, PrayerHandler_1.PrayerHandler.canUse(this.player, PrayerHandler_1.PrayerData.AUGURY, false) ? 1 : 0);
        }
        // Update weapon tab to send combat level etc.
        this.player.setHasVengeance(false);
        BonusManager_1.BonusManager.update(this.player);
        WeaponInterfaces_1.WeaponInterfaces.assign(this.player);
        PrayerHandler_1.PrayerHandler.deactivatePrayers(this.player);
        BountyHunter_1.BountyHunter.unassign(this.player);
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    SkillManager.prototype.updateSkill = function (skill) {
        var maxLevel = this.getMaxLevel(skill);
        var currentLevel = this.getMaxLevel(skill);
        // Update prayer tab if it's the prayer skill.
        if (skill === Skill_1.Skill.PRAYER) {
            this.player.getPacketSender().sendString(currentLevel + "/" + maxLevel, 687);
        }
        // Send total level
        this.player.getPacketSender().sendString("" + this.getTotalLevel(), 31200);
        this.player.getPacketSender().sendString("" + this.getTotalLevel(), 31200);
        // Send combat level
        var combatLevel = "Combat level: " + this.getCombatLevel();
        this.player.getPacketSender().sendString(combatLevel, 19000).sendString(combatLevel, 5858);
        // Send the skill
        this.player.getPacketSender().sendSkill(skill);
        return this;
    };
    /**
     * Calculates the player's combat level.
     *
     * @return The average of the player's combat skills.
     */
    SkillManager.prototype.getCombatLevel = function () {
        var attack = this.skills.maxLevel[Skill_1.Skill.ATTACK.getButton()];
        var defence = this.skills.maxLevel[Skill_1.Skill.DEFENCE.getButton()];
        var strength = this.skills.maxLevel[Skill_1.Skill.STRENGTH.getButton()];
        var hp = this.skills.maxLevel[Skill_1.Skill.HITPOINTS.getButton()];
        var prayer = this.skills.maxLevel[Skill_1.Skill.PRAYER.getButton()];
        var ranged = this.skills.maxLevel[Skill_1.Skill.RANGED.getButton()];
        var magic = this.skills.maxLevel[Skill_1.Skill.MAGIC.getButton()];
        var combatLevel = 3;
        combatLevel = (defence + hp + Math.floor(prayer / 2)) * 0.2535 + 1;
        var melee = (attack + strength) * 0.325;
        var ranger = Math.floor(ranged * 1.5) * 0.325;
        var mage = Math.floor(magic * 1.5) * 0.325;
        if (melee >= ranger && melee >= mage) {
            combatLevel += melee;
        }
        else if (ranger >= melee && ranger >= mage) {
            combatLevel += ranger;
        }
        else if (mage >= melee && mage >= ranger) {
            combatLevel += mage;
        }
        if (combatLevel > 126) {
            return 126;
        }
        if (combatLevel < 3) {
            return 3;
        }
        return combatLevel;
    };
    SkillManager.prototype.getTotalLevel = function () {
        var e_2, _a;
        var total = 0;
        try {
            for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                total += this.skills.maxLevel[skill];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return total;
    };
    /**
     * Gets the player's total experience.
     *
     * @return The experience value from the player's every skill summed up.
     */
    SkillManager.prototype.getTotalExp = function () {
        var e_3, _a;
        var xp = 0;
        try {
            for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                xp += this.player.getSkillManager().getExperience(skill);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return xp;
    };
    /**
     * Gets the current level for said skill.
     *
     * @param skill The skill to get current/temporary level for.
     * @return The skill's level.
     */
    SkillManager.prototype.getCurrentLevel = function (skill) {
        return this.skills.level[skill.getButton()];
    };
    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    SkillManager.prototype.getMaxLevel = function (skill) {
        return this.skills.maxLevel[skill.getButton()];
    };
    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    SkillManager.prototype.getMaxLevels = function (skill) {
        return this.skills.maxLevel[skill];
    };
    /**
     * Gets the experience for said skill.
     *
     * @param skill The skill to get experience for.
     * @return The experience in said skill.
     */
    SkillManager.prototype.getExperience = function (skill) {
        return this.skills.experience[skill.getButton()];
    };
    /**
     * Sets the current level of said skill.
     *
     * @param skill The skill to set current/temporary level for.
     * @param level The level to set the skill to.
     * @param refresh If true, the skill's strings will be updated.
     * @return The Skills instance.
     */
    SkillManager.prototype.setCurrentLevel = function (skill, level, refresh) {
        this.skills.level[skill.getButton()] = level < 0 ? 0 : level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    };
    SkillManager.prototype.setMaxLevels = function (skill, level, refresh) {
        if (refresh === void 0) { refresh = true; }
        this.skills.maxLevel[skill.getButton()] = level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    };
    SkillManager.prototype.setExperiences = function (skill, experience, refresh) {
        if (refresh === void 0) { refresh = true; }
        this.skills.experience[skill.getButton()] = experience < 0 ? 0 : experience;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    };
    SkillManager.prototype.setCurrentLevels = function (skill, level, refresh) {
        if (refresh === void 0) { refresh = true; }
        this.skills.maxLevel[skill.getButton()] = level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    };
    SkillManager.prototype.setCurrentLevelCombat = function (skill, level) {
        this.setCurrentLevel(skill, level, true);
        return this;
    };
    SkillManager.prototype.setMaxLevel = function (skill, level) {
        return this.setMaxLevels(skill, level, true);
    };
    SkillManager.prototype.setExperience = function (skill, experience) {
        return this.setExperiences(skill, experience, true);
    };
    SkillManager.prototype.increaseCurrentLevelMax = function (skill, amount) {
        return this.increaseCurrentLevel(skill, amount, this.getMaxLevel(skill) + amount);
    };
    SkillManager.prototype.increaseCurrentLevel = function (skill, amount, max) {
        var curr = this.getCurrentLevel(skill);
        if ((curr + amount) > max) {
            this.setCurrentLevels(skill, max);
            return;
        }
        this.setCurrentLevels(skill, curr + amount);
    };
    SkillManager.prototype.decreaseCurrentLevel = function (skill, amount, minimum) {
        var curr = this.getCurrentLevel(skill);
        if ((curr - amount) < minimum) {
            this.setCurrentLevels(skill, minimum);
            return;
        }
        this.setCurrentLevels(skill, curr - amount);
    };
    SkillManager.prototype.decreaseLevelMax = function (skill, amount) {
        return this.decreaseCurrentLevel(skill, amount, this.getMaxLevel(skill) - amount);
    };
    SkillManager.prototype.isBoosted = function (skill) {
        return this.getCurrentLevel(skill) > this.getMaxLevel(skill);
    };
    SkillManager.prototype.startSkillables = function (object) {
        // Check mining..
        var rock;
        rock.forObjectId(object.getId());
        if (rock) {
            this.startSkillable(new Mining_1.Mining(object, rock));
            return true;
        }
        // Check runecrafting
        if (Runecrafting_1.Runecrafting.initialize(this.player, object.getId())) {
            return true;
        }
        return false;
    };
    SkillManager.prototype.startSkillable = function (skill) {
        // Stop previous skills..
        this.stopSkillable();
        // Close interfaces..
        this.player.getPacketSender().sendInterfaceRemoval();
        // Check if we have the requirements to start this skill..
        if (!skill.hasRequirements(this.player)) {
            return;
        }
        // Start the skill..
        this.player.setSkill(skill);
        skill.start(this.player);
    };
    SkillManager.prototype.stopSkillable = function () {
        if (this.player.getSkill()) {
            this.player.getSkill().cancel(this.player);
        }
        this.player.setSkill(null);
        this.player.setCreationMenu(null);
    };
    SkillManager.prototype.getSkills = function () {
        return this.skills;
    };
    SkillManager.prototype.setSkills = function (skills) {
        this.skills = skills;
    };
    SkillManager.AMOUNT_OF_SKILLS = Object.keys(Skill_1.Skill).length;
    SkillManager.MAX_EXPERIENCE = 1000000000;
    SkillManager.EXPERIENCE_FOR_99 = 13034431;
    SkillManager.EXP_ARRAY = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107,
        2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833,
        16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983,
        75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742,
        302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895,
        1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594,
        3597792, 3972294, 4385776, 4842295, 5346332, 5902831, , 7195629, 7944614, 8771558, 9684577, 10692629,
        11805606, 13034431];
    SkillManager.LEVEL_UP_GRAPHIC = new Graphic_1.Graphic(199);
    return SkillManager;
}());
var Skills = /** @class */ (function () {
    function Skills() {
        this.level = new Array(SkillManager.AMOUNT_OF_SKILLS);
        this.maxLevel = new Array(SkillManager.AMOUNT_OF_SKILLS);
        this.experience = new Array(SkillManager.AMOUNT_OF_SKILLS);
    }
    Skills.prototype.getLevels = function () {
        return this.level;
    };
    Skills.prototype.setLevels = function (levels) {
        this.level = levels;
    };
    Skills.prototype.getMaxLevels = function () {
        return this.maxLevel;
    };
    Skills.prototype.setMaxLevels = function (maxLevels) {
        this.maxLevel = maxLevels;
    };
    Skills.prototype.getExperiences = function () {
        return this.experience;
    };
    Skills.prototype.setExperiences = function (experiences) {
        this.experience = experiences;
    };
    return Skills;
}());
exports.Skills = Skills;
//# sourceMappingURL=SkillManager.js.map