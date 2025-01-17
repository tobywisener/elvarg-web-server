"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicOnItemPacketListener = void 0;
var PacketConstants_1 = require("../PacketConstants");
var MagicOnItemPacketListener = /** @class */ (function () {
    function MagicOnItemPacketListener() {
    }
    // public execute(player: Player, packet: Packet) {
    MagicOnItemPacketListener.prototype.execute = function (player, packet) {
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.MAGIC_ON_ITEM_OPCODE:
                var slot = packet.readShort();
                var itemId = packet.readShortA();
                var childId = packet.readShort();
                var spellId = packet.readShortA();
                if (!player.getClickDelay().elapsedTime(1300))
                    return;
                if (slot < 0 || slot >= player.getInventory().capacity())
                    return;
                if (player.getInventory().getItems()[slot].getId() != itemId)
                    return;
                // let spell = EffectSpells.forSpellId(spellId);
                // if (!spell) {
                //     return;
                // }
                var item = player.getInventory().getItems()[slot];
            // switch (spell) {
            //     case EffectSpells.LOW_ALCHEMY:
            //     case EffectSpells.HIGH_ALCHEMY:
            //         if (!item.getDefinition().isTradeable() || !item.getDefinition().isSellable() || item.getId() == 995
            //                 || item.getDefinition().getHighAlchValue() <= 0 || item.getDefinition().getLowAlchValue() <= 0) {
            //             player.getPacketSender().sendMessage("This spell can not be cast on this item.");
            //             return;
            //         }
            //         if (!EffectSpells.getSpell().canCast(player, true)) {
            //             return;
            //         }
            //         player.getInventory().deleteNumber(itemId, 1);
            //         player.performAnimation(new Animation(712));
            //         if (spell == EffectSpells.LOW_ALCHEMY) {
            //             player.getInventory().adds(995, item.getDefinition().getLowAlchValue());
            //         } else {
            //             player.getInventory().adds(995, item.getDefinition().getHighAlchValue());
            //         }
            //         player.performGraphic(new Graphic(112, GraphicHeight.HIGH));
            //         player.getSkillManager().addExperiences(Skill.MAGIC, EffectSpells.getSpell().baseExperience());
            //         player.getPacketSender().sendTab(6);
            //         break;
            //     default:
            //         break;
            // }
        }
    };
    return MagicOnItemPacketListener;
}());
exports.MagicOnItemPacketListener = MagicOnItemPacketListener;
//# sourceMappingURL=MagicOnItemPacketListener.js.map