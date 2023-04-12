"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCOptionPacketListener = void 0;
var World_1 = require("../../../game/World");
var PacketConstants_1 = require("../PacketConstants");
var CombatSpells_1 = require("../../../game/content/combat/magic/CombatSpells");
var PetHandler_1 = require("../../../game/content/PetHandler");
var QuestHandler_1 = require("../../../game/content/quests/QuestHandler");
var Fishing_1 = require("../../../game/content/skill/skillable/impl/Fishing");
var Thieving_1 = require("../../../game/content/skill/skillable/impl/Thieving");
var ParduDialogue_1 = require("../../../game/model/dialogues/builders/impl/ParduDialogue");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var NPCInteractionSystem_1 = require("../../../game/entity/impl/npc/NPCInteractionSystem");
var ShopManager_1 = require("../../../game/model/container/shop/ShopManager");
var EmblemTraderDialogue_1 = require("../../../game/model/dialogues/builders/impl/EmblemTraderDialogue");
var ShopIdentifiers_1 = require("../../../util/ShopIdentifiers");
var NieveDialogue_1 = require("../../../game/model/dialogues/builders/impl/NieveDialogue");
var NpcIdentifiers_1 = require("../../../util/NpcIdentifiers");
var NPCOptionPacketListener = /** @class */ (function () {
    function NPCOptionPacketListener() {
    }
    NPCOptionPacketListener.prototype.execute = function (player, packet) {
        var _this = this;
        if (player.busy()) {
            return;
        }
        var index = packet.readLEShortA();
        if (index < 0 || index > World_1.World.getNpcs().capacityReturn()) {
            return;
        }
        var npc = World_1.World.getNpcs().get(index);
        if (!npc) {
            return;
        }
        if (!player.getLocation().isWithinDistance(npc.getLocation(), 24)) {
            return;
        }
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("InteractionInfo Id=" + npc.getId() + " " + npc.getLocation().toString());
        }
        player.setPositionToFace(npc.getLocation());
        if (packet.getOpcode() === PacketConstants_1.PacketConstants.ATTACK_NPC_OPCODE || packet.getOpcode() === PacketConstants_1.PacketConstants.MAGE_NPC_OPCODE) {
            if (!npc.getCurrentDefinition().isAttackable()) {
                return;
            }
            if (npc.getHitpoints() <= 0) {
                player.getMovementQueue().reset();
                return;
            }
            if (packet.getOpcode() === PacketConstants_1.PacketConstants.MAGE_NPC_OPCODE) {
                var spellId = packet.readShortA();
                var spell = CombatSpells_1.CombatSpells.getCombatSpell(spellId);
                if (!spell) {
                    player.getMovementQueue().reset();
                    return;
                }
                player.setPositionToFace(npc.getLocation());
                player.getCombat().setCastSpell(spell);
            }
            player.getCombat().attack(npc);
            return;
        }
        player.getMovementQueue().walkToEntity(npc, function () { return _this.handleInteraction(player, npc, packet); });
    };
    NPCOptionPacketListener.prototype.handleInteraction = function (player, npc, packet) {
        var opcode = packet.getOpcode();
        npc.setMobileInteraction(player);
        npc.setPositionToFace(player.getLocation());
        if (opcode === PacketConstants_1.PacketConstants.FIRST_CLICK_NPC_OPCODE) {
            if (PetHandler_1.PetHandler.interact(player, npc)) {
                return;
            }
            if (QuestHandler_1.QuestHandler.firstClickNpc(player, npc)) {
                return;
            }
            if (NPCInteractionSystem_1.NPCInteractionSystem.handleFirstOption(player, npc)) {
                return;
            }
            switch (npc.getId()) {
                case NpcIdentifiers_1.NpcIdentifiers.SHOP_KEEPER_4:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.GENERAL_STORE);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.CHARLIE_THE_COOK:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.FOOD_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.RICK:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.PURE_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.AJJAT:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.ARMOR_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.MAGIC_INSTRUCTOR:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.MAGE_ARMOR_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.ARMOUR_SALESMAN:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.RANGE_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_2:
                case NpcIdentifiers_1.NpcIdentifiers.TZHAAR_KET_ZUH:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.MAKE_OVER_MAGE:
                    player.getPacketSender().sendInterfaceRemoval().sendInterface(3559);
                    player.getAppearance().setCanChangeAppearance(true);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.SECURITY_GUARD:
                    //DialogueManager.start(player, 2500);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER:
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER_2:
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER_3:
                    player.getDialogueManager().startDialogues(new EmblemTraderDialogue_1.EmblemTraderDialogue());
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.PERDU:
                    player.getDialogueManager().startDialogues(new ParduDialogue_1.ParduDialogue());
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.FINANCIAL_ADVISOR:
                    //DialogueManager.start(player, 15);
                    // Removed
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.NIEVE:
                    player.getDialogueManager().startDialogues(new NieveDialogue_1.NieveDialogue());
                    break;
            }
            return;
        }
        if (opcode == PacketConstants_1.PacketConstants.SECOND_CLICK_NPC_OPCODE) {
            if (PetHandler_1.PetHandler.pickup(player, npc)) {
                // Player is picking up their pet
                return;
            }
            if (Thieving_1.default.Pickpocketing.init(player, npc)) {
                // Player is trying to thieve from an NPC
                return;
            }
            if (NPCInteractionSystem_1.NPCInteractionSystem.handleSecondOption(player, npc)) {
                // Player is interacting with a defined NPC
                return;
            }
            switch (npc.getId()) {
                case NpcIdentifiers_1.NpcIdentifiers.NIEVE:
                    player.getDialogueManager().startDialog(new NieveDialogue_1.NieveDialogue(), 2);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.BANKER:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_2:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_3:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_4:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_5:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_6:
                case NpcIdentifiers_1.NpcIdentifiers.BANKER_7:
                case NpcIdentifiers_1.NpcIdentifiers.TZHAAR_KET_ZUH:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                case 1497: // Net and bait
                case 1498: // Net and bait
                    player.getSkillManager().startSkillable(new Fishing_1.Fishing(npc, Fishing_1.FishingTool.FISHING_ROD));
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.RICHARD_2:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.TEAMCAPE_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER:
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER_2:
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER_3:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.PVP_SHOP);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.MAGIC_INSTRUCTOR:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.MAGE_ARMOR_SHOP);
                    break;
            }
            return;
        }
        if (opcode == PacketConstants_1.PacketConstants.THIRD_CLICK_NPC_OPCODE) {
            if (PetHandler_1.PetHandler.morph(player, npc)) {
                // Player is morphing their pet
                return;
            }
            if (NPCInteractionSystem_1.NPCInteractionSystem.handleThirdOption(player, npc)) {
                // Player is interacting with a defined NPC
                return;
            }
            switch (npc.getId()) {
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER:
                    player.getDialogueManager().startDialog(new EmblemTraderDialogue_1.EmblemTraderDialogue(), 2);
                    break;
                case NpcIdentifiers_1.NpcIdentifiers.MAGIC_INSTRUCTOR:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.MAGE_RUNES_SHOP);
                    break;
            }
            return;
        }
        if (opcode == PacketConstants_1.PacketConstants.FOURTH_CLICK_NPC_OPCODE) {
            if (NPCInteractionSystem_1.NPCInteractionSystem.handleForthOption(player, npc)) {
                // Player is interacting with a defined NPC
                return;
            }
            switch (npc.getId()) {
                case NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER:
                    player.getDialogueManager().startDialog(new EmblemTraderDialogue_1.EmblemTraderDialogue(), 5);
                    break;
            }
            return;
        }
    };
    return NPCOptionPacketListener;
}());
exports.NPCOptionPacketListener = NPCOptionPacketListener;
//# sourceMappingURL=NPCOptionPacketListener.js.map