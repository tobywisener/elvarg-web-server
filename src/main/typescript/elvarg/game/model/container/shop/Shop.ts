import { ShopCurrencies } from '../shop/currency/ShopCurrencies'
import { Item } from '../../Item';
import { ShopCurrency } from './currency/ShopCurrency';
import { ShopManager } from './ShopManager';

export class Shop {
    public static SALES_TAX_MODIFIER = 0.85;
    public static MAX_SHOP_ITEMS = 1000;
    public static MAX_SHOPS = 5000;
    public static INTERFACE_ID = 3824;
    public static ITEM_CHILD_ID = 3900;
    public static NAME_INTERFACE_CHILD_ID = 3901;
    public static INVENTORY_INTERFACE_ID = 3823;
    public static SCROLL_BAR_INTERFACE_ID = 29995;
    public static INFINITY = 2000000000;
    public static CURRENCY_COINS = ShopCurrencies.COINS;
    
    public id: number;
    public name: string;
    public originalStock: Item[];
    public currentStock: Item[] = new Array(Shop.MAX_SHOP_ITEMS);
    private restocking: boolean;
    public currency: ShopCurrency;

    constructor(name: string, originalStock: Item[], currency?: ShopCurrency);
    constructor(id: number, name: string, originalStock: Item[], currency?: ShopCurrency);
    constructor(...args: any[]) {
        if (args.length === 2 || args.length === 3) {
          // Constructor with optional currency parameter
          if (args.length === 3) {
            this.currency = args[2];
          } else {
            this.currency = ShopCurrencies.COINS;
          }
          this.id = ShopManager.generateUnusedId();
          this.name = args[0];
          this.originalStock = args[1];
          this.currentStock = this.originalStock.map(item => item.clone());
        } else if (args.length === 4) {
          // Constructor with all parameters
          this.id = args[0];
          this.name = args[1];
          this.originalStock = args[2];
          this.currentStock = this.originalStock.map(item => item.clone());
          this.currency = args[3];
        } else {
          throw new Error('Invalid constructor parameters');
        }
      }
    
    removeItem(itemId: number, amount: number) {
        for (let i = 0; i < this.currentStock.length; i++) {
            let item = this.currentStock[i];
            if (!item) continue;
            if (item.getId() === itemId) {
                item.setAmount(item.getAmount() - amount);
                if (item.getAmount() <= 1) {
                    if (ShopManager.deletesItems(this.id)) {
                        this.currentStock[i] = null;
                    } else {
                        item.setAmount(1);
                    }
                }
                break;
            }
        }
    }

    addItem(itemId: number, amount: number) {
        let found = false;
        for (let item of this.currentStock) {
            if (!item) continue;
            if (item.getId() === itemId) {
                let amt = item.getAmount() + amount;
                if (amt < Number.MAX_SAFE_INTEGER) {
                    item.setAmount(item.getAmount() + amount);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            for (let i = 0; i < this.currentStock.length; i++) {
                if (!this.currentStock[i]) {
                    this.currentStock[i] = new Item(itemId, amount);
                    break;
                }
            }
        }
    }
    
    isFull(): boolean {
        let amount = 0;
        for (let item of this.currentStock) {
            if (!item) continue;
            amount++;
        }
        return (amount >= Shop.MAX_SHOP_ITEMS);
    }
    
    getAmount(itemId: number, fromOriginalStock: boolean): number {
        if (!fromOriginalStock) {
            for (let item of this.currentStock) {
                if (!item) continue;
                if (item.getId() === itemId) {
                    return item.getAmount();
                }
            }
        } else {
            for (let item of this.originalStock) {
                if (item.getId() === itemId) {
                    return item.getAmount();
                }
            }
        }
        return 0;
    }

    getCurrentStockList(): Item[] {
        let list: Item[] = [];
        for (let item of this.currentStock) {
            if (!item) continue;
            list.push(item);
        }
        return list;
    }
    
    getId(): number {
        return this.id;
    }
    
    getName(): string {
        return this.name;
    }
    
    getCurrency(): ShopCurrency {
        return this.currency;
    }
    
    getCurrentStock(): Item[] {
        return this.currentStock;
    }
    
    getOriginalStock(): Item[] {
        return this.originalStock;
    }
    
    isRestocking(): boolean {
        return this.restocking;
    }
    
    setRestocking(restocking: boolean) {
        this.restocking = restocking;
    }
}

