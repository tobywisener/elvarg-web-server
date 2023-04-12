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
exports.Trading = void 0;
var ItemDefinition_1 = require("../definition/ItemDefinition");
var PlayerBot_1 = require("../entity/impl/playerbot/PlayerBot");
var Item_1 = require("../model/Item");
var PlayerStatus_1 = require("../model/PlayerStatus");
var SecondsTimer_1 = require("../model/SecondsTimer");
var ItemContainer_1 = require("../model/container/ItemContainer");
var StackType_1 = require("../model/container/StackType");
var Inventory_1 = require("../model/container/impl/Inventory");
var Misc_1 = require("../../util/Misc");
var PlayerItemContainer = /** @class */ (function (_super) {
    __extends(PlayerItemContainer, _super);
    function PlayerItemContainer(player, execFunc) {
        var _this = _super.call(this, player) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    PlayerItemContainer.prototype.stackType = function () {
        return StackType_1.StackType.DEFAULT;
    };
    PlayerItemContainer.prototype.refreshItems = function () {
        this.execFunc();
        return this;
    };
    PlayerItemContainer.prototype.full = function () {
        this.player.getPacketSender().sendMessage("You cannot trade more items.");
        return this;
    };
    PlayerItemContainer.prototype.capacity = function () {
        return 28;
    };
    return PlayerItemContainer;
}(ItemContainer_1.ItemContainer));
var Trading = exports.Trading = /** @class */ (function () {
    function Trading(player) {
        var _this = this;
        this.state = TradeState.NONE;
        // Delays!!
        this.button_delay = new SecondsTimer_1.SecondsTimer();
        this.request_delay = new SecondsTimer_1.SecondsTimer();
        this.player = player;
        this.container = new PlayerItemContainer(player, function () {
            player.getPacketSender().sendInterfaceSet(Trading.INTERFACE, Trading.CONTAINER_INVENTORY_INTERFACE);
            player.getPacketSender().sendItemContainer(_this.container, Trading.CONTAINER_INTERFACE_ID);
            player.getPacketSender().sendItemContainer(player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);
            player.getPacketSender().sendItemContainer(_this.interact.getTrading().getContainer(), Trading.CONTAINER_INTERFACE_ID_2);
            _this.interact.getPacketSender().sendItemContainer(player.getTrading().getContainer(), Trading.CONTAINER_INTERFACE_ID_2);
            return _this;
        });
    }
    Trading.listItems = function (items) {
        var e_1, _a, e_2, _b, e_3, _c;
        var string = "";
        var item_counter = 0;
        var list = [];
        try {
            for (var _d = __values(items.getValidItems()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var item = _e.value;
                try {
                    for (var list_1 = (e_2 = void 0, __values(list)), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                        var item_ = list_1_1.value;
                        if (item_.getId() == item.getId()) {
                            continue;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (list_1_1 && !list_1_1.done && (_b = list_1.return)) _b.call(list_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                list.push(new Item_1.Item(item.getId(), items.getAmount(item.getId())));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var list_2 = __values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
                var item = list_2_1.value;
                if (item_counter > 0) {
                    string += "\n";
                }
                string += item.getDefinition().getName().replace(/_/g, " ");
                var amt = "" + Misc_1.Misc.format(item.getAmount());
                if (item.getAmount() >= 1000000000) {
                    amt = "@gre@" + Math.floor(item.getAmount() / 1000000000) + " billion @whi@(" + Misc_1.Misc.format(item.getAmount())
                        + ")";
                }
                else if (item.getAmount() >= 1000000) {
                    amt = "@gre@" + Math.floor(item.getAmount() / 1000000) + " million @whi@(" + Misc_1.Misc.format(item.getAmount()) + ")";
                }
                else if (item.getAmount() >= 1000) {
                    amt = "@cya@" + Math.floor(item.getAmount() / 1000) + "K @whi@(" + Misc_1.Misc.format(item.getAmount()) + ")";
                }
                string += " x @red@" + amt;
                item_counter++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (list_2_1 && !list_2_1.done && (_c = list_2.return)) _c.call(list_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (item_counter == 0) {
            string = "Absolutely nothing!";
        }
        return string;
    };
    Trading.validate = function (player, interact, playerStatus) {
        var e_4, _a, e_5, _b;
        var tradeState = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            tradeState[_i - 3] = arguments[_i];
        }
        if (player == null || interact == null) {
            return false;
        }
        if (player.getStatus() != playerStatus) {
            return false;
        }
        if (interact.getStatus() != playerStatus) {
            return false;
        }
        if (player.getTrading().getInteract() == null || player.getTrading().getInteract() != interact) {
            return false;
        }
        if (interact.getTrading().getInteract() == null || interact.getTrading().getInteract() != player) {
            return false;
        }
        var found = false;
        try {
            for (var tradeState_1 = __values(tradeState), tradeState_1_1 = tradeState_1.next(); !tradeState_1_1.done; tradeState_1_1 = tradeState_1.next()) {
                var duelState = tradeState_1_1.value;
                if (player.getTrading().getState() == duelState) {
                    found = true;
                    break;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (tradeState_1_1 && !tradeState_1_1.done && (_a = tradeState_1.return)) _a.call(tradeState_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (!found) {
            return false;
        }
        found = false;
        try {
            for (var tradeState_2 = __values(tradeState), tradeState_2_1 = tradeState_2.next(); !tradeState_2_1.done; tradeState_2_1 = tradeState_2.next()) {
                var duelState = tradeState_2_1.value;
                if (interact.getTrading().getState() == duelState) {
                    found = true;
                    break;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (tradeState_2_1 && !tradeState_2_1.done && (_b = tradeState_2.return)) _b.call(tradeState_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (!found) {
            return false;
        }
        return true;
    };
    Trading.prototype.requestTrade = function (t_) {
        if (this.state == TradeState.NONE || this.state == TradeState.REQUESTED_TRADE) {
            if (!this.request_delay.finished()) {
                var seconds = this.request_delay.secondsRemaining();
                this.player.getPacketSender()
                    .sendMessage("You must wait another " + (seconds == 1 ? "second" : "" + seconds + " seconds")
                    + " before sending more trade requests.");
                return;
            }
            // Cache the interact...
            var interact_ = this.interact;
            var t_state = t_.getTrading().getState();
            var initiateTrade = false;
            this.setInteract(t_);
            this.setState(TradeState.REQUESTED_TRADE);
            if (t_state == TradeState.REQUESTED_TRADE) {
                if (t_.getTrading().getInteract() != null && t_.getTrading().getInteract() == this.player) {
                    initiateTrade = true;
                }
            }
            if (initiateTrade) {
                this.player.getTrading().initiateTrade();
                t_.getTrading().initiateTrade();
            }
            else {
                this.player.getPacketSender().sendMessage("You've sent a trade request to " + t_.getUsername() + ".");
                t_.getPacketSender().sendMessage(this.player.getUsername() + ":tradereq:");
                if (t_ instanceof PlayerBot_1.PlayerBot) {
                    // Player Bots: Automatically accept any trade request
                    (t_.getTradingInteraction().acceptTradeRequest(this.player));
                }
            }
            this.request_delay.start(2);
        }
        else {
            this.player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    };
    Trading.prototype.initiateTrade = function () {
        this.player.setStatus(PlayerStatus_1.PlayerStatus.TRADING);
        this.setState(TradeState.TRADE_SCREEN);
        this.player.getPacketSender().sendString("Trading with: @whi@" + this.interact.getUsername(), Trading.TRADING_WITH_FRAME);
        this.player.getPacketSender().sendString("", Trading.STATUS_FRAME_1)
            .sendString("Are you sure you want to make this trade?", Trading.STATUS_FRAME_2)
            .sendString("0 bm", Trading.ITEM_VALUE_1_FRAME).sendString("0 bm", Trading.ITEM_VALUE_2_FRAME);
        this.container.resetItems();
        this.container.refreshItems();
        if (this.player instanceof PlayerBot_1.PlayerBot) {
            (this.player.getTradingInteraction().addItemsToTrade(this.container, this.interact));
        }
    };
    Trading.prototype.closeTrade = function () {
        var e_6, _a;
        if (this.state != TradeState.NONE) {
            var interact_ = this.interact;
            try {
                for (var _b = __values(this.container.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var t = _c.value;
                    this.container.switchItems(this.player.getInventory(), t.clone(), false, false);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            this.player.getInventory().refreshItems();
            this.resetAttributes();
            this.player.getPacketSender().sendMessage("Trade declined.");
            this.player.getPacketSender().sendInterfaceRemoval();
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                    if (interact_.getTrading().getInteract() != null && interact_.getTrading().getInteract() == this.player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    };
    Trading.prototype.acceptTrade = function () {
        var e_7, _a, e_8, _b, e_9, _c;
        if (!Trading.validate(this.player, this.interact, PlayerStatus_1.PlayerStatus.TRADING, TradeState.TRADE_SCREEN, TradeState.ACCEPTED_TRADE_SCREEN, TradeState.CONFIRM_SCREEN, TradeState.ACCEPTED_CONFIRM_SCREEN)) {
            return;
        }
        if (!this.button_delay.finished()) {
            return;
        }
        var interact_ = this.interact;
        var t_state = interact_.getTrading().getState();
        if (this.state == TradeState.TRADE_SCREEN) {
            var slotsNeeded = 0;
            try {
                for (var _d = __values(this.container.getValidItems()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var t = _e.value;
                    slotsNeeded += t.getDefinition().isStackable() && this.interact.getInventory().contains(t.getId()) ? 0 : 1;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_7) throw e_7.error; }
            }
            var freeSlots = this.interact.getInventory().getFreeSlots();
            if (slotsNeeded > freeSlots) {
                this.player.getPacketSender().sendMessage("")
                    .sendMessage("@or3@" + this.interact.getUsername() + " will not be able to hold that item.")
                    .sendMessage("@or3@They have " + freeSlots + " free inventory slot" + (freeSlots == 1 ? "." : "s."));
                this.interact.getPacketSender()
                    .sendMessage("Trade cannot be accepted, you don't have enough free inventory space.");
                return;
            }
            this.state = (TradeState.ACCEPTED_TRADE_SCREEN);
            this.player.getPacketSender().sendString("Waiting for other player..", Trading.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString("" + this.player.getUsername() + " has accepted.", Trading.STATUS_FRAME_1);
            if (this.state == TradeState.ACCEPTED_TRADE_SCREEN && t_state == TradeState.ACCEPTED_TRADE_SCREEN) {
                this.player.getTrading().confirmScreen();
                interact_.getTrading().confirmScreen();
            }
            else {
                if (interact_ instanceof PlayerBot_1.PlayerBot) {
                    interact_.getTradingInteraction().acceptTrade();
                }
            }
        }
        else if (this.state === TradeState.CONFIRM_SCREEN) {
            // Both are in the same state. Do the second-stage accept.
            this.state = (TradeState.ACCEPTED_CONFIRM_SCREEN);
            // Update status...
            this.player.getPacketSender().sendString("Waiting for " + interact_.getUsername() + 's confirmation..', Trading.STATUS_FRAME_2);
            interact_.getPacketSender().sendString("" + this.player.getUsername() + " has accepted.Do you wish to do the same ?", Trading.STATUS_FRAME_2);
            if (this.state === TradeState.ACCEPTED_CONFIRM_SCREEN && t_state === TradeState.ACCEPTED_CONFIRM_SCREEN) {
                // Give items to both players...
                var receivingItems = interact_.getTrading().getContainer().getValidItems();
                try {
                    for (var receivingItems_1 = __values(receivingItems), receivingItems_1_1 = receivingItems_1.next(); !receivingItems_1_1.done; receivingItems_1_1 = receivingItems_1.next()) {
                        var item = receivingItems_1_1.value;
                        this.player.getInventory().addItem(item);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (receivingItems_1_1 && !receivingItems_1_1.done && (_b = receivingItems_1.return)) _b.call(receivingItems_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                var givingItems = this.player.getTrading().getContainer().getValidItems();
                try {
                    for (var givingItems_1 = __values(givingItems), givingItems_1_1 = givingItems_1.next(); !givingItems_1_1.done; givingItems_1_1 = givingItems_1.next()) {
                        var item = givingItems_1_1.value;
                        interact_.getInventory().addItem(item);
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (givingItems_1_1 && !givingItems_1_1.done && (_c = givingItems_1.return)) _c.call(givingItems_1);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
                if (this.player instanceof PlayerBot_1.PlayerBot && receivingItems.length > 0) {
                    this.player.getTradingInteraction().receivedItems(receivingItems, interact_);
                }
                // Reset attributes for both players...
                this.resetAttributes();
                interact_.getTrading().resetAttributes();
                // Send interface removal for both players...
                this.player.getPacketSender().sendInterfaceRemoval();
                interact_.getPacketSender().sendInterfaceRemoval();
                // Send successful trade message!
                this.player.getPacketSender().sendMessage("Trade accepted!");
                interact_.getPacketSender().sendMessage("Trade accepted!");
            }
        }
        else {
            if (interact_ instanceof PlayerBot_1.PlayerBot) {
                interact_.getTradingInteraction().acceptTrade();
            }
        }
        this.button_delay.start(1);
    };
    Trading.prototype.confirmScreen = function () {
        // Update state
        this.state = TradeState.CONFIRM_SCREEN;
        // Send new interface
        this.player.getPacketSender().sendInterfaceSet(Trading.CONFIRM_SCREEN_INTERFACE, Trading.CONTAINER_INVENTORY_INTERFACE);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);
        // Send new interface frames
        var thisItems = Trading.listItems(this.container);
        var interactItems = Trading.listItems(this.interact.getTrading().getContainer());
        this.player.getPacketSender().sendString(thisItems, Trading.ITEM_LIST_1_FRAME);
        this.player.getPacketSender().sendString(interactItems, Trading.ITEM_LIST_2_FRAME);
    };
    Trading.prototype.handleItem = function (id, amount, slot, from, to) {
        if (this.player.getInterfaceId() === Trading.INTERFACE) {
            // Validate this trade action..
            if (!Trading.validate(this.player, this.interact, PlayerStatus_1.PlayerStatus.TRADING, TradeState.TRADE_SCREEN, TradeState.ACCEPTED_TRADE_SCREEN)) {
                return;
            }
            // Check if the trade was previously accepted (and now modified)...
            var modified = false;
            if (this.state === TradeState.ACCEPTED_TRADE_SCREEN) {
                this.state = TradeState.TRADE_SCREEN;
                modified = true;
            }
            if (this.interact.getTrading().getState() === TradeState.ACCEPTED_TRADE_SCREEN) {
                this.interact.getTrading().setState(TradeState.TRADE_SCREEN);
                modified = true;
            }
            if (modified) {
                this.player.getPacketSender().sendString("@red@TRADE MODIFIED!", Trading.STATUS_FRAME_1);
                this.interact.getPacketSender().sendString("@red@TRADE MODIFIED!", Trading.STATUS_FRAME_1);
            }
            if (this.state === TradeState.TRADE_SCREEN && this.interact.getTrading().getState() === TradeState.TRADE_SCREEN) {
                // Check if the item is in the right place
                if (from.getItems()[slot].getId() === id) {
                    // Make sure we can fit that amount in the trade
                    if (from instanceof Inventory_1.Inventory) {
                        if (!ItemDefinition_1.ItemDefinition.forId(id).isStackable()) {
                            if (amount > this.container.getFreeSlots()) {
                                amount = this.container.getFreeSlots();
                            }
                        }
                    }
                    if (amount <= 0) {
                        return;
                    }
                    var item = new Item_1.Item(id, amount);
                    // Do the switch!
                    if (item.getAmount() === 1) {
                        from.switchItem(to, item, false, slot, true);
                    }
                    else {
                        from.switchItems(to, item, false, true);
                    }
                    // Update value frames for both players
                    var plr_value = this.container.getTotalValue();
                    var other_plr_value = this.interact.getTrading().getContainer().getTotalValue();
                    this.player.getPacketSender().sendString(Misc_1.Misc.insertCommasToNumber(plr_value) + " bm", Trading.ITEM_VALUE_1_FRAME);
                    this.player.getPacketSender().sendString(Misc_1.Misc.insertCommasToNumber(other_plr_value) + " bm", Trading.ITEM_VALUE_2_FRAME);
                    this.interact.getPacketSender().sendString(Misc_1.Misc.insertCommasToNumber(other_plr_value) + " bm", Trading.ITEM_VALUE_1_FRAME);
                    this.interact.getPacketSender().sendString(Misc_1.Misc.insertCommasToNumber(plr_value) + " bm", Trading.ITEM_VALUE_2_FRAME);
                    if (this.interact instanceof PlayerBot_1.PlayerBot) {
                        // Automatically accept the trade whenever an item is added by the player
                        this.interact.getTrading().acceptTrade();
                    }
                }
            }
            else {
                this.player.getPacketSender().sendInterfaceRemoval();
            }
        }
    };
    Trading.prototype.resetAttributes = function () {
        // Reset trade attributes
        this.setInteract(null);
        this.setState(TradeState.NONE);
        // Reset player status if it's trading.
        if (this.player.getStatus() === PlayerStatus_1.PlayerStatus.TRADING) {
            this.player.setStatus(PlayerStatus_1.PlayerStatus.NONE);
        }
        // Reset container..
        this.container.resetItems();
        // Send the new empty container to the interface
        // Just to clear the items there.
        this.player.getPacketSender().sendItemContainer(this.container, Trading.CONTAINER_INTERFACE_ID);
    };
    Trading.prototype.getState = function () {
        return this.state;
    };
    Trading.prototype.setState = function (state) {
        this.state = state;
    };
    Trading.prototype.getButtonDelay = function () {
        return this.button_delay;
    };
    Trading.prototype.getInteract = function () {
        return this.interact;
    };
    Trading.prototype.setInteract = function (interact) {
        this.interact = interact;
    };
    Trading.prototype.getContainer = function () {
        return this.container;
    };
    Trading.CONTAINER_INTERFACE_ID = 3415;
    Trading.CONTAINER_INVENTORY_INTERFACE = 3321;
    Trading.INVENTORY_CONTAINER_INTERFACE = 3322;
    // Interface data
    Trading.INTERFACE = 3323;
    Trading.CONTAINER_INTERFACE_ID_2 = 3416;
    Trading.CONFIRM_SCREEN_INTERFACE = 3443;
    // Frames data
    Trading.TRADING_WITH_FRAME = 3417;
    Trading.STATUS_FRAME_1 = 3431;
    Trading.STATUS_FRAME_2 = 3535;
    Trading.ITEM_LIST_1_FRAME = 3557;
    Trading.ITEM_LIST_2_FRAME = 3558;
    Trading.ITEM_VALUE_1_FRAME = 24209;
    Trading.ITEM_VALUE_2_FRAME = 24210;
    return Trading;
}());
var TradeState;
(function (TradeState) {
    TradeState[TradeState["NONE"] = 0] = "NONE";
    TradeState[TradeState["REQUESTED_TRADE"] = 1] = "REQUESTED_TRADE";
    TradeState[TradeState["TRADE_SCREEN"] = 2] = "TRADE_SCREEN";
    TradeState[TradeState["ACCEPTED_TRADE_SCREEN"] = 3] = "ACCEPTED_TRADE_SCREEN";
    TradeState[TradeState["CONFIRM_SCREEN"] = 4] = "CONFIRM_SCREEN";
    TradeState[TradeState["ACCEPTED_CONFIRM_SCREEN"] = 5] = "ACCEPTED_CONFIRM_SCREEN";
})(TradeState || (TradeState = {}));
//# sourceMappingURL=Trading.js.map