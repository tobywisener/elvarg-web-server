
import { Area } from '../Area';
import { Boundary } from '../../Boundary';
import { Entity } from '../../../entity/Entity';
import { World } from '../../../World'
import { ObjectManager } from '../../../entity/impl/object/ObjectManager';
import { ItemOnGroundManager } from '../../../entity/impl/grounditem/ItemOnGroundManager'
import { GameObject } from '../../../entity/impl/object/GameObject';
import { Mobile } from '../../../entity/impl/Mobile';
import { Location } from '../../Location';

export abstract class PrivateArea extends Area {
    public entities: Entity[];
    private clips: Map<Location, number>;
    private destroyed: boolean;

    constructor(boundaries?: Boundary[]) {
        super(boundaries);
        this.entities = [];
        this.clips = new Map();
        this.destroyed = false;
    }

    postLeave(mobile: Mobile, logout: boolean) {
        this.remove(mobile);
        if (this.getPlayers().length === 0) {
            this.destroy();
        }
    }

    postEnter(mobile: Mobile) {
        this.add(mobile);
    }

    remove(entity: Entity) {
        this.entities = this.entities.filter((e) => e !== entity);
        entity.setArea(null);
    }

    add(entity: Entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        entity.setArea(this);
    }

    public destroy() {
        if (this.destroyed) {
            return;
        }
        for (let npc of this.getNpcs()) {
            if (npc.isRegistered()) {
                World.getRemoveNPCQueue().push(npc);
            }
        }
        for (let object of this.getObjects()) {
            ObjectManager.deregister(object, false);
        }
        for (let item of World.getItems()) {
            if (item.getPrivateArea() === this) {
                ItemOnGroundManager.deregister(item);
            }
        }
        this.entities = [];
        this.clips.clear();
        this.destroyed = true;
    }

    public getObjects(): GameObject[] {
        let objects: GameObject[] = [];
        for (let entity of this.entities) {
            if (entity instanceof GameObject) {
                objects.push(entity);
            }
        }
        return objects;
    }

    public setClip(location: Location, mask: number) {
        this.clips.set(location, mask);
    }

    public removeClip(location: Location) {
        this.clips.delete(location);
    }

    public getClip(location: Location) {
        return this.clips.get(location) || 0;
    }

    public isDestroyed() {
        return this.destroyed;
    }

}

