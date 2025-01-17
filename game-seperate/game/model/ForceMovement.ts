import { Location } from "./Location";

export class ForceMovement {
    public start: Location;
    public end: Location;
    public speed: number;
    public reverseSpeed: number;
    public direction: number;
    public animation: number;

    constructor(start: Location, end: Location, speed: number, reverseSpeed: number, direction: number, animation: number) {
        this.setStart(start);
        this.setEnd(end);
        this.setSpeed(speed);
        this.setReverseSpeed(reverseSpeed);
        this.setDirection(direction);
        this.setAnimation(animation);
    }

    public getStart(): Location {
        return this.start;
    }

    public setStart(start: Location): void {
        this.start = start;
    }

    public getEnd(): Location {
        return this.end;
    }

    public setEnd(end: Location): void {
        this.end = end;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public getReverseSpeed(): number {
        return this.reverseSpeed;
    }

    public setReverseSpeed(reverseSpeed: number): void {
        this.reverseSpeed = reverseSpeed;
    }

    public getDirection(): number {
        return this.direction;
    }

    public setDirection(direction: number): void {
        this.direction = direction;
    }

    public getAnimation(): number {
        return this.animation;
    }

    public setAnimation(animation: number): void {
        this.animation = animation;
    }

}