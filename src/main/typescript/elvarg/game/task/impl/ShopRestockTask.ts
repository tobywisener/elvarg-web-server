import { ShopManager } from '../../model/container/shop/ShopManager'
import { Shop } from '../../model/container/shop/Shop'
import { Misc } from '../../../util/Misc'
import { Task } from '../Task';

export class ShopRestockTask extends Task {

    constructor(private shop: Shop) {
        super();
        this.shop = shop;
    }

    private static restockCalc(overflow: number, curr: number): number {
        let missing = overflow - curr;
        let amount = (missing * 0.3);
        if (amount < 1) {
            amount = 1;
        }
        return amount;
    }

    execute() {
        let items: number[] = [];
        for (let item of Misc.concat(this.shop.getCurrentStock(), this.shop.getOriginalStock())) {
            if (item == null)
                continue;
            let itemId = item.getId();
            if (!items.includes(itemId)) {
                items.push(itemId);
            }
        }

        let performedUpdate = false;

        for (let itemId of items) {
            let originalAmount = this.shop.getAmount(itemId, true);
            let currentAmount = this.shop.getAmount(itemId, false);

            // If we have too many in stock, delete some..
            if (currentAmount > originalAmount) {
                this.shop.removeItem(itemId, ShopRestockTask.restockCalc(currentAmount, originalAmount));
                performedUpdate = true;
            }

            // If we have too few in stock, add some..
            else if (currentAmount < originalAmount) {
                if (ShopManager.restocksItem(this.shop.getId())) {
                    this.shop.addItem(itemId, ShopRestockTask.restockCalc(originalAmount, currentAmount));
                    performedUpdate = true;
                }
            }
        }

        if (performedUpdate) {
            ShopManager.refresh(this.shop);
        } else {
            this.stop();
        }
    }

    stop() {
        this.stop();
        this.shop.setRestocking(false);
    }
}