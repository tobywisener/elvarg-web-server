import { TaskType } from "./TaskType";
export abstract class Task {
    public static DEFAULT_KEY = new Object();
    private immediate: boolean;
    private delay: number;
    private countdown: number;
    public type: TaskType;
    private running = false;
    public key: object;

    constructor();
    constructor(immediate: boolean);
    constructor(delay: number);
    constructor(delay: number, type: TaskType);
    constructor(delay: number, immediate: boolean);
    constructor(delay: number, key: any);
    constructor(delay: number, key: any, immediate: boolean);
    constructor(
        delay?: number | boolean,
        arg2?: boolean | TaskType | any,
        arg3?: boolean
    ) {}

    private bind(key: object): void {
        this.key = key;
    }

    isImmediate(): boolean {
        return this.immediate;
    }

    isRunning(): boolean {
        return this.running;
    }

    isStopped(): boolean {
        return !this.running;
    }

    tick(): boolean {
        if (this.running && (this.countdown == 0 || --this.countdown == 0)) {
            this.execute();
            this.countdown = this.delay;
        }
        this.onTick();
        return this.running;
    }

    onTick() { }

    abstract execute(): void;

    getDelay(): number {
        return this.delay;
    }

    getRemainingTicks(): number {
        return this.countdown;
    }

    setDelay(delay: number) {
        if (delay > 0) this.delay = delay;
    }

    setRunning(running: boolean) {
        this.running = running;
    }

    stop() {
        this.running = false;
    }
}
