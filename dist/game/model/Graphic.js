"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graphic = void 0;
var GraphicHeight_1 = require("./GraphicHeight");
var Priority_1 = require("./Priority");
var Graphic = /** @class */ (function () {
    function Graphic(id, delay, height) {
        if (height === void 0) { height = GraphicHeight_1.GraphicHeight.LOW; }
        this.id = id;
        this.delay = delay !== null && delay !== void 0 ? delay : -1;
        this.height = height;
        this.priority = Priority_1.Priority.LOW;
    }
    Graphic.prototype.getId = function () {
        return this.id;
    };
    /**
* Gets the graphic's wait delay.
*
* @return delay.
*/
    Graphic.prototype.getDelay = function () {
        return this.delay;
    };
    /**
     * Gets the graphic's height level to be displayed in.
     *
     * @return The height level.
     */
    Graphic.prototype.getHeight = function () {
        return this.height;
    };
    /**
     * Gets the priority of this graphic.
     *
     * @return the priority.
     */
    Graphic.prototype.getPriority = function () {
        return this.priority;
    };
    return Graphic;
}());
exports.Graphic = Graphic;
//# sourceMappingURL=Graphic.js.map