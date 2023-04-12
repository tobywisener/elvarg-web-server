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
exports.PlayerDeathTask = void 0;
var GameConstants_1 = require("../../GameConstants");
var ItemsKeptOnDeath_1 = require("../../content/ItemsKeptOnDeath");
var CombatFactory_1 = require("../../content/combat/CombatFactory");
var Emblem_1 = require("../../content/combat/bountyhunter/Emblem");
var Presetables_1 = require("../../content/presets/Presetables");
var ItemDefinition_1 = require("../../definition/ItemDefinition");
var ItemOnGroundManager_1 = require("../../entity/impl/grounditem/ItemOnGroundManager");
var PlayerBot_1 = require("../../entity/impl/playerbot/PlayerBot");
var PlayerRights_1 = require("../../model/rights/PlayerRights");
var Task_1 = require("../Task");
var Item_1 = require("../../model/Item");
var PrayerHandler_1 = require("../../content/PrayerHandler");
var BrokenItem_1 = require("../../model/BrokenItem");
var Animation_1 = require("../../model/Animation");
var PlayerDeathTask = /** @class */ (function (_super) {
    __extends(PlayerDeathTask, _super);
    function PlayerDeathTask(player) {
        var _this = _super.call(this, 1, false) || this;
        _this.loseItems = true;
        _this.itemsToKeep = [];
        _this.ticks = 2;
        _this.player = player;
        _this.killer = player.getCombat().getKiller(true);
        return _this;
    }
    PlayerDeathTask.prototype.execute = function () {
        var e_1, _a, e_2, _b;
        if (!this.player) {
            this.stop();
            return;
        }
        try {
            switch (this.ticks) {
                case 0: {
                    if (this.player instanceof PlayerBot_1.PlayerBot) {
                        this.player.getCombatInteraction().handleDeath(this.killer);
                    }
                    if (this.player.getArea() != null) {
                        this.loseItems = this.player.getArea().dropItemsOnDeath(this.player, this.killer);
                    }
                    var droppedItems = [];
                    if (this.loseItems) {
                        this.itemsToKeep = ItemsKeptOnDeath_1.ItemsKeptOnDeath.getItemsToKeep(this.player);
                        var playerItems = this.player.getInventory().getValidItems().concat(this.player.getEquipment().getValidItems());
                        var position = this.player.getLocation();
                        var dropped = false;
                        try {
                            for (var playerItems_1 = __values(playerItems), playerItems_1_1 = playerItems_1.next(); !playerItems_1_1.done; playerItems_1_1 = playerItems_1.next()) {
                                var item = playerItems_1_1.value;
                                // Keep tradeable items
                                if (!item.getDefinition().isTradeable() || this.itemsToKeep.includes(item)) {
                                    if (!this.itemsToKeep.includes(item)) {
                                        this.itemsToKeep.push(item);
                                    }
                                    continue;
                                }
                                // Don't drop items if we're owner or dev
                                if (this.player.getRights() === PlayerRights_1.PlayerRights.OWNER || this.player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER) {
                                    break;
                                }
                                // Drop emblems but downgrade them a tier.
                                if (item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_1.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_2.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_3.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_4.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_5.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_6.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_7.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_8.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_9.id ||
                                    item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_10.id) {
                                    // Tier 1 shouldnt be dropped cause it cant be downgraded
                                    if (item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_1.id) {
                                        continue;
                                    }
                                    if (this.killer) {
                                        var lowerEmblem = item.getId() === Emblem_1.Emblem.MYSTERIOUS_EMBLEM_2.id ? item.getId() - 2 : item.getId() - 1;
                                        ItemOnGroundManager_1.ItemOnGroundManager.registerNonGlobals(this.killer, new Item_1.Item(lowerEmblem), position);
                                        this.killer.getPacketSender().sendMessage("@red@" +
                                            this.player.getUsername() +
                                            " dropped a " +
                                            ItemDefinition_1.ItemDefinition.forId(lowerEmblem).getName() +
                                            "!");
                                        dropped = true;
                                    }
                                    continue;
                                }
                                droppedItems.push(item);
                                // Drop item
                                ItemOnGroundManager_1.ItemOnGroundManager.registerLocation(this.killer ? this.killer : this.player, item, position);
                                dropped = true;
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (playerItems_1_1 && !playerItems_1_1.done && (_a = playerItems_1.return)) _a.call(playerItems_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        // Handle defeat..
                        if (this.killer) {
                            if (this.killer.getArea() != null) {
                                this.killer.getArea().defeated(this.killer, this.player);
                            }
                            if (!dropped) {
                                this.killer.getPacketSender().sendMessage("".concat(this.player.getUsername(), " had no valuable items to be dropped."));
                            }
                        }
                        // Reset items
                        this.player.getInventory().resetItems().refreshItems();
                        this.player.getEquipment().resetItems().refreshItems();
                    }
                    // Restore the player's default attributes (such as stats)..
                    this.player.resetAttributes();
                    // If the player lost items..
                    if (this.loseItems) {
                        // Handle items kept on death..
                        if (this.itemsToKeep.length > 0) {
                            try {
                                for (var _c = __values(this.itemsToKeep), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    var it = _d.value;
                                    var id = it.getId();
                                    var brokenItem = BrokenItem_1.BrokenItem.get(id);
                                    if (brokenItem != null) {
                                        id = brokenItem.getBrokenItem();
                                        this.player.getPacketSender().sendMessage("Your ".concat(ItemDefinition_1.ItemDefinition.forId(it.getId()).getName(), " has been broken. You can fix it by talking to Perdu."));
                                    }
                                    this.player.getInventory().adds(id, it.getAmount());
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            this.itemsToKeep.length = 0;
                        }
                    }
                    var handledDeath = false;
                    if (this.player.getArea() != null) {
                        handledDeath = this.player.getArea().handleDeath(this.player, this.killer);
                    }
                    if (!handledDeath) {
                        this.player.moveTo(GameConstants_1.GameConstants.DEFAULT_LOCATION);
                        if (this.loseItems) {
                            if (this.player.isOpenPresetsOnDeath()) {
                                Presetables_1.Presetables.opens(this.player);
                            }
                        }
                    }
                    // Stop the event..
                    stop();
                    break;
                }
                case 2: {
                    if (this.player instanceof PlayerBot_1.PlayerBot) {
                        this.player.getCombatInteraction().handleDying(this.killer);
                    }
                    // Reset combat..
                    this.player.getCombat().reset();
                    // Reset movement queue and disable it..
                    this.player.getMovementQueue().setBlockMovement(true).reset();
                    // Mark us as untargetable..
                    this.player.setUntargetable(true);
                    // Close all open interfaces..
                    this.player.getPacketSender().sendInterfaceRemoval();
                    // Send death message..
                    this.player.getPacketSender().sendMessage("Oh dear, you are dead!");
                    // Perform death animation..
                    this.player.performAnimation(new Animation_1.Animation(836));
                    // Handle retribution prayer effect on our killer, if present..
                    if (PrayerHandler_1.PrayerHandler.isActivated(this.player, PrayerHandler_1.PrayerHandler.RETRIBUTION)) {
                        if (typeof this.killer !== 'undefined' && this.killer !== null) {
                            CombatFactory_1.CombatFactory.handleRetribution(this.player, this.killer);
                        }
                    }
                    break;
                }
            }
            this.ticks--;
        }
        catch (e) {
            _super.prototype.stop.call(this);
            console.error(e);
            this.player.resetAttributes();
            this.player.moveTo(GameConstants_1.GameConstants.DEFAULT_LOCATION);
        }
    };
    return PlayerDeathTask;
}(Task_1.Task));
exports.PlayerDeathTask = PlayerDeathTask;
//# sourceMappingURL=PlayerDeath.js.map