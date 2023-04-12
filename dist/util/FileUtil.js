"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
var fs_extra_1 = require("fs-extra");
var zlib = require("zlib");
var FileUtil = /** @class */ (function () {
    function FileUtil() {
    }
    FileUtil.readFile = function (name) {
        try {
            var buffer = fs_extra_1.fs.readFileSync(name);
            return buffer;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    FileUtil.getGZBuffer = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, buffer, gzipInputBuffer, bufferlength, gzip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1.fs.stat(file)];
                    case 1:
                        stats = _a.sent();
                        if (!stats.isFile()) {
                            return [2 /*return*/, null];
                        }
                        buffer = fs_extra_1.fs.readFile(file);
                        gzipInputBuffer = Buffer.alloc(999999);
                        bufferlength = 0;
                        gzip = zlib.createGunzip();
                        gzip.on('data', function (data) {
                            if (bufferlength + data.length > gzipInputBuffer.length) {
                                console.error('Error inflating data.\nGZIP buffer overflow.');
                                gzip.end();
                                return;
                            }
                            data.copy(gzipInputBuffer, bufferlength);
                            bufferlength += data.length;
                        });
                        gzip.on('end', function () {
                            var inflated = gzipInputBuffer.slice(0, bufferlength);
                            if (inflated.length < 10) {
                                return null;
                            }
                            return inflated;
                        });
                        gzip.write(buffer);
                        gzip.end();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileUtil.getDecompressedBuffer = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, decompressed, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, FileUtil.getGZBuffer(file)];
                    case 1:
                        buffer = _a.sent();
                        decompressed = zlib.gunzipSync(buffer);
                        return [2 /*return*/, decompressed];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FileUtil;
}());
exports.FileUtil = FileUtil;
//# sourceMappingURL=FileUtil.js.map