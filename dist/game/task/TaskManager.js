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
exports.TaskManager = void 0;
var TaskManager = exports.TaskManager = /** @class */ (function () {
    function TaskManager() {
        throw new Error("This class cannot be instantiated!");
    }
    TaskManager.process = function () {
        try {
            var t = void 0;
            while ((t = TaskManager.pendingTasks.shift()) != null) {
                if (t.isRunning()) {
                    TaskManager.activeTasks.push(t);
                }
            }
            for (var i = 0; i < TaskManager.activeTasks.length; i++) {
                t = TaskManager.activeTasks[i];
                if (!t.tick()) {
                    TaskManager.activeTasks.splice(i, 1);
                    i--;
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    TaskManager.submit = function (task) {
        if (task.isRunning()) {
            return;
        }
        task.setRunning(true);
        if (task.isImmediate()) {
            task.execute();
        }
        TaskManager.pendingTasks.push(task);
    };
    TaskManager.cancelTask = function (keys) {
        var e_1, _a;
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                TaskManager.cancelTask(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    TaskManager.cancelTasks = function (key) {
        try {
            TaskManager.pendingTasks.filter(function (t) { return t.key === key; }).forEach(function (t) { return t.stop(); });
            TaskManager.activeTasks.filter(function (t) { return t.key === key; }).forEach(function (t) { return t.stop(); });
        }
        catch (e) {
            console.error(e);
        }
    };
    TaskManager.getTaskAmount = function () {
        return (TaskManager.pendingTasks.length + TaskManager.activeTasks.length);
    };
    TaskManager.pendingTasks = [];
    TaskManager.activeTasks = [];
    return TaskManager;
}());
//# sourceMappingURL=TaskManager.js.map