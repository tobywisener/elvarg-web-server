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
exports.LightableLog = exports.Firemaking = void 0;
var Animation_1 = require("../../../../model/Animation");
var GameObject_1 = require("../../../../entity/impl/object/GameObject");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var DefaultSkillable_1 = require("./DefaultSkillable");
var ItemOnGroundManager_1 = require("../../../../entity/impl/grounditem/ItemOnGroundManager");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var MovementQueue_1 = require("../../../../model/movement/MovementQueue");
var Skill_1 = require("../../../../model/Skill");
var Misc_1 = require("../../../../../util/Misc");
var ObjectManager_1 = require("../../../../entity/impl/object/ObjectManager");
var Item_1 = require("../../../../model/Item");
var TimedObjectSpawnTask_1 = require("../../../../task/impl/TimedObjectSpawnTask");
var PetHandler_1 = require("../../../PetHandler");
var Cooking_1 = require("./Cooking");
var FireAction = /** @class */ (function () {
    function FireAction(execFunc) {
        this.execFunc = execFunc;
    }
    FireAction.prototype.execute = function () {
        this.execFunc();
    };
    return FireAction;
}());
var FireMakingTask = /** @class */ (function (_super) {
    __extends(FireMakingTask, _super);
    function FireMakingTask(n, player, b, func) {
        var _this = _super.call(this, 3) || this;
        _this.func = func;
        return _this;
    }
    FireMakingTask.prototype.execute = function () {
        this.func();
    };
    return FireMakingTask;
}(Task_1.Task));
var Firemaking = exports.Firemaking = /** @class */ (function (_super) {
    __extends(Firemaking, _super);
    function Firemaking(log, groundLog, bonfire, bonfireAmount) {
        var _this = _super.call(this) || this;
        _this.groundLog = null;
        _this.bonfire = null;
        _this.bonfireAmount = null;
        _this.log = log;
        if (groundLog !== undefined) {
            _this.groundLog = groundLog;
        }
        if (bonfire !== undefined && bonfireAmount !== undefined) {
            _this.bonfire = bonfire;
            _this.bonfireAmount = bonfireAmount;
        }
        return _this;
    }
    /**
     * Checks if we should light a log.
     *
     * @param player
     * @param itemUsed
     * @param itemUsedWith
     * @return
     */
    Firemaking.init = function (player, itemUsed, itemUsedWith) {
        if (itemUsed == ItemIdentifiers_1.ItemIdentifiers.TINDERBOX || itemUsedWith == ItemIdentifiers_1.ItemIdentifiers.TINDERBOX) {
            var logId = itemUsed == ItemIdentifiers_1.ItemIdentifiers.TINDERBOX ? itemUsedWith : itemUsed;
            var log = LightableLog.getForItem(logId);
            if (log) {
                player.getSkillManager().startSkillable(new Firemaking(log));
            }
            return true;
        }
        return false;
    };
    Firemaking.prototype.start = function (player) {
        //Reset movement queue..
        player.getMovementQueue().reset();
        //Send message..
        player.getPacketSender().sendMessage("You attempt to light the logs..");
        //If we're lighting a log from our inventory..
        if (!this.groundLog && !this.bonfire) {
            //Delete logs from inventory..
            player.getInventory().deleteNumber(this.log.getLogId(), 1);
            //Place logs on ground..
            this.groundLog = ItemOnGroundManager_1.ItemOnGroundManager.registers(player, new Item_1.Item(this.log.getLogId(), 1));
        }
        //Face logs if present.
        if (this.groundLog) {
            player.setPositionToFace(this.groundLog.getPosition());
        }
        //Start parent execution task..
        _super.prototype.start.call(this, player);
    };
    Firemaking.prototype.startAnimationLoop = function (player) {
        //If we're not adding to a bonfire
        //Simply do the regular animation.
        if (!this.bonfire) {
            player.performAnimation(Firemaking.LIGHT_FIRE);
            return;
        }
        var animLoop = new FireMakingTask(3, player, true, function () {
            player.performAnimation(Cooking_1.Cooking.ANIMATION); //Cooking anim looks fine for bonfires
        });
        TaskManager_1.TaskManager.submit(animLoop);
        this.getTasks().push(animLoop);
    };
    Firemaking.prototype.onCycle = function (player) {
        PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.FIREMAKING);
    };
    Firemaking.prototype.finishedCycle = function (player) {
        //Handle reset of skill..
        if (this.bonfire) {
            if (--this.bonfireAmount <= 0) {
                this.cancel(player);
            }
        }
        else {
            this.cancel(player);
        }
        //If we're adding to a bonfire or the log on ground still exists... Reward player.
        if (this.bonfire || this.groundLog && ItemOnGroundManager_1.ItemOnGroundManager.exists(this.groundLog)) {
            //If we aren't adding to a bonfire..
            if (!this.bonfire) {
                //The position to create the fire at..
                var pos_1 = this.groundLog.getPosition().clone();
                //Delete logs from ground ..
                ItemOnGroundManager_1.ItemOnGroundManager.deregister(this.groundLog);
                //Create fire..
                TaskManager_1.TaskManager.submit(new TimedObjectSpawnTask_1.TimedObjectSpawnTask(new GameObject_1.GameObject(ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5, pos_1, 10, 0, player.getPrivateArea()), this.log.getRespawnTimer(), new FireAction(function () {
                    if (!ItemOnGroundManager_1.ItemOnGroundManager.getGroundItem(player.getUsername(), ItemIdentifiers_1.ItemIdentifiers.ASHES, pos_1)) {
                        ItemOnGroundManager_1.ItemOnGroundManager.registerLocation(player, new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ASHES), pos_1);
                    }
                })));
                //Step away from the fire..
                if (player.getLocation().equals(pos_1)) {
                    MovementQueue_1.MovementQueue.clippedStep(player);
                }
            }
            else {
                //Delete logs from inventory when using a bonfire..
                player.getInventory().deleteNumber(this.log.getLogId(), 1);
            }
            //Add experience..
            player.getSkillManager().addExperiences(Skill_1.Skill.FIREMAKING, this.log.getExperience());
            //Send message..
            player.getPacketSender().sendMessage("The logs catch fire and begin to burn.");
        }
    };
    Firemaking.prototype.cyclesRequired = function (player) {
        if (this.bonfire) { //Cycle rate for adding to bonfire is constant.
            return 2;
        }
        var cycles = this.log.getCycles() + Misc_1.Misc.getRandom(2);
        cycles -= player.getSkillManager().getMaxLevel(Skill_1.Skill.FIREMAKING) * 0.1;
        if (cycles < 3) {
            cycles = 3;
        }
        return cycles;
    };
    Firemaking.prototype.hasRequirements = function (player) {
        //If we aren't adding logs to a fire - make sure player has a tinderbox..
        if (!this.bonfire) {
            if (!player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX)) {
                player.getPacketSender().sendMessage("You need a tinderbox to light fires.");
                return false;
            }
        }
        //Check if we've burnt the amount of logs on the bonfire.
        if (this.bonfire && this.bonfireAmount <= 0) {
            return false;
        }
        //If we aren't lighting a log on the ground, make sure we have at least one in our inventory.
        if (!this.groundLog) {
            if (!player.getInventory().contains(this.log.getLogId())) {
                player.getPacketSender().sendMessage("You've run out of logs.");
                return false;
            }
        }
        //If we're adding to a bonfire - make sure it still exists.
        //If we're not adding to a fire, make sure no object exists in our position.
        if (this.bonfire) {
            if (!ObjectManager_1.ObjectManager.exists(ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5, this.bonfire.getLocation())) {
                return false;
            }
        }
        else {
            //Check if there's already an object where the player wants to light a fire..
            if ( /*ClippedRegionManager.getObject(player.getPosition()).isPresent()
                    ||*/ObjectManager_1.ObjectManager.existsLocation(player.getLocation())) {
                player.getPacketSender().sendMessage("You cannot light a fire here. Try moving around a bit.");
                return false;
            }
        }
        return _super.prototype.hasRequirements.call(this, player);
    };
    Firemaking.prototype.loopRequirements = function () {
        //We may have run out of logs
        //when using bonfire.
        if (this.bonfire) {
            return true;
        }
        return false;
    };
    Firemaking.prototype.allowFullInventory = function () {
        return true;
    };
    Firemaking.LIGHT_FIRE = new Animation_1.Animation(733);
    return Firemaking;
}(DefaultSkillable_1.DefaultSkillable));
var LightableLog = exports.LightableLog = /** @class */ (function () {
    function LightableLog(logId, level, experience, cycles, respawnTimer) {
        this.logId = logId;
        this.level = level;
        this.experience = experience;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
        this.NORMAL = { logId: 1511, level: 1, experience: 40, cycles: 7, firemakingRespawnTimer: 60 };
        this.ACHEY = { logId: 2862, level: 1, experience: 40, cycles: 7, firemakingRespawnTimer: 65 };
        this.OAK = { logId: 1521, level: 15, experience: 60, cycles: 8, firemakingRespawnTimer: 70 };
        this.WILLOW = { logId: 1519, level: 30, experience: 90, cycles: 9, firemakingRespawnTimer: 80 };
        this.TEAK = { logId: 6333, level: 35, experience: 105, cycles: 9, firemakingRespawnTimer: 80 };
        this.ARTIC_PINE = { logId: 10810, level: 42, experience: 125, cycles: 10, firemakingRespawnTimer: 80 };
        this.MAPLE = { logId: 1517, level: 45, experience: 135, cycles: 10, firemakingRespawnTimer: 85 };
        this.MAHOGANY = { logId: 6332, level: 50, experience: 157, cycles: 11, firemakingRespawnTimer: 85 };
        this.EUCALYPTUS = { logId: 12581, level: 58, experience: 193, cycles: 12, firemakingRespawnTimer: 85 };
        this.YEW = { logId: 1515, level: 60, experience: 202, cycles: 13, firemakingRespawnTimer: 90 };
        this.MAGIC = { logId: 1513, level: 75, experience: 303, cycles: 15, firemakingRespawnTimer: 100 };
        this.REDWOOD = { logId: 19669, level: 90, experience: 350, cycles: 18, firemakingRespawnTimer: 120 };
        LightableLog.lightableLogs[logId] = this;
    }
    LightableLog.prototype.getExperience = function () {
        return this.experience;
    };
    LightableLog.prototype.getLogId = function () {
        return this.logId;
    };
    LightableLog.prototype.getLevel = function () {
        return this.level;
    };
    LightableLog.prototype.getCycles = function () {
        return this.cycles;
    };
    LightableLog.prototype.getRespawnTimer = function () {
        return this.respawnTimer;
    };
    LightableLog.getForItem = function (item) {
        return LightableLog.lightableLogs[item] ? LightableLog.lightableLogs[item] : null;
    };
    LightableLog.lightableLogs = {};
    return LightableLog;
}());
//# sourceMappingURL=Firemaking.js.map