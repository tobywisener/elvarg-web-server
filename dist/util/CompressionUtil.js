"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionUtil = void 0;
var gzip_js_1 = require("gzip-js");
var Bzip2 = require("bzip2");
var CompressionUtil = /** @class */ (function () {
    function CompressionUtil() {
        throw new Error("static-utility classes may not be instantiated.");
    }
    CompressionUtil.gunzip = function (data) {
        return Uint8Array.from((0, gzip_js_1.ungzip)(data));
    };
    CompressionUtil.unbzip2Headerless = function (data, offset, length) {
        var bzip2 = new Uint8Array(length + 2);
        bzip2[0] = 104; // ASCII value for 'h'
        bzip2[1] = 49; // ASCII value for '1'
        bzip2.set(new Uint8Array(data.buffer, offset, length), 2);
        var decompressed = CompressionUtil.unbzip2(bzip2);
        if (decompressed === null) {
            return null;
        }
        return decompressed;
    };
    CompressionUtil.unbzip2 = function (data) {
        var decompressed = Bzip2.decompressFile(String.fromCharCode.apply(null, data));
        return decompressed !== null ? new Uint8Array(decompressed) : null;
    };
    return CompressionUtil;
}());
exports.CompressionUtil = CompressionUtil;
//# sourceMappingURL=CompressionUtil.js.map