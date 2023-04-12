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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemActionPacketListener = void 0;
var Barricades_1 = require("../../../game/entity/impl/npc/impl/Barricades");
var Herblore_1 = require("../../../game/content/skill/skillable/impl/Herblore");
var Food_1 = require("../../../game/content/Food");
var TeleportHandler_1 = require("../../../game/model/teleportation/TeleportHandler");
var TeleportTablets_1 = require("../../../game/model/teleportation/TeleportTablets");
var TeleportType_1 = require("../../../game/model/teleportation/TeleportType");
var ItemIdentifiers_1 = require("../../../util/ItemIdentifiers");
var Runecrafting_1 = require("../../../game/content/skill/skillable/impl/Runecrafting");
var PotionConsumable_1 = require("../../../game/content/PotionConsumable");
var Barrows_1 = require("../../../game/content/minigames/impl/Barrows");
var Animation_1 = require("../../../game/model/Animation");
var Task_1 = require("../../../game/task/Task");
var TaskManager_1 = require("../../../game/task/TaskManager");
var PacketConstants_1 = require("../PacketConstants");
var WildernessArea_1 = require("../../../game/model/areas/impl/WildernessArea");
var CombatSpecial_1 = require("../../../game/content/combat/CombatSpecial");
var ItemDefinition_1 = require("../../../game/definition/ItemDefinition");
var Prayer_1 = require("../../../game/content/skill/skillable/impl/Prayer");
var Gambiling_1 = require("../../../game/content/Gambiling");
var GameConstants_1 = require("../../../game/GameConstants");
var BirdNest_1 = require("../../../game/content/skill/skillable/impl/woodcutting/BirdNest");
var BarrowsSet_1 = require("../../../game/model/BarrowsSet");
var ItemActionTask = /** @class */ (function (_super) {
    __extends(ItemActionTask, _super);
    function ItemActionTask(n1, p, b, execFunc) {
        var _this = _super.call(this, n1, p, b) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    ItemActionTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return ItemActionTask;
}(Task_1.Task));
var ItemActionPacketListener = /** @class */ (function () {
    function ItemActionPacketListener() {
    }
    ItemActionPacketListener.prototype.execute = function (player, packet) {
        if (player == null || player.getHitpoints() <= 0)
            return;
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.SECOND_ITEM_ACTION_OPCODE:
                ItemActionPacketListener.secondAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.FIRST_ITEM_ACTION_OPCODE:
                ItemActionPacketListener.firstAction(player, packet);
                break;
            case PacketConstants_1.PacketConstants.THIRD_ITEM_ACTION_OPCODE:
                this.thirdClickAction(player, packet);
                break;
        }
    };
    ItemActionPacketListener.firstAction = function (player, packet) {
        var e_1, _a;
        var interfaceId = packet.readUnsignedShort();
        var itemId = packet.readShort();
        var slot = packet.readShort();
        if (slot < 0 || slot > player.getInventory().capacity()) {
            return;
        }
        if (player.getInventory().getItems()[slot].getId() != itemId) {
            return;
        }
        if (player.isTeleportingReturn() || player.getHitpoints() <= 0) {
            return;
        }
        player.getPacketSender().sendInterfaceRemoval();
        // Herblore
        if (Herblore_1.Herblore.cleanHerb(player, itemId)) {
            return;
        }
        if (itemId == Barricades_1.Barricades.ITEM_ID && Barricades_1.Barricades.canSetup(player)) {
            return;
        }
        // Prayer
        if (Prayer_1.Prayer.buryBone(player, itemId)) {
            return;
        }
        // Eating food..
        if (Food_1.Food.consume(player, itemId, slot)) {
            return;
        }
        // Drinking potions..
        if (PotionConsumable_1.PotionConsumable.drink(player, itemId, slot)) {
            return;
        }
        // Runecrafting pouches..
        if (Runecrafting_1.Runecrafting.handlePouch(player, itemId, 1)) {
            return;
        }
        // Teleport tablets..
        if (TeleportTablets_1.TeleportTablets.init(player, itemId)) {
            return;
        }
        switch (itemId) {
            case ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST:
            case ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_2:
            case ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_3:
            case ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_4:
            case ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_5:
                BirdNest_1.BirdNest.handleSearchNest(player, itemId);
                break;
            case ItemIdentifiers_1.ItemIdentifiers.SPADE:
                player.performAnimation(new Animation_1.Animation(830));
                TaskManager_1.TaskManager.submit(new ItemActionTask(1, player, false, function () {
                    if (!player.isTeleportingReturn()) {
                        Barrows_1.Barrows.dig(player);
                    }
                }));
                break;
            case Gambiling_1.Gambling.MITHRIL_SEEDS:
                Gambiling_1.Gambling.plantFlower(player);
                break;
            case 9520:
                if (!(player.getArea() instanceof WildernessArea_1.WildernessArea)) {
                    if (player.getSpecialPercentage() < 100) {
                        player.getPacketSender().sendInterfaceRemoval();
                        player.performAnimation(new Animation_1.Animation(829));
                        player.getInventory().deleteNumber(9520, 1);
                        player.setSpecialPercentage(100);
                        CombatSpecial_1.CombatSpecial.updateBar(player);
                        player.getPacketSender().sendMessage("You now have 100% special attack energy.");
                    }
                    else {
                        player.getPacketSender().sendMessage("You already have full special attack energy!");
                    }
                }
                else {
                    player.getPacketSender().sendMessage("You cannot use this in the Wilderness!");
                }
                break;
            case ItemIdentifiers_1.ItemIdentifiers.TELEPORT_TO_HOUSE:
                if (TeleportHandler_1.TeleportHandler.checkReqs(player, GameConstants_1.GameConstants.DEFAULT_LOCATION)) {
                    TeleportHandler_1.TeleportHandler.teleport(player, GameConstants_1.GameConstants.DEFAULT_LOCATION, TeleportType_1.TeleportType.TELE_TAB, false);
                    player.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.TELEPORT_TO_HOUSE, 1);
                }
                break;
            case 2542:
            case 2543:
            case 2544:
                if (player.busy()) {
                    player.getPacketSender().sendMessage("You cannot do that right now.");
                    return;
                }
                if (itemId == 2542 && player.isPreserveUnlocked() || itemId == 2543 && player.isRigourUnlocked()
                    || itemId == 2544 && player.getAuguryUnlocked()) {
                    player.getPacketSender().sendMessage("You have already unlocked that prayer.");
                    return;
                }
                break;
            case 2545:
                if (player.busy()) {
                    player.getPacketSender().sendMessage("You cannot do that right now.");
                    return;
                }
                if (player.isTargetTeleportUnlocked()) {
                    player.getPacketSender().sendMessage("You have already unlocked that teleport.");
                    return;
                }
                break;
            case 12873:
            case 12875:
            case 12879:
            case 12881:
            case 12883:
            case 12877:
                var set = BarrowsSet_1.BarrowsSet.get(itemId);
                if (set) {
                    if (!player.getInventory().contains(set.getSetId())) {
                        return;
                    }
                    if ((player.getInventory().getFreeSlots() - 1) < set.getItems().length) {
                        player.getPacketSender().sendMessage("You need at least ".concat(set.getItems().length, " free inventory slots to do that."));
                        return;
                    }
                    player.getInventory().deleteNumber(set.getSetId(), 1);
                    try {
                        for (var _b = __values(set.getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var item = _c.value;
                            player.getInventory().adds(item, 1);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    player.getPacketSender().sendMessage("You've opened your ".concat(ItemDefinition_1.ItemDefinition.forId(itemId).getName(), "."));
                }
        }
    };
    ItemActionPacketListener.secondAction = function (player, packet) {
        var interfaceId = packet.readLEShortA();
        var slot = packet.readLEShort();
        var itemId = packet.readShortA();
        if (slot < 0 || slot >= player.getInventory().capacity())
            return;
        if (player.getInventory().getItems()[slot].getId() != itemId)
            return;
        if (Runecrafting_1.Runecrafting.handleTalisman(player, itemId)) {
            return;
        }
        if (Runecrafting_1.Runecrafting.handlePouch(player, itemId, 2)) {
            return;
        }
        switch (itemId) {
            case 2550:
                /*player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        player.getPacketSender().sendInterfaceRemoval();
                        if (option == 1) {
                            if (player.getInventory().contains(2550)) {
                                player.getInventory().delete(2550, 1);
                                player.setRecoilDamage(0);
                                player.getPacketSender().sendMessage("Your Ring of recoil has degraded.");
                            }
                        }
                    }
                });
                player.setDialogue(DialogueManager.getDialogues().get(10)); // Yes / no option
                DialogueManager.sendStatement(player,
                        "You still have " + (40 - player.getRecoilDamage()) + " damage before it breaks. Continue?");*/
                break;
        }
    };
    ItemActionPacketListener.prototype.thirdClickAction = function (player, packet) {
        var itemId = packet.readShortA();
        var slot = packet.readLEShortA();
        var interfaceId = packet.readLEShortA();
        if (slot < 0 || slot >= player.getInventory().capacity())
            return;
        if (player.getInventory().getItems()[slot].getId() != itemId)
            return;
        if (BarrowsSet_1.BarrowsSet.pack(player, itemId)) {
            return;
        }
        if (Runecrafting_1.Runecrafting.handlePouch(player, itemId, 3)) {
            return;
        }
        switch (itemId) {
            case 12926:
                player.getPacketSender().sendMessage("Your Toxic blowpipe has " + player.getBlowpipeScales() + " Zulrah scales left.");
                break;
        }
    };
    return ItemActionPacketListener;
}());
exports.ItemActionPacketListener = ItemActionPacketListener;
//# sourceMappingURL=ItemActionPacketListener.js.map