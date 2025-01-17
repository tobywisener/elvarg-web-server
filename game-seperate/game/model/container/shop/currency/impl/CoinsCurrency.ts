import { ItemIdentifiers } from '../../../../../../util/ItemIdentifiers'
import { ItemCurrency } from '../../../../../model/container/shop/currency/impl/ItemCurrency'

export class CoinsCurrency extends ItemCurrency {
    constructor() {
        super(ItemIdentifiers.COINS);
    }
}