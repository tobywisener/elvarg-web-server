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
exports.ClanChatRank = void 0;
var ClanChatRank = exports.ClanChatRank = /** @class */ (function () {
    function ClanChatRank(actionMenuId, spriteId) {
        this.actionMenuId = actionMenuId;
        this.spriteId = spriteId;
    }
    ClanChatRank.forId = function (id) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(ClanChatRank)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rank = _c.value;
                if (rank && typeof rank === 'object' && rank.ordinal() === id) {
                    return rank;
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
        return null;
    };
    ClanChatRank.forMenuId = function (id) {
        var e_2, _a;
        try {
            for (var _b = __values(Object.values(ClanChatRank)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rank = _c.value;
                if (rank && typeof rank === 'object' && rank.actionMenuId === id) {
                    return rank;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    ClanChatRank.prototype.getSpriteId = function () {
        return this.spriteId;
    };
    ClanChatRank.FRIEND = new ClanChatRank(-1, 197);
    ClanChatRank.RECRUIT = new ClanChatRank(0, 198);
    ClanChatRank.CORPORAL = new ClanChatRank(1, 199);
    ClanChatRank.SERGEANT = new ClanChatRank(2, 200);
    ClanChatRank.LIEUTENANT = new ClanChatRank(3, 201);
    ClanChatRank.CAPTAIN = new ClanChatRank(4, 202);
    ClanChatRank.GENERAL = new ClanChatRank(5, 203);
    ClanChatRank.OWNER = new ClanChatRank(-1, 204);
    ClanChatRank.STAFF = new ClanChatRank(-1, 203);
    return ClanChatRank;
}());
//# sourceMappingURL=ClanChatRank.js.map