"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRelationPacketListener = void 0;
var World_1 = require("../../../game/World");
var PacketConstants_1 = require("../PacketConstants");
var Misc_1 = require("../../../util/Misc");
var PlayerRelationPacketListener = /** @class */ (function () {
    function PlayerRelationPacketListener() {
    }
    PlayerRelationPacketListener.prototype.execute = function (player, packet) {
        try {
            var username = packet.readLong();
            if (username < 0) {
                return;
            }
            switch (packet.getOpcode()) {
                case PacketConstants_1.PacketConstants.ADD_FRIEND_OPCODE:
                    player.getRelations().addFriend(username);
                    break;
                case PacketConstants_1.PacketConstants.ADD_IGNORE_OPCODE:
                    player.getRelations().addIgnore(username);
                    break;
                case PacketConstants_1.PacketConstants.REMOVE_FRIEND_OPCODE:
                    player.getRelations().deleteFriend(username);
                    break;
                case PacketConstants_1.PacketConstants.REMOVE_IGNORE_OPCODE:
                    player.getRelations().deleteIgnore(username);
                    break;
                case PacketConstants_1.PacketConstants.SEND_PM_OPCODE:
                    var size = packet.getSize();
                    var message = packet.readBytes(size);
                    var friend = World_1.World.getPlayerByName(Misc_1.Misc.formatText(Misc_1.Misc.longToString(username)).replace("_", " "));
                    if (friend) {
                        player.getRelations().message(friend, new Uint8Array(message), size);
                    }
                    else {
                        player.getPacketSender().sendMessage("That player is offline.");
                    }
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    return PlayerRelationPacketListener;
}());
exports.PlayerRelationPacketListener = PlayerRelationPacketListener;
//# sourceMappingURL=PlayerRelationPacketListener.js.map