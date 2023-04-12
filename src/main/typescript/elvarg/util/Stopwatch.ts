export class Stopwatch {
    private time: number = Date.now();

    constructor() {
        this.time = 0;
    }

    public start(startAt?: number): void {
        this.time = Date.now() - startAt;
    }

    public reset(i?: number): Stopwatch {
        this.time = i? i: Date.now();
        return this;
    }


    public Hasreset(): void {
        this.time = Date.now();
    }

    public elapsed(): number {
        return Date.now() - this.time;
    }

    public elapsedTime(time: number) {
        return this.elapsed() >= time;
    }

    public hasElapsed(time: number): boolean {
        return this.elapsed() >= time;
    }

    public getTime(): number {
        return this.time;
    }
}