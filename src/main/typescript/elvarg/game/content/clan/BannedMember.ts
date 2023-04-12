import { SecondsTimer } from '../../model/SecondsTimer';

export class BannedMember {
    private timer: SecondsTimer;
    private name: string;

    constructor(name: string, seconds: number) {
        this.name = name;
        this.timer = new SecondsTimer();
    }

    public getTimer(): SecondsTimer {
        return this.timer;
    }

    public setTimer(timer: SecondsTimer): void {
        this.timer = timer;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}    