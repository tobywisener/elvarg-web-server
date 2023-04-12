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
exports.ChaosElementalCombatMethod = exports.ChaosElementalAttackType = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatType_1 = require("../../../CombatType");
var PendingHit_1 = require("../../../hit/PendingHit");
var Projectile_1 = require("../../../../../model/Projectile");
var Item_1 = require("../../../../../model/Item");
var Flag_1 = require("../../../../../model/Flag");
var Misc_1 = require("../../../../../../util/Misc");
var WeaponInterfaces_1 = require("../../../WeaponInterfaces");
var BonusManager_1 = require("../../../../../model/equipment/BonusManager");
exports.ChaosElementalAttackType = {
    DEFAULT: 558,
    DISARM: 551,
    TELEPORT: 554
};
var ChaosElementalCombatMethod = exports.ChaosElementalCombatMethod = /** @class */ (function (_super) {
    __extends(ChaosElementalCombatMethod, _super);
    function ChaosElementalCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChaosElementalCombatMethod.prototype.type = function () {
        return ChaosElementalCombatMethod.combatType;
    };
    ChaosElementalCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    ChaosElementalCombatMethod.prototype.start = function (character, target) {
        character.performAnimation(new Animation_1.Animation(character.getAttackAnim()));
        var projectile2 = Projectile_1.Projectile.createProjectile(character, target, ChaosElementalCombatMethod.currentAttack, 40, 70, 31, 43);
        projectile2.sendProjectile();
    };
    ChaosElementalCombatMethod.prototype.attackDistance = function (character) {
        return 8;
    };
    ChaosElementalCombatMethod.prototype.finished = function (character, target) {
        if (Misc_1.Misc.getRandom(100) <= 10) {
            ChaosElementalCombatMethod.currentAttack = exports.ChaosElementalAttackType.DISARM;
        }
        else if (Misc_1.Misc.getRandom(100) <= 10) {
            ChaosElementalCombatMethod.currentAttack = exports.ChaosElementalAttackType.TELEPORT;
        }
        var keys = Object.keys(CombatType_1.CombatType);
        var randomIndex = Misc_1.Misc.getRandom(keys.length - 1);
        var combatType = CombatType_1.CombatType[keys[randomIndex]];
        ChaosElementalCombatMethod.combatType = combatType;
    };
    ChaosElementalCombatMethod.handleAfterHitEffects = function (hit) {
        if (hit.getTarget() != null) {
            switch (this.combatType) {
                case CombatType_1.CombatType.MELEE:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.MELEE_COMBAT_GFX);
                    break;
                case CombatType_1.CombatType.RANGED:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.RANGED_COMBAT_GFX);
                    break;
                case CombatType_1.CombatType.MAGIC:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.MAGIC_COMBAT_GFX);
                    break;
            }
            if (hit.getTarget().isPlayer()) {
                if (Misc_1.Misc.getRandom(100) <= 20) {
                    var player = hit.getTarget().getAsPlayer();
                    //DISARMING
                    if (ChaosElementalCombatMethod.currentAttack == exports.ChaosElementalAttackType.DISARM) {
                        ChaosElementalCombatMethod.disarmAttack(player);
                    }
                    //TELEPORTING
                    else if (ChaosElementalCombatMethod.currentAttack == exports.ChaosElementalAttackType.TELEPORT) {
                        player.moveTo(player.getLocation().add(Misc_1.Misc.getRandom(4), Misc_1.Misc.getRandom(4)));
                        player.getPacketSender().sendMessage("The Chaos elemental has teleported you.");
                    }
                }
            }
        }
    };
    ChaosElementalCombatMethod.disarmAttack = function (player) {
        if (!player.getInventory().isFull()) {
            var randomSlot = Misc_1.Misc.getRandom(player.getEquipment().capacity() - 1);
            var toDisarm = player.getEquipment().getItems()[randomSlot];
            if (toDisarm.isValid()) {
                player.getEquipment().set(randomSlot, new Item_1.Item(-1, 0));
                player.getInventory().addItem(toDisarm.clone());
                player.getPacketSender().sendMessage("You have been disarmed!");
                WeaponInterfaces_1.WeaponInterfaces.assign(player);
                BonusManager_1.BonusManager.update(player);
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
            }
        }
    };
    ChaosElementalCombatMethod.MELEE_COMBAT_GFX = new Graphic_1.Graphic(869, 0);
    ChaosElementalCombatMethod.RANGED_COMBAT_GFX = new Graphic_1.Graphic(867, 0);
    ChaosElementalCombatMethod.MAGIC_COMBAT_GFX = new Graphic_1.Graphic(868, 0);
    ChaosElementalCombatMethod.currentAttack = exports.ChaosElementalAttackType.DEFAULT;
    ChaosElementalCombatMethod.combatType = CombatType_1.CombatType.MELEE;
    return ChaosElementalCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=ChaosElementalCombatMethod.js.map