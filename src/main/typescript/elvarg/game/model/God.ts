const Gods = {
    ARMADYL: [],
    BANDOS: [],
    SARADOMIN: [],
    ZAMORAK: [],
}

export class God {
    private items: number[];
    constructor(items: number[]) {
        this.items = items;
    }
    public getItems(): number[] {
        return this.items;
    }
}