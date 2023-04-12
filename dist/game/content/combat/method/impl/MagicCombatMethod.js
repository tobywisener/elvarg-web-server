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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicCombatMethod = void 0;
var CombatMethod_1 = require("../CombatMethod");
var Graphic_1 = require("../../../../model/Graphic");
var Sounds_1 = require("../../../../Sounds");
var Sound_1 = require("../../../../Sound");
var World_1 = require("../../../../World");
var CombatFactory_1 = require("../../CombatFactory");
;
var CombatType_1 = require("../../CombatType");
var PendingHit_1 = require("../../hit/PendingHit");
var CombatAncientSpell_1 = require("../../magic/CombatAncientSpell");
var GraphicHeight_1 = require("../../../../model/GraphicHeight");
var AreaManager_1 = require("../../../../model/areas/AreaManager");
var MagicCombatMethod = exports.MagicCombatMethod = /** @class */ (function (_super) {
    __extends(MagicCombatMethod, _super);
    function MagicCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MagicCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MAGIC;
    };
    MagicCombatMethod.prototype.hits = function (character, target) {
        var e_1, _a, e_2, _b;
        var hits = [new PendingHit_1.PendingHit(character, target, this, 3)];
        var spell = character.getCombat().getSelectedSpell();
        if (!spell) {
            return hits;
        }
        var multiCombatHits = [];
        try {
            for (var hits_1 = __values(hits), hits_1_1 = hits_1.next(); !hits_1_1.done; hits_1_1 = hits_1.next()) {
                var hit = hits_1_1.value;
                spell.onHitCalc(hit);
                if (!hit.isAccurate() || !(spell instanceof CombatAncientSpell_1.CombatAncientSpell) || spell.spellRadius() <= 0) {
                    continue;
                }
                var it = null;
                if (character.isPlayer() && target.isPlayer()) {
                    it = character.getLocalPlayers().values();
                }
                else if (character.isPlayer() && target.isNpc()) {
                    it = character.getLocalNpcs().values();
                }
                else if (character.isNpc() && target.isNpc()) {
                    var npcs = Object.values(World_1.World.getNpcs());
                }
                else if (character.isNpc() && target.isPlayer()) {
                    var npcsValues = Object.values(World_1.World.getNpcs());
                }
                try {
                    for (var it_1 = (e_2 = void 0, __values(it)), it_1_1 = it_1.next(); !it_1_1.done; it_1_1 = it_1.next()) {
                        var next = it_1_1.value;
                        if (!next || (next.isNpc() && !next.getCurrentDefinition().isAttackable()) || (next.isPlayer() && AreaManager_1.AreaManager.canAttack(character, next) != CombatFactory_1.CanAttackResponse.CAN_ATTACK) || !AreaManager_1.AreaManager.inMulti(next) || !next.getLocation().isWithinDistance(target.getLocation(), spell.spellRadius()) || next == character || next == target || next.getHitpoints() <= 0) {
                            continue;
                        }
                        var pendingHit = new PendingHit_1.PendingHit(character, next, this, 3, false);
                        multiCombatHits.push(pendingHit);
                        spell.onHitCalc(pendingHit);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (it_1_1 && !it_1_1.done && (_b = it_1.return)) _b.call(it_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (hits_1_1 && !hits_1_1.done && (_a = hits_1.return)) _a.call(hits_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (multiCombatHits.length > 0) {
            return hits.concat(multiCombatHits);
        }
        return hits;
    };
    MagicCombatMethod.prototype.canAttack = function (character, target) {
        if (character.isNpc()) {
            return true;
        }
        // Set the current spell to the autocast spell if it's null.
        if (character.getCombat().getCastSpell() == null) {
            character.getCombat().setCastSpell(character.getCombat().getAutocastSpell());
        }
        // Character didn't have autocast spell either.
        if (character.getCombat().getCastSpell() == null) {
            return false;
        }
        return character.getCombat().getCastSpell().canCast(character.getAsPlayer(), true);
    };
    MagicCombatMethod.prototype.start = function (character, target) {
        var spell = character.getCombat().getSelectedSpell();
        if (spell != null) {
            spell.startCast(character, target);
        }
    };
    MagicCombatMethod.prototype.attackSpeed = function (character) {
        if (character.getCombat().getPreviousCast() != null) {
            return character.getCombat().getPreviousCast().getAttackSpeed();
        }
        return _super.prototype.attackSpeed.call(this, character);
    };
    MagicCombatMethod.prototype.attackDistance = function (character) {
        return 10;
    };
    MagicCombatMethod.prototype.finished = function (character, target) {
        // Reset the castSpell to autocastSpell
        // Update previousCastSpell so effects can be handled.
        var current = character.getCombat().getCastSpell();
        character.getCombat().setCastSpell(null);
        if (character.getCombat().getAutocastSpell() === null) {
            character.getCombat().reset();
            character.setMobileInteraction(target);
            character.getMovementQueue().reset();
        }
        character.getCombat().setPreviousCast(current);
    };
    MagicCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        var attacker = hit.getAttacker();
        var target = hit.getTarget();
        var accurate = hit.isAccurate();
        var damage = hit.getTotalDamage();
        if (attacker.getHitpoints() <= 0 || target.getHitpoints() <= 0) {
            return;
        }
        var previousSpell = attacker.getCombat().getPreviousCast();
        if (previousSpell) {
            if (accurate) {
                var endGraphic = previousSpell.endGraphic();
                target.performGraphic(endGraphic);
                Sounds_1.Sounds.sendSound(target.getAsPlayer(), previousSpell.impactSound());
            }
            else {
                // Send splash graphics for the spell because it wasn't accurate
                target.performGraphic(MagicCombatMethod.SPLASH_GRAPHIC);
                Sounds_1.Sounds.sendSound(attacker.getAsPlayer(), Sound_1.Sound.SPELL_FAIL_SPLASH);
            }
            previousSpell.finishCast(attacker, target, accurate, damage);
        }
    };
    MagicCombatMethod.SPLASH_GRAPHIC = new Graphic_1.Graphic(85, GraphicHeight_1.GraphicHeight.MIDDLE);
    return MagicCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=MagicCombatMethod.js.map