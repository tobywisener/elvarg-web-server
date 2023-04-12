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
exports.Misc = void 0;
var decimal_format_1 = require("decimal-format");
var RandomGen_1 = require("../util/RandomGen");
var securerandom_1 = require("securerandom");
var js_joda_1 = require("js-joda");
var fs_extra_1 = require("fs-extra");
var path = require("path");
var path_1 = require("path");
var zlib = require("zlib");
var moment_1 = require("moment");
var Misc = exports.Misc = /** @class */ (function () {
    function Misc() {
    }
    Misc.getTicks = function (seconds) {
        return (seconds / 0.6);
    };
    Misc.getSeconds = function (ticks) {
        return (ticks * 0.6);
    };
    Misc.getRandom = function (length) {
        return Math.floor(Math.random() * (length + 1));
    };
    Misc.getRandomDouble = function (length) {
        return Math.random() * length;
    };
    Misc.getRandomInt = function () {
        return Math.floor(Math.random() * (length + 1));
    };
    Misc.getCurrentServerTime = function () {
        this.zonedDateTime = js_joda_1.ZonedDateTime.now();
        var hour = this.zonedDateTime.hour();
        var hourPrefix = hour < 10 ? "0" + hour + "" : "" + hour + "";
        var minute = this.zonedDateTime.minute();
        var minutePrefix = minute < 10 ? "0" + minute + "" : "" + minute + "";
        return "" + hourPrefix + ":" + minutePrefix + "";
    };
    Misc.getTimePlayed = function (totalPlayTime) {
        var sec = Math.floor(totalPlayTime / 1000);
        var h = Math.floor(sec / 3600);
        var m = Math.floor(sec / 60 % 60);
        var s = sec % 60;
        return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    };
    Misc.getHoursPlayed = function (totalPlayTime) {
        var sec = Math.floor(totalPlayTime / 1000);
        var h = Math.floor(sec / 3600);
        return (h < 10 ? "0" + h : h) + "h";
    };
    Misc.getMinutesPassed = function (t) {
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor(((t - seconds) / 1000) / 60);
        return minutes;
    };
    Misc.concat = function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        var c = new Array(aLen + bLen);
        c.push.apply(c, __spreadArray(__spreadArray([], __read(a), false), __read(b), false));
        return c;
    };
    Misc.getCloseRandomPlayer = function (plrs) {
        var index = Misc.getRandom(plrs.length - 1);
        if (index > 0) {
            return plrs[index];
        }
        return null;
    };
    Misc.getDirection = function (x, y) {
        for (var i = 0; i < 8; i++) {
            if (Misc.DIRECTIONS[i][0] == x && Misc.DIRECTIONS[i][1] == y)
                return i;
        }
        return -1;
    };
    Misc.ucFirst = function (str) {
        str = str.toLowerCase();
        if (str.length > 1) {
            str = str.substring(0, 1).toUpperCase() + str.substring(1);
        }
        else {
            return str.toUpperCase();
        }
        return str;
    };
    Misc.format = function (num) {
        return num.toLocaleString();
    };
    Misc.formatText = function (s) {
        for (var i = 0; i < s.length; i++) {
            if (i == 0) {
                s = "".concat(s.charAt(0).toUpperCase()).concat(s.substring(1));
            }
            if (!/[a-zA-Z0-9]/.test(s.charAt(i))) {
                if (i + 1 < s.length) {
                    s = "".concat(s.substring(0, i + 1)).concat(s.charAt(i + 1).toUpperCase()).concat(s.substring(i + 2));
                }
            }
        }
        return s.replace("_", " ");
    };
    Misc.getTotalAmount = function (j) {
        if (j >= 10000 && j < 1000000) {
            return (j / 1000) + "K";
        }
        else if (j >= 1000000 && j <= Number.MAX_SAFE_INTEGER) {
            return (j / 1000000) + "M";
        }
        else {
            return "" + j;
        }
    };
    Misc.formatPlayerName = function (str) {
        return this.formatText(str);
    };
    Misc.insertCommasToNumber = function (number) {
        return number.length < 4 ? number : this.insertCommasToNumber(number.substring(0, number.length - 3)) + "," + number.substring(number.length - 3, number.length);
    };
    Misc.textUnpack = function (packedData, size) {
        var decodeBuf = new Array(4096);
        var idx = 0, highNibble = -1;
        for (var i = 0; i < size * 2; i++) {
            var val = packedData[i / 2] >> (4 - 4 * (i % 2)) & 0xf;
            if (highNibble == -1) {
                if (val < 13) {
                    decodeBuf[idx++] = parseInt(Misc.xlateTable[val]);
                }
                else {
                    highNibble = val;
                }
            }
            else {
                decodeBuf[idx++] = parseInt(Misc.xlateTable[((highNibble << 4) + val) - 195]);
                highNibble = -1;
            }
        }
        return new TextDecoder().decode(new Uint8Array(decodeBuf.slice(0, idx)));
    };
    Misc.anOrAr = function (s) {
        s = s.toLowerCase();
        if (s === "anchovies" || s === "soft clay" || s === "cheese" || s === "ball of wool" || s === "spice" || s === "steel nails" || s === "snape grass" || s === "coal") {
            return "some";
        }
        if (s.startsWith("a") || s.startsWith("e") || s.startsWith("i") || s.startsWith("o") || s.startsWith("u")) {
            return "an";
        }
        return "a";
    };
    Misc.anOrAs = function (s) {
        s = s.toLowerCase();
        if (s === "anchovies" || s === "soft clay" || s === "cheese" || s === "ball of wool" || s === "spice" || s === "steel nails" || s === "snape grass" || s === "coal") {
            return "some";
        }
        if (s.startsWith("a") || s.startsWith("e") || s.startsWith("i") || s.startsWith("o") || s.startsWith("u")) {
            return "an";
        }
        return "a";
    };
    Misc.textPack = function (text) {
        if (text.length > 80) {
            text = text.substring(0, 80);
        }
        var packedData = [];
        text = text.toLowerCase();
        var carryOverNibble = -1;
        var ofs = 0;
        for (var idx = 0; idx < text.length; idx++) {
            var c = text.charAt(idx);
            var tableIdx = 0;
            for (var i = 0; i < Misc.xlateTable.length; i++) {
                if (c === Misc.xlateTable[i]) {
                    tableIdx = i;
                    break;
                }
            }
            if (tableIdx > 12) {
                tableIdx += 195;
            }
            if (carryOverNibble === -1) {
                if (tableIdx < 13) {
                    carryOverNibble = tableIdx;
                }
                else {
                    packedData[ofs++] = tableIdx;
                }
            }
            else if (tableIdx < 13) {
                packedData[ofs++] = (carryOverNibble << 4) + tableIdx;
                carryOverNibble = -1;
            }
            else {
                packedData[ofs++] = (carryOverNibble << 4) + (tableIdx >> 4);
                carryOverNibble = tableIdx & 0xf;
            }
        }
        if (carryOverNibble != -1) {
            packedData[ofs++] = carryOverNibble << 4;
        }
        return packedData;
    };
    Misc.anOrA = function (s) {
        s = s.toLowerCase();
        if (s.toLowerCase() === "anchovies" || s.toLowerCase() === "soft clay" || s.toLowerCase() === "cheese" || s.toLowerCase() === "ball of wool" || s.toLowerCase() === "spice" || s.toLowerCase() === "steel nails" || s.toLowerCase() === "snape grass" || s.toLowerCase() === "coal")
            return "some";
        if (s.startsWith("a") || s.startsWith("e") || s.startsWith("i") || s.startsWith("o") || s.startsWith("u"))
            return "an";
        return "a";
    };
    Misc.getClasses = function (packageName) {
        var classList = [];
        // Add logic to get classes from package name
        return classList;
    };
    Misc.findClasses = function (directory, packageName) {
        var e_1, _a;
        var classes = [];
        var files = fs_extra_1.fs.readdirSync(directory);
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var file = files_1_1.value;
                var filePath = path.join(directory, file);
                var stat = fs_extra_1.fs.lstatSync(filePath);
                if (stat.isDirectory()) {
                    classes = classes.concat(Misc.findClasses(filePath, packageName + '.' + file));
                }
                else if (file.endsWith('.class')) {
                    classes.push(require(packageName + '.' + file.substring(0, file.length - 6)));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return classes;
    };
    Misc.removeSpaces = function (s) {
        return s.replace(/ /g, "");
    };
    Misc.getMinutesElapsed = function (minute, hour, day, year) {
        var i = new Date();
        if (i.getFullYear() == year) {
            if (i.getDate() == day) {
                if (hour == i.getHours()) {
                    return i.getMinutes() - minute;
                }
                return (i.getHours() - hour) * 60 + (59 - i.getMinutes());
            }
            var ela_1 = (i.getDate() - day) * 24 * 60 * 60;
            return ela_1 > 2147483647 ? 2147483647 : ela_1;
        }
        var ela = Misc.getElapsed(day, year) * 24 * 60 * 60;
        return ela > 2147483647 ? 2147483647 : ela;
    };
    Misc.readFile = function (s) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var fis = new FileReader();
                                fis.readAsArrayBuffer(s);
                                fis.onloadend = function () {
                                    var fc = new Uint8Array(fis.result);
                                    resolve(fc);
                                };
                                fis.onerror = reject;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        console.log("FILE : " + s.name + " missing.");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Misc.isWeekend = function () {
        var day = new Date().getDay();
        return (day === 0) || (day === 6) || (day === 7);
    };
    Misc.randomTypeOfList = function (list) {
        return list[Math.floor(Math.random() * list.length)];
    };
    Misc.randomInclusive = function (min, max) {
        return Math.min(min, max) + Math.floor(Math.random() * (Math.max(min, max) - Math.min(min, max) + 1));
    };
    Misc.getBuffers = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer_1, inflated, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.fs.readFile(filePath)];
                    case 1:
                        buffer_1 = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                zlib.gunzip(buffer_1, function (err, result) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(result);
                                    }
                                });
                            })];
                    case 2:
                        inflated = _a.sent();
                        if (inflated.length < 10) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, new Uint8Array(inflated)];
                    case 3:
                        e_3 = _a.sent();
                        console.log("Error reading file \"".concat(filePath, "\":"), e_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Misc.getFormattedPlayTime = function (player) {
        var now = new Date().getTime();
        var creationDate = player.getCreationDate().getTime();
        var elapsed = now - creationDate;
        var secondsInMilli = 1000;
        var minutesInMilli = secondsInMilli * 60;
        var hoursInMilli = minutesInMilli * 60;
        var daysInMilli = hoursInMilli * 24;
        var elapsedDays = Math.floor(elapsed / daysInMilli);
        var elapsedHours = Math.floor((elapsed % daysInMilli) / hoursInMilli);
        var elapsedMinutes = Math.floor((elapsed % hoursInMilli) / minutesInMilli);
        var elapsedSeconds = Math.floor((elapsed % minutesInMilli) / secondsInMilli);
        return "".concat(elapsedDays, " day(s) : ").concat(elapsedHours, " hour(s) : ").concat(elapsedMinutes, " minute(s) : ").concat(elapsedSeconds, " second(s)");
    };
    Misc.hexToInt = function (data) {
        var value = 0;
        var n = 1000;
        for (var i = 0; i < data.length; i++) {
            var num = (data[i] & 0xFF) * n;
            value += num;
            if (n > 1) {
                n = n / 1000;
            }
        }
        return value;
    };
    Misc.delta = function (a, b) {
        return { x: b.x - a.x, y: b.y - a.y };
    };
    // Picks a random element out of any array type
    Misc.randomElements = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    // Picks a random element out of any list type
    Misc.randomElement = function (list) {
        return list[Math.floor(Math.random() * list.length)];
    };
    Misc.blockedWord = function (string) {
        var e_4, _a;
        var BLOCKED_WORDS = [];
        try {
            for (var _b = __values(Misc.BLOCKED_WORDS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                if (string.includes(s)) {
                    return true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    Misc.capitalizeWords = function (name) {
        var builder = "";
        var words = name.split(" ");
        var i; // mover a declaração da variável i para fora do loop
        for (i = 0; i < words.length; ++i) {
            if (i > 0) {
                builder += " ";
            }
            builder += words[i][0].toUpperCase() + words[i].substring(1);
        }
        return builder;
    };
    Misc.capitalize = function (name) {
        if (name.length < 1) {
            return "";
        }
        var builder = "";
        builder += name[0].toUpperCase() + name.substring(1).toLowerCase();
        return builder;
    };
    Misc.getVowelFormat = function (name) {
        var letter = name.charAt(0);
        var vowel = letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u';
        var other = vowel ? "an" : "a";
        return other + " " + name;
    };
    Misc.isValidName = function (name) {
        return Misc.formatNameForProtocol(name).match(/^[a-z0-9_]+$/gi) !== null;
    };
    Misc.stringToLong = function (string) {
        var l = 0;
        for (var i = 0; i < string.length && i < 12; i++) {
            var c = string.charAt(i);
            l *= 37;
            if (c >= 'A' && c <= 'Z') {
                l += (1 + c.charCodeAt(0)) - 65;
            }
            else if (c >= 'a' && c <= 'z') {
                l += (1 + c.charCodeAt(0)) - 97;
            }
            else if (c >= '0' && c <= '9') {
                l += (27 + c.charCodeAt(0)) - 48;
            }
        }
        while (l % 37 === 0 && l !== 0) {
            l /= 37;
        }
        return l;
    };
    Misc.getBuffer = function (file) {
        try {
            if (!fs_extra_1.fs.existsSync(file)) {
                return null;
            }
            var buffer = new Uint8Array((0, fs_extra_1.readFileSync)(file));
            return buffer;
        }
        catch (e) {
            console.error(e);
        }
        return null;
    };
    Misc.formatNameForProtocol = function (name) {
        return name.toLowerCase().replace(" ", "_");
    };
    Misc.formatName = function (name) {
        return Misc.fixName(name.replace(" ", "_"));
    };
    Misc.longToString = function (l) {
        var i = 0;
        var ac = new Array(12);
        while (l != 0) {
            var l1 = l;
            l /= 37;
            ac[11 - i++] = Misc.VALID_CHARACTERS[(l1 - l * 37)];
        }
        return ac.slice(12 - i, i).join("");
    };
    Misc.fixName = function (name) {
        if (name.length > 0) {
            var ac = name.split('');
            for (var j = 0; j < ac.length; j++) {
                if (ac[j] === '_') {
                    ac[j] = ' ';
                    if ((j + 1 < ac.length) && (ac[j + 1] >= 'a') && (ac[j + 1] <= 'z')) {
                        ac[j + 1] = String.fromCharCode((ac[j + 1].charCodeAt(0) + 65) - 97);
                    }
                }
            }
            if ((ac[0] >= 'a') && (ac[0] <= 'z')) {
                ac[0] = String.fromCharCode((ac[0].charCodeAt(0) + 65) - 97);
            }
            return ac.join('');
        }
        else {
            return name;
        }
    };
    Misc.wrapText = function (text, len) {
        var e_5, _a;
        var EFFECTS = ["@gre@", "@cya@", "@red@", "chalreq", "tradereq", "@bro@", "@yel@", "@blu@", "@gr1@", "@gr2@", "@gr3@", "@str@", "@mag@", "@dre@", "@dbl@", "@or1@", "@or2@", "@or3@", "@whi@", "@bla@", "@cr", "<col", "<shad", "<str", "<u", "<br", "<trans", "duelreq", "<img", "@lre@", ":clan:", "]cr", "::summ", "<str"];
        // Retorna um array vazio para o texto nulo
        if (text == null) {
            return [];
        }
        // Retorna o texto se len for zero ou menor
        if (len <= 0) {
            return [text];
        }
        // Retorna o texto se for menor ou igual ao comprimento
        if (text.length <= len) {
            return [text];
        }
        var chars = text.split('');
        var lines = [];
        var line = '';
        var word = '';
        // Efeitos de texto
        var effects = null;
        try {
            for (var EFFECTS_1 = __values(EFFECTS), EFFECTS_1_1 = EFFECTS_1.next(); !EFFECTS_1_1.done; EFFECTS_1_1 = EFFECTS_1.next()) {
                var effectCode = EFFECTS_1_1.value;
                if (text.includes(effectCode)) {
                    if (effects == null) {
                        effects = '';
                    }
                    effects += effectCode;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (EFFECTS_1_1 && !EFFECTS_1_1.done && (_a = EFFECTS_1.return)) _a.call(EFFECTS_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        for (var i = 0; i < chars.length; i++) {
            word += chars[i];
            if (chars[i] == ' ') {
                if ((line.length + word.length) > len) {
                    var line_ = line;
                    // Aplica os efeitos
                    if (effects != null && !line_.startsWith(effects)) {
                        line_ = effects + line_;
                    }
                    lines.push(line_);
                    line = '';
                }
                line += word;
                word = '';
            }
        }
        // Lidar com quaisquer caracteres extras na palavra atual
        if (word.length > 0) {
            if ((line.length + word.length) > len) {
                var line_ = line;
                // Aplica os efeitos
                if (effects != null && !line_.startsWith(effects)) {
                    line_ = effects + line_;
                }
                lines.push(line_);
                line = '';
            }
            line += word;
        }
        // Lidar com linha extra
        if (line.length > 0) {
            var line_ = line;
            // Aplica os efeitos
            if (effects != null && !line_.startsWith(effects)) {
                line_ = effects + line_;
            }
            lines.push(line_);
        }
        return lines;
    };
    Misc.hash = function (string) {
        return Misc.hash(string.toUpperCase());
    };
    Misc.getUsersProjectRootDirectory = function () {
        var envRootDir = process.cwd();
        var rootDir = (0, path_1.resolve)('.');
        if (rootDir.startsWith(envRootDir)) {
            return rootDir;
        }
        else {
            throw new Error('Root dir not found in user directory.');
        }
    };
    Misc.randoms = function (range) {
        return Math.floor(Math.random() * (range + 1));
    };
    Misc.random = function (minRange, maxRange) {
        return minRange + Misc.random(maxRange, minRange);
    };
    /**
     * Get a random number between a range and exclude some numbers.
     * The excludes list MUST BE MODIFIABLE.
     *
     * @param start start number
     * @param end end number
     * @param excludes list of numbers to be excluded
     * @return value between `start` (inclusive) and `end` (inclusive)
     */
    Misc.getRandomExlcuding = function (start, end, excludes) {
        var e_6, _a;
        excludes.sort();
        var random = start + Misc.SECURE_RANDOM.nextInt(end - start + 1 - excludes.length);
        try {
            for (var excludes_1 = __values(excludes), excludes_1_1 = excludes_1.next(); !excludes_1_1.done; excludes_1_1 = excludes_1.next()) {
                var exclude = excludes_1_1.value;
                if (random < exclude) {
                    break;
                }
                random++;
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (excludes_1_1 && !excludes_1_1.done && (_a = excludes_1.return)) _a.call(excludes_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return random;
    };
    Misc.concatWithCollection = function (array1, array2) {
        var resultList = __spreadArray(__spreadArray([], __read(array1), false), __read(array2), false);
        return resultList;
    };
    Misc.FORMATTER = new decimal_format_1.default("0.#");
    Misc.HALF_A_DAY_IN_MILLIS = 43200000;
    Misc.VALID_PLAYER_CHARACTERS = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
        'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '[', ']', '/', '-', ' '];
    Misc.VALID_CHARACTERS = ['_', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
        'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&',
        '', '(', ')', '-', '+', '=', ':', ';', '.', '>', '<', ',', '"',
        '[', ']', '|', '?', '/', '`'
    ];
    Misc.RANDOM = new RandomGen_1.RandomGen();
    Misc.SECURE_RANDOM = new securerandom_1.SecureRandom();
    Misc.BLOCKED_WORDS = [
        ".com", ".net", ".org", "<img", "@cr", "<img=", ":tradereq:", ":duelreq:",
        "<col=", "<shad="
    ];
    Misc.DIRECTIONS = [[-1, 1], [0, 1], [1, 1],
        [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]];
    Misc.xlateDirectionToClient = { 1: 2, 4: 7, 6: 5, 3: 0 };
    Misc.xlateTable = [' ', 'e', 't', 'a', 'o', 'i', 'h', 'n',
        's', 'r', 'd', 'l', 'u', 'm', 'w', 'c', 'y', 'f', 'g', 'p', 'b',
        'v', 'k', 'x', 'j', 'q', 'z', '0', '1', '2', '3', '4', '5', '6',
        '7', '8', '9', ' ', '!', '?', '.', ',', ':', ';', '(', ')', '-',
        '&', '*', '\\', '\'', '@', '#', '+', '=', '\243', '$', '%', '"',
        '[', ']'];
    Misc.getDayOfYear = function () {
        var c = new Date();
        var year = c.getFullYear();
        var month = c.getMonth();
        var days = 0;
        var daysOfTheMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
            daysOfTheMonth[1] = 29;
        }
        days += c.getDate();
        for (var i = 0; i < daysOfTheMonth.length; i++) {
            if (i < month) {
                days += daysOfTheMonth[i];
            }
        }
        return days;
    };
    Misc.getYear = function () {
        var c = new Date();
        return c.getFullYear();
    };
    Misc.getElapsed = function (day, year) {
        if (year < 2013) {
            return 0;
        }
        var elapsed = 0;
        var currentYear = Misc.getYear();
        var currentDay = Misc.getDayOfYear();
        if (currentYear == year) {
            elapsed = currentDay - day;
        }
        else {
            elapsed = currentDay;
            for (var i = 1; i < 5; i++) {
                if (currentYear - i == year) {
                    elapsed += 365 - day;
                    break;
                }
                else {
                    elapsed += 365;
                }
            }
        }
        return elapsed;
    };
    Misc.getTimeLeft = function (start, timeAmount, timeUnit) {
        var duration = moment_1.default.duration(Date.now() - start, 'milliseconds');
        var timeUnitDuration = moment_1.default.duration(timeAmount, timeUnit);
        var remaining = timeUnitDuration.subtract(duration).as(timeUnit);
        return Math.max(remaining, 1);
    };
    return Misc;
}());
//# sourceMappingURL=Misc.js.map