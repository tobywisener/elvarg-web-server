"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredItem = void 0;
var RequiredItem = /** @class */ (function () {
    function RequiredItem(item, Delete) {
        this.item = item;
        this.delete = Delete;
    }
    RequiredItem.prototype.getItem = function () {
        return this.item;
    };
    RequiredItem.prototype.isDelete = function () {
        return this.delete;
    };
    return RequiredItem;
}());
exports.RequiredItem = RequiredItem;
//# sourceMappingURL=RequiredItem.js.map