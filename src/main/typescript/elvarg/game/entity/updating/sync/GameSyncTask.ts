import { World } from '../../../World'

export abstract class GameSyncTask {
    private players: boolean;
    private concurrent: boolean;

    constructor(players: boolean, concurrent?: boolean) {
        this.players = players;
        this.concurrent = concurrent;
        this.players = true
    }


    public abstract execute(index: number): void;

    public checkIndex(index: number): boolean {
        return (this.players ? World.getPlayers().get(index) != null : World.getNpcs().get(index) != null);
    }

    public getAmount(): number {
        return (this.players ? World.getPlayers().sizeReturn() : World.getNpcs().sizeReturn());
    }

    public getCapacity(): number {
        return (this.players ? World.getPlayers().capacityReturn() : World.getNpcs().capacityReturn());
    }

    public isConcurrent(): boolean {
        return this.concurrent;
    }
}
