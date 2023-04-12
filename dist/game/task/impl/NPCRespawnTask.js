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
exports.NPCRespawnTask = void 0;
var Task_1 = require("../Task");
var World_1 = require("../../World");
var NPCRespawnTask = /** @class */ (function (_super) {
    __extends(NPCRespawnTask, _super);
    function NPCRespawnTask(npc, ticks) {
        var _this = _super.call(this, ticks) || this;
        _this.npc = npc;
        return _this;
    }
    NPCRespawnTask.prototype.execute = function () {
        // Register the new entity..
        World_1.World.getAddNPCQueue().push(this.npc.clone());
        // Stop the task
        this.stop();
    };
    return NPCRespawnTask;
}(Task_1.Task));
exports.NPCRespawnTask = NPCRespawnTask;
//# sourceMappingURL=NPCRespawnTask.js.map