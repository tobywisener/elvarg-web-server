"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPacketListener = void 0;
var CommandPacketListener = /** @class */ (function () {
    function CommandPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    CommandPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0) {
            return;
        }
        var command = packet.readString();
        var parts = command.split(" ");
        parts[0] = parts[0].toLowerCase();
        // let c: Command | undefined = CommandManager.commands.get(parts[0]);
        // if (c) {
        //     if (c.canUse(player)) {
        //         c.execute(player, command, parts);
        //     } else {
        //         // do something if player can't use command
        //     }
        // } else {
        player.getPacketSender().sendMessage("This command does not exist.");
        // }
    };
    CommandPacketListener.OP_CODE = 103;
    return CommandPacketListener;
}());
exports.CommandPacketListener = CommandPacketListener;
//# sourceMappingURL=CommandPacketListener.js.map