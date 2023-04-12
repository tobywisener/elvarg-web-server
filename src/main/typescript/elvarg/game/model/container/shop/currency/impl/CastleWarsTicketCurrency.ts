import { ItemIdentifiers } from '../../../../../../util/ItemIdentifiers'
import { ItemCurrency } from '../../../../../model/container/shop/currency/impl/ItemCurrency'

export class CastleWarsTicketCurrency extends ItemCurrency {
    constructor() {
        super(ItemIdentifiers.CASTLE_WARS_TICKET);
    }
}