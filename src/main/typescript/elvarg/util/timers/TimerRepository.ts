import { TimerKey } from '../timers/TimerKey'
import { Timer } from '../timers/Timer'



export class TimerRepository {
    private timer = new Map<TimerKey, Timer>();

    public has(key: TimerKey): boolean {
        let timer = this.timer.get(key);
        return timer !== null && timer.ticks() > 0;
    }

    public register(timer: Timer) {
        this.timer.set(timer.key(), timer);
    }
    
    public registerTimerKey(key: TimerKey): void {
        this.timers().set(key, new Timer(key, key.getTicks()));
    }


    public left(key: TimerKey): number {
        let timer = this.timer.get(key);
        return timer.ticks();
    }

    public willEndIn(key: TimerKey, ticks: number): boolean {
        let timer = this.timer.get(key);
        if (timer === null) {
            return true;
        }
        return timer.ticks() <= ticks;
    }


    public getTicks(key: TimerKey): number {
        let timer = this.timer.get(key);
        if (timer === null) {
            return 0;
        }
        return timer.ticks();
    }

    public registers(key: TimerKey, ticks: number) {
        this.timer.set(key, new Timer(key, ticks));
    }

    public extendOrRegister(key: TimerKey, ticks: number) {
        this.timer.set(key, this.timer.get(key) === null || this.timer.get(key).ticks() < ticks ? new Timer(key, ticks) : this.timer.get(key));
    }
    public addOrSet(key: TimerKey, ticks: number) {
        this.timer.set(key, this.timer.get(key) ? new Timer(key, this.timer.get(key).ticks() + ticks) : new Timer(key, ticks));
    }

    public cancel(name: TimerKey) {
        this.timer.delete(name);
    }

    public process() {
        if (this.timer.size > 0) {
            this.timer.forEach((timer: Timer) => {
                timer.tick();
            });
        }
    }

    public timers(): Map<TimerKey, Timer> {
        return this.timer;
    }
}