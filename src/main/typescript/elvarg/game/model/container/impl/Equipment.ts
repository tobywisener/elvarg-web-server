import { ItemContainer } from "../ItemContainer";
import { Item } from "../../Item";
import { Player } from "../../../entity/impl/player/Player";
import { StackType } from "../StackType";
import { WeaponInterfaces } from "../../../content/combat/WeaponInterfaces";
import { ItemDefinition } from "../../../definition/ItemDefinition";
import { Inventory } from "./Inventory";

export class Equipment extends ItemContainer {

    public full(): ItemContainer {
        return this;
    }

    public static INVENTORY_INTERFACE_ID = 1688;
    public static EQUIPMENT_SCREEN_INTERFACE_ID = 15106;
    public static HEAD_SLOT = 0;
    public static CAPE_SLOT = 1;
    public static AMULET_SLOT = 2;
    public static WEAPON_SLOT = 3;
    public static BODY_SLOT = 4;
    public static SHIELD_SLOT = 5;
    public static LEG_SLOT = 7;
    public static HANDS_SLOT = 9;
    public static FEET_SLOT = 10;
    public static RING_SLOT = 12;
    public static AMMUNITION_SLOT = 13;
    public static NO_ITEM = new Item(-1);
    static ITEM_COUNT = 10;
    
    constructor(public player: Player) {
        super(player);
    }

    public static getItemCount(p: Player, s: string, inventory: boolean): number {
        let count = 0;
        for (let t of p.getEquipment().getItems()) {
            if (t == null || t.getId() < 1 || t.getAmount() < 1)
                continue;
            if (t.getDefinition().getName().toLowerCase().includes(s.toLowerCase()))
                count++;
        }
        if (inventory) {
            for (let t of p.getInventory().getItems()) {
                if (t == null || t.getId() < 1 || t.getAmount() < 1)
                    continue;
                if (t.getDefinition().getName().toLowerCase().includes(s.toLowerCase()))
                    count++;
            }
        }
        return count;
    }
    
    public capacity(): number {
        return 14;
    }
    
    public stackType(): StackType {
        return StackType.DEFAULT;
    }
    
    public refreshItems(): ItemContainer {
        this.getPlayer().getPacketSender().sendItemContainer(this, Equipment.INVENTORY_INTERFACE_ID);
        return this;
    }
    
    public wearingNexAmours(): boolean {
        const head = this.player.getEquipment().getItems()[Equipment.HEAD_SLOT].getId();
        const body = this.player.getEquipment().getItems()[Equipment.BODY_SLOT].getId();
        const legs = this.player.getEquipment().getItems()[Equipment.LEG_SLOT].getId();
        const torva = head === 14008 && body === 14009 && legs === 14010;
        const pernix = head === 14011 && body === 14012 && legs === 14013;
        const virtus = head === 14014 && body === 14015 && legs === 14016;
        return torva || pernix || virtus;
    }
    
    public wearingHalberd(): boolean {
        const itemId = this.getPlayer().getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        const itemDef = ItemDefinition.forId(itemId);
        return itemDef != null && itemDef.getName().toLowerCase().endsWith("halberd");
    }
    
    public properEquipmentForWilderness(): boolean {
        let count = 0;
        for (const item of this.getValidItems()) {
            if (item != null && item.getDefinition().isTradeable())
                count++;
        }
        return count >= 3;
    }
    
    public hasStaffEquipped(): boolean {
        const staff = this.get(Equipment.WEAPON_SLOT);
        return (staff != null && (this.player.getWeapon() == WeaponInterfaces.STAFF
                || this.player.getWeapon() == WeaponInterfaces.ANCIENT_STAFF));
    }
    
    public getWeapon(): Item {
        return this.get(Equipment.WEAPON_SLOT);
    }
    
    public hasCastleWarsBracelet(): boolean {
        const hands = this.get(Equipment.HANDS_SLOT);
        return hands != null && hands.getId() >= 11079 && hands.getId() <= 11083;
    }
    
    public hasGodsword(): boolean {
        return this.get(Equipment.WEAPON_SLOT) != null && this.get(Equipment.WEAPON_SLOT).getDefinition().getName().toLowerCase().includes("godsword");
    }
}
    