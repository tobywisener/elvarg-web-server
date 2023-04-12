"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSlayerTask = void 0;
var ActiveSlayerTask = /** @class */ (function () {
    function ActiveSlayerTask(master, task, amount) {
        this.master = master;
        this.task = task;
        this.remaining = amount;
    }
    ActiveSlayerTask.prototype.getMaster = function () {
        return this.master;
    };
    ActiveSlayerTask.prototype.getTask = function () {
        return this.task;
    };
    ActiveSlayerTask.prototype.setRemaining = function (amount) {
        this.remaining = amount;
    };
    ActiveSlayerTask.prototype.getRemaining = function () {
        return this.remaining;
    };
    return ActiveSlayerTask;
}());
exports.ActiveSlayerTask = ActiveSlayerTask;
//# sourceMappingURL=ActiveSlayerTask.js.map