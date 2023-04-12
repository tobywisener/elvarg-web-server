import { Item } from "../model/Item";
import { ShopCurrencies } from "../model/container/shop/currency/ShopCurrencies";

export class ShopDefinition {

    private id: number;
    private name: string = "";
    private originalStock: Item[];
    private currency: ShopCurrencies;

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getOriginalStock(): Item[] {
        return this.originalStock;
    }

    public getCurrency(): ShopCurrencies {
        return this.currency;
    }
}