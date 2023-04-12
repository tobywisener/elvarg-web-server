"use strict";
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
exports.Slayer = void 0;
var SlayerTask_1 = require("../slayer/SlayerTask");
var SlayerMaster_1 = require("../slayer/SlayerMaster");
var Skill_1 = require("../../../model/Skill");
var Misc_1 = require("../../../../util/Misc");
var ActiveSlayerTask_1 = require("./ActiveSlayerTask");
var Slayer = /** @class */ (function () {
    function Slayer() {
    }
    Slayer.assigns = function (player) {
        var master = SlayerMaster_1.SlayerMaster.TURAEL;
        /*for (const m of SlayerMaster.MASTERS) {
          if (!m.canAssign(player)) {
            continue;
          }
          master = m;
        }*/
        return this.assign(player, master);
    };
    Slayer.assign = function (player, master) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (player.getSlayerTask() != null) {
            player.getPacketSender().sendInterfaceRemoval().sendMessage("You already have a Slayer task.");
            return false;
        }
        // Get the tasks we can assign
        var possibleTasks = [];
        var totalWeight = 0;
        try {
            for (var _d = __values(SlayerTask_1.SlayerTask.VALUES), _e = _d.next(); !_e.done; _e = _d.next()) {
                var task = _e.value;
                // Check if player has unlocked this task
                if (!task.isUnlocked(player)) {
                    continue;
                }
                // Check if player has the slayer level required for this task
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.SLAYER) < task.getSlayerLevel()) {
                    continue;
                }
                // Check if this master is able to give out the task
                var correctMaster = false;
                try {
                    for (var _f = (e_2 = void 0, __values(task.getMasters())), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var assignedBy = _g.value;
                        if (master == assignedBy) {
                            correctMaster = true;
                            break;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (!correctMaster) {
                    continue;
                }
                possibleTasks.push(task);
                totalWeight += task.getWeight();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (possibleTasks.length == 0) {
            player.getPacketSender().sendInterfaceRemoval().sendMessage("Nieve was unable to give you a Slayer task. Please try again later.");
            return false;
        }
        // Shuffle them and choose a random one based on the weighting system
        Misc_1.Misc.randomElements(possibleTasks);
        var toAssign = null;
        try {
            for (var possibleTasks_1 = __values(possibleTasks), possibleTasks_1_1 = possibleTasks_1.next(); !possibleTasks_1_1.done; possibleTasks_1_1 = possibleTasks_1.next()) {
                var task = possibleTasks_1_1.value;
                if (Misc_1.Misc.getRandom(totalWeight) <= task.getWeight()) {
                    toAssign = task;
                    break;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (possibleTasks_1_1 && !possibleTasks_1_1.done && (_c = possibleTasks_1.return)) _c.call(possibleTasks_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (toAssign == null) {
            toAssign = possibleTasks[0];
        }
        // Assign the new task
        player.setSlayerTask(new ActiveSlayerTask_1.ActiveSlayerTask(master, toAssign, Misc_1.Misc.randomInclusive(toAssign.getMinimumAmount(), toAssign.getMaximumAmount())));
        return true;
    };
    Slayer.killed = function (player, npc) {
        var e_4, _a, e_5, _b;
        if (player.getSlayerTask() == null) {
            return;
        }
        if (npc.getDefinition() == null || npc.getDefinition().getName() == null) {
            return;
        }
        var isTask = false;
        var killedNpcName = npc.getDefinition().getName().toLowerCase();
        try {
            for (var _c = __values(player.getSlayerTask().getTask().getNpcNames()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var npcName = _d.value;
                if (npcName === killedNpcName) {
                    isTask = true;
                    break;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (!isTask) {
            return;
        }
        // Add experience and decrease task count
        player.getSkillManager().addExperiences(Skill_1.Skill.SLAYER, npc.getDefinition().getHitpoints());
        player.getSlayerTask().setRemaining(player.getSlayerTask().getRemaining() - 1);
        // Handle completion of task
        if (player.getSlayerTask().getRemaining() == 0) {
            var rewardPoints = player.getSlayerTask().getMaster().getBasePoints();
            // Increase consecutive tasks
            player.setConsecutiveTasks(player.getConsecutiveTasks() + 1);
            try {
                // Check for bonus points after completing consecutive tasks
                for (var _e = __values(player.getSlayerTask().getMaster().getConsecutiveTaskPoints()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var consecutive = _f.value;
                    var requiredTasks = consecutive[0];
                    var bonusPoints = consecutive[1];
                    if (player.getConsecutiveTasks() % requiredTasks === 0) {
                        rewardPoints = bonusPoints;
                        break;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_5) throw e_5.error; }
            }
            // Increase points
            player.setSlayerPoints(player.getSlayerPoints() + rewardPoints);
            player.getPacketSender().sendMessage("You have succesfully completed @dre@" + player.getConsecutiveTasks() + "@bla@ slayer tasks in a row.");
            player.getPacketSender().sendMessage("You earned @dre@" + rewardPoints + "@bla@ Slayer " + (rewardPoints == 1 ? "point" : "points") + ", your new total is now @dre@" + player.getSlayerPoints() + ".");
            // Reset task
            player.setSlayerTask(null);
        }
    };
    return Slayer;
}());
exports.Slayer = Slayer;
//# sourceMappingURL=Slayer.js.map