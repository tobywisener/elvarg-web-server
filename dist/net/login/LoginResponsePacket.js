"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponsePacket = void 0;
var PlayerRights_1 = require("../../game/model/rights/PlayerRights");
var LoginResponsePacket = /** @class */ (function () {
    function LoginResponsePacket(response, rights) {
        this.response = response;
        if (!rights) {
            this.rights = PlayerRights_1.PlayerRights.NONE;
        }
        else {
            this.rights = rights;
        }
    }
    LoginResponsePacket.prototype.getResponse = function () {
        return this.response;
    };
    LoginResponsePacket.prototype.getRights = function () {
        return this.rights;
    };
    return LoginResponsePacket;
}());
exports.LoginResponsePacket = LoginResponsePacket;
//# sourceMappingURL=LoginResponsePacket.js.map