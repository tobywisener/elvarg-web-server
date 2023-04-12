"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.CharacterListIterator = exports.MobileList = void 0;
var MobileList = /** @class */ (function () {
    function MobileList(capacity) {
        this.slotQueue = [];
        this.capacity = ++capacity;
        this.characters = new Array(capacity);
        this.size = 0;
        for (var i = 1; i <= (capacity - 1); i++) {
            this.slotQueue.push(i);
        }
    }
    MobileList.prototype.add = function (e) {
        if (e === null) {
            return false;
        }
        if (this.isFull()) {
            return false;
        }
        if (!e.isRegistered()) {
            var index = this.slotQueue.shift();
            if (index !== undefined) {
                e.setRegistered(true);
                e.setIndex(index);
                this.characters[index] = e;
                e.onAdd();
                this.size++;
                return true;
            }
        }
        return false;
    };
    MobileList.prototype.removes = function (e) {
        if (e === null) {
            return false;
        }
        if (e.isRegistered() && this.characters[e.getIndex()] != null) {
            e.setRegistered(false);
            this.characters[e.getIndex()] = null;
            this.slotQueue.push(e.getIndex());
            e.onRemove();
            this.size--;
            return true;
        }
        return false;
    };
    MobileList.prototype.contains = function (e) {
        if (e === null) {
            return false;
        }
        return this.characters[e.getIndex()] != null;
    };
    MobileList.prototype.forEach = function (action) {
        var e_1, _a;
        try {
            for (var _b = __values(this.characters), _c = _b.next(); !_c.done; _c = _b.next()) {
                var e = _c.value;
                if (e === null) {
                    continue;
                }
                action(e);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    MobileList.prototype.search = function (filter) {
        var e_2, _a;
        try {
            for (var _b = __values(this.characters), _c = _b.next(); !_c.done; _c = _b.next()) {
                var e = _c.value;
                if (e === null)
                    continue;
                if (filter(e))
                    return e;
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
    MobileList.prototype[Symbol.iterator] = function () {
        var _a, _b, e, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(this.characters), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    e = _b.value;
                    if (e === null) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, e];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    MobileList.prototype.get = function (slot) {
        return this.characters[slot];
    };
    MobileList.prototype.sizeReturn = function () {
        return this.size;
    };
    MobileList.prototype.capacityReturn = function () {
        return this.capacity;
    };
    MobileList.prototype.spaceLeft = function () {
        return this.capacity - this.size;
    };
    MobileList.prototype.isFull = function () {
        return this.size + 1 >= this.capacity;
    };
    MobileList.prototype.stream = function () {
        return this.characters;
    };
    MobileList.prototype.clear = function () {
        this.characters.forEach(this.remove);
        this.characters = [];
        this.size = 0;
    };
    MobileList.prototype.remove = function (item) {
        // implementation of remove method
    };
    return MobileList;
}());
exports.MobileList = MobileList;
var CharacterListIterator = /** @class */ (function () {
    function CharacterListIterator(list) {
        this.lastIndex = -1;
        this.list = list;
    }
    CharacterListIterator.prototype.hasNext = function () {
        return !(this.index + 1 > this.list.capacityReturn());
    };
    CharacterListIterator.prototype.next = function () {
        if (this.index >= this.list.capacityReturn()) {
            throw new Error("There are no elements left to iterate over!");
        }
        this.lastIndex = this.index;
        this.index++;
        return { done: false, value: this.list.characters[this.lastIndex] };
    };
    CharacterListIterator.prototype.remove = function () {
        if (this.lastIndex == -1) {
            throw new Error("This method can only be " + "called once after \"next\".");
        }
        this.list.remove(this.list.characters[this.lastIndex]);
        this.lastIndex = -1;
    };
    return CharacterListIterator;
}());
exports.CharacterListIterator = CharacterListIterator;
//# sourceMappingURL=MobileList.js.map