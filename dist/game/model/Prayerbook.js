"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prayerbook = void 0;
var Prayerbook = /** @class */ (function () {
    function Prayerbook(interfaceId, message) {
        this.interfaceId = interfaceId;
        this.message = message;
    }
    Prayerbook.forId = function (id) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Prayerbook)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var book = _c.value;
                if (book.ordinal() == id) {
                    return book;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Prayerbooks.NORMAL;
    };
    Prayerbook.prototype.getInterfaceId = function () {
        return this.interfaceId;
    };
    Prayerbook.prototype.getMessage = function () {
        return this.message;
    };
    return Prayerbook;
}());
exports.Prayerbook = Prayerbook;
var Prayerbooks = {
    NORMAL: new Prayerbook(5608, "You sense a surge of purity flow through your body!"),
    CURSES: new Prayerbook(32500, "You sense a surge of power flow through your body!")
};
//# sourceMappingURL=Prayerbook.js.map