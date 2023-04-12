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
exports.Rock = exports.Pickaxe = exports.Mining = void 0;
var DefaultSkillable_1 = require("./DefaultSkillable");
var Skill_1 = require("../../../../model/Skill");
var Misc_1 = require("../../../../../util/Misc");
var PetHandler_1 = require("../../../PetHandler");
var GameObject_1 = require("../../../../entity/impl/object/GameObject");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var ObjectManager_1 = require("../../../../entity/impl/object/ObjectManager");
var Equipment_1 = require("../../../../model/container/impl/Equipment");
var MapObjects_1 = require("../../../../entity/impl/object/MapObjects");
var Animation_1 = require("../../../../model/Animation");
var TimedObjectReplacementTask_1 = require("../../../../task/impl/TimedObjectReplacementTask");
var MiningTask = /** @class */ (function (_super) {
    __extends(MiningTask, _super);
    function MiningTask(n1, p, b, execFunc) {
        var _this = _super.call(this, n1, p, b) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MiningTask.prototype.execute = function () {
        this.execFunc();
    };
    return MiningTask;
}(Task_1.Task));
var Mining = /** @class */ (function (_super) {
    __extends(Mining, _super);
    function Mining(rockObject, rock) {
        var _this = _super.call(this) || this;
        _this.pickaxe = null;
        _this.rockObject = rockObject;
        _this.rock = rock;
        return _this;
    }
    Mining.prototype.start = function (player) {
        player.getPacketSender().sendMessage("You swing your pickaxe at the rock..");
        _super.prototype.start.call(this, player);
    };
    Mining.prototype.startAnimationLoop = function (player) {
        var _this = this;
        var animLoop = new MiningTask(6, player, true, function () {
            player.performAnimation(_this.pickaxe.getAnimation());
        });
        TaskManager_1.TaskManager.submit(animLoop);
        this.getTasks().push(animLoop);
    };
    Mining.prototype.onCycle = function (player) {
        PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.MINING);
    };
    Mining.prototype.finishedCycle = function (player) {
        if (this.rock.getOreId() > 0) {
            player.getInventory().adds(this.rock.getOreId(), 1);
            player.getPacketSender().sendMessage("You get some ores.");
        }
        if (this.rock.getXpReward() > 0) {
            player.getSkillManager().addExperiences(Skill_1.Skill.MINING, this.rock.getXpReward());
        }
        this.cancel(player);
        if (this.rock == Rock.CASTLE_WARS_ROCKS) {
            var id = this.rockObject.getId() + 1;
            var loc = this.rockObject.getLocation();
            var face = this.rockObject.getFace();
            ObjectManager_1.ObjectManager.deregister(this.rockObject, false);
            if (id == 4439) {
                ObjectManager_1.ObjectManager.deregister(new GameObject_1.GameObject(-1, loc, 10, face, null), true);
                return;
            }
            ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(id, loc, 10, face, null), true);
            return;
        }
        TaskManager_1.TaskManager.submit(new TimedObjectReplacementTask_1.TimedObjectReplacementTask(this.rockObject, new GameObject_1.GameObject(2704, this.rockObject.getLocation(), 10, 0, player.getPrivateArea()), this.rock.getRespawnTimer()));
    };
    Mining.prototype.cyclesRequired = function (player) {
        var cycles = this.rock.getCycles() + Misc_1.Misc.getRandom(4);
        cycles -= player.getSkillManager().getCurrentLevel(Skill_1.Skill.MINING) * 0.1;
        cycles -= cycles * this.pickaxe.getSpeed();
        return Math.max(3, Math.floor(cycles));
    };
    Mining.prototype.hasRequirements = function (player) {
        var e_1, _a;
        //Attempt to find a pickaxe..
        var pickaxe;
        try {
            for (var _b = __values(Object.values(Pickaxe)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var a = _c.value;
                if (player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId() == a.getId()
                    || player.getInventory().contains(a.getId())) {
                    //If we have already found a pickaxe,
                    //don't select others that are worse or can't be used
                    if (pickaxe) {
                        if (player.getSkillManager().getMaxLevel(Skill_1.Skill.MINING) < a.getRequiredLevel()) {
                            continue;
                        }
                        if (a.getRequiredLevel() < pickaxe.getRequiredLevel()) {
                            continue;
                        }
                    }
                    pickaxe = a;
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
        //Check if we found one..
        if (!pickaxe) {
            player.getPacketSender().sendMessage("You don't have a pickaxe which you can use.");
            return false;
        }
        //Check if we have the required level to mine this {@code rock} using the {@link Pickaxe} we found..
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.MINING) < pickaxe.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You don't have a pickaxe which you have the required Mining level to use.");
            return false;
        }
        //Check if we have the required level to mine this {@code rock}..
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.MINING) < this.rock.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You need a Mining level of at least " + this.rock.getRequiredLevel() + " to mine this rock.");
            return false;
        }
        //Finally, check if the rock object remains there.
        //Another player may have mined it already.
        if (!MapObjects_1.MapObjects.exists(this.rockObject)) {
            return false;
        }
        return this.hasRequirements(player);
    };
    Mining.prototype.loopRequirements = function () {
        return true;
    };
    Mining.prototype.allowFullInventory = function () {
        return false;
    };
    Mining.prototype.getTreeObject = function () {
        return this.rockObject;
    };
    return Mining;
}(DefaultSkillable_1.DefaultSkillable));
exports.Mining = Mining;
var Pickaxe = exports.Pickaxe = /** @class */ (function () {
    function Pickaxe(id, req, animation, speed) {
        this.id = id;
        this.requiredLevel = req;
        this.animation = animation;
        this.speed = speed;
    }
    Pickaxe.prototype.getId = function () {
        return this.id;
    };
    Pickaxe.prototype.getRequiredLevel = function () {
        return this.requiredLevel;
    };
    Pickaxe.prototype.getAnimation = function () {
        return this.animation;
    };
    Pickaxe.prototype.getSpeed = function () {
        return this.speed;
    };
    Pickaxe.BRONZE = new Pickaxe(1265, 1, new Animation_1.Animation(625), 0.03);
    Pickaxe.IRON = new Pickaxe(1267, 1, new Animation_1.Animation(626), 0.05);
    Pickaxe.STEEL = new Pickaxe(1269, 6, new Animation_1.Animation(627), 0.09);
    Pickaxe.MITHRIL = new Pickaxe(1273, 21, new Animation_1.Animation(628), 0.13);
    Pickaxe.ADAMANT = new Pickaxe(1271, 31, new Animation_1.Animation(629), 0.16);
    Pickaxe.RUNE = new Pickaxe(1275, 41, new Animation_1.Animation(624), 0.20);
    Pickaxe.DRAGON = new Pickaxe(15259, 61, new Animation_1.Animation(624), 0.25);
    return Pickaxe;
}());
var Rock = exports.Rock = /** @class */ (function () {
    function Rock(ids, requiredLevel, experience, oreId, cycles, respawnTimer) {
        var e_2, _a, e_3, _b;
        this.rocks = new Map();
        this.ids = ids;
        this.requiredLevel = requiredLevel;
        this.experience = experience;
        this.oreId = oreId;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
        try {
            for (var _c = __values(Object.values(Rock)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var t = _d.value;
                try {
                    for (var _e = (e_3 = void 0, __values(t.ids)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var obj = _f.value;
                        this.rocks.set(obj, t);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                this.rocks.set(t.oreId, t);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    Rock.prototype.forObjectId = function (objectId) {
        return this.rocks.get(objectId);
    };
    Rock.prototype.getRespawnTimer = function () {
        return this.respawnTimer;
    };
    Rock.prototype.getRequiredLevel = function () {
        return this.requiredLevel;
    };
    Rock.prototype.getXpReward = function () {
        return this.experience;
    };
    Rock.prototype.getOreId = function () {
        return this.oreId;
    };
    Rock.prototype.getCycles = function () {
        return this.cycles;
    };
    Rock.CLAY = new Rock([9711, 9712, 9713, 15503, 15504, 15505], 1, 5, 434, 11, 2);
    Rock.COPPER = new Rock([7453], 1, 18, 436, 12, 4);
    Rock.TIN = new Rock([7486], 1, 8, 438, 12, 4);
    Rock.IRON = new Rock([7455, 7488], 15, 35, 440, 13, 5);
    Rock.SILVER = new Rock([7457], 20, 40, 442, 14, 7);
    Rock.COAL = new Rock([7456], 30, 50, 453, 15, 7);
    Rock.GOLD = new Rock([9720, 9721, 9722, 11951, 11183, 11184, 11185, 2099], 40, 65, 444, 15, 10);
    Rock.MITHRIL = new Rock([7492, 7459], 50, 80, 447, 17, 11);
    Rock.ADAMANTITE = new Rock([7460], 70, 95, 449, 18, 14);
    Rock.RUNITE = new Rock([14859, 4860, 2106, 2107, 7461], 85, 125, 451, 23, 45);
    Rock.CASTLE_WARS_ROCKS = new Rock([4437, 4438], 1, 0, -1, 12, -1);
    return Rock;
}());
//# sourceMappingURL=Mining.js.map