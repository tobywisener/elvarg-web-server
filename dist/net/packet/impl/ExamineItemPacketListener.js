"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamineItemPacketListener = void 0;
var Misc_1 = require("../../../util/Misc");
var ExamineItemPacketListener = /** @class */ (function () {
    function ExamineItemPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    ExamineItemPacketListener.prototype.execute = function (player, packet) {
        var itemId = packet.readShort();
        var interfaceId = packet.readInt();
        if (itemId == 995 || itemId == 13307) {
            var amount = player.getInventory().getAmount(itemId);
            // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
            //     let fromBankTab = interfaceId - Bank.CONTAINER_START;
            //     amount = player.getBank(fromBankTab).getAmount(itemId);
            // }
            player
                .getPacketSender()
                .sendMessage("@red@" + Misc_1.Misc.insertCommasToNumber("" + amount + "") + "x coins.");
            return;
        }
        if (itemId == 12926) {
            player
                .getPacketSender()
                .sendMessage("Fires Dragon darts while coating them with venom. Charges left: " +
                player.getBlowpipeScales());
            return;
        }
        // let itemDef = ItemDefinition.forId(itemId);
        // if (itemDef != null) {
        //     player.getPacketSender().sendMessage(itemDef.getExamine());
        // }
    };
    return ExamineItemPacketListener;
}());
exports.ExamineItemPacketListener = ExamineItemPacketListener;
//# sourceMappingURL=ExamineItemPacketListener.js.map