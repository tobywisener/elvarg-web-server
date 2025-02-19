"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnItemPacketListener = void 0;
// import { EnteredAmountAction } from "../../../game/model/EnteredAmountAction";
var SpawnItemPacketListener = /** @class */ (function () {
    function SpawnItemPacketListener() {
    }
    // static spawn(player: Player, item: number, amount: number, toBank: boolean) {
    SpawnItemPacketListener.spawn = function (player, item, amount, toBank) {
        if (amount < 0) {
            return;
        }
        else if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER;
        }
        // if (player.busy() || player.getArea() instanceof WildernessArea) {
        //     player.getPacketSender().sendMessage("You cannot do that right now.");
        //     return;
        // }
        // let spawnable = Array.from(GameConstants.ALLOWED_SPAWNS).includes(item);
        // let def = ItemDefinition.forId(item);
        // if (!def || !spawnable) {
        //     player.getPacketSender().sendMessage("This item is currently unavailable.");
        //     return;
        // }
        if (toBank) {
            // player.getBank(Bank.getTabForItem(player, item)).adds(item, amount);
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
        player.getPacketSender().sendMessage(
        // `Spawned ${def.getName()} to ${toBank ? "bank" : "inventory"}.`
        "Spawned to ".concat(toBank ? "bank" : "inventory", "."));
    };
    // execute(player: Player, packet: Packet) {
    SpawnItemPacketListener.prototype.execute = function (player, packet) {
        var item = packet.readInt();
        var spawnX = packet.readByte() == 1;
        var toBank = packet.readByte() == 1;
        // let def = ItemDefinition.forId(item);
        // if (!def) {
        //     player.getPacketSender().sendMessage("This item is currently unavailable.");
        //     return;
        // }
        if (spawnX) {
            player.setEnteredAmountAction(new SpawnEntered(function (amount) {
                SpawnItemPacketListener.spawn(player, item, amount, toBank);
            }));
            player.getPacketSender().sendEnterAmountPrompt(
            //   `How many ${def.getName()} would you like to spawn?`
            "How many  would you like to spawn?");
        }
        else {
            SpawnItemPacketListener.spawn(player, item, 1, toBank);
        }
    };
    return SpawnItemPacketListener;
}());
exports.SpawnItemPacketListener = SpawnItemPacketListener;
// class SpawnEntered implements EnteredAmountAction{
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