"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsaacRandom = void 0;
var IsaacRandom = /** @class */ (function () {
    function IsaacRandom(seed) {
        var _a;
        this.results = new Array(IsaacRandom.SIZE);
        this.state = new Array(IsaacRandom.SIZE);
        this.count = IsaacRandom.SIZE;
        var length = Math.min(seed.length, this.results.length);
        (_a = this.results).splice.apply(_a, __spreadArray([0, length], __read(seed), false));
        this.init();
    }
    IsaacRandom.prototype.isaac = function () {
        var i, j, x, y;
        this.last += ++this.counter;
        for (i = 0, j = IsaacRandom.SIZE / 2; i < IsaacRandom.SIZE / 2;) {
            x = this.state[i];
            this.accumulator ^= this.accumulator << 13;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 6;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
            x = this.state[i];
            this.accumulator ^= this.accumulator << 2;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 16;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
        }
        for (var j_1 = 0; j_1 < IsaacRandom.SIZE / 2;) {
            var x_1 = this.state[i];
            this.accumulator ^= this.accumulator << 13;
            this.accumulator += this.state[j_1++];
            this.state[i] = y = this.state[(x_1 & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x_1;
            x_1 = this.state[i];
            this.accumulator ^= this.accumulator >>> 6;
            this.accumulator += this.state[j_1++];
            this.state[i] = y = this.state[(x_1 & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x_1;
            x_1 = this.state[i];
            this.accumulator ^= this.accumulator << 2;
            this.accumulator += this.state[j_1++];
            this.state[i] = y = this.state[(x_1 & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x_1;
            x_1 = this.state[i];
            this.accumulator ^= this.accumulator >>> 16;
            this.accumulator += this.state[j_1++];
            this.state[i] = y = this.state[(x_1 & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x_1;
        }
    };
    IsaacRandom.prototype.init = function () {
        var i;
        var a, b, c, d, e, f, g, h;
        a = b = c = d = e = f = g = h = IsaacRandom.GOLDEN_RATIO;
        for (i = 0; i < 4; ++i) {
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
        }
        for (i = 0; i < IsaacRandom.SIZE; i += 8) { /* fill in mem[] with messy stuff */
            a += this.results[i];
            b += this.results[i + 1];
            c += this.results[i + 2];
            d += this.results[i + 3];
            e += this.results[i + 4];
            f += this.results[i + 5];
            g += this.results[i + 6];
            h += this.results[i + 7];
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            this.state[i] = a;
            this.state[i + 1] = b;
            this.state[i + 2] = c;
            this.state[i + 3] = d;
            this.state[i + 4] = e;
            this.state[i + 5] = f;
            this.state[i + 6] = g;
            this.state[i + 7] = h;
        }
        for (i = 0; i < IsaacRandom.SIZE; i += 8) {
            a += this.state[i];
            b += this.state[i + 1];
            c += this.state[i + 2];
            d += this.state[i + 3];
            e += this.state[i + 4];
            f += this.state[i + 5];
            g += this.state[i + 6];
            h += this.state[i + 7];
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            this.state[i] = a;
            this.state[i + 1] = b;
            this.state[i + 2] = c;
            this.state[i + 3] = d;
            this.state[i + 4] = e;
            this.state[i + 5] = f;
            this.state[i + 6] = g;
            this.state[i + 7] = h;
        }
        this.isaac();
    };
    IsaacRandom.prototype.nextInt = function () {
        if (0 == this.count--) {
            this.isaac();
            this.count = IsaacRandom.SIZE - 1;
        }
        return this.results[this.count];
    };
    IsaacRandom.GOLDEN_RATIO = 0x9e3779b9;
    IsaacRandom.LOG_SIZE = 8;
    IsaacRandom.SIZE = 1 << IsaacRandom.LOG_SIZE;
    IsaacRandom.MASK = IsaacRandom.SIZE - 1 << 2;
    return IsaacRandom;
}());
exports.IsaacRandom = IsaacRandom;
//# sourceMappingURL=IsaacRandom.js.map