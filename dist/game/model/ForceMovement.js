"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceMovement = void 0;
var ForceMovement = /** @class */ (function () {
    function ForceMovement(start, end, speed, reverseSpeed, direction, animation) {
        this.setStart(start);
        this.setEnd(end);
        this.setSpeed(speed);
        this.setReverseSpeed(reverseSpeed);
        this.setDirection(direction);
        this.setAnimation(animation);
    }
    ForceMovement.prototype.getStart = function () {
        return this.start;
    };
    ForceMovement.prototype.setStart = function (start) {
        this.start = start;
    };
    ForceMovement.prototype.getEnd = function () {
        return this.end;
    };
    ForceMovement.prototype.setEnd = function (end) {
        this.end = end;
    };
    ForceMovement.prototype.getSpeed = function () {
        return this.speed;
    };
    ForceMovement.prototype.setSpeed = function (speed) {
        this.speed = speed;
    };
    ForceMovement.prototype.getReverseSpeed = function () {
        return this.reverseSpeed;
    };
    ForceMovement.prototype.setReverseSpeed = function (reverseSpeed) {
        this.reverseSpeed = reverseSpeed;
    };
    ForceMovement.prototype.getDirection = function () {
        return this.direction;
    };
    ForceMovement.prototype.setDirection = function (direction) {
        this.direction = direction;
    };
    ForceMovement.prototype.getAnimation = function () {
        return this.animation;
    };
    ForceMovement.prototype.setAnimation = function (animation) {
        this.animation = animation;
    };
    return ForceMovement;
}());
exports.ForceMovement = ForceMovement;
//# sourceMappingURL=ForceMovement.js.map