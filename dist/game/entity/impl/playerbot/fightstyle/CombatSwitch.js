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
exports.CombatSwitch = void 0;
var PrayerHandler_1 = require("../../../../content/PrayerHandler");
var ItemInSlot_1 = require("../../../../model/ItemInSlot");
var EquipPacketListener_1 = require("../../../../../net/packet/impl/EquipPacketListener");
'';
var CombatSwitch = /** @class */ (function () {
    function CombatSwitch(switchItemIds, prayerData) {
        this.switchItemIds = switchItemIds;
        if (prayerData != null) {
            this.prayers = prayerData;
        }
        else {
            this.prayers = [];
        }
        this.instant = false;
    }
    CombatSwitch.prototype.shouldPerform = function (playerBot, enemy) {
        throw new Error("Method not implemented.");
    };
    CombatSwitch.prototype.stopAfter = function () {
        throw new Error("Method not implemented.");
    };
    CombatSwitch.prototype.doSwitch = function (playerBot) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(this.prayers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var prayer = _d.value;
                PrayerHandler_1.PrayerHandler.activatePrayer(playerBot, prayer);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(this.switchItemIds), _f = _e.next(); !_f.done; _f = _e.next()) {
                var itemId = _f.value;
                var item = ItemInSlot_1.ItemInSlot.getFromInventory(itemId, playerBot.getInventory());
                if (item == null) {
                    continue;
                }
                EquipPacketListener_1.EquipPacketListener.equipFromInventory(playerBot, item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    CombatSwitch.prototype.perform = function (playerBot, enemy) {
        this.doSwitch(playerBot);
        this.performAfterSwitch(playerBot, enemy);
    };
    return CombatSwitch;
}());
exports.CombatSwitch = CombatSwitch;
//# sourceMappingURL=CombatSwitch.js.map