import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../../model/rights/PlayerRights';
import { SkillManager } from '../../../content/skill/SkillManager'
import { WeaponInterfaces } from '../../../content/combat/WeaponInterfaces'
import { Flag } from '../../Flag';
import { Skill } from '../../Skill';


export class MasterCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        for (let skillName in Skill) {
            let skill: Skill = Skill[skillName];
            let level = SkillManager.getMaxAchievingLevel(skill);
            player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill,
                SkillManager.getExperienceForLevel(level));
        }
        WeaponInterfaces.assign(player);
        player.getUpdateFlag().flag(Flag.APPEARANCE);
    }
    
    canUse(player: Player) {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}