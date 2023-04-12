import { Player } from '../../../game/entity/impl/player/Player';
import { PlayerStatus } from '../../../game/model/PlayerStatus';
import { Bank } from '../../../game/model/container/impl/Bank';
import { Packet } from '../../packet/Packet';
import { PacketExecutor } from '../../packet/PacketExecutor';

export class BankTabCreationPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let interfaceId = packet.readInt();
        let fromSlot = packet.readShort();
        let to_tab = packet.readShort();

        let fromBankTab = interfaceId - Bank.CONTAINER_START;
        if (fromBankTab >= 0 && fromBankTab < Bank.TOTAL_BANK_TABS) {
            if (player.getStatus() == PlayerStatus.BANKING && player.getInterfaceId() == 5292) {

                if (player.isSearchingBank()) {
                    fromBankTab = Bank.BANK_SEARCH_TAB_INDEX;
                }

                let item = player.getBank(fromBankTab).getItems()[fromSlot].clone();
                if (fromBankTab != Bank.getTabForItem(player, item.getId())) {
                    return;
                }

                //Let's move the item to the new tab
                let slot = player.getBank(fromBankTab).getSlotForItemId(item.getId());
                if (slot != fromSlot) {
                    return;
                }

                //Temporarily disable note whilst we do switch
                let note = player.withdrawAsNote();
                player.setNoteWithdrawal(false);

                //Make the item switch
                player.getBank(fromBankTab).switchItem(player.getBank(to_tab), item, false, slot, false);

                //Re-set the note var
                player.setNoteWithdrawal(note);

                //Update all tabs
                Bank.reconfigureTabs(player);

                //Refresh items in our current tab
                if (!player.isSearchingBank()) {
                    player.getBank(player.getCurrentBankTab()).refreshItems();
                }
            }
        }
    }
}
