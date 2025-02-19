// import { Player } from '../../../game/entity/impl/player/Player';
// import { World } from '../../../game/World';
import { Packet } from "../Packet";
// import { PlayerRights } from '../../../game/model/rights/PlayerRights';
import { PacketConstants } from "../PacketConstants";

export class PlayerOptionPacketListener {
  // public static attack(player: Player, packet: Packet) {
  public static attack(player: any, packet: Packet) {
    let index: number = packet.readLEShort();
    // if (index > World.getPlayers().capacityReturn() || index < 0)
    //     return;
    // const attacked: Player = World.getPlayers().get(index);

    // if (attacked == null || attacked.getHitpoints() <= 0 || attacked.equals(player)) {
    //     player.getMovementQueue().reset();
    //     return;
    // }

    // if (player.getRights() === PlayerRights.DEVELOPER) {
    //     player.getPacketSender().sendMessage("AttacKInfo "+attacked.getLocation().toString() + " " + player.getLocation().getDistance(attacked.getLocation()));
    // }

    // player.getCombat().attack(attacked);
  }

  /**
   * Manages the first option click on a player option menu.
   *
   * @param player The player clicking the other entity.
   * @param packet The packet to read values from.
   */
  // public static option1(player: Player, packet: Packet) {
  public static option1(player: any, packet: Packet) {
    let id: number = packet.readShort() & 0xffff;
    // if (id < 0 || id > World.getPlayers().capacityReturn())
    //     return;
    // let player2: Player = World.getPlayers().get(id);
    // if (player2 == null)
    //     return;
    // player.getMovementQueue().walkToEntity(player2, () => {
    //     if (player.getArea() != null) {
    //         player.getArea().onPlayerRightClick(player, player2, 1);
    //     }
    // });
  }

  /**
   * Manages the second option click on a player option menu.
   *
   * @param player The player clicking the other entity.
   * @param packet The packet to read values from.
   */
  // public static option2(player: Player, packet: Packet) {
  public static option2(player: any, packet: Packet) {
    let id: number = packet.readShort() & 0xffff;
    // if (id < 0 || id > World.getPlayers().capacityReturn())
    //     return;
    // let player2: Player = World.getPlayers().get(id);
    // if (player2 == null)
    //     return;
    // player.getMovementQueue().walkToEntity(player2, () => {
    //         if (player.getArea() != null) {
    //             player.getArea().onPlayerRightClick(player, player2, 2);
    //         }
    // });
  }

  // private static option3(player: Player, packet: Packet) {
  private static option3(player: any, packet: Packet) {
    let id = packet.readLEShortA() & 0xffff;
    // if (id < 0 || id > World.getPlayers().capacityReturn())
    //     return;
    // let player2 = World.getPlayers().get(id);
    // if (player2 == null)
    //     return;
    // player.getMovementQueue().walkToEntity(player2, () => {
    //         if (player.getArea() != null) {
    //             player.getArea().onPlayerRightClick(player, player2, 3);
    //         }
    // });
  }

  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    if (player == null || player.getHitpoints() <= 0) {
      return;
    }

    if (player.busy()) {
      return;
    }

    switch (packet.getOpcode()) {
      case PacketConstants.ATTACK_PLAYER_OPCODE:
        PlayerOptionPacketListener.attack(player, packet);
        break;
      case PacketConstants.PLAYER_OPTION_1_OPCODE:
        PlayerOptionPacketListener.option1(player, packet);
        break;
      case PacketConstants.PLAYER_OPTION_2_OPCODE:
        PlayerOptionPacketListener.option2(player, packet);
        break;
      case PacketConstants.PLAYER_OPTION_3_OPCODE:
        PlayerOptionPacketListener.option3(player, packet);
        break;
    }
  }
}
