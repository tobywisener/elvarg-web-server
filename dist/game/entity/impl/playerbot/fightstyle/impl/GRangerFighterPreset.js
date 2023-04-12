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
exports.GRangerFighterPreset = void 0;
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var CombatSwitch_1 = require("../CombatSwitch");
var Item_1 = require("../../../../../model/Item");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var GRangerCombatSwitch = /** @class */ (function (_super) {
    __extends(GRangerCombatSwitch, _super);
    function GRangerCombatSwitch(switchItemIds, execFunc) {
        var _this = _super.call(this, switchItemIds) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    GRangerCombatSwitch.prototype.performAfterSwitch = function (playerBot, enemy) {
        this.execFunc();
    };
    return GRangerCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var GRangerFighterPreset = exports.GRangerFighterPreset = /** @class */ (function () {
    function GRangerFighterPreset() {
    }
    GRangerFighterPreset.prototype.getItemPreset = function () {
        return GRangerFighterPreset.BOT_G_MAULER_70;
    };
    GRangerFighterPreset.prototype.getCombatActions = function () {
        return GRangerFighterPreset.COMBAT_ACTIONS;
    };
    GRangerFighterPreset.prototype.eatAtPercent = function () {
        return 40;
    };
    GRangerFighterPreset.BOT_G_MAULER_70 = new Presetable_1.Presetable("G Mauler (R)", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_STRENGTH_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRANITE_MAUL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_RESTORE_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_ATTACK_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SARADOMIN_BREW_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MONKFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH),
    ], [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COIF),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_GLORY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BODY),
        null,
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_GLOVES),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, 75),
    ], [40, 1, 90, 58, 84, 1, 1], MagicSpellbook_1.MagicSpellbook.NORMAL, true);
    GRangerFighterPreset.COMBAT_ACTIONS = [
        new GRangerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], function (playerBot, enemy) {
            return {
                shouldPerform: function (playerBot, enemy) {
                    var canAttackNextTick = playerBot.getTimers().getTicks(TimerKey_1.TimerKey.COMBAT_ATTACK) <= 1;
                    return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 &&
                        enemy.getHitpoints() < 46;
                },
                performAfterSwitch: function (playerBot, enemy) {
                    if (!playerBot.isSpecialActivated()) {
                        CombatSpecial_1.CombatSpecial.activate(playerBot);
                    }
                    playerBot.getCombat().attack(enemy);
                }
            };
        }),
        new GRangerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.DRAGON_SCIMITAR], function (playerBot, enemy) {
            return {
                shouldPerform: function (playerBot, enemy) {
                    return true;
                },
                performAfterSwitch: function (playerBot, enemy) {
                    playerBot.setSpecialActivated(false);
                    playerBot.getCombat().attack(enemy);
                }
            };
        })
    ];
    return GRangerFighterPreset;
}());
//# sourceMappingURL=GRangerFighterPreset.js.map