
import { ShopIdentifiers } from '../../../../util/ShopIdentifiers';
import { Shop } from './Shop';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerStatus } from '../../PlayerStatus';
import { World } from '../../../World';
import { ItemDefinition } from '../../../definition/ItemDefinition';
import { TaskManager } from '../../../task/TaskManager';
import { ShopRestockTask } from '../../../task/impl/ShopRestockTask'
import { ItemIdentifiers } from '../../../../util/ItemIdentifiers';
import { Misc } from '../../../../util/Misc';

export class ShopManager extends ShopIdentifiers {
    public static shops: Map<number, Shop> = new Map<number, Shop>();
    
    public static opens(player: Player, id: number) {
        const shop = this.shops.get(id);
        if (shop) {
            this.open(player, shop, true);
        }
    }
    
    public static open(player: Player, shop: Shop, scrollReset?: boolean) {
        player.shop = shop;
        
        player.packetSender.sendItemContainer(player.inventory, Shop.INVENTORY_INTERFACE_ID);
        player.packetSender.sendInterfaceItems(Shop.ITEM_CHILD_ID, shop.getCurrentStockList());
    
        player.packetSender.sendString(shop.name, Shop.NAME_INTERFACE_CHILD_ID,);
    
        if (!player.enteredAmountAction) {
            player.packetSender.sendInterfaceSet(Shop.INTERFACE_ID, Shop.INVENTORY_INTERFACE_ID - 1);
        }
    
        if (scrollReset) {
            player.packetSender.sendInterfaceScrollReset(Shop.SCROLL_BAR_INTERFACE_ID);
        }
    
        if (shop.originalStock.length < 37) {
            player.packetSender.sendScrollbarHeight(Shop.SCROLL_BAR_INTERFACE_ID, 0);
        } else {
            const rows = (shop.originalStock.length % 9 === 0 ? (shop.originalStock.length / 9) : ((shop.originalStock.length / 9) + 1));
            player.packetSender.sendScrollbarHeight(Shop.SCROLL_BAR_INTERFACE_ID, rows * 56);
        }
    
        player.status = PlayerStatus.SHOPPING;
    }

    public static refresh(shop: Shop) {
        World.getPlayers().forEach(player => {
            if (!player) {
              return;
            }
            if (this.viewingShop(player, shop.id)) {
              this.open(player, shop, false);
            }
          });
    }
    
    public static priceCheck(player: Player, itemId: number, slot: number, shopItem: boolean) {
        let shop = player.shop;
        
        let flag = false;
        
        if (!shop || player.status !== PlayerStatus.SHOPPING || player.interfaceId !== Shop.INTERFACE_ID) {
            flag = true;
        } else if (shopItem && (slot >= player.shop.currentStock.length || !player.shop.currentStock[slot] || player.shop.currentStock[slot].id !== itemId)) {
            flag = true;
        } else if (!shopItem && (slot >= player.inventory.capacity() || player.inventory.getItems()[slot].getId() !== itemId)) {
            flag = true;
        }

        if (flag) {
            player.packetSender.sendInterfaceRemoval();
            return;
        }
            
        if (!this.buysItems(shop, itemId)) {
            if (!shopItem) {
                player.packetSender.sendMessage("You cannot sell this item to this shop.");
            }
            return;
        }
        
        const def = ItemDefinition.forId(itemId);
        
        let itemValue = this.getItemValue(player, def, shop.id);
        
        const currency = shop.currency.getName();
        
        if (!shopItem) {
        if (!def.isSellable()) {
        player.packetSender.sendMessage("This item cannot be sold to a shop.");
        return;
        }
        
        if (itemValue > 1) {
            itemValue = itemValue * Shop.SALES_TAX_MODIFIER;
        }
        }
        
        if (itemValue <= 0) {
        player.packetSender.sendMessage("This item has no value.");
        return;
        }
        
        let message = `@dre@${def.getName()}@bla@${!shopItem ? ": shop will buy for " : " currently costs "}@dre@${Misc.insertCommasToNumber(itemValue.toString())} x ${currency}.`;
        player.packetSender.sendMessage(message);
    }

    public static buyItem(player: Player, slot: number, itemId: number, amount: number) {
        let shop = player.shop;
        let flag = false;
        if (!shop || player.status !== PlayerStatus.SHOPPING || player.interfaceId !== Shop.INTERFACE_ID) {
        flag = true;
        } else if (slot >= player.shop.currentStock.length || !player.shop.currentStock[slot] || player.shop.currentStock[slot].id !== itemId) {
        flag = true;
        }
        
        if (flag) {
            return;
        }
        
        if (amount > 5000) {
            player.packetSender.sendMessage("You can only buy a maximum of 5000 at a time.");
            return;
        }
        
        const itemDef = ItemDefinition.forId(itemId);
        let itemValue = this.getItemValue(player, itemDef, shop.id);
        if (itemValue <= 0) {
            return;
        }
        
        let bought = false;
        const item = player.getInventory().get(itemId);

        for (let i = amount; i > 0; i--) {
            let currencyAmount = shop.currency.getAmountForPlayer(player);
            if (!player.shop.currentStock[slot]) {
            break;
            }
            let shopItemAmount = shop.currentStock[slot].amount;
            
            if (shopItemAmount <= 1 && !this.deletesItems(shop.id)) {
                player.packetSender.sendMessage("This item is currently out of stock. Come back later.");
                break;
            }
            
            if (player.inventory.isFull()) {
                if (!(itemDef.isStackable() && player.inventory.containsNumber(itemId))) {
                    player.inventory.full();
                    break;
                }
            }
            
            if (currencyAmount < itemValue) {
                player.packetSender.sendMessage("You can't afford that.");
                break;
            }
            
            if (!itemDef.isStackable()) {
                shop.currency.decrementForPlayer(player, itemValue);
                shop.removeItem(itemId, 1);
                if (item) {
                    player.getInventory().addItem(item);
                }
                bought = true;
            } else {
                let canBeBought = (currencyAmount / itemValue);
                if (canBeBought >= i) {
                    canBeBought = i;
                }
                if (canBeBought >= shopItemAmount) {
                    canBeBought = this.deletesItems(shop.id) ? shopItemAmount : shopItemAmount - 1;
                }
                if (canBeBought == 0)
                    break;
            
                shop.currency.decrementForPlayer(player, itemValue * canBeBought);
                shop.removeItem(itemId, canBeBought);
                if (item) {
                    player.getInventory().addItem(item);
                }
                bought = true;
                break;
            }
        }
            
        if (bought) {
            ShopManager.refresh(shop);
            if (!shop.isRestocking()) {
                TaskManager.submit(new ShopRestockTask(shop));
                shop.setRestocking(true);
            }
        }
    }

    

    public static sellItem(player: Player, slot: number, itemId: number, amount: number) {
        let shop = player.shop;
        let flag = false;
        if (shop == null || player.status != PlayerStatus.SHOPPING || player.interfaceId != Shop.INTERFACE_ID) {
        flag = true;
        } else if (slot >= player.inventory.capacity() || player.inventory.getItems()[slot].getId() != itemId) {
        flag = true;
        }

        if (flag) {
            return;
        }
        
        if (!this.buysItems(shop, itemId)) {
            player.packetSender.sendMessage("You cannot sell this item to this shop.");
            return;
        }
        
        let itemDef = ItemDefinition.forId(itemId);
        if (!itemDef.isSellable) {
            player.packetSender.sendMessage("This item cannot be sold.");
            return;
        }
        
        let playerAmount = player.inventory.getAmount(itemId);
        if (amount > playerAmount)
            amount = playerAmount;
        if (amount == 0)
            return;
        
        if (amount > 5000) {
            player.packetSender.sendMessage("You can only buy a maximum of 5000 at a time.");
            return;
        }
        
        let itemValue = this.getItemValue(player, itemDef, shop.id);

        if (itemValue > 1) {
            itemValue = Math.floor(itemValue * Shop.SALES_TAX_MODIFIER);
        }
            
        // Verify item value..
        if (itemValue <= 0) {
            player.getPacketSender().sendMessage("This item has no value.");
            return;
        }
    
        // A flag which indicates if an item was sold.
        let sold = false;

        const item = player.getInventory().get(itemId);
    
        // Perform sale..
        for (let amountRemaining = amount; amountRemaining > 0; amountRemaining--) {
            // Check if the shop is full..
            if (shop.isFull()) {
                player.getPacketSender().sendMessage("The shop is currently full.");
                break;
            }
    
            // Check if player still has the item..
            if (!player.getInventory().containsNumber(itemId)) {
                break;
            }
    
            // Verify inventory space..
            if (player.getInventory().getFreeSlots() == 0) {
                let allow = false;
    
                // If we're selling the exact amount of what we have..
                if (itemDef.isStackable()) {
                    if (amount == player.getInventory().getAmount(itemId)) {
                        allow = true;
                    }
                }
    
                // If their inventory has the coins..
                if (shop.getCurrency().getName().toLowerCase() == "coins") {
                    if (player.getInventory().containsNumber(ItemIdentifiers.COINS)) {
                        allow = true;
                    }
                }
    
                if (!allow) {
                    player.getInventory().full();
                    break;
                }
            }

                if (!itemDef.isStackable()) {
                // Remove item from player's inventory..
                
                if (item) {
                    player.getInventory().deletes(item);
                }
                // Add player currency..
                shop.getCurrency().incrementForPlayer(player, itemValue);
    
                // Add item to shop..
                shop.addItem(itemId, 1);
    
                sold = true;
            } else {
                
                    // Remove item from player's inventory..
                    if (item) {
                        player.getInventory().deletes(item);
                    }
        
                    // Add player currency..
                    shop.getCurrency().incrementForPlayer(player, itemValue * amountRemaining);
        
                    // Add item to shop..
                    shop.addItem(itemId, amountRemaining);
        
                    sold = true;
                    break;
                }
        }
                
        // Refresh shop..
        if (sold) {
            ShopManager.refresh(shop);
            if (!shop.isRestocking()) {
                TaskManager.submit(new ShopRestockTask(shop));
                shop.setRestocking(true);
            }
        }
    }

    private static getItemValue(player: Player, itemDef: ItemDefinition, shopId: number): number {
        if (shopId == ShopManager.PVP_SHOP) {
        return itemDef.getBloodMoneyValue();
        }
        return itemDef.getValue();
    }
        
    /**
     * Does this shop buy items?
     *
     * @param shop
     * @param itemId
     * @return
     */
    public static buysItems(shop: Shop, itemId: number): boolean {
    
        // Disabling selling items to a shop
        /*if (shop.getId() == PVP_SHOP) {
            return false;
        }*/
    
        // Disabling selling certain items to a shop
        /*if (shop.getId() == PVP_SHOP) {
            switch (itemId) {
            case ItemIdentifiers.HEAVY_BALLISTA:
                return false;
            }
        }*/
    
        // Disable selling a specific item to any shop
        /*switch (itemId) {
        case ItemIdentifiers.HEAVY_BALLISTA:
            return false;
        }*/
    
        if (shop.getId() == ShopManager.GENERAL_STORE) {
            return true;
        }
    
        // Makes sure the item we're trying to sell already exists
        // in the shop.
        if (shop.getAmount(itemId, true) >= 1) {
            return true;
        }
    
        return false;
    }
    
    /**
     * Does the given shop fully delete items?
     *
     * @param shopId
     * @return
     */
    public static deletesItems(shopId: number): boolean {
        if (shopId == ShopManager.GENERAL_STORE) {
            return true;
        }
        return false;
    }
    
    /**
     * Does the given shop restock on items?
     *
     * @param shopId
     * @return
     */
    public static restocksItem(shopId: number): boolean {
        if (shopId == ShopManager.GENERAL_STORE) {
            return false;
        }
        return true;
    }

    /**
    * Checks if the player is viewing the given shop.
    *
    * @param player
    * @param id
    * @return
    */
    public static viewingShop(player: Player, id: number): boolean {
        return player.getShop() != null && player.getShop().getId() == id;
    }
        
    
    /**
     * Generates a random unused shop id.
     *
     * @return {number} shopId
     */
    public static generateUnusedId(): number {
        return Misc.getRandomExlcuding(1, Shop.MAX_SHOPS, new Array(...ShopManager.shops.keys()));
    }
}