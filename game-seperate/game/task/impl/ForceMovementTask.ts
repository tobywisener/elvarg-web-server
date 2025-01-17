import { Task } from "../Task";
import { Location } from "../../model/Location";
import { ForceMovement } from "../../model/ForceMovement";
import { Player } from "../../entity/impl/player/Player";
import { TaskType } from "../TaskType";

export class ForceMovementTask extends Task {
    private player: Player;
    private end: Location;
    private start: Location;

    constructor(player: Player, delay: number, forceM: ForceMovement) {
        super(delay, player as any);
        this.player = player;
        this.start = (forceM.getStart() as any).clone();
        this.end = (forceM.getEnd() as any).clone();
    
        player.getCombat().reset();
        player.getMovementQueue().reset();
        player.setForceMovement(forceM);
    }

    public execute() {
        let x = this.start.getX() + this.end.getX();
        let y = this.start.getY() + this.end.getY();
        (this.player as any).moveTo(new (Location as any)(x, y, (this.player.getLocation() as any).getZ()));
        this.player.setForceMovement(null);
        this.stop();
    }
}


