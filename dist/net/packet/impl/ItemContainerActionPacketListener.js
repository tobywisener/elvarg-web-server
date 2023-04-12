"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemContainerActionPacketListener = void 0;
var Smithing_1 = require("../../../game/content/skill/skillable/impl/Smithing");
var Bank_1 = require("../../../game/model/container/impl/Bank");
var DepositBox_1 = require("../../../game/content/DepositBox");
var Duelling_1 = require("../../../game/content/Duelling");
var Trading_1 = require("../../../game/content/Trading");
var PriceChecker_1 = require("../../../game/model/container/impl/PriceChecker");
var Shop_1 = require("../../../game/model/container/shop/Shop");
var ShopManager_1 = require("../../../game/model/container/shop/ShopManager");
var PlayerStatus_1 = require("../../../game/model/PlayerStatus");
var Equipment_1 = require("../../../game/model/container/impl/Equipment");
var BonusManager_1 = require("../../../game/model/equipment/BonusManager");
var WeaponInterfaces_1 = require("../../../game/content/combat/WeaponInterfaces");
var CombatSpecial_1 = require("../../../game/content/combat/CombatSpecial");
var Autocasting_1 = require("../../../game/content/combat/magic/Autocasting");
var PacketConstants_1 = require("../PacketConstants");
var Item_1 = require("../../../game/model/Item");
var Flag_1 = require("../../../game/model/Flag");
var ItemContainerEnteredAmountAction = /** @class */ (function () {
    function ItemContainerEnteredAmountAction(execFunc) {
        this.execFunc = execFunc;
    }
    ItemContainerEnteredAmountAction.prototype.execute = function (amount) {
        this.execFunc();
    };
    return ItemContainerEnteredAmountAction;
}());
var ItemContainerActionPacketListener = /** @class */ (function () {
    function ItemContainerActionPacketListener() {
    }
    ItemContainerActionPacketListener.firstAction = function (player, packet) {
        var containerId = packet.readInt();
        var slot = packet.readShortA();
        var id = packet.readShortA();
        // Bank withdrawal..
        if (containerId >= Bank_1.Bank.CONTAINER_START && containerId < Bank_1.Bank.CONTAINER_START + Bank_1.Bank.TOTAL_BANK_TABS) {
            Bank_1.Bank.withdraw(player, id, slot, 1, containerId - Bank_1.Bank.CONTAINER_START);
            return;
        }
        if (containerId == 7423) {
            DepositBox_1.DepositBox.deposit(player, slot, id, 1);
            return;
        }
        switch (containerId) {
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                if (player.getInterfaceId() == Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                    Smithing_1.EquipmentMaking.initialize(player, id, containerId, slot, 1);
                }
                break;
            // Withdrawing items from duel
            case Duelling_1.Dueling.MAIN_INTERFACE_CONTAINER:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 1, slot, player.getDueling().getContainer(), player.getInventory());
                }
                break;
            case Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING) {
                    player.getPriceChecker().deposit(id, 1, slot);
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 1, slot, player.getInventory(), player.getTrading().getContainer());
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 1, slot, player.getInventory(), player.getDueling().getContainer());
                }
                break;
            case Trading_1.Trading.CONTAINER_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 1, slot, player.getTrading().getContainer(), player.getInventory());
                }
                break;
            case PriceChecker_1.PriceChecker.CONTAINER_ID:
                player.getPriceChecker().withdraw(id, 1, slot);
                break;
            case Bank_1.Bank.INVENTORY_INTERFACE_ID:
                Bank_1.Bank.deposits(player, id, slot, 1);
                break;
            case Shop_1.Shop.ITEM_CHILD_ID:
            case Shop_1.Shop.INVENTORY_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.SHOPPING) {
                    ShopManager_1.ShopManager.priceCheck(player, id, slot, (containerId == Shop_1.Shop.ITEM_CHILD_ID));
                }
                break;
            case Equipment_1.Equipment.INVENTORY_INTERFACE_ID:
                var item = player.getEquipment().getItems()[slot];
                if (!item || item.getId() !== id)
                    return;
                if (player.getArea() && !player.getArea().canUnequipItem(player, slot, item)) {
                    return;
                }
                var stackItem = item.getDefinition().isStackable() && player.getInventory().getAmount(item.getId()) > 0;
                var inventorySlot = player.getInventory().getEmptySlot();
                if (inventorySlot !== -1) {
                    player.getEquipment().setItem(slot, new Item_1.Item(-1, 0));
                    if (stackItem) {
                        player.getInventory().adds(item.getId(), item.getAmount());
                    }
                    else {
                        player.getInventory().setItem(inventorySlot, item);
                    }
                    BonusManager_1.BonusManager.update(player);
                    if (item.getDefinition().getEquipmentType().getSlot() === Equipment_1.Equipment.WEAPON_SLOT) {
                        WeaponInterfaces_1.WeaponInterfaces.assign(player);
                        player.setSpecialActivated(false);
                        CombatSpecial_1.CombatSpecial.updateBar(player);
                        if (player.getCombat().getAutocastSpell() != null) {
                            Autocasting_1.Autocasting.setAutocast(player, null);
                            player.getPacketSender().sendMessage("Autocast spell cleared.");
                        }
                    }
                    player.getEquipment().refreshItems();
                    player.getInventory().refreshItems();
                    player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
                }
                else {
                    player.getInventory().full();
                }
                break;
        }
    };
    ItemContainerActionPacketListener.secondAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        var slot = packet.readLEShort();
        // Bank withdrawal..
        if (interfaceId >= Bank_1.Bank.CONTAINER_START && interfaceId < Bank_1.Bank.CONTAINER_START + Bank_1.Bank.TOTAL_BANK_TABS) {
            Bank_1.Bank.withdraw(player, id, slot, 5, interfaceId - Bank_1.Bank.CONTAINER_START);
            return;
        }
        if (interfaceId == 7423) {
            DepositBox_1.DepositBox.deposit(player, slot, id, 5);
            return;
        }
        switch (interfaceId) {
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                if (player.getInterfaceId() == Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                    Smithing_1.EquipmentMaking.initialize(player, id, interfaceId, slot, 5);
                }
                break;
            case Shop_1.Shop.INVENTORY_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.SHOPPING) {
                    ShopManager_1.ShopManager.sellItem(player, slot, id, 1);
                }
                break;
            case Shop_1.Shop.ITEM_CHILD_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.SHOPPING) {
                    ShopManager_1.ShopManager.buyItem(player, slot, id, 1);
                }
                break;
            case Bank_1.Bank.INVENTORY_INTERFACE_ID:
                Bank_1.Bank.deposits(player, id, slot, 5);
                break;
            case Duelling_1.Dueling.MAIN_INTERFACE_CONTAINER:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 5, slot, player.getDueling().getContainer(), player.getInventory());
                }
                break;
            case Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING) {
                    player.getPriceChecker().deposit(id, 5, slot);
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 5, slot, player.getInventory(), player.getTrading().getContainer());
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 5, slot, player.getInventory(), player.getDueling().getContainer());
                }
                break;
            case Trading_1.Trading.CONTAINER_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 5, slot, player.getTrading().getContainer(), player.getInventory());
                }
                break;
            case PriceChecker_1.PriceChecker.CONTAINER_ID:
                player.getPriceChecker().withdraw(id, 5, slot);
                break;
        }
    };
    ItemContainerActionPacketListener.thirdAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        var slot = packet.readShortA();
        // Bank withdrawal..
        if (interfaceId >= Bank_1.Bank.CONTAINER_START && interfaceId < Bank_1.Bank.CONTAINER_START + Bank_1.Bank.TOTAL_BANK_TABS) {
            Bank_1.Bank.withdraw(player, id, slot, 10, interfaceId - Bank_1.Bank.CONTAINER_START);
            return;
        }
        if (interfaceId == 7423) {
            DepositBox_1.DepositBox.deposit(player, slot, id, 10);
            return;
        }
        switch (interfaceId) {
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
            case Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                if (player.getInterfaceId() == Smithing_1.EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                    Smithing_1.EquipmentMaking.initialize(player, id, interfaceId, slot, 10);
                }
                break;
            case Shop_1.Shop.INVENTORY_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING) {
                    player.getPriceChecker().deposit(id, 10, slot);
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 10, slot, player.getInventory(), player.getTrading().getContainer());
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 10, slot, player.getInventory(), player.getDueling().getContainer());
                }
                break;
            case Trading_1.Trading.CONTAINER_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, 10, slot, player.getTrading().getContainer(), player.getInventory());
                }
                break;
            case PriceChecker_1.PriceChecker.CONTAINER_ID:
                player.getPriceChecker().withdraw(id, 10, slot);
                break;
        }
    };
    ItemContainerActionPacketListener.fourthAction = function (player, packet) {
        var slot = packet.readShortA();
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        // Bank withdrawal..
        if (interfaceId >= Bank_1.Bank.CONTAINER_START && interfaceId < Bank_1.Bank.CONTAINER_START + Bank_1.Bank.TOTAL_BANK_TABS) {
            Bank_1.Bank.withdraw(player, id, slot, -1, interfaceId - Bank_1.Bank.CONTAINER_START);
            return;
        }
        if (interfaceId == 7423) {
            DepositBox_1.DepositBox.deposit(player, slot, id, Number.MAX_SAFE_INTEGER);
            return;
        }
        switch (interfaceId) {
            case Shop_1.Shop.INVENTORY_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.SHOPPING) {
                    ShopManager_1.ShopManager.sellItem(player, slot, id, 10);
                }
                break;
            case Shop_1.Shop.ITEM_CHILD_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.SHOPPING) {
                    ShopManager_1.ShopManager.buyItem(player, slot, id, 10);
                }
                break;
            case Bank_1.Bank.INVENTORY_INTERFACE_ID:
                Bank_1.Bank.deposits(player, id, slot, -1);
                break;
            // Withdrawing items from duel
            case Duelling_1.Dueling.MAIN_INTERFACE_CONTAINER:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, player.getDueling().getContainer().getAmount(id), slot, player.getDueling().getContainer(), player.getInventory());
                }
                break;
            case Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING) {
                    player.getPriceChecker().deposit(id, player.getInventory().getAmount(id), slot);
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(), player.getTrading().getContainer());
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(), player.getDueling().getContainer());
                }
                break;
            case Trading_1.Trading.CONTAINER_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.getTrading().handleItem(id, player.getTrading().getContainer().getAmount(id), slot, player.getTrading().getContainer(), player.getInventory());
                }
                break;
            case PriceChecker_1.PriceChecker.CONTAINER_ID:
                player.getPriceChecker().withdraw(id, player.getPriceChecker().getAmount(id), slot);
                break;
        }
    };
    ItemContainerActionPacketListener.fifthAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var slot = packet.readLEShort();
        var id = packet.readLEShort();
        // Bank withdrawal..
        if (interfaceId >= Bank_1.Bank.CONTAINER_START && interfaceId < Bank_1.Bank.CONTAINER_START + Bank_1.Bank.TOTAL_BANK_TABS) {
            player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                Bank_1.Bank.withdraw(player, id, slot, amount, interfaceId - Bank_1.Bank.CONTAINER_START);
            }));
            player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
            return;
        }
        if (interfaceId == 7423) {
            player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) { return DepositBox_1.DepositBox.deposit(player, slot, id, amount); }));
            player.getPacketSender().sendEnterAmountPrompt("How many would you like to deposit?");
            return;
        }
        switch (interfaceId) {
            case Shop_1.Shop.INVENTORY_INTERFACE_ID:
                player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                    ShopManager_1.ShopManager.sellItem(player, slot, id, amount);
                }));
                player.getPacketSender().sendEnterAmountPrompt("How many would you like to sell?");
                break;
            case Shop_1.Shop.ITEM_CHILD_ID:
                player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                    ShopManager_1.ShopManager.buyItem(player, slot, id, amount);
                }));
                player.getPacketSender().sendEnterAmountPrompt("How many would you like to buy?");
                break;
            case Bank_1.Bank.INVENTORY_INTERFACE_ID:
                player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                    Bank_1.Bank.deposits(player, id, slot, amount);
                }));
                player.getPacketSender().sendEnterAmountPrompt("How many would you like to bank?");
                break;
            case Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING) {
                    player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                        player.getPriceChecker().deposit(id, amount, slot);
                    }));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to deposit?");
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                        player.getTrading().handleItem(id, amount, slot, player.getInventory(), player.getTrading().getContainer());
                    }));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
                }
                else if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                        player.getDueling().handleItem(id, amount, slot, player.getInventory(), player.getDueling().getContainer());
                    }));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
                }
                break;
            case Trading_1.Trading.CONTAINER_INTERFACE_ID:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                        player.getTrading().handleItem(id, amount, slot, player.getTrading().getContainer(), player.getInventory());
                    }));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
                }
                break;
            case Duelling_1.Dueling.MAIN_INTERFACE_CONTAINER:
                if (player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                        player.getDueling().handleItem(id, amount, slot, player.getDueling().getContainer(), player.getInventory());
                    }));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
                }
                break;
            case PriceChecker_1.PriceChecker.CONTAINER_ID:
                player.setEnteredAmountAction(new ItemContainerEnteredAmountAction(function (amount) {
                    player.getPriceChecker().withdraw(id, amount, slot);
                }));
                player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
                break;
        }
    };
    ItemContainerActionPacketListener.sixthAction = function (player, packet) {
    };
    ItemContainerActionPacketListener.prototype.execute = function (player, packet) {
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.FIRST_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.firstAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.SECOND_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.secondAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.THIRD_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.thirdAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.FOURTH_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.fourthAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.FIFTH_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.fifthAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.SIXTH_ITEM_CONTAINER_ACTION_OPCODE:
                ItemContainerActionPacketListener.sixthAction(player, packet);
                break;
        }
    };
    return ItemContainerActionPacketListener;
}());
exports.ItemContainerActionPacketListener = ItemContainerActionPacketListener;
//# sourceMappingURL=ItemContainerActionPacketListener.js.map