import { WeaponInterfaces } from "../WeaponInterfaces";
import { Player } from "../../../entity/impl/player/Player";
import { Item } from "../../../model/Item";

export enum PlayerMagicStaffEnum {
    AIR = 'AIR',
    WATER = 'WATER',
    EARTH = 'EARTH',
    FIRE = 'FIRE',
    MUD = 'MUD',
    LAVA = 'LAVA',
}

export interface PlayerMagicStaffType {
    staves: number[];
    runes: number[];
}

export class PlayerMagicStaff {

    playerMagicStaff: { [key in PlayerMagicStaffEnum]: PlayerMagicStaffType } = {
        [PlayerMagicStaffEnum.AIR]: { staves: [1381, 1397, 1405], runes: [556] },
        [PlayerMagicStaffEnum.WATER]: { staves: [1383, 1395, 1403], runes: [555] },
        [PlayerMagicStaffEnum.EARTH]: { staves: [1385, 1399, 1407], runes: [557] },
        [PlayerMagicStaffEnum.FIRE]: { staves: [1387, 1393, 1401], runes: [554] },
        [PlayerMagicStaffEnum.MUD]: { staves: [6562, 6563], runes: [555, 557] },
        [PlayerMagicStaffEnum.LAVA]: { staves: [3053, 3054], runes: [554, 557] },
    }

    public static suppressRunes(player: Player, runesRequired: Item[]) {
        if (player.weapon === WeaponInterfaces.STAFF) {
            for (const magicStaff of Object.values(PlayerMagicStaff)) {
                if (player.equipment.containsAny(PlayerMagicStaff[magicStaff].staves)) {
                    for (const runeId of PlayerMagicStaff[magicStaff].runes) {
                        for (let i = 0; i < runesRequired.length; i++) {
                            if (runesRequired[i] && runesRequired[i].id === runeId) {
                                runesRequired[i] = null;
                            }
                        }
                    }
                }
            }
            return runesRequired;
        }
        return runesRequired;
    }
}