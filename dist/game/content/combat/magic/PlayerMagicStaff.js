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
exports.PlayerMagicStaff = exports.PlayerMagicStaffEnum = void 0;
var WeaponInterfaces_1 = require("../WeaponInterfaces");
var PlayerMagicStaffEnum;
(function (PlayerMagicStaffEnum) {
    PlayerMagicStaffEnum["AIR"] = "AIR";
    PlayerMagicStaffEnum["WATER"] = "WATER";
    PlayerMagicStaffEnum["EARTH"] = "EARTH";
    PlayerMagicStaffEnum["FIRE"] = "FIRE";
    PlayerMagicStaffEnum["MUD"] = "MUD";
    PlayerMagicStaffEnum["LAVA"] = "LAVA";
})(PlayerMagicStaffEnum = exports.PlayerMagicStaffEnum || (exports.PlayerMagicStaffEnum = {}));
var PlayerMagicStaff = /** @class */ (function () {
    function PlayerMagicStaff() {
        var _a;
        this.playerMagicStaff = (_a = {},
            _a[PlayerMagicStaffEnum.AIR] = { staves: [1381, 1397, 1405], runes: [556] },
            _a[PlayerMagicStaffEnum.WATER] = { staves: [1383, 1395, 1403], runes: [555] },
            _a[PlayerMagicStaffEnum.EARTH] = { staves: [1385, 1399, 1407], runes: [557] },
            _a[PlayerMagicStaffEnum.FIRE] = { staves: [1387, 1393, 1401], runes: [554] },
            _a[PlayerMagicStaffEnum.MUD] = { staves: [6562, 6563], runes: [555, 557] },
            _a[PlayerMagicStaffEnum.LAVA] = { staves: [3053, 3054], runes: [554, 557] },
            _a);
    }
    PlayerMagicStaff.suppressRunes = function (player, runesRequired) {
        var e_1, _a, e_2, _b;
        if (player.weapon === WeaponInterfaces_1.WeaponInterfaces.STAFF) {
            try {
                for (var _c = __values(Object.values(PlayerMagicStaff)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var magicStaff = _d.value;
                    if (player.equipment.containsAny(PlayerMagicStaff[magicStaff].staves)) {
                        try {
                            for (var _e = (e_2 = void 0, __values(PlayerMagicStaff[magicStaff].runes)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var runeId = _f.value;
                                for (var i = 0; i < runesRequired.length; i++) {
                                    if (runesRequired[i] && runesRequired[i].id === runeId) {
                                        runesRequired[i] = null;
                                    }
                                }
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
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return runesRequired;
        }
        return runesRequired;
    };
    return PlayerMagicStaff;
}());
exports.PlayerMagicStaff = PlayerMagicStaff;
//# sourceMappingURL=PlayerMagicStaff.js.map