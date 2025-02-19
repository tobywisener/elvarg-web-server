// import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
// import { World } from "../../../game/World";
import { PacketConstants } from "../PacketConstants";
// import { CombatSpells } from "../../../game/content/combat/magic/CombatSpells";
// import { PetHandler } from "../../../game/content/PetHandler";
// import { QuestHandler } from "../../../game/content/quests/QuestHandler";
// import { Fishing, FishingTool } from '../../../game/content/skill/skillable/impl/Fishing'
// import  Thieving  from "../../../game/content/skill/skillable/impl/Thieving"
// import { ParduDialogue } from '../../../game/model/dialogues/builders/impl/ParduDialogue'
// import { PlayerRights } from "../../../game/model/rights/PlayerRights";
// import { NPCInteractionSystem } from "../../../game/entity/impl/npc/NPCInteractionSystem";
// import { ShopManager } from "../../../game/model/container/shop/ShopManager";
// import { NPC } from "../../../game/entity/impl/npc/NPC";
// import { EmblemTraderDialogue } from "../../../game/model/dialogues/builders/impl/EmblemTraderDialogue";
// import { ShopIdentifiers } from "../../../util/ShopIdentifiers";
// import { NieveDialogue } from '../../../game/model/dialogues/builders/impl/NieveDialogue'
import { NpcIdentifiers } from "../../../util/NpcIdentifiers";

export class NPCOptionPacketListener {
  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    if (player.busy()) {
      return;
    }

    let index = packet.readLEShortA();

    // if (index < 0 || index > World.getNpcs().capacityReturn()) {
    //     return;
    // }

    // const npc = World.getNpcs().get(index);

    // if (!npc) {
    //     return;
    // }

    // if (!player.getLocation().isWithinDistance(npc.getLocation(), 24)) {
    //     return;
    // }

    // if (player.getRights() == PlayerRights.DEVELOPER) {
    //     player.getPacketSender().sendMessage("InteractionInfo Id=" + npc.getId() + " " + npc.getLocation().toString());
    // }

    // player.setPositionToFace(npc.getLocation());

    if (
      packet.getOpcode() === PacketConstants.ATTACK_NPC_OPCODE ||
      packet.getOpcode() === PacketConstants.MAGE_NPC_OPCODE
    ) {
      // if (!npc.getCurrentDefinition().isAttackable()) {
      //     return;
      // }
      // if (npc.getHitpoints() <= 0) {
      //     player.getMovementQueue().reset();
      //     return;
      // }

      if (packet.getOpcode() === PacketConstants.MAGE_NPC_OPCODE) {
        let spellId = packet.readShortA();

        // let spell = CombatSpells.getCombatSpell(spellId);

        // if (!spell) {
        //     player.getMovementQueue().reset();
        //     return;
        // }

        // player.setPositionToFace(npc.getLocation());

        // player.getCombat().setCastSpell(spell);
      }

      // player.getCombat().attack(npc);
      return;
    }

    // player.getMovementQueue().walkToEntity(npc, () => this.handleInteraction(player, npc, packet));
  }

  // private handleInteraction(player: Player, npc: NPC, packet: Packet) {
  //     const opcode = packet.getOpcode();
  //     npc.setMobileInteraction(player);

  //     npc.setPositionToFace(player.getLocation());

  //     if (opcode === PacketConstants.FIRST_CLICK_NPC_OPCODE) {
  //         if (PetHandler.interact(player, npc)) {
  //             return;
  //         }

  //         if (QuestHandler.firstClickNpc(player, npc)) {
  //             return;
  //         }

  //         if (NPCInteractionSystem.handleFirstOption(player, npc)) {
  //             return;
  //         }

  //         switch (npc.getId()) {
  //             case NpcIdentifiers.SHOP_KEEPER_4:
  //                 ShopManager.opens(player, ShopIdentifiers.GENERAL_STORE);
  //                 break;
  //             case NpcIdentifiers.CHARLIE_THE_COOK:
  //                 ShopManager.opens(player, ShopIdentifiers.FOOD_SHOP);
  //                 break;
  //             case NpcIdentifiers.RICK:
  //                 ShopManager.opens(player, ShopIdentifiers.PURE_SHOP);
  //                 break;
  //             case NpcIdentifiers.AJJAT:
  //                 ShopManager.opens(player, ShopIdentifiers.ARMOR_SHOP);
  //                 break;
  //             case NpcIdentifiers.MAGIC_INSTRUCTOR:
  //                 ShopManager.opens(player, ShopIdentifiers.MAGE_ARMOR_SHOP);
  //                 break;
  //             case NpcIdentifiers.ARMOUR_SALESMAN:
  //                 ShopManager.opens(player, ShopIdentifiers.RANGE_SHOP);
  //                 break;
  //             case NpcIdentifiers.BANKER_2:
  //             case NpcIdentifiers.TZHAAR_KET_ZUH:
  //                 player.getBank(player.getCurrentBankTab()).open();
  //                 break;
  //             case NpcIdentifiers.MAKE_OVER_MAGE:
  //                 player.getPacketSender().sendInterfaceRemoval().sendInterface(3559);
  //                 player.getAppearance().setCanChangeAppearance(true);
  //                 break;
  //             case NpcIdentifiers.SECURITY_GUARD:
  //                 //DialogueManager.start(player, 2500);
  //                 break;
  //             case NpcIdentifiers.EMBLEM_TRADER:
  //             case NpcIdentifiers.EMBLEM_TRADER_2:
  //             case NpcIdentifiers.EMBLEM_TRADER_3:
  //                 player.getDialogueManager().startDialogues(new EmblemTraderDialogue());
  //                 break;

  //             case NpcIdentifiers.PERDU:
  //                 player.getDialogueManager().startDialogues(new ParduDialogue());
  //                 break;

  //             case NpcIdentifiers.FINANCIAL_ADVISOR:
  //                 //DialogueManager.start(player, 15);
  //                 // Removed
  //                 break;
  //             case NpcIdentifiers.NIEVE:
  //                 player.getDialogueManager().startDialogues(new NieveDialogue());
  //                 break;
  //         }
  //         return;
  //     }
  //     if (opcode == PacketConstants.SECOND_CLICK_NPC_OPCODE) {
  //         if (PetHandler.pickup(player, npc)) {
  //             // Player is picking up their pet
  //             return;
  //         }

  //         if (Thieving.Pickpocketing.init(player, npc)) {
  //             // Player is trying to thieve from an NPC
  //             return;
  //         }

  //         if (NPCInteractionSystem.handleSecondOption(player, npc)) {
  //             // Player is interacting with a defined NPC
  //             return;
  //         }

  //         switch (npc.getId()) {
  //             case NpcIdentifiers.NIEVE:
  //                 player.getDialogueManager().startDialog(new NieveDialogue(), 2);
  //                 break;
  //             case NpcIdentifiers.BANKER:
  //             case NpcIdentifiers.BANKER_2:
  //             case NpcIdentifiers.BANKER_3:
  //             case NpcIdentifiers.BANKER_4:
  //             case NpcIdentifiers.BANKER_5:
  //             case NpcIdentifiers.BANKER_6:
  //             case NpcIdentifiers.BANKER_7:
  //             case NpcIdentifiers.TZHAAR_KET_ZUH:
  //                 player.getBank(player.getCurrentBankTab()).open();
  //                 break;
  //             case 1497: // Net and bait
  //             case 1498: // Net and bait
  //                 player.getSkillManager().startSkillable(new Fishing(npc, FishingTool.FISHING_ROD));
  //                 break;
  //             case NpcIdentifiers.RICHARD_2:
  //                 ShopManager.opens(player, ShopIdentifiers.TEAMCAPE_SHOP);
  //                 break;
  //             case NpcIdentifiers.EMBLEM_TRADER:
  //             case NpcIdentifiers.EMBLEM_TRADER_2:
  //             case NpcIdentifiers.EMBLEM_TRADER_3:
  //                 ShopManager.opens(player, ShopIdentifiers.PVP_SHOP);
  //                 break;
  //             case NpcIdentifiers.MAGIC_INSTRUCTOR:
  //                 ShopManager.opens(player, ShopIdentifiers.MAGE_ARMOR_SHOP);
  //                 break;

  //         }
  //         return;
  //     }

  //     if (opcode == PacketConstants.THIRD_CLICK_NPC_OPCODE) {
  //         if (PetHandler.morph(player, npc)) {
  //             // Player is morphing their pet
  //             return;
  //         }

  //         if (NPCInteractionSystem.handleThirdOption(player, npc)) {
  //             // Player is interacting with a defined NPC
  //             return;
  //         }

  //         switch (npc.getId()) {

  //             case NpcIdentifiers.EMBLEM_TRADER:
  //                 player.getDialogueManager().startDialog(new EmblemTraderDialogue(), 2);
  //                 break;
  //             case NpcIdentifiers.MAGIC_INSTRUCTOR:
  //                 ShopManager.opens(player, ShopIdentifiers.MAGE_RUNES_SHOP);
  //                 break;
  //         }
  //         return;
  //     }

  //     if (opcode == PacketConstants.FOURTH_CLICK_NPC_OPCODE) {
  //         if (NPCInteractionSystem.handleForthOption(player, npc)) {
  //             // Player is interacting with a defined NPC
  //             return;
  //         }

  //         switch (npc.getId()) {
  //             case NpcIdentifiers.EMBLEM_TRADER:
  //                 player.getDialogueManager().startDialog(new EmblemTraderDialogue(), 5);
  //                 break;
  //         }
  //         return;
  //     }
  // }
}
