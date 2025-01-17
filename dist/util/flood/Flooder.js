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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flooder = void 0;
var Misc_1 = require("../Misc");
var Client_1 = require("../flood/Client");
var AsyncLock = require("async-lock");
var lock = new AsyncLock();
var Flooder = /** @class */ (function () {
    function Flooder() {
        this.clients = new Map();
        this.running = false;
        this.lock = lock;
    }
    Flooder.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            setInterval(this.run.bind(this), 300);
        }
    };
    Flooder.prototype.stop = function () {
        this.running = false;
    };
    Flooder.prototype.login = function (amount) {
        var _this = this;
        this.start();
        var _loop_1 = function (i) {
            try {
                var username_1 = "bot" + this_1.clients.size.toString();
                var password_1 = "bot";
                this_1.lock.acquire("lock", function () {
                    _this.clients.set(username_1, new Client_1.Client(Misc_1.Misc.formatText(username_1), password_1));
                });
                new Client_1.Client(Misc_1.Misc.formatText(username_1), password_1).attemptLogin();
            }
            catch (e) {
                console.error(e);
            }
        };
        var this_1 = this;
        for (var i = 0; i < amount; i++) {
            _loop_1(i);
        }
    };
    Flooder.prototype.run = function () {
        var _this = this;
        if (this.running) {
            try {
                this.lock.acquire("lock", function () {
                    var e_1, _a;
                    var keysToRemove = [];
                    try {
                        for (var _b = __values(_this.clients), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], client = _d[1];
                            try {
                                client.process();
                            }
                            catch (e) {
                                console.error(e);
                                keysToRemove.push(key);
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
                    keysToRemove.forEach(function (key) { return _this.clients.delete(key); });
                });
            }
            catch (e) {
                console.error(e);
            }
            setTimeout(this.run.bind(this), 300);
        }
    };
    return Flooder;
}());
exports.Flooder = Flooder;
//# sourceMappingURL=Flooder.js.map