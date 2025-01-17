import { PacketExecutor } from "../PacketExecutor";
// import { WeaponInterfaces } from "../../../game/content/combat/WeaponInterfaces";
// import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
// import { ItemInSlot } from "../../../game/model/ItemInSlot";
// import { Inventory } from "../../../game/model/container/impl/Inventory";
// import { Item } from "../../../game/model/Item";
// import { Equipment } from "../../../game/model/container/impl/Equipment";
// import { Skill } from "../../../game/model/Skill";
import { Misc } from "../../../util/Misc";
import { Server } from "../../../Server";
// import { DuelRule } from "../../../game/content/Duelling";
// import { GameConstants } from "../../../game/GameConstants";
// import { Flag } from "../../../game/model/Flag";
// import { BonusManager } from "../../../game/model/equipment/BonusManager";

export class EquipPacketListener implements PacketExecutor {
  // public static resetWeapon(player: Player, deactivateSpecialAttack: boolean) {
  public static resetWeapon(player: any, deactivateSpecialAttack: boolean) {
    if (deactivateSpecialAttack) {
      player.setSpecialActivated(false);
    }
    player.getPacketSender().sendSpecialAttackState(false);
    // WeaponInterfaces.assign(player);
  }

  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    let id = packet.readShort();
    let slot = packet.readShortA();
    let interfaceId = packet.readShortA();

    // EquipPacketListener.equip(player, id, slot, interfaceId);
  }

  // public static equipFromInventory(player: Player, itemInSlot: ItemInSlot) {
  // 	EquipPacketListener.equip(player, itemInSlot.getId(), itemInSlot.getSlot(), Inventory.INTERFACE_ID);
  // }

  // public static equip(player: Player, id, slot: number, interfaceId: number): void{

  // 	// Validate player..
  // 	if (player == null || player.getHitpoints() <= 0) {
  // 		return;
  // 	}

  // 	// Validate slot..
  // 	if (slot < 0 || slot >= player.getInventory().capacity()) {
  // 		return;
  // 	}

  // 	// Check if the item in the slot matches the one requested to be wielded..
  // 	let item: Item = player.getInventory().getItems()[slot].clone();
  // 	if (item.getId() != id) {
  // 		return;
  // 	}

  // 	// Close all other interfaces except for the {@code
  // 	// Equipment.EQUIPMENT_SCREEN_INTERFACE_ID} one..
  // 	if (player.getInterfaceId() > 0 && player.getInterfaceId() != Equipment.EQUIPMENT_SCREEN_INTERFACE_ID) {
  // 		player.getPacketSender().sendInterfaceRemoval();
  // 	}

  // 	// Stop skilling..
  // 	player.getSkillManager().stopSkillable();

  // 	switch (interfaceId) {
  // 		case Inventory.INTERFACE_ID:
  // 			// Check if player can wield the item..
  // 			if (item.getDefinition().getRequirements() != null) {
  // 				for (const skill of Object.values(Skill)) {
  // 					if (item.getDefinition().getRequirements()[skill] > player.getSkillManager().getMaxLevel(skill)) {
  // 					  const vowel = skill.getName().match(/^[aeiou]/i) ? 'an' : 'a';
  // 					  player.getPacketSender().sendMessage(`You need ${vowel} ${Misc.formatText(skill.getName())} level of at least ${item.getDefinition().getRequirements()[skill]} to wear this.`);
  // 					  return;
  // 					}
  // 				  }
  // 			}

  // 			// Check if the item has a proper equipment slot..
  // 			let equipmentSlot: number = item.getDefinition().getEquipmentType().getSlot();
  // 			if (equipmentSlot == -1) {
  // 				Server.getLogger()
  // 					.info("Attempting to equip item " + item.getId() + " which has no defined equipment slot.");
  // 				return;
  // 			}

  // 			// Handle area equipping behavior
  // 			if (player.getArea() != null && !player.getArea().canEquipItem(player, equipmentSlot, item)) {
  // 				return;
  // 			}

  // 			// Handle duel arena settings..
  // 			if (player.getDueling().inDuel()) {
  // 				for (let i: number = 11; i < player.getDueling().getRules().length; i++) {
  // 					if (player.getDueling().getRules()[i]) {
  // 						const duelRule = DuelRule.forButtonId(i);
  // 						if (equipmentSlot === duelRule.getEquipmentSlot() || (duelRule === DuelRule.NO_SHIELD && item.getDefinition().isDoubleHanded())) {
  // 						  // DialogueManager.sendStatement(player, "The rules that were set do not allow this item to be equipped.");
  // 						  return;
  // 						}
  // 					  }
  // 				}
  // 				if (equipmentSlot == Equipment.WEAPON_SLOT || item.getDefinition().isDoubleHanded()) {
  // 					if (player.getDueling().getRules()[DuelRule.forButtonId(0)]) {
  // 						////DialogueManager.sendStatement(player, "Weapons have been locked in this duel!");
  // 						return;
  // 					}
  // 				}
  // 			}

  // 			let equipItem: Item = player.getEquipment().forSlot(equipmentSlot).clone();
  // 			if (equipItem.getDefinition().isStackable() && equipItem.getId() == item.getId()) {
  // 				let amount: number = equipItem.getAmount() + item.getAmount() <= Number.MAX_VALUE
  // 					? equipItem.getAmount() + item.getAmount()
  // 					: Number.MAX_VALUE;
  // 				player.getInventory().deleteBoolean(item, false);
  // 				player.getEquipment().getItems()[equipmentSlot].setAmount(amount);
  // 				equipItem.setAmount(amount);
  // 			} else {
  // 				if (item.getDefinition().isDoubleHanded() && equipmentSlot == Equipment.WEAPON_SLOT) {

  // 					let slotsRequired: number= player.getEquipment().isSlotOccupied(Equipment.SHIELD_SLOT)
  // 						&& player.getEquipment().isSlotOccupied(Equipment.WEAPON_SLOT) ? 1 : 0;
  // 					if (player.getInventory().getFreeSlots() < slotsRequired) {
  // 						player.getInventory().full();
  // 						return;
  // 					}

  // 					let shield: Item = player.getEquipment().getItems()[Equipment.SHIELD_SLOT];
  // 					let weapon: Item = player.getEquipment().getItems()[Equipment.WEAPON_SLOT];
  // 					player.getEquipment().set(Equipment.SHIELD_SLOT, new Item(-1, 0));
  // 					// player.getInventory().delete(item);
  // 					player.getEquipment().set(equipmentSlot, item);

  // 					if (weapon.getId() != -1) {
  // 						player.getInventory().setItem(slot, weapon);
  // 					} else
  // 						player.getInventory().deletes(item);

  // 					if (shield.getId() != -1) {
  // 						player.getInventory().addItem(shield);
  // 					}

  // 				} else if (equipmentSlot == Equipment.SHIELD_SLOT
  // 					&& player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getDefinition().isDoubleHanded()) {
  // 					player.getInventory().setItem(slot, player.getEquipment().getItems()[Equipment.WEAPON_SLOT]);
  // 					player.getEquipment().setItem(Equipment.WEAPON_SLOT, new Item(-1));
  // 					player.getEquipment().setItem(Equipment.SHIELD_SLOT, item);
  // 					EquipPacketListener.resetWeapon(player, true);
  // 				} else {
  // 					if (equipmentSlot == equipItem.getDefinition().getEquipmentType().getSlot()
  // 						&& equipItem.getId() != -1) {
  // 						if (player.getInventory().contains(equipItem.getId())) {
  // 							player.getInventory().deleteBoolean(item, false);
  // 							player.getInventory().add(equipItem, false);
  // 						} else {
  // 							player.getInventory().setItem(slot, equipItem);
  // 						}
  // 						player.getEquipment().setItem(equipmentSlot, item);
  // 					} else {
  // 						player.getInventory().setItem(slot, new Item(-1, 0));
  // 						player.getEquipment().setItem(equipmentSlot, item);
  // 					}
  // 				}
  // 			}

  // 			if (equipmentSlot == Equipment.WEAPON_SLOT) {
  // 				EquipPacketListener.resetWeapon(player, true);
  // 			}

  // 			if (player.getEquipment().get(Equipment.WEAPON_SLOT).getId() != 4153) {
  // 				player.getCombat().reset();
  // 			}

  // 			BonusManager.update(player);
  // 			player.getEquipment().refreshItems();

  // 			// Refresh inventory
  // 			if (GameConstants.QUEUE_SWITCHING_REFRESH) {
  // 				player.setUpdateInventory(true);
  // 			} else {
  // 				player.getInventory().refreshItems();
  // 			}

  // 			player.getUpdateFlag().flag(Flag.APPEARANCE);
  // 			break;
  // 	}
  // }
}
