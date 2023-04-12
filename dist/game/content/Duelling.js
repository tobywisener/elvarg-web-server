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
exports.DuelState = exports.DuelRule = exports.Dueling = void 0;
var ItemContainer_1 = require("../model/container/ItemContainer");
var SecondsTimer_1 = require("../model/SecondsTimer");
var PlayerStatus_1 = require("../model/PlayerStatus");
var Misc_1 = require("../../util/Misc");
var ItemDefinition_1 = require("../definition/ItemDefinition");
var Equipment_1 = require("../model/container/impl/Equipment");
var Inventory_1 = require("../model/container/impl/Inventory");
var Trading_1 = require("./Trading");
var StackType_1 = require("../model/container/StackType");
var Item_1 = require("../model/Item");
var Location_1 = require("../model/Location");
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
        this.getPlayer().getPacketSender().sendMessage("You cannot stake more items.");
        return this;
    };
    PlayerItemContainer.prototype.capacity = function () {
        return 28;
    };
    return PlayerItemContainer;
}(ItemContainer_1.ItemContainer));
var Dueling = exports.Dueling = /** @class */ (function () {
    function Dueling(player) {
        var _this = this;
        this.state = DuelState.NONE;
        // Delays!!
        this.button_delay = new SecondsTimer_1.SecondsTimer();
        this.request_delay = new SecondsTimer_1.SecondsTimer();
        this.rules = Array(Object.values(DuelRule).length).fill(false);
        this.player = player;
        this.container = new PlayerItemContainer(player, function () {
            player.getPacketSender().sendInterfaceSet(Dueling.INTERFACE_ID, Trading_1.Trading.CONTAINER_INVENTORY_INTERFACE);
            player.getPacketSender().sendItemContainer(player.getInventory(), Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE);
            player.getPacketSender().sendInterfaceItems(Dueling.MAIN_INTERFACE_CONTAINER, player.getDueling().getContainer().getValidItems());
            player.getPacketSender().sendInterfaceItems(Dueling.SECOND_INTERFACE_CONTAINER, _this.interact.getDueling().getContainer().getValidItems());
            _this.interact.getPacketSender().sendInterfaceItems(Dueling.MAIN_INTERFACE_CONTAINER, _this.interact.getDueling().getContainer().getValidItems());
            _this.interact.getPacketSender().sendInterfaceItems(Dueling.SECOND_INTERFACE_CONTAINER, player.getDueling().getContainer().getValidItems());
            return _this;
        });
    }
    ;
    Dueling.validate = function (player, interact, playerStatus) {
        var e_1, _a, e_2, _b;
        var duelStates = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            duelStates[_i - 3] = arguments[_i];
        }
        // Verify player...
        if (player == null || interact == null) {
            return false;
        }
        // Make sure we have proper status
        if (playerStatus != null) {
            if (player.getStatus() != playerStatus) {
                return false;
            }
            // Make sure we're interacting with eachother
            if (interact.getStatus() != playerStatus) {
                return false;
            }
        }
        if (player.getDueling().getInteract() == null || player.getDueling().getInteract() != interact) {
            return false;
        }
        if (interact.getDueling().getInteract() == null || interact.getDueling().getInteract() != player) {
            return false;
        }
        // Make sure we have proper duel state.
        var found = false;
        try {
            for (var duelStates_1 = __values(duelStates), duelStates_1_1 = duelStates_1.next(); !duelStates_1_1.done; duelStates_1_1 = duelStates_1.next()) {
                var duelState = duelStates_1_1.value;
                if (player.getDueling().getState() == duelState) {
                    found = true;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (duelStates_1_1 && !duelStates_1_1.done && (_a = duelStates_1.return)) _a.call(duelStates_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!found) {
            return false;
        }
        // Do the same for our interact
        found = false;
        try {
            for (var duelStates_2 = __values(duelStates), duelStates_2_1 = duelStates_2.next(); !duelStates_2_1.done; duelStates_2_1 = duelStates_2.next()) {
                var duelState = duelStates_2_1.value;
                if (interact.getDueling().getState() == duelState) {
                    found = true;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (duelStates_2_1 && !duelStates_2_1.done && (_b = duelStates_2.return)) _b.call(duelStates_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (!found) {
            return false;
        }
        return true;
    };
    Dueling.prototype.requestDuel = function (t_) {
        if (this.state == DuelState.NONE || this.state == DuelState.REQUESTED_DUEL) {
            // Make sure to not allow flooding!
            if (!this.request_delay.finished()) {
                var seconds = this.request_delay.secondsRemaining();
                this.player.getPacketSender().sendMessage("You must wait another ".concat(seconds == 1 ? "second" : "".concat(seconds, " seconds"), " before sending more duel challenges."));
                return;
            }
            // The other players' current duel state.
            var t_state = t_.getDueling().getState();
            // Should we initiate the duel or simply send a request?
            var initiateDuel = false;
            // Update this instance...
            this.setInteract(t_);
            this.setState(DuelState.REQUESTED_DUEL);
            // Check if target requested a duel with us...
            if (t_state == DuelState.REQUESTED_DUEL) {
                if (t_.getDueling().getInteract() != null && t_.getDueling().getInteract() == this.player) {
                    initiateDuel = true;
                }
            }
            // Initiate duel for both players with eachother?
            if (initiateDuel) {
                this.player.getDueling().initiateDuel();
                t_.getDueling().initiateDuel();
            }
            else {
                this.player.getPacketSender().sendMessage("You've sent a duel challenge to ".concat(t_.getUsername(), "..."));
                t_.getPacketSender().sendMessage("".concat(this.player.getUsername(), ":duelreq:"));
                if (t_.isPlayerBot()) {
                    // Player Bots: Automatically accept any duel request
                    t_.getDueling().requestDuel(this.player);
                }
            }
            // Set the request delay to 2 seconds at least.
            this.request_delay.start(2);
        }
        else {
            this.player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    };
    Dueling.prototype.initiateDuel = function () {
        var e_3, _a;
        // Set our duel state
        this.setState(DuelState.DUEL_SCREEN);
        // Set our player status
        this.player.setStatus(PlayerStatus_1.PlayerStatus.DUELING);
        // Reset right click options
        this.player.getPacketSender().sendInteractionOption("null", 2, true);
        this.player.getPacketSender().sendInteractionOption("null", 1, false);
        // Reset rule toggle configs
        this.player.getPacketSender().sendConfig(Dueling.RULES_CONFIG_ID, 0);
        // Update strings on interface
        this.player.getPacketSender()
            .sendString("@or1@Dueling with: @whi@".concat(this.interact.getUsername(), "@or1@          Combat level: @whi@").concat(this.interact.getSkillManager().getCombatLevel()), Dueling.DUELING_WITH_FRAME)
            .sendString("", Dueling.STATUS_FRAME_1).sendString("Lock Weapon", 669)
            .sendString("Neither player is allowed to change weapon.", 8278);
        // Send equipment on the interface..
        var equipSlot = 0;
        try {
            for (var _b = __values(this.player.getEquipment().getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                this.player.getPacketSender().sendItemOnInterface(13824, item.getId(), equipSlot, item.getAmount());
                equipSlot++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // Reset container
        this.container.resetItems();
        // Refresh and send container...
        this.container.refreshItems();
    };
    Dueling.prototype.closeDuel = function () {
        var e_4, _a;
        if (this.state != DuelState.NONE) {
            // Cache the current interact
            var interact_ = this.interact;
            try {
                // Return all items...
                for (var _b = __values(this.container.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var t = _c.value;
                    this.container.switchItems(this.player.getInventory(), t.clone(), false, false);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            // Refresh inventory
            this.player.getInventory().refreshItems();
            // Reset all attributes...
            this.resetAttributes();
            // Send decline message
            this.player.getPacketSender().sendMessage("Duel declined.");
            this.player.getPacketSender().sendInterfaceRemoval();
            // Reset/close duel for other player aswell (the cached interact)
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
                    if (interact_.getDueling().getInteract() != null && interact_.getDueling().getInteract() == this.player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    };
    Dueling.prototype.resetAttributes = function () {
        // Reset duel attributes
        this.setInteract(null);
        this.setState(DuelState.NONE);
        // Reset player status if it's dueling.
        if (this.player.getStatus() == PlayerStatus_1.PlayerStatus.DUELING) {
            this.player.setStatus(PlayerStatus_1.PlayerStatus.NONE);
        }
        // Reset container..
        this.container.resetItems();
        // Reset rules
        for (var i = 0; i < this.rules.length; i++) {
            this.rules[i] = false;
        }
        // Clear toggles
        this.configValue = 0;
        this.player.getPacketSender().sendConfig(Dueling.RULES_CONFIG_ID, 0);
        // Update right click options..
        this.player.getPacketSender().sendInteractionOption("Challenge", 1, false);
        this.player.getPacketSender().sendInteractionOption("null", 2, true);
        // Clear head hint
        this.player.getPacketSender().sendEntityHintRemoval(true);
        // Clear items on interface
        this.player.getPacketSender().clearItemOnInterface(Dueling.MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(Dueling.SECOND_INTERFACE_CONTAINER);
    };
    Dueling.prototype.handleItem = function (id, amount, slot, from, to) {
        if (this.player.getInterfaceId() == Dueling.INTERFACE_ID) {
            // Validate this stake action..
            if (!Dueling.validate.apply(Dueling, __spreadArray([this.player, this.interact, PlayerStatus_1.PlayerStatus.DUELING], [DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN], false))) {
                return;
            }
            if (ItemDefinition_1.ItemDefinition.forId(id).getValue() == 0) {
                this.player.getPacketSender().sendMessage("There's no point in staking that. It's spawnable!");
                return;
            }
            // Check if the duel was previously accepted (and now modified)...
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            // Handle the item switch..
            if (this.state == DuelState.DUEL_SCREEN && this.interact.getDueling().getState() == DuelState.DUEL_SCREEN) {
                // Check if the item is in the right place
                if (from.getItems()[slot].getId() == id) {
                    // Make sure we can fit that amount in the duel
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
                    // Only sort items if we're withdrawing items from the duel.
                    var sort = (from == (this.player.getDueling().getContainer()));
                    // Do the switch!
                    if (item.getAmount() == 1) {
                        from.switchItem(to, item, sort, slot, true);
                    }
                    else {
                        from.switchItems(to, item, sort, true);
                    }
                }
            }
            else {
                this.player.getPacketSender().sendInterfaceRemoval;
            }
        }
    };
    Dueling.prototype.acceptDuel = function () {
        // Validate this stake action..
        if (!Dueling.validate.apply(Dueling, __spreadArray([this.player, this.interact, PlayerStatus_1.PlayerStatus.DUELING], [DuelState.DUEL_SCREEN,
            DuelState.ACCEPTED_DUEL_SCREEN, DuelState.CONFIRM_SCREEN, DuelState.ACCEPTED_CONFIRM_SCREEN], false))) {
            return;
        }
        // Check button delay...
        if (!this.button_delay.finished()) {
            return;
        }
        // Cache the interact...
        var interact_ = this.interact;
        // Interact's current trade state.
        var t_state = interact_.getDueling().getState();
        // Check which action to take..
        if (this.state == DuelState.DUEL_SCREEN) {
            // Verify that the interact can receive all items first..
            var slotsRequired = this.getFreeSlotsRequired(this.player);
            if (this.player.getInventory().getFreeSlots() < slotsRequired) {
                this.player.getPacketSender()
                    .sendMessage("You need at least ".concat(slotsRequired, " free inventory slots for this duel."));
                return;
            }
            if (this.rules[DuelRule.NO_MELEE.getButtonId()] && this.rules[DuelRule.NO_RANGED.getButtonId()]
                && this.rules[DuelRule.NO_MAGIC.getButtonId()]) {
                this.player.getPacketSender().sendMessage("You must enable at least one of the three combat styles.");
                return;
            }
            // Both are in the same state. Do the first-stage accept.
            this.setState(DuelState.ACCEPTED_DUEL_SCREEN);
            // Update status...
            this.player.getPacketSender().sendString("Waiting for other player..", Dueling.STATUS_FRAME_1);
            interact_.getPacketSender().sendString("".concat(this.player.getUsername(), " has accepted."), Dueling.STATUS_FRAME_1);
            // Check if both have accepted..
            if (t_state === DuelState.ACCEPTED_DUEL_SCREEN) {
                // Technically here, both have accepted.
                // Go into confirm screen!
                this.player.getDueling().confirmScreen();
                interact_.getDueling().confirmScreen();
            }
            else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        }
        else if (this.state === DuelState.CONFIRM_SCREEN) {
            // Both are in the same state. Do the second-stage accept.
            this.setState(DuelState.ACCEPTED_CONFIRM_SCREEN);
            // Update status...
            this.player.getPacketSender().sendString("Waiting for ".concat(interact_.getUsername(), "'s confirmation.."), Dueling.STATUS_FRAME_2);
            interact_.getPacketSender().sendString("".concat(this.player.getUsername(), " has accepted. Do you wish to do the same?"), Dueling.STATUS_FRAME_2);
            // Check if both have accepted..
            if (t_state === DuelState.ACCEPTED_CONFIRM_SCREEN) {
                // Both accepted, start duel
                // Decide where they will spawn in the arena..
                var obstacle = this.rules[DuelRule.OBSTACLES.forId(11)];
                var movementDisabled = this.rules[DuelRule.NO_MOVEMENT.forId(10)];
                var pos1 = this.getRandomSpawn(obstacle);
                var pos2 = this.getRandomSpawn(obstacle);
                // Make them spawn next to each other
                if (movementDisabled) {
                    pos2 = pos1.clone().add(-1, 0);
                }
                this.player.getDueling().startDuel(pos1);
                interact_.getDueling().startDuel(pos2);
            }
            else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        }
        this.button_delay.start(1);
    };
    Dueling.prototype.getRandomSpawn = function (obstacle) {
        if (obstacle) {
            return new Location_1.Location(3366 + Misc_1.Misc.getRandom(11), 3246 + Misc_1.Misc.getRandom(6));
        }
        return new Location_1.Location(3335 + Misc_1.Misc.getRandom(11), 3246 + Misc_1.Misc.getRandom(6));
    };
    Dueling.prototype.confirmScreen = function () {
        // Update state
        this.player.getDueling().setState(DuelState.CONFIRM_SCREEN);
        // Send new interface frames
        var this_items = Trading_1.Trading.listItems(this.container);
        var interact_item = Trading_1.Trading.listItems(this.interact.getDueling().getContainer());
        this.player.getPacketSender().sendString(this_items, Dueling.ITEM_LIST_1_FRAME);
        this.player.getPacketSender().sendString(interact_item, Dueling.ITEM_LIST_2_FRAME);
        // Reset all previous strings related to rules
        for (var i = 8238; i <= 8253; i++) {
            this.player.getPacketSender().sendString("", i);
        }
        // Send new ones
        this.player.getPacketSender().sendString("Hitpoints will be restored.", 8250);
        this.player.getPacketSender().sendString("Boosted stats will be restored.", 8238);
        if (this.rules[DuelRule.OBSTACLES.forId(11)]) {
            this.player.getPacketSender().sendString("@red@There will be obstacles in the arena.", 8239);
        }
        this.player.getPacketSender().sendString("", 8240);
        this.player.getPacketSender().sendString("", 8241);
        var ruleFrameIndex = Dueling.RULES_FRAME_START;
        for (var i = 0; i < Object.values(DuelRule).length; i++) {
            if (i == DuelRule.OBSTACLES.forId(11))
                continue;
            if (this.rules[i]) {
                this.player.getPacketSender().sendString("" + DuelRule.forButtonId(i).toString(), ruleFrameIndex);
                ruleFrameIndex++;
            }
        }
        this.player.getPacketSender().sendString("", Dueling.STATUS_FRAME_2);
        // Send new interface..
        this.player.getPacketSender().sendInterfaceSet(Dueling.CONFIRM_INTERFACE_ID, Inventory_1.Inventory.INTERFACE_ID);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), Trading_1.Trading.INVENTORY_CONTAINER_INTERFACE);
    };
    Dueling.prototype.checkRules = function (button) {
        var rule = DuelRule.forButtonId(button);
        if (rule != null) {
            this.checkRule(rule);
            return true;
        }
        return false;
    };
    Dueling.prototype.checkRule = function (rule) {
        // Check if we're actually dueling..
        if (this.player.getStatus() != PlayerStatus_1.PlayerStatus.DUELING) {
            return;
        }
        // Verify stake...
        if (!Dueling.validate.apply(Dueling, __spreadArray([this.player, this.interact, PlayerStatus_1.PlayerStatus.DUELING], [DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN], false))) {
            return;
        }
        // Verify our current state..
        if (this.state == DuelState.DUEL_SCREEN || this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
            // Toggle the rule..
            if (!this.rules[rule.getButtonId()]) {
                this.rules[rule.getButtonId()] = true;
                this.configValue += rule.getConfigId();
            }
            else {
                this.rules[rule.getButtonId()] = false;
                this.configValue -= rule.getConfigId();
            }
            // Update interact's rules to match ours.
            this.interact.getDueling().setConfigValue(this.configValue);
            this.interact.getDueling().getRules()[rule.getButtonId()] = this.rules[rule.getButtonId()];
            // Send toggles for both players.
            this.player.getPacketSender().sendToggle(Dueling.RULES_CONFIG_ID, this.configValue);
            this.interact.getPacketSender().sendToggle(Dueling.RULES_CONFIG_ID, this.configValue);
            // Send modify status
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            // Inform them about this "custom" rule.
            if (rule == DuelRule.LOCK_WEAPON && this.rules[rule.forId(5)]) {
                this.player.getPacketSender()
                    .sendMessage("@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
                this.interact.getPacketSender()
                    .sendMessage("@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
            }
        }
    };
    Dueling.prototype.startDuel = function (telePos) {
        var _this = this;
        // Set current duel state
        this.setState(DuelState.STARTING_DUEL);
        // Close open interfaces
        this.player.getPacketSender().sendInterfaceRemoval();
        // Unequip items based on the rules set for this duel
        for (var i = 11; i < this.rules.length; i++) {
            var rule = DuelRule.forButtonId(i);
            if (this.rules[i]) {
                if (rule.getEquipmentSlot() < 0)
                    continue;
                if (this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getId() > 0) {
                    var item = new Item_1.Item(this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getId(), this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getAmount());
                    this.player.getEquipment().deletes(item);
                    this.player.getInventory().addItem(item);
                }
            }
        }
        if (this.rules[DuelRule.NO_WEAPON.forId(16)] || this.rules[DuelRule.NO_SHIELD.forId(18)]) {
            if (this.player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId() > 0) {
                if (ItemDefinition_1.ItemDefinition.forId(this.player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId())
                    .isDoubleHanded()) {
                    var item = new Item_1.Item(this.player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId(), this.player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getAmount());
                    this.player.getEquipment().deletes(item);
                    this.player.getInventory().addItem(item);
                }
            }
        }
        this.player.getPacketSender().clearItemOnInterface(Dueling.MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(Dueling.SECOND_INTERFACE_CONTAINER);
        // Update right click options..
        this.player.getPacketSender().sendInteractionOption("Attack", 2, true);
        this.player.getPacketSender().sendInteractionOption("null", 1, false);
        // Reset attributes..
        this.player.resetAttributes();
        // Freeze the player
        if (this.rules[DuelRule.NO_MOVEMENT.forId(10)]) {
            this.player.getMovementQueue().reset().setBlockMovement(true);
        }
        // Send interact hints
        this.player.getPacketSender().sendPositionalHint(this.interact.getLocation().clone(), 10);
        this.player.getPacketSender().sendEntityHint(this.interact);
        // Teleport the player
        this.player.moveTo(telePos);
        // Make them interact with eachother
        this.player.setMobileInteraction(this.interact);
        // Send countdown as a task
        setTimeout(function () {
            var timer = 3;
            var countdown = setInterval(function () {
                if (_this.player.getDueling().getState() != DuelState.STARTING_DUEL) {
                    clearInterval(countdown);
                    return;
                }
                if (timer === 3 || timer === 2 || timer === 1) {
                    _this.player.forceChat("".concat(timer, ".."));
                }
                else {
                    _this.player.getDueling().setState(DuelState.IN_DUEL);
                    _this.player.forceChat("FIGHT!!");
                    clearInterval(countdown);
                }
                timer--;
            }, 1000);
        }, 2000);
    };
    Dueling.prototype.duelLost = function () {
        var e_5, _a, e_6, _b;
        // Make sure both players are in a duel..
        if (Dueling.validate.apply(Dueling, __spreadArray([this.player, this.interact, null], [DuelState.STARTING_DUEL, DuelState.IN_DUEL], false))) {
            // Add won items to a list..
            var totalValue = 0;
            var winnings = [];
            try {
                for (var _c = __values(this.interact.getDueling().getContainer().getValidItems()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var item = _d.value;
                    this.interact.getInventory().addItem(item);
                    winnings.push(item);
                    totalValue += item.getDefinition().getValue();
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                for (var _e = __values(this.player.getDueling().getContainer().getValidItems()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var item = _f.value;
                    this.interact.getInventory().addItem(item);
                    winnings.push(item);
                    totalValue += item.getDefinition().getValue();
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
            // Send interface data..
            this.interact.getPacketSender().sendString(this.player.getUsername(), Dueling.SCOREBOARD_USERNAME_FRAME)
                .sendString("" + this.player.getSkillManager().getCombatLevel(), Dueling.SCOREBOARD_COMBAT_LEVEL_FRAME)
                .sendString("@yel@Total: @or1@" + Misc_1.Misc.insertCommasToNumber("" + totalValue + "") + " value!", Dueling.TOTAL_WORTH_FRAME);
            // Send winnings onto interface
            this.interact.getPacketSender().sendInterfaceItems(Dueling.SCOREBOARD_CONTAINER, winnings);
            // Send the scoreboard interface
            this.interact.getPacketSender().sendInterface(Dueling.SCOREBOARD_INTERFACE_ID);
            // Restart the winner's stats
            this.interact.resetAttributes();
            // Move players home
            var spawn = new Location_1.Location(3366, 3266);
            this.interact.moveTo(spawn.clone().add(Misc_1.Misc.getRandom(4), Misc_1.Misc.getRandom(2)));
            this.player.moveTo(spawn.clone().add(Misc_1.Misc.getRandom(4), Misc_1.Misc.getRandom(2)));
            // Send messages
            this.interact.getPacketSender().sendMessage("You won the duel!");
            this.player.getPacketSender().sendMessage("You lost the duel!");
            // Reset attributes for both
            this.interact.getDueling().resetAttributes();
            this.player.getDueling().resetAttributes();
        }
        else {
            this.player.getDueling().resetAttributes();
            this.player.getPacketSender().sendInterfaceRemoval();
            if (this.interact != null) {
                this.interact.getDueling().resetAttributes();
                this.interact.getPacketSender().sendInterfaceRemoval();
            }
        }
    };
    Dueling.prototype.inDuel = function () {
        return this.state == DuelState.STARTING_DUEL || this.state == DuelState.IN_DUEL;
    };
    Dueling.prototype.getFreeSlotsRequired = function (player) {
        var e_7, _a, e_8, _b;
        var slots = 0;
        // Count equipment that needs to be taken off
        for (var i = 11; i < player.getDueling().getRules().length; i++) {
            var rule = Object.values(DuelRule)[i];
            if (player.getDueling().getRules()[rule.ordinal()]) {
                var item = player.getEquipment().getItems()[rule.getEquipmentSlot()];
                if (!item.isValid()) {
                    continue;
                }
                if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                    slots += rule.getInventorySpaceReq();
                }
                if (rule == DuelRule.NO_WEAPON || rule == DuelRule.NO_SHIELD) {
                }
            }
        }
        try {
            // Count inventory slots from interact's container aswell as ours
            for (var _c = __values(this.container.getItems()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                if (item == null || !item.isValid())
                    continue;
                if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                    slots++;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            for (var _e = __values(this.interact.getDueling().getContainer().getItems()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var item = _f.value;
                if (item == null || !item.isValid())
                    continue;
                if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                    slots++;
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return slots;
    };
    Dueling.prototype.getButtonDelay = function () {
        return this.button_delay;
    };
    Dueling.prototype.getState = function () {
        return this.state;
    };
    Dueling.prototype.setState = function (state) {
        this.state = state;
    };
    Dueling.prototype.getContainer = function () {
        return this.container;
    };
    Dueling.prototype.getInteract = function () {
        return this.interact;
    };
    Dueling.prototype.setInteract = function (interact) {
        this.interact = interact;
    };
    Dueling.prototype.getRules = function () {
        return this.rules;
    };
    Dueling.prototype.getConfigValue = function () {
        return this.configValue;
    };
    Dueling.prototype.setConfigValue = function (configValue) {
        this.configValue = configValue;
    };
    Dueling.prototype.incrementConfigValue = function (configValue) {
        this.configValue += configValue;
    };
    Dueling.MAIN_INTERFACE_CONTAINER = 6669;
    Dueling.DUELING_WITH_FRAME = 6671;
    Dueling.INTERFACE_ID = 6575;
    Dueling.CONFIRM_INTERFACE_ID = 6412;
    Dueling.SCOREBOARD_INTERFACE_ID = 6733;
    Dueling.SCOREBOARD_CONTAINER = 6822;
    Dueling.SCOREBOARD_USERNAME_FRAME = 6840;
    Dueling.SCOREBOARD_COMBAT_LEVEL_FRAME = 6839;
    Dueling.SECOND_INTERFACE_CONTAINER = 6670;
    Dueling.STATUS_FRAME_1 = 6684;
    Dueling.STATUS_FRAME_2 = 6571;
    Dueling.ITEM_LIST_1_FRAME = 6516;
    Dueling.ITEM_LIST_2_FRAME = 6517;
    Dueling.RULES_FRAME_START = 8242;
    Dueling.RULES_CONFIG_ID = 286;
    Dueling.TOTAL_WORTH_FRAME = 24234;
    return Dueling;
}());
var DuelRule = exports.DuelRule = /** @class */ (function () {
    function DuelRule(configId, buttonId, inventorySpaceReq, equipmentSlot) {
        this.configId = configId;
        this.buttonId = buttonId;
        this.inventorySpaceReq = inventorySpaceReq;
        this.equipmentSlot = equipmentSlot;
    }
    DuelRule.prototype.forId = function (i) {
        var e_9, _a;
        try {
            for (var _b = __values(Object.values(DuelRule)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var r = _c.value;
                if (r.ordinal() === i) {
                    return r;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return null;
    };
    DuelRule.forButtonId = function (buttonId) {
        var e_10, _a;
        try {
            for (var _b = __values(Object.values(DuelRule)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var r = _c.value;
                if (r.getButtonId() === buttonId) {
                    return r;
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return null;
    };
    DuelRule.prototype.getConfigId = function () {
        return this.configId;
    };
    DuelRule.prototype.getButtonId = function () {
        return this.buttonId;
    };
    DuelRule.prototype.getInventorySpaceReq = function () {
        return this.inventorySpaceReq;
    };
    DuelRule.prototype.getEquipmentSlot = function () {
        return this.equipmentSlot;
    };
    DuelRule.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    DuelRule.NO_RANGED = new DuelRule(16, 6725, -1, -1);
    DuelRule.NO_MELEE = new DuelRule(32, 6726, -1, -1);
    DuelRule.NO_MAGIC = new DuelRule(64, 6727, -1, -1);
    DuelRule.NO_SPECIAL_ATTACKS = new DuelRule(8192, 7816, -1, -1);
    DuelRule.LOCK_WEAPON = new DuelRule(4096, 670, -1, -1);
    DuelRule.NO_FORFEIT = new DuelRule(1, 6721, -1, -1);
    DuelRule.NO_POTIONS = new DuelRule(128, 6728, -1, -1);
    DuelRule.NO_FOOD = new DuelRule(256, 6729, -1, -1);
    DuelRule.NO_PRAYER = new DuelRule(512, 6730, -1, -1);
    DuelRule.NO_MOVEMENT = new DuelRule(2, 6722, -1, -1);
    DuelRule.OBSTACLES = new DuelRule(1024, 6732, -1, -1);
    DuelRule.NO_HELM = new DuelRule(16384, 13813, 1, Equipment_1.Equipment.HEAD_SLOT);
    DuelRule.NO_CAPE = new DuelRule(32768, 13814, 1, Equipment_1.Equipment.CAPE_SLOT);
    DuelRule.NO_AMULET = new DuelRule(65536, 13815, 1, Equipment_1.Equipment.AMULET_SLOT);
    DuelRule.NO_AMMUNITION = new DuelRule(134217728, 13816, 1, Equipment_1.Equipment.AMMUNITION_SLOT);
    DuelRule.NO_WEAPON = new DuelRule(131072, 13817, 1, Equipment_1.Equipment.WEAPON_SLOT);
    DuelRule.NO_BODY = new DuelRule(262144, 13818, 1, Equipment_1.Equipment.BODY_SLOT);
    DuelRule.NO_SHIELD = new DuelRule(524288, 13819, 1, Equipment_1.Equipment.SHIELD_SLOT);
    DuelRule.NO_LEGS = new DuelRule(2097152, 13820, 1, Equipment_1.Equipment.LEG_SLOT);
    DuelRule.NO_RING = new DuelRule(67108864, 13821, 1, Equipment_1.Equipment.RING_SLOT);
    DuelRule.NO_BOOTS = new DuelRule(16777216, 13822, 1, Equipment_1.Equipment.FEET_SLOT);
    DuelRule.NO_GLOVES = new DuelRule(8388608, 13823, 1, Equipment_1.Equipment.HANDS_SLOT);
    return DuelRule;
}());
var DuelState;
(function (DuelState) {
    DuelState[DuelState["NONE"] = 0] = "NONE";
    DuelState[DuelState["REQUESTED_DUEL"] = 1] = "REQUESTED_DUEL";
    DuelState[DuelState["DUEL_SCREEN"] = 2] = "DUEL_SCREEN";
    DuelState[DuelState["ACCEPTED_DUEL_SCREEN"] = 3] = "ACCEPTED_DUEL_SCREEN";
    DuelState[DuelState["CONFIRM_SCREEN"] = 4] = "CONFIRM_SCREEN";
    DuelState[DuelState["ACCEPTED_CONFIRM_SCREEN"] = 5] = "ACCEPTED_CONFIRM_SCREEN";
    DuelState[DuelState["STARTING_DUEL"] = 6] = "STARTING_DUEL";
    DuelState[DuelState["IN_DUEL"] = 7] = "IN_DUEL";
})(DuelState = exports.DuelState || (exports.DuelState = {}));
//# sourceMappingURL=Duelling.js.map