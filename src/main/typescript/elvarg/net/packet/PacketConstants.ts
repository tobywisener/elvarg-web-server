import { PacketExecutor } from "./PacketExecutor";
import { SpecialAttackPacketListener } from '../packet/impl/SpecialAttackPacketListener'
import { ButtonClickPacketListener } from '../packet/impl/ButtonClickPacketListener'
import { InterfaceActionClickOpcode } from '../packet/impl/InterfaceActionClickOpcode'
import { ChatPacketListener } from '../packet/impl/ChatPacketListener'
import { DropItemPacketListener } from '../packet/impl/DropItemPacketListener'
import { FinalizedMapRegionChangePacketListener } from '../packet/impl/FinalizedMapRegionChangePacketListener'
import { RegionChangePacketListener } from '../packet/impl/RegionChangePacketListener'
import { CloseInterfacePacketListener } from '../packet/impl/CloseInterfacePacketListener'
import { ExamineItemPacketListener } from '../packet/impl/ExamineItemPacketListener'
import { ExamineNpcPacketListener } from '../packet/impl/ExamineNpcPacketListener'
import { ChangeAppearancePacketListener } from '../packet/impl/ChangeAppearancePacketListener'
import { EnterInputPacketListener } from '../packet/impl/EnterInputPacketListener'
import { EquipPacketListener } from '../packet/impl/EquipPacketListener'
import { DialoguePacketListener } from '../packet/impl/DialoguePacketListener'
import { PlayerInactivePacketListener } from '../packet/impl/PlayerInactivePacketListener'
import { ChatSettingsPacketListener } from '../packet/impl/ChatSettingsPacketListener'
import { CommandPacketListener } from '../packet/impl/CommandPacketListener'
import { MovementPacketListener } from '../packet/impl/MovementPacketListener'
import { PickupItemPacketListener } from '../packet/impl/PickupItemPacketListener'
import { SecondGroundItemOptionPacketListener } from '../packet/impl/SecondGroundItemOptionPacketListener'
import { SwitchItemSlotPacketListener } from '../packet/impl/SwitchItemSlotPacketListener'
import { FollowPlayerPacketListener } from '../packet/impl/FollowPlayerPacketListener'
import { MagicOnPlayerPacketListener } from '../packet/impl/MagicOnPlayerPacketListener'
import { MagicOnItemPacketListener } from '../packet/impl/MagicOnItemPacketListener'
import { BankTabCreationPacketListener } from '../packet/impl/BankTabCreationPacketListener'
import { SpawnItemPacketListener } from '../packet/impl/SpawnItemPacketListener'
import { PlayerOptionPacketListener } from '../packet/impl/PlayerOptionPacketListener'
import { ObjectActionPacketListener } from '../../net/packet/impl/ObjectActionPacketListener'
import { NPCOptionPacketListener } from '../../net/packet/impl/NPCOptionPacketListener'
import { ItemActionPacketListener } from '../../net/packet/impl/ItemActionPacketListener'
import { UseItemPacketListener } from '../../net/packet/impl/UseItemPacketListener'
import { PlayerRelationPacketListener } from '../../net/packet/impl/PlayerRelationPacketListener'
import { TradeRequestPacketListener } from '../../net/packet/impl/TradeRequestPacketListener'
import { CreationMenuPacketListener } from '../../net/packet/impl/CreationMenuPacketListener'
import { TeleportPacketListener } from '../../net/packet/impl/TeleportPacketListener'
import { ItemContainerActionPacketListener } from '../../net/packet/impl/ItemContainerActionPacketListener'

export class PacketConstants {
	public static readonly PACKETS: PacketExecutor[] = new Array(257);
	public static readonly TELEPORT_OPCODE = 183;
	public static readonly SPECIAL_ATTACK_OPCODE = 184;
	public static readonly BUTTON_CLICK_OPCODE = 185;
	public static readonly INTERFACE_ACTION_CLICK_OPCODE = 186;
	public static readonly SPAWN_TAB_ACTION_OPCODE = 187;
	public static readonly REGULAR_CHAT_OPCODE = 4;
	public static readonly CLAN_CHAT_OPCODE = 104;
	public static readonly DROP_ITEM_OPCODE = 87;
	public static readonly FINALIZED_MAP_REGION_OPCODE = 121;
	public static readonly CHANGE_MAP_REGION_OPCODE = 210;
	public static readonly CLOSE_INTERFACE_OPCODE = 130;
	public static readonly EXAMINE_ITEM_OPCODE = 2;
	public static readonly EXAMINE_NPC_OPCODE = 6;
	public static readonly CHANGE_APPEARANCE = 11;
	public static readonly DIALOGUE_OPCODE = 40;
	public static readonly ENTER_AMOUNT_OPCODE = 208;
	public static readonly ENTER_SYNTAX_OPCODE = 60;
	public static readonly EQUIP_ITEM_OPCODE = 41;
	public static readonly PLAYER_INACTIVE_OPCODE = 202;
	public static readonly CHAT_SETTINGS_OPCODE = 95;
	public static readonly COMMAND_OPCODE = 103;
	public static readonly COMMAND_MOVEMENT_OPCODE = 98;
	public static readonly GAME_MOVEMENT_OPCODE = 164;
	public static readonly MINIMAP_MOVEMENT_OPCODE = 248;
	public static readonly PICKUP_ITEM_OPCODE = 236;
	public static readonly SECOND_GROUNDITEM_OPTION_OPCODE = 235;
	public static readonly FIRST_ITEM_CONTAINER_ACTION_OPCODE = 145;
	public static readonly SECOND_ITEM_CONTAINER_ACTION_OPCODE = 117;
	public static readonly THIRD_ITEM_CONTAINER_ACTION_OPCODE = 43;
	public static readonly FOURTH_ITEM_CONTAINER_ACTION_OPCODE = 129;
	public static readonly FIFTH_ITEM_CONTAINER_ACTION_OPCODE = 135;
	public static readonly SIXTH_ITEM_CONTAINER_ACTION_OPCODE = 138;
	public static readonly ADD_FRIEND_OPCODE = 188;
	public static readonly REMOVE_FRIEND_OPCODE = 215;
	public static readonly ADD_IGNORE_OPCODE = 133;
	public static readonly REMOVE_IGNORE_OPCODE = 74;
	public static readonly SEND_PM_OPCODE = 126;
	public static readonly ATTACK_PLAYER_OPCODE = 153;
	public static readonly PLAYER_OPTION_1_OPCODE = 128;
	public static readonly PLAYER_OPTION_2_OPCODE = 37;
	public static readonly PLAYER_OPTION_3_OPCODE = 227;
	public static readonly SWITCH_ITEM_SLOT_OPCODE = 214;
	public static readonly FOLLOW_PLAYER_OPCODE = 73;
	public static readonly MAGIC_ON_PLAYER_OPCODE = 249;
	public static readonly MAGIC_ON_ITEM_OPCODE = 237;
	public static readonly MAGIC_ON_GROUND_ITEM_OPCODE = 181;
	public static readonly BANK_TAB_CREATION_OPCODE = 216;
	public static readonly TRADE_REQUEST_OPCODE = 139;
	public static readonly DUEL_REQUEST_OPCODE = 128;
	public static readonly CREATION_MENU_OPCODE = 166;
	public static readonly SEND_GRAND_EXCHANGE_UPDATE = 200;
	public static readonly OBJECT_FIRST_CLICK_OPCODE = 132;
	public static readonly OBJECT_SECOND_CLICK_OPCODE = 252;
	public static readonly OBJECT_THIRD_CLICK_OPCODE = 70;
	public static readonly OBJECT_FOURTH_CLICK_OPCODE = 234;
	public static readonly OBJECT_FIFTH_CLICK_OPCODE = 228;
	public static readonly ATTACK_NPC_OPCODE = 72;
	public static readonly FIRST_CLICK_NPC_OPCODE = 155;
	public static readonly MAGE_NPC_OPCODE = 131;
	public static readonly SECOND_CLICK_NPC_OPCODE = 17;
	public static readonly THIRD_CLICK_NPC_OPCODE = 21;
	public static readonly FOURTH_CLICK_NPC_OPCODE = 18;
	public static readonly FIRST_ITEM_ACTION_OPCODE = 122;
	public static readonly SECOND_ITEM_ACTION_OPCODE = 75;
	public static readonly THIRD_ITEM_ACTION_OPCODE = 16;
	public static readonly ITEM_ON_NPC = 57; 
	public static readonly ITEM_ON_ITEM = 53;
	public static readonly ITEM_ON_OBJECT = 192;
	public static readonly ITEM_ON_GROUND_ITEM = 25;
	public static readonly ITEM_ON_PLAYER = 14;

	static {
		this.PACKETS[this.TELEPORT_OPCODE] = new TeleportPacketListener();
        this.PACKETS[this.SPECIAL_ATTACK_OPCODE] = new SpecialAttackPacketListener();
        this.PACKETS[this.BUTTON_CLICK_OPCODE] = new ButtonClickPacketListener();
        this.PACKETS[this.INTERFACE_ACTION_CLICK_OPCODE] = new InterfaceActionClickOpcode();
        this.PACKETS[this.REGULAR_CHAT_OPCODE] = new ChatPacketListener();
        this.PACKETS[this.CLAN_CHAT_OPCODE] = new ChatPacketListener();
        this.PACKETS[this.DROP_ITEM_OPCODE] = new DropItemPacketListener();
		this.PACKETS[this.FINALIZED_MAP_REGION_OPCODE] = new FinalizedMapRegionChangePacketListener();
		this.PACKETS[this.CHANGE_MAP_REGION_OPCODE] = new RegionChangePacketListener();
		this.PACKETS[this.CLOSE_INTERFACE_OPCODE] = new CloseInterfacePacketListener();
		this.PACKETS[this.EXAMINE_ITEM_OPCODE] = new ExamineItemPacketListener();
		this.PACKETS[this.EXAMINE_NPC_OPCODE] = new ExamineNpcPacketListener();
		this.PACKETS[this.CHANGE_APPEARANCE] = new ChangeAppearancePacketListener();
		this.PACKETS[this.DIALOGUE_OPCODE] = new DialoguePacketListener();
		this.PACKETS[this.ENTER_AMOUNT_OPCODE] = new EnterInputPacketListener();
		this.PACKETS[this.EQUIP_ITEM_OPCODE] = new EquipPacketListener();
		this.PACKETS[this.PLAYER_INACTIVE_OPCODE] = new PlayerInactivePacketListener();
		this.PACKETS[this.CHAT_SETTINGS_OPCODE] = new ChatSettingsPacketListener();
		this.PACKETS[this.COMMAND_OPCODE] = new CommandPacketListener();
		this.PACKETS[this.COMMAND_MOVEMENT_OPCODE] = new MovementPacketListener();
		this.PACKETS[this.GAME_MOVEMENT_OPCODE] = new MovementPacketListener();
		this.PACKETS[this.MINIMAP_MOVEMENT_OPCODE] = new MovementPacketListener();
		this.PACKETS[this.PICKUP_ITEM_OPCODE] = new PickupItemPacketListener();
		this.PACKETS[this.SECOND_GROUNDITEM_OPTION_OPCODE] = new SecondGroundItemOptionPacketListener();
		this.PACKETS[this.SWITCH_ITEM_SLOT_OPCODE] = new SwitchItemSlotPacketListener();
		this.PACKETS[this.FOLLOW_PLAYER_OPCODE] = new FollowPlayerPacketListener();
		this.PACKETS[this.MAGIC_ON_PLAYER_OPCODE] = new MagicOnPlayerPacketListener();
		this.PACKETS[this.MAGIC_ON_ITEM_OPCODE] = new MagicOnItemPacketListener();
		this.PACKETS[this.MAGIC_ON_GROUND_ITEM_OPCODE] = new MagicOnItemPacketListener();
		this.PACKETS[this.BANK_TAB_CREATION_OPCODE] = new BankTabCreationPacketListener();
		this.PACKETS[this.SPAWN_TAB_ACTION_OPCODE] = new SpawnItemPacketListener();

		this.PACKETS[this.FIRST_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		this.PACKETS[this.SECOND_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		this.PACKETS[this.THIRD_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		this.PACKETS[this.FOURTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		this.PACKETS[this.FIFTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		this.PACKETS[this.SIXTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();

		this.PACKETS[this.ATTACK_PLAYER_OPCODE] = new PlayerOptionPacketListener();
		this.PACKETS[this.PLAYER_OPTION_1_OPCODE] = new PlayerOptionPacketListener();
		this.PACKETS[this.PLAYER_OPTION_2_OPCODE] = new PlayerOptionPacketListener();
		this.PACKETS[this.PLAYER_OPTION_3_OPCODE] = new PlayerOptionPacketListener();

		this.PACKETS[this.OBJECT_FIRST_CLICK_OPCODE] = new ObjectActionPacketListener();
		this.PACKETS[this.OBJECT_SECOND_CLICK_OPCODE] = new ObjectActionPacketListener();
		this.PACKETS[this.OBJECT_THIRD_CLICK_OPCODE] = new ObjectActionPacketListener();
		this.PACKETS[this.OBJECT_FOURTH_CLICK_OPCODE] = new ObjectActionPacketListener();
		this.PACKETS[this.OBJECT_FIFTH_CLICK_OPCODE] = new ObjectActionPacketListener();

		this.PACKETS[this.ATTACK_NPC_OPCODE] = new NPCOptionPacketListener();
		this.PACKETS[this.FIRST_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		this.PACKETS[this.MAGE_NPC_OPCODE] = new NPCOptionPacketListener();
		this.PACKETS[this.SECOND_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		this.PACKETS[this.THIRD_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		this.PACKETS[this.FOURTH_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();

		this.PACKETS[this.FIRST_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();
		this.PACKETS[this.SECOND_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();
		this.PACKETS[this.THIRD_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();

		this.PACKETS[this.ITEM_ON_NPC] = new UseItemPacketListener();
		this.PACKETS[this.ITEM_ON_ITEM] = new UseItemPacketListener();
		this.PACKETS[this.ITEM_ON_OBJECT] = new UseItemPacketListener();
		this.PACKETS[this.ITEM_ON_GROUND_ITEM] = new UseItemPacketListener();
		this.PACKETS[this.ITEM_ON_PLAYER] = new UseItemPacketListener();

		this.PACKETS[this.ADD_FRIEND_OPCODE] = new PlayerRelationPacketListener();
		this.PACKETS[this.REMOVE_FRIEND_OPCODE] = new PlayerRelationPacketListener();
		this.PACKETS[this.ADD_IGNORE_OPCODE] = new PlayerRelationPacketListener();
		this.PACKETS[this.REMOVE_IGNORE_OPCODE] = new PlayerRelationPacketListener();
		this.PACKETS[this.SEND_PM_OPCODE] = new PlayerRelationPacketListener();

		this.PACKETS[this.ENTER_AMOUNT_OPCODE] = new EnterInputPacketListener();
		this.PACKETS[this.ENTER_SYNTAX_OPCODE] = new EnterInputPacketListener();

		this.PACKETS[this.TRADE_REQUEST_OPCODE] = new TradeRequestPacketListener();
		this.PACKETS[this.CREATION_MENU_OPCODE] = new CreationMenuPacketListener();
	}
}