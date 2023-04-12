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
exports.BloodMoneyCurrency = void 0;
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var ItemCurrency_1 = require("../../../../../model/container/shop/currency/impl/ItemCurrency");
var BloodMoneyCurrency = /** @class */ (function (_super) {
    __extends(BloodMoneyCurrency, _super);
    function BloodMoneyCurrency() {
        return _super.call(this, ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY) || this;
    }
    return BloodMoneyCurrency;
}(ItemCurrency_1.ItemCurrency));
exports.BloodMoneyCurrency = BloodMoneyCurrency;
//# sourceMappingURL=BloodMoneyCurrency.js.map