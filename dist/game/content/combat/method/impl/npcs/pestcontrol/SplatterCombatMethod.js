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
exports.SplatterCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../../MeleeCombatMethod");
var CombatType_1 = require("../../../../CombatType");
var Graphic_1 = require("../../../../../../model/Graphic");
var World_1 = require("../../../../../../World");
var HitDamage_1 = require("../../../../hit/HitDamage");
var HitMask_1 = require("../../../../hit/HitMask");
var Misc_1 = require("../../../../../../../util/Misc");
var SplatterCombatMethod = /** @class */ (function (_super) {
    __extends(SplatterCombatMethod, _super);
    function SplatterCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SplatterCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MELEE;
    };
    SplatterCombatMethod.prototype.onDeath = function (npc, killer) {
        var e_1, _a;
        npc.performGraphic(new Graphic_1.Graphic(650));
        var inDistance = [];
        World_1.World.getPlayers().forEach(function (p) {
            if (p && !p.isDyingReturn() && p.getLocation().isWithinDistance(npc.getLocation(), 1)) {
                inDistance.push(p);
            }
        });
        World_1.World.getNpcs().forEach(function (n) {
            if (n && !n.isDyingFunction() && n.getDefinition().isAttackable() && n.getLocation().isWithinDistance(npc.getLocation(), 1)) {
                inDistance.push(n);
            }
        });
        try {
            for (var inDistance_1 = __values(inDistance), inDistance_1_1 = inDistance_1.next(); !inDistance_1_1.done; inDistance_1_1 = inDistance_1.next()) {
                var entity = inDistance_1_1.value;
                if (entity) {
                    if (entity.getLocation().isWithinDistance(npc.getLocation(), 1)) {
                        entity.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(Misc_1.Misc.random(5, 25), HitMask_1.HitMask.RED)]);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (inDistance_1_1 && !inDistance_1_1.done && (_a = inDistance_1.return)) _a.call(inDistance_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return SplatterCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
exports.SplatterCombatMethod = SplatterCombatMethod;
//# sourceMappingURL=SplatterCombatMethod.js.map