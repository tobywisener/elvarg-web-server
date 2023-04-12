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
exports.DefaultSkillable = void 0;
var Task_1 = require("../../../../task/Task");
var Animation_1 = require("../../../../model/Animation");
var TaskManager_1 = require("../../../../task/TaskManager");
var DefaultSkillableTask = /** @class */ (function (_super) {
    __extends(DefaultSkillableTask, _super);
    function DefaultSkillableTask(delay, player, c) {
        var _this = _super.call(this, 4, true) || this;
        _this.player = player;
        _this.c = c;
        return _this;
    }
    DefaultSkillableTask.prototype.execute = function () { };
    return DefaultSkillableTask;
}(Task_1.Task));
var DefaultSkillable = /** @class */ (function () {
    function DefaultSkillable() {
        this.tasks = [];
    }
    DefaultSkillable.prototype.cancel = function (player) {
        var e_1, _a;
        // Stop all tasks..
        var i = this.tasks.values();
        try {
            for (var i_1 = __values(i), i_1_1 = i_1.next(); !i_1_1.done; i_1_1 = i_1.next()) {
                var task = i_1_1.value;
                task.stop();
                this.tasks.splice(this.tasks.indexOf(task), 1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (i_1_1 && !i_1_1.done && (_a = i_1.return)) _a.call(i_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Reset animation..
        player.performAnimation(Animation_1.Animation.DEFAULT_RESET_ANIMATION);
    };
    DefaultSkillable.prototype.hasRequirements = function (player) {
        // Check inventory slots..
        if (!this.allowFullInventory()) {
            if (player.getInventory().getFreeSlots() === 0) {
                player.getInventory().full();
                return false;
            }
        }
        // Check if busy..
        if (player.busy()) {
            return false;
        }
        return true;
    };
    DefaultSkillable.prototype.startAnimationLoop = function (player) { };
    DefaultSkillable.prototype.cyclesRequired = function (player) {
        return 0;
    };
    DefaultSkillable.prototype.onCycle = function (player) { };
    DefaultSkillable.prototype.finishedCycle = function (player) { };
    DefaultSkillable.prototype.getTasks = function () {
        return Array.from(this.tasks);
    };
    DefaultSkillable.prototype.start = function (player) {
        var _this = this;
        this.startAnimationLoop(player);
        // Start main process task..
        var task = new DefaultSkillableTask(1, player, true);
        var cycle = 0;
        task.execute = function () {
            // Make sure we still have the requirements to keep skilling..
            if (_this.loopRequirements()) {
                if (!_this.hasRequirements(player)) {
                    _this.cancel(player);
                    return;
                }
            }
            // Every cycle, call the method..
            _this.onCycle(player);
            // Sequence the skill, reward players
            // with items once the right amount
            // of cycles have passed.
            if (cycle++ >= _this.cyclesRequired(player)) {
                _this.finishedCycle(player);
                cycle = 0;
            }
        };
        // Submit it..
        TaskManager_1.TaskManager.submit(task);
        // Add to our list of tasks..
        this.tasks.push(task);
    };
    return DefaultSkillable;
}());
exports.DefaultSkillable = DefaultSkillable;
//# sourceMappingURL=DefaultSkillable.js.map