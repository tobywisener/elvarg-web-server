"use strict";
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
exports.BountyHunter = void 0;
var Emblem_1 = require("./Emblem");
var TargetPair_1 = require("./TargetPair");
var WealthType_1 = require("./WealthType");
var CombatFactory_1 = require("../CombatFactory");
var ItemOnGroundManager_1 = require("../../../entity/impl/grounditem/ItemOnGroundManager");
var PlayerBot_1 = require("../../../entity/impl/playerbot/PlayerBot");
var BrokenItem_1 = require("../../../model/BrokenItem");
var Item_1 = require("../../../model/Item");
var WildernessArea_1 = require("../../../model/areas/impl/WildernessArea");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../util/Misc");
var BountyHunter = exports.BountyHunter = /** @class */ (function () {
    function BountyHunter() {
    }
    BountyHunter.process = function (player) {
        var e_1, _a;
        var _b;
        var target = BountyHunter.getTargetFor(player);
        if (player.getArea() instanceof WildernessArea_1.WildernessArea) {
            if (!target) {
                if (player.getTargetSearchTimer().finished()) {
                    if (!BountyHunter.validTargetContester(player)) {
                        return;
                    }
                    try {
                        for (var _c = __values(BountyHunter.PLAYERS_IN_WILD), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var player2 = _d.value;
                            if (BountyHunter.validTargetContester(player2)) {
                                // Check other stuff...
                                if (player === player2) {
                                    continue;
                                }
                                if (player instanceof PlayerBot_1.PlayerBot && player2 instanceof PlayerBot_1.PlayerBot) {
                                    continue;
                                }
                                if (player.getRecentKills().includes(player2.getHostAddress())) {
                                    continue;
                                }
                                var combatDifference = CombatFactory_1.CombatFactory.combatLevelDifference(player.getSkillManager().getCombatLevel(), player2.getSkillManager().getCombatLevel());
                                if (combatDifference < (player.getWildernessLevel() + 5) && combatDifference < (player2.getWildernessLevel() + 5)) {
                                    BountyHunter.assign(player, player2);
                                    break;
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    player.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
                }
            }
            else {
                if (target) {
                    var safeTimer = player.decrementAndGetSafeTimer();
                    if (safeTimer === 180 || safeTimer === 120 || safeTimer === 60) {
                        player.getPacketSender().sendMessage("You have ".concat(safeTimer, " seconds to get back to the wilderness before you lose your target."));
                        target === null || target === void 0 ? void 0 : target.getPacketSender().sendMessage("Your target has ".concat(safeTimer, " seconds to get back to the wilderness before they lose you as target."));
                    }
                    if (safeTimer === 0) {
                        BountyHunter.unassign(player);
                        player.getTargetSearchTimer().start(BountyHunter.TARGET_ABANDON_DELAY_SECONDS);
                        player.getPacketSender().sendMessage("You have lost your target.");
                        (_b = target === null || target === void 0 ? void 0 : target.getPacketSender()) === null || _b === void 0 ? void 0 : _b.sendMessage("You have lost your target and will be given a new one shortly.");
                        target === null || target === void 0 ? void 0 : target.getTargetSearchTimer().start((BountyHunter.TARGET_SEARCH_DELAY_SECONDS / 2));
                    }
                }
            }
        }
    };
    BountyHunter.assign = function (player1, player2) {
        if (!BountyHunter.getPairFor(player1) && !BountyHunter.getPairFor(player2)) {
            var pair = new TargetPair_1.TargetPair(player1, player2);
            BountyHunter.TARGET_PAIRS.push(pair);
            player1.getPacketSender().sendMessage("You've been assigned ".concat(player2.getUsername(), " as your target!"));
            player2.getPacketSender().sendMessage("You've been assigned ".concat(player1.getUsername(), " as your target!"));
            player1.getPacketSender().sendEntityHint(player2);
            player2.getPacketSender().sendEntityHint(player1);
            player1.resetSafingTimer();
            player2.resetSafingTimer();
            BountyHunter.updateInterface(player1);
            BountyHunter.updateInterface(player2);
            if (player1 instanceof PlayerBot_1.PlayerBot) {
                player1.getCombatInteraction().targetAssigned(player2);
            }
            else if (player2 instanceof PlayerBot_1.PlayerBot) {
                player2.getCombatInteraction().targetAssigned(player1);
            }
        }
    };
    BountyHunter.unassign = function (player) {
        var pair = BountyHunter.getPairFor(player);
        if (pair) {
            BountyHunter.TARGET_PAIRS.splice(BountyHunter.TARGET_PAIRS.indexOf(pair), 1);
            var p1 = pair.getPlayer1();
            var p2 = pair.getPlayer2();
            p1.getPacketSender().sendEntityHintRemoval(true);
            p2.getPacketSender().sendEntityHintRemoval(true);
            BountyHunter.updateInterface(p1);
            BountyHunter.updateInterface(p2);
            p1.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
            p2.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
        }
    };
    BountyHunter.getTargetFor = function (player) {
        var pair = BountyHunter.getPairFor(player);
        if (pair) {
            if (pair.getPlayer1() === player) {
                return pair.getPlayer2();
            }
            if (pair.getPlayer2() === player) {
                return pair.getPlayer1();
            }
        }
        return undefined;
    };
    BountyHunter.getPairFor = function (p) {
        var e_2, _a;
        try {
            for (var _b = __values(BountyHunter.TARGET_PAIRS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pair = _c.value;
                if (p === pair.getPlayer1() || p === pair.getPlayer2()) {
                    return pair;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return undefined;
    };
    BountyHunter.onDeath = function (killer, killed, canGetFullReward, minBloodMoneyReward) {
        // Cache the killed player's killstreak
        var enemyKillstreak = killed.getKillstreak();
        // Reset killed player's killstreak
        if (killed.getKillstreak() > 0) {
            killed.getPacketSender().sendMessage("You have lost your " + killed.getKillstreak() + " killstreak.");
        }
        killed.setKillstreak(0);
        // Increment killed player's deaths
        killed.incrementDeaths();
        // Update interfaces for killed player containing the new deaths etc
        killed.getPacketSender().sendString("@or1@Deaths: " + killed.getDeaths(), 52031).sendString("@or1@K/D Ratio: " + killed.getKillDeathRatio(), 52033);
        // Remove first index if we've killed 1
        if (killer.getRecentKills().length >= 1) {
            killer.getRecentKills().shift();
        }
        // Should the player be rewarded for this kill?
        var fullRewardPlayer = canGetFullReward;
        // Check if we recently killed this player
        if (killer.getRecentKills().indexOf(killed.getHostAddress()) !== -1
            || killer.getHostAddress() === killed.getHostAddress()) {
            fullRewardPlayer = false;
        }
        else {
            killer.getRecentKills().push(killed.getHostAddress());
        }
        var target = BountyHunter.getTargetFor(killer);
        // Check if the player killed was our target..
        if (target && target === killed) {
            // Send messages
            killed.getPacketSender().sendMessage("You were defeated by your target!");
            killer.getPacketSender().sendMessage("Congratulations, you managed to defeat your target!");
            // Increment killer's target kills
            killer.incrementTargetKills();
            // Reset targets
            BountyHunter.unassign(killer);
            // If player isnt farming kills..
            if (fullRewardPlayer && !(killed instanceof PlayerBot_1.PlayerBot)) {
                // Search for emblem in the player's inventory
                var inventoryEmblem = null;
                for (var i = 0; i < Emblem_1.Emblem.length; i++) {
                    if (killer.getInventory().contains(Emblem_1.Emblem[i].id)) {
                        inventoryEmblem = Emblem_1.Emblem[i];
                        // Keep looping, find best emblem.
                    }
                }
                // This emblem can't be upgraded more..
                if (inventoryEmblem != null) {
                    if (inventoryEmblem != Emblem_1.Emblem[9].name) {
                        // We found an emblem. Upgrade it!
                        // Double check that we have it inventory one more time
                        if (killer.getInventory().contains(inventoryEmblem.id)) {
                            killer.getInventory().delete(inventoryEmblem.id, 1);
                            var nextEmblemId = 1;
                            // Mysterious emblem tier 1 has a noted version too...
                            // So add 2 instead of 1 to skip it.
                            if (inventoryEmblem == Emblem_1.Emblem[0].name) {
                                nextEmblemId = 2;
                            }
                            // Add the next emblem and notify the player
                            killer.getInventory().addItem(inventoryEmblem.id + nextEmblemId);
                            killer.getPacketSender().sendMessage("@red@Your mysterious emblem has been upgraded!");
                        }
                    }
                    else {
                        // This emblem can't be upgraded more..
                        killer.getPacketSender().sendMessage("@red@Your mysterious emblem is already tier 10 and cannot be upgraded further.");
                    }
                }
                // Randomly drop an emblem (50% chance) when killing a target.
                if (Misc_1.Misc.getRandom(10) <= 5) {
                    ItemOnGroundManager_1.ItemOnGroundManager.registerNonGlobals(killer, new Item_1.Item(Emblem_1.Emblem[0].id, 1), killed.getLocation());
                    killer.getPacketSender().sendMessage("@red@You have been awarded with a mysterious emblem for successfully killing your target.");
                }
                else {
                    killer.getPacketSender().sendMessage("@red@You did not receive an emblem for this target kill. Better luck next time!");
                }
            }
        }
        else {
            if (fullRewardPlayer) {
                // Increment regular kills since we didn't kill a target.
                killer.incrementKills();
            }
        }
        var additionalBloodMoneyFromBrokenItems = (BrokenItem_1.BrokenItem.getValueLoseOnDeath(killed) * 3) / 4; // only 75%
        if (fullRewardPlayer) {
            // Increment total kills..
            killer.incrementTotalKills();
            // Increment killstreak..
            killer.incrementKillstreak();
            // Update interfaces
            killer.getPacketSender().sendString("@or1@Killstreak: " + killer.getKillstreak(), 52029)
                .sendString("@or1@Kills: " + killer.getTotalKills(), 52030)
                .sendString("@or1@K/D Ratio: " + killer.getKillDeathRatio(), 52033);
            if (!(killer instanceof PlayerBot_1.PlayerBot)) {
                // Reward player for the kill..
                var rewardAmount = 130 + (100 * enemyKillstreak) + (150 * killer.getKillstreak())
                    + (10 * killer.getWildernessLevel()) + additionalBloodMoneyFromBrokenItems;
                if (killer.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY)
                    || killer.getInventory().getFreeSlots() > 0) {
                    killer.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY, rewardAmount);
                }
                else {
                    ItemOnGroundManager_1.ItemOnGroundManager.registerNonGlobals(killer, new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY, rewardAmount), killed.getLocation());
                }
                killer.getPacketSender().sendMessage("You've received " + rewardAmount + " blood money for that kill!");
            }
            // Check if the killstreak is their highest yet..
            if (killer.getKillstreak() > killer.getHighestKillstreak()) {
                killer.setHighestKillstreak(killer.getKillstreak());
                killer.getPacketSender().sendMessage("Congratulations! Your highest killstreak is now " + killer.getHighestKillstreak() + "");
            }
            else {
                killer.getPacketSender().sendMessage("Your killstreak is now " + killer.getKillstreak() + ".");
            }
        }
        else {
            // Reward player for the kill..
            var rewardAmount = minBloodMoneyReward + Misc_1.Misc.getRandom(minBloodMoneyReward) + additionalBloodMoneyFromBrokenItems;
            if (killer.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY)
                || killer.getInventory().getFreeSlots() > 0) {
                killer.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY, rewardAmount);
            }
            else {
                ItemOnGroundManager_1.ItemOnGroundManager.registerNonGlobals(killer, new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY, rewardAmount), killed.getLocation());
            }
            killer.getPacketSender().sendMessage("You've received " + rewardAmount + " blood money for that kill!");
        }
        // Update interfaces
        BountyHunter.updateInterface(killer);
        BountyHunter.updateInterface(killed);
    };
    BountyHunter.updateInterface = function (player) {
        /*
         * Optional<Player> target = getTargetFor(player);
         *
         * // Check if we have a target... if (target.isPresent()) {
         *
         * // We have a target - send info on interface.. final WealthType type =
         * WealthType.getWealth(target.get());
         *
         * // Send strings player.getPacketSender().sendString(TARGET_WEALTH_STRING,
         * "Wealth: " + type.tooltip) .sendString(TARGET_NAME_STRING,
         * target.get().getUsername()) .sendString(TARGET_LEVEL_STRING, "Combat: " +
         * target.get().getSkillManager().getCombatLevel());
         *
         * // Send wealth type showWealthType(player, type); } else {
         *
         * // No target - reset target info on interface..
         *
         * // Send strings.. player.getPacketSender().sendString(TARGET_WEALTH_STRING,
         * "---").sendString(TARGET_NAME_STRING, "None")
         * .sendString(TARGET_LEVEL_STRING, "Combat: ------");
         *
         * // Send wealth type.. showWealthType(player, WealthType.NO_TARGET); }
         *
         * // Update kda information.. player.getPacketSender().sendString(23323,
         * "Targets killed: " + player.getTargetKills()) .sendString(23324,
         * "Players killed: " + player.getNormalKills()) .sendString(23325, "Deaths: " +
         * player.getDeaths());
         *
         */
    };
    BountyHunter.showWealthType = function (player, type) {
        var e_3, _a;
        try {
            for (var _b = __values(Object.values(WealthType_1.WealthType)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var types = _c.value;
                var state = 0;
                if (types === type) {
                    state = 1;
                }
                player.getPacketSender().sendConfig(types.configId, state);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    BountyHunter.getValueForEmblems = function (player, performSale) {
        var e_4, _a, e_5, _b;
        var list;
        try {
            for (var _c = __values(Object.values(Emblem_1.Emblem)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var emblem = _d.value;
                if (player.getInventory().contains(emblem.id)) {
                    list.push(emblem);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (list.length === 0) {
            return 0;
        }
        var value = 0;
        try {
            for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                var emblem = list_1_1.value;
                var amount = player.getInventory().getAmount(emblem.id);
                if (amount > 0) {
                    if (performSale) {
                        player.getInventory().deleteNumber(emblem.id, amount);
                        player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY, (emblem.value * amount));
                    }
                    value += (emblem.value * amount);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_b = list_1.return)) _b.call(list_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return value;
    };
    BountyHunter.validTargetContester = function (p) {
        return (p != null &&
            p.isRegistered() &&
            p.getArea() instanceof WildernessArea_1.WildernessArea &&
            p.getWildernessLevel() > 0 &&
            !p.isUntargetable() &&
            p.getHitpoints() > 0 &&
            !p.isNeedsPlacement() &&
            BountyHunter.getPairFor(p) !== undefined);
    };
    BountyHunter.PLAYERS_IN_WILD = [];
    BountyHunter.TARGET_PAIRS = [];
    BountyHunter.TARGET_WEALTH_STRING = 23305;
    BountyHunter.TARGET_NAME_STRING = 23307;
    BountyHunter.TARGET_LEVEL_STRING = 23308;
    BountyHunter.TARGET_SEARCH_DELAY_SECONDS = 80;
    BountyHunter.TARGET_ABANDON_DELAY_SECONDS = 120;
    return BountyHunter;
}());
//# sourceMappingURL=BountyHunter.js.map