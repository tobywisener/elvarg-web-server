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
exports.TimedObjectSpawnTask = void 0;
var ObjectManager_1 = require("../../entity/impl/object/ObjectManager");
var Task_1 = require("../Task");
var TimedObjectSpawnTask = exports.TimedObjectSpawnTask = /** @class */ (function (_super) {
    __extends(TimedObjectSpawnTask, _super);
    function TimedObjectSpawnTask(temp, ticks, action) {
        var _this = _super.call(this) || this;
        _this.temp = temp;
        _this.action = action;
        _this.ticks = ticks;
        return _this;
    }
    TimedObjectSpawnTask.prototype.execute = function () {
        if (TimedObjectSpawnTask.tick === 0) {
            ObjectManager_1.ObjectManager.register(this.temp, true);
        }
        else if (TimedObjectSpawnTask.tick >= this.ticks) {
            ObjectManager_1.ObjectManager.deregister(this.temp, true);
            if (this.action != null) {
                this.action.execute();
            }
            stop();
        }
        TimedObjectSpawnTask.tick++;
    };
    TimedObjectSpawnTask.prototype.onExecute = function () {
    };
    TimedObjectSpawnTask.tick = 0;
    return TimedObjectSpawnTask;
}(Task_1.Task));
//# sourceMappingURL=TimedObjectSpawnTask.js.map