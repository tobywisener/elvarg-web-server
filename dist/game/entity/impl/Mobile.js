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
exports.Mobile = void 0;
var Entity_1 = require("../Entity");
var Combat_1 = require("../../content/combat/Combat");
var NPC_1 = require("./npc/NPC");
var Player_1 = require("./player/Player");
var PlayerBot_1 = require("./playerbot/PlayerBot");
var Direction_1 = require("../../model/Direction");
var Flag_1 = require("../../model/Flag");
var Location_1 = require("../../model/Location");
var UpdateFlag_1 = require("../../model/UpdateFlag");
var MovementQueue_1 = require("../../model/movement/MovementQueue");
var Task_1 = require("../../task/Task");
var TaskManager_1 = require("../../task/TaskManager");
var Stopwatch_1 = require("../../../util/Stopwatch");
var TimerRepository_1 = require("../../../util/timers/TimerRepository");
var RegionManager_1 = require("../../collision/RegionManager");
var Misc_1 = require("../../../util/Misc");
var MobileTask = /** @class */ (function (_super) {
    __extends(MobileTask, _super);
    function MobileTask(ticks, execFunc) {
        var _this = _super.call(this, ticks, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MobileTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return MobileTask;
}(Task_1.Task));
var Mobile = /** @class */ (function (_super) {
    __extends(Mobile, _super);
    function Mobile(position) {
        var _this = _super.call(this, position) || this;
        _this.timers = new TimerRepository_1.TimerRepository();
        _this.combat = new Combat_1.Combat(_this);
        _this.movementQueue = new MovementQueue_1.MovementQueue(_this);
        _this.walkingDirection = Direction_1.Direction.NONE;
        _this.runningDirection = Direction_1.Direction.NONE;
        _this.lastCombat = new Stopwatch_1.Stopwatch();
        _this.updateFlag = new UpdateFlag_1.UpdateFlag();
        _this.attributes = new Map();
        _this.npcTransformationId = -1;
        _this.prayerActive = new Array(30);
        _this.curseActive = new Array(20);
        _this.resetMovementQueue = false;
        _this.needsPlacement = false;
        _this.untargetable = false;
        _this.hasVengeance = false;
        _this.specialPercentage = 100;
        _this.specialActivated = false;
        _this.recoveringSpecialAttack = false;
        _this.isTeleporting = false;
        return _this;
    }
    Mobile.prototype.getAttribute = function (name) {
        return this.attributes.get(name);
    };
    Mobile.prototype.setAttribute = function (name, object) {
        this.attributes.set(name, object);
    };
    /**
     * Teleports the character to a target location
     *
     * @param teleportTarget
     * @return
     */
    Mobile.prototype.moveTo = function (teleportTarget) {
        this.getMovementQueue().reset();
        this.setLocation(teleportTarget.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player_1.Player) {
            this.getMovementQueue().handleRegionChange();
        }
        return this;
    };
    Mobile.prototype.smartMove = function (location, radius) {
        var chosen = null;
        var requestedX = location.x;
        var requestedY = location.y;
        var height = location.z;
        while (true) {
            var randomX = Misc_1.Misc.random(requestedX - radius, requestedX + radius);
            var randomY = Misc_1.Misc.random(requestedY - radius, requestedY + radius);
            var randomLocation = new Location_1.Location(randomX, randomY, height);
            if (!RegionManager_1.RegionManager.blocked(randomLocation, null)) {
                chosen = randomLocation;
                break;
            }
        }
        this.getMovementQueue().reset();
        this.setLocation(chosen.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player_1.Player) {
            this.movementQueue.handleRegionChange();
        }
        return this;
    };
    Mobile.prototype.smartMoves = function (bounds) {
        var chosen = null;
        var height = bounds.height;
        while (true) {
            var randomX = Misc_1.Misc.random(bounds.getX(), bounds.getX2());
            var randomY = Misc_1.Misc.random(bounds.getY(), bounds.getY2());
            var randomLocation = new Location_1.Location(randomX, randomY, height);
            if (!RegionManager_1.RegionManager.blocked(randomLocation, null)) {
                chosen = randomLocation;
                break;
            }
        }
        this.getMovementQueue().reset();
        this.setLocation(chosen.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player_1.Player) {
            this.getMovementQueue().handleRegionChange();
        }
        return this;
    };
    /**
     * Resets all flags related to updating.
     */
    Mobile.prototype.resetUpdating = function () {
        this.getUpdateFlag().reset();
        this.walkingDirection = Direction_1.Direction.NONE;
        this.runningDirection = Direction_1.Direction.NONE;
        this.needsPlacement = false;
        this.resetMovementQueue = false;
        this.forcedChat = null;
        this.interactingMobile = null;
        this.positionToFace = null;
        this.animation = null;
        this.graphic = null;
    };
    Mobile.prototype.forceChat = function (message) {
        this.setForcedChat(message);
        this.getUpdateFlag().flag(Flag_1.Flag.FORCED_CHAT);
        return this;
    };
    Mobile.prototype.setMobileInteraction = function (mobile) {
        this.interactingMobile = mobile;
        this.getUpdateFlag().flag(Flag_1.Flag.ENTITY_INTERACTION);
        return this;
    };
    Mobile.prototype.performAnimation = function (animation) {
        if (this.animation != null && animation != null) {
            if (this.animation.getPriority() > animation.getPriority()) {
                return;
            }
        }
    };
    Mobile.prototype.performGraphic = function (graphic) {
        if (this.graphic != null && graphic != null) {
            if (this.graphic.getPriority() > graphic.getPriority()) {
                return;
            }
        }
        this.graphic = graphic;
        this.getUpdateFlag().flag(Flag_1.Flag.GRAPHIC);
    };
    Mobile.prototype.delayedAnimation = function (animation, ticks) {
        var _this = this;
        TaskManager_1.TaskManager.submit(new MobileTask(ticks, function () {
            _this.performAnimation(animation);
        }));
    };
    Mobile.prototype.delayedGraphic = function (graphic, ticks) {
        var _this = this;
        TaskManager_1.TaskManager.submit(new MobileTask(ticks, function () { _this.performGraphic(graphic); }));
    };
    Mobile.prototype.boundaryTiles = function () {
        var size = this.getSize();
        var tiles = new Array(size * size);
        var index = 0;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                tiles[index++] = this.getLocation().transform(x, y);
            }
        }
        return tiles;
    };
    Mobile.prototype.outterTiles = function () {
        var size = this.getSize();
        var tiles = new Array(size * 4);
        var index = 0;
        for (var x = 0; x < size; x++) {
            tiles[index++] = this.getLocation().transform(x, -1);
            tiles[index++] = this.getLocation().transform(x, size);
        }
        for (var y = 0; y < size; y++) {
            tiles[index++] = this.getLocation().transform(-1, y);
            tiles[index++] = this.getLocation().transform(size, y);
        }
        return tiles;
    };
    Mobile.prototype.tiles = function () {
        var size = this.getSize();
        var tiles = new Array(size * size);
        var index = 0;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                tiles[index++] = this.getLocation().transform(x, y);
            }
        }
        return tiles;
    };
    Mobile.prototype.calculateDistance = function (to) {
        var tiles = this.tiles();
        var otherTiles = to.tiles();
        return Location_1.Location.calculateDistance(tiles, otherTiles);
    };
    Mobile.prototype.useProjectileClipping = function () {
        return true;
    };
    Mobile.prototype.heal = function (damage) { };
    ;
    Mobile.prototype.getHitpointsAfterPendingDamage = function () {
        return this.getHitpoints() - this.getCombat().getHitQueue().getAccumulatedDamage();
    };
    /*
     * Getters and setters Also contains methods.
     */
    Mobile.prototype.isTeleportingReturn = function () {
        return this.isTeleporting;
    };
    Mobile.prototype.setTeleporting = function (isTeleporting) {
        this.isTeleporting = isTeleporting;
    };
    Mobile.prototype.getGraphic = function () {
        return this.graphic;
    };
    Mobile.prototype.getAnimation = function () {
        return this.animation;
    };
    /**
     * @return the lastCombat
     */
    Mobile.prototype.getLastCombat = function () {
        return this.lastCombat;
    };
    Mobile.prototype.getPoisonDamage = function () {
        return this.poisonDamage;
    };
    Mobile.prototype.setPoisonDamage = function (poisonDamage) {
        this.poisonDamage = poisonDamage;
    };
    Mobile.prototype.isPoisoned = function () {
        return this.poisonDamage > 0;
    };
    Mobile.prototype.getPositionToFace = function () {
        return this.positionToFace;
    };
    Mobile.prototype.setPositionToFace = function (positionToFace) {
        this.positionToFace = positionToFace;
        this.getUpdateFlag().flag(Flag_1.Flag.FACE_POSITION);
        return this;
    };
    Mobile.prototype.getUpdateFlag = function () {
        return this.updateFlag;
    };
    Mobile.prototype.getMovementQueue = function () {
        return this.movementQueue;
    };
    Mobile.prototype.getCombat = function () {
        return this.combat;
    };
    Mobile.prototype.getInteractingMobile = function () {
        return this.interactingMobile;
    };
    Mobile.prototype.setDirection = function (direction) {
        this.setPositionToFace(this.getLocation().clone().add(direction.getX(), direction.getY()));
    };
    Mobile.prototype.getForcedChat = function () {
        return this.forcedChat;
    };
    Mobile.prototype.setForcedChat = function (forcedChat) {
        this.forcedChat = forcedChat;
        return this;
    };
    Mobile.prototype.getPrayerActive = function () {
        return this.prayerActive;
    };
    Mobile.prototype.setPrayerActives = function (prayerActive) {
        this.prayerActive = prayerActive;
        return this;
    };
    Mobile.prototype.getCurseActive = function () {
        return this.curseActive;
    };
    Mobile.prototype.setCurseActive = function (curseActive) {
        this.curseActive = curseActive;
        return this;
    };
    Mobile.prototype.setPrayerActive = function (id, prayerActive) {
        this.prayerActive[id] = prayerActive;
        return this;
    };
    Mobile.prototype.setCurseActives = function (id, curseActive) {
        this.curseActive[id] = curseActive;
        return this;
    };
    Mobile.prototype.getNpcTransformationId = function () {
        return this.npcTransformationId;
    };
    Mobile.prototype.setNpcTransformationId = function (npcTransformationId) {
        this.npcTransformationId = npcTransformationId;
        this.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        return this;
    };
    Mobile.prototype.decrementHealth = function (hit) {
        if (this.getHitpoints() <= 0) {
            hit.setDamage(0);
            return hit;
        }
        if (hit.getDamage() > this.getHitpoints())
            hit.setDamage(this.getHitpoints());
        if (hit.getDamage() < 0)
            hit.setDamage(0);
        var outcome = this.getHitpoints() - hit.getDamage();
        if (outcome < 0)
            outcome = 0;
        this.setHitpoints(outcome);
        return hit;
    };
    Mobile.prototype.getPrimaryHit = function () {
        return this.primaryHit;
    };
    Mobile.prototype.setPrimaryHit = function (hit) {
        this.primaryHit = hit;
    };
    Mobile.prototype.getSecondaryHit = function () {
        return this.secondaryHit;
    };
    Mobile.prototype.setSecondaryHit = function (hit) {
        this.secondaryHit = hit;
    };
    Mobile.prototype.getWalkingDirection = function () {
        return this.walkingDirection;
    };
    Mobile.prototype.setWalkingDirection = function (walkDirection) {
        this.walkingDirection = walkDirection;
    };
    Mobile.prototype.getRunningDirection = function () {
        return this.runningDirection;
    };
    Mobile.prototype.setRunningDirection = function (runDirection) {
        this.runningDirection = runDirection;
    };
    Mobile.prototype.isResetMovementQueue = function () {
        return this.resetMovementQueue;
    };
    Mobile.prototype.setResetMovementQueue = function (resetMovementQueue) {
        this.resetMovementQueue = resetMovementQueue;
    };
    Mobile.prototype.isRegistered = function () {
        return this.registred;
    };
    Mobile.prototype.setRegistered = function (registered) {
        this.registred = registered;
    };
    Mobile.prototype.isNeedsPlacement = function () {
        return this.needsPlacement;
    };
    Mobile.prototype.setNeedsPlacement = function (needsPlacement) {
        this.needsPlacement = needsPlacement;
    };
    Mobile.prototype.hasVengeanceReturn = function () {
        return this.hasVengeance;
    };
    Mobile.prototype.setHasVengeance = function (hasVengeance) {
        this.hasVengeance = hasVengeance;
    };
    Mobile.prototype.isSpecialActivated = function () {
        return this.specialActivated;
    };
    Mobile.prototype.setSpecialActivated = function (specialActivated) {
        this.specialActivated = specialActivated;
    };
    Mobile.prototype.getSpecialPercentage = function () {
        return this.specialPercentage;
    };
    Mobile.prototype.setSpecialPercentage = function (specialPercentage) {
        this.specialPercentage = specialPercentage;
    };
    Mobile.prototype.decrementSpecialPercentage = function (drainAmount) {
        this.specialPercentage -= drainAmount;
        if (this.specialPercentage < 0) {
            this.specialPercentage = 0;
        }
    };
    Mobile.prototype.incrementSpecialPercentage = function (gainAmount) {
        this.specialPercentage += gainAmount;
        if (this.specialPercentage > 100) {
            this.specialPercentage = 100;
        }
    };
    Mobile.prototype.isRecoveringSpecialAttack = function () {
        return this.recoveringSpecialAttack;
    };
    Mobile.prototype.setRecoveringSpecialAttack = function (recoveringSpecialAttack) {
        this.recoveringSpecialAttack = recoveringSpecialAttack;
    };
    Mobile.prototype.isUntargetable = function () {
        return this.untargetable;
    };
    Mobile.prototype.setUntargetable = function (untargetable) {
        this.untargetable = untargetable;
    };
    Mobile.prototype.inDungeon = function () {
        return false;
    };
    Mobile.prototype.getFollowing = function () {
        return this.following;
    };
    Mobile.prototype.setFollowing = function (following) {
        this.following = following;
    };
    Mobile.prototype.getCombatFollowing = function () {
        return this.combatFollowing;
    };
    Mobile.prototype.setCombatFollowing = function (target) {
        this.combatFollowing = target;
    };
    Mobile.prototype.getIndex = function () {
        return this.index;
    };
    Mobile.prototype.setIndex = function (index) {
        this.index = index;
        return this;
    };
    Mobile.prototype.getLastKnownRegion = function () {
        return this.lastKnownRegion;
    };
    Mobile.prototype.setLastKnownRegion = function (lastKnownRegion) {
        this.lastKnownRegion = lastKnownRegion;
        return this;
    };
    Mobile.prototype.getTimers = function () {
        return this.timers;
    };
    Mobile.prototype.isPlayer = function () {
        return (this instanceof Player_1.Player);
    };
    Mobile.prototype.isPlayerBot = function () {
        return (this instanceof PlayerBot_1.PlayerBot);
    };
    Mobile.prototype.isNpc = function () {
        return (this instanceof NPC_1.NPC);
    };
    Mobile.prototype.getAsPlayer = function () {
        if (!this.isPlayer()) {
            return null;
        }
        return this;
    };
    Mobile.prototype.getAsPlayerBot = function () {
        if (!this.isPlayerBot()) {
            return null;
        }
        return this;
    };
    Mobile.prototype.getAsNpc = function () {
        if (!this.isNpc()) {
            return null;
        }
        return this;
    };
    Mobile.prototype.sendMessage = function (message) {
        var _a, _b;
        if (!this.isPlayer() || this.isPlayerBot()) {
            return;
        }
        (_b = (_a = this.getAsPlayer()) === null || _a === void 0 ? void 0 : _a.getPacketSender()) === null || _b === void 0 ? void 0 : _b.sendMessage(message);
    };
    return Mobile;
}(Entity_1.Entity));
exports.Mobile = Mobile;
//# sourceMappingURL=Mobile.js.map