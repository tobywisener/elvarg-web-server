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
exports.Vetion = void 0;
var World_1 = require("../../../../World");
var VetionCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/VetionCombatMethod");
var NPC_1 = require("../../npc/NPC");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var Vetion = exports.Vetion = /** @class */ (function (_super) {
    __extends(Vetion, _super);
    function Vetion(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.spawnedHellhounds = false;
        _this.rebornTimer = 0;
        _this.hellhounds = [];
        _this.hellhounds = [];
        _this.setNpcTransformationId(NpcIdentifiers_1.NpcIdentifiers.VETION);
        return _this;
    }
    Vetion.getCombatMethod = function () {
        return Vetion.COMBAT_METHOD;
    };
    Vetion.prototype.process = function () {
        _super.prototype.process.call(this);
        var target = this.getCombat().getTarget();
        if (target != null && this.getHitpoints() <= 125) {
            if (!this.spawnedHellhounds) {
                this.spawnHellhounds(target);
                this.spawnedHellhounds = true;
            }
        }
        if (this.getNpcTransformationId() == NpcIdentifiers_1.NpcIdentifiers.VETION_REBORN) {
            if (this.rebornTimer == 500) {
                this.spawnedHellhounds = true;
                this.setNpcTransformationId(NpcIdentifiers_1.NpcIdentifiers.VETION);
                this.rebornTimer = 0;
            }
            this.rebornTimer++;
        }
    };
    Vetion.prototype.spawnHellhounds = function (target) {
        for (var i = 0; i < 2; i++) {
            var hellhoundId = NpcIdentifiers_1.NpcIdentifiers.VETION_HELLHOUND;
            if (this.getNpcTransformationId() == NpcIdentifiers_1.NpcIdentifiers.VETION_REBORN) {
                hellhoundId = NpcIdentifiers_1.NpcIdentifiers.GREATER_VETION_HELLHOUND;
            }
            var hellhound = NPC_1.NPC.create(hellhoundId, this.getLocation());
            hellhound.setVetion(this);
            this.hellhounds.push(hellhound);
            World_1.World.getAddNPCQueue().push(hellhound);
        }
    };
    Vetion.prototype.despawnHellhound = function (hellhound) {
        this.hellhounds.splice(this.hellhounds.indexOf(hellhound), 1);
    };
    Vetion.prototype.appendDeath = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.hellhounds), _c = _b.next(); !_c.done; _c = _b.next()) {
                var npc = _c.value;
                World_1.World.getRemoveNPCQueue().push(npc);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.hellhounds = [];
        this.spawnedHellhounds = false;
        if (this.getNpcTransformationId() != NpcIdentifiers_1.NpcIdentifiers.VETION_REBORN) {
            this.setHitpoints(this.getDefinition().getHitpoints());
            this.setNpcTransformationId(NpcIdentifiers_1.NpcIdentifiers.VETION_REBORN);
            this.forceChat("Do it again!");
            return;
        }
        _super.prototype.appendDeath.call(this);
    };
    Vetion.prototype.manipulateHit = function (hit) {
        if (this.spawnedHellhounds && this.hellhounds.length > 0) {
            hit.setTotalDamage(0);
        }
        return hit;
    };
    Vetion.COMBAT_METHOD = new VetionCombatMethod_1.VetionCombatMethod();
    return Vetion;
}(NPC_1.NPC));
//# sourceMappingURL=Vetion.js.map