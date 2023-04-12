"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.God = void 0;
var Gods = {
    ARMADYL: [],
    BANDOS: [],
    SARADOMIN: [],
    ZAMORAK: [],
};
var God = /** @class */ (function () {
    function God(items) {
        this.items = items;
    }
    God.prototype.getItems = function () {
        return this.items;
    };
    return God;
}());
exports.God = God;
//# sourceMappingURL=God.js.map