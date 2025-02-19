"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamineNpcPacketListener = void 0;
// import { NpcDefinition } from "../../../game/definition/NpcDefinition";
var ExamineNpcPacketListener = /** @class */ (function () {
    function ExamineNpcPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    ExamineNpcPacketListener.prototype.execute = function (player, packet) {
        var npcId = packet.readShort();
        if (npcId <= 0) {
            return;
        }
        // let npcDef = NpcDefinition.forId(npcId);
        // if (npcDef != null) {
        //     player.getPacketSender().sendMessage(npcDef.getExamine());
        // }
    };
    return ExamineNpcPacketListener;
}());
exports.ExamineNpcPacketListener = ExamineNpcPacketListener;
//# sourceMappingURL=ExamineNpcPacketListener.js.map