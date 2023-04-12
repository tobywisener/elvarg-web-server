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
Object.defineProperty(exports, "__esModule", { value: true });
exports.F2PMeleeFighterPreset = void 0;
var Presetable_1 = require("../../../../../content/presets/Presetable");
var CombatSwitch_1 = require("../CombatSwitch");
var Item_1 = require("../../../../../model/Item");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var MeleeCombatSwitch = /** @class */ (function (_super) {
    __extends(MeleeCombatSwitch, _super);
    function MeleeCombatSwitch(switchItemIds, execFunc) {
        var _this = _super.call(this, switchItemIds) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MeleeCombatSwitch.prototype.performAfterSwitch = function (playerBot, enemy) {
        this.execFunc();
    };
    return MeleeCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var F2PMeleeFighterPreset = exports.F2PMeleeFighterPreset = /** @class */ (function () {
    function F2PMeleeFighterPreset() {
    }
    F2PMeleeFighterPreset.prototype.getItemPreset = function () {
        return F2PMeleeFighterPreset.PRESETABLE;
    };
    F2PMeleeFighterPreset.prototype.getCombatActions = function () {
        return F2PMeleeFighterPreset.COMBAT_ACTIONS;
    };
    F2PMeleeFighterPreset.prototype.eatAtPercent = function () {
        return 40;
    };
    F2PMeleeFighterPreset.PRESETABLE = new Presetable_1.Presetable("F2P Pure", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_2H_SWORD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STRENGTH_POTION_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWORDFISH),
    ], [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_FULL_HELM),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CAPE_OF_LEGENDS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MAPLE_SHORTBOW),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_POWER),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BODY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GREEN_DHIDE_VAMB),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GREEN_DHIDE_CHAPS),
        null,
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BOOTS),
        null,
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_ARROW, 100),
    ], 
    /* atk, def, str, hp, range, pray, mage */
    [40, 1, 90, 58, 84, 1, 1], MagicSpellbook_1.MagicSpellbook.NORMAL, true);
    F2PMeleeFighterPreset.COMBAT_ACTIONS = [
        new MeleeCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RUNE_2H_SWORD], function () {
            /**
             * KO Weapon - Rune 2H sword
             */
            return {
                shouldPerform: function (playerBot, enemy) {
                    var canAttackNextTick = playerBot.getTimers().getTicks(TimerKey_1.TimerKey.COMBAT_ATTACK) <= 1;
                    return canAttackNextTick && enemy.getHitpoints() < 25;
                },
                performAfterSwitch: function (playerBot, enemy) {
                    playerBot.getCombat().attack(enemy);
                }
            };
        }),
        new MeleeCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MAPLE_SHORTBOW], function () {
            /**
             * Default Weapon - Maple Shortbow (Max DPS)
             */
            return {
                shouldPerform: function (playerBot, enemy) {
                    return enemy.getHitpoints() >= 25;
                },
                performAfterSwitch: function (playerBot, enemy) {
                    playerBot.getCombat().attack(enemy);
                }
            };
        }),
    ];
    return F2PMeleeFighterPreset;
}());
//# sourceMappingURL=F2PMeleeFighterPreset.js.map