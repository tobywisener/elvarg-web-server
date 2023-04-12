import { FightStyle } from './FightStyle';
import { Sound } from '../../Sound';
import { BonusManager } from '../../model/equipment/BonusManager';

export class FightType {

    public static STAFF_BASH = new FightType(401, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static STAFF_POUND = new FightType(406, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static STAFF_FOCUS = new FightType(406, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static WARHAMMER_POUND = new FightType(401, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static WARHAMMER_PUMMEL = new FightType(401, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static WARHAMMER_BLOCK = new FightType(401, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static MAUL_POUND = new FightType(2661, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static MAUL_PUMMEL = new FightType(2661, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static MAUL_BLOCK = new FightType(2661, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static ELDER_MAUL_POUND = new FightType(7516, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static ELDER_MAUL_PUMMEL = new FightType(7516, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static ELDER_MAUL_BLOCK = new FightType(7516, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static GRANITE_MAUL_POUND = new FightType(1665, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static GRANITE_MAUL_PUMMEL = new FightType(1665, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static GRANITE_MAUL_BLOCK = new FightType(1665, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static SCYTHE_REAP = new FightType(414, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static SCYTHE_CHOP = new FightType(382, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static SCYTHE_JAB = new FightType(2066, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.CONTROLLED)
    public static SCYTHE_BLOCK = new FightType(382, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static BATTLEAXE_CHOP = new FightType(401, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static BATTLEAXE_HACK = new FightType(401, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static BATTLEAXE_SMASH = new FightType(401, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static BATTLEAXE_BLOCK = new FightType(401, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static GREATAXE_CHOP = new FightType(2062, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static GREATAXE_HACK = new FightType(2062, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static GREATAXE_SMASH = new FightType(2066, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static GREATAXE_BLOCK = new FightType(2062, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static CROSSBOW_ACCURATE = new FightType(4230, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static CROSSBOW_RAPID = new FightType(4230, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static CROSSBOW_LONGRANGE = new FightType(4230, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static KARILS_CROSSBOW_ACCURATE = new FightType(2075, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static KARILS_CROSSBOW_RAPID = new FightType(2075, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static KARILS_CROSSBOW_LONGRANGE = new FightType(2075, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static BALLISTA_ACCURATE = new FightType(7218, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static BALLISTA_RAPID = new FightType(7218, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static BALLISTA_LONGRANGE = new FightType(7218, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static BLOWPIPE_ACCURATE = new FightType(5061, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static BLOWPIPE_RAPID = new FightType(5061, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static BLOWPIPE_LONGRANGE = new FightType(5061, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static ABYSSAL_BLUDGEON_CHOP = new FightType(7054, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static ABYSSAL_BLUDGEON_SLASH = new FightType(7054, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static ABYSSAL_BLUDGEON_SMASH = new FightType(7054, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static ABYSSAL_BLUDGEON_BLOCK = new FightType(7054, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static SHORTBOW_ACCURATE = new FightType(426, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static SHORTBOW_RAPID = new FightType(426, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static SHORTBOW_LONGRANGE = new FightType(426, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static LONGBOW_ACCURATE = new FightType(426, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static LONGBOW_RAPID = new FightType(426, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static LONGBOW_LONGRANGE = new FightType(426, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static DAGGER_STAB = new FightType(400, 43, 0, BonusManager.ATTACK_STAB, FightStyle.ACCURATE)
    public static DAGGER_LUNGE = new FightType(400, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static DAGGER_SLASH = new FightType(400, 43, 2, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static DAGGER_BLOCK = new FightType(400, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static DRAGON_DAGGER_STAB = new FightType(376, 43, 0, BonusManager.ATTACK_STAB, FightStyle.ACCURATE)
    public static DRAGON_DAGGER_LUNGE = new FightType(376, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static DRAGON_DAGGER_SLASH = new FightType(377, 43, 2, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static DRAGON_DAGGER_BLOCK = new FightType(376, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static SWORD_STAB = new FightType(412, 43, 0, BonusManager.ATTACK_STAB, FightStyle.ACCURATE)
    public static SWORD_LUNGE = new FightType(412, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static SWORD_SLASH = new FightType(390, 43, 2, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static SWORD_BLOCK = new FightType(412, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static SCIMITAR_CHOP = new FightType(390, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static SCIMITAR_LUNGE = new FightType(390, 43, 2, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static SCIMITAR_BLOCK = new FightType(390, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static SCIMITAR_SLASH = new FightType(390, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static LONGSWORD_CHOP = new FightType(390, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static LONGSWORD_SLASH = new FightType(390, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static LONGSWORD_LUNGE = new FightType(412, 43, 2, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static LONGSWORD_BLOCK = new FightType(390, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static MACE_POUND = new FightType(401, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static MACE_PUMMEL = new FightType(401, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static MACE_SPIKE = new FightType(401, 43, 2, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static MACE_BLOCK = new FightType(401, 43, 3, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static KNIFE_ACCURATE = new FightType(806, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static KNIFE_RAPID = new FightType(806, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static KNIFE_LONGRANGE = new FightType(806, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static OBBY_RING_ACCURATE = new FightType(2614, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static OBBY_RING_RAPID = new FightType(2614, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static OBBY_RING_LONGRANGE = new FightType(2614, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static SPEAR_LUNGE = new FightType(2080, 43, 0, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static SPEAR_SWIPE = new FightType(2081, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.CONTROLLED)
    public static SPEAR_POUND = new FightType(2082, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.CONTROLLED)
    public static SPEAR_BLOCK = new FightType(2080, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static TWOHANDEDSWORD_CHOP = new FightType(407, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static TWOHANDEDSWORD_SLASH = new FightType(407, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static TWOHANDEDSWORD_SMASH = new FightType(406, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static TWOHANDEDSWORD_BLOCK = new FightType(407, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static GODSWORD_CHOP = new FightType(7046, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static GODSWORD_SLASH = new FightType(7045, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static GODSWORD_SMASH = new FightType(7054, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static GODSWORD_BLOCK = new FightType(7055, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static VERACS_FLAIL_POUND = new FightType(1658, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static VERACS_FLAIL_PUMMEL = new FightType(1658, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static VERACS_FLAIL_SPIKE = new FightType(1658, 43, 2, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static VERACS_FLAIL_BLOCK = new FightType(1658, 43, 3, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static PICKAXE_SPIKE = new FightType(401, 43, 0, BonusManager.ATTACK_STAB, FightStyle.ACCURATE)
    public static PICKAXE_IMPALE = new FightType(401, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static PICKAXE_SMASH = new FightType(401, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static PICKAXE_BLOCK = new FightType(400, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static CLAWS_CHOP = new FightType(393, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE)
    public static CLAWS_SLASH = new FightType(393, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static CLAWS_LUNGE = new FightType(393, 43, 2, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static CLAWS_BLOCK = new FightType(393, 43, 3, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE)
    public static HALBERD_JAB = new FightType(440, 43, 0, BonusManager.ATTACK_STAB, FightStyle.CONTROLLED)
    public static HALBERD_SWIPE = new FightType(440, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.AGGRESSIVE)
    public static HALBERD_FEND = new FightType(440, 43, 2, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)
    public static UNARMED_PUNCH = new FightType(422, 43, 0, BonusManager.ATTACK_CRUSH, FightStyle.ACCURATE)
    public static UNARMED_KICK = new FightType(423, 43, 1, BonusManager.ATTACK_CRUSH, FightStyle.AGGRESSIVE)
    public static UNARMED_BLOCK = new FightType(422, 43, 2, BonusManager.ATTACK_CRUSH, FightStyle.DEFENSIVE)
    public static WHIP_FLICK = new FightType(1658, 43, 0, BonusManager.ATTACK_SLASH, FightStyle.ACCURATE, Sound.WEAPON_WHIP)
    public static WHIP_LASH = new FightType(1658, 43, 1, BonusManager.ATTACK_SLASH, FightStyle.CONTROLLED, Sound.WEAPON_WHIP)
    public static WHIP_DEFLECT = new FightType(1658, 43, 2, BonusManager.ATTACK_SLASH, FightStyle.DEFENSIVE, Sound.WEAPON_WHIP)
    public static THROWNAXE_ACCURATE = new FightType(806, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static THROWNAXE_RAPID = new FightType(806, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static THROWNAXE_LONGRANGE = new FightType(806, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static DART_ACCURATE = new FightType(806, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static DART_RAPID = new FightType(806, 43, 1, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static DART_LONGRANGE = new FightType(806, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static JAVELIN_ACCURATE = new FightType(806, 43, 0, BonusManager.ATTACK_RANGE, FightStyle.ACCURATE)
    public static JAVELIN_RAPID = new FightType(806, 43, 2, BonusManager.ATTACK_RANGE, FightStyle.AGGRESSIVE)
    public static JAVELIN_LONGRANGE = new FightType(806, 43, 3, BonusManager.ATTACK_RANGE, FightStyle.DEFENSIVE)
    public static GHRAZI_RAPIER_STAB = new FightType(8145, 43, 0, BonusManager.ATTACK_STAB, FightStyle.ACCURATE)
    public static GHRAZI_RAPIER_LUNGE = new FightType(8145, 43, 1, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static GHRAZI_RAPIER_SLASH = new FightType(390, 43, 2, BonusManager.ATTACK_STAB, FightStyle.AGGRESSIVE)
    public static GHRAZI_RAPIER_BLOCK = new FightType(8145, 43, 3, BonusManager.ATTACK_STAB, FightStyle.DEFENSIVE)


    private static animation: number;
    private static attackSound: Sound;
    private static parentId: number;
    private static childId: number;
    private static bonusType: number;
    private static style: FightStyle;

    private constructor(animation: number, parentId: number, childId: number, bonusType: number, style: FightStyle, sound?: Sound) {
        FightType.animation = animation;
        FightType.parentId = parentId;
        FightType.childId = childId;
        FightType.bonusType = bonusType;
        FightType.style = style;
        FightType.attackSound = sound;
    }

    public static getAnimation(): number {
        return this.animation;
    }

    /**
     * Gets the parent config      *
     * @return the parent      */
    public static getParentId(): number {
        return this.parentId;
    }

    /**
     * Gets the child config      *
     * @return the child      */
    public static getChildId(): number {
        return this.childId;
    }

    /**
     * Gets the bonus type.
     *
     * @return the bonus type.
     */
    public static getBonusType(): number {
        return this.bonusType;

    }
    public static getBonusTypes(): number {
        return FightType.bonusType;

    }

    /**
     * Gets the fighting style.
     *
     * @return the fighting style.
     */
    public static getStyle(): FightStyle {
        return this.style;
    }

    public static getCorrespondingBonus(): number {
        switch (this.bonusType) {
            case BonusManager.ATTACK_CRUSH:
                return BonusManager.DEFENCE_CRUSH;
            case BonusManager.ATTACK_MAGIC:
                return BonusManager.DEFENCE_MAGIC;
            case BonusManager.ATTACK_RANGE:
                return BonusManager.DEFENCE_RANGE;
            case BonusManager.ATTACK_SLASH:
                return BonusManager.DEFENCE_SLASH;
            case BonusManager.ATTACK_STAB:
                return BonusManager.DEFENCE_STAB;
            default:
                return BonusManager.DEFENCE_CRUSH;
        }
    }

    public static getAttackSound(): Sound {
        return this.attackSound;
    }

}    