"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketConstants = void 0;
var PacketConstants = /** @class */ (function () {
    function PacketConstants() {
    }
    PacketConstants.TELEPORT_OPCODE = 183;
    PacketConstants.SPECIAL_ATTACK_OPCODE = 184;
    PacketConstants.BUTTON_CLICK_OPCODE = 185;
    PacketConstants.INTERFACE_ACTION_CLICK_OPCODE = 186;
    PacketConstants.SPAWN_TAB_ACTION_OPCODE = 187;
    PacketConstants.REGULAR_CHAT_OPCODE = 4;
    PacketConstants.CLAN_CHAT_OPCODE = 104;
    PacketConstants.DROP_ITEM_OPCODE = 87;
    PacketConstants.FINALIZED_MAP_REGION_OPCODE = 121;
    PacketConstants.CHANGE_MAP_REGION_OPCODE = 210;
    PacketConstants.CLOSE_INTERFACE_OPCODE = 130;
    PacketConstants.EXAMINE_ITEM_OPCODE = 2;
    PacketConstants.EXAMINE_NPC_OPCODE = 6;
    PacketConstants.CHANGE_APPEARANCE = 11;
    PacketConstants.DIALOGUE_OPCODE = 40;
    PacketConstants.ENTER_AMOUNT_OPCODE = 208;
    PacketConstants.ENTER_SYNTAX_OPCODE = 60;
    PacketConstants.EQUIP_ITEM_OPCODE = 41;
    PacketConstants.PLAYER_INACTIVE_OPCODE = 202;
    PacketConstants.CHAT_SETTINGS_OPCODE = 95;
    PacketConstants.COMMAND_OPCODE = 103;
    PacketConstants.COMMAND_MOVEMENT_OPCODE = 98;
    PacketConstants.GAME_MOVEMENT_OPCODE = 164;
    PacketConstants.MINIMAP_MOVEMENT_OPCODE = 248;
    PacketConstants.PICKUP_ITEM_OPCODE = 236;
    PacketConstants.SECOND_GROUNDITEM_OPTION_OPCODE = 235;
    PacketConstants.FIRST_ITEM_CONTAINER_ACTION_OPCODE = 145;
    PacketConstants.SECOND_ITEM_CONTAINER_ACTION_OPCODE = 117;
    PacketConstants.THIRD_ITEM_CONTAINER_ACTION_OPCODE = 43;
    PacketConstants.FOURTH_ITEM_CONTAINER_ACTION_OPCODE = 129;
    PacketConstants.FIFTH_ITEM_CONTAINER_ACTION_OPCODE = 135;
    PacketConstants.SIXTH_ITEM_CONTAINER_ACTION_OPCODE = 138;
    PacketConstants.ADD_FRIEND_OPCODE = 188;
    PacketConstants.REMOVE_FRIEND_OPCODE = 215;
    PacketConstants.ADD_IGNORE_OPCODE = 133;
    PacketConstants.REMOVE_IGNORE_OPCODE = 74;
    PacketConstants.SEND_PM_OPCODE = 126;
    PacketConstants.ATTACK_PLAYER_OPCODE = 153;
    PacketConstants.PLAYER_OPTION_1_OPCODE = 128;
    PacketConstants.PLAYER_OPTION_2_OPCODE = 37;
    PacketConstants.PLAYER_OPTION_3_OPCODE = 227;
    PacketConstants.SWITCH_ITEM_SLOT_OPCODE = 214;
    PacketConstants.FOLLOW_PLAYER_OPCODE = 73;
    PacketConstants.MAGIC_ON_PLAYER_OPCODE = 249;
    PacketConstants.MAGIC_ON_ITEM_OPCODE = 237;
    PacketConstants.MAGIC_ON_GROUND_ITEM_OPCODE = 181;
    PacketConstants.BANK_TAB_CREATION_OPCODE = 216;
    PacketConstants.TRADE_REQUEST_OPCODE = 139;
    PacketConstants.DUEL_REQUEST_OPCODE = 128;
    PacketConstants.CREATION_MENU_OPCODE = 166;
    PacketConstants.SEND_GRAND_EXCHANGE_UPDATE = 200;
    PacketConstants.OBJECT_FIRST_CLICK_OPCODE = 132;
    PacketConstants.OBJECT_SECOND_CLICK_OPCODE = 252;
    PacketConstants.OBJECT_THIRD_CLICK_OPCODE = 70;
    PacketConstants.OBJECT_FOURTH_CLICK_OPCODE = 234;
    PacketConstants.OBJECT_FIFTH_CLICK_OPCODE = 228;
    PacketConstants.ATTACK_NPC_OPCODE = 72;
    PacketConstants.FIRST_CLICK_NPC_OPCODE = 155;
    PacketConstants.MAGE_NPC_OPCODE = 131;
    PacketConstants.SECOND_CLICK_NPC_OPCODE = 17;
    PacketConstants.THIRD_CLICK_NPC_OPCODE = 21;
    PacketConstants.FOURTH_CLICK_NPC_OPCODE = 18;
    PacketConstants.FIRST_ITEM_ACTION_OPCODE = 122;
    PacketConstants.SECOND_ITEM_ACTION_OPCODE = 75;
    PacketConstants.THIRD_ITEM_ACTION_OPCODE = 16;
    PacketConstants.ITEM_ON_NPC = 57;
    PacketConstants.ITEM_ON_ITEM = 53;
    PacketConstants.ITEM_ON_OBJECT = 192;
    PacketConstants.ITEM_ON_GROUND_ITEM = 25;
    PacketConstants.ITEM_ON_PLAYER = 14;
    PacketConstants.PACKETS = new Map([
    // [PacketConstants.TELEPORT_OPCODE, new TeleportPacketListener()],
    // [PacketConstants.SPECIAL_ATTACK_OPCODE, new SpecialAttackPacketListener()],
    // [PacketConstants.BUTTON_CLICK_OPCODE, new ButtonClickPacketListener()],
    // [PacketConstants.INTERFACE_ACTION_CLICK_OPCODE, new InterfaceActionClickOpcode()],
    // [PacketConstants.REGULAR_CHAT_OPCODE, new ChatPacketListener()],
    // [PacketConstants.CLAN_CHAT_OPCODE, new ChatPacketListener()],
    // [PacketConstants.DROP_ITEM_OPCODE, new DropItemPacketListener()],
    // [PacketConstants.FINALIZED_MAP_REGION_OPCODE, new FinalizedMapRegionChangePacketListener()],
    // [PacketConstants.CHANGE_MAP_REGION_OPCODE, new RegionChangePacketListener()],
    // [PacketConstants.CLOSE_INTERFACE_OPCODE, new CloseInterfacePacketListener()],
    // [PacketConstants.EXAMINE_ITEM_OPCODE, new ExamineItemPacketListener()],
    // [PacketConstants.EXAMINE_NPC_OPCODE, new ExamineNpcPacketListener()],
    // [PacketConstants.CHANGE_APPEARANCE, new ChangeAppearancePacketListener()],
    // [PacketConstants.DIALOGUE_OPCODE, new DialoguePacketListener()],
    // [PacketConstants.ENTER_AMOUNT_OPCODE, new EnterInputPacketListener()],
    // [PacketConstants.EQUIP_ITEM_OPCODE, new EquipPacketListener()],
    // [PacketConstants.PLAYER_INACTIVE_OPCODE, new PlayerInactivePacketListener()],
    // [PacketConstants.CHAT_SETTINGS_OPCODE, new ChatSettingsPacketListener()],
    // [PacketConstants.COMMAND_OPCODE, new CommandPacketListener()],
    // [PacketConstants.COMMAND_MOVEMENT_OPCODE, new MovementPacketListener()],
    // [PacketConstants.GAME_MOVEMENT_OPCODE, new MovementPacketListener()],
    // [PacketConstants.MINIMAP_MOVEMENT_OPCODE, new MovementPacketListener()],
    // [PacketConstants.PICKUP_ITEM_OPCODE, new PickupItemPacketListener()],
    // [PacketConstants.SECOND_GROUNDITEM_OPTION_OPCODE, new SecondGroundItemOptionPacketListener()],
    // [PacketConstants.SWITCH_ITEM_SLOT_OPCODE, new SwitchItemSlotPacketListener()],
    // [PacketConstants.FOLLOW_PLAYER_OPCODE, new FollowPlayerPacketListener()],
    // [PacketConstants.MAGIC_ON_PLAYER_OPCODE, new MagicOnPlayerPacketListener()],
    // [PacketConstants.MAGIC_ON_ITEM_OPCODE, new MagicOnItemPacketListener()],
    // [PacketConstants.MAGIC_ON_GROUND_ITEM_OPCODE, new MagicOnItemPacketListener()],
    // [PacketConstants.BANK_TAB_CREATION_OPCODE, new BankTabCreationPacketListener()],
    // [PacketConstants.SPAWN_TAB_ACTION_OPCODE, new SpawnItemPacketListener()],
    // [PacketConstants.FIRST_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.SECOND_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.THIRD_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.FOURTH_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.FIFTH_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.SIXTH_ITEM_CONTAINER_ACTION_OPCODE, new ItemContainerActionPacketListener()],
    // [PacketConstants.ATTACK_PLAYER_OPCODE, new PlayerOptionPacketListener()],
    // [PacketConstants.PLAYER_OPTION_1_OPCODE, new PlayerOptionPacketListener()],
    // [PacketConstants.PLAYER_OPTION_2_OPCODE, new PlayerOptionPacketListener()],
    // [PacketConstants.PLAYER_OPTION_3_OPCODE, new PlayerOptionPacketListener()],
    // [PacketConstants.OBJECT_FIRST_CLICK_OPCODE, new ObjectActionPacketListener()],
    // [PacketConstants.OBJECT_SECOND_CLICK_OPCODE, new ObjectActionPacketListener()],
    // [PacketConstants.OBJECT_THIRD_CLICK_OPCODE, new ObjectActionPacketListener()],
    // [PacketConstants.OBJECT_FOURTH_CLICK_OPCODE, new ObjectActionPacketListener()],
    // [PacketConstants.OBJECT_FIFTH_CLICK_OPCODE, new ObjectActionPacketListener()],
    // [PacketConstants.ATTACK_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.FIRST_CLICK_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.MAGE_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.SECOND_CLICK_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.THIRD_CLICK_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.FOURTH_CLICK_NPC_OPCODE, new NPCOptionPacketListener()],
    // [PacketConstants.FIRST_ITEM_ACTION_OPCODE, new ItemActionPacketListener()],
    // [PacketConstants.SECOND_ITEM_ACTION_OPCODE, new ItemActionPacketListener()],
    // [PacketConstants.THIRD_ITEM_ACTION_OPCODE, new ItemActionPacketListener()],
    // [PacketConstants.ITEM_ON_NPC, new UseItemPacketListener()],
    // [PacketConstants.ITEM_ON_ITEM, new UseItemPacketListener()],
    // [PacketConstants.ITEM_ON_OBJECT, new UseItemPacketListener()],
    // [PacketConstants.ITEM_ON_GROUND_ITEM, new UseItemPacketListener()],
    // [PacketConstants.ITEM_ON_PLAYER, new UseItemPacketListener()],
    // [PacketConstants.ADD_FRIEND_OPCODE, new PlayerRelationPacketListener()],
    // [PacketConstants.REMOVE_FRIEND_OPCODE, new PlayerRelationPacketListener()],
    // [PacketConstants.ADD_IGNORE_OPCODE, new PlayerRelationPacketListener()],
    // [PacketConstants.REMOVE_IGNORE_OPCODE, new PlayerRelationPacketListener()],
    // [PacketConstants.SEND_PM_OPCODE, new PlayerRelationPacketListener()],
    // [PacketConstants.ENTER_AMOUNT_OPCODE, new EnterInputPacketListener()],
    // [PacketConstants.ENTER_SYNTAX_OPCODE, new EnterInputPacketListener()],
    // [PacketConstants.TRADE_REQUEST_OPCODE, new TradeRequestPacketListener()],
    // [PacketConstants.CREATION_MENU_OPCODE, new CreationMenuPacketListener()]
    ]);
    return PacketConstants;
}());
exports.PacketConstants = PacketConstants;
//# sourceMappingURL=PacketConstants.js.map