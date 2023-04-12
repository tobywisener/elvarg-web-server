import { Player } from "../../entity/impl/player/Player";
import { Equipment } from "../../model/container/impl/Equipment";
import { CombatType } from "./CombatType";
import { ItemIdentifiers } from "../../../util/ItemIdentifiers";
export class CombatEquipment {
    public static readonly MAGE_VOID_HELM = 11663;
    public static readonly RANGED_VOID_HELM = 11664;
    public static readonly MELEE_VOID_HELM = 11665;
    public static readonly VOID_ARMOUR = [
        Equipment.BODY_SLOT, 8839,
        Equipment.LEG_SLOT, 8840,
        Equipment.HANDS_SLOT, 8842
    ];
    public static readonly OBSIDIAN_WEAPONS = [
        746, 747, 6523, 6525, 6526, 6527, 6528
    ];
    private static readonly VOID_KNIGHT_DEFLECTOR = 19712;
    /**
 * Is the player wearing obsidian?
 *
 * @param player The player.
 * @return true if player is wearing obsidian, false otherwise.
 */
    public static wearingObsidian(player: Player): boolean {
        if (player.getEquipment().getItems()[2].getId() != 11128)
            return false;

        for (let weapon of CombatEquipment.OBSIDIAN_WEAPONS) {
            if (player.getEquipment().getItems()[3].getId() == weapon) {
                return true;
            }
        }
        return false;
    }

    /**
     * Is the player wearing void?
     *
     * @param player The player.
     * @return true if player is wearing void, false otherwise.
     */
    public static wearingVoid(player: Player, attackType: CombatType): boolean {
        let correctEquipment = 0;
        let helmet = attackType == CombatType.MAGIC ? CombatEquipment.MAGE_VOID_HELM :
            attackType == CombatType.RANGED ? CombatEquipment.RANGED_VOID_HELM : CombatEquipment.MELEE_VOID_HELM;
        for (let armour of CombatEquipment.VOID_ARMOUR) {
            if (player.getEquipment().getItems()[armour[0]].getId() == armour[1]) {
                correctEquipment++;
            }
        }
        if (player.getEquipment().getItems()[Equipment.SHIELD_SLOT].getId() == CombatEquipment.VOID_KNIGHT_DEFLECTOR) {
            correctEquipment++;
        }
        return correctEquipment >= 3 && player.getEquipment().getItems()[Equipment.HEAD_SLOT].getId() == helmet;
    }

    public static hasDragonProtectionGear(player: Player): boolean {
        return player.getEquipment().get(Equipment.SHIELD_SLOT).getId() == ItemIdentifiers.ANTI_DRAGON_SHIELD
            || player.getEquipment().get(Equipment.SHIELD_SLOT).getId() == ItemIdentifiers.DRAGONFIRE_SHIELD;
    }
}