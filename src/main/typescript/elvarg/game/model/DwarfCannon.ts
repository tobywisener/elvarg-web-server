import { GameObject } from "../entity/impl/object/GameObject";
export class DwarfCannon {
    private ownerIndex: number;
    private object: GameObject;
    private cannonballs: number = 0;
    private cannonFiring: boolean = false;
    private rotations: number = 0;
    constructor(ownerIndex: number, object: GameObject) {
        this.ownerIndex = ownerIndex;
        this.object = object;
    }

    public getOwnerIndex(): number {
        return this.ownerIndex;
    }

    public getObject(): GameObject {
        return this.object;
    }

    public getCannonballs(): number {
        return this.cannonballs;
    }

    public setCannonballs(cannonballs: number): void {
        this.cannonballs = cannonballs;
    }

    public isCannonFiring(): boolean {
        return this.cannonFiring;
    }

    public setCannonFiring(firing: boolean): void {
        this.cannonFiring = firing;
    }

    public getRotations(): number {
        return this.rotations;
    }

    public setRotations(rotations: number): void {
        this.rotations = rotations;
    }

    public addRotation(amount: number): void {
        this.rotations += amount;
    }
}    