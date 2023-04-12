"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopDefinition = void 0;
var ShopDefinition = /** @class */ (function () {
    function ShopDefinition() {
        this.name = "";
    }
    ShopDefinition.prototype.getId = function () {
        return this.id;
    };
    ShopDefinition.prototype.getName = function () {
        return this.name;
    };
    ShopDefinition.prototype.getOriginalStock = function () {
        return this.originalStock;
    };
    ShopDefinition.prototype.getCurrency = function () {
        return this.currency;
    };
    return ShopDefinition;
}());
exports.ShopDefinition = ShopDefinition;
//# sourceMappingURL=ShopDefinition.js.map