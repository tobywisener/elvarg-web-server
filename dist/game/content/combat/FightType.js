"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightType = void 0;
var FightStyle_1 = require("./FightStyle");
var Sound_1 = require("../../Sound");
var BonusManager_1 = require("../../model/equipment/BonusManager");
var FightType = exports.FightType = /** @class */ (function () {
    function FightType(animation, parentId, childId, bonusType, style, sound) {
        FightType.animation = animation;
        FightType.parentId = parentId;
        FightType.childId = childId;
        FightType.bonusType = bonusType;
        FightType.style = style;
        FightType.attackSound = sound;
    }
    FightType.getAnimation = function () {
        return this.animation;
    };
    /**
     * Gets the parent config      *
     * @return the parent      */
    FightType.getParentId = function () {
        return this.parentId;
    };
    /**
     * Gets the child config      *
     * @return the child      */
    FightType.getChildId = function () {
        return this.childId;
    };
    /**
     * Gets the bonus type.
     *
     * @return the bonus type.
     */
    FightType.getBonusType = function () {
        return this.bonusType;
    };
    FightType.getBonusTypes = function () {
        return FightType.bonusType;
    };
    /**
     * Gets the fighting style.
     *
     * @return the fighting style.
     */
    FightType.getStyle = function () {
        return this.style;
    };
    FightType.getCorrespondingBonus = function () {
        switch (this.bonusType) {
            case BonusManager_1.BonusManager.ATTACK_CRUSH:
                return BonusManager_1.BonusManager.DEFENCE_CRUSH;
            case BonusManager_1.BonusManager.ATTACK_MAGIC:
                return BonusManager_1.BonusManager.DEFENCE_MAGIC;
            case BonusManager_1.BonusManager.ATTACK_RANGE:
                return BonusManager_1.BonusManager.DEFENCE_RANGE;
            case BonusManager_1.BonusManager.ATTACK_SLASH:
                return BonusManager_1.BonusManager.DEFENCE_SLASH;
            case BonusManager_1.BonusManager.ATTACK_STAB:
                return BonusManager_1.BonusManager.DEFENCE_STAB;
            default:
                return BonusManager_1.BonusManager.DEFENCE_CRUSH;
        }
    };
    FightType.getAttackSound = function () {
        return this.attackSound;
    };
    FightType.STAFF_BASH = new FightType(401, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.STAFF_POUND = new FightType(406, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.STAFF_FOCUS = new FightType(406, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.WARHAMMER_POUND = new FightType(401, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.WARHAMMER_PUMMEL = new FightType(401, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.WARHAMMER_BLOCK = new FightType(401, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.MAUL_POUND = new FightType(2661, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.MAUL_PUMMEL = new FightType(2661, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.MAUL_BLOCK = new FightType(2661, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.ELDER_MAUL_POUND = new FightType(7516, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.ELDER_MAUL_PUMMEL = new FightType(7516, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.ELDER_MAUL_BLOCK = new FightType(7516, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.GRANITE_MAUL_POUND = new FightType(1665, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.GRANITE_MAUL_PUMMEL = new FightType(1665, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GRANITE_MAUL_BLOCK = new FightType(1665, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SCYTHE_REAP = new FightType(414, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.SCYTHE_CHOP = new FightType(382, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.SCYTHE_JAB = new FightType(2066, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.CONTROLLED);
    FightType.SCYTHE_BLOCK = new FightType(382, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.BATTLEAXE_CHOP = new FightType(401, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.BATTLEAXE_HACK = new FightType(401, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.BATTLEAXE_SMASH = new FightType(401, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.BATTLEAXE_BLOCK = new FightType(401, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.GREATAXE_CHOP = new FightType(2062, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.GREATAXE_HACK = new FightType(2062, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GREATAXE_SMASH = new FightType(2066, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GREATAXE_BLOCK = new FightType(2062, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.CROSSBOW_ACCURATE = new FightType(4230, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.CROSSBOW_RAPID = new FightType(4230, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.CROSSBOW_LONGRANGE = new FightType(4230, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.KARILS_CROSSBOW_ACCURATE = new FightType(2075, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.KARILS_CROSSBOW_RAPID = new FightType(2075, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.KARILS_CROSSBOW_LONGRANGE = new FightType(2075, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.BALLISTA_ACCURATE = new FightType(7218, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.BALLISTA_RAPID = new FightType(7218, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.BALLISTA_LONGRANGE = new FightType(7218, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.BLOWPIPE_ACCURATE = new FightType(5061, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.BLOWPIPE_RAPID = new FightType(5061, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.BLOWPIPE_LONGRANGE = new FightType(5061, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.ABYSSAL_BLUDGEON_CHOP = new FightType(7054, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.ABYSSAL_BLUDGEON_SLASH = new FightType(7054, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.ABYSSAL_BLUDGEON_SMASH = new FightType(7054, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.ABYSSAL_BLUDGEON_BLOCK = new FightType(7054, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SHORTBOW_ACCURATE = new FightType(426, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.SHORTBOW_RAPID = new FightType(426, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.SHORTBOW_LONGRANGE = new FightType(426, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.LONGBOW_ACCURATE = new FightType(426, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.LONGBOW_RAPID = new FightType(426, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.LONGBOW_LONGRANGE = new FightType(426, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.DAGGER_STAB = new FightType(400, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.ACCURATE);
    FightType.DAGGER_LUNGE = new FightType(400, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.DAGGER_SLASH = new FightType(400, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.DAGGER_BLOCK = new FightType(400, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.DRAGON_DAGGER_STAB = new FightType(376, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.ACCURATE);
    FightType.DRAGON_DAGGER_LUNGE = new FightType(376, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.DRAGON_DAGGER_SLASH = new FightType(377, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.DRAGON_DAGGER_BLOCK = new FightType(376, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SWORD_STAB = new FightType(412, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.ACCURATE);
    FightType.SWORD_LUNGE = new FightType(412, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.SWORD_SLASH = new FightType(390, 43, 2, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.SWORD_BLOCK = new FightType(412, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SCIMITAR_CHOP = new FightType(390, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.SCIMITAR_LUNGE = new FightType(390, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.SCIMITAR_BLOCK = new FightType(390, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SCIMITAR_SLASH = new FightType(390, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.LONGSWORD_CHOP = new FightType(390, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.LONGSWORD_SLASH = new FightType(390, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.LONGSWORD_LUNGE = new FightType(412, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.LONGSWORD_BLOCK = new FightType(390, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.MACE_POUND = new FightType(401, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.MACE_PUMMEL = new FightType(401, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.MACE_SPIKE = new FightType(401, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.MACE_BLOCK = new FightType(401, 43, 3, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.KNIFE_ACCURATE = new FightType(806, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.KNIFE_RAPID = new FightType(806, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.KNIFE_LONGRANGE = new FightType(806, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.OBBY_RING_ACCURATE = new FightType(2614, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.OBBY_RING_RAPID = new FightType(2614, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.OBBY_RING_LONGRANGE = new FightType(2614, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.SPEAR_LUNGE = new FightType(2080, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.SPEAR_SWIPE = new FightType(2081, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.CONTROLLED);
    FightType.SPEAR_POUND = new FightType(2082, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.CONTROLLED);
    FightType.SPEAR_BLOCK = new FightType(2080, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.TWOHANDEDSWORD_CHOP = new FightType(407, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.TWOHANDEDSWORD_SLASH = new FightType(407, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.TWOHANDEDSWORD_SMASH = new FightType(406, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.TWOHANDEDSWORD_BLOCK = new FightType(407, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.GODSWORD_CHOP = new FightType(7046, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.GODSWORD_SLASH = new FightType(7045, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GODSWORD_SMASH = new FightType(7054, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GODSWORD_BLOCK = new FightType(7055, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.VERACS_FLAIL_POUND = new FightType(1658, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.VERACS_FLAIL_PUMMEL = new FightType(1658, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.VERACS_FLAIL_SPIKE = new FightType(1658, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.VERACS_FLAIL_BLOCK = new FightType(1658, 43, 3, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.PICKAXE_SPIKE = new FightType(401, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.ACCURATE);
    FightType.PICKAXE_IMPALE = new FightType(401, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.PICKAXE_SMASH = new FightType(401, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.PICKAXE_BLOCK = new FightType(400, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.CLAWS_CHOP = new FightType(393, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE);
    FightType.CLAWS_SLASH = new FightType(393, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.CLAWS_LUNGE = new FightType(393, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.CLAWS_BLOCK = new FightType(393, 43, 3, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.HALBERD_JAB = new FightType(440, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.CONTROLLED);
    FightType.HALBERD_SWIPE = new FightType(440, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.HALBERD_FEND = new FightType(440, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.UNARMED_PUNCH = new FightType(422, 43, 0, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.ACCURATE);
    FightType.UNARMED_KICK = new FightType(423, 43, 1, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.UNARMED_BLOCK = new FightType(422, 43, 2, BonusManager_1.BonusManager.ATTACK_CRUSH, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.WHIP_FLICK = new FightType(1658, 43, 0, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.ACCURATE, Sound_1.Sound.WEAPON_WHIP);
    FightType.WHIP_LASH = new FightType(1658, 43, 1, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.CONTROLLED, Sound_1.Sound.WEAPON_WHIP);
    FightType.WHIP_DEFLECT = new FightType(1658, 43, 2, BonusManager_1.BonusManager.ATTACK_SLASH, FightStyle_1.FightStyle.DEFENSIVE, Sound_1.Sound.WEAPON_WHIP);
    FightType.THROWNAXE_ACCURATE = new FightType(806, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.THROWNAXE_RAPID = new FightType(806, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.THROWNAXE_LONGRANGE = new FightType(806, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.DART_ACCURATE = new FightType(806, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.DART_RAPID = new FightType(806, 43, 1, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.DART_LONGRANGE = new FightType(806, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.JAVELIN_ACCURATE = new FightType(806, 43, 0, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.ACCURATE);
    FightType.JAVELIN_RAPID = new FightType(806, 43, 2, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.JAVELIN_LONGRANGE = new FightType(806, 43, 3, BonusManager_1.BonusManager.ATTACK_RANGE, FightStyle_1.FightStyle.DEFENSIVE);
    FightType.GHRAZI_RAPIER_STAB = new FightType(8145, 43, 0, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.ACCURATE);
    FightType.GHRAZI_RAPIER_LUNGE = new FightType(8145, 43, 1, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GHRAZI_RAPIER_SLASH = new FightType(390, 43, 2, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.AGGRESSIVE);
    FightType.GHRAZI_RAPIER_BLOCK = new FightType(8145, 43, 3, BonusManager_1.BonusManager.ATTACK_STAB, FightStyle_1.FightStyle.DEFENSIVE);
    return FightType;
}());
//# sourceMappingURL=FightType.js.map