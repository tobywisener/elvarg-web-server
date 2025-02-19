export class HitDamageCache {
    private startTime: any;
    private endTime: any;
    private damage: number;

    constructor(damage: number) {
        this.damage = damage;
    }

    public getDamage(): number {
        return this.damage;
    }

    public incrementDamage(damage: number): void {
        this.startTime = performance.now();
        this.damage += damage;
        this.endTime = performance.now();
    }

    public getStopwatch(): number {
        return this.endTime - this.startTime;
    }
}
