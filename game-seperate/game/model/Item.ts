import { ItemDefinition } from '../definition/ItemDefinition';

export class Item {

    public id: number;
    public amount: number;

    /**
 * An Item object constructor.
 *
 * @param id     Item id.
 * @param amount Item amount.
 * 
 */

    constructor(id: number, amount?: number) {
        this.id = id;
        this.amount = amount != null ? amount : 1;
    }

    /**
     * Gets the item's id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Sets the item's id.
     *
     * @param id New item id.
     */
    public setId(id: number): Item {
        this.id = id;
        return this;
    }

    public getAmount(): number {
        return this.amount;
    }
    /**
* Sets the amount of the item.
*/
    public setAmount(amount: number): Item {
        this.amount = amount;
        return this;
    }

    /**
     * Checks if this item is valid or not.
     *
     * @return
     */
    public isValid(): boolean {
        return this.id > 0 && this.amount > 0;
    }

    /**
     * Increment the amount by 1.
     */
    public incrementAmount(): void {
        if ((this.amount + 1) > Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.amount++;
    }

    /**
     * Decrement the amount by 1.
     */
    public decrementAmount(): void {
        if ((this.amount - 1) < 0) {
            return;
        }
        this.amount--;
    }

    public incrementAmountBy(amount: number): void {
        if ((this.amount + amount) > Number.MAX_SAFE_INTEGER) {
            this.amount = Number.MAX_SAFE_INTEGER;
        } else {
            this.amount += amount;
        }
    }

    /**
* Decrement the amount by the specified amount.
*/
    public decrementAmountBy(amount: number): void {
        if ((this.amount - amount) < 1) {
            this.amount = 0;
        } else {
            this.amount -= amount;
        }
    }

    public getDefinition(): ItemDefinition {
        return ItemDefinition.forId(this.id);
    }

    public clone(): Item {
        return new Item(this.id, this.amount);
    }

    public equals(o: any): boolean {
        if (!(o instanceof Item))
            return false;
        let item = o as Item;
        return item.getId() == this.getId() && item.getAmount() == this.getAmount();
    }


}