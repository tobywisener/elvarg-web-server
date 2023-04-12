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
exports.NPC = void 0;
var Mobile_1 = require("../Mobile");
var Sound_1 = require("../../../Sound");
var World_1 = require("../../../World");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var CombatType_1 = require("../../../content/combat/CombatType");
var NpcDefinition_1 = require("../../../definition/NpcDefinition");
var NPCMovementCoordinator_1 = require("./NPCMovementCoordinator");
var Barricades_1 = require("./impl/Barricades");
var FacingDirection_1 = require("../../../model/FacingDirection");
var Ids_1 = require("../../../model/Ids");
var AreaManager_1 = require("../../../model/areas/AreaManager");
var WildernessArea_1 = require("../../../model/areas/impl/WildernessArea");
var TaskManager_1 = require("../../../task/TaskManager");
var NPCDeathTask_1 = require("../../../task/impl/NPCDeathTask");
var NPC = /** @class */ (function (_super) {
    __extends(NPC, _super);
    function NPC(id, position) {
        var _this = _super.call(this, position) || this;
        _this.movementCoordinator = new NPCMovementCoordinator_1.NPCMovementCoordinator(_this);
        _this.headIcon = -1;
        _this.visible = true;
        _this.face = FacingDirection_1.FacingDirection.NORTH;
        _this.barricadeFireTicks = 8;
        _this.id = id;
        _this.spawnPosition = position;
        if (_this.getDefinition() == null) {
            _this.setHitpoints(_this.hitpoints = 10);
        }
        else {
            _this.setHitpoints(_this.getDefinition().getHitpoints());
        }
        return _this;
    }
    NPC.prototype.getSize = function () {
        return this.size();
    };
    NPC.prototype.handleBarricadeTicks = function () {
        if (this.barricadeOnFire && this.barricadeFireTicks > 0) {
            this.barricadeFireTicks--;
            if (this.barricadeFireTicks == 0) {
                if (this.isBarricade()) {
                    Barricades_1.Barricades.checkTile(this.getLocation());
                }
                this.barricadeOnFire = false;
                World_1.World.getRemoveNPCQueue().push(this);
            }
        }
    };
    /**
     * Creates a new {@link NPC}.
     * @param id
     * @param location
     * @return
     */
    NPC.create = function (id, location) {
        var implementationClass = NPC.NPC_IMPLEMENTATION_MAP.get(id);
        if (implementationClass != null) {
            // If this NPC has been implemented by its own class, instantiate that first
            try {
                return new implementationClass(id, location);
            }
            catch (e) {
                console.log(e);
            }
        }
        return new NPC(id, location);
    };
    /**
     * Can this npc walk through other NPCs?
     * @return
     */
    NPC.prototype.canWalkThroughNPCs = function () {
        if (this.pet) {
            return true;
        }
        return false;
    };
    /**
     * Can this npc use pathfinding when following its target?
     *
     * @return
     */
    NPC.prototype.canUsePathFinding = function () {
        return false;
    };
    NPC.prototype.NPC = function (id, position) {
        this.id = id;
        this.spawnPosition = position;
        if (this.getDefinition() == null) {
            this.setHitpoints(10);
        }
        else {
            this.setHitpoints(this.getDefinition().getHitpoints());
        }
    };
    NPC.prototype.onAdd = function () {
    };
    NPC.prototype.onRemove = function () {
    };
    NPC.prototype.isAggressiveTo = function (player) {
        return player.getSkillManager().getCombatLevel() <= (this.getCurrentDefinition().getCombatLevel() * 2)
            || player.getArea() instanceof WildernessArea_1.WildernessArea;
    };
    NPC.prototype.aggressionDistance = function () {
        var attackDistance = CombatFactory_1.CombatFactory.getMethod(this).attackDistance(this);
        return Math.max(attackDistance, 3);
    };
    NPC.prototype.process = function () {
        if (this.getDefinition() != null) {
            this.getTimers().process();
            this.getMovementQueue().process();
            this.movementCoordinator.process();
            this.getCombat().process();
            this.handleBarricadeTicks();
            AreaManager_1.AreaManager.process(this);
            if (this.getCombat().getLastAttack().hasElapsed(20000)
                || this.movementCoordinator.getCoordinateState() == NPCMovementCoordinator_1.CoordinateState.RETREATING) {
                if (this.getDefinition().getHitpoints() > this.hitpoints) {
                    this.setHitpoints(this.hitpoints + (this.getDefinition().getHitpoints() * 0.1));
                    if (this.hitpoints > this.getDefinition().getHitpoints()) {
                        this.setHitpoints(this.getDefinition().getHitpoints());
                    }
                }
            }
        }
    };
    NPC.prototype.getPlayersWithinDistance = function (distance) {
        var e_1, _a;
        var list = [];
        try {
            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                if (player == null) {
                    continue;
                }
                if (player.getPrivateArea() != this.getPrivateArea()) {
                    continue;
                }
                if (player.getLocation().getDistance(this.getLocation()) <= distance) {
                    list.push(player);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return list;
    };
    NPC.prototype.appendDeath = function () {
        if (!this.isDying) {
            TaskManager_1.TaskManager.submit(new NPCDeathTask_1.NPCDeathTask(this));
            this.isDying = true;
        }
    };
    NPC.prototype.getHitpoints = function () {
        return this.hitpoints;
    };
    NPC.prototype.setHitpoints = function (hitpoints) {
        this.hitpoints = hitpoints;
        if (this.hitpoints <= 0)
            this.appendDeath();
        return this;
    };
    NPC.prototype.heal = function (heal) {
        if ((this.hitpoints + heal) > this.getDefinition().getHitpoints()) {
            this.setHitpoints(this.getDefinition().getHitpoints());
            return;
        }
        this.setHitpoints(this.hitpoints + heal);
    };
    NPC.prototype.isNpc = function () {
        return true;
    };
    NPC.prototype.equals = function (other) {
        return other instanceof NPC && other.getIndex() == this.getIndex() && other.getId() == this.getId();
    };
    NPC.prototype.size = function () {
        return this.getCurrentDefinition() == null ? 1 : this.getCurrentDefinition().getSize();
    };
    NPC.prototype.getBaseAttack = function (type) {
        if (type === CombatType_1.CombatType.RANGED) {
            return this.getCurrentDefinition().getStats()[3];
        }
        else if (type === CombatType_1.CombatType.MAGIC) {
            return this.getCurrentDefinition().getStats()[4];
        }
        return this.getCurrentDefinition().getStats()[1];
        // 0 = attack
        // 1 = strength
        // 2 = defence
        // 3 = range
        // 4 = magic
    };
    NPC.prototype.getBaseDefence = function (type) {
        var base = 0;
        switch (type) {
            case CombatType_1.CombatType.MAGIC:
                base = this.getCurrentDefinition().getStats()[13];
                break;
            case CombatType_1.CombatType.MELEE:
                base = this.getCurrentDefinition().getStats()[10];
                break;
            case CombatType_1.CombatType.RANGED:
                base = this.getCurrentDefinition().getStats()[14];
                break;
        }
        // 10,11,12 = melee
        // 13 = magic
        // 14 = range
        return base;
    };
    NPC.prototype.getBaseAttackSpeed = function () {
        return this.getCurrentDefinition().getAttackSpeed();
    };
    NPC.prototype.getAttackAnim = function () {
        return this.getCurrentDefinition().getAttackAnim();
    };
    NPC.prototype.getAttackSound = function () {
        // TODO: need to put proper sounds
        return Sound_1.Sound.IMP_ATTACKING;
    };
    NPC.prototype.getBlockAnim = function () {
        return this.getCurrentDefinition().getDefenceAnim();
    };
    /*
     * Getters and setters
     */
    NPC.prototype.getId = function () {
        if (this.getNpcTransformationId() !== -1) {
            return this.getNpcTransformationId();
        }
        return this.id;
    };
    NPC.prototype.getRealId = function () {
        return this.id;
    };
    NPC.prototype.isVisible = function () {
        return this.visible;
    };
    NPC.prototype.setVisible = function (visible) {
        this.visible = visible;
    };
    NPC.prototype.isDyingFunction = function () {
        return this.isDying;
    };
    NPC.prototype.setDying = function (isDying) {
        this.isDying = isDying;
    };
    NPC.prototype.getOwner = function () {
        return this.owner;
    };
    NPC.prototype.setOwner = function (owner) {
        this.owner = owner;
        return this;
    };
    NPC.prototype.getMovementCoordinator = function () {
        return this.movementCoordinator;
    };
    /**
     * Gets the current Definition, subject to current NPC transformation.
     *
     * @return
     */
    NPC.prototype.getCurrentDefinition = function () {
        if (this.getNpcTransformationId() !== -1) {
            return NpcDefinition_1.NpcDefinition.forId(this.getNpcTransformationId());
        }
        return this.getDefinition();
    };
    /**
     * Gets the base definition for this NPC, regardless of NPC transformation etc.
     *
     * @return
     */
    NPC.prototype.getDefinition = function () {
        return NpcDefinition_1.NpcDefinition.forId(this.id);
    };
    NPC.prototype.isBarricade = function () {
        var _this = this;
        return [5722, 5723, 5724, 5725].some(function (n) { return _this.getId() === n; });
    };
    NPC.prototype.getSpawnPosition = function () {
        return this.spawnPosition;
    };
    NPC.prototype.getHeadIcon = function () {
        return this.headIcon;
    };
    NPC.prototype.setHeadIcon = function (headIcon) {
        this.headIcon = headIcon;
        // getUpdateFlag().flag(Flag.NPC_APPEARANCE);
    };
    NPC.prototype.getCombatMethod = function () {
        // By default, NPCs use Melee combat.
        // This can be overridden by creating a class in entity.impl.npc.impl
        return CombatFactory_1.CombatFactory.MELEE_COMBAT;
    };
    NPC.prototype.clone = function () {
        return NPC.create(this.getId(), this.getSpawnPosition());
    };
    NPC.prototype.getFace = function () {
        return this.face;
    };
    NPC.prototype.setFace = function (face) {
        this.face = face;
    };
    NPC.prototype.isPet = function () {
        return this.pet;
    };
    NPC.prototype.setPet = function (pet) {
        this.pet = pet;
    };
    NPC.prototype.manipulateHit = function (hit) {
        return hit;
    };
    /**
     * Initializes all the NPC implementation classes.
     *
     * @param implementationClasses
     */
    NPC.initImplementations = function (implementationClasses) {
        var e_2, _a, e_3, _b;
        // Add all the implemented NPCs to NPC_IMPLEMENTATION_MAP
        this.NPC_IMPLEMENTATION_MAP = new Map();
        try {
            for (var implementationClasses_1 = __values(implementationClasses), implementationClasses_1_1 = implementationClasses_1.next(); !implementationClasses_1_1.done; implementationClasses_1_1 = implementationClasses_1.next()) {
                var clazz = implementationClasses_1_1.value;
                try {
                    for (var _c = (e_3 = void 0, __values(clazz.getAnnotation(Ids_1.Ids).value())), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var id = _d.value;
                        this.NPC_IMPLEMENTATION_MAP.set(id, clazz);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (implementationClasses_1_1 && !implementationClasses_1_1.done && (_a = implementationClasses_1.return)) _a.call(implementationClasses_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return NPC;
}(Mobile_1.Mobile));
exports.NPC = NPC;
//# sourceMappingURL=NPC.js.map