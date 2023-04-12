"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationLoop = void 0;
var AnimationLoop = /** @class */ (function () {
    function AnimationLoop(anim, loopDelay) {
        this.anim = anim;
        this.loopDelay = loopDelay;
    }
    AnimationLoop.prototype.getAnim = function () {
        return this.anim;
    };
    AnimationLoop.prototype.getLoopDelay = function () {
        return this.loopDelay;
    };
    return AnimationLoop;
}());
exports.AnimationLoop = AnimationLoop;
//# sourceMappingURL=AnimationLoop.js.map