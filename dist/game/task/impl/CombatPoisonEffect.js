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
exports.CombatPoisonData = exports.PoisonType = exports.CombatPoisonEffect = void 0;
var ItemIdentifiers_1 = require("../../../util/ItemIdentifiers");
var Task_1 = require("../Task");
var HitDamage_1 = require("../../content/combat/hit/HitDamage");
var HitMask_1 = require("../../content/combat/hit/HitMask");
var CombatPoisonEffect = /** @class */ (function (_super) {
    __extends(CombatPoisonEffect, _super);
    function CombatPoisonEffect(entity) {
        var _this = _super.call(this, 30, entity) || this;
        _this.entity = entity;
        _this.tick = 0;
        return _this;
    }
    CombatPoisonEffect.prototype.execute = function () {
        this.tick++;
        if (!this.entity.isRegistered()) {
            this.stop();
            return;
        }
        if (!this.entity.isPoisoned()) {
            this.stop();
            return;
        }
        if (!this.entity.getCombat().getPoisonImmunityTimer().finished()) {
            this.stop();
            return;
        }
        var poisonDamage = this.tick % 5 === 0 ? this.entity.getPoisonDamage() - 1 : this.entity.getPoisonDamage();
        this, poisonDamage = poisonDamage;
        this.entity.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(poisonDamage, HitMask_1.HitMask.GREEN)]);
        if (poisonDamage <= 1) {
            this.stop();
            return;
        }
    };
    CombatPoisonEffect.prototype.stop = function () {
        var poisonDamage = 0;
        if (this.entity.isPlayer()) {
            this.entity.getAsPlayer().getPacketSender().sendPoisonType(0);
        }
        _super.prototype.stop.call(this);
    };
    return CombatPoisonEffect;
}(Task_1.Task));
exports.CombatPoisonEffect = CombatPoisonEffect;
var PoisonType;
(function (PoisonType) {
    PoisonType[PoisonType["VERY_WEAK"] = 2] = "VERY_WEAK";
    PoisonType[PoisonType["WEAK"] = 3] = "WEAK";
    PoisonType[PoisonType["MILD"] = 4] = "MILD";
    PoisonType[PoisonType["EXTRA"] = 5] = "EXTRA";
    PoisonType[PoisonType["SUPER"] = 6] = "SUPER";
    PoisonType[PoisonType["VENOM"] = 12] = "VENOM";
})(PoisonType = exports.PoisonType || (exports.PoisonType = {}));
var CombatPoisonData = exports.CombatPoisonData = /** @class */ (function () {
    function CombatPoisonData() {
    }
    CombatPoisonData.getDemage = function () {
        return CombatPoisonData.damage;
    };
    CombatPoisonData.init = function () {
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.POISONED_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.POISON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.POISON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLACK_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.WHITE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.WHITE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.WHITE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BONE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BONE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BONE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLURITE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNITE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.SILVER_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLURITE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNITE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.SILVER_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BLURITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.SILVER_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.KERIS_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.KERIS_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.KERIS_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DART_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DART_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DART_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.BRONZE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.IRON_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.STEEL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.MITHRIL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ADAMANT_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.RUNE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.AMETHYST_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.TOXIC_BLOWPIPE, PoisonType.VENOM);
        CombatPoisonData.types.push(ItemIdentifiers_1.ItemIdentifiers.ABYSSAL_TENTACLE, PoisonType.VENOM);
    };
    CombatPoisonData.getPoisonType = function (item) {
        if (!item || item.getId() < 1 || item.getAmount() < 1) {
            return undefined;
        }
        return CombatPoisonData.types[item.getId()];
    };
    CombatPoisonData.tipos = new Map();
    return CombatPoisonData;
}());
//# sourceMappingURL=CombatPoisonEffect.js.map