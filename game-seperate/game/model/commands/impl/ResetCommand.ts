import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { Skill } from '../../Skill';
import { SkillManager } from '../../../content/skill/SkillManager';
import { WeaponInterfaces } from '../../../content/combat/WeaponInterfaces';

export class ResetCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        for (const skill of Object.values(Skill)) {
            const level = skill === Skill.HITPOINTS ? 10 : 1;
            player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill,
            SkillManager.getExperienceForLevel(level));
        }
        WeaponInterfaces.assign(player);
    }

    canUse(player: Player) {
        const rights = player.getRights();
        return (rights === PlayerRights.OWNER || rights === PlayerRights.DEVELOPER);
    }
}