import { Area } from "../../Area";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { PestControlBoat } from "../../../../content/minigames/impl/pestcontrols/PestControlBoat";
import { Player } from "../../../../entity/impl/player/Player";
import { PestControl } from "../../../../content/minigames/impl/pestcontrols/PestControl";
import { Boundary } from "../../../Boundary";
export class PestControlOutpostArea extends Area {
    constructor() {
      super([new Boundary(2626, 2682, 2632, 2681)]);
    }
  
    public getName(): string {
      return "the Pest Control Outpost island";
    }
  
    public handleObjectClick(player: Player, object: GameObject, type: number): boolean {
      switch (object.getId()) {
        // case statements here
      }
  
      const boatdata = PestControlBoat.getBoat(object.getId());
  
      if (!boatdata) {
        return false;
      }
  
      const boat = boatdata;
  
      if (player.getSkillManager().getCombatLevel() < boat.combatLevelRequirement) {
        player.getPacketSender().sendMessage(`You need a combat level of ${boat.combatLevelRequirement} to board this boat.`);
        return false;
      }
  
      if (player.getCurrentPet()) {
        player.getPacketSender().sendMessage("You cannot bring your follower with you.");
        return false;
      }
  
      PestControl.addToWaitingRoom(player, boat);
      return true;
    }
  }