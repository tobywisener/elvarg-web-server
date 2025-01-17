import { ItemIdentifiers } from '../../../../../../util/ItemIdentifiers'
import { ItemCurrency } from '../../../../../model/container/shop/currency/impl/ItemCurrency'

export class BloodMoneyCurrency extends ItemCurrency {
    constructor() {
        super(ItemIdentifiers.BLOOD_MONEY);
    }
}