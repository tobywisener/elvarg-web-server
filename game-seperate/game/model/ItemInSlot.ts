import { Inventory } from "../model/container/impl/Inventory";

export class ItemInSlot {

    /**
     * The item id.
     */
    private id: number;

    /**
     * The inventory slot index of the item (0-27).
     */
    private slot: number;

    /**
     * An ItemInSlot object constructor.
     *
     * @param id     Item id.
     * @param slot Item slot.
     */
    private constructor(id: number, slot: number) {
        this.id = id;
        this.slot = slot;
    }

    /**
     * Gets the item's id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Gets the item slot.
     */
    public getSlot(): number {
        return this.slot;
    }

    public static getFromInventory(itemId: number, inventory: Inventory): ItemInSlot | null {

        // Search player's inventory for this.id
        let itemIds = inventory.getItemIdsArray();

        let slot = itemIds.findIndex(i => i === itemId);
        if (slot === -1) {
            return null;
        }
        return new ItemInSlot(itemId, slot);
    }
} 