"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatboxInterfaceCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var ChatboxInterfaceCommand = /** @class */ (function () {
    function ChatboxInterfaceCommand() {
    }
    ChatboxInterfaceCommand.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendChatboxInterface(parseInt(parts[1]));
    };
    ChatboxInterfaceCommand.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return ChatboxInterfaceCommand;
}());
exports.ChatboxInterfaceCommand = ChatboxInterfaceCommand;
//# sourceMappingURL=ChatboxInterfaceCommand.js.map