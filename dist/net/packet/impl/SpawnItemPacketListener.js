"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnItemPacketListener = void 0;
var WildernessArea_1 = require("../../../game/model/areas/impl/WildernessArea");
var GameConstants_1 = require("../../../game/GameConstants");
var ItemDefinition_1 = require("../../../game/definition/ItemDefinition");
var Bank_1 = require("../../../game/model/container/impl/Bank");
var SpawnItemPacketListener = /** @class */ (function () {
    function SpawnItemPacketListener() {
    }
    SpawnItemPacketListener.spawn = function (player, item, amount, toBank) {
        if (amount < 0) {
            return;
        }
        else if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER;
        }
        if (player.busy() || player.getArea() instanceof WildernessArea_1.WildernessArea) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }
        var spawnable = Array.from(GameConstants_1.GameConstants.ALLOWED_SPAWNS).includes(item);
        var def = ItemDefinition_1.ItemDefinition.forId(item);
        if (!def || !spawnable) {
            player.getPacketSender().sendMessage("This item is currently unavailable.");
            return;
        }
        if (toBank) {
            player.getBank(Bank_1.Bank.getTabForItem(player, item)).adds(item, amount);
        }
        else {
            if (amount > player.getInventory().getFreeSlots()) {
                amount = player.getInventory().getFreeSlots();
            }
            if (amount <= 0) {
                player.getInventory().full();
                return;
            }
            player.getInventory().adds(item, amount);
        }
        player.getPacketSender().sendMessage("Spawned ".concat(def.getName(), " to ").concat(toBank ? "bank" : "inventory", "."));
    };
    SpawnItemPacketListener.prototype.execute = function (player, packet) {
        var item = packet.readInt();
        var spawnX = packet.readByte() == 1;
        var toBank = packet.readByte() == 1;
        var def = ItemDefinition_1.ItemDefinition.forId(item);
        if (!def) {
            player.getPacketSender().sendMessage("This item is currently unavailable.");
            return;
        }
        if (spawnX) {
            player.setEnteredAmountAction(new SpawnEntered(function (amount) {
                SpawnItemPacketListener.spawn(player, item, amount, toBank);
            }));
            player.getPacketSender().sendEnterAmountPrompt("How many ".concat(def.getName(), " would you like to spawn?"));
        }
        else {
            SpawnItemPacketListener.spawn(player, item, 1, toBank);
        }
    };
    return SpawnItemPacketListener;
}());
exports.SpawnItemPacketListener = SpawnItemPacketListener;
var SpawnEntered = /** @class */ (function () {
    function SpawnEntered(execFunc) {
        this.execFunc = execFunc;
    }
    SpawnEntered.prototype.execute = function (amount) {
        this.execFunc();
    };
    return SpawnEntered;
}());
//# sourceMappingURL=SpawnItemPacketListener.js.map