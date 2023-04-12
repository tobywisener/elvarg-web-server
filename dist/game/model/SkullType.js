"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkullType = void 0;
var SkullType = exports.SkullType = /** @class */ (function () {
    function SkullType(iconId) {
        this.iconId = iconId;
    }
    SkullType.prototype.getIconId = function () {
        return this.iconId;
    };
    SkullType.WHITE_SKULL = new SkullType(0);
    SkullType.RED_SKULL = new SkullType(1);
    return SkullType;
}());
//# sourceMappingURL=SkullType.js.map