import { WeaponInterfaces } from "./WeaponInterfaces";
import { AbyssalDaggerCombatMethod } from "./method/impl/specials/AbyssalDaggerCombatMethod";
import { AbyssalTentacleCombatMethod } from './method/impl/specials/AbyssalTentacleCombatMethod'
import { BarrelchestAnchorCombatMethod } from './method/impl/specials/BarrelchestAnchorCombatMethod'
import { DragonScimitarCombatMethod } from './method/impl/specials/DragonScimitarCombatMethod'
import { DragonLongswordCombatMethod } from './method/impl/specials/DragonLongswordCombatMethod'
import { DragonMaceCombatMethod } from './method/impl/specials/DragonMaceCombatMethod'
import { DragonWarhammerCombatMethod } from './method/impl/specials/DragonWarhammerCombatMethod'
import { SaradominSwordCombatMethod } from './method/impl/specials/SaradominSwordCombatMethod'
import { AbyssalWhipCombatMethod } from './method/impl/specials/AbyssalWhipCombatMethod'
import { ArmadylGodswordCombatMethod } from './method/impl/specials/ArmadylGodswordCombatMethod'
import { SaradominGodswordCombatMethod } from './method/impl/specials/SaradominGodswordCombatMethod'
import { BandosGodswordCombatMethod } from './method/impl/specials/BandosGodswordCombatMethod'
import { ZamorakGodswordCombatMethod } from './method/impl/specials/ZamorakGodswordCombatMethod'
import { AbyssalBludgeonCombatMethod } from './method/impl/specials/AbyssalBludgeonCombatMethod'
import { DragonHalberdCombatMethod } from './method/impl/specials/DragonHalberdCombatMethod'
import { DragonDaggerCombatMethod } from './method/impl/specials/DragonDaggerCombatMethod'
import { GraniteMaulCombatMethod } from './method/impl/specials/GraniteMaulCombatMethod'
import { DragonClawCombatMethod } from './method/impl/specials/DragonClawCombatMethod'
import { MagicShortbowCombatMethod } from './method/impl/specials/MagicShortbowCombatMethod'
import { DarkBowCombatMethod } from './method/impl/specials/DarkBowCombatMethod'
import { ArmadylCrossbowCombatMethod } from './method/impl/specials/ArmadylCrossbowCombatMethod'
import { BallistaCombatMethod } from './method/impl/specials/BallistaCombatMethod'
import { Mobile } from "../../entity/impl/Mobile";
import { Player } from "../../entity/impl/player/Player";
import { CombatFactory } from "./CombatFactory";
import { BonusManager } from "../../model/equipment/BonusManager";
import { CombatMethod } from "./method/CombatMethod";
import { CombatType } from "./CombatType";
import { TaskManager } from "../../task/TaskManager";
import { RestoreSpecialAttackTask } from '../../task/impl/RestoreSpecialAttackTask'
import { Equipment } from "../../model/container/impl/Equipment";
import { DuelRule } from "../Duelling";



export class CombatSpecial {
    public static readonly ABYSSAL_WHIP = new CombatSpecial (
        [4151, 21371, 15441, 15442, 15443, 15444],
        50,
        1,
        1,
        new AbyssalWhipCombatMethod(),
        WeaponInterfaces.WHIP
    )
    public static readonly ABYSSAL_TENTACLE = new CombatSpecial(
        [12006],
        50,
        1,
        1,
        new AbyssalTentacleCombatMethod(),
        WeaponInterfaces.WHIP
    )
    public static readonly BARRELSCHEST_ANCHOR = new CombatSpecial(
        [10887],
        50,
        1.22,
        1.10,
        new BarrelchestAnchorCombatMethod(),
        WeaponInterfaces.WARHAMMER
    )
    public static readonly DRAGON_SCIMITAR = new CombatSpecial(
        [4587],
        55,
        1.00,
        1.25,
        new DragonScimitarCombatMethod(),
        WeaponInterfaces.SCIMITAR
    )
    public static readonly DRAGON_LONGSWORD = new CombatSpecial(
        [1305],
        25,
        1.15,
        1.25,
        new DragonLongswordCombatMethod(),
        WeaponInterfaces.LONGSWORD
    )
    public static readonly DRAGON_MACE =  new CombatSpecial(
        [1434],
        25,
        1.5,
        1.25,
        new DragonMaceCombatMethod(),
        WeaponInterfaces.MACE
    )
    public static readonly DRAGON_WARHAMMER =  new CombatSpecial (
        [13576],
        50,
        1.5,
        1.00,
        new DragonWarhammerCombatMethod(),
        WeaponInterfaces.WARHAMMER
    )
    public static readonly SARADOMIN_SWORD = new CombatSpecial(
        [11838],
        100,
        1.0,
        1.0,
        new SaradominSwordCombatMethod(),
        WeaponInterfaces.SARADOMIN_SWORD
    )
    public static readonly ARMADYL_GODSWORD = new CombatSpecial(
        [11802],
        50,
        1.375,
        2,
        new ArmadylGodswordCombatMethod(),
        WeaponInterfaces.GODSWORD
    )
    public static readonly SARADOMIN_GODSWORD = new CombatSpecial(
        [11806],
        50,
        1.1,
        1.5,
        new SaradominGodswordCombatMethod(),
        WeaponInterfaces.GODSWORD
    )
    public static readonly BANDOS_GODSWORD = new CombatSpecial(
        [11804],
        100,
        1.21,
        1.5,
        new BandosGodswordCombatMethod(),
        WeaponInterfaces.GODSWORD
    )
    public static readonly ZAMORAK_GODSWORD = new CombatSpecial(
        [11808],
        50,
        1.1,
        1.5,
        new ZamorakGodswordCombatMethod(),
        WeaponInterfaces.GODSWORD
    )
    public static readonly ABYSSAL_BLUDGEON = new CombatSpecial(
        [13263],
        50,
        1.20,
        1.0,
        new AbyssalBludgeonCombatMethod(),
        WeaponInterfaces.ABYSSAL_BLUDGEON
    )
    public static readonly DRAGON_HALBERD = new CombatSpecial(
        [3204],
        30,
        1.1,
        1.35,
        new DragonHalberdCombatMethod(),
        WeaponInterfaces.HALBERD
    )
    public static readonly DRAGON_DAGGER = new CombatSpecial(
        [1215, 1231, 5680, 5698],
        25,
        1.15,
        1.20,
        new DragonDaggerCombatMethod(),
        WeaponInterfaces.DRAGON_DAGGER
    )
    public static readonly ABYSSAL_DAGGER = new CombatSpecial (
        [13271],
        50,
        0.85,
        1.25,
        new AbyssalDaggerCombatMethod(),
        WeaponInterfaces.ABYSSAL_DAGGER
    )
    public static readonly GRANITE_MAUL = new CombatSpecial(
        [4153, 12848],
        50,
        1,
        1,
        new GraniteMaulCombatMethod(),
        WeaponInterfaces.GRANITE_MAUL
    )
    public static readonly DRAGON_CLAWS = new CombatSpecial(
        [13652],
        50,
        1,
        1.35,
        new DragonClawCombatMethod(),
        WeaponInterfaces.CLAWS
    )
    public static readonly MAGIC_SHORTBOW = new CombatSpecial(
        [861],
        55,
        1,
        1,
        new MagicShortbowCombatMethod(),
        WeaponInterfaces.SHORTBOW
    )
    public static readonly DARK_BOW = new CombatSpecial(
        [11235],
        55,
        1.5,
        1.35,
        new DarkBowCombatMethod(),
        WeaponInterfaces.DARK_BOW
    )
    public static readonly ARMADYL_CROSSBOW = new CombatSpecial(
        [11785],
        40,
        1,
        2.0,
        new ArmadylCrossbowCombatMethod(),
        WeaponInterfaces.CROSSBOW
    )
    public static readonly BALLISTA = new CombatSpecial(
        [19481],
        65,
        1.25,
        1.45,
        new BallistaCombatMethod(),
        WeaponInterfaces.BALLISTA
    )

    constructor(identifiers: any, drainAmount: number, strengthMultiplier: number, accuracyMultiplier: number, combatMethod: CombatMethod, weaponInterface: WeaponInterfaces){
        this.identifiers = identifiers
        this.drainAmount = drainAmount
        this.strengthMultiplier = strengthMultiplier
        this.accuracyMultiplier = accuracyMultiplier
        this.combatMethod = combatMethod
        this.weaponInterface = weaponInterface
    }

    SPECIAL_ATTACK_WEAPON_IDS = new Set(Object.values(CombatSpecial).flatMap((cs) => cs.identifiers));

    private drainAmount: number;
    private strengthMultiplier: number;
    private accuracyMultiplier: number;
    private combatMethod: any;
    private weaponType: any;
    private weaponInterface: WeaponInterfaces
    private identifiers: [];


    public static checkSpecial(player: Player, special: CombatSpecial): boolean {
        return (Player.getCombatSpecial() != null && Player.getCombatSpecial() == special && player.isSpecialActivated() && player.getSpecialPercentage() >= special.getDrainAmount());
    }

    public static drain(character: Mobile, amount: number) {
        character.decrementSpecialPercentage(amount);

        if (!character.isRecoveringSpecialAttack()) {
            TaskManager.submit(new RestoreSpecialAttackTask(character));
        }

        if (character.isPlayer()) {
            let p = character.getAsPlayer();
            CombatSpecial.updateBar(p);
        }
    }

    public static updateBar(player: Player) {
        if (player.getWeapon().getSpecialBar() == -1 || player.getWeapon().getSpecialMeter() == -1) {
            return;
        }
        let specialCheck = 10;
        let specialBar = player.getWeapon().getSpecialMeter();
        let specialAmount = player.getSpecialPercentage() / 10;

        for (let i = 0; i < 10; i++) {
            player.getPacketSender().sendInterfaceComponentMoval(specialAmount >= specialCheck ? 500 : 0, 0, --specialBar);
            specialCheck--;
        }
        player.getPacketSender().updateSpecialAttackOrb().sendString(
            player.isSpecialActivated() ? ("@yel@ Special Attack (" + player.getSpecialPercentage() + "%)") : ("@bla@ Special Attack (" + player.getSpecialPercentage() + "%)"), player.getWeapon().getSpecialMeter());
        player.getPacketSender().sendSpecialAttackState(player.isSpecialActivated());
    }

    public static assign(player: Player) {
        if (player.getWeapon().getSpecialBar() == -1) {
            player.setSpecialActivated(false);
            player.setCombatSpecial(null);
            CombatSpecial.updateBar(player);
            return;
        }

        for (let c of Object.values(CombatSpecial)) {
            if (player.getWeapon() == c.getWeaponType()) {
                if (c.identifiers.some(id => player.getEquipment().get(Equipment.WEAPON_SLOT).getId() == id)) {
                    player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), false);
                    player.setCombatSpecial(c);
                    return;
                }
            }
        }

        player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), true);
        player.setCombatSpecial(null);
        player.setSpecialActivated(false);
        player.getPacketSender().sendSpecialAttackState(false);
    }

    public static activate(player: Player) {
        if (Player.getCombatSpecial() == null) {
            return;
        }

        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_SPECIAL_ATTACKS.getButtonId()]) {
            return;
        }

        if (player.isSpecialActivated()) {
            player.setSpecialActivated(false);
            CombatSpecial.updateBar(player);
        } else {
            const spec = Player.getCombatSpecial();
            player.setSpecialActivated(true);
            CombatSpecial.updateBar(player);

            if (spec == CombatSpecial.GRANITE_MAUL) {
                if (player.getSpecialPercentage() < Player.getCombatSpecial().getDrainAmount()) {
                    player.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                    player.setSpecialActivated(false);
                    CombatSpecial.updateBar(player);
                    return;
                }

                const target = player.getCombat().getTarget();
                if (target != null && CombatFactory.getMethod(player).type() == CombatType.MELEE) {
                    player.getCombat().performNewAttack(true);
                    return;
                } else {
                    // Uninformed player using gmaul without being in combat..
                    // Teach them a lesson!
                    player.getPacketSender()
                        .sendMessage("Although not required, the Granite maul special attack should be used during")
                        .sendMessage("combat for maximum effect.");
                }
            }
        }

        if (player.getInterfaceId() == BonusManager.INTERFACE_ID) {
            BonusManager.update(player);
        }
    }

    public getIdentifiers(): number[] {
        return this.identifiers;
    }

    public getDrainAmount(): number {
        return this.drainAmount;
    }

    public getStrengthMultiplier(): number {
        return this.strengthMultiplier;
    }

    public getAccuracyMultiplier(): number {
        return this.accuracyMultiplier;
    }

    public getCombatMethod(): CombatMethod {
        return this.combatMethod;
    }

    public getWeaponType(): WeaponInterfaces {
        return this.weaponType;
    }

}

