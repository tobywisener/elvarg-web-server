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
exports.BufferedConnection = void 0;
var io = require("socket.io-client");
var async_mutex_1 = require("async-mutex");
var BufferedConnection = /** @class */ (function () {
    function BufferedConnection(socket1) {
        closed = false;
        this.isWriter = false;
        this.hasIOError = false;
        this.socket = socket1;
        this.socket.timeout(30000);
        var socket = io.io('http://localhost:3000', {
            transports: ['websocket']
        });
    }
    BufferedConnection.prototype.close = function () {
        closed = true;
        try {
            if (this.inputStream != null)
                this.inputStream.close();
            if (this.outputStream != null)
                this.outputStream.close();
            if (this.socket != null)
                this.socket.close();
        }
        catch (error) {
            //console.log("Error closing stream");
        }
        this.isWriter = false;
        var lock = new async_mutex_1.Mutex();
        function doSomething() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lock.acquire()];
                        case 1:
                            _a.sent();
                            try {
                                // Your code here
                            }
                            finally {
                                lock.release();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        this.buffer = null;
    };
    BufferedConnection.prototype.read = function () {
        if (closed)
            return 0;
        else
            return this.inputStream.read();
    };
    BufferedConnection.prototype.available = function () {
        if (closed)
            return 0;
        else
            return this.inputStream.available();
    };
    BufferedConnection.prototype.flushInputStream = function (abyte0, j) {
        var i = 0; // was parameter
        if (closed)
            return;
        var k;
        for (; j > 0; j -= k) {
            k = this.inputStream.read(abyte0, i, j);
            if (k <= 0)
                throw new Error("EOF");
            i += k;
        }
    };
    BufferedConnection.prototype.queueBytes = function (i, abyte0) {
        if (closed) {
            console.log("Closed");
            return;
        }
        if (this.hasIOError) {
            this.hasIOError = false;
            //throw new IOError("Error in writer thread");
        }
        if (this.buffer == null)
            this.buffer = new Uint8Array(5000);
        var lock = new async_mutex_1.Mutex();
        function doSomething() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lock.acquire()];
                        case 1:
                            _a.sent();
                            try {
                                // Your code here
                            }
                            finally {
                                lock.release();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
    BufferedConnection.prototype.run = function () {
        while (this.isWriter) {
            var i = void 0;
            var j = void 0;
            var lock = new async_mutex_1.Mutex();
            if (i > 0) {
                try {
                    this.outputStream.write(this.buffer, j, i);
                }
                catch (Error) {
                    var ioError = Error;
                    this.hasIOError = true;
                }
                this.writeIndex = (this.writeIndex + i) % 5000;
                try {
                    if (this.buffIndex == this.writeIndex)
                        this.outputStream.flush();
                }
                catch (Error) {
                    var error = Error;
                    this.hasIOError = true;
                }
            }
        }
    };
    BufferedConnection.prototype.printDebug = function () {
        console.log("dummy:" + closed);
        console.log("tcycl:" + this.writeIndex);
        console.log("tnum:" + this.buffIndex);
        console.log("writer:" + this.isWriter);
        console.log("ioerror:" + this.hasIOError);
        try {
            console.log("available:" + this.available());
        }
        catch (IOError) {
            var _ex = IOError;
        }
    };
    return BufferedConnection;
}());
exports.BufferedConnection = BufferedConnection;
//# sourceMappingURL=BufferedConnection.js.map