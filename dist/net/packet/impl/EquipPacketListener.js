"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipPacketListener = void 0;
var WeaponInterfaces_1 = require("../../../game/content/combat/WeaponInterfaces");
var Inventory_1 = require("../../../game/model/container/impl/Inventory");
var Item_1 = require("../../../game/model/Item");
var Equipment_1 = require("../../../game/model/container/impl/Equipment");
var Skill_1 = require("../../../game/model/Skill");
var Misc_1 = require("../../../util/Misc");
var Server_1 = require("../../../Server");
var Duelling_1 = require("../../../game/content/Duelling");
var GameConstants_1 = require("../../../game/GameConstants");
var Flag_1 = require("../../../game/model/Flag");
var BonusManager_1 = require("../../../game/model/equipment/BonusManager");
var EquipPacketListener = /** @class */ (function () {
    function EquipPacketListener() {
    }
    EquipPacketListener.resetWeapon = function (player, deactivateSpecialAttack) {
        if (deactivateSpecialAttack) {
            player.setSpecialActivated(false);
        }
        player.getPacketSender().sendSpecialAttackState(false);
        WeaponInterfaces_1.WeaponInterfaces.assign(player);
    };
    EquipPacketListener.prototype.execute = function (player, packet) {
        var id = packet.readShort();
        var slot = packet.readShortA();
        var interfaceId = packet.readShortA();
        EquipPacketListener.equip(player, id, slot, interfaceId);
    };
    EquipPacketListener.equipFromInventory = function (player, itemInSlot) {
        EquipPacketListener.equip(player, itemInSlot.getId(), itemInSlot.getSlot(), Inventory_1.Inventory.INTERFACE_ID);
    };
    EquipPacketListener.equip = function (player, id, slot, interfaceId) {
        var e_1, _a;
        // Validate player..
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        // Validate slot..
        if (slot < 0 || slot >= player.getInventory().capacity()) {
            return;
        }
        // Check if the item in the slot matches the one requested to be wielded..
        var item = player.getInventory().getItems()[slot].clone();
        if (item.getId() != id) {
            return;
        }
        // Close all other interfaces except for the {@code
        // Equipment.EQUIPMENT_SCREEN_INTERFACE_ID} one..
        if (player.getInterfaceId() > 0 && player.getInterfaceId() != Equipment_1.Equipment.EQUIPMENT_SCREEN_INTERFACE_ID) {
            player.getPacketSender().sendInterfaceRemoval();
        }
        // Stop skilling..
        player.getSkillManager().stopSkillable();
        switch (interfaceId) {
            case Inventory_1.Inventory.INTERFACE_ID:
                // Check if player can wield the item..
                if (item.getDefinition().getRequirements() != null) {
                    try {
                        for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var skill = _c.value;
                            if (item.getDefinition().getRequirements()[skill] > player.getSkillManager().getMaxLevel(skill)) {
                                var vowel = skill.getName().match(/^[aeiou]/i) ? 'an' : 'a';
                                player.getPacketSender().sendMessage("You need ".concat(vowel, " ").concat(Misc_1.Misc.formatText(skill.getName()), " level of at least ").concat(item.getDefinition().getRequirements()[skill], " to wear this."));
                                return;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                // Check if the item has a proper equipment slot..
                var equipmentSlot = item.getDefinition().getEquipmentType().getSlot();
                if (equipmentSlot == -1) {
                    Server_1.Server.getLogger()
                        .info("Attempting to equip item " + item.getId() + " which has no defined equipment slot.");
                    return;
                }
                // Handle area equipping behavior
                if (player.getArea() != null && !player.getArea().canEquipItem(player, equipmentSlot, item)) {
                    return;
                }
                // Handle duel arena settings..
                if (player.getDueling().inDuel()) {
                    for (var i = 11; i < player.getDueling().getRules().length; i++) {
                        if (player.getDueling().getRules()[i]) {
                            var duelRule = Duelling_1.DuelRule.forButtonId(i);
                            if (equipmentSlot === duelRule.getEquipmentSlot() || (duelRule === Duelling_1.DuelRule.NO_SHIELD && item.getDefinition().isDoubleHanded())) {
                                // DialogueManager.sendStatement(player, "The rules that were set do not allow this item to be equipped.");
                                return;
                            }
                        }
                    }
                    if (equipmentSlot == Equipment_1.Equipment.WEAPON_SLOT || item.getDefinition().isDoubleHanded()) {
                        if (player.getDueling().getRules()[Duelling_1.DuelRule.forButtonId(0)]) {
                            ////DialogueManager.sendStatement(player, "Weapons have been locked in this duel!");
                            return;
                        }
                    }
                }
                var equipItem = player.getEquipment().forSlot(equipmentSlot).clone();
                if (equipItem.getDefinition().isStackable() && equipItem.getId() == item.getId()) {
                    var amount = equipItem.getAmount() + item.getAmount() <= Number.MAX_VALUE
                        ? equipItem.getAmount() + item.getAmount()
                        : Number.MAX_VALUE;
                    player.getInventory().deleteBoolean(item, false);
                    player.getEquipment().getItems()[equipmentSlot].setAmount(amount);
                    equipItem.setAmount(amount);
                }
                else {
                    if (item.getDefinition().isDoubleHanded() && equipmentSlot == Equipment_1.Equipment.WEAPON_SLOT) {
                        var slotsRequired = player.getEquipment().isSlotOccupied(Equipment_1.Equipment.SHIELD_SLOT)
                            && player.getEquipment().isSlotOccupied(Equipment_1.Equipment.WEAPON_SLOT) ? 1 : 0;
                        if (player.getInventory().getFreeSlots() < slotsRequired) {
                            player.getInventory().full();
                            return;
                        }
                        var shield = player.getEquipment().getItems()[Equipment_1.Equipment.SHIELD_SLOT];
                        var weapon = player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT];
                        player.getEquipment().set(Equipment_1.Equipment.SHIELD_SLOT, new Item_1.Item(-1, 0));
                        // player.getInventory().delete(item);
                        player.getEquipment().set(equipmentSlot, item);
                        if (weapon.getId() != -1) {
                            player.getInventory().setItem(slot, weapon);
                        }
                        else
                            player.getInventory().deletes(item);
                        if (shield.getId() != -1) {
                            player.getInventory().addItem(shield);
                        }
                    }
                    else if (equipmentSlot == Equipment_1.Equipment.SHIELD_SLOT
                        && player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getDefinition().isDoubleHanded()) {
                        player.getInventory().setItem(slot, player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT]);
                        player.getEquipment().setItem(Equipment_1.Equipment.WEAPON_SLOT, new Item_1.Item(-1));
                        player.getEquipment().setItem(Equipment_1.Equipment.SHIELD_SLOT, item);
                        EquipPacketListener.resetWeapon(player, true);
                    }
                    else {
                        if (equipmentSlot == equipItem.getDefinition().getEquipmentType().getSlot()
                            && equipItem.getId() != -1) {
                            if (player.getInventory().contains(equipItem.getId())) {
                                player.getInventory().deleteBoolean(item, false);
                                player.getInventory().add(equipItem, false);
                            }
                            else {
                                player.getInventory().setItem(slot, equipItem);
                            }
                            player.getEquipment().setItem(equipmentSlot, item);
                        }
                        else {
                            player.getInventory().setItem(slot, new Item_1.Item(-1, 0));
                            player.getEquipment().setItem(equipmentSlot, item);
                        }
                    }
                }
                if (equipmentSlot == Equipment_1.Equipment.WEAPON_SLOT) {
                    EquipPacketListener.resetWeapon(player, true);
                }
                if (player.getEquipment().get(Equipment_1.Equipment.WEAPON_SLOT).getId() != 4153) {
                    player.getCombat().reset();
                }
                BonusManager_1.BonusManager.update(player);
                player.getEquipment().refreshItems();
                // Refresh inventory
                if (GameConstants_1.GameConstants.QUEUE_SWITCHING_REFRESH) {
                    player.setUpdateInventory(true);
                }
                else {
                    player.getInventory().refreshItems();
                }
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
                break;
        }
    };
    return EquipPacketListener;
}());
exports.EquipPacketListener = EquipPacketListener;
//# sourceMappingURL=EquipPacketListener.js.map