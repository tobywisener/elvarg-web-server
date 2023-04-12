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
exports.DDSPureMFighterPreset = void 0;
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var CombatSwitch_1 = require("../CombatSwitch");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var Item_1 = require("../../../../../model/Item");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var DragonDaggerCombatSwitch = /** @class */ (function (_super) {
    __extends(DragonDaggerCombatSwitch, _super);
    function DragonDaggerCombatSwitch(switchItemIds, execFunc) {
        var _this = _super.call(this, switchItemIds) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    DragonDaggerCombatSwitch.prototype.performAfterSwitch = function (playerBot, enemy) {
        this.execFunc();
    };
    return DragonDaggerCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var DDSPureMFighterPreset = exports.DDSPureMFighterPreset = /** @class */ (function () {
    function DDSPureMFighterPreset() {
    }
    DDSPureMFighterPreset.prototype.getItemPreset = function () {
        return DDSPureMFighterPreset.BOT_DDS_PURE_M_73;
    };
    DDSPureMFighterPreset.prototype.getCombatActions = function () {
        return DDSPureMFighterPreset.COMBAT_ACTIONS;
    };
    DDSPureMFighterPreset.prototype.eatAtPercent = function () {
        return 40;
    };
    DDSPureMFighterPreset.BOT_DDS_PURE_M_73 = new Presetable_1.Presetable("DDS Pure (M)", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_STRENGTH_4_, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_ATTACK_4_, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH, 1)
    ], [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_FULL_HELM, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.OBSIDIAN_CAPE, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_SCIMITAR, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_GLORY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_PLATEBODY, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BOOK_OF_DARKNESS, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_GLOVES, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS, 1),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL, 1),
        new Item_1.Item(null)], [60, 1, 99, 85, 1, 1, 1], MagicSpellbook_1.MagicSpellbook.NORMAL, true);
    DDSPureMFighterPreset.COMBAT_ACTIONS = [
        new DragonDaggerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().getTicks(TimerKey_1.TimerKey.COMBAT_ATTACK) <= 1;
            if (canAttackNextTick && playerBot.getSpecialPercentage() >= 25 && enemy.getHitpoints() < 46) {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial_1.CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        }),
        new DragonDaggerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.DRAGON_SCIMITAR], function (playerBot, enemy) {
            playerBot.setSpecialActivated(false);
            playerBot.getCombat().attack(enemy);
        }),
    ];
    return DDSPureMFighterPreset;
}());
//# sourceMappingURL=DDSPureMFighterPreset.js.map