"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowPlayer = void 0;
var FollowPlayerPacketListener_1 = require("../../../../../net/packet/impl/FollowPlayerPacketListener");
var CommandType_1 = require("./CommandType");
var FollowPlayer = /** @class */ (function () {
    function FollowPlayer() {
    }
    FollowPlayer.prototype.triggers = function () {
        return ["follow me"];
    };
    FollowPlayer.prototype.start = function (playerBot, args) {
        FollowPlayerPacketListener_1.FollowPlayerPacketListener.follow(playerBot, playerBot.getInteractingWith());
    };
    FollowPlayer.prototype.stop = function (playerBot) {
        playerBot.getMovementQueue().walkToReset();
        playerBot.setMobileInteraction(null);
        playerBot.updateLocalPlayers();
    };
    FollowPlayer.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT];
    };
    return FollowPlayer;
}());
exports.FollowPlayer = FollowPlayer;
//# sourceMappingURL=FollowPlayer.js.map