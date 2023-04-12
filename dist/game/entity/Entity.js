"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var GameConstants_1 = require("../../game/GameConstants");
var PrivateArea_1 = require("../../game/model/areas/impl/PrivateArea");
var Entity = exports.Entity = /** @class */ (function () {
    /**
     * The Entities constructor.
     *
     * @param position The position the entity is currently in.
     */
    function Entity(position) {
        Entity.location = position;
    }
    /**
     * Gets the entity position.
     *
     * @return the entity's world position
     */
    Entity.prototype.getLocation = function () {
        return Entity.location;
    };
    /**
     * Sets the entity position
     *
     * @param location the world position
     */
    Entity.prototype.setLocation = function (location) {
        Entity.location = location;
        return this;
    };
    Entity.prototype.setArea = function (area) {
        Entity.area = area;
    };
    Entity.prototype.getArea = function () {
        return Entity.area;
    };
    Entity.prototype.getPrivateArea = function () {
        return (Entity.area instanceof PrivateArea_1.PrivateArea ? Entity.area : null);
    };
    /**
     * Represents the {@link Location} of this {@link Entities}.
     */
    Entity.location = GameConstants_1.GameConstants.DEFAULT_LOCATION.clone();
    return Entity;
}());
//# sourceMappingURL=Entity.js.map