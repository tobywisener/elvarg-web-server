import { GameConstants } from "../../../GameConstants"
import { World } from "../../../World"
import { Location } from "../../../model/Location"
import { TaskManager } from "../../../task/TaskManager"
import { Player } from "../player/Player"
import { ItemOnGround } from "./ItemOnGround"
import { State } from "./ItemOnGround"
import { GroundItemRespawnTask } from '../../../task/impl/GroundItemRespawnTask'
import { Item } from "../../../model/Item"
//import { Optional } from "java.util"

export class ItemOnGroundManager {
    public static readonly STATE_UPDATE_DELAY: number = 50

    public static onRegionChange(player: Player): void {
        for (let item of World.getItems()) {
            ItemOnGroundManager.performPlayer(player, item, OperationType.CREATE)
        }
    }

    public static process(): void {
        for (let item of World.getItems()) {
            item.process();
            if (item.isPendingRemoval()) {
                if (item.respawns()) {
                    TaskManager.submit(new GroundItemRespawnTask(item, item.getRespawnTimer()));
                }
                const index = World.getItems().indexOf(item);
                World.getItems().splice(index, 1);
            }
        }
    }
    

    public static perform(item: ItemOnGround, type: OperationType): void {
        switch (item.getState()) {
            case State.SEEN_BY_PLAYER:
                let owner = World.getPlayerByName(item.getOwner())
                if (owner != null) {
                    ItemOnGroundManager.performPlayer(owner, item)
                }
                break;
            case State.SEEN_BY_EVERYONE:
                for (let player of World.getPlayers()) {
                    if (player) {
                        ItemOnGroundManager.performPlayer(player, item)
                    }
                }
                break;
            default:
                break;
        }
    }
    public static performPlayer(player: Player, item: ItemOnGround, type?: OperationType): void {
        if (item.isPendingRemoval()) {
            type = OperationType.DELETE;
        }
        if (item.getPosition().getZ() != player.getLocation().getZ())
            return;
        if (player.getPrivateArea() != item.getPrivateArea()) {
            return;
        }
        if (item.getPosition().getDistance(player.getLocation()) > 64)
            return;
        switch (type) {
            case OperationType.ALTER:
                player.getPacketSender().alterGroundItem(item);
                break;
            case OperationType.DELETE:
                player.getPacketSender().deleteGroundItem(item);
                break;
            case OperationType.CREATE:
                if (!ItemOnGroundManager.isOwner(player.getUsername(), item)) {
                    if (item.getState() == State.SEEN_BY_PLAYER)
                        return;
                    if (!item.getItem().getDefinition().isTradeable() || !item.getItem().getDefinition().isDropable())
                        return;
                }
                player.getPacketSender().createGroundItem(item);
                break;
            default:
                throw new Error(
                    "Unsupported operation (" + type.toString() + ") on: " + item.toString());
        }
    }
    public static register(item: ItemOnGround) {
        // No point spamming with spawned items...
        let spawnable = Array.from(GameConstants.ALLOWED_SPAWNS).includes(item.getItem().getId());
        if (spawnable) {
            return;
        }

        // Check for merge with existing stackables..
        if (item.getItem().getDefinition().isStackable()) {
            if (this.merge(item)) {
                return;
            }
        }

        // We didn't need to modify a previous item.
        // Simply register the given item to the world..
        World.getItems().push(item);
        ItemOnGroundManager.perform(item, OperationType.CREATE);
    }

    public static merge(item: ItemOnGround): boolean {
        let iterator = World.getItems().values();
        for (let item_ of iterator) {
            if (item_ == null || item_.isPendingRemoval() || item_ === item) {
                continue;
            }
            if (!item_.getPosition().equals(item.getPosition())) {
                continue;
            }

            // Check if the ground item is private...
            // If we aren't the owner, we shouldn't modify it.
            if (item_.getState() === State.SEEN_BY_PLAYER) {
                let flag = true;
                if (item_.getOwner() && item.getOwner()) {
                    if (item_.getOwner() === item.getOwner()) {
                        flag = false;
                    }
                }
                if (flag) {
                    continue;
                }
            }

            // Modify the existing item.
            if (item_.getItem().getId() === item.getItem().getId()) {
                let oldAmount = item_.getItem().getAmount();
                item_.getItem().incrementAmountBy(item.getItem().getAmount());
                item_.setOldAmount(oldAmount);
                item_.setTick(0);
                ItemOnGroundManager.perform(item_, OperationType.ALTER);
                return true;
            }
        }
        return false;
    }
    public static deregister(item: ItemOnGround) {
        item.setPendingRemoval(true);
        ItemOnGroundManager.perform(item, OperationType.DELETE);
    }

    public static registers(player: Player, item: Item): ItemOnGround {
        return this.registerLocation(player, item, player.getLocation().clone());
    }

    public static registerLocation(player: Player, item: Item, position: Location): ItemOnGround {
        let i = new ItemOnGround(State.SEEN_BY_PLAYER, player.getUsername(), position, item, true,
            -1, player.getPrivateArea());
        this.register(i);
        return i;
    }

    public static registerNonGlobal(player: Player, item: Item) {
        this.registerNonGlobals(player, item, player.getLocation().clone());
    }

    public static registerNonGlobals(player: Player, item: Item, position: Location) {
        this.register(new ItemOnGround(State.SEEN_BY_PLAYER, player.getUsername(), position, item, false, -1, player.getPrivateArea()));
    }

    public static registerGlobal(player: Player, item: Item) {
        this.register(new ItemOnGround(State.SEEN_BY_EVERYONE, player.getUsername(), player.getLocation().clone(), item, false, -1, player.getPrivateArea()));
    }

    public static getGroundItem(owner: string | null, id: number, position: Location): ItemOnGround | null {
        let iterator = World.getItems().values();
        for (let item of iterator) {
            if (item == null || item.isPendingRemoval()) {
                continue;
            }
            if (item.getState() === State.SEEN_BY_PLAYER) {
                if (!owner || !this.isOwner(owner, item)) {
                    continue;
                }
            }
            if (id !== item.getItem().getId()) {
                continue;
            }
            if (!item.getPosition().equals(position)) {
                continue;
            }
            return item;
        }
        return null;
    }

    public static exists(item: ItemOnGround): boolean {
        return this.getGroundItem(item.getOwner(), item.getItem().getId(), item.getPosition()) !== undefined;
    }

    private static isOwner(username: string, item: ItemOnGround): boolean {
        return item.getOwner() === username;
        return false;
    }


}

export class OperationType {
    public static readonly CREATE = new OperationType();
    public static readonly DELETE = new OperationType();
    public static readonly ALTER = new OperationType();
}