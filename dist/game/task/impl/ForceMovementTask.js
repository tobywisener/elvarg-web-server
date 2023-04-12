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
exports.ForceMovementTask = void 0;
var Task_1 = require("../Task");
var Location_1 = require("../../model/Location");
var ForceMovementTask = /** @class */ (function (_super) {
    __extends(ForceMovementTask, _super);
    function ForceMovementTask(player, delay, forceM) {
        var _this = _super.call(this, delay, player) || this;
        _this.player = player;
        _this.start = forceM.getStart().clone();
        _this.end = forceM.getEnd().clone();
        player.getCombat().reset();
        player.getMovementQueue().reset();
        player.setForceMovement(forceM);
        return _this;
    }
    ForceMovementTask.prototype.execute = function () {
        var x = this.start.getX() + this.end.getX();
        var y = this.start.getY() + this.end.getY();
        this.player.moveTo(new Location_1.Location(x, y, this.player.getLocation().getZ()));
        this.player.setForceMovement(null);
        this.stop();
    };
    return ForceMovementTask;
}(Task_1.Task));
exports.ForceMovementTask = ForceMovementTask;
//# sourceMappingURL=ForceMovementTask.js.map