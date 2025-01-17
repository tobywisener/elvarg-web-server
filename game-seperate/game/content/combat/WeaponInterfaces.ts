import { Equipment } from "../../model/container/impl/Equipment";
import { Player } from "../../entity/impl/player/Player";
import { FightType } from "../combat/FightType"
import { CombatSpecial } from "./CombatSpecial";
import { FightStyle } from "./FightStyle";


export class WeaponInterfaces {

    /**
     * Assigns an interface to the combat sidebar based on the argued weapon.
     *
     * @param player the player that the interface will be assigned for.
     */
    public static assign(player: Player) {
        let equippedWeapon = player.getEquipment().getItems()[Equipment.WEAPON_SLOT];
        let weapon = WeaponInterfaces.UNARMED;

        //Get the currently equipped weapon's interface
        if (equippedWeapon.getId() > 0) {
            if (equippedWeapon.getDefinition().getWeaponInterface() != null) {
                weapon = equippedWeapon.getDefinition().getWeaponInterface();
            }
        }

        if (weapon == WeaponInterfaces.UNARMED) {
            player.getPacketSender().sendTabInterface(0, weapon.getInterfaceId());
            player.getPacketSender().sendString("Unarmed", weapon.getNameLineId());
            player.setWeapon(WeaponInterfaces.UNARMED);
        } else if (weapon == WeaponInterfaces.CROSSBOW) {
            player.getPacketSender().sendString("Weapon: ", weapon.getNameLineId() - 1,);
        } else if (weapon == WeaponInterfaces.WHIP) {
            player.getPacketSender().sendString("Weapon: ", weapon.getNameLineId() - 1);
        }

        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, 200, item);
        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, item, 0, 1);

        player.getPacketSender().sendTabInterface(0,
            weapon.getInterfaceId());
        player.getPacketSender().sendString(
(weapon == WeaponInterfaces.UNARMED ? "Unarmed" : equippedWeapon.getDefinition().getName()), weapon.getNameLineId());
        player.setWeapon(weapon);
        CombatSpecial.assign(player);
        CombatSpecial.updateBar(player);

        //Search for an attack style matching ours
        /*  for (const type of weapon.getFightType()) {
                if (type.getStyle() == player.getCombat().getFightType().getStyle()) {
                    player.setFightType(type);
                    player.getPacketSender().sendConfig(player.getCombat().getFightType().getParentId(), player.getCombat().getFightType().getChildId());
                    return;
                }
            }*/

        //Set default attack style to aggressive!
        for (const type of Object.values(weapon.getFightType())) {
            if (type instanceof FightType) {
                if (FightType.getStyle() == FightStyle.AGGRESSIVE) {
                    player.setFightType(type);
                    player.getPacketSender().sendConfig(FightType.getParentId(), FightType.getChildId());
                    return;
                }
            }
        }

        //Still no proper attack style.
        //Set it to the first one..
        player.setFightType(player.getWeapon().getFightType()[0]);
        player.getPacketSender().sendConfig(FightType.getParentId(), FightType.getChildId());
    }

    public static changeCombatSettings(player: Player, button: number): boolean {
        switch (button) {
            case 1772: // shortbow & longbow
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_ACCURATE);
                }
                return true;
            case 1771:
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_RAPID);
                }
                return true;
            case 1770:
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_LONGRANGE);
                }
                return true;
            case 2282: // dagger & sword
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType.DAGGER_STAB);
                } else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_STAB);
                } else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType.SWORD_STAB);
                } else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_STAB);
                }
                return true;
            case 2285:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType.DAGGER_LUNGE);
                } else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_LUNGE);
                } else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType.SWORD_LUNGE);
                } else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_LUNGE);
                }
                return true;
            case 2284:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType.DAGGER_SLASH);
                } else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_SLASH);
                } else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType.SWORD_SLASH);
                } else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_SLASH);
                }
                return true;
            case 2283:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType.DAGGER_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType.SWORD_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_BLOCK);
                }
                return true;
            case 2429: // scimitar & longsword
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_CHOP);
                } else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_CHOP);
                }
                return true;
            case 2432:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_SLASH);
                } else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_SLASH);
                }
                return true;
            case 2431:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_LUNGE);
                } else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_LUNGE);
                }
                return true;
            case 2430:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_BLOCK);
                }
                return true;
            case 3802: // mace
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_POUND);
                } else {
                    player.setFightType(FightType.MACE_POUND);
                }
                return true;
            case 3805:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_PUMMEL);
                } else {
                    player.setFightType(FightType.MACE_PUMMEL);
                }
                return true;
            case 3804:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_SPIKE);
                } else {
                    player.setFightType(FightType.MACE_SPIKE);
                }
                return true;
            case 3803:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_BLOCK);
                } else {
                    player.setFightType(FightType.MACE_BLOCK);
                }
                return true;
            case 4454: // knife, thrownaxe, dart & javelin
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType.KNIFE_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType.DART_ACCURATE);
                } else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_ACCURATE);
                }
                return true;
            case 4453:
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType.KNIFE_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType.DART_RAPID);
                } else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_RAPID);
                }
                return true;
            case 4452:
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType.KNIFE_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType.DART_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_LONGRANGE);
                }
                return true;
            case 4685: // spear
                player.setFightType(FightType.SPEAR_LUNGE);
                return true;
            case 4688:
                player.setFightType(FightType.SPEAR_SWIPE);
                return true;
            case 4687:
                player.setFightType(FightType.SPEAR_POUND);
                return true;
            case 4686:
                player.setFightType(FightType.SPEAR_BLOCK);
                return true;
            case 4711: // 2h sword
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_CHOP : FightType.TWOHANDEDSWORD_CHOP);
                return true;
            case 4714:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_SLASH : FightType.TWOHANDEDSWORD_SLASH);
                return true;
            case 4713:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_SMASH : FightType.TWOHANDEDSWORD_SMASH);
                return true;
            case 4712:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_BLOCK : FightType.TWOHANDEDSWORD_BLOCK);
                return true;
            case 5576: // pickaxe
                player.setFightType(FightType.PICKAXE_SPIKE);
                return true;
            case 5579:
                player.setFightType(FightType.PICKAXE_IMPALE);
                return true;
            case 5578:
                player.setFightType(FightType.PICKAXE_SMASH);
                return true;
            case 5577:
                player.setFightType(FightType.PICKAXE_BLOCK);
                return true;
            case 7768: // claws
                player.setFightType(FightType.CLAWS_CHOP);
                return true;
            case 7771:
                player.setFightType(FightType.CLAWS_SLASH);
                return true;
            case 7770:
                player.setFightType(FightType.CLAWS_LUNGE);
                return true;
            case 7769:
                player.setFightType(FightType.CLAWS_BLOCK);
                return true;
            case 8466: // halberd
                player.setFightType(FightType.HALBERD_JAB);
                return true;
            case 8468:
                player.setFightType(FightType.HALBERD_SWIPE);
                return true;
            case 8467:
                player.setFightType(FightType.HALBERD_FEND);
                return true;
            case 5861: // unarmed
                player.setFightType(FightType.UNARMED_BLOCK);
                return true;
            case 5862:
                player.setFightType(FightType.UNARMED_KICK);
                return true;
            case 5860:
                player.setFightType(FightType.UNARMED_PUNCH);
                return true;
            case 12298: // whip
                player.setFightType(FightType.WHIP_FLICK);
                return true;
            case 12297:
                player.setFightType(FightType.WHIP_LASH);
                return true;
            case 12296:
                player.setFightType(FightType.WHIP_DEFLECT);
                return true;
            case 336: // staff
                player.setFightType(FightType.STAFF_BASH);
                return true;
            case 335:
                player.setFightType(FightType.STAFF_POUND);
                return true;
            case 334:
                player.setFightType(FightType.STAFF_FOCUS);
                return true;
            case 433: // warhammer
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_POUND);
                } else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType.MAUL_POUND);
                } else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_POUND);
                } else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_POUND);
                }
                return true;
            case 432:
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_PUMMEL);
                } else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType.MAUL_PUMMEL);
                } else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_PUMMEL);
                } else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_PUMMEL);
                }
                return true;
            case 431:
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType.MAUL_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_BLOCK);
                } else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_BLOCK);
                }
                return true;
            case 782: // scythe
                player.setFightType(FightType.SCYTHE_REAP);
                return true;
            case 784:
                player.setFightType(FightType.SCYTHE_CHOP);
                return true;
            case 785:
                player.setFightType(FightType.SCYTHE_JAB);
                return true;
            case 783:
                player.setFightType(FightType.SCYTHE_BLOCK);
                return true;
            case 1704: // battle axe
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_CHOP);
                } else {
                    player.setFightType(FightType.BATTLEAXE_CHOP);
                }
                return true;
            case 1707:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_HACK);
                } else {
                    player.setFightType(FightType.BATTLEAXE_HACK);
                }
                return true;
            case 1706:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_SMASH);
                } else {
                    player.setFightType(FightType.BATTLEAXE_SMASH);
                }
                return true;
            case 1705:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_BLOCK);
                } else {
                    player.setFightType(FightType.BATTLEAXE_BLOCK);
                }
                return true;
            case 29138:
            case 29038:
            case 29063:
            case 29113:
            case 29163:
            case 29188:
            case 29213:
            case 29238:
            case 30007:
            case 48023:
            case 33033:
            case 30108:
            case 7473:
            case 7562:
            case 7487:
            case 7788:
            case 8481:
            case 7612:
            case 7587:
            case 7662:
            case 7462:
            case 7548:
            case 7687:
            case 7537:
            case 7623:
            case 12322:
            case 7637:
            case 12311:
            case 155:
                CombatSpecial.activate(player);
                return true;
        }
        return false;
    }

    public static readonly STAFF = new WeaponInterfaces(
        328,
        355,
        5,
        [FightType.STAFF_BASH, FightType.STAFF_POUND, FightType.STAFF_FOCUS]
    )
    public static readonly WARHAMMER = new WeaponInterfaces(
        425,
        428,
        6,
        [FightType.WARHAMMER_POUND,
        FightType.WARHAMMER_PUMMEL, FightType.WARHAMMER_BLOCK],
        7474,
        7486 
    )

    public static readonly MAUL = new WeaponInterfaces(
        425,
        428,
        7,
        [FightType.MAUL_POUND,
        FightType.MAUL_PUMMEL, FightType.MAUL_BLOCK],
        7474,
        7486
    )

    public static readonly GRANITE_MAUL = new WeaponInterfaces(
        425,
        428,
        7,
        [FightType.GRANITE_MAUL_POUND,
        FightType.GRANITE_MAUL_PUMMEL, FightType.GRANITE_MAUL_BLOCK],
        7474,
        7486
    )

    public static readonly VERACS_FLAIL = new WeaponInterfaces(
        3796,
        3799,
        5,
        [FightType.VERACS_FLAIL_POUND,
        FightType.VERACS_FLAIL_PUMMEL, FightType.VERACS_FLAIL_SPIKE,
        FightType.VERACS_FLAIL_BLOCK],
        7624,
        7636
    )

    public static readonly SCYTHE = new WeaponInterfaces(
        776,
        779,
        4,
        [FightType.SCYTHE_REAP,
        FightType.SCYTHE_CHOP, FightType.SCYTHE_JAB,
        FightType.SCYTHE_BLOCK]
    )

    public static readonly BATTLEAXE = new WeaponInterfaces(
        1698,
        1701,
        5,
        [FightType.BATTLEAXE_CHOP,
        FightType.BATTLEAXE_HACK, FightType.BATTLEAXE_SMASH,
        FightType.BATTLEAXE_BLOCK],
        7499,
        7511
    
    )

    public static readonly GREATAXE = new WeaponInterfaces(
        1698,
        1701,
        7,
        [FightType.GREATAXE_CHOP,
        FightType.GREATAXE_HACK, FightType.GREATAXE_SMASH,
        FightType.GREATAXE_BLOCK],
        7499,
        7511
    )

    public static readonly CROSSBOW = new WeaponInterfaces(
        1764,
        1767,
        6,
        [FightType.CROSSBOW_ACCURATE,
        FightType.CROSSBOW_RAPID, FightType.CROSSBOW_LONGRANGE],
        7549,
        7561
    )

    public static readonly BALLISTA = new WeaponInterfaces(
        1764,
        1767,
        7,
        [FightType.BALLISTA_ACCURATE,
        FightType.BALLISTA_RAPID, FightType.BALLISTA_LONGRANGE],
        7549,
        7561
    )

    public static readonly BLOWPIPE = new WeaponInterfaces(
        1764,
        1767,
        3,
        [FightType.BLOWPIPE_ACCURATE,
        FightType.BLOWPIPE_RAPID, FightType.BLOWPIPE_LONGRANGE],
        7549,
        7561
    )

    public static readonly KARILS_CROSSBOW = new WeaponInterfaces(
        1764,
        1767,
        4,
        [FightType.KARILS_CROSSBOW_ACCURATE,
        FightType.KARILS_CROSSBOW_RAPID, FightType.KARILS_CROSSBOW_LONGRANGE],
        7549,
        7561
    )

    public static readonly SHORTBOW = new WeaponInterfaces(
        1764,
        1767,
        4,
        [FightType.SHORTBOW_ACCURATE,
        FightType.SHORTBOW_RAPID, FightType.SHORTBOW_LONGRANGE],
        7549,
        7561
    )
    
    public static readonly LONGBOW = new WeaponInterfaces(
        1764,
        1767,
        6,
        [FightType.LONGBOW_ACCURATE,
        FightType.LONGBOW_RAPID, FightType.LONGBOW_LONGRANGE],
        7549,
        7561
    )

    public static readonly DRAGON_DAGGER = new WeaponInterfaces(
        2276,
        2279,
        4,
        [FightType.DRAGON_DAGGER_STAB,
        FightType.DRAGON_DAGGER_LUNGE, FightType.DRAGON_DAGGER_SLASH,
        FightType.DRAGON_DAGGER_BLOCK],
        7574,
        7586
    )

    public static readonly ABYSSAL_DAGGER = new WeaponInterfaces(
        2276,
        2279,
        4,
        [FightType.DRAGON_DAGGER_STAB,
        FightType.DRAGON_DAGGER_LUNGE, FightType.DRAGON_DAGGER_SLASH,
        FightType.DRAGON_DAGGER_BLOCK],
        7574,
        7586
    )

    public static readonly DAGGER = new WeaponInterfaces(
        2276,
        2279,
        4,
        [FightType.DAGGER_STAB,
        FightType.DAGGER_LUNGE, FightType.DAGGER_SLASH,
        FightType.DAGGER_BLOCK],
        7574,
        7586
    )

    public static readonly SWORD = new WeaponInterfaces(
        2276,
        2279,
        5,
        [FightType.SWORD_STAB,
        FightType.SWORD_LUNGE, FightType.SWORD_SLASH,
        FightType.SWORD_BLOCK],
        7574,
        7586
    )

    public static readonly SCIMITAR = new WeaponInterfaces(
        2423,
        2426,
        4,
        [FightType.SCIMITAR_CHOP,
        FightType.SCIMITAR_SLASH, FightType.SCIMITAR_LUNGE,
        FightType.SCIMITAR_BLOCK],
        7599,
        7611
    )

    public static readonly LONGSWORD = new WeaponInterfaces(
        2423,
        2426,
        5,
        [FightType.LONGSWORD_CHOP,
        FightType.LONGSWORD_SLASH, FightType.LONGSWORD_LUNGE,
        FightType.LONGSWORD_BLOCK],
        7599,
        7611
    )

    public static readonly MACE = new WeaponInterfaces(
        3796,
        3799,
        5,
        [FightType.MACE_POUND,
        FightType.MACE_PUMMEL, FightType.MACE_SPIKE,
        FightType.MACE_BLOCK],
        7624,
        7636
    )

    public static readonly KNIFE = new WeaponInterfaces(
        4446,
        4449,
        3,
        [FightType.KNIFE_ACCURATE,
        FightType.KNIFE_RAPID, FightType.KNIFE_LONGRANGE],
        7649,
        7661
    )

    public static readonly OBBY_RINGS = new WeaponInterfaces(
        4446,
        4449,
        4,
        [FightType.OBBY_RING_ACCURATE,
        FightType.OBBY_RING_RAPID, FightType.OBBY_RING_LONGRANGE],
        7649,
        7661
    )

    public static readonly SPEAR = new WeaponInterfaces(
        4679,
        4682,
        5,
        [FightType.SPEAR_LUNGE,
        FightType.SPEAR_SWIPE, FightType.SPEAR_POUND,
        FightType.SPEAR_BLOCK],
        7674,
        7686
    )

    public static readonly TWO_HANDED_SWORD = new WeaponInterfaces(
        4705,
        4708,
        7,
        [FightType.TWOHANDEDSWORD_CHOP, FightType.TWOHANDEDSWORD_SLASH,
        FightType.TWOHANDEDSWORD_SMASH, FightType.TWOHANDEDSWORD_BLOCK],
        7699,
        7711
    )

    public static readonly PICKAXE = new WeaponInterfaces(
        5570,
        5573,
        5,
        [FightType.PICKAXE_SPIKE,
        FightType.PICKAXE_IMPALE, FightType.PICKAXE_SMASH,
        FightType.PICKAXE_BLOCK]
    )

    public static readonly CLAWS = new WeaponInterfaces(
        7762,
        7765,
        4,
        [FightType.CLAWS_CHOP,
        FightType.CLAWS_SLASH, FightType.CLAWS_LUNGE,
        FightType.CLAWS_BLOCK],
        7800,
        7812
    )

    public static readonly HALBERD = new WeaponInterfaces(
        8460,
        8463,
        7,
        [FightType.HALBERD_JAB,
        FightType.HALBERD_SWIPE, FightType.HALBERD_FEND],
        8493,
        8505
    )

    public static readonly UNARMED = new WeaponInterfaces(
        5855,
        5857,
        4,
        [FightType.UNARMED_PUNCH,
        FightType.UNARMED_KICK, FightType.UNARMED_BLOCK]
    )

    public static readonly WHIP = new WeaponInterfaces(
        12290,
        12293,
        4,
        [FightType.WHIP_FLICK,
        FightType.WHIP_LASH, FightType.WHIP_DEFLECT],
        12323,
        12335
    )

    public static readonly THROWNAXE = new WeaponInterfaces(
        4446,
        4449,
        4,
        [FightType.THROWNAXE_ACCURATE, FightType.THROWNAXE_RAPID,
        FightType.THROWNAXE_LONGRANGE],
        7649,
        7661
    )

    public static readonly DART = new WeaponInterfaces(
        4446,
        4449,
        3,
        [FightType.DART_ACCURATE,
        FightType.DART_RAPID, FightType.DART_LONGRANGE],
        7649,
        7661
    )

    public static readonly JAVELIN = new WeaponInterfaces(
        4446,
        4449,
        3,
        [FightType.JAVELIN_ACCURATE,
        FightType.JAVELIN_RAPID, FightType.JAVELIN_LONGRANGE],
        7649,
        7661
    )

    public static readonly ANCIENT_STAFF = new WeaponInterfaces(
        328,
        355,
        4,
        [FightType.STAFF_BASH, FightType.STAFF_POUND, FightType.STAFF_FOCUS]
    )

    public static readonly DARK_BOW = new WeaponInterfaces(
        1764,
        1767,
        8,
        [FightType.LONGBOW_ACCURATE,
        FightType.LONGBOW_RAPID, FightType.LONGBOW_LONGRANGE],
        7549,
        7561
    )

    public static readonly GODSWORD = new WeaponInterfaces(
        4705,
        4708,
        6,
        [FightType.GODSWORD_CHOP, FightType.GODSWORD_SLASH,
        FightType.GODSWORD_SMASH, FightType.GODSWORD_BLOCK],
        7699,
        7711
    )

    public static readonly ABYSSAL_BLUDGEON = new WeaponInterfaces(
        4705,
        4708,
        4,
        [FightType.ABYSSAL_BLUDGEON_CHOP, FightType.ABYSSAL_BLUDGEON_SLASH,
        FightType.ABYSSAL_BLUDGEON_SMASH, FightType.ABYSSAL_BLUDGEON_BLOCK],
        7699,
        7711
    )

    public static readonly SARADOMIN_SWORD = new WeaponInterfaces(
        4705,
        4708,
        4,
        [FightType.TWOHANDEDSWORD_CHOP, FightType.TWOHANDEDSWORD_SLASH,
        FightType.TWOHANDEDSWORD_SMASH, FightType.TWOHANDEDSWORD_BLOCK],
        7699,
        7711
    )

    public static readonly ELDER_MAUL = new WeaponInterfaces(
        425,
        428,
        6,
        [FightType.ELDER_MAUL_POUND,
        FightType.ELDER_MAUL_PUMMEL, FightType.ELDER_MAUL_BLOCK],
        7474,
        7486
    )

    public static readonly GHRAZI_RAPIER = new WeaponInterfaces(
        2276,
        2279,
        4,
        [FightType.GHRAZI_RAPIER_STAB,
        FightType.GHRAZI_RAPIER_LUNGE, FightType.GHRAZI_RAPIER_SLASH,
        FightType.GHRAZI_RAPIER_BLOCK],
        7574,
        7586
    )

    private interfaceId: number;
    private nameLineId: number;
    private speed: number;
    private fightType: {};
    private specialBar: number;
    private specialMeter: number;

    private constructor(interfaceId: number, nameLineId: number, speed: number,
        fightType: {}, specialBar?: number, specialMeter?: number) {
        this.interfaceId = interfaceId;
        this.nameLineId = nameLineId;
        this.speed = speed;
        this.fightType = fightType;
        this.specialBar = specialBar;
        this.specialMeter = specialMeter;
    }

    public getInterfaceId(): number {
        return this.interfaceId;
    }

    public getNameLineId(): number {
        return this.nameLineId;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getFightType(){
        return this.fightType;
    }

    public getSpecialBar(): number {
        return this.specialBar;
    }

    public getSpecialMeter(): number {
        return this.specialMeter;
    }
}