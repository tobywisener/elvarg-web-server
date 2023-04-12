"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcDefinition = void 0;
var NpcDefinition = exports.NpcDefinition = /** @class */ (function () {
    function NpcDefinition() {
        this.aggressiveTolerance = true;
        this.fightsBack = true;
        this.hitpoints = 10;
    }
    NpcDefinition.forId = function (id) {
        return this.definitions.get(id) || this.DEFAULT;
    };
    NpcDefinition.prototype.getId = function () {
        return this.id;
    };
    NpcDefinition.prototype.getName = function () {
        return this.name;
    };
    NpcDefinition.prototype.getExamine = function () {
        return this.examine;
    };
    NpcDefinition.prototype.getSize = function () {
        return this.size;
    };
    NpcDefinition.prototype.getWalkRadius = function () {
        return this.walkRadius;
    };
    NpcDefinition.prototype.isAttackable = function () {
        return this.attackable;
    };
    NpcDefinition.prototype.doesRetreat = function () {
        return this.retreats;
    };
    NpcDefinition.prototype.isAggressive = function () {
        return this.aggressive;
    };
    NpcDefinition.prototype.buildsAggressionTolerance = function () {
        return this.aggressiveTolerance;
    };
    NpcDefinition.prototype.isPoisonous = function () {
        return this.poisonous;
    };
    NpcDefinition.prototype.doesFightBack = function () {
        return this.fightsBack;
    };
    NpcDefinition.prototype.getRespawn = function () {
        return this.respawn;
    };
    NpcDefinition.prototype.getMaxHit = function () {
        return this.maxHit;
    };
    NpcDefinition.prototype.getHitpoints = function () {
        return this.hitpoints;
    };
    NpcDefinition.prototype.setMaxHitpoints = function (hitpoints) {
        this.hitpoints = hitpoints;
    };
    NpcDefinition.prototype.getAttackSpeed = function () {
        return this.attackSpeed;
    };
    NpcDefinition.prototype.getAttackAnim = function () {
        return this.attackAnim;
    };
    NpcDefinition.prototype.getDefenceAnim = function () {
        return this.defenceAnim;
    };
    NpcDefinition.prototype.getDeathAnim = function () {
        return this.deathAnim;
    };
    NpcDefinition.prototype.getCombatLevel = function () {
        return this.combatLevel;
    };
    NpcDefinition.prototype.getStats = function () {
        if (!this.stats) {
            return NpcDefinition.DEFAULT_STATS;
        }
        return this.stats;
    };
    NpcDefinition.prototype.getSlayerLevel = function () {
        return this.slayerLevel;
    };
    NpcDefinition.prototype.getCombatFollowDistance = function () {
        return this.combatFollowDistance;
    };
    NpcDefinition.definitions = new Map();
    NpcDefinition.DEFAULT = new NpcDefinition();
    NpcDefinition.DEFAULT_STATS = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return NpcDefinition;
}());
//# sourceMappingURL=NpcDefinition.js.map