import { SlayerMaster } from './SlayerMaster';
import { SlayerTask } from './SlayerTask';
export class ActiveSlayerTask {
    private master: SlayerMaster;
    private task: SlayerTask;
    private remaining: number;

    constructor(master: SlayerMaster, task: SlayerTask, amount: number) {
        this.master = master;
        this.task = task;
        this.remaining = amount;
    }

    public getMaster(): SlayerMaster {
        return this.master;
    }

    public getTask(): SlayerTask {
        return this.task;
    }

    public setRemaining(amount: number): void {
        this.remaining = amount;
    }

    public getRemaining(): number {
        return this.remaining;
    }
}