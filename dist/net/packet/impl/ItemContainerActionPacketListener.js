"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemContainerActionPacketListener = void 0;
// import { Bank } from "../../../game/model/container/impl/Bank";
// import { DepositBox } from "../../../game/content/DepositBox";
// import { Dueling } from "../../../game/content/Duelling";
// import { Trading } from "../../../game/content/Trading";
// import { PriceChecker } from "../../../game/model/container/impl/PriceChecker";
// import { Shop } from "../../../game/model/container/shop/Shop";
// import { ShopManager } from "../../../game/model/container/shop/ShopManager";
// import { PlayerStatus } from "../../../game/model/PlayerStatus";
// import { Equipment } from "../../../game/model/container/impl/Equipment";
// import { BonusManager } from "../../../game/model/equipment/BonusManager";
// import { WeaponInterfaces } from "../../../game/content/combat/WeaponInterfaces";
// import { CombatSpecial } from "../../../game/content/combat/CombatSpecial";
// import { Autocasting } from "../../../game/content/combat/magic/Autocasting";
var PacketConstants_1 = require("../PacketConstants");
// import { Item } from "../../../game/model/Item";
// import { Flag } from "../../../game/model/Flag";
// import { EnteredAmountAction } from "../../../game/model/EnteredAmountAction";
// class ItemContainerEnteredAmountAction implements EnteredAmountAction{
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
        // static firstAction(player: Player, packet: Packet) {
        var containerId = packet.readInt();
        var slot = packet.readShortA();
        var id = packet.readShortA();
        // Bank withdrawal..
        // if (containerId >= Bank.CONTAINER_START && containerId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     Bank.withdraw(player, id, slot, 1, containerId - Bank.CONTAINER_START);
        //     return;
        // }
        // if (containerId == 7423) {
        //     DepositBox.deposit(player, slot, id, 1);
        //     return;
        // }
        // switch (containerId) {
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
        //         if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
        //             EquipmentMaking.initialize(player, id, containerId, slot, 1);
        //         }
        //         break;
        //     // Withdrawing items from duel
        //     case Dueling.MAIN_INTERFACE_CONTAINER:
        //         if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, 1, slot, player.getDueling().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
        //         if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
        //             player.getPriceChecker().deposit(id, 1, slot);
        //         } else if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 1, slot, player.getInventory(), player.getTrading().getContainer());
        //         } else if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, 1, slot, player.getInventory(), player.getDueling().getContainer());
        //         }
        //         break;
        //     case Trading.CONTAINER_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 1, slot, player.getTrading().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case PriceChecker.CONTAINER_ID:
        //         player.getPriceChecker().withdraw(id, 1, slot);
        //         break;
        //     case Bank.INVENTORY_INTERFACE_ID:
        //         Bank.deposits(player, id, slot, 1);
        //         break;
        //     case Shop.ITEM_CHILD_ID:
        //     case Shop.INVENTORY_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.SHOPPING) {
        //             ShopManager.priceCheck(player, id, slot, (containerId == Shop.ITEM_CHILD_ID));
        //         }
        //         break;
        //     case Equipment.INVENTORY_INTERFACE_ID:
        //         let item = player.getEquipment().getItems()[slot];
        //         if (!item || item.getId() !== id) return;
        //         if (player.getArea() && !player.getArea().canUnequipItem(player, slot, item)) {
        //             return;
        //         }
        //         let stackItem = item.getDefinition().isStackable() && player.getInventory().getAmount(item.getId()) > 0;
        //         let inventorySlot = player.getInventory().getEmptySlot();
        //         if (inventorySlot !== -1) {
        //             player.getEquipment().setItem(slot, new Item(-1, 0));
        //             if (stackItem) {
        //                 player.getInventory().adds(item.getId(), item.getAmount());
        //             } else {
        //                 player.getInventory().setItem(inventorySlot, item);
        //             }
        //             BonusManager.update(player);
        //             if (item.getDefinition().getEquipmentType().getSlot() === Equipment.WEAPON_SLOT) {
        //                 WeaponInterfaces.assign(player);
        //                 player.setSpecialActivated(false);
        //                 CombatSpecial.updateBar(player);
        //                 if (player.getCombat().getAutocastSpell() != null) {
        //                     Autocasting.setAutocast(player, null);
        //                     player.getPacketSender().sendMessage("Autocast spell cleared.");
        //                 }
        //             }
        //             player.getEquipment().refreshItems();
        //             player.getInventory().refreshItems();
        //             player.getUpdateFlag().flag(Flag.APPEARANCE);
        //         } else {
        //             player.getInventory().full();
        //         }
        //         break;
        // }
    };
    // private static secondAction(player: Player, packet: Packet): void {
    ItemContainerActionPacketListener.secondAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        var slot = packet.readLEShort();
        // Bank withdrawal..
        // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     Bank.withdraw(player, id, slot, 5, interfaceId - Bank.CONTAINER_START);
        //     return;
        // }
        // if (interfaceId == 7423) {
        //     DepositBox.deposit(player, slot, id, 5);
        //     return;
        // }
        // switch (interfaceId) {
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
        //         if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
        //             EquipmentMaking.initialize(player, id, interfaceId, slot, 5);
        //         }
        //         break;
        //     case Shop.INVENTORY_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.SHOPPING) {
        //             ShopManager.sellItem(player, slot, id, 1);
        //         }
        //         break;
        //     case Shop.ITEM_CHILD_ID:
        //         if (player.getStatus() == PlayerStatus.SHOPPING) {
        //             ShopManager.buyItem(player, slot, id, 1);
        //         }
        //         break;
        //     case Bank.INVENTORY_INTERFACE_ID:
        //         Bank.deposits(player, id, slot, 5);
        //         break;
        //     case Dueling.MAIN_INTERFACE_CONTAINER:
        //         if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, 5, slot, player.getDueling().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
        //         if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
        //             player.getPriceChecker().deposit(id, 5, slot);
        //         } else if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 5, slot, player.getInventory(), player.getTrading().getContainer());
        //         } else if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, 5, slot, player.getInventory(), player.getDueling().getContainer());
        //         }
        //         break;
        //     case Trading.CONTAINER_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 5, slot, player.getTrading().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case PriceChecker.CONTAINER_ID:
        //         player.getPriceChecker().withdraw(id, 5, slot);
        //         break;
        // }
    };
    // private static thirdAction(player: Player, packet: Packet) {
    ItemContainerActionPacketListener.thirdAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        var slot = packet.readShortA();
        // Bank withdrawal..
        // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     Bank.withdraw(player, id, slot, 10, interfaceId - Bank.CONTAINER_START);
        //     return;
        // }
        // if (interfaceId == 7423) {
        //     DepositBox.deposit(player, slot, id, 10);
        //     return;
        // }
        // switch (interfaceId) {
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
        //     case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
        //         if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
        //             EquipmentMaking.initialize(player, id, interfaceId, slot, 10);
        //         }
        //         break;
        //     case Shop.INVENTORY_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
        //             player.getPriceChecker().deposit(id, 10, slot);
        //         } else if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 10, slot, player.getInventory(), player.getTrading().getContainer());
        //         } else if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, 10, slot, player.getInventory(), player.getDueling().getContainer());
        //         }
        //         break;
        //     case Trading.CONTAINER_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, 10, slot, player.getTrading().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case PriceChecker.CONTAINER_ID:
        //         player.getPriceChecker().withdraw(id, 10, slot);
        //         break;
        // }
    };
    // private static fourthAction(player: Player, packet: Packet) {
    ItemContainerActionPacketListener.fourthAction = function (player, packet) {
        var slot = packet.readShortA();
        var interfaceId = packet.readInt();
        var id = packet.readShortA();
        // Bank withdrawal..
        // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     Bank.withdraw(player, id, slot, -1, interfaceId - Bank.CONTAINER_START);
        //     return;
        // }
        // if (interfaceId == 7423) {
        //     DepositBox.deposit(player, slot, id, Number.MAX_SAFE_INTEGER);
        //     return;
        // }
        // switch (interfaceId) {
        //     case Shop.INVENTORY_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.SHOPPING) {
        //             ShopManager.sellItem(player, slot, id, 10);
        //         }
        //         break;
        //     case Shop.ITEM_CHILD_ID:
        //         if (player.getStatus() == PlayerStatus.SHOPPING) {
        //             ShopManager.buyItem(player, slot, id, 10);
        //         }
        //         break;
        //     case Bank.INVENTORY_INTERFACE_ID:
        //         Bank.deposits(player, id, slot, -1);
        //         break;
        //     // Withdrawing items from duel
        //     case Dueling.MAIN_INTERFACE_CONTAINER:
        //         if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, player.getDueling().getContainer().getAmount(id), slot,
        //                 player.getDueling().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
        //         if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
        //             player.getPriceChecker().deposit(id, player.getInventory().getAmount(id), slot);
        //         } else if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(),
        //                 player.getTrading().getContainer());
        //         } else if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.getDueling().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(),
        //                 player.getDueling().getContainer());
        //         }
        //         break;
        //     case Trading.CONTAINER_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.getTrading().handleItem(id, player.getTrading().getContainer().getAmount(id), slot,
        //                 player.getTrading().getContainer(), player.getInventory());
        //         }
        //         break;
        //     case PriceChecker.CONTAINER_ID:
        //         player.getPriceChecker().withdraw(id, player.getPriceChecker().getAmount(id), slot);
        //         break;
        // }
    };
    // private static fifthAction(player: Player, packet: Packet) {
    ItemContainerActionPacketListener.fifthAction = function (player, packet) {
        var interfaceId = packet.readInt();
        var slot = packet.readLEShort();
        var id = packet.readLEShort();
        // Bank withdrawal..
        // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount: number) => {
        //         Bank.withdraw(player, id, slot, amount, interfaceId - Bank.CONTAINER_START);
        //     }));
        //     player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
        //     return;
        // }
        if (interfaceId == 7423) {
            // player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => DepositBox.deposit(player, slot, id, amount)));
            player
                .getPacketSender()
                .sendEnterAmountPrompt("How many would you like to deposit?");
            return;
        }
        // switch (interfaceId) {
        //     case Shop.INVENTORY_INTERFACE_ID:
        //         player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //             ShopManager.sellItem(player, slot, id, amount);
        //         }));
        //         player.getPacketSender().sendEnterAmountPrompt("How many would you like to sell?");
        //         break;
        //     case Shop.ITEM_CHILD_ID:
        //         player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //             ShopManager.buyItem(player, slot, id, amount);
        //         }));
        //         player.getPacketSender().sendEnterAmountPrompt("How many would you like to buy?");
        //         break;
        //     case Bank.INVENTORY_INTERFACE_ID:
        //         player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //             Bank.deposits(player, id, slot, amount);
        //         }));
        //         player.getPacketSender().sendEnterAmountPrompt("How many would you like to bank?");
        //         break;
        //     case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
        //         if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
        //             player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //                 player.getPriceChecker().deposit(id, amount, slot);
        //             }));
        //             player.getPacketSender().sendEnterAmountPrompt("How many would you like to deposit?");
        //         } else if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //                 player.getTrading().handleItem(id, amount, slot, player.getInventory(), player.getTrading().getContainer());
        //             }));
        //             player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
        //         } else if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //                 player.getDueling().handleItem(id, amount, slot, player.getInventory(), player.getDueling().getContainer());
        //             }));
        //             player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
        //         }
        //         break;
        //     case Trading.CONTAINER_INTERFACE_ID:
        //         if (player.getStatus() == PlayerStatus.TRADING) {
        //             player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //                 player.getTrading().handleItem(id, amount, slot, player.getTrading().getContainer(), player.getInventory());
        //             }));
        //             player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
        //         }
        //         break;
        //     case Dueling.MAIN_INTERFACE_CONTAINER:
        //         if (player.getStatus() == PlayerStatus.DUELING) {
        //             player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //                 player.getDueling().handleItem(id, amount, slot, player.getDueling().getContainer(), player.getInventory());
        //             }));
        //             player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
        //         }
        //         break;
        //     case PriceChecker.CONTAINER_ID:
        //         player.setEnteredAmountAction(new ItemContainerEnteredAmountAction((amount) => {
        //             player.getPriceChecker().withdraw(id, amount, slot);
        //         }));
        //         player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
        //         break;
        // }
    };
    // private static sixthAction(player: Player, packet: Packet) {
    ItemContainerActionPacketListener.sixthAction = function (player, packet) { };
    // public execute(player: Player, packet: Packet) {
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