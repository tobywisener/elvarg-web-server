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
exports.JSONFilePlayerPersistence = void 0;
var PlayerSave_1 = require("../PlayerSave");
var Misc_1 = require("../../../../../../util/Misc");
var json2typescript_1 = require("json2typescript");
var PasswordUtil_1 = require("../../../../../../util/PasswordUtil");
var java_io_1 = require("java.io");
var path = require("path");
var fs = require("fs");
var gson_1 = require("gson");
var JSONFilePlayerPersistence = exports.JSONFilePlayerPersistence = /** @class */ (function () {
    function JSONFilePlayerPersistence() {
    }
    JSONFilePlayerPersistence.prototype.load = function (username) {
        if (!this.exists(username)) {
            return null;
        }
        var filePath = path.join(JSONFilePlayerPersistence.PATH, username + '.json');
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        var file = new File([fileContent], username + '.json', { type: 'text/json' });
        try {
            var fileReader = new java_io_1.FileReader(file);
            var jsonConverter = new json2typescript_1.JsonConvert();
            var playerSave = jsonConverter.deserializeObject(fileReader, PlayerSave_1.PlayerSave);
            return playerSave;
        }
        catch (e) {
            throw new Error(e);
        }
    };
    JSONFilePlayerPersistence.prototype.save = function (player) {
        var save = PlayerSave_1.PlayerSave.fromPlayer(player);
        var filePath = path.join(JSONFilePlayerPersistence.PATH, player.getUsername() + '.json');
        this.setupDirectory(filePath);
        var builder = new gson_1.GsonBuilder().setPrettyPrinting().create();
        try {
            fs.writeFileSync(filePath, builder.toJson(save));
        }
        catch (e) {
            throw new Error(e);
        }
    };
    JSONFilePlayerPersistence.prototype.exists = function (username) {
        var formattedUsername = Misc_1.Misc.formatPlayerName(username.toLowerCase());
        var filePath = path.join(JSONFilePlayerPersistence.PATH, "".concat(formattedUsername, ".json"));
        return fs.existsSync(filePath);
    };
    JSONFilePlayerPersistence.prototype.encryptPassword = function (plainPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordEncrypt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PasswordUtil_1.PasswordUtil.generatePasswordHashWithSalt(plainPassword)];
                    case 1:
                        passwordEncrypt = _a.sent();
                        return [2 /*return*/, passwordEncrypt];
                }
            });
        });
    };
    JSONFilePlayerPersistence.prototype.checkPassword = function (plainPassword, playerSave) {
        // TODO: Fix password encryption for JSON
        return plainPassword === playerSave.getPasswordHashWithSalt();
    };
    JSONFilePlayerPersistence.prototype.setupDirectory = function (filePath) {
        var dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    };
    JSONFilePlayerPersistence.PATH = './data/saves/characters/';
    JSONFilePlayerPersistence.BUILDER = new json2typescript_1.JsonConvert(json2typescript_1.OperationMode.ENABLE, json2typescript_1.ValueCheckingMode.DISALLOW_NULL);
    return JSONFilePlayerPersistence;
}());
//# sourceMappingURL=JSONFilePlayerPersistence.js.map