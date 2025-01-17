// import { Player } from "../../../game/entity/impl/player/Player";
// import { Command } from "../../../game/model/commands/Command";
// import { CommandManager } from "../../../game/model/commands/CommandManager";
import { Packet } from "../Packet";
import { PacketExecutor } from "../PacketExecutor";

export class CommandPacketListener implements PacketExecutor {
  public static readonly OP_CODE = 103;

  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    if (player.getHitpoints() <= 0) {
      return;
    }
    let command = packet.readString();
    let parts = command.split(" ");
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
  }
}
