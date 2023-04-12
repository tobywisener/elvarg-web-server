import { Skill } from "../../model/Skill";
import { Player } from "../../entity/impl/player/Player";
import { Graphic } from "../../model/Graphic";
import { GameConstants } from "../../GameConstants";
import { PlayerRights } from "../../model/rights/PlayerRights";
import { Flag } from "../../model/Flag";
import { World } from "../../World";
import { WildernessArea } from "../../model/areas/impl/WildernessArea";
import { Runecrafting } from "./skillable/impl/Runecrafting";
import { PrayerData, PrayerHandler } from "../PrayerHandler";
import { Skillable } from "./skillable/Skillable";
import { WeaponInterfaces } from "../combat/WeaponInterfaces";
import { BonusManager } from "../../model/equipment/BonusManager";
import { BountyHunter } from "../combat/bountyhunter/BountyHunter";
import { Woodcutting } from '../../../game/content/skill/skillable/impl/woodcutting/Woodcutting'
import { Mining, Rock } from '../../content/skill/skillable/impl/Mining'
import { GameObject } from "../../entity/impl/object/GameObject";
import { EnteredAmountAction } from "../../model/EnteredAmountAction";


class SkillEntered implements EnteredAmountAction {
    constructor(private readonly execFunc: Function) {
    }
    execute(amount: number): void {
        this.execFunc();
    }

}
export class SkillManager {
    public static readonly AMOUNT_OF_SKILLS: number = Object.keys(Skill).length;
    public static readonly MAX_EXPERIENCE: number = 1000000000;
    public static readonly EXPERIENCE_FOR_99: number = 13034431;
    public static readonly EXP_ARRAY: number[] = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107,
        2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833,
        16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983,
        75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742,
        302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895,
        1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594,
        3597792, 3972294, 4385776, 4842295, 5346332, 5902831, , 7195629, 7944614, 8771558, 9684577, 10692629,
        11805606, 13034431];
    public static readonly LEVEL_UP_GRAPHIC: Graphic = new Graphic(199);

    /**
     * The player associated with this Skills instance.
     */
    private player: Player;
    public skills: Skills;

    public constructor(player: Player) {
        this.player = player;
        this.skills = new Skills();
        for (let i = 0; i < SkillManager.AMOUNT_OF_SKILLS; i++) {
            this.skills.level[i] = this.skills.maxLevel[i] = 1;
            this.skills.experience[i] = 0;
        }
        this.skills.level[Skill.HITPOINTS.getButton()] = this.skills.maxLevel[Skill.HITPOINTS.getButton()] = 10;
        this.skills.experience[Skill.HITPOINTS.getButton()] = 1184;
    }

    static getExperienceForLevel(level: number): number {
        if (level <= 99) {
            return SkillManager.EXP_ARRAY[--level > 98 ? 98 : level];
        } else {
            let points = 0;
            let output = 0;
            for (let lvl = 1; lvl <= level; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                if (lvl >= level) {
                    return output;
                }
                output = Math.floor(points / 4);
            }
        }
        return 0;
    }

    static getLevelForExperience(experience: number): number {
        if (experience <= SkillManager.EXPERIENCE_FOR_99) {
            for (let j = 98; j >= 0; j--) {
                if (SkillManager.EXP_ARRAY[j] <= experience) {
                    return j + 1;
                }
            }
        } else {
            let points = 0, output = 0;
            for (let lvl = 1; lvl <= 99; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                output = Math.floor(points / 4);
                if (output >= experience) {
                    return lvl;
                }
            }
        }
        return 99;
    }

    static getMaxAchievingLevel(skill: Skill): number {
        return 99;
    }

    addExperiences(skill: Skill, experience: number): SkillManager {
        return this.addExperience(skill, experience, true);
    }

    addExperience(skill: Skill, experience: number, multipliers: boolean): SkillManager {
        // Multipliers...
        if (multipliers) {
            if (skill == Skill.ATTACK || skill == Skill.DEFENCE || skill == Skill.STRENGTH || skill == Skill.HITPOINTS
                || skill == Skill.RANGED || skill == Skill.MAGIC) {
                experience *= GameConstants.COMBAT_SKILLS_EXP_MULTIPLIER;
            } else {
                experience *= GameConstants.REGULAR_SKILLS_EXP_MULTIPLIER;
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
        const startingLevel = this.skills.maxLevel[skill.getButton()];

        // Add experience to the selected skill..
        this.skills.experience[skill.getName()] = this.skills.experience[skill.getName()] + experience > SkillManager.MAX_EXPERIENCE
            ? SkillManager.MAX_EXPERIENCE
            : this.skills.experience[skill.getName()] + experience;

        // Get the skill's new level after experience has been added..
        let newLevel = SkillManager.getLevelForExperience(this.skills.experience[skill.getName()]);

        // Handle level up..
        if (newLevel > startingLevel) {
            let level = newLevel - startingLevel;
            let skillName = skill.toString().toLowerCase().charAt(0).toUpperCase() + skill.toString().toLowerCase().slice(1);
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
                World.sendMessage("<shad=15536940>News: " + this.player.getUsername()
                    + " has just achieved the highest possible level in " + skillName + "!");
            }
            this.player.getUpdateFlag().flag(Flag.APPEARANCE);
        }
        this.updateSkill(skill);
        return this;
    }

    pressedSkill(button: number): boolean {
        let skill = Skill.forButton(button);
        if (skill != null) {
            if (!skill.canSetLevel()) {
                if (this.player.getRights() != PlayerRights.ADMINISTRATOR && this.player.getRights() != PlayerRights.DEVELOPER
                    && this.player.getRights() != PlayerRights.OWNER) {
                    this.player.getPacketSender().sendMessage("You can currently not set that level.");
                    return true;
                }
            }
            this.player.getPacketSender().sendInterfaceRemoval();
            this.player.setEnteredAmountAction(new SkillEntered((amount: number) => {
                let max = 99;
                if (this.player.getRights() == PlayerRights.OWNER
                    || this.player.getRights() == PlayerRights.DEVELOPER) {
                    max = 9999;
                }
                if (amount <= 0 || amount > max) {
                    this.player.getPacketSender().sendMessage("Invalid syntax. Please enter a level in the range of 1-99.");
                    return;
                }
                this.player.getSkillManager().setLevel(skill, amount);
            }));
            this.player.getPacketSender()
                .sendEnterAmountPrompt("Please enter your desired " + skill.getName() + " level below.");

            return true;
        }
        return false;
    }

    setLevel(skill: Skill, level: number) {

        // Make sure they aren't in wild
        if (this.player.getArea() instanceof WildernessArea) {
            if (this.player.getRights() != PlayerRights.ADMINISTRATOR && this.player.getRights() != PlayerRights.DEVELOPER
                && this.player.getRights() != PlayerRights.OWNER) {
                this.player.getPacketSender().sendMessage("You cannot do this in the Wilderness!");
                return;
            }
        }

        // make sure they aren't wearing any items which arent allowed to be worn at
        // that level.
        if (this.player.getRights() != PlayerRights.DEVELOPER) {
            for (let item of this.player.getEquipment().getItems()) {
                if (item == null) {
                    continue;
                }
                if (item.getDefinition().getRequirements() != null) {
                    if (item.getDefinition().getRequirements()[skill.getButton()] > level) {
                        this.player.getPacketSender().sendMessage(
                            "Please unequip your " + item.getDefinition().getName() + " before doing that.");
                        return;
                    }
                }
            }
        }

        if (skill == Skill.HITPOINTS) {
            if (level < 10) {
                this.player.getPacketSender().sendMessage("Hitpoints must be set to at least level 10.");
                return;
            }
        }

        // Set skill level
        this.player.getSkillManager().setCurrentLevel(skill, level, false).setMaxLevels(skill, level, false)
            .setExperience(skill, SkillManager.getExperienceForLevel(level));
        this.updateSkill(skill);

        if (skill == Skill.PRAYER) {
            this.player.getPacketSender().sendConfig(709, PrayerHandler.canUse(this.player, PrayerData.PRESERVE, false) ? 1 : 0);
            this.player.getPacketSender().sendConfig(711, PrayerHandler.canUse(this.player, PrayerData.RIGOUR, false) ? 1 : 0);
            this.player.getPacketSender().sendConfig(713, PrayerHandler.canUse(this.player, PrayerData.AUGURY, false) ? 1 : 0);
        }

        // Update weapon tab to send combat level etc.
        this.player.setHasVengeance(false);
        BonusManager.update(this.player);
        WeaponInterfaces.assign(this.player);
        PrayerHandler.deactivatePrayers(this.player);
        BountyHunter.unassign(this.player);
        this.player.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    public updateSkill(skill: Skill) {
        const maxLevel = this.getMaxLevel(skill);
        const currentLevel = this.getMaxLevel(skill);

        // Update prayer tab if it's the prayer skill.
        if (skill === Skill.PRAYER) {
            this.player.getPacketSender().sendString(currentLevel + "/" + maxLevel, 687);
        }

        // Send total level
        this.player.getPacketSender().sendString("" + this.getTotalLevel(), 31200);

        this.player.getPacketSender().sendString("" + this.getTotalLevel(), 31200);


        // Send combat level
        const combatLevel = "Combat level: " + this.getCombatLevel();
        this.player.getPacketSender().sendString(combatLevel, 19000).sendString(combatLevel, 5858);

        // Send the skill
        this.player.getPacketSender().sendSkill(skill);

        return this;
    }

    /**
     * Calculates the player's combat level.
     *
     * @return The average of the player's combat skills.
     */
    public getCombatLevel(): number {
        const attack = this.skills.maxLevel[Skill.ATTACK.getButton()];
        const defence = this.skills.maxLevel[Skill.DEFENCE.getButton()];
        const strength = this.skills.maxLevel[Skill.STRENGTH.getButton()];
        const hp = this.skills.maxLevel[Skill.HITPOINTS.getButton()];
        const prayer = this.skills.maxLevel[Skill.PRAYER.getButton()];
        const ranged = this.skills.maxLevel[Skill.RANGED.getButton()];
        const magic = this.skills.maxLevel[Skill.MAGIC.getButton()];
        let combatLevel = 3;
        combatLevel = (defence + hp + Math.floor(prayer / 2)) * 0.2535 + 1;
        const melee = (attack + strength) * 0.325;
        const ranger = Math.floor(ranged * 1.5) * 0.325;
        const mage = Math.floor(magic * 1.5) * 0.325;
        if (melee >= ranger && melee >= mage) {
            combatLevel += melee;
        } else if (ranger >= melee && ranger >= mage) {
            combatLevel += ranger;
        } else if (mage >= melee && mage >= ranger) {
            combatLevel += mage;
        }
        if (combatLevel > 126) {
            return 126;
        }
        if (combatLevel < 3) {
            return 3;
        }
        return combatLevel;
    }

    public getTotalLevel(): number {
        let total = 0;
        for (const skill of Object.values(Skill)) {
            total += this.skills.maxLevel[skill];
        }
        return total;
    }

    /**
     * Gets the player's total experience.
     *
     * @return The experience value from the player's every skill summed up.
     */
    public getTotalExp(): number {
        let xp = 0;
        for (const skill of Object.values(Skill)) {
            xp += this.player.getSkillManager().getExperience(skill);
        }
        return xp;
    }

    /**
     * Gets the current level for said skill.
     *
     * @param skill The skill to get current/temporary level for.
     * @return The skill's level.
     */
    public getCurrentLevel(skill: Skill): number {
        return this.skills.level[skill.getButton()];
    }

    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    public getMaxLevel(skill: Skill): number {
        return this.skills.maxLevel[skill.getButton()];
    }

    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    public getMaxLevels(skill: number): number {
        return this.skills.maxLevel[skill];
    }

    /**
     * Gets the experience for said skill.
     *
     * @param skill The skill to get experience for.
     * @return The experience in said skill.
     */
    public getExperience(skill: Skill): number {
        return this.skills.experience[skill.getButton()];
    }

    /**
     * Sets the current level of said skill.
     *
     * @param skill The skill to set current/temporary level for.
     * @param level The level to set the skill to.
     * @param refresh If true, the skill's strings will be updated.
     * @return The Skills instance.
     */
    public setCurrentLevel(skill: Skill, level: number, refresh: boolean): SkillManager {
        this.skills.level[skill.getButton()] = level < 0 ? 0 : level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }


    setMaxLevels(skill: Skill, level: number, refresh = true) {
        this.skills.maxLevel[skill.getButton()] = level;

        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setExperiences(skill: Skill, experience: number, refresh = true) {
        this.skills.experience[skill.getButton()] = experience < 0 ? 0 : experience;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setCurrentLevels(skill: Skill, level: number, refresh = true) {
        this.skills.maxLevel[skill.getButton()] = level;

        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    public setCurrentLevelCombat(skill: Skill, level: number) {
        this.setCurrentLevel(skill, level, true);
        return this;
    }

    setMaxLevel(skill: Skill, level: number) {
        return this.setMaxLevels(skill, level, true);
    }

    setExperience(skill: Skill, experience: number) {
        return this.setExperiences(skill, experience, true);
    }

    increaseCurrentLevelMax(skill: Skill, amount: number) {
        return this.increaseCurrentLevel(skill, amount, this.getMaxLevel(skill) + amount);
    }

    increaseCurrentLevel(skill: Skill, amount: number, max: number) {
        const curr = this.getCurrentLevel(skill);
        if ((curr + amount) > max) {
            this.setCurrentLevels(skill, max);
            return;
        }
        this.setCurrentLevels(skill, curr + amount);
    }

    public decreaseCurrentLevel(skill: Skill, amount: number, minimum: number) {
        let curr: number = this.getCurrentLevel(skill);
        if ((curr - amount) < minimum) {
            this.setCurrentLevels(skill, minimum);
            return;
        }
        this.setCurrentLevels(skill, curr - amount);
    }

    decreaseLevelMax(skill: Skill, amount: number) {
        return this.decreaseCurrentLevel(skill, amount, this.getMaxLevel(skill) - amount);
    }

    isBoosted(skill: Skill) {
        return this.getCurrentLevel(skill) > this.getMaxLevel(skill);
    }

    startSkillables(object: GameObject): boolean {
        // Check mining..
        let rock: Rock
        rock.forObjectId(object.getId());
        if (rock) {
            this.startSkillable(new Mining(object, rock));
            return true;
        }

        // Check runecrafting
        if (Runecrafting.initialize(this.player, object.getId())) {
            return true;
        }

        return false;
    }

    startSkillable(skill: Skillable) {
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
    }

    stopSkillable() {
        if (this.player.getSkill()) {
            this.player.getSkill().cancel(this.player);
        }
        this.player.setSkill(null);
        this.player.setCreationMenu(null);
    }

    getSkills() {
        return this.skills;
    }

    setSkills(skills: Skills) {
        this.skills = skills;
    }
}

export class Skills {
    public level: number[];
    public maxLevel: number[];
    public experience: number[];
    constructor() {
        this.level = new Array(SkillManager.AMOUNT_OF_SKILLS);
        this.maxLevel = new Array(SkillManager.AMOUNT_OF_SKILLS);
        this.experience = new Array(SkillManager.AMOUNT_OF_SKILLS);
    }

    getLevels() {
        return this.level;
    }

    setLevels(levels: number[]) {
        this.level = levels;
    }

    getMaxLevels() {
        return this.maxLevel;
    }

    setMaxLevels(maxLevels: number[]) {
        this.maxLevel = maxLevels;
    }

    getExperiences() {
        return this.experience;
    }

    setExperiences(experiences: number[]) {
        this.experience = experiences;
    }
}
