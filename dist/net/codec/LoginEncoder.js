"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginEncoder = void 0;
var socket_io_1 = require("socket.io");
var LoginResponses_1 = require("../login/LoginResponses");
/**
Encodes login.
@author Swiffy
*/
var io = new socket_io_1.Server();
var LoginEncoder = /** @class */ (function () {
    function LoginEncoder() {
    }
    LoginEncoder.prototype.encode = function (msg) {
        io.on('connection', function (socket) {
            socket.emit('message', msg.getResponse());
            if (msg.getResponse() == LoginResponses_1.LoginResponses.LOGIN_SUCCESSFUL) {
                socket.emit('message', msg.getRights());
            }
        });
    };
    return LoginEncoder;
}());
exports.LoginEncoder = LoginEncoder;
//# sourceMappingURL=LoginEncoder.js.map