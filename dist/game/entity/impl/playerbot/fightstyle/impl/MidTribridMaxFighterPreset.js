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
exports.MidTribridMaxFighterPreset = void 0;
var PrayerHandler_1 = require("../../../../../content/PrayerHandler");
var CombatFactory_1 = require("../../../../../content/combat/CombatFactory");
var CombatType_1 = require("../../../../../content/combat/CombatType");
var CombatSpells_1 = require("../../../../../content/combat/magic/CombatSpells");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var AttackStyleSwitch_1 = require("../AttackStyleSwitch");
var CombatSwitch_1 = require("../CombatSwitch");
var EnemyDefenseAwareCombatSwitch_1 = require("../EnemyDefenseAwareCombatSwitch");
var Item_1 = require("../../../../../model/Item");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var BonusManager_1 = require("../../../../../model/equipment/BonusManager");
var RandomGen_1 = require("../../../../../../util/RandomGen");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var MidCombatSwitch = /** @class */ (function (_super) {
    __extends(MidCombatSwitch, _super);
    function MidCombatSwitch(switchItemIds, execFunc, prayerData) {
        var _this = _super.call(this, switchItemIds, prayerData) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MidCombatSwitch.prototype.shouldPerform = function (playerBot, enemy) {
        var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
        return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey_1.TimerKey.FREEZE_IMMUNITY) && CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
    };
    MidCombatSwitch.prototype.performAfterSwitch = function (playerBot, enemy) {
        this.execFunc(playerBot, enemy);
    };
    return MidCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var MidCombatAction = /** @class */ (function () {
    function MidCombatAction(execFunc) {
        this.execFunc = execFunc;
    }
    MidCombatAction.prototype.shouldPerform = function (playerBot, enemy) {
        return true;
    };
    MidCombatAction.prototype.perform = function (playerBot, enemy) {
        this.execFunc(playerBot, enemy);
    };
    MidCombatAction.prototype.stopAfter = function () {
        return false;
    };
    return MidCombatAction;
}());
var MidTribridMaxFighterPreset = exports.MidTribridMaxFighterPreset = /** @class */ (function () {
    function MidTribridMaxFighterPreset() {
    }
    MidTribridMaxFighterPreset.prototype.getItemPreset = function () {
        throw new Error("Method not implemented.");
    };
    MidTribridMaxFighterPreset.prototype.getCombatActions = function () {
        throw new Error("Method not implemented.");
    };
    MidTribridMaxFighterPreset.prototype.eatAtPercent = function () {
        throw new Error("Method not implemented.");
    };
    var _a;
    _a = MidTribridMaxFighterPreset;
    MidTribridMaxFighterPreset.RANDOM = new RandomGen_1.RandomGen();
    MidTribridMaxFighterPreset.BOT_MID_TRIBRID = new Presetable_1.Presetable("Mid Tribrid", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_BODY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_WHIP), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUNE_PLATELEGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_RESTORE_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_COMBAT_POTION_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SHARK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATER_RUNE, 6000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLOOD_RUNE, 2000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DEATH_RUNE, 4000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_),
    ], [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HELM_OF_NEITIZNOT),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SARADOMIN_CAPE),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MASTER_WAND),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_FURY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_TOP),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SPIRIT_SHIELD),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_BOTTOM),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BARROWS_GLOVES),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGON_BOLTS_E_, 500),
    ], [99, 99, 99, 99, 99, 99, 99], MagicSpellbook_1.MagicSpellbook.ANCIENT, true);
    MidTribridMaxFighterPreset.COMBAT_ACTIONS = [
        // Slower
        new MidCombatAction(function () {
            return _a.RANDOM.getInclusive(0, 4) != 2;
        }),
        // OverHead prayers
        new MidCombatAction(function (playerBot, enemy) {
            var combatMethod = CombatFactory_1.CombatFactory.getMethod(enemy);
            var magicAccuracy = enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_MAGIC];
            var combatType = combatMethod.type();
            if (!CombatFactory_1.CombatFactory.canReach(enemy, combatMethod, playerBot) && magicAccuracy < 35) {
                PrayerHandler_1.PrayerHandler.activatePrayer(playerBot, PrayerHandler_1.PrayerData.SMITE);
                return;
            }
            if (combatType == CombatType_1.CombatType.MELEE && CombatFactory_1.CombatFactory.canReach(enemy, combatMethod, playerBot)) {
                PrayerHandler_1.PrayerHandler.activatePrayer(playerBot, PrayerHandler_1.PrayerData.PROTECT_FROM_MELEE);
                return;
            }
            if (combatType == CombatType_1.CombatType.RANGED) {
                PrayerHandler_1.PrayerHandler.activatePrayer(playerBot, PrayerHandler_1.PrayerData.PROTECT_FROM_MISSILES);
            }
            else {
                PrayerHandler_1.PrayerHandler.activatePrayer(playerBot, PrayerHandler_1.PrayerData.PROTECT_FROM_MAGIC);
            }
        }),
        new MidCombatSwitch([ /*switch item ids*/], function (playerBot, enemy) {
            // perform after switch code here
        }),
        new MidCombatAction(function (playerBot, enemy) {
            var combatMethod = CombatFactory_1.CombatFactory.getMethod(enemy);
            var distance = playerBot.calculateDistance(enemy);
            var cantAttack = playerBot.getTimers().has(TimerKey_1.TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey_1.TimerKey.COMBAT_ATTACK) > 2;
            return cantAttack
                && playerBot.getMovementQueue().size() == 0
                && !enemy.getMovementQueue().getMobility().canMove()
                && distance == 1
                && CombatFactory_1.CombatFactory.canReach(enemy, combatMethod, playerBot);
        }),
        new MidCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MASTER_WAND, ItemIdentifiers_1.ItemIdentifiers.SARADOMIN_CAPE, ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_TOP, ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_BOTTOM, ItemIdentifiers_1.ItemIdentifiers.SPIRIT_SHIELD], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
            playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
            playerBot.getCombat().attack(enemy);
            return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey_1.TimerKey.FREEZE_IMMUNITY) && CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
        }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.MYSTIC_MIGHT]),
        new EnemyDefenseAwareCombatSwitch_1.EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.MAGIC, new MidCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.MASTER_WAND, ItemIdentifiers_1.ItemIdentifiers.SARADOMIN_CAPE, ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_TOP, ItemIdentifiers_1.ItemIdentifiers.MYSTIC_ROBE_BOTTOM, ItemIdentifiers_1.ItemIdentifiers.SPIRIT_SHIELD], function (playerBot, enemy) {
                playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
                return CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.AUGURY])),
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.RANGED, new MidCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers_1.ItemIdentifiers.RUNE_PLATELEGS, ItemIdentifiers_1.ItemIdentifiers.BLACK_DHIDE_BODY], function (playerBot, enemy) {
                playerBot.getCombat().setCastSpell(null);
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
                return true;
            })),
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.MELEE, new MidCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_WHIP, ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER], function (playerBot, enemy) {
                playerBot.getCombat().setCastSpell(null);
                playerBot.getCombat().attack(enemy);
                return playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() <= 45;
            }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.PIETY])),
        ], function (playerBot, enemy) {
            return playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
        })
    ];
    return MidTribridMaxFighterPreset;
}());
//# sourceMappingURL=MidTribridMaxFighterPreset.js.map