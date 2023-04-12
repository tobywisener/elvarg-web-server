import { Mobile } from "../../../../entity/impl/Mobile";
import { Boundary } from "../../../Boundary";
import { Area } from "../../Area";
import { Player } from "../../../../entity/impl/player/Player";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { TaskManager } from "../../../../task/TaskManager";
import { PestControl } from "../../../../content/minigames/impl/pestcontrols/PestControl";
import { ObjectIdentifiers } from "../../../../../util/ObjectIdentifiers";
export class PestControlNoviceBoatArea extends Area {
    public static readonly BOUNDARY = new Boundary(2660, 2663, 2638, 2643);
    
    constructor() {
        super([PestControlNoviceBoatArea.BOUNDARY]);
    }
    
    postEnter(character: Mobile): void {
        if (!character.isPlayer()) {
            return;
        }
    
        if (!PestControl.NOVICE_LOBBY_TASK.isRunning() && this.getPlayers().length > 0) {
            TaskManager.submit(PestControl.NOVICE_LOBBY_TASK);
        }
    
        character.getAsPlayer().setWalkableInterfaceId(21119);
    }
    
    allowDwarfCannon(player: Player): boolean {
        player.sendMessage("This would be a silly.");
        return false;
    }
    
    allowSummonPet(player: Player): boolean {
        player.sendMessage("The squire doesn't allow you to bring your pet with you.");
        return false;
    }
    
    postLeave(character: Mobile, logout: boolean): void {
        if (!character.isPlayer()) {
            return;
        }
    
        character.getAsPlayer().setWalkableInterfaceId(-1);
    }
    
    process(character: Mobile): void {
        const player = character.getAsPlayer();
        if (player == null) {
            // Don't process for any other type of Mobile, just players
            return;
        }
    
        player.getPacketSender().sendString("Players Ready: " + PestControl.NOVICE_BOAT_AREA.getPlayers().length, 21121);
        player.getPacketSender().sendString("(Need 3 to 25 players)", 21122);
        player.getPacketSender().sendString("Points: " + player.pcPoints, 21123);
    }
    
    handleObjectClick(player: Player, object: GameObject, type: number): boolean {
        switch (object.getId()) {
            case ObjectIdentifiers.LADDER_175:
                // Move player to the pier
                player.moveTo(PestControl.GANG_PLANK_START);
                return true;
        }
    
        return false;
    }
    }