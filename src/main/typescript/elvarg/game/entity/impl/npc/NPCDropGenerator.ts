import { DropTable, NpcDropDefinition, NPCDrop, RDT } from "../../../definition/NpcDropDefinition";
import { ItemOnGroundManager } from "../grounditem/ItemOnGroundManager";
import { Player } from "../player/Player";
import { Item } from "../../../model/Item";
import { Equipment } from "../../../model/container/impl/Equipment";
import { RandomGen } from "../../../../util/RandomGen";
import { NPC } from "./NPC";

export class NPCDropGenerator {
    private player: Player;
    private def: NpcDropDefinition;

    constructor(player: Player, def: NpcDropDefinition) {
        this.player = player;
        this.def = def;
    }

    public static start(player: Player, npc: NPC) {
        let def = NpcDropDefinition.get(npc.getId());
        if (def) {
            let gen = new NPCDropGenerator(player, def);
            for (let item of gen.getDropList()) {
                if (!item.getDefinition().isStackable()) {
                    for (let i = 0; i < item.getAmount(); i++) {
                        ItemOnGroundManager.registerLocation(player, new Item(item.getId(), 1), npc.getLocation());
                    }
                } else {
                    ItemOnGroundManager.registerLocation(player, item, npc.getLocation());
                }
            }
        }
    }

    public getDropList(): Item[] {
        // The {@RandomGen} which will help us randomize drops..
        let random = new RandomGen();

        // The list containing the {@link Item} that will be dropped for the player.
        let items: Item[] = [];

        // The list containing the drop tables which we've gone through.
        let parsedTables: DropTable[] = [];

        // Drop "always" items..
        if (this.def.getAlwaysDrops() != null) {
            for (let drop of this.def.getAlwaysDrops()) {
                items.push(drop.toItem(random));
            }
        }

        // Handle RDT.. If a drop is generated from RDT, no further items should be
        // given.
        // There are 128 slots in the rdt, many empty. When a player is wearing ring of
        // wealth, the empty slots are not counted.
        if (this.def.getRdtChance() > 0 && Math.floor(Math.random() * this.def.getRdtChance()) == 0) {
            let rdtLength = Object.keys(RDT).length / 2;
            let slots = this.wearingRingOfWealth() ? rdtLength : 128;
            let slot = Math.floor(Math.random() * slots);
            if (slot < rdtLength) {
                let rdtDrop = RDT[slot];
                if (Math.floor(Math.random() * rdtDrop.getChance()) == 0) {
                    items.push(new Item(rdtDrop.getItemId(), rdtDrop.getAmount()));
                    return items;
                }
            }
        }
        // Handle unique drops..
        // The amount of items the player will receive from the unique drop tables.
        // Note: A player cannot receive multiple drops from the same drop table.
        const rolls = 1 + Math.floor(random.getRandom() * 3);
        for (let i = 0; i < rolls; i++) {
            let table: DropTable | undefined;

            // Check if we should access the special drop table..
            if (this.def.getSpecialDrops() != null && !parsedTables.includes(DropTable.SPECIAL)) {
                if (this.def.getSpecialDrops().length > 0) {
                  const drop = this.def.getSpecialDrops()[Math.floor(random.getRandom() * this.def.getSpecialDrops().length)];
                  if (Math.floor(random.getRandom() * drop.getChance()) === 0) {
                    items.push(drop.toItem(random));
                    parsedTables.push(DropTable.SPECIAL);
                    continue;
                  }
                }
              }
            // If we didn't get a special drop, attempt to find a different table..
            if (!table) {
                let chance = Math.random() * 100;
                if ((table = this.getDropTable(chance)) != undefined) {
                    // Make sure we haven't already parsed this table.
                    if (parsedTables.includes(table)) {
                        continue;
                    }
                    // Get the items related to this drop table..
                    let dropTableItems: NPCDrop[] | undefined;
                    switch (table) {
                        case DropTable.COMMON:
                            if (this.def.getCommonDrops() != null) {
                                dropTableItems = this.def.getCommonDrops();
                            }
                            break;
                        case DropTable.UNCOMMON:
                            if (this.def.getUncommonDrops() != null) {
                                dropTableItems = this.def.getUncommonDrops();
                            }
                            break;
                        case DropTable.RARE:
                            if (this.def.getRareDrops() != null) {
                                dropTableItems = this.def.getRareDrops();
                            }
                            break;
                        case DropTable.VERY_RARE:
                            if (this.def.getVeryRareDrops() != null) {
                                dropTableItems = this.def.getVeryRareDrops();
                            }
                            break;
                        default:
                            break;
                    }
                    if (!dropTableItems) {
                        continue;
                    }
                    // Get a random drop from the table..
                    let npcDrop = dropTableItems[Math.floor(random.getRandom() * dropTableItems.length)];

                    // Add the drop to the drop list.
                    items.push(npcDrop.toItem(random));

                    // Flag this table as visited..
                    parsedTables.push(table);
                }
            }
        }
        return items;
    }
    /**
     * Checks if the player is wearing a ring of wealth which will increase the
     * chances for getting a good drop.
     *
     * @return
     */
    public wearingRingOfWealth(): boolean {
        return this.player.getEquipment().getItems()[Equipment.RING_SLOT].getId() == 2572;
    }
    /**
     * Attempts to fetch the drop table for the given chance.
     *
     * @param drop
     * @return
     */
    public getDropTable(chance: number): DropTable | undefined {
        let table
        // Fetch one of the ordinary drop tables
        // based on our chance.
        for (let dropTable of Object.values(DropTable)) {
            if (dropTable.getRandomRequired() >= 0) {
                if (chance <= dropTable.getRandomRequired()) {
                    table = dropTable;
                }
            }
        }
        return table;
    }
}