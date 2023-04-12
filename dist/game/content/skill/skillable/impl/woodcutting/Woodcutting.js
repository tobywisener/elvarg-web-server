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
exports.Tree = exports.Woodcutting = void 0;
var GameObject_1 = require("../../../../../entity/impl/object/GameObject");
var TaskManager_1 = require("../../../../../task/TaskManager");
var Sounds_1 = require("../../../../../Sounds");
var PetHandler_1 = require("../../../../PetHandler");
var Task_1 = require("../../../../../task/Task");
var Sound_1 = require("../../../../../Sound");
var Misc_1 = require("../../../../../../util/Misc");
var Equipment_1 = require("../../../../../model/container/impl/Equipment");
var Skill_1 = require("../../../../../model/Skill");
var MapObjects_1 = require("../../../../../entity/impl/object/MapObjects");
var TimedObjectReplacementTask_1 = require("../../../../../task/impl/TimedObjectReplacementTask");
var BirdNest_1 = require("./BirdNest");
var Animation_1 = require("../../../../../model/Animation");
var DefaultSkillable_1 = require("../DefaultSkillable");
var WoodcuttingTask = /** @class */ (function (_super) {
    __extends(WoodcuttingTask, _super);
    function WoodcuttingTask(c, player, b, execFunction) {
        var _this = _super.call(this, 4, true) || this;
        _this.execFunction = execFunction;
        return _this;
    }
    WoodcuttingTask.prototype.execute = function () {
        this.execFunction();
    };
    return WoodcuttingTask;
}(Task_1.Task));
var Woodcutting = /** @class */ (function (_super) {
    __extends(Woodcutting, _super);
    function Woodcutting(treeObject, tree) {
        var _this = _super.call(this) || this;
        _this.treeObject = treeObject;
        _this.tree = tree;
        return _this;
    }
    Woodcutting.prototype.start = function (player) {
        player.getPacketSender().sendMessage("You swing your axe at the tree..");
        _super.prototype.start.call(this, player);
    };
    Woodcutting.prototype.startAnimationLoop = function (player) {
        var _this = this;
        var animLoop = new WoodcuttingTask(4, player, true, function () {
            Sounds_1.Sounds.sendSound(player, Sound_1.Sound.WOODCUTTING_CHOP);
            player.performAnimation(_this.axe.getAnimation());
        });
        TaskManager_1.TaskManager.submit(animLoop);
        var defaultSkillable;
        defaultSkillable.tasks.push(animLoop);
        var soundLoop = new WoodcuttingTask(2, player, false, function () {
            Sounds_1.Sounds.sendSound(player, Sound_1.Sound.WOODCUTTING_CHOP);
        });
        TaskManager_1.TaskManager.submit(soundLoop);
        defaultSkillable.tasks.push(soundLoop);
    };
    Woodcutting.prototype.onCycle = function (player) {
        PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.WOODCUTTING);
    };
    Woodcutting.prototype.finishedCycle = function (player) {
        //Add logs..
        player.getInventory().adds(this.tree.getLogId(), 1);
        player.getPacketSender().sendMessage("You get some logs.");
        //Add exp..
        player.getSkillManager().addExperiences(Skill_1.Skill.WOODCUTTING, this.tree.getXpReward());
        //The chance of getting a bird nest from a tree is 1/256 each time you would normally get a log, regardless of the type of tree.
        if (Misc_1.Misc.getRandom(BirdNest_1.BirdNest.NEST_DROP_CHANCE) == 1) {
            BirdNest_1.BirdNest.handleDropNest(player);
        }
        //Regular trees should always despawn.
        //Multi trees are random.
        if (!this.tree.isMulti() || Misc_1.Misc.getRandom(15) >= 2) {
            //Stop skilling...
            this.cancel(player); // <- chama o método cancel na instância de DefaultSkillable
            //Despawn object and respawn it after a short period of time...
            TaskManager_1.TaskManager.submit(new TimedObjectReplacementTask_1.TimedObjectReplacementTask(this.treeObject, new GameObject_1.GameObject(1343, this.treeObject.getLocation(), 10, 0, player.getPrivateArea()), this.tree.getRespawnTimer()));
        }
    };
    Woodcutting.prototype.cyclesRequired = function (player) {
        var cycles = this.tree.getCycles() + Misc_1.Misc.getRandom(4);
        cycles -= player.getSkillManager().getMaxLevel(Skill_1.Skill.WOODCUTTING) * 0.1;
        cycles -= cycles * this.axe.getSpeed();
        return Math.max(3, Math.floor(cycles));
    };
    Woodcutting.prototype.hasRequirements = function (player) {
        var e_1, _a;
        //Attempt to find an axe..
        var axes;
        try {
            for (var _b = __values(Object.values(Axe)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var a = _c.value;
                if (player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId() == a.getId()
                    || player.getInventory().contains(a.getId())) {
                    //If we have already found an axe,
                    //don't select others that are worse or can't be used
                    if (axes) {
                        if (player.getSkillManager().getMaxLevel(Skill_1.Skill.WOODCUTTING) < a.getRequiredLevel()) {
                            continue;
                        }
                        if (a.getRequiredLevel() < this.axe.getRequiredLevel()) {
                            continue;
                        }
                    }
                    axes = a;
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
        if (!this.axe) {
            player.getPacketSender().sendMessage("You don't have an axe which you can use.");
            return false;
        }
        //Check if we have the required level to cut down this {@code tree} using the {@link Axe} we found..
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.WOODCUTTING) < this.axe.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You don't have an axe which you have the required Woodcutting level to use.");
            return false;
        }
        //Check if we have the required level to cut down this {@code tree}..
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.WOODCUTTING) < this.tree.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You need a Woodcutting level of at least " + this.tree.getRequiredLevel() + " to cut this tree.");
            return false;
        }
        //Finally, check if the tree object remains there.
        //Another player may have cut it down already.
        if (!MapObjects_1.MapObjects.exists(this.treeObject)) {
            return false;
        }
        return this.hasRequirements(player);
    };
    Woodcutting.prototype.loopRequirements = function () {
        return true;
    };
    Woodcutting.prototype.allowFullInventory = function () {
        return false;
    };
    Woodcutting.prototype.getTreeObject = function () {
        return this.treeObject;
    };
    return Woodcutting;
}(DefaultSkillable_1.DefaultSkillable));
exports.Woodcutting = Woodcutting;
var Axe = /** @class */ (function () {
    function Axe(id, level, speed, animation) {
        this.id = id;
        this.requiredLevel = level;
        this.speed = speed;
        this.animation = animation;
    }
    Axe.prototype.getId = function () {
        return this.id;
    };
    Axe.prototype.getRequiredLevel = function () {
        return this.requiredLevel;
    };
    Axe.prototype.getSpeed = function () {
        return this.speed;
    };
    Axe.prototype.getAnimation = function () {
        return this.animation;
    };
    Axe.prototype.isEmpty = function () {
        return this.isEmpty();
    };
    Axe.BRONZE_AXE = new Axe(1351, 1, 0.03, new Animation_1.Animation(879));
    Axe.IRON_AXE = new Axe(1349, 1, 0.05, new Animation_1.Animation(877));
    Axe.STEEL_AXE = new Axe(1353, 6, 0.09, new Animation_1.Animation(875));
    Axe.BLACK_AXE = new Axe(1361, 6, 0.11, new Animation_1.Animation(873));
    Axe.MITHRIL_AXE = new Axe(1355, 21, 0.13, new Animation_1.Animation(871));
    Axe.ADAMANT_AXE = new Axe(1357, 31, 0.16, new Animation_1.Animation(869));
    Axe.RUNE_AXE = new Axe(1359, 41, 0.19, new Animation_1.Animation(867));
    Axe.DRAGON_AXE = new Axe(6739, 61, 0.25, new Animation_1.Animation(2846));
    Axe.INFERNAL = new Axe(13241, 61, 0.3, new Animation_1.Animation(2117));
    return Axe;
}());
var trees = new Map();
(function () {
    var e_2, _a, e_3, _b;
    try {
        for (var _c = __values(Object.values(Tree)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var t = _d.value;
            try {
                for (var _e = (e_3 = void 0, __values(t.objects)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var obj = _f.value;
                    trees.set(obj, t);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_2) throw e_2.error; }
    }
})();
var Tree = /** @class */ (function () {
    function Tree(req, xp, log, obj, cycles, respawnTimer, multi) {
        this.NORMAL = new Tree(1, 25, 1511, [2091, 2890, 1276, 1277, 1278, 1279, 1280, 1282, 1283, 1284, 1285, 1286, 1289, 1290, 1291, 1315, 1316, 1318, 1319, 1330, 1331, 1332, 1365, 1383, 1384, 3033, 3034, 3035, 3036, 3881, 3882, 3883, 5902, 5903, 5904], 10, 8, false);
        this.ACHEY = new Tree(1, 25, 2862, [2023], 13, 9, false);
        this.OAK = new Tree(15, 38, 1521, [1281, 3037, 9734, 1751], 14, 11, true);
        this.WILLOW = new Tree(30, 68, 1519, [1308, 5551, 5552, 5553, 1750, 1758], 15, 14, true);
        this.TEAK = new Tree(35, 85, 6333, [9036], 16, 16, true);
        this.DRAMEN = new Tree(36, 88, 771, [1292], 16, 17, true);
        this.MAPLE = new Tree(45, 100, 1517, [1759, 4674], 17, 18, true);
        this.MAHOGANY = new Tree(50, 125, 6332, [9034], 17, 20, true);
        this.YEW = new Tree(60, 175, 1515, [1309, 1753], 18, 28, true);
        this.MAGIC = new Tree(75, 250, 1513, [1761], 20, 40, true);
        this.REDWOOD = new Tree(90, 380, 19669, [], 22, 43, true);
        this.requiredLevel = req;
        this.xpReward = xp;
        this.logId = log;
        this.objects = obj;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
        this.multi = multi;
    }
    Tree.forObjectId = function (objectId) {
        return trees.get(objectId);
    };
    Tree.prototype.isMulti = function () {
        return this.multi;
    };
    Tree.prototype.getCycles = function () {
        return this.cycles;
    };
    Tree.prototype.getRespawnTimer = function () {
        return this.respawnTimer;
    };
    Tree.prototype.getLogId = function () {
        return this.logId;
    };
    Tree.prototype.getXpReward = function () {
        return this.xpReward;
    };
    Tree.prototype.getRequiredLevel = function () {
        return this.requiredLevel;
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=Woodcutting.js.map