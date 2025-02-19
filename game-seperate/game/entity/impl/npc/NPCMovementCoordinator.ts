import { RegionManager } from "../../../collision/RegionManager"
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { Location } from "../../../model/Location"
import { PathFinder } from "../../../model/movement/path/PathFinder"
import { Misc } from "../../../../util/Misc";
import { NPC } from "./NPC";

export class NPCMovementCoordinator {
    private npc: NPC;
    private coordinateState: CoordinateState;
    private radius: number;


    constructor(npc: NPC) {
        this.npc = npc;
        this.coordinateState = CoordinateState.HOME;
    }

    public process() {
        if (this.radius == 0) {
            if (this.coordinateState == CoordinateState.HOME) {
                return;
            }
        }

        if (!this.npc.getMovementQueue().getMobility().canMove()) {
            return;
        }

        this.updateCoordinator();

        switch (this.coordinateState) {
            case CoordinateState.HOME:
                if (CombatFactory.inCombat(this.npc)) {
                    return;
                }
                if (!this.npc.getMovementQueue().isMovings()) {
                    if (Misc.getRandom(9) <= 1) {
                        let pos = this.generateLocalPosition();
                        if (pos != null) {
                            this.npc.getMovementQueue().walkStep(pos.getX(), pos.getY());
                        }
                    }
                }
                break;
            case CoordinateState.RETREATING:
            case CoordinateState.AWAY:
                PathFinder.calculateWalkRoute(this.npc, this.npc.getSpawnPosition().getX(), this.npc.getSpawnPosition().getY());
                break;
        }
    }

    public updateCoordinator() {
        if (CombatFactory.inCombat(this.npc)) {
            if (this.coordinateState == CoordinateState.AWAY) {
                this.coordinateState = CoordinateState.RETREATING;
            }
            if (this.coordinateState == CoordinateState.RETREATING) {
                if (this.npc.getLocation().equals(this.npc.getSpawnPosition())) {
                    this.coordinateState = CoordinateState.HOME;
                }
                this.npc.getCombat().reset();
            }
            return;
        }

        let deltaX;
        let deltaY;

        if (this.npc.getSpawnPosition().getX() > this.npc.getLocation().getX()) {
            deltaX = this.npc.getSpawnPosition().getX() - this.npc.getLocation().getX();
        } else {
            deltaX = this.npc.getLocation().getX() - this.npc.getSpawnPosition().getX();
        }

        if (this.npc.getSpawnPosition().getY() > this.npc.getLocation().getY()) {
            deltaY = this.npc.getSpawnPosition().getY() - this.npc.getLocation().getY();
        } else {
            deltaY = this.npc.getLocation().getY() - this.npc.getSpawnPosition().getY();
        }

        if ((deltaX > this.radius) || (deltaY > this.radius)) {
            this.coordinateState = CoordinateState.AWAY;
        } else {
            this.coordinateState = CoordinateState.HOME;
        }
    }

    private generateLocalPosition(): Location | null {
        let dir = -1;
        let x = 0, y = 0;
        if (!RegionManager.blockedNorth(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 0;
        } else if (!RegionManager.blockedEast(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 4;
        } else if (!RegionManager.blockedSouth(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 8;
        } else if (!RegionManager.blockedWest(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 12;
        }
        let random = Misc.getRandom(3);

        let found = false;

        if (random == 0) {
            if (!RegionManager.blockedNorth(this.npc.getLocation(), this.npc.getPrivateArea())) {
                y = 1;
                found = true;
            }
        } else if (random == 1) {
            if (!RegionManager.blockedEast(this.npc.getLocation(), this.npc.getPrivateArea())) {
                x = 1;
                found = true;
            }
        } else if (random == 2) {
            if (!RegionManager.blockedSouth(this.npc.getLocation(), this.npc.getPrivateArea())) {
                y = -1;
                found = true;
            }
        } else if (random == 3) {
            if (!RegionManager.blockedWest(this.npc.getLocation(), this.npc.getPrivateArea())) {
                x = -1;
                found = true;
            }
        }
        if (!found) {
            if (dir == 0) {
                y = 1;
            } else if (dir == 4) {
                x = 1;
            } else if (dir == 8) {
                y = -1;
            } else if (dir == 12) {
                x = -1;
            }
        }
        if (x == 0 && y == 0)
            return null;
        let spawnX = this.npc.getSpawnPosition().getX();
        let spawnY = this.npc.getSpawnPosition().getY();
        if (x == 1) {
            if (this.npc.getLocation().getX() + x > spawnX + 1)
                return null;
        }
        if (x == -1) {
            if (this.npc.getLocation().getX() - x < spawnX - 1)
                return null;
        }
        if (y == 1) {
            if (this.npc.getLocation().getY() + y > spawnY + 1)
                return null;
        }
        if (y == -1) {
            if (this.npc.getLocation().getY() - y < spawnY - 1)
                return null;
        }
        return new Location(x, y);
    }

    public getCoordinateState(): CoordinateState {
        return this.coordinateState;
    }

    public setCoordinateState(coordinateState: CoordinateState) {
        this.coordinateState = coordinateState;
    }

    public getRadius(): number {
        return this.radius;
    }

    public setRadius(radius: number) {
        this.radius = radius;
    }
}
export enum CoordinateState {
    HOME,
    AWAY,
    RETREATING
}
