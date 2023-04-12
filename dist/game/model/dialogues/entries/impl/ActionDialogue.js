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
exports.ActionDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var ActionDialogue = /** @class */ (function (_super) {
    __extends(ActionDialogue, _super);
    function ActionDialogue(index, action) {
        var _this = _super.call(this, index) || this;
        _this.action = action;
        return _this;
    }
    ActionDialogue.prototype.send = function (player) {
        this.action.execute();
    };
    return ActionDialogue;
}(Dialogue_1.Dialogue));
exports.ActionDialogue = ActionDialogue;
//# sourceMappingURL=ActionDialogue.js.map