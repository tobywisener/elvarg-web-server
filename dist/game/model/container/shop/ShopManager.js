"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopManager = void 0;
var ShopIdentifiers_1 = require("../../../../util/ShopIdentifiers");
var Shop_1 = require("./Shop");
var PlayerStatus_1 = require("../../PlayerStatus");
var World_1 = require("../../../World");
var ItemDefinition_1 = require("../../../definition/ItemDefinition");
var TaskManager_1 = require("../../../task/TaskManager");
var ShopRestockTask_1 = require("../../../task/impl/ShopRestockTask");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../util/Misc");
var ShopManager = exports.ShopManager = /** @class */ (function (_super) {
    __extends(ShopManager, _super);
    function ShopManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShopManager.opens = function (player, id) {
        var shop = this.shops.get(id);
        if (shop) {
            this.open(player, shop, true);
        }
    };
    ShopManager.open = function (player, shop, scrollReset) {
        player.shop = shop;
        player.packetSender.sendItemContainer(player.inventory, Shop_1.Shop.INVENTORY_INTERFACE_ID);
        player.packetSender.sendInterfaceItems(Shop_1.Shop.ITEM_CHILD_ID, shop.getCurrentStockList());
        player.packetSender.sendString(shop.name, Shop_1.Shop.NAME_INTERFACE_CHILD_ID);
        if (!player.enteredAmountAction) {
            player.packetSender.sendInterfaceSet(Shop_1.Shop.INTERFACE_ID, Shop_1.Shop.INVENTORY_INTERFACE_ID - 1);
        }
        if (scrollReset) {
            player.packetSender.sendInterfaceScrollReset(Shop_1.Shop.SCROLL_BAR_INTERFACE_ID);
        }
        if (shop.originalStock.length < 37) {
            player.packetSender.sendScrollbarHeight(Shop_1.Shop.SCROLL_BAR_INTERFACE_ID, 0);
        }
        else {
            var rows = (shop.originalStock.length % 9 === 0 ? (shop.originalStock.length / 9) : ((shop.originalStock.length / 9) + 1));
            player.packetSender.sendScrollbarHeight(Shop_1.Shop.SCROLL_BAR_INTERFACE_ID, rows * 56);
        }
        player.status = PlayerStatus_1.PlayerStatus.SHOPPING;
    };
    ShopManager.refresh = function (shop) {
        var _this = this;
        World_1.World.getPlayers().forEach(function (player) {
            if (!player) {
                return;
            }
            if (_this.viewingShop(player, shop.id)) {
                _this.open(player, shop, false);
            }
        });
    };
    ShopManager.priceCheck = function (player, itemId, slot, shopItem) {
        var shop = player.shop;
        var flag = false;
        if (!shop || player.status !== PlayerStatus_1.PlayerStatus.SHOPPING || player.interfaceId !== Shop_1.Shop.INTERFACE_ID) {
            flag = true;
        }
        else if (shopItem && (slot >= player.shop.currentStock.length || !player.shop.currentStock[slot] || player.shop.currentStock[slot].id !== itemId)) {
            flag = true;
        }
        else if (!shopItem && (slot >= player.inventory.capacity() || player.inventory.getItems()[slot].getId() !== itemId)) {
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
        var def = ItemDefinition_1.ItemDefinition.forId(itemId);
        var itemValue = this.getItemValue(player, def, shop.id);
        var currency = shop.currency.getName();
        if (!shopItem) {
            if (!def.isSellable()) {
                player.packetSender.sendMessage("This item cannot be sold to a shop.");
                return;
            }
            if (itemValue > 1) {
                itemValue = itemValue * Shop_1.Shop.SALES_TAX_MODIFIER;
            }
        }
        if (itemValue <= 0) {
            player.packetSender.sendMessage("This item has no value.");
            return;
        }
        var message = "@dre@".concat(def.getName(), "@bla@").concat(!shopItem ? ": shop will buy for " : " currently costs ", "@dre@").concat(Misc_1.Misc.insertCommasToNumber(itemValue.toString()), " x ").concat(currency, ".");
        player.packetSender.sendMessage(message);
    };
    ShopManager.buyItem = function (player, slot, itemId, amount) {
        var shop = player.shop;
        var flag = false;
        if (!shop || player.status !== PlayerStatus_1.PlayerStatus.SHOPPING || player.interfaceId !== Shop_1.Shop.INTERFACE_ID) {
            flag = true;
        }
        else if (slot >= player.shop.currentStock.length || !player.shop.currentStock[slot] || player.shop.currentStock[slot].id !== itemId) {
            flag = true;
        }
        if (flag) {
            return;
        }
        if (amount > 5000) {
            player.packetSender.sendMessage("You can only buy a maximum of 5000 at a time.");
            return;
        }
        var itemDef = ItemDefinition_1.ItemDefinition.forId(itemId);
        var itemValue = this.getItemValue(player, itemDef, shop.id);
        if (itemValue <= 0) {
            return;
        }
        var bought = false;
        var item = player.getInventory().get(itemId);
        for (var i = amount; i > 0; i--) {
            var currencyAmount = shop.currency.getAmountForPlayer(player);
            if (!player.shop.currentStock[slot]) {
                break;
            }
            var shopItemAmount = shop.currentStock[slot].amount;
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
            }
            else {
                var canBeBought = (currencyAmount / itemValue);
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
                TaskManager_1.TaskManager.submit(new ShopRestockTask_1.ShopRestockTask(shop));
                shop.setRestocking(true);
            }
        }
    };
    ShopManager.sellItem = function (player, slot, itemId, amount) {
        var shop = player.shop;
        var flag = false;
        if (shop == null || player.status != PlayerStatus_1.PlayerStatus.SHOPPING || player.interfaceId != Shop_1.Shop.INTERFACE_ID) {
            flag = true;
        }
        else if (slot >= player.inventory.capacity() || player.inventory.getItems()[slot].getId() != itemId) {
            flag = true;
        }
        if (flag) {
            return;
        }
        if (!this.buysItems(shop, itemId)) {
            player.packetSender.sendMessage("You cannot sell this item to this shop.");
            return;
        }
        var itemDef = ItemDefinition_1.ItemDefinition.forId(itemId);
        if (!itemDef.isSellable) {
            player.packetSender.sendMessage("This item cannot be sold.");
            return;
        }
        var playerAmount = player.inventory.getAmount(itemId);
        if (amount > playerAmount)
            amount = playerAmount;
        if (amount == 0)
            return;
        if (amount > 5000) {
            player.packetSender.sendMessage("You can only buy a maximum of 5000 at a time.");
            return;
        }
        var itemValue = this.getItemValue(player, itemDef, shop.id);
        if (itemValue > 1) {
            itemValue = Math.floor(itemValue * Shop_1.Shop.SALES_TAX_MODIFIER);
        }
        // Verify item value..
        if (itemValue <= 0) {
            player.getPacketSender().sendMessage("This item has no value.");
            return;
        }
        // A flag which indicates if an item was sold.
        var sold = false;
        var item = player.getInventory().get(itemId);
        // Perform sale..
        for (var amountRemaining = amount; amountRemaining > 0; amountRemaining--) {
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
                var allow = false;
                // If we're selling the exact amount of what we have..
                if (itemDef.isStackable()) {
                    if (amount == player.getInventory().getAmount(itemId)) {
                        allow = true;
                    }
                }
                // If their inventory has the coins..
                if (shop.getCurrency().getName().toLowerCase() == "coins") {
                    if (player.getInventory().containsNumber(ItemIdentifiers_1.ItemIdentifiers.COINS)) {
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
            }
            else {
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
                TaskManager_1.TaskManager.submit(new ShopRestockTask_1.ShopRestockTask(shop));
                shop.setRestocking(true);
            }
        }
    };
    ShopManager.getItemValue = function (player, itemDef, shopId) {
        if (shopId == ShopManager.PVP_SHOP) {
            return itemDef.getBloodMoneyValue();
        }
        return itemDef.getValue();
    };
    /**
     * Does this shop buy items?
     *
     * @param shop
     * @param itemId
     * @return
     */
    ShopManager.buysItems = function (shop, itemId) {
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
    };
    /**
     * Does the given shop fully delete items?
     *
     * @param shopId
     * @return
     */
    ShopManager.deletesItems = function (shopId) {
        if (shopId == ShopManager.GENERAL_STORE) {
            return true;
        }
        return false;
    };
    /**
     * Does the given shop restock on items?
     *
     * @param shopId
     * @return
     */
    ShopManager.restocksItem = function (shopId) {
        if (shopId == ShopManager.GENERAL_STORE) {
            return false;
        }
        return true;
    };
    /**
    * Checks if the player is viewing the given shop.
    *
    * @param player
    * @param id
    * @return
    */
    ShopManager.viewingShop = function (player, id) {
        return player.getShop() != null && player.getShop().getId() == id;
    };
    /**
     * Generates a random unused shop id.
     *
     * @return {number} shopId
     */
    ShopManager.generateUnusedId = function () {
        return Misc_1.Misc.getRandomExlcuding(1, Shop_1.Shop.MAX_SHOPS, new (Array.bind.apply(Array, __spreadArray([void 0], __read(ShopManager.shops.keys()), false)))());
    };
    ShopManager.shops = new Map();
    return ShopManager;
}(ShopIdentifiers_1.ShopIdentifiers));
//# sourceMappingURL=ShopManager.js.map