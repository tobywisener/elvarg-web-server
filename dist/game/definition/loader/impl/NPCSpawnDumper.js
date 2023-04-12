"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCSpawnDumper = void 0;
var DefinitionLoader_1 = require("../DefinitionLoader");
var NpcSpawnDefinition_1 = require("../../NpcSpawnDefinition");
var GameConstants_1 = require("../../../GameConstants");
var Location_1 = require("../../../model/Location");
var fs_extra_1 = require("fs-extra");
var Direction_1 = require("../../../model/Direction");
var NPCSpawnDumper = /** @class */ (function (_super) {
    __extends(NPCSpawnDumper, _super);
    function NPCSpawnDumper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NPCSpawnDumper.prototype.load = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var r, s, path, file, w, builder, lineReader, _d, lineReader_1, lineReader_1_1, line, data, id, x, y, z, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        r = fs_extra_1.default.createReadStream(this.file(), { encoding: 'utf-8' });
                        path = fs_extra_1.default.require('path');
                        file = path.join(GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY, "gay.json");
                        fs_extra_1.default.mkdirSync(path.dirname(file), { recursive: true });
                        w = fs_extra_1.default.createWriteStream(file, { flags: 'a' });
                        builder = JSON.stringify(JSON.stringify({}, null, 2));
                        lineReader = fs_extra_1.default.require('readline').createInterface({ input: r });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _d = true, lineReader_1 = __asyncValues(lineReader);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, lineReader_1.next()];
                    case 3:
                        if (!(lineReader_1_1 = _e.sent(), _a = lineReader_1_1.done, !_a)) return [3 /*break*/, 5];
                        _c = lineReader_1_1.value;
                        _d = false;
                        try {
                            line = _c;
                            s = line;
                            if (s.startsWith("/"))
                                return [3 /*break*/, 4];
                            data = s.split(" ");
                            id = parseInt(data[0]);
                            x = parseInt(data[2]);
                            y = parseInt(data[3]);
                            z = parseInt(data[4]);
                            w.write(JSON.stringify(new NpcSpawnDefinition_1.NpcSpawnDefinition(id, new Location_1.Location(x, y), Direction_1.Direction.SOUTH, 2)));
                            w.write(",");
                            w.write("\n");
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(!_d && !_a && (_b = lineReader_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(lineReader_1)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        r.close();
                        w.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    NPCSpawnDumper.prototype.file = function () {
        return GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY + "dump.txt";
    };
    return NPCSpawnDumper;
}(DefinitionLoader_1.DefinitionLoader));
exports.NPCSpawnDumper = NPCSpawnDumper;
//# sourceMappingURL=NPCSpawnDumper.js.map