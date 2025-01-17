// import { EffectSpells } from '../../../game/content/combat/magic/EffectSpells';
// import { Animation } from '../../../game/model/Animation';
// import { Graphic } from '../../../game/model/Graphic';
// import { GraphicHeight } from '../../../game/model/GraphicHeight';
// import { Skill } from '../../../game/model/Skill';
// import { Player } from '../../../game/entity/impl/player/Player';
import { Packet } from "../Packet";
import { PacketConstants } from "../PacketConstants";

export class MagicOnItemPacketListener {
  // public execute(player: Player, packet: Packet) {
  public execute(player: any, packet: Packet) {
    switch (packet.getOpcode()) {
      case PacketConstants.MAGIC_ON_ITEM_OPCODE:
        let slot = packet.readShort();
        let itemId = packet.readShortA();
        let childId = packet.readShort();
        let spellId = packet.readShortA();
        if (!player.getClickDelay().elapsedTime(1300)) return;
        if (slot < 0 || slot >= player.getInventory().capacity()) return;
        if (player.getInventory().getItems()[slot].getId() != itemId) return;
        // let spell = EffectSpells.forSpellId(spellId);
        // if (!spell) {
        //     return;
        // }
        let item = player.getInventory().getItems()[slot];
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
  }
}
