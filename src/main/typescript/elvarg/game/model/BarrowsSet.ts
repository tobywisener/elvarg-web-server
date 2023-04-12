import { Player } from "../entity/impl/player/Player";

const BarrowsSets = {
    GUTHANS_SET: [12873, 4724, 4726, 4728, 4730],
    VERACS_SET: [12875, 4753, 4755, 4757, 4759],
    TORAGS_SET: [12879, 4745, 4747, 4749, 4751],
    AHRIMS_SET: [12881, 4708, 4710, 4712, 4714],
    KARILS_SET: [12883, 4732, 4734, 4736, 4738],
    DHAROKS_SET: [12877, 4716, 4718, 4720, 4722],
}

export class BarrowsSet {
    private static sets = new Map<number, BarrowsSet>();

    static init() {
        for (let set of Object.values(BarrowsSet)) {
            for (let i of set.items) {
                BarrowsSet.sets.set(i, set);
            }
            BarrowsSet.sets.set(set.getSetId(), set);
        }
    }

    private readonly setId: number;
    private readonly items: number[];

    constructor(setId: number, ...items: number[]) {
        this.setId = setId;
        this.items = items;
    }

    static pack(player: Player, itemId: number): boolean {
        let set = BarrowsSet.sets.get(itemId);
        if (!set) {
            return false;
        }

        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return true;
        }

        for (let i of set.items) {
            if (!player.getInventory().contains(i)) {
                player.getPacketSender().sendMessage("You do not have enough components to make a set out of this armor.");
                return true;
            }
        }

        for (let i of set.items) {
            player.getInventory().deleteNumber(i, 1);
        }

        player.getInventory().adds(set.setId, 1);

        player.getPacketSender().sendMessage("You've made a set our of your armor.");
        return true;
    }

    static get(item: number): BarrowsSet {
        return BarrowsSet.sets.get(item);
    }

    getSetId(): number {
        return this.setId;
    }

    getItems(): number[] {
        return this.items;
    }
}
