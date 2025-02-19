import { GameConstants } from '../../game/GameConstants';
import { Animation } from '../../game/model/Animation';
import { Graphic } from '../../game/model/Graphic';
import { Location } from '../../game/model/Location';
import { Area } from '../../game/model/areas/Area';
import { PrivateArea } from '../../game/model/areas/impl/PrivateArea';


export abstract class Entity {
    /**
     * Represents the {@link Location} of this {@link Entities}.
     */
    public static location: Location = GameConstants.DEFAULT_LOCATION.clone();
    public static area: Area;
    /**
     * The Entities constructor.
     *
     * @param position The position the entity is currently in.
     */
    constructor(position: Location) {
        Entity.location = position;
    }


    /**
     * Performs an {@link Animation}.
     * @param animation
     */
    abstract performAnimation(animation: Animation): void;

    /**
     * Performs a {@link Graphic}.
     * @param animation
     */
    abstract performGraphic(graphic: Graphic): void;

    /**
     * Returns the size of this {@link Entities}.
     */
    abstract getSize(): number;

    /**
     * Gets the entity position.
     *
     * @return the entity's world position
     */
    getLocation(): Location {
        return Entity.location;
    }

    /**
     * Sets the entity position
     *
     * @param location the world position
     */
    setLocation(location: Location): Entity {
        Entity.location = location;
        return this;
    }
    public setArea(area: Area): void {
        Entity.area = area;
    }

    public getArea(): Area {
        return Entity.area;
    }

    public getPrivateArea(): PrivateArea {
        return (Entity.area instanceof PrivateArea ? (Entity.area as PrivateArea) : null);
    }
}