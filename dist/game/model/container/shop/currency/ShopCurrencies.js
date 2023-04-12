"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCurrencies = void 0;
var CoinsCurrency_1 = require("./impl/CoinsCurrency");
var BloodMoneyCurrency_1 = require("./impl/BloodMoneyCurrency");
var CastleWarsTicketCurrency_1 = require("./impl/CastleWarsTicketCurrency");
var PointsCurrency_1 = require("./impl/PointsCurrency");
var ShopCurrencies = exports.ShopCurrencies = /** @class */ (function () {
    function ShopCurrencies(currency) {
        this.currency = currency;
    }
    ShopCurrencies.prototype.get = function () {
        return this.currency;
    };
    ShopCurrencies.COINS = (new CoinsCurrency_1.CoinsCurrency());
    ShopCurrencies.BLOOD_MONEY = (new BloodMoneyCurrency_1.BloodMoneyCurrency());
    ShopCurrencies.CASTLE_WARS_TICKET = (new CastleWarsTicketCurrency_1.CastleWarsTicketCurrency());
    ShopCurrencies.POINTS = (new PointsCurrency_1.PointsCurrency());
    return ShopCurrencies;
}());
//# sourceMappingURL=ShopCurrencies.js.map