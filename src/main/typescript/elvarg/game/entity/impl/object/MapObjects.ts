import { RegionManager } from "../../../collision/RegionManager";
import { Player } from "../player/Player";
import { Location } from "../../../model/Location";
import { Area } from "../../../model/areas/Area";
import { PrivateArea } from "../../../model/areas/impl/PrivateArea";
import { PlayerRights } from "../../../model/rights/PlayerRights";
import { GameObject } from "./GameObject";

export class MapObjects {

    public static mapObjects: Map<number, GameObject[]> = new Map<number, GameObject[]>();

    public static getPrivateArea(player: Player, id: number, location: Location): GameObject {
        let object = this.get(id, location, player.getPrivateArea());

        if (object == null && player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("@red@Object with id " + id + " does not exist.");
            object = new GameObject(id, location, 10, 0, player.getPrivateArea());
        }

        return object;
    }

    public static get(id: number, location: Location, privateArea: PrivateArea): GameObject {
        // Check instanced objects..
        if (privateArea != null) {
            for (let object of privateArea.getObjects()) {
                if (object.getId() == id && object.getLocation().equals(location)) {
                    return object;
                }
            }
        }

        // Load region..
        RegionManager.loadMapFiles(location.getX(), location.getY());

        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        let hash = this.getHash(location.getX(), location.getY(), location.getZ());

        // Check if the map contains the hash..
        if (!this.mapObjects.has(hash)) {
            return null;
        }

        // Go through the objects in the list..
        let list = this.mapObjects.get(hash);
        if (list != null) {
            for (let o of list) {
                if (o.getId() == id && o.getLocation().equals(location)) {
                    return o;
                }
            }
        }
        return null;
    }

    public static getType(location: Location, type: number, privateArea: PrivateArea): GameObject {
        // Check instanced objects..
        if (privateArea != null) {
            for (let object of privateArea.getObjects()) {
                if (object.getType() == type && object.getLocation().equals(location)) {
                    return object;
                }
            }
        }

        // Load region..
        RegionManager.loadMapFiles(location.getX(), location.getY());

        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        let hash = MapObjects.getHash(location.getX(), location.getY(), location.getZ());

        // Check if the map contains the hash..
        if (!this.mapObjects.has(hash)) {
            return null;
        }

        // Go through the objects in the list..
        let list = this.mapObjects.get(hash);
        if (list != null) {
            for (let o of list) {
                if (o.getType() == type && o.getLocation().equals(location)) {
                    return o;
                }
            }
        }
        return null;
    }

    static exists(object: GameObject): boolean {
        return this.get(object.getId(), object.getLocation(), object.getPrivateArea()) === object;
    }

    static add(object: GameObject) {
        if (!object.getPrivateArea()) {

            const hash = this.getHash(object.getLocation().getX(), object.getLocation().getY(), object.getLocation().getZ());

            if (this.mapObjects.has(hash)) {
                let exists = false;
                const list = this.mapObjects.get(hash);
                list.forEach((o: GameObject) => {
                    if (o === object) {
                        exists = true;
                        return;
                    }
                });
                if (!exists) {
                    this.mapObjects.get(hash).push(object);
                }
            } else {
                this.mapObjects.set(hash, [object]);
            }
        }

        RegionManager.addObjectClipping(object);
    }

    static remove(object: GameObject) {
        const hash = this.getHash(object.getLocation().getX(), object.getLocation().getY(), object.getLocation().getZ());

        if (this.mapObjects.has(hash)) {
            const list = this.mapObjects.get(hash);
            for (let i = 0; i < list.length; i++) {
                if (list[i].getId() === object.getId() && list[i].getLocation().equals(object.getLocation())) {
                    list.splice(i, 1);
                }
            }
        }

        RegionManager.removeObjectClipping(object);
    }

    static clear(position: Location, clipShift: number) {
        const hash = this.getHash(position.getX(), position.getY(), position.getZ());

        if (this.mapObjects.has(hash)) {
            const list = this.mapObjects.get(hash);
            for (let i = 0; i < list.length; i++) {
                if (list[i].getLocation().equals(position)) {
                    list.splice(i, 1);
                }
            }
        }

        RegionManager.removeClipping(position.getX(), position.getY(), position.getZ(), clipShift, null);
    }

    static getHash(x: number, y: number, z: number): number {
        return z + (x << 24) + (y << 48);
    }
}