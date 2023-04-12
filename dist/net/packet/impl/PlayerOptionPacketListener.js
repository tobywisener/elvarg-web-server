"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerOptionPacketListener = void 0;
var World_1 = require("../../../game/World");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var PacketConstants_1 = require("../PacketConstants");
var PlayerOptionPacketListener = /** @class */ (function () {
    function PlayerOptionPacketListener() {
    }
    PlayerOptionPacketListener.attack = function (player, packet) {
        var index = packet.readLEShort();
        if (index > World_1.World.getPlayers().capacityReturn() || index < 0)
            return;
        var attacked = World_1.World.getPlayers().get(index);
        if (attacked == null || attacked.getHitpoints() <= 0 || attacked.equals(player)) {
            player.getMovementQueue().reset();
            return;
        }
        if (player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("AttacKInfo " + attacked.getLocation().toString() + " " + player.getLocation().getDistance(attacked.getLocation()));
        }
        player.getCombat().attack(attacked);
    };
    /**
     * Manages the first option click on a player option menu.
     *
     * @param player The player clicking the other entity.
     * @param packet The packet to read values from.
     */
    PlayerOptionPacketListener.option1 = function (player, packet) {
        var id = packet.readShort() & 0xFFFF;
        if (id < 0 || id > World_1.World.getPlayers().capacityReturn())
            return;
        var player2 = World_1.World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, function () {
            if (player.getArea() != null) {
                player.getArea().onPlayerRightClick(player, player2, 1);
            }
        });
    };
    /**
     * Manages the second option click on a player option menu.
     *
     * @param player The player clicking the other entity.
     * @param packet The packet to read values from.
     */
    PlayerOptionPacketListener.option2 = function (player, packet) {
        var id = packet.readShort() & 0xFFFF;
        if (id < 0 || id > World_1.World.getPlayers().capacityReturn())
            return;
        var player2 = World_1.World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, function () {
            if (player.getArea() != null) {
                player.getArea().onPlayerRightClick(player, player2, 2);
            }
        });
    };
    PlayerOptionPacketListener.option3 = function (player, packet) {
        var id = packet.readLEShortA() & 0xFFFF;
        if (id < 0 || id > World_1.World.getPlayers().capacityReturn())
            return;
        var player2 = World_1.World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, function () {
            if (player.getArea() != null) {
                player.getArea().onPlayerRightClick(player, player2, 3);
            }
        });
    };
    PlayerOptionPacketListener.prototype.execute = function (player, packet) {
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        if (player.busy()) {
            return;
        }
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.ATTACK_PLAYER_OPCODE:
                PlayerOptionPacketListener.attack(player, packet);
                break;
            case PacketConstants_1.PacketConstants.PLAYER_OPTION_1_OPCODE:
                PlayerOptionPacketListener.option1(player, packet);
                break;
            case PacketConstants_1.PacketConstants.PLAYER_OPTION_2_OPCODE:
                PlayerOptionPacketListener.option2(player, packet);
                break;
            case PacketConstants_1.PacketConstants.PLAYER_OPTION_3_OPCODE:
                PlayerOptionPacketListener.option3(player, packet);
                break;
        }
    };
    return PlayerOptionPacketListener;
}());
exports.PlayerOptionPacketListener = PlayerOptionPacketListener;
//# sourceMappingURL=PlayerOptionPacketListener.js.map