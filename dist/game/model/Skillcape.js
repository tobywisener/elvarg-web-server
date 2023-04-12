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
exports.Skillcape = void 0;
var Animation_1 = require("./Animation");
var Item_1 = require("./Item");
var Graphic_1 = require("./Graphic");
var Skillcape = exports.Skillcape = /** @class */ (function () {
    function Skillcape(itemId, animationId, graphicId, delay) {
        this.item = itemId.map(function (id) { return new Item_1.Item(id, 1); });
        this.animation = new Animation_1.Animation(animationId);
        this.graphic = new Graphic_1.Graphic(graphicId, 0);
        this.delay = delay;
    }
    Skillcape.forId = function (id) {
        return Skillcape.dataMap.get(id);
    };
    Skillcape.prototype.getAnimation = function () {
        return this.animation;
    };
    Skillcape.prototype.getGraphic = function () {
        return this.graphic;
    };
    Skillcape.prototype.getDelay = function () {
        return this.delay;
    };
    Skillcape.ATTACK = new Skillcape([9747, 9748, 10639], 4959, 823, 7);
    Skillcape.DEFENCE = new Skillcape([9753, 9754, 10641], 4961, 824, 10);
    Skillcape.STRENGTH = new Skillcape([9750, 9751, 10640], 4981, 828, 25);
    Skillcape.CONSTITUTION = new Skillcape([9768, 9769, 10647], 14242, 2745, 12);
    Skillcape.RANGED = new Skillcape([9756, 9757, 10642], 4973, 832, 12);
    Skillcape.PRAYER = new Skillcape([9759, 9760, 10643], 4979, 829, 15);
    Skillcape.MAGIC = new Skillcape([9762, 9763, 10644], 4939, 813, 6);
    Skillcape.COOKING = new Skillcape([9801, 9802, 10658], 4955, 821, 36);
    Skillcape.WOODCUTTING = new Skillcape([9807, 9808, 10660], 4957, 822, 25);
    Skillcape.FLETCHING = new Skillcape([9783, 9784, 10652], 4937, 812, 20);
    Skillcape.FISHING = new Skillcape([9798, 9799, 10657], 4951, 819, 19);
    Skillcape.FIREMAKING = new Skillcape([9804, 9805, 10659], 4975, 831, 14);
    Skillcape.CRAFTING = new Skillcape([9780, 9781, 10651], 4949, 818, 15);
    Skillcape.SMITHING = new Skillcape([9795, 9796, 10656], 4943, 815, 23);
    Skillcape.MINING = new Skillcape([9792, 9793, 10655], 4941, 814, 8);
    Skillcape.HERBLORE = new Skillcape([9774, 9775, 10649], 4969, 835, 16);
    Skillcape.AGILITY = new Skillcape([9771, 9772, 10648], 4977, 830, 8);
    Skillcape.THIEVING = new Skillcape([9777, 9778, 10650], 4965, 826, 16);
    Skillcape.SLAYER = new Skillcape([9786, 9787, 10653], 4967, 1656, 8);
    Skillcape.FARMING = new Skillcape([9810, 9811, 10661], 4963, -1, 16);
    Skillcape.RUNECRAFTING = new Skillcape([9765, 9766, 10645], 4947, 817, 10);
    Skillcape.CONSTRUCTION = new Skillcape([9789, 9790, 10654], 4953, 820, 16);
    Skillcape.HUNTER = new Skillcape([9948, 9949, 10646], 5158, 907, 14);
    Skillcape.QUEST_POINT = new Skillcape([9813, 9814, 10662], 4945, 816, 19);
    Skillcape.dataMap = new Map();
    (function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(Object.values(Skillcape)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var data = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(data.item)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var item = _f.value;
                        Skillcape.dataMap.set(item.getId(), data);
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
    })();
    return Skillcape;
}());
//# sourceMappingURL=Skillcape.js.map