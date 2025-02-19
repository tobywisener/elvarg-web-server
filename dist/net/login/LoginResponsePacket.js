"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponsePacket = void 0;
// import { PlayerRights } from '../../game/model/rights/PlayerRights';
var LoginResponsePacket = /** @class */ (function () {
    // private readonly rights: PlayerRights;
    function LoginResponsePacket(response, rights) {
        this.response = response;
        if (!rights) {
            // this.rights = PlayerRights.NONE;
        }
        else {
            // this.rights = rights;
        }
    }
    LoginResponsePacket.prototype.getResponse = function () {
        return this.response;
    };
    return LoginResponsePacket;
}());
exports.LoginResponsePacket = LoginResponsePacket;
//# sourceMappingURL=LoginResponsePacket.js.map