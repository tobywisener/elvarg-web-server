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
exports.ItemCreationSkillable = void 0;
var DefaultSkillable_1 = require("./DefaultSkillable");
var Misc_1 = require("../../../../../util/Misc");
var PetHandler_1 = require("../../../PetHandler");
var ItemCreationSkillable = /** @class */ (function (_super) {
    __extends(ItemCreationSkillable, _super);
    function ItemCreationSkillable(requiredItems, product, amount, animLoop, requiredLevel, experience, skill) {
        var _this = _super.call(this) || this;
        _this.requiredItems = requiredItems;
        _this.product = product;
        _this.amount = amount;
        _this.animLoop = animLoop;
        _this.requiredLevel = requiredLevel;
        _this.experience = experience;
        _this.skill = skill;
        return _this;
    }
    ItemCreationSkillable.prototype.startAnimationLoop = function (player) {
        var _this = this;
        if (!this.animLoop) {
            return;
        }
        var animLoopTask = setInterval(function () {
            player.performAnimation(_this.animLoop.getAnim());
        }, this.animLoop.getLoopDelay());
    };
    ItemCreationSkillable.prototype.cyclesRequired = function (player) {
        return 2;
    };
    ItemCreationSkillable.prototype.onCycle = function (player) {
        PetHandler_1.PetHandler.onSkill(player, this.skill);
    };
    ItemCreationSkillable.prototype.finishedCycle = function (player) {
        // Decrement amount to make and stop if we hit 0.
        if (this.amount-- <= 0) {
            this.cancel(player);
        }
        // Delete items required..
        this.filterRequiredItems(function (r) { return r.isDelete(); }).forEach(function (r) { return player.getInventory().deletes(r.getItem()); });
        // Add product..
        player.getInventory().addItem(this.product);
        // Add exp..
        player.getSkillManager().addExperiences(this.skill, this.experience);
        // Send message..
        var name = this.product.getDefinition().getName();
        var amountPrefix = Misc_1.Misc.anOrA(name);
        if (this.product.getAmount() > 1) {
            if (!name.endsWith("s")) {
                name += "s";
            }
            amountPrefix = this.product.getAmount().toString();
        }
        player.getPacketSender().sendMessage("You make ".concat(amountPrefix, " ").concat(name, "."));
    };
    ItemCreationSkillable.prototype.hasRequirements = function (player) {
        var e_1, _a;
        // Validate amount..
        if (this.amount <= 0) {
            return false;
        }
        // Check if we have required stringing level..
        if (player.getSkillManager().getCurrentLevel(this.skill) < this.requiredLevel) {
            player.getPacketSender().sendMessage("You need a " + this.skill.getName() + " level of at least "
                + this.requiredLevel.toString() + " to do this.");
            return false;
        }
        // Validate required items..
        // Check if we have the required ores..
        var hasItems = true;
        try {
            for (var _b = __values(this.requiredItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!player.getInventory().containsItem(item.getItem())) {
                    var prefix = item.getItem().getAmount() > 1 ? item.getItem().getAmount().toString() : "some";
                    player.getPacketSender().sendMessage("You " + (!hasItems ? "also need" : "need") + " " + prefix + " "
                        + item.getItem().getDefinition().getName() + ".");
                    hasItems = false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!hasItems) {
            return false;
        }
        return _super.prototype.hasRequirements.call(this, player);
    };
    ItemCreationSkillable.prototype.loopRequirements = function () {
        return true;
    };
    ItemCreationSkillable.prototype.allowFullInventory = function () {
        return true;
    };
    ItemCreationSkillable.prototype.decrementAmount = function () {
        this.amount--;
    };
    ItemCreationSkillable.prototype.getAmount = function () {
        return this.amount;
    };
    ItemCreationSkillable.prototype.filterRequiredItems = function (criteria) {
        return this.requiredItems.filter(criteria);
    };
    ItemCreationSkillable.prototype.getRequiredItems = function () {
        return this.requiredItems;
    };
    return ItemCreationSkillable;
}(DefaultSkillable_1.DefaultSkillable));
exports.ItemCreationSkillable = ItemCreationSkillable;
//# sourceMappingURL=ItemCreationSkillable.js.map