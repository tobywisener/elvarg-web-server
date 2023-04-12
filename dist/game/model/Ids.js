"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ids = void 0;
var Ids = /** @class */ (function () {
    function Ids() {
        this.ids = [];
    }
    Ids.prototype.Ids = function (target, key) {
        var value = target[key];
        Object.defineProperty(target, key, {
            get: function () { return value; },
            set: function (newValue) {
                value = newValue;
            }
        });
    };
    return Ids;
}());
exports.Ids = Ids;
//# sourceMappingURL=Ids.js.map