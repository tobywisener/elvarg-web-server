
import { TimerKey } from "./TimerKey";

export class Timer {
    private Key: TimerKey;
    private Ticks: number;
    
    constructor(Key: TimerKey, Ticks: number) {
        this.Key = Key;
        this.Ticks = Ticks;
    }
    
    public ticks(): number {
        return this.Ticks;
    }
    
    public key(): TimerKey {
        return this.Key;
    }
    
    public tick(): void {
        if (this.Ticks > 0) {
            this.Ticks--;
        }
    }
}