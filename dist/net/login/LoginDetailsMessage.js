"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDetailsMessage = void 0;
var LoginDetailsMessage = /** @class */ (function () {
    function LoginDetailsMessage(username, password, host, encryptor, decryptor) {
        this.isDiscord = false;
        this.username = username;
        this.password = password;
        this.host = host;
        this.encryptor = encryptor;
        this.decryptor = decryptor;
    }
    LoginDetailsMessage.prototype.getUsername = function () {
        return this.username;
    };
    LoginDetailsMessage.prototype.getPassword = function () {
        return this.password;
    };
    LoginDetailsMessage.prototype.getHost = function () {
        return this.host;
    };
    LoginDetailsMessage.prototype.getEncryptor = function () {
        return this.encryptor;
    };
    LoginDetailsMessage.prototype.getDecryptor = function () {
        return this.decryptor;
    };
    LoginDetailsMessage.prototype.getIsDiscord = function () {
        return this.isDiscord;
    };
    LoginDetailsMessage.prototype.setDiscord = function (discord) {
        this.isDiscord = discord;
    };
    return LoginDetailsMessage;
}());
exports.LoginDetailsMessage = LoginDetailsMessage;
//# sourceMappingURL=LoginDetailsMessage.js.map