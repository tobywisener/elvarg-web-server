"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.ItemOnGround = void 0;
var World_1 = require("../../../World");
var ItemOnGroundManager_1 = require("../grounditem/ItemOnGroundManager");
var ItemOnGround = /** @class */ (function () {
    function ItemOnGround(state, owner, position, item, goesGlobal, respawnTimer, privateArea) {
        this.state = State.SEEN_BY_PLAYER;
        this.respawnTimer = -1;
        this.state = state;
        this.owner = owner;
        this.position = position;
        this.item = item;
        this.goesGlobal = goesGlobal;
        this.respawnTimer = respawnTimer;
        this.privateArea = privateArea;
    }
    ItemOnGround.prototype.process = function () {
        this.incrementTick();
        switch (this.state) {
            case State.SEEN_BY_EVERYONE:
            case State.SEEN_BY_PLAYER:
                //If an update is required..
                if (this.getTick() >= ItemOnGroundManager_1.ItemOnGroundManager.STATE_UPDATE_DELAY) {
                    this.setTick(0);
                    //Check if item is currently private and needs to go global..
                    if (this.state == State.SEEN_BY_PLAYER && this.getgoesGlobal()) {
                        //We make the item despawn for the owner..
                        if (this.getOwner() != null) {
                            var o = World_1.World.getPlayerByName(this.getOwner());
                            if (o) {
                                ItemOnGroundManager_1.ItemOnGroundManager.performPlayer(o.getAsPlayer(), this, ItemOnGroundManager_1.OperationType.DELETE);
                            }
                        }
                        //Check if we need to merge this ground item..
                        //This basically puts together two stackables
                        //that are on the same tile.
                        if (this.getItem().getDefinition().isStackable()) {
                            if (ItemOnGroundManager_1.ItemOnGroundManager.merge(this)) {
                                this.setPendingRemoval(true);
                                return;
                            }
                        }
                        //Spawn the item globally..
                        this.setState(State.SEEN_BY_EVERYONE);
                        ItemOnGroundManager_1.ItemOnGroundManager.perform(this, ItemOnGroundManager_1.OperationType.CREATE);
                        return;
                    }
                    //Item needs to be deleted.
                    //However, there's no point in deleting items that will just respawn..
                    if (!this.respawns()) {
                        ItemOnGroundManager_1.ItemOnGroundManager.deregister(this);
                    }
                }
                break;
            default:
                break;
        }
    };
    ItemOnGround.prototype.getPosition = function () {
        return this.position;
    };
    ItemOnGround.prototype.getOwner = function () {
        return this.owner;
    };
    ItemOnGround.prototype.getItem = function () {
        return this.item;
    };
    ItemOnGround.prototype.getTick = function () {
        return this.tick;
    };
    ItemOnGround.prototype.setTick = function (tick) {
        this.tick = tick;
        return this;
    };
    ItemOnGround.prototype.incrementTick = function () {
        this.tick++;
    };
    ItemOnGround.prototype.getgoesGlobal = function () {
        return this.goesGlobal;
    };
    ItemOnGround.prototype.getState = function () {
        return this.state;
    };
    ItemOnGround.prototype.setState = function (state) {
        this.state = state;
        return this;
    };
    ItemOnGround.prototype.getRespawnTimer = function () {
        return this.respawnTimer;
    };
    ItemOnGround.prototype.respawns = function () {
        return this.respawnTimer > 0;
    };
    ItemOnGround.prototype.getPrivateArea = function () {
        return this.privateArea;
    };
    ItemOnGround.prototype.getOldAmount = function () {
        return this.oldAmount;
    };
    ItemOnGround.prototype.setOldAmount = function (oldAmount) {
        this.oldAmount = oldAmount;
    };
    ItemOnGround.prototype.isPendingRemoval = function () {
        return this.pendingRemoval;
    };
    ItemOnGround.prototype.setPendingRemoval = function (pendingRemoval) {
        this.pendingRemoval = pendingRemoval;
    };
    ItemOnGround.prototype.clone = function () {
        return new ItemOnGround(this.state, this.owner, this.getPosition(), this.item, this.goesGlobal, this.respawnTimer, this.privateArea);
    };
    ItemOnGround.prototype.equals = function (o) {
        if (!(o instanceof ItemOnGround))
            return false;
        var item = o;
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
    };
    ItemOnGround.prototype.toString = function () {
        return "GroundItem, id: " + this.item.getId() + ", amount: " + this.item.getAmount() + ", current state: " + this.state.toString() + ", goesGlobal: " + this.goesGlobal + ", tick: " + this.tick + ", respawns: " + this.respawns();
    };
    return ItemOnGround;
}());
exports.ItemOnGround = ItemOnGround;
/**
 * All the possible states a {@link ItemOnGround} can have.
 */
var State;
(function (State) {
    State[State["SEEN_BY_PLAYER"] = 0] = "SEEN_BY_PLAYER";
    State[State["SEEN_BY_EVERYONE"] = 1] = "SEEN_BY_EVERYONE";
})(State = exports.State || (exports.State = {}));
//# sourceMappingURL=ItemOnGround.js.map