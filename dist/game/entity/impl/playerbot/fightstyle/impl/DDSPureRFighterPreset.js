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
exports.DDSPureRFighterPreset = void 0;
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var CombatSwitch_1 = require("../CombatSwitch");
var Item_1 = require("../../../../../model/Item");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
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
var DDSPureRFighterPreset = /** @class */ (function () {
    function DDSPureRFighterPreset() {
        this.BOT_DDS_PURE_R_73 = new Presetable_1.Presetable("DDS Pure (R)", [
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_, 75),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH)
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
            new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, 75)
        ], [60, 1, 99, 85, 99, 1, 1], MagicSpellbook_1.MagicSpellbook.NORMAL, true);
        this.COMBAT_ACTIONS = [
            new DragonDaggerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], function (playerBot, enemy) {
                var shouldPerform = playerBot.getSpecialPercentage() >= 25 && enemy.getHitpoints() < 45;
                if (shouldPerform) {
                    if (!playerBot.isSpecialActivated()) {
                        CombatSpecial_1.CombatSpecial.activate(playerBot);
                    }
                    playerBot.getCombat().attack(enemy);
                }
            }),
            new DragonDaggerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_], function (playerBot, enemy) {
                var shouldPerform = enemy.getHitpoints() < 40;
                if (shouldPerform) {
                    playerBot.getCombat().attack(enemy);
                }
            }),
            new DragonDaggerCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW], function (playerBot, enemy) {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }),
        ];
    }
    DDSPureRFighterPreset.prototype.getItemPreset = function () {
        return this.BOT_DDS_PURE_R_73;
    };
    ;
    DDSPureRFighterPreset.prototype.getCombatActions = function () {
        return this.COMBAT_ACTIONS;
    };
    ;
    DDSPureRFighterPreset.prototype.eatAtPercent = function () {
        return 40;
    };
    return DDSPureRFighterPreset;
}());
exports.DDSPureRFighterPreset = DDSPureRFighterPreset;
//# sourceMappingURL=DDSPureRFighterPreset.js.map