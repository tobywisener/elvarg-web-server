"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DwarfCannon = void 0;
var DwarfCannon = /** @class */ (function () {
    function DwarfCannon(ownerIndex, object) {
        this.cannonballs = 0;
        this.cannonFiring = false;
        this.rotations = 0;
        this.ownerIndex = ownerIndex;
        this.object = object;
    }
    DwarfCannon.prototype.getOwnerIndex = function () {
        return this.ownerIndex;
    };
    DwarfCannon.prototype.getObject = function () {
        return this.object;
    };
    DwarfCannon.prototype.getCannonballs = function () {
        return this.cannonballs;
    };
    DwarfCannon.prototype.setCannonballs = function (cannonballs) {
        this.cannonballs = cannonballs;
    };
    DwarfCannon.prototype.isCannonFiring = function () {
        return this.cannonFiring;
    };
    DwarfCannon.prototype.setCannonFiring = function (firing) {
        this.cannonFiring = firing;
    };
    DwarfCannon.prototype.getRotations = function () {
        return this.rotations;
    };
    DwarfCannon.prototype.setRotations = function (rotations) {
        this.rotations = rotations;
    };
    DwarfCannon.prototype.addRotation = function (amount) {
        this.rotations += amount;
    };
    return DwarfCannon;
}());
exports.DwarfCannon = DwarfCannon;
//# sourceMappingURL=DwarfCannon.js.map