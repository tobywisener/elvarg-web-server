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
exports.KingBlackDragonMethod = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var PendingHit_1 = require("../../../hit/PendingHit");
var Misc_1 = require("../../../../../../util/Misc");
var CombatType_1 = require("../../../CombatType");
var Projectile_1 = require("../../../../../model/Projectile");
var PrayerHandler_1 = require("../../../../PrayerHandler");
var CombatEquipment_1 = require("../../../CombatEquipment");
var CombatFactory_1 = require("../../../CombatFactory");
var CombatPoisonEffect_1 = require("../../../../../task/impl/CombatPoisonEffect");
var Animation_1 = require("../../../../../model/Animation");
var Breath;
(function (Breath) {
    Breath[Breath["ICE"] = 0] = "ICE";
    Breath[Breath["POISON"] = 1] = "POISON";
    Breath[Breath["SHOCK"] = 2] = "SHOCK";
    Breath[Breath["DRAGON"] = 3] = "DRAGON";
})(Breath || (Breath = {}));
var KingBlackDragonMethod = exports.KingBlackDragonMethod = /** @class */ (function (_super) {
    __extends(KingBlackDragonMethod, _super);
    function KingBlackDragonMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KingBlackDragonMethod.start = function (character, target) {
        if (this.currentAttackType === CombatType_1.CombatType.MAGIC) {
            character.performAnimation(new Animation_1.Animation(84));
            switch (this.currentBreath) {
                case Breath.DRAGON:
                    Projectile_1.Projectile.createProjectile(character, target, 393, 40, 55, 31, 43).sendProjectile;
                    break;
                case Breath.ICE:
                    Projectile_1.Projectile.createProjectile(character, target, 396, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.POISON:
                    Projectile_1.Projectile.createProjectile(character, target, 394, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.SHOCK:
                    Projectile_1.Projectile.createProjectile(character, target, 395, 40, 55, 31, 43).sendProjectile();
                    break;
                default:
                    break;
            }
        }
        else if (this.currentAttackType === CombatType_1.CombatType.MELEE) {
            character.performAnimation(new Animation_1.Animation(91));
        }
    };
    KingBlackDragonMethod.attackSpeed = function (character) {
        return this.currentAttackType === CombatType_1.CombatType.MAGIC ? 6 : 4;
    };
    KingBlackDragonMethod.attackDistance = function (character) {
        return 8;
    };
    KingBlackDragonMethod.prototype.type = function () {
        return KingBlackDragonMethod.currentAttackType;
    };
    KingBlackDragonMethod.prototype.hits = function (character, target) {
        var hit = new PendingHit_1.PendingHit(character, target, this, 1);
        if (target.isPlayer()) {
            var p = target.getAsPlayer();
            if (KingBlackDragonMethod.currentAttackType === CombatType_1.CombatType.MAGIC && KingBlackDragonMethod.currentBreath === Breath.DRAGON) {
                if (PrayerHandler_1.PrayerHandler.isActivated(p, PrayerHandler_1.PrayerHandler.PROTECT_FROM_MAGIC) && CombatEquipment_1.CombatEquipment.hasDragonProtectionGear(p) && !p.getCombat().getFireImmunityTimer().finished()) {
                    target.getPacketSender().sendMessage("You're protected against the dragonfire breath.");
                    return [hit];
                }
                var extendedHit = 25;
                if (PrayerHandler_1.PrayerHandler.isActivated(p, PrayerHandler_1.PrayerHandler.PROTECT_FROM_MAGIC)) {
                    extendedHit -= 5;
                }
                if (!p.getCombat().getFireImmunityTimer().finished()) {
                    extendedHit -= 10;
                }
                if (CombatEquipment_1.CombatEquipment.hasDragonProtectionGear(p)) {
                    extendedHit -= 10;
                }
                p.getPacketSender().sendMessage("The dragonfire burns you.");
                hit.getHits()[0].incrementDamage(extendedHit);
            }
            if (KingBlackDragonMethod.currentAttackType === CombatType_1.CombatType.MAGIC) {
                switch (KingBlackDragonMethod.currentBreath) {
                    case Breath.ICE:
                        CombatFactory_1.CombatFactory.freeze(hit.getTarget().getAsPlayer(), 5);
                        break;
                    case Breath.POISON:
                        CombatFactory_1.CombatFactory.poisonEntity(hit.getTarget().getAsPlayer(), CombatPoisonEffect_1.PoisonType.SUPER);
                        break;
                    default:
                        break;
                }
            }
        }
        return [hit];
    };
    KingBlackDragonMethod.finished = function (character, target) {
        if (character.getLocation().getDistance(target.getLocation()) <= 3) {
            if (Misc_1.Misc.randomInclusive(0, 2) === 0) {
                this.currentAttackType = CombatType_1.CombatType.MAGIC;
            }
            else {
                this.currentAttackType = CombatType_1.CombatType.MELEE;
            }
        }
        else {
            this.currentAttackType = CombatType_1.CombatType.MAGIC;
        }
        if (this.currentAttackType === CombatType_1.CombatType.MAGIC) {
            var random = Misc_1.Misc.randomInclusive(0, 10);
            if (random >= 0 && random <= 3) {
                this.currentBreath = Breath.DRAGON;
            }
            else if (random >= 4 && random <= 6) {
                this.currentBreath = Breath.SHOCK;
            }
            else if (random >= 7 && random <= 9) {
                this.currentBreath = Breath.POISON;
            }
            else {
                this.currentBreath = Breath.ICE;
            }
        }
    };
    KingBlackDragonMethod.currentAttackType = CombatType_1.CombatType.MAGIC;
    KingBlackDragonMethod.currentBreath = Breath.DRAGON;
    return KingBlackDragonMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=KingBlackDragonMethod.js.map