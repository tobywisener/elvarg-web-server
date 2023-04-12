import { Misc } from "../../../util/Misc";
import { Bank } from "../../../game/model/container/impl/Bank";
import { Player } from "../../../game/entity/impl/player/Player";
import { ItemDefinition } from "../../../game/definition/ItemDefinition";
import { PacketExecutor } from "../PacketExecutor";
import { Packet } from "../Packet";

export class ExamineItemPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let itemId = packet.readShort();
        let interfaceId = packet.readInt();

        if (itemId == 995 || itemId == 13307) {
            let amount = player.getInventory().getAmount(itemId);
            if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
                let fromBankTab = interfaceId - Bank.CONTAINER_START;
                amount = player.getBank(fromBankTab).getAmount(itemId);
            }
            player.getPacketSender().sendMessage("@red@"
                + Misc.insertCommasToNumber("" + amount + "") + "x coins.");
            return;
        }
        if (itemId == 12926) {
            player.getPacketSender()
                .sendMessage("Fires Dragon darts while coating them with venom. Charges left: "
                    + player.getBlowpipeScales());
            return;
        }
        let itemDef = ItemDefinition.forId(itemId);
        if (itemDef != null) {
            player.getPacketSender().sendMessage(itemDef.getExamine());
        }
    }
}
