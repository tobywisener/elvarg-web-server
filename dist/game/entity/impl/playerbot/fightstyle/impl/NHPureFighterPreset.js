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
exports.NHPureFighterPreset = void 0;
var CombatFactory_1 = require("../../../../../content/combat/CombatFactory");
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var CombatType_1 = require("../../../../../content/combat/CombatType");
var CombatSpells_1 = require("../../../../../content/combat/magic/CombatSpells");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var AttackStyleSwitch_1 = require("../AttackStyleSwitch");
var CombatSwitch_1 = require("../CombatSwitch");
var EnemyDefenseAwareCombatSwitch_1 = require("../EnemyDefenseAwareCombatSwitch");
var Item_1 = require("../../../../../model/Item");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var MovementQueue_1 = require("../../../../../model/movement/MovementQueue");
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
var PureCombatAction = /** @class */ (function () {
    function PureCombatAction(execFunc, execShould) {
        this.execFunc = execFunc;
        this.execShould = execShould;
    }
    PureCombatAction.prototype.shouldPerform = function (playerBot, enemy) {
        return this.execShould();
    };
    PureCombatAction.prototype.perform = function (playerBot, enemy) {
        this.execFunc();
    };
    PureCombatAction.prototype.stopAfter = function () {
        return false;
    };
    return PureCombatAction;
}());
var NHPureFighterPreset = exports.NHPureFighterPreset = /** @class */ (function () {
    function NHPureFighterPreset() {
    }
    NHPureFighterPreset.prototype.eatAtPercent = function () {
        return 40;
    };
    NHPureFighterPreset.prototype.getItemPreset = function () {
        return NHPureFighterPreset.BOT_NH_PURE_83;
    };
    NHPureFighterPreset.prototype.getCombatActions = function () {
        return NHPureFighterPreset.COMBAT_ACTIONS;
    };
    NHPureFighterPreset.BOT_NH_PURE_83 = new Presetable_1.Presetable("BOT NH Pure", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_STRENGTH_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRANITE_MAUL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATER_RUNE, 1000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLOOD_RUNE, 1000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DEATH_RUNE, 1000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH)
    ], [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_HOOD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ZAMORAK_CAPE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_GLORY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE), null, new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE_2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_GLOVES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, 175),], 
    /* atk, def, str, hp, range, pray, mage */
    [60, 1, 85, 99, 99, 1, 99], MagicSpellbook_1.MagicSpellbook.ANCIENT, true);
    NHPureFighterPreset.COMBAT_ACTIONS = [
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.GRANITE_MAUL, ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS], function (playerBot, enemy) {
            return playerBot.getSpecialPercentage() >= 50 && playerBot.getMovementQueue().getMobility().canMove() &&
                enemy.getHitpointsAfterPendingDamage() <= 45;
        }, function (playerBot, enemy) {
            playerBot.getCombat().attack(enemy);
            CombatSpecial_1.CombatSpecial.activate(playerBot);
        }),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL], function (playerBot, enemy) {
            var hasRing = playerBot.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL);
            return hasRing && !playerBot.getEquipment().contains(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL);
        }, function (playerBot, enemy) { playerBot.getCombat().attack(enemy); }),
        new PureCombatAction(function (playerBot, enemy) {
            return playerBot.getTimers().has(TimerKey_1.TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey_1.TimerKey.COMBAT_ATTACK) > 1
                && !enemy.getMovementQueue().getMobility().canMove()
                && playerBot.calculateDistance(enemy) === 1
                && CombatFactory_1.CombatFactory.canReach(enemy, CombatFactory_1.CombatFactory.getMethod(enemy), playerBot);
        }, function (playerBot, enemy) {
            if (playerBot.getMovementQueue().size() > 0) {
                return;
            }
            playerBot.setFollowing(null);
            MovementQueue_1.MovementQueue.randomClippedStepNotSouth(playerBot, 3);
        }),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ZAMORAK_CAPE, ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE_2, ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE], function (playerBot, enemy) {
            // Freeze the player if they can move
            return enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey_1.TimerKey.FREEZE_IMMUNITY)
                && CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
        }, function (playerBot, enemy) {
            playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
            playerBot.getCombat().attack(enemy);
        }),
        new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS], function (playerBot, enemy) {
            return enemy.getHitpoints() < 40;
        }, function (playerBot, enemy) { playerBot.getCombat().attack(enemy); }),
        new EnemyDefenseAwareCombatSwitch_1.EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.MAGIC, new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ZAMORAK_CAPE, ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE_2, ItemIdentifiers_1.ItemIdentifiers.GHOSTLY_ROBE], function (playerBot, enemy) {
                return CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            }, function (playerBot, enemy) {
                playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
            })),
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.RANGED, new PureCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_CHAPS], function (playerBot, enemy) {
                return true;
            }, function (playerBot, enemy) {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            })),
        ], function (playerBot, enemy) {
            return true;
        })
    ];
    return NHPureFighterPreset;
}());
//# sourceMappingURL=NHPureFighterPreset.js.map