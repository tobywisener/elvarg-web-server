// import { World } from '../../../game/World';
// import { Player } from '../../../game/entity/impl/player/Player';
// import { TaskManager } from '../../../game/task/TaskManager';
import { Packet } from "../Packet";
import { PacketExecutor } from "../PacketExecutor";
// import { Task } from '../../../game/task/Task';
// import { PathFinder } from '../../../game/model/movement/path/PathFinder';
// import { Location } from '../../../game/model/Location';

export class FollowPlayerPacketListener implements PacketExecutor {
  // execute(player: Player, packet: Packet): void {
  execute(player: any, packet: Packet): void {
    if (player.busy()) {
      return;
    }
    // TaskManager.cancelTasks(player.getIndex());
    const otherPlayersIndex = packet.readLEShort();
    // if (otherPlayersIndex < 0 || otherPlayersIndex > World.getPlayers().capacityReturn())
    //     return;
    // const leader = World.getPlayers().get(otherPlayersIndex);
    // if (leader == null) {
    //     return;
    // }
    // FollowPlayerPacketListener.follow(player, leader);
  }

  // public static follow(player: Player, leader: Player) {
  public static follow(player: any, leader: any) {
    let mobility = player.getMovementQueue().getMobility();
    if (!mobility.canMove()) {
      mobility.sendMessage(player);
      player.getMovementQueue().reset();
      return;
    }

    player.getMovementQueue().reset();
    player.getMovementQueue().walkToReset();

    player.setFollowing(leader);
    player.setMobileInteraction(leader);
  }
}

// class FollowTask extends Task {
class FollowTask {
  // private player: Player;
  // private leader: Player;
  // constructor(player: Player, leader: Player) {
  //     super(1, player.getIndex(), true);
  //     this.player = player;
  //     this.leader = leader;
  // }
  // execute() {
  //     if (this.player.getFollowing() == null) {
  //         this.player.setPositionToFace(null);
  //         this.stop();
  //         return;
  //     }
  //     if (this.leader.isTeleportingReturn() || !this.leader.getLocation().isWithinDistance(this.player.getLocation(), 15)) {
  //         this.player.setPositionToFace(null);
  //         this.stop();
  //         return;
  //     }
  //     let destX = this.leader.getMovementQueue().followX;
  //     let destY = this.leader.getMovementQueue().followY;
  //     if ((destX === -1 && destY === -1) || this.player.getLocation().equals(new Location(destX, destY))) {
  //         return;
  //       }
  //     this.player.getMovementQueue().reset();
  //     this.player.setPositionToFace(this.leader.getLocation());
  //     this.player.setMobileInteraction(this.leader);
  //     PathFinder.calculateWalkRoute(this.player, destX, destY);
  // }
}
