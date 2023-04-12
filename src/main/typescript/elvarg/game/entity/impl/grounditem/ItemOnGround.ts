import { World } from "../../../World";
import { ItemOnGroundManager, OperationType } from "../grounditem/ItemOnGroundManager"
import { Player } from "../player/Player"
import { Item } from "../../../model/Item"
import { Location } from "../../../model/Location"
import { PrivateArea } from "../../../model/areas/impl/PrivateArea";

export class ItemOnGround {
    position: Location;
    state: State = State.SEEN_BY_PLAYER;
    owner: string | null;
    item: Item;
    tick: number;
    goesGlobal: boolean;
    pendingRemoval: boolean;
    respawnTimer: number = -1;
    oldAmount: number;
    privateArea: PrivateArea;

    constructor(state: State, owner: string | undefined, position: Location, item: Item, goesGlobal: boolean, respawnTimer: number, privateArea: PrivateArea) {
        this.state = state;
        this.owner = owner;
        this.position = position;
        this.item = item;
        this.goesGlobal = goesGlobal;
        this.respawnTimer = respawnTimer;
        this.privateArea = privateArea;
    }

    process() {
        this.incrementTick();
        switch (this.state) {
            case State.SEEN_BY_EVERYONE:
            case State.SEEN_BY_PLAYER:
                //If an update is required..
                if (this.getTick() >= ItemOnGroundManager.STATE_UPDATE_DELAY) {
                    this.setTick(0);

                    //Check if item is currently private and needs to go global..
                    if (this.state == State.SEEN_BY_PLAYER && this.getgoesGlobal()) {

                        //We make the item despawn for the owner..
                        if (this.getOwner() != null) {
                            let o = World.getPlayerByName(this.getOwner());
                            if (o) {
                                ItemOnGroundManager.performPlayer(o.getAsPlayer(), this, OperationType.DELETE);
                            }
                        }

                        //Check if we need to merge this ground item..
                        //This basically puts together two stackables
                        //that are on the same tile.
                        if (this.getItem().getDefinition().isStackable()) {
                            if (ItemOnGroundManager.merge(this)) {
                                this.setPendingRemoval(true);
                                return;
                            }
                        }

                        //Spawn the item globally..
                        this.setState(State.SEEN_BY_EVERYONE);
                        ItemOnGroundManager.perform(this, OperationType.CREATE);
                        return;
                    }
                    //Item needs to be deleted.
                    //However, there's no point in deleting items that will just respawn..
                    if (!this.respawns()) {
                        ItemOnGroundManager.deregister(this);
                    }
                }
                break;
            default:
                break;
        }
    }

    public getPosition(): Location {
        return this.position;
    }

    public getOwner(): string | undefined {
        return this.owner;
    }

    public getItem(): Item {
        return this.item;
    }

    public getTick(): number {
        return this.tick;
    }

    public setTick(tick: number): ItemOnGround {
        this.tick = tick;
        return this;
    }

    public incrementTick(): void {
        this.tick++;
    }

    public getgoesGlobal(): boolean {
        return this.goesGlobal;
    }

    public getState(): State {
        return this.state;
    }

    public setState(state: State): ItemOnGround {
        this.state = state;
        return this;
    }

    public getRespawnTimer(): number {
        return this.respawnTimer;
    }

    public respawns(): boolean {
        return this.respawnTimer > 0;
    }

    public getPrivateArea(): PrivateArea {
        return this.privateArea;
    }

    public getOldAmount(): number {
        return this.oldAmount;
    }

    public setOldAmount(oldAmount: number): void {
        this.oldAmount = oldAmount;
    }

    public isPendingRemoval(): boolean {
        return this.pendingRemoval;
    }

    public setPendingRemoval(pendingRemoval: boolean): void {
        this.pendingRemoval = pendingRemoval;
    }
    public clone(): ItemOnGround {
        return new ItemOnGround(this.state, this.owner, this.getPosition(), this.item, this.goesGlobal, this.respawnTimer, this.privateArea);
    }

    public equals(o: object): boolean {
        if (!(o instanceof ItemOnGround))
            return false;
        let item = o as ItemOnGround;
        if (item.getOwner() && this.getOwner()) {
            if (item.getOwner() !== this.getOwner()) {
                return false;
            }
        }
        return item.getItem().equals(this.getItem())
            && item.getPosition().equals(this.getPosition())
            && item.getState() == this.getState()
            && item.getTick() == this.getTick()
            && item.getPrivateArea() == this.getPrivateArea();
    }

    public toString(): string {
        return "GroundItem, id: " + this.item.getId() + ", amount: " + this.item.getAmount() + ", current state: " + this.state.toString() + ", goesGlobal: " + this.goesGlobal + ", tick: " + this.tick + ", respawns: " + this.respawns();
    }

}
/**
 * All the possible states a {@link ItemOnGround} can have.
 */

export enum State {
    SEEN_BY_PLAYER, SEEN_BY_EVERYONE
}
