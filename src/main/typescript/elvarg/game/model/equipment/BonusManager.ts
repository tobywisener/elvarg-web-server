import { Player } from "../../entity/impl/player/Player";
import { ItemDefinition } from "../../definition/ItemDefinition";
import { DamageFormulas } from "../../content/combat/formula/DamageFormulas";
import { RangedWeapon } from "../../content/combat/ranged/RangedData";
import { Ammunition } from "../../content/combat/ranged/RangedData";

export class BonusManager {
    public static readonly ATTACK_STAB = 0;
    public static readonly ATTACK_SLASH = 1;
    public static readonly ATTACK_CRUSH = 2;
    public static readonly ATTACK_MAGIC = 3;
    public static readonly ATTACK_RANGE = 4;

    public static readonly DEFENCE_STAB = 0;
    public static readonly DEFENCE_SLASH = 1;
    public static readonly DEFENCE_CRUSH = 2;
    public static readonly DEFENCE_MAGIC = 3;
    public static readonly DEFENCE_RANGE = 4;

    public static readonly STRENGTH = 0;
    public static readonly RANGED_STRENGTH = 1;
    public static readonly MAGIC_STRENGTH = 2;
    public static readonly PRAYER = 3;
    public static readonly INTERFACE_ID = 15106;
    private static readonly STRING_ID = [["1675", "Stab"],
    ["1676", "Slash"],
    ["1677", "Crush"],
    ["1678", "Magic"],
    ["1679", "Range"],
    ["1680", "Stab"],
    ["1681", "Slash"],
    ["1682", "Crush"],
    ["1683", "Magic"],
    ["1684", "Range"],
    ["1686", "Strength"],
    ["15118", "Ranged Strength"],
    ["1671", "Magic Strength"],
    ["1687", "Prayer"],
    ];
    private static readonly MELEE_MAXHIT_FRAME = 15115;
    private static readonly RANGED_MAXHIT_FRAME = 15116;
    private static readonly MAGIC_MAXHIT_FRAME = 15117;

    private attackBonus: number[] = new Array(5);
    private defenceBonus: number[] = new Array(5);
    private otherBonus: number[] = new Array(4);

    public static open(player: Player) {
        player.getPacketSender().sendInterface(BonusManager.INTERFACE_ID);
        BonusManager.update(player);
    }

    public static update(player: Player) {
        let totalBonuses = BonusManager.STRING_ID.length;
        let bonuses = new Array(totalBonuses);
        for (const item of player.getEquipment().getItems()) {
            const definition = ItemDefinition.forId(item.getId());
            if (definition.getBonuses() != null) {
                for (let i = 0; i < definition.getBonuses().length; i++) {
                    if (i == 11 && bonuses[i] != 0) {
                        continue;
                    }
                    bonuses[i] += definition.getBonuses()[i];
                }
            }
        }

        for (let i = 0; i < totalBonuses; i++) {
            if (i <= 4) {
                player.getBonusManager().attackBonus[i] = bonuses[i];
            } else if (i <= 9) {
                let index = i - 5;
                player.getBonusManager().defenceBonus[index] = bonuses[i];
            } else {
                let index = i - 10;
                player.getBonusManager().otherBonus[index] = bonuses[i];
            }
            player.getPacketSender().sendString( BonusManager.STRING_ID[i][1] + ": " + bonuses[i], Number.parseInt(BonusManager.STRING_ID[i][0]));
        }

        /**
         * Update maxhit frames on the interface.
         */
        if (player.getInterfaceId() == BonusManager.INTERFACE_ID) {

            // Update some combat data first,
            // including ranged ammunition/weapon
            player.getCombat().setAmmunition(Ammunition.getFor(player));
            player.getCombat().setRangedWeapon(RangedWeapon.getFor(player));

            player.getPacketSender().sendString("Melee maxhit: " + this.getDamageString(DamageFormulas.calculateMaxMeleeHit(player)), BonusManager.MELEE_MAXHIT_FRAME);
            player.getPacketSender().sendString("Ranged maxhit: " + this.getDamageString(DamageFormulas.calculateMaxRangedHit(player)), BonusManager.RANGED_MAXHIT_FRAME);
            player.getPacketSender().sendString("Magic maxhit: " + this.getDamageString(DamageFormulas.getMagicMaxhit(player)), BonusManager.MAGIC_MAXHIT_FRAME);
        }
    }

    public static getDamageString(damage: number): string {
        if (damage == 0) {
            return "---";
        }
        if (damage <= 10) {
            return "@red@" + damage;
        }
        if (damage <= 25) {
            return "@yel@" + damage;
        }
        return "@gre@" + damage;
    }

    public getAttackBonus(): number[] {
        return this.attackBonus;
    }

    public getDefenceBonus(): number[] {
        return this.defenceBonus;
    }

    public getOtherBonus(): number[] {
        return this.otherBonus;
    }
}