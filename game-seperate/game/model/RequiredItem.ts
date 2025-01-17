import {Item} from "./Item";
export class RequiredItem {
    private item: Item;
    private delete: boolean;

    constructor(item: Item, Delete?: boolean) {
        this.item = item;
        this.delete = Delete;
    }

    public getItem(): Item {
        return this.item;
    }
    
    public isDelete(): boolean {
        return this.delete;
    }
}    