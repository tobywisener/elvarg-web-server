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
exports.TribridMaxFighterPreset = void 0;
var GameConstants_1 = require("../../../../../GameConstants");
var PotionConsumable_1 = require("../../../../../content/PotionConsumable");
var PrayerHandler_1 = require("../../../../../content/PrayerHandler");
var CombatFactory_1 = require("../../../../../content/combat/CombatFactory");
var CombatSpecial_1 = require("../../../../../content/combat/CombatSpecial");
var CombatType_1 = require("../../../../../content/combat/CombatType");
var CombatSpells_1 = require("../../../../../content/combat/magic/CombatSpells");
var Presetable_1 = require("../../../../../content/presets/Presetable");
var AttackStyleSwitch_1 = require("../AttackStyleSwitch");
var CombatSwitch_1 = require("../CombatSwitch");
var EnemyDefenseAwareCombatSwitch_1 = require("../EnemyDefenseAwareCombatSwitch");
var Item_1 = require("../../../../../model/Item");
var ItemInSlot_1 = require("../../../../../model/ItemInSlot");
var MagicSpellbook_1 = require("../../../../../model/MagicSpellbook");
var Skill_1 = require("../../../../../model/Skill");
var BonusManager_1 = require("../../../../../model/equipment/BonusManager");
var MovementQueue_1 = require("../../../../../model/movement/MovementQueue");
var TeleportHandler_1 = require("../../../../../model/teleportation/TeleportHandler");
var TeleportType_1 = require("../../../../../model/teleportation/TeleportType");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var TribridCombatSwitch = /** @class */ (function (_super) {
    __extends(TribridCombatSwitch, _super);
    function TribridCombatSwitch(n1, execFunc, execShoud, pd) {
        var _this = _super.call(this, n1) || this;
        _this.execFunc = execFunc;
        _this.execShoud = execShoud;
        return _this;
    }
    TribridCombatSwitch.prototype.shouldPerform = function () {
        return this.execFunc();
    };
    TribridCombatSwitch.prototype.performAfterSwitch = function () {
        this.execShoud();
    };
    return TribridCombatSwitch;
}(CombatSwitch_1.CombatSwitch));
var PureCombatAction = /** @class */ (function () {
    function PureCombatAction(execFunc, execShould) {
        this.execFunc = execFunc;
        this.execShould = execShould;
    }
    PureCombatAction.prototype.shouldPerform = function (playerBot, enemy) {
        return this.execFunc();
    };
    PureCombatAction.prototype.perform = function (playerBot, enemy) {
        this.execShould();
    };
    PureCombatAction.prototype.stopAfter = function () {
        return false;
    };
    return PureCombatAction;
}());
var TribridMaxFighterPreset = exports.TribridMaxFighterPreset = /** @class */ (function () {
    function TribridMaxFighterPreset() {
    }
    TribridMaxFighterPreset.prototype.getItemPreset = function () {
        return TribridMaxFighterPreset.BOT_HARD_TRIBRID;
    };
    TribridMaxFighterPreset.prototype.getCombatActions = function () {
        return TribridMaxFighterPreset.COMBAT_ACTIONS;
    };
    TribridMaxFighterPreset.prototype.eatAtPercent = function () {
        return 62;
    };
    TribridMaxFighterPreset.BOT_HARD_TRIBRID = new Presetable_1.Presetable("Bot Tribrid", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ARMADYL_CROSSBOW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ARMADYL_GODSWORD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANGING_POTION_4_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_COMBAT_POTION_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERSKIRT), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERTOP), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SUPER_RESTORE_4_),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATER_RUNE, 10000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLOOD_RUNE, 10000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DEATH_RUNE, 10000), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TELEPORT_TO_HOUSE, 1),
    ], [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HELM_OF_NEITIZNOT),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.INFERNAL_CAPE),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_THE_DEAD),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AMULET_OF_FURY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBESKIRT),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BLESSED_SPIRIT_SHIELD),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBETOP),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BARROWS_GLOVES),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CLIMBING_BOOTS),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, 135),
    ], [99, 99, 99, 99, 99, 99, 99], MagicSpellbook_1.MagicSpellbook.ANCIENT, true);
    TribridMaxFighterPreset.COMBAT_ACTIONS = [
        new PureCombatAction(function (playerBot, enemy) {
            var food = ItemInSlot_1.ItemInSlot.getFromInventory(ItemIdentifiers_1.ItemIdentifiers.MANTA_RAY, playerBot.getInventory());
            return food == null;
        }, function (playerBot, enemy) {
            console.log("Escape");
            if (enemy.isPlayer()) {
                playerBot.sendChat("Cya ".concat(enemy.getAsPlayer().getUsername()));
            }
            if (TeleportHandler_1.TeleportHandler.checkReqs(playerBot, GameConstants_1.GameConstants.DEFAULT_LOCATION)) {
                TeleportHandler_1.TeleportHandler.teleport(playerBot, GameConstants_1.GameConstants.DEFAULT_LOCATION, TeleportType_1.TeleportType.TELE_TAB, false);
                playerBot.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.TELEPORT_TO_HOUSE, 1);
            }
        }),
        new PureCombatAction(function (playerBot, enemy) { return true; }, function (playerBot, enemy) {
            var combatMethod = CombatFactory_1.CombatFactory.getMethod(enemy);
            var combatType = combatMethod.type();
            var magicAccuracy = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_MAGIC]);
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
        new TribridCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ARMADYL_GODSWORD, ItemIdentifiers_1.ItemIdentifiers.INFERNAL_CAPE, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERTOP], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove()
                && enemy.getHitpointsAfterPendingDamage() <= 49
                && playerBot.getSpecialPercentage() >= 50
                && !enemy.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MELEE];
        }, function (playerBot, enemy) {
            console.log("AGS Spec");
            playerBot.getCombat().setCastSpell(null);
            if (!playerBot.isSpecialActivated()) {
                CombatSpecial_1.CombatSpecial.activate(playerBot);
            }
            playerBot.getCombat().attack(enemy);
        }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.PIETY]),
        new PureCombatAction(function (playerBot, enemy) {
            var combatMethod = CombatFactory_1.CombatFactory.getMethod(enemy);
            var distance = playerBot.calculateDistance(enemy);
            var cantAttack = playerBot.getTimers().has(TimerKey_1.TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey_1.TimerKey.COMBAT_ATTACK) > 2;
            return cantAttack
                && playerBot.getMovementQueue().size() == 0
                && !enemy.getMovementQueue().getMobility().canMove()
                && distance == 1
                && CombatFactory_1.CombatFactory.canReach(enemy, combatMethod, playerBot);
        }, function (playerBot, enemy) {
            console.log("Retreat");
            playerBot.setFollowing(null);
            MovementQueue_1.MovementQueue.randomClippedStepNotSouth(playerBot, 3);
        }),
        new PureCombatAction(function (playerBot, enemy) {
            var inventory = playerBot.getInventory();
            var superRestorePotionIds = PotionConsumable_1.PotionConsumable.SUPER_RESTORE_POTIONS.getIds();
            for (var i = 0; i < superRestorePotionIds.length; i++) {
                var id = superRestorePotionIds[i];
                var item = ItemInSlot_1.ItemInSlot.getFromInventory(id, inventory);
                if (item !== null) {
                    var prayerLevel = playerBot.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER);
                    if (prayerLevel < 50) {
                        return true;
                    }
                }
            }
            return false;
        }, function (playerBot, enemy) {
            console.log("Pot up");
            var inventory = playerBot.getInventory();
            var superRestorePotionIds = PotionConsumable_1.PotionConsumable.SUPER_RESTORE_POTIONS.getIds();
            for (var i = 0; i < superRestorePotionIds.length; i++) {
                var id = superRestorePotionIds[i];
                var item = ItemInSlot_1.ItemInSlot.getFromInventory(id, inventory);
                if (item !== null) {
                    PotionConsumable_1.PotionConsumable.drink(playerBot, item.getId(), item.getSlot());
                    break;
                }
            }
        }),
        new TribridCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBETOP, ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBESKIRT, ItemIdentifiers_1.ItemIdentifiers.BLESSED_SPIRIT_SHIELD, ItemIdentifiers_1.ItemIdentifiers.INFERNAL_CAPE], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey_1.TimerKey.FREEZE_IMMUNITY) && CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
        }, function (playerBot, enemy) {
            console.log("Freeze");
            playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
            playerBot.getCombat().attack(enemy);
        }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.AUGURY]),
        new EnemyDefenseAwareCombatSwitch_1.EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.MAGIC, new TribridCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBETOP, ItemIdentifiers_1.ItemIdentifiers.AHRIMS_ROBESKIRT, ItemIdentifiers_1.ItemIdentifiers.BLESSED_SPIRIT_SHIELD, ItemIdentifiers_1.ItemIdentifiers.INFERNAL_CAPE], function (playerBot, enemy) { return CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false); }, function (playerBot, enemy) {
                console.log("Magic");
                playerBot.getCombat().setCastSpell(CombatSpells_1.CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.AUGURY])),
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.RANGED, new TribridCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ARMADYL_CROSSBOW, ItemIdentifiers_1.ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERTOP, ItemIdentifiers_1.ItemIdentifiers.BLESSED_SPIRIT_SHIELD], function (playerBot, enemy) { return true; }, function (playerBot, enemy) {
                console.log("Ranged");
                playerBot.getCombat().setCastSpell(null);
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.RIGOUR])),
            new AttackStyleSwitch_1.AttackStyleSwitch(CombatType_1.CombatType.MELEE, new TribridCombatSwitch([ItemIdentifiers_1.ItemIdentifiers.ARMADYL_GODSWORD, ItemIdentifiers_1.ItemIdentifiers.INFERNAL_CAPE, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers_1.ItemIdentifiers.KARILS_LEATHERTOP], function (playerBot, enemy) { return playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() <= 45; }, function (playerBot, enemy) {
                console.log("Melee");
                playerBot.getCombat().setCastSpell(null);
                playerBot.getCombat().attack(enemy);
            }, [PrayerHandler_1.PrayerData.PROTECT_ITEM, PrayerHandler_1.PrayerData.PIETY]))
        ], function (playerBot, enemy) {
            var canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey_1.TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick;
        })
    ];
    return TribridMaxFighterPreset;
}());
//# sourceMappingURL=TribridMaxFighterPreset.js.map