"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = void 0;
var Animation = exports.Animation = /** @class */ (function () {
    function Animation(id) {
        this.id = id;
        this.delay = 0;
        this.priority = Priority.LOW;
    }
    Animation.prototype.getId = function () {
        return this.id;
    };
    Animation.prototype.getDelay = function () {
        return this.delay;
    };
    Animation.prototype.getPriority = function () {
        return this.priority;
    };
    Animation.DEFAULT_RESET_ANIMATION = new Animation(65535);
    return Animation;
}());
var Priority;
(function (Priority) {
    Priority[Priority["LOW"] = 0] = "LOW";
})(Priority || (Priority = {}));
//# sourceMappingURL=Animation.js.map