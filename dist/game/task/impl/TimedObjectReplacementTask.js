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
exports.TimedObjectReplacementTask = void 0;
var ObjectManager_1 = require("../../entity/impl/object/ObjectManager");
var Task_1 = require("../Task");
var TimedObjectReplacementTask = exports.TimedObjectReplacementTask = /** @class */ (function (_super) {
    __extends(TimedObjectReplacementTask, _super);
    function TimedObjectReplacementTask(original, temp, ticks) {
        var _this = _super.call(this) || this;
        _this.sameTile = false;
        _this.original = original;
        _this.temp = temp;
        _this.ticks = ticks;
        _this.sameTile = original.getLocation().equals(temp.getLocation());
        return _this;
    }
    TimedObjectReplacementTask.prototype.execute = function () {
        if (TimedObjectReplacementTask.tick === 0) {
            ObjectManager_1.ObjectManager.deregister(this.original, !this.sameTile);
            ObjectManager_1.ObjectManager.register(this.temp, true);
        }
        else if (TimedObjectReplacementTask.tick >= this.ticks) {
            ObjectManager_1.ObjectManager.deregister(this.temp, !this.sameTile);
            ObjectManager_1.ObjectManager.register(this.original, true);
            stop();
        }
        TimedObjectReplacementTask.tick++;
    };
    TimedObjectReplacementTask.prototype.onExecute = function () {
    };
    TimedObjectReplacementTask.tick = 0;
    return TimedObjectReplacementTask;
}(Task_1.Task));
//# sourceMappingURL=TimedObjectReplacementTask.js.map