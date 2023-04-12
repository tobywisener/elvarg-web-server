import { Player } from "../../../game/entity/impl/player/Player";
import { PacketExecutor } from "../PacketExecutor";
import { Packet } from "../Packet";
import { TeleportHandler } from "../../../game/model/teleportation/TeleportHandler";
import { PlayerRights } from "../../../game/model/rights/PlayerRights";
import { Teleportable } from "../../../game/model/teleportation/Teleportable";

export class TeleportPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        if (player.getHitpoints() <= 0)
            return; 
        let type = packet.readByte();
        let index = packet.readByte();
        if (!player.isTeleportInterfaceOpen()) {
            player.getPacketSender().sendInterfaceRemoval();
            return;
        }

        if (player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage(
                `Selected a teleport. Type: ${type}, index: ${index}.`);
        }

        for (let teleport of Object.values(Teleportable)) {
            if (teleport.getType() == type && teleport.getIndex() == index) {
              let teleportPosition = teleport.getPosition();
              if (TeleportHandler.checkReqs(player, teleportPosition)) {
                player.getPreviousTeleports().set(teleport.getTeleportButton(), teleportPosition);
                TeleportHandler.teleport(player, teleportPosition, player.getSpellbook().getTeleportType(), true);
              }
              break;
            }
          }
    }

}