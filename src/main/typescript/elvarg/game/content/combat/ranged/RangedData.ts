
import { CombatEquipment } from '../CombatEquipment';
import { CombatFactory } from '../CombatFactory';
import { FightStyle } from '../FightStyle';
import { Mobile } from '../../../entity/impl/Mobile';
import { Player } from '../../../entity/impl/player/Player';
import { Graphic } from '../../../model/Graphic';
import { GraphicHeight } from '../../../model/GraphicHeight';
import { Skill } from '../../../model/Skill';
import { Equipment } from '../../../model/container/impl/Equipment';
import { PoisonType } from '../../../task/impl/CombatPoisonEffect';
import { ItemIdentifiers } from '../../../../util/ItemIdentifiers';
import { Misc } from '../../../../util/Misc';
import { FightType } from '../FightType';



export class RangedData {
    /**
  * A map of items and their respective interfaces.
  */
    private static rangedWeapons: Map<number, RangedWeapon> = new Map<number, RangedWeapon>();
    private static rangedAmmunition: Map<number, Ammunition> = new Map<number, Ammunition>();

    public static getSpecialEffectsMultiplier(p: Player, target: Mobile, damage: number): number {
        let multiplier = 1.0;

        // Todo: ENCHANTED_RUBY_BOLT
        switch (p.getCombat().getAmmunition()) {
            case Ammunition.ENCHANTED_DIAMOND_BOLT:
                target.performGraphic(new Graphic(758, GraphicHeight.MIDDLE));
                multiplier = 1.15;
                break;

            case Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT:
            case Ammunition.ENCHANTED_DRAGON_BOLT:
                let multiply = true;
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    multiply = !(!t.getCombat().getFireImmunityTimer().finished() || CombatEquipment.hasDragonProtectionGear(t));
                }

                if (multiply) {
                    target.performGraphic(new Graphic(756));
                    multiplier = 1.31;
                }
                break;

            case Ammunition.ENCHANTED_EMERALD_BOLT:
                target.performGraphic(new Graphic(752));
                CombatFactory.poisonEntity(target, PoisonType.MILD);
                break;

            case Ammunition.ENCHANTED_JADE_BOLT:
                target.performGraphic(new Graphic(755));
                multiplier = 1.05;
                break;

            case Ammunition.ENCHANTED_ONYX_BOLT:
                target.performGraphic(new Graphic(753));
                multiplier = 1.26;
                const heal = Math.floor(damage * 0.25) + 10;
                p.getSkillManager().setCurrentLevels(Skill.HITPOINTS, p.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + heal);
                if (p.getSkillManager().getCurrentLevel(Skill.HITPOINTS) >= 1120) {
                    p.getSkillManager().setCurrentLevels(Skill.HITPOINTS, 1120);
                }
                p.getSkillManager().updateSkill(Skill.HITPOINTS);
                if (damage < 250 && Misc.getRandom(3) <= 1) {
                    damage += 150 + Misc.getRandom(80);
                }
                break;

            case Ammunition.ENCHANTED_PEARL_BOLT:
                target.performGraphic(new Graphic(750));
                multiplier = 1.1;
                break;

            case Ammunition.ENCHANTED_RUBY_BOLT:
                break;

            case Ammunition.ENCHANTED_SAPPHIRE_BOLT:
                target.performGraphic(new Graphic(751));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill.PRAYER) - 20);
                    if (t.getSkillManager().getCurrentLevel(Skill.PRAYER) < 0) {
                        t.getSkillManager().setCurrentLevels(Skill.PRAYER, 0);
                    }
                    t.getPacketSender().sendMessage("Your Prayer level has been leeched.");

                    p.getSkillManager().setCurrentLevels(Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill.PRAYER) + 20);
                    if (p.getSkillManager().getCurrentLevel(Skill.PRAYER) > p.getSkillManager().getMaxLevel(Skill.PRAYER)) {
                        p.getSkillManager().setCurrentLevels(Skill.PRAYER, p.getSkillManager().getMaxLevel(Skill.PRAYER));
                    } else {
                        p.getPacketSender().sendMessage("Your enchanced bolts leech some Prayer points from your opponent..");
                    }
                }
                break;
            case Ammunition.ENCHANTED_TOPAZ_BOLT:


                target.performGraphic(new Graphic(757));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill.MAGIC, t.getSkillManager().getCurrentLevel(Skill.MAGIC) - 3);
                    t.getPacketSender().sendMessage("Your Magic level has been reduced.");
                }

                break;
            case Ammunition.ENCHANTED_OPAL_BOLT:


                target.performGraphic(new Graphic(749));
                multiplier = 1.3;

                break;
        }

        return multiplier;
    }
}

export class Ammunition {
    public static readonly BRONZE_ARROW = new Ammunition(882, new Graphic(19, GraphicHeight.HIGH), 10, 7)
    public static readonly IRON_ARROW = new Ammunition(884, new Graphic(18, GraphicHeight.HIGH), 9, 10)
    public static readonly STEEL_ARROW = new Ammunition(886, new Graphic(20, GraphicHeight.HIGH), 11, 16)
    public static readonly MITHRIL_ARROW = new Ammunition(888, new Graphic(21, GraphicHeight.HIGH), 12, 22)
    public static readonly ADAMANT_ARROW = new Ammunition(890, new Graphic(22, GraphicHeight.HIGH), 13, 31)
    public static readonly RUNE_ARROW = new Ammunition(892, new Graphic(24, GraphicHeight.HIGH), 15, 50)
    public static readonly ICE_ARROW = new Ammunition(78, new Graphic(25, GraphicHeight.HIGH), 16, 58)
    public static readonly BROAD_ARROW = new Ammunition(4160, new Graphic(20, GraphicHeight.HIGH), 11, 58)
    public static readonly DRAGON_ARROW = new Ammunition(11212, new Graphic(1111, GraphicHeight.HIGH), 1120, 65)

    public static readonly BRONZE_BOLT = new Ammunition(877, new Graphic(955, GraphicHeight.HIGH), 27, 13)
    public static readonly OPAL_BOLT = new Ammunition(879, new Graphic(955, GraphicHeight.HIGH), 27, 20)
    public static readonly ENCHANTED_OPAL_BOLT = new Ammunition(9236, new Graphic(955, GraphicHeight.HIGH), 27, 20)
    public static readonly IRON_BOLT = new Ammunition(9140, new Graphic(955, GraphicHeight.HIGH), 27, 28)
    public static readonly JADE_BOLT = new Ammunition(9335, new Graphic(955, GraphicHeight.HIGH), 27, 31)
    public static readonly ENCHANTED_JADE_BOLT = new Ammunition(9237, new Graphic(955, GraphicHeight.HIGH), 27, 31)
    public static readonly STEEL_BOLT = new Ammunition(9141, new Graphic(955, GraphicHeight.HIGH), 27, 35)
    public static readonly PEARL_BOLT = new Ammunition(880, new Graphic(955, GraphicHeight.HIGH), 27, 38)
    public static readonly ENCHANTED_PEARL_BOLT = new Ammunition(9238, new Graphic(955, GraphicHeight.HIGH), 27, 38)
    public static readonly MITHRIL_BOLT = new Ammunition(9142, new Graphic(955, GraphicHeight.HIGH), 27, 40)
    public static readonly TOPAZ_BOLT = new Ammunition(9336, new Graphic(955, GraphicHeight.HIGH), 27, 50)
    public static readonly ENCHANTED_TOPAZ_BOLT = new Ammunition(9239, new Graphic(955, GraphicHeight.HIGH), 27, 50)
    public static readonly ADAMANT_BOLT = new Ammunition(9143, new Graphic(955, GraphicHeight.HIGH), 27, 60)
    public static readonly SAPPHIRE_BOLT = new Ammunition(9337, new Graphic(955, GraphicHeight.HIGH), 27, 65)
    public static readonly ENCHANTED_SAPPHIRE_BOLT = new Ammunition(9240, new Graphic(955, GraphicHeight.HIGH), 27, 65)
    public static readonly EMERALD_BOLT = new Ammunition(9338, new Graphic(955, GraphicHeight.HIGH), 27, 70)
    public static readonly ENCHANTED_EMERALD_BOLT = new Ammunition(9241, new Graphic(955, GraphicHeight.HIGH), 27, 70)
    public static readonly RUBY_BOLT = new Ammunition(9339, new Graphic(955, GraphicHeight.HIGH), 27, 75)
    public static readonly ENCHANTED_RUBY_BOLT = new Ammunition(9242, new Graphic(955, GraphicHeight.HIGH), 27, 75)
    public static readonly BROAD_BOLT = new Ammunition(13280, new Graphic(955, GraphicHeight.HIGH), 27, 100)
    public static readonly RUNITE_BOLT = new Ammunition(9144, new Graphic(955, GraphicHeight.HIGH), 27, 115)
    public static readonly DIAMOND_BOLT = new Ammunition(9340, new Graphic(955, GraphicHeight.HIGH), 27, 105)
    public static readonly ENCHANTED_DIAMOND_BOLT = new Ammunition(9243, new Graphic(955, GraphicHeight.HIGH), 27, 105)
    public static readonly DRAGON_BOLT = new Ammunition(9341, new Graphic(955, GraphicHeight.HIGH), 27, 117)
    public static readonly ENCHANTED_DRAGON_BOLT = new Ammunition(9244, new Graphic(955, GraphicHeight.HIGH), 27, 117)
    public static readonly ONYX_BOLT = new Ammunition(9342, new Graphic(955, GraphicHeight.HIGH), 27, 120)
    public static readonly ENCHANTED_ONYX_BOLT = new Ammunition(9245, new Graphic(955, GraphicHeight.HIGH), 27, 120)
    public static readonly ENCHANTED_DRAGONSTONE_DRAGON_BOLT = new Ammunition(ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, new Graphic(955, GraphicHeight.HIGH), 27, 122)

    public static readonly BRONZE_DART = new Ammunition(806, new Graphic(232, GraphicHeight.HIGH), 226, 1)
    public static readonly IRON_DART = new Ammunition(807, new Graphic(233, GraphicHeight.HIGH), 227, 4)
    public static readonly STEEL_DART = new Ammunition(808, new Graphic(234, GraphicHeight.HIGH), 228, 6)
    public static readonly MITHRIL_DART = new Ammunition(809, new Graphic(235, GraphicHeight.HIGH), 229, 8)
    public static readonly ADAMANT_DART = new Ammunition(810, new Graphic(236, GraphicHeight.HIGH), 230, 13)
    public static readonly RUNE_DART = new Ammunition(811, new Graphic(237, GraphicHeight.HIGH), 231, 17)
    public static readonly DRAGON_DART = new Ammunition(11230, new Graphic(1123, GraphicHeight.HIGH), 226, 24)

    public static readonly BRONZE_KNIFE = new Ammunition(864, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P1 = new Ammunition(870, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P2 = new Ammunition(5654, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P3 = new Ammunition(5661, new Graphic(219, GraphicHeight.HIGH), 212, 3)

    public static readonly IRON_KNIFE = new Ammunition(863, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P1 = new Ammunition(871, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P2 = new Ammunition(5655, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P3 = new Ammunition(5662, new Graphic(220, GraphicHeight.HIGH), 213, 4)

    public static readonly STEEL_KNIFE = new Ammunition(865, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P1 = new Ammunition(872, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P2 = new Ammunition(5656, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P3 = new Ammunition(5663, new Graphic(221, GraphicHeight.HIGH), 214, 7)

    public static readonly BLACK_KNIFE = new Ammunition(869, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P1 = new Ammunition(874, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P2 = new Ammunition(5658, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P3 = new Ammunition(5665, new Graphic(222, GraphicHeight.HIGH), 215, 8)

    public static readonly MITHRIL_KNIFE = new Ammunition(866, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P1 = new Ammunition(873, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P2 = new Ammunition(5657, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P3 = new Ammunition(5664, new Graphic(223, GraphicHeight.HIGH), 215, 10)

    public static readonly ADAMANT_KNIFE = new Ammunition(867, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P1 = new Ammunition(875, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P2 = new Ammunition(5659, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P3 = new Ammunition(5666, new Graphic(224, GraphicHeight.HIGH), 217, 14)

    public static readonly RUNE_KNIFE = new Ammunition(868, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P1 = new Ammunition(876, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P2 = new Ammunition(5660, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P3 = new Ammunition(5667, new Graphic(225, GraphicHeight.HIGH), 218, 24)

    public static readonly BRONZE_JAVELIN = new Ammunition(825, null, 200, 25)
    public static readonly IRON_JAVELIN = new Ammunition(826, null, 201, 42)
    public static readonly STEEL_JAVELIN = new Ammunition(827, null, 202, 64)
    public static readonly MITHRIL_JAVELIN = new Ammunition(828, null, 203, 85)
    public static readonly ADAMANT_JAVELIN = new Ammunition(829, null, 204, 107)
    public static readonly RUNE_JAVELIN = new Ammunition(830, null, 205, 124)
    public static readonly DRAGON_JAVELIN = new Ammunition(19484, null, 1301, 150)

    public static readonly TOKTZ_XIL_UL = new Ammunition(6522, null, 442, 58)

    public static readonly BOLT_RACK = new Ammunition(4740, null, 27, 55)

    private static NO_GROUND_DROP: Set<Ammunition> = new Set([
        Ammunition.BRONZE_JAVELIN,
        Ammunition.IRON_JAVELIN,
        Ammunition.STEEL_JAVELIN,
        Ammunition.ADAMANT_JAVELIN,
        Ammunition.RUNE_JAVELIN,
        Ammunition.DRAGON_JAVELIN
    ]);

    private static startGfx: Graphic;
    private static itemId: number;
    private static projectileId: number;
    private static strength: number;
    private static rangedAmmunition: Map<number, Ammunition> = new Map<number, Ammunition>();


    constructor(itemId: number, startGfx: Graphic, projectileId: number, strength: number) {
        Ammunition.itemId = itemId;
        Ammunition.startGfx = startGfx;
        Ammunition.projectileId = projectileId;
        Ammunition.strength = strength;
    }

    public static getFor(p: Player): Ammunition {
        // First try to get a throw weapon as ammo
        const weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        const throwWeapon = Ammunition.rangedAmmunition.get(weapon);

        // Toxic blowpipe should always fire dragon darts.
        if (weapon === 12926) {
            return Ammunition.DRAGON_DART;
        }

        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(p.getEquipment().getItems()[Equipment.AMMUNITION_SLOT].getId());
        }

        return throwWeapon;
    }

    public static getForItem(item: number): Ammunition {
        // First try to get a throw weapon as ammo
        const throwWeapon = Ammunition.rangedAmmunition.get(item);

        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(item);
        }

        return throwWeapon;
    }

    public getItemId(): number {
        return Ammunition.itemId;
    }

    public getStartGraphic(): Graphic {
        return Ammunition.startGfx;
    }

    public getProjectileId(): number {
        return Ammunition.projectileId;
    }

    public getStrength(): number {
        return Ammunition.strength;
    }

    public dropOnFloor(): boolean {
        return !Ammunition.NO_GROUND_DROP.add(this);
    }




    static {
        for (const data of Object.values(Ammunition)) {
            Ammunition.rangedAmmunition.set(data.getItemId(), data);
        }
    }


}

export class RangedWeaponType {
    public static readonly KNIFE = new RangedWeaponType(4, 6, FightType.KNIFE_LONGRANGE)
    public static readonly DART = new RangedWeaponType(3, 5, FightType.DART_LONGRANGE)
    public static readonly TOKTZ_XIL_UL = new RangedWeaponType(5, 6, FightType.OBBY_RING_LONGRANGE)
    public static readonly LONGBOW = new RangedWeaponType(9, 10, FightType.LONGBOW_LONGRANGE)
    public static readonly BLOWPIPE = new RangedWeaponType(5, 7, FightType.BLOWPIPE_LONGRANGE)
    public static readonly SHORTBOW = new RangedWeaponType(7, 9, FightType.SHORTBOW_LONGRANGE)
    public static readonly CROSSBOW = new RangedWeaponType(7, 9, FightType.CROSSBOW_LONGRANGE)
    public static readonly BALLISTA = new RangedWeaponType(7, 9, FightType.BALLISTA_LONGRANGE)


    private static longRangeFightType: FightType;
    private static defaultDistance: number;
    private static longRangeDistance: number;

    constructor(defaultDistance: number, longRangeDistance: number, longRangeFightType: FightType) {
        RangedWeaponType.defaultDistance = defaultDistance;
        RangedWeaponType.longRangeDistance = longRangeDistance;
        RangedWeaponType.longRangeFightType = longRangeFightType;
    }

    public getDefaultDistance(): number {
        return RangedWeaponType.defaultDistance;
    }

    public getLongRangeDistance(): number {
        return RangedWeaponType.longRangeDistance;
    }

    public getLongRangeFightType(): FightType {
        return RangedWeaponType.longRangeFightType;
    }

}

export class RangedWeapon {
    public static readonly LONGBOW = new RangedWeapon([839], [Ammunition.BRONZE_ARROW], RangedWeaponType.LONGBOW)
    public static readonly SHORTBOW = new RangedWeapon([841], [Ammunition.BRONZE_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly OAK_LONGBOW = new RangedWeapon([845], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.LONGBOW)
    public static readonly OAK_SHORTBOW = new RangedWeapon([843], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly WILLOW_LONGBOW = new RangedWeapon([847], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.LONGBOW)
    public static readonly WILLOW_SHORTBOW = new RangedWeapon([849], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly MAPLE_LONGBOW = new RangedWeapon([851], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.LONGBOW)
    public static readonly MAPLE_SHORTBOW = new RangedWeapon([853], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly YEW_LONGBOW = new RangedWeapon([855], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.LONGBOW)
    public static readonly YEW_SHORTBOW = new RangedWeapon([857], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly MAGIC_LONGBOW = new RangedWeapon([859], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.LONGBOW)
    public static readonly MAGIC_SHORTBOW = new RangedWeapon([861, 6724], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly GODBOW = new RangedWeapon([19143, 19149, 19146], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW)
    public static readonly ZARYTE_BOW = new RangedWeapon([20171], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW)

    public static readonly DARK_BOW = new RangedWeapon([11235, 13405, 15701, 15702, 15703, 15704], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.LONGBOW)

    public static readonly BRONZE_CROSSBOW = new RangedWeapon([9174], [Ammunition.BRONZE_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly IRON_CROSSBOW = new RangedWeapon([9177], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly STEEL_CROSSBOW = new RangedWeapon([9179], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly MITHRIL_CROSSBOW = new RangedWeapon([9181], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly ADAMANT_CROSSBOW = new RangedWeapon([9183], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly RUNE_CROSSBOW = new RangedWeapon([9185], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT], RangedWeaponType.CROSSBOW)
    public static readonly ARMADYL_CROSSBOW = new RangedWeapon([ItemIdentifiers.ARMADYL_CROSSBOW], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT, Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT], RangedWeaponType.CROSSBOW)

    public static readonly BRONZE_DART = new RangedWeapon([806], [Ammunition.BRONZE_DART], RangedWeaponType.DART)
    public static readonly IRON_DART = new RangedWeapon([807], [Ammunition.IRON_DART], RangedWeaponType.DART)
    public static readonly STEEL_DART = new RangedWeapon([808], [Ammunition.STEEL_DART], RangedWeaponType.DART)
    public static readonly MITHRIL_DART = new RangedWeapon([809], [Ammunition.MITHRIL_DART], RangedWeaponType.DART)
    public static readonly ADAMANT_DART = new RangedWeapon([810], [Ammunition.ADAMANT_DART], RangedWeaponType.DART)
    public static readonly RUNE_DART = new RangedWeapon([811], [Ammunition.RUNE_DART], RangedWeaponType.DART)
    public static readonly DRAGON_DART = new RangedWeapon([11230], [(Ammunition.DRAGON_DART)], RangedWeaponType.DART)


    public static readonly BRONZE_KNIFE = new RangedWeapon([864, 870, 5654], [Ammunition.BRONZE_KNIFE], RangedWeaponType.KNIFE)
    public static readonly IRON_KNIFE = new RangedWeapon([863, 871, 5655], [Ammunition.IRON_KNIFE], RangedWeaponType.KNIFE)
    public static readonly STEEL_KNIFE = new RangedWeapon([865, 872, 5656], [Ammunition.STEEL_KNIFE], RangedWeaponType.KNIFE)
    public static readonly BLACK_KNIFE = new RangedWeapon([869, 874, 5658], [Ammunition.BLACK_KNIFE], RangedWeaponType.KNIFE)
    public static readonly MITHRIL_KNIFE = new RangedWeapon([866, 873, 5657], [Ammunition.MITHRIL_KNIFE], RangedWeaponType.KNIFE)
    public static readonly ADAMANT_KNIFE = new RangedWeapon([867, 875, 5659], [Ammunition.ADAMANT_KNIFE], RangedWeaponType.KNIFE)
    public static readonly RUNE_KNIFE = new RangedWeapon([868, 876, 5660, 5667], [Ammunition.RUNE_KNIFE], RangedWeaponType.KNIFE)

    public static readonly TOKTZ_XIL_UL = new RangedWeapon([6522], [Ammunition.TOKTZ_XIL_UL], RangedWeaponType.TOKTZ_XIL_UL)

    public static readonly KARILS_CROSSBOW = new RangedWeapon([4734], [Ammunition.BOLT_RACK], RangedWeaponType.CROSSBOW)

    public static readonly BALLISTA = new RangedWeapon([19478, 19481], [Ammunition.BRONZE_JAVELIN, Ammunition.IRON_JAVELIN, Ammunition.STEEL_JAVELIN, Ammunition.MITHRIL_JAVELIN, Ammunition.ADAMANT_JAVELIN, Ammunition.RUNE_JAVELIN, Ammunition.DRAGON_JAVELIN], RangedWeaponType.BALLISTA)

    public static readonly TOXIC_BLOWPIPE = new RangedWeapon([12926], [Ammunition.DRAGON_DART], RangedWeaponType.BLOWPIPE)




    private weaponIds: number[];
    private ammunitionData: Ammunition[];
    private type: RangedWeaponType;
    private static rangedWeapons: Map<number, RangedWeapon> = new Map<number, RangedWeapon>();


    constructor(weaponIds: number[], ammunitionData: Ammunition[], type: RangedWeaponType) {
        this.weaponIds = weaponIds;
        this.ammunitionData = ammunitionData;
        this.type = type;
    }

    public static getFor(p: Player): RangedWeapon {
        const weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        return RangedWeapon.rangedWeapons.get(weapon);
    }

    public getWeaponIds(): number[] {
        return this.weaponIds;
    }

    public getAmmunitionData(): Ammunition[] {
        return this.ammunitionData;
    }

    public getType(): RangedWeaponType {
        return this.type;
    }

    static {
        for (const data of Object.values(RangedWeapon)) {
            for (const i of data.getWeaponIds()) {
                RangedWeapon.rangedWeapons.set(i, data);
            }
        }
    }
}



