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
exports.TeleportButton = void 0;
var TeleportButton = exports.TeleportButton = /** @class */ (function () {
    function TeleportButton(menu) {
        var ids = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ids[_i - 1] = arguments[_i];
        }
        this.ids = ids;
        this.menu = menu;
    }
    TeleportButton.init = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(Object.values(TeleportButton)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var b = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(b.ids)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var i = _f.value;
                        TeleportButton.teleports.set(i, b);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    TeleportButton.get = function (buttonId) {
        return TeleportButton.teleports.get(buttonId);
    };
    TeleportButton.HOME = new TeleportButton(-1, 19210, 21741, 19210);
    TeleportButton.TRAINING = new TeleportButton(-1, 1164, 13035, 30064);
    TeleportButton.MINIGAME = new TeleportButton(2, 1167, 13045, 30075);
    TeleportButton.WILDERNESS = new TeleportButton(0, 1170, 13053, 30083);
    TeleportButton.SLAYER = new TeleportButton(-1, 1174, 13061, 30114);
    TeleportButton.CITY = new TeleportButton(-1, 1540, 13079, 30146);
    TeleportButton.SKILLS = new TeleportButton(3, 1541, 13069, 30106);
    TeleportButton.BOSSES = new TeleportButton(1, 7455, 13087, 30138);
    TeleportButton.teleports = new Map();
    return TeleportButton;
}());
TeleportButton.init();
exports.default = TeleportButton;
//# sourceMappingURL=TeleportButton.js.map