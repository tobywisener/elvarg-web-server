import { BonusManager } from "../../../model/equipment/BonusManager";
import { Skill } from "../../../model/Skill";
import { PrayerHandler } from "../../PrayerHandler";
import { CombatEquipment } from "../CombatEquipment";
import { CombatFactory } from "../CombatFactory";
import { CombatType } from "../CombatType";
import { FightStyle } from "../FightStyle";
import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { NPC } from "../../../entity/impl/npc/NPC";
import { Equipment } from "../../../model/container/impl/Equipment";
import { ItemIdentifiers } from "../../../../util/ItemIdentifiers";
import { FightType } from "../FightType";

export class DamageFormulas {
    private static effectiveStrengthLevel(player: Player): number {
        let str = player.getSkillManager().getCurrentLevel(Skill.STRENGTH);

        let prayerBonus = 1;

        // Prayer additions
        if (PrayerHandler.isActivated(player, PrayerHandler.BURST_OF_STRENGTH)) {
            prayerBonus = 1.05;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.SUPERHUMAN_STRENGTH)) {
            prayerBonus = 1.10;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.ULTIMATE_STRENGTH)) {
            prayerBonus = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.18;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.PIETY)) {
            prayerBonus = 1.23;
        }

        str = (str * prayerBonus);

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.AGGRESSIVE)
            str += 3;
        else if (fightStyle == FightStyle.CONTROLLED)
            str += 1;
        str += 8;

        if (CombatEquipment.wearingVoid(player, CombatType.MELEE))
            str = (str * 1.1);

        if (CombatEquipment.wearingObsidian(player))
            str = (str * 1.2); // obisidian bonuses stack

        return str;
    }

    public static calculateMaxMeleeHit(entity: Mobile): number {
        let maxHit: number;
        if (entity.isPlayer()) {
            let player = entity.getAsPlayer();
            let strengthBonus = player.getBonusManager().getOtherBonus()[BonusManager.STRENGTH];
            maxHit = DamageFormulas.effectiveStrengthLevel(player) * (strengthBonus + 64);
            maxHit += 320;
            maxHit /= 640;

            if (CombatFactory.fullDharoks(player)) {
                let hp = player.getHitpoints();
                let max = player.getSkillManager().getMaxLevel(Skill.HITPOINTS);
                let mult = Math.max(0, ((max - hp) / max) * 100) + 100;
                maxHit *= (mult / 100);
            }

            if (player.isSpecialActivated()) {
                maxHit *= Player.getCombatSpecial().getStrengthMultiplier();
            }
        } else {
            maxHit = entity.getAsNpc().getCurrentDefinition().getMaxHit();

            if (CombatFactory.fullDharoks(entity)) {
                let hitpoints = entity.getHitpoints();
                maxHit += ((entity.getAsNpc().getDefinition().getHitpoints() - hitpoints) * 0.35);
            }
        }
        return Math.floor(maxHit);
    }

    public static getMagicMaxhit(c: Mobile): number {
        let maxHit = 0;
        const spell = c.getCombat().getSelectedSpell();

        if (spell && spell.maximumHit() > 0) {
            maxHit = spell.maximumHit();
        } else if (c.isNpc()) {
            maxHit = c.getAsNpc().getDefinition().getMaxHit();
        } else {
            maxHit = 1;
        }

        if (c.isPlayer()) {
            const weaponId = c.getAsPlayer().getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
            switch (weaponId) {
                case ItemIdentifiers.AHRIMS_STAFF:
                    maxHit *= 1.05;
                    break;
                case ItemIdentifiers.KODAI_WAND:
                case ItemIdentifiers.STAFF_OF_THE_DEAD:
                case ItemIdentifiers.STAFF_OF_LIGHT:
                case ItemIdentifiers.TOXIC_STAFF_OF_THE_DEAD:
                    maxHit *= 1.15;
                    break;
            }
        }

        return Math.floor(maxHit);
    }

    private static effectiveRangedStrength(player: Player): number {
        let rngStrength = player.getSkillManager().getCurrentLevel(Skill.RANGED);
        // Prayers
        let prayerMod = 1.0;
        if (PrayerHandler.isActivated(player, PrayerHandler.SHARP_EYE)) {
            prayerMod = 1.05;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.HAWK_EYE)) {
            prayerMod = 1.10;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.EAGLE_EYE)) {
            prayerMod = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.RIGOUR)) {
            prayerMod = 1.23;
        }
        rngStrength = (rngStrength * prayerMod);

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.ACCURATE)
            rngStrength += 3;
        rngStrength += 8;

        if (CombatEquipment.wearingVoid(player, CombatType.RANGED)) {
            rngStrength = (rngStrength * 1.125);
        }
        // if (dragonHunter(input))
        // rngStrength = (int) (rngStrength * 1.3f);
        return rngStrength;
    }

    private static maximumRangeHitDpsCalc(player: Player) {
        let strengthBonus = player.getBonusManager().getOtherBonus()[BonusManager.RANGED_STRENGTH];
        let maxHit = DamageFormulas.effectiveRangedStrength(player);
        maxHit *= (strengthBonus + 64);
        maxHit += 320;
        maxHit /= 640;

        if (player.isSpecialActivated() && Player.getCombatSpecial().getCombatMethod().type() == CombatType.RANGED) {
            maxHit *= Player.getCombatSpecial().getStrengthMultiplier();
        }

        return Math.floor(maxHit);
    }

    /**
    Calculates the maximum ranged hit for the argued entity without
    taking the victim into consideration.
    @param entity the entity to calculate the maximum hit for.
    @return the maximum ranged hit that this entity can deal.
    */
    public static calculateMaxRangedHit(entity: Mobile) {
        if (entity.isNpc()) {
            let npc = entity as unknown as NPC;
            return npc.getCurrentDefinition().getMaxHit();
        }

        let player = entity as Player;

        return DamageFormulas.maximumRangeHitDpsCalc(player);
    }

}