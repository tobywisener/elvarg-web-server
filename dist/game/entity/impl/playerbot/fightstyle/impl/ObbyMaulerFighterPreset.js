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
exports.ObbyMaulerFighterPreset = void 0;
var PrayerHandler_1 = require("../../../../../content/PrayerHandler");
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var CombatSwitch_1 = require("../CombatSwitch");
var Item_1 = require("../../../../../model/Item");
var ItemInSlot_1 = require("../../../../../model/ItemInSlot");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var PureCombatSwitch = /** @class */ (function (_super) {
    __extends(PureCombatSwitch, _super);
    function PureCombatSwitch(switchItemIds, execFunc, execShound, prayerData) {
        var _this = _super.call(this, switchItemIds, prayerData) || this;
        _this.execFunc = execFunc;
        _this.execShound = execShound;
        return _this;
    }
    PureCombatSwitch.prototype.shouldPerform = function () {
        return this.execFunc();
    };
    PureCombatSwitch.prototype.performAfterSwitch = function () {
        this.execShound();
    };
    return PureCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var ObbyMaulerFighterPreset = exports.ObbyMaulerFighterPreset = /** @class */ (function () {
    function ObbyMaulerFighterPreset() {
    }
    ObbyMaulerFighterPreset.prototype.getItemPreset = function () {
        return ObbyMaulerFighterPreset.BOT_OBBY_MAULER_57;
    };
    ObbyMaulerFighterPreset.prototype.getCombatActions = function () {
        return ObbyMaulerFighterPreset.COMBAT_ACTIONS;
    };
    ObbyMaulerFighterPreset.BOT_OBBY_MAULER_57 = new Presetable_1.Presetable("Obby Mauler", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_STRENGTH_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BERSERKER_NECKLACE),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FIRE_CAPE),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TZHAAR_KET_OM),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH),
    ], [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COIF),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, 200),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_GLORY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BODY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_GLOVES),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
    ], [1, 1, 99, 80, 70, 13, 1], MagicSpellbook_1.MagicSpellbook.NORMAL, true);
    ObbyMaulerFighterPreset.COMBAT_ACTIONS = [
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR], function (playerBot, enemy) {
            return (playerBot.getSpecialPercentage() >= 55 &&
                (!enemy.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MISSILES] &&
                    enemy.getHitpointsAfterPendingDamage() < 40));
        }, function (playerBot, enemy) {
            if (!playerBot.isSpecialActivated()) {
                CombatSpecial_1.CombatSpecial.activate(playerBot);
            }
            playerBot.getCombat().attack(enemy);
        }, [PrayerHandler_1.PrayerData.SHARP_EYE]),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.TZHAAR_KET_OM, ItemIdentifiers_1.ItemIdentifiers.BERSERKER_NECKLACE, ItemIdentifiers_1.ItemIdentifiers.FIRE_CAPE], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() < 38;
        }, function (playerBot, enemy) { playerBot.getCombat().attack(enemy); }, [PrayerHandler_1.PrayerData.SUPERHUMAN_STRENGTH]),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL], function (playerBot, enemy) {
            var hasRing = ItemInSlot_1.ItemInSlot.getFromInventory(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL, playerBot.getInventory()) != null;
            return hasRing && playerBot.getEquipment().getById(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL) == null;
        }, function (playerBot, enemy) { playerBot.getCombat().attack(enemy); }),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR], function (playerBot, enemy) { return true; }, function (playerBot, enemy) { playerBot.getCombat().attack(enemy); }, [PrayerHandler_1.PrayerData.SHARP_EYE]),
    ];
    return ObbyMaulerFighterPreset;
}());
//# sourceMappingURL=ObbyMaulerFighterPreset.js.map