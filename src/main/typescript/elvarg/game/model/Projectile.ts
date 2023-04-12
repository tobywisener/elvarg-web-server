import { Location } from "./Location";
import { World } from '../World';
import { Mobile } from "../entity/impl/Mobile";
import { PrivateArea } from "./areas/impl/PrivateArea";

export class Projectile {
    private start: Location;
    private end: Location;
    private speed: number;
    private projectileId: number;
    private startHeight: number;
    private endHeight: number;
    private lockon: Mobile;
    private delay: number;
    private privateArea: PrivateArea;

    constructor(start: Location, end: Location, lockon: Mobile, projectileId: number, delay: number, speed: number,
        startHeight: number, endHeight: number, privateArea: PrivateArea) {
        this.start = start;
        this.lockon = lockon;
        this.end = end;
        this.projectileId = projectileId;
        this.delay = delay;
        this.speed = speed;
        this.startHeight = startHeight;
        this.endHeight = endHeight;
        this.privateArea = privateArea;
        }

        static createProjectile(source: Mobile, victim: Mobile, projectileId: number, delay: number, speed: number,
                            startHeight: number, endHeight: number) {
        return new Projectile(
            source.getLocation(),
            victim.getLocation(),
            victim,
            projectileId,
            delay,
            speed,
            startHeight,
            endHeight,
            source.getPrivateArea()
        );
    }


    public sendProjectile(): void {
        for (let player of World.getPlayers()) {
            if (player == null) {
                continue;
            }
            if (player.getPrivateArea() != this.privateArea) {
                continue;
            }
            if (!this.start.isViewableFrom(player.getLocation())) {
                continue;
            }
            player.getPacketSender().sendProjectile(this.start, this.end, 0, this.speed, this.projectileId, this.startHeight, this.endHeight, this.lockon, this.delay);
        }
    }
}

