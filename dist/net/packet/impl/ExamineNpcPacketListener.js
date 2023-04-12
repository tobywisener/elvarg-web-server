"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamineNpcPacketListener = void 0;
var NpcDefinition_1 = require("../../../game/definition/NpcDefinition");
var ExamineNpcPacketListener = /** @class */ (function () {
    function ExamineNpcPacketListener() {
    }
    ExamineNpcPacketListener.prototype.execute = function (player, packet) {
        var npcId = packet.readShort();
        if (npcId <= 0) {
            return;
        }
        var npcDef = NpcDefinition_1.NpcDefinition.forId(npcId);
        if (npcDef != null) {
            player.getPacketSender().sendMessage(npcDef.getExamine());
        }
    };
    return ExamineNpcPacketListener;
}());
exports.ExamineNpcPacketListener = ExamineNpcPacketListener;
//# sourceMappingURL=ExamineNpcPacketListener.js.map