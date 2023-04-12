"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageFormulas = void 0;
var BonusManager_1 = require("../../../model/equipment/BonusManager");
var Skill_1 = require("../../../model/Skill");
var PrayerHandler_1 = require("../../PrayerHandler");
var CombatEquipment_1 = require("../CombatEquipment");
var CombatFactory_1 = require("../CombatFactory");
var CombatType_1 = require("../CombatType");
var FightStyle_1 = require("../FightStyle");
var Player_1 = require("../../../entity/impl/player/Player");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var FightType_1 = require("../FightType");
var DamageFormulas = /** @class */ (function () {
    function DamageFormulas() {
    }
    DamageFormulas.effectiveStrengthLevel = function (player) {
        var str = player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH);
        var prayerBonus = 1;
        // Prayer additions
        if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.BURST_OF_STRENGTH)) {
            prayerBonus = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.SUPERHUMAN_STRENGTH)) {
            prayerBonus = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.ULTIMATE_STRENGTH)) {
            prayerBonus = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.18;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.PIETY)) {
            prayerBonus = 1.23;
        }
        str = (str * prayerBonus);
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.AGGRESSIVE)
            str += 3;
        else if (fightStyle == FightStyle_1.FightStyle.CONTROLLED)
            str += 1;
        str += 8;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.MELEE))
            str = (str * 1.1);
        if (CombatEquipment_1.CombatEquipment.wearingObsidian(player))
            str = (str * 1.2); // obisidian bonuses stack
        return str;
    };
    DamageFormulas.calculateMaxMeleeHit = function (entity) {
        var maxHit;
        if (entity.isPlayer()) {
            var player = entity.getAsPlayer();
            var strengthBonus = player.getBonusManager().getOtherBonus()[BonusManager_1.BonusManager.STRENGTH];
            maxHit = DamageFormulas.effectiveStrengthLevel(player) * (strengthBonus + 64);
            maxHit += 320;
            maxHit /= 640;
            if (CombatFactory_1.CombatFactory.fullDharoks(player)) {
                var hp = player.getHitpoints();
                var max = player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS);
                var mult = Math.max(0, ((max - hp) / max) * 100) + 100;
                maxHit *= (mult / 100);
            }
            if (player.isSpecialActivated()) {
                maxHit *= Player_1.Player.getCombatSpecial().getStrengthMultiplier();
            }
        }
        else {
            maxHit = entity.getAsNpc().getCurrentDefinition().getMaxHit();
            if (CombatFactory_1.CombatFactory.fullDharoks(entity)) {
                var hitpoints = entity.getHitpoints();
                maxHit += ((entity.getAsNpc().getDefinition().getHitpoints() - hitpoints) * 0.35);
            }
        }
        return Math.floor(maxHit);
    };
    DamageFormulas.getMagicMaxhit = function (c) {
        var maxHit = 0;
        var spell = c.getCombat().getSelectedSpell();
        if (spell && spell.maximumHit() > 0) {
            maxHit = spell.maximumHit();
        }
        else if (c.isNpc()) {
            maxHit = c.getAsNpc().getDefinition().getMaxHit();
        }
        else {
            maxHit = 1;
        }
        if (c.isPlayer()) {
            var weaponId = c.getAsPlayer().getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId();
            switch (weaponId) {
                case ItemIdentifiers_1.ItemIdentifiers.AHRIMS_STAFF:
                    maxHit *= 1.05;
                    break;
                case ItemIdentifiers_1.ItemIdentifiers.KODAI_WAND:
                case ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_THE_DEAD:
                case ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_LIGHT:
                case ItemIdentifiers_1.ItemIdentifiers.TOXIC_STAFF_OF_THE_DEAD:
                    maxHit *= 1.15;
                    break;
            }
        }
        return Math.floor(maxHit);
    };
    DamageFormulas.effectiveRangedStrength = function (player) {
        var rngStrength = player.getSkillManager().getCurrentLevel(Skill_1.Skill.RANGED);
        // Prayers
        var prayerMod = 1.0;
        if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.SHARP_EYE)) {
            prayerMod = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.HAWK_EYE)) {
            prayerMod = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.EAGLE_EYE)) {
            prayerMod = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.RIGOUR)) {
            prayerMod = 1.23;
        }
        rngStrength = (rngStrength * prayerMod);
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.ACCURATE)
            rngStrength += 3;
        rngStrength += 8;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.RANGED)) {
            rngStrength = (rngStrength * 1.125);
        }
        // if (dragonHunter(input))
        // rngStrength = (int) (rngStrength * 1.3f);
        return rngStrength;
    };
    DamageFormulas.maximumRangeHitDpsCalc = function (player) {
        var strengthBonus = player.getBonusManager().getOtherBonus()[BonusManager_1.BonusManager.RANGED_STRENGTH];
        var maxHit = DamageFormulas.effectiveRangedStrength(player);
        maxHit *= (strengthBonus + 64);
        maxHit += 320;
        maxHit /= 640;
        if (player.isSpecialActivated() && Player_1.Player.getCombatSpecial().getCombatMethod().type() == CombatType_1.CombatType.RANGED) {
            maxHit *= Player_1.Player.getCombatSpecial().getStrengthMultiplier();
        }
        return Math.floor(maxHit);
    };
    /**
    Calculates the maximum ranged hit for the argued entity without
    taking the victim into consideration.
    @param entity the entity to calculate the maximum hit for.
    @return the maximum ranged hit that this entity can deal.
    */
    DamageFormulas.calculateMaxRangedHit = function (entity) {
        if (entity.isNpc()) {
            var npc = entity;
            return npc.getCurrentDefinition().getMaxHit();
        }
        var player = entity;
        return DamageFormulas.maximumRangeHitDpsCalc(player);
    };
    return DamageFormulas;
}());
exports.DamageFormulas = DamageFormulas;
//# sourceMappingURL=DamageFormulas.js.map