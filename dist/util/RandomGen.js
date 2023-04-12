"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGen = void 0;
var RandomGen = /** @class */ (function () {
    function RandomGen() {
        this.random = Math.random();
    }
    RandomGen.prototype.getRandom = function () {
        return this.random;
    };
    RandomGen.prototype.getInclusive = function (min, max) {
        if (max < min) {
            max = min + 1;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    RandomGen.prototype.getInclusiveRange = function (range) {
        return this.getInclusive(0, range);
    };
    RandomGen.prototype.getInclusiveExcludes = function (min, max, exclude) {
        exclude.sort();
        var result;
        var index = exclude.indexOf(result);
        while (index !== -1) {
            result = this.getInclusive(min, max);
            index = exclude.indexOf(result);
        }
        return result;
    };
    RandomGen.prototype.floatRandom = function (max) {
        if (max <= 0) {
            throw new Error("max must be greater than 0");
        }
        return Math.random() * max;
    };
    RandomGen.prototype.randomIndex = function (array) {
        return Math.floor(Math.random() * array.length);
    };
    RandomGen.prototype.randomArray = function (array) {
        return array[this.randomIndex(array)];
    };
    RandomGen.prototype.shuffle = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var index = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[index];
            array[index] = temp;
        }
        return array;
    };
    RandomGen.prototype.success = function (value) {
        return Math.random() <= value;
    };
    return RandomGen;
}());
exports.RandomGen = RandomGen;
//# sourceMappingURL=RandomGen.js.map