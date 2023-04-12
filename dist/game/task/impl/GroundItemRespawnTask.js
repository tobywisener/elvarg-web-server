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
exports.GroundItemRespawnTask = void 0;
var ItemOnGroundManager_1 = require("../../entity/impl/grounditem/ItemOnGroundManager");
var Task_1 = require("../Task");
var GroundItemRespawnTask = /** @class */ (function (_super) {
    __extends(GroundItemRespawnTask, _super);
    function GroundItemRespawnTask(item, ticks) {
        var _this = _super.call(this, ticks) || this;
        _this.item = item;
        return _this;
    }
    GroundItemRespawnTask.prototype.execute = function () {
        // Register the new entity..
        ItemOnGroundManager_1.ItemOnGroundManager.register(this.item.clone());
        // Stop the task
        this.stop();
    };
    return GroundItemRespawnTask;
}(Task_1.Task));
exports.GroundItemRespawnTask = GroundItemRespawnTask;
//# sourceMappingURL=GroundItemRespawnTask.js.map