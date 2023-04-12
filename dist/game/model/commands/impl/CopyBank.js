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
exports.CopyBank = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var World_1 = require("../../../World");
var Bank_1 = require("../../../model/container/impl/Bank");
var CopyBank = /** @class */ (function () {
    function CopyBank() {
    }
    CopyBank.prototype.execute = function (player, command, parts) {
        var e_1, _a;
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (plr) {
            for (var i = 0; i < Bank_1.Bank.TOTAL_BANK_TABS; i++) {
                if (player.getBank(i) != null) {
                    player.getBank(i).resetItems();
                }
            }
            for (var i = 0; i < Bank_1.Bank.TOTAL_BANK_TABS; i++) {
                if (plr.getBank(i) != null) {
                    try {
                        for (var _b = (e_1 = void 0, __values(plr.getBank(i).getValidItems())), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var item = _c.value;
                            player.getBank(i).add(item, false);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
        }
    };
    CopyBank.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return CopyBank;
}());
exports.CopyBank = CopyBank;
//# sourceMappingURL=CopyBank.js.map