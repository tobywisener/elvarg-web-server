"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialogue = void 0;
var Dialogue = /** @class */ (function () {
    function Dialogue(index) {
        this.index = index;
    }
    Dialogue.prototype.getIndex = function () {
        return this.index;
    };
    Dialogue.prototype.getContinueAction = function () {
        return this.continueAction;
    };
    Dialogue.prototype.setContinueAction = function (action) {
        this.continueAction = action;
    };
    return Dialogue;
}());
exports.Dialogue = Dialogue;
//# sourceMappingURL=Dialogue.js.map