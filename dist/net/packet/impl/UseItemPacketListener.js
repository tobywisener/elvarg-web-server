"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseItemPacketListener = void 0;
// import { Herblore } from "../../../game/content/skill/skillable/impl/Herblore";
// import { Fletching } from "../../../game/content/skill/skillable/impl/Fletching";
// import { ItemIdentifiers } from "../../../util/ItemIdentifiers";
// import { CombatFactory } from "../../../game/content/combat/CombatFactory";
// import { World } from "../../../game/World";
// import { NPCInteractionSystem } from "../../../game/entity/impl/npc/NPCInteractionSystem";
// import { ObjectIdentifiers } from "../../../util/ObjectIdentifiers";
// import { WebHandler } from "../../../game/entity/impl/object/impl/WebHandler";
// import { CastleWars } from "../../../game/content/minigames/impl/CastleWars";
// import { Bank } from "../../../game/model/container/impl/Bank";
// import { BuriableBone, AltarOffering } from "../../../game/content/skill/skillable/impl/Prayer";
// import { CreationMenu } from "../../../game/model/menu/CreationMenu";
// import { ItemOnGroundManager } from "../../../game/entity/impl/grounditem/ItemOnGroundManager";
// import { PacketConstants } from "../PacketConstants";
// import { Location } from "../../../game/model/Location";
// import { MapObjects } from "../../../game/entity/impl/object/MapObjects";
// import { Cooking, Cookable } from "../../../game/content/skill/skillable/impl/Cooking";
// import { Firemaking, LightableLog } from "../../../game/content/skill/skillable/impl/Firemaking";
// import { CreationMenuAction } from "../../../game/model/menu/CreationMenu";
// import { Action } from "../../../game/model/Action";
// class UseItemCreationMenuAction implements CreationMenuAction{
var UseItemCreationMenuAction = /** @class */ (function () {
    function UseItemCreationMenuAction(execFunc) {
        this.execFunc = execFunc;
    }
    UseItemCreationMenuAction.prototype.execute = function (item, amount) {
        this.execFunc();
    };
    return UseItemCreationMenuAction;
}());
// class UseItemAction implements Action{
var UseItemAction = /** @class */ (function () {
    function UseItemAction(execFunc) {
        this.execFunc = execFunc;
    }
    UseItemAction.prototype.execute = function () {
        this.execFunc();
    };
    return UseItemAction;
}());
var UseItemPacketListener = /** @class */ (function () {
    function UseItemPacketListener() {
    }
    // private static itemOnItem(player: Player, packet: Packet) {
    UseItemPacketListener.itemOnItem = function (player, packet) {
        var usedWithSlot = packet.readUnsignedShort();
        var itemUsedSlot = packet.readUnsignedShortA();
        if (usedWithSlot < 0 ||
            itemUsedSlot < 0 ||
            itemUsedSlot >= player.getInventory().capacity() ||
            usedWithSlot >= player.getInventory().capacity())
            return;
        var used = player.getInventory()[itemUsedSlot];
        var usedWith = player.getInventory()[usedWithSlot];
        player.getPacketSender().sendInterfaceRemoval();
        player.getSkillManager().stopSkillable();
        //Herblore
        // if (Herblore.makeUnfinishedPotion(player, used.getId(), usedWith.getId())
        //     || Herblore.finishPotion(player, used.getId(), usedWith.getId())
        //     || Herblore.concatenate(player, used, usedWith)) {
        //     return;
        // }
        //Fletching
        // if (Fletching.fletchLog(player, used.getId(), usedWith.getId())
        //     || Fletching.stringBow(player, used.getId(), usedWith.getId())
        //     || Fletching.fletchAmmo(player, used.getId(), usedWith.getId())
        //     || Fletching.fletchCrossbow(player, used.getId(), usedWith.getId())) {
        //     return;
        // }
        // if ((used.getId() === ItemIdentifiers.DRAGON_DEFENDER || usedWith.getId() === ItemIdentifiers.DRAGON_DEFENDER)
        //     && (used.getId() === ItemIdentifiers.AVERNIC_DEFENDER_HILT || usedWith.getId() === ItemIdentifiers.AVERNIC_DEFENDER_HILT)) {
        //     if (player.busy() || CombatFactory.inCombat(player)) {
        //         player.getPacketSender().sendMessage("You cannot do that right now.");
        //         return;
        //     }
        //     if (player.getInventory().contains(ItemIdentifiers.DRAGON_DEFENDER) && player.getInventory().contains(ItemIdentifiers.AVERNIC_DEFENDER_HILT)) {
        //         player.getInventory().deleteNumber(ItemIdentifiers.DRAGON_DEFENDER, 1).deleteNumber(ItemIdentifiers.AVERNIC_DEFENDER_HILT, 1).adds(ItemIdentifiers.AVERNIC_DEFENDER, 1);
        //         player.getPacketSender().sendMessage("You attach your Avernic hilt onto the Dragon defender..");
        //     }
        //     return;
        // }
        //Blowpipe reload
        // else if (used.getId() === ItemIdentifiers.TOXIC_BLOWPIPE || usedWith.getId() === ItemIdentifiers.TOXIC_BLOWPIPE) {
        //     let reload = used.getId() === ItemIdentifiers.TOXIC_BLOWPIPE ? usedWith.getId() : used.getId();
        //     if (reload === ItemIdentifiers.ZULRAHS_SCALES) {
        //         const amount = player.getInventory().getAmount(12934);
        //         player.incrementBlowpipeScales(amount);
        //         player.getInventory().deleteNumber(ItemIdentifiers.ZULRAHS_SCALES, amount);
        //         player.getPacketSender().sendMessage(`You now have ${player.getBlowpipeScales()} Zulrah scales in your blowpipe.`);
        //     } else {
        //         player.getPacketSender().sendMessage("You cannot load the blowpipe with that!");
        //     }
        // }
    };
    // public static itemOnNpc(player: Player, packet: Packet) {
    UseItemPacketListener.itemOnNpc = function (player, packet) {
        var id = packet.readShortA();
        var index = packet.readShortA();
        var slot = packet.readLEShort();
        // if (index < 0 || index > World.getNpcs().capacityReturn()) {
        //     return;
        // }
        if (slot < 0 || slot > player.getInventory().getItems().length) {
            return;
        }
        // let npc = World.getNpcs().get(index);
        // if (npc == null) {
        //     return;
        // }
        var item = player.getInventory().getItems()[slot];
        if (item == null || item.getId() !== id) {
            return;
        }
        // player.getMovementQueue().walkToEntity(npc, () => {
        //     if (NPCInteractionSystem.handleUseItem(player, npc, id, slot)) {
        //         // Player is using an item on a defined NPC
        //         return;
        //     }
        //     switch (id) {
        //         default:
        //             player.getPacketSender().sendMessage("Nothing interesting happens.");
        //             break;
        //     }
        // });
    };
    // private static itemOnObject(player: Player, packet: Packet) {
    UseItemPacketListener.itemOnObject = function (player, packet) {
        var interfaceType = packet.readShort();
        var objectId = packet.readShort();
        var objectY = packet.readLEShortA();
        var itemSlot = packet.readLEShort();
        var objectX = packet.readLEShortA();
        var itemId = packet.readShort();
        if (itemSlot < 0 || itemSlot >= player.getInventory().capacity())
            return;
        var item = player.getInventory().getItems()[itemSlot];
        if (item == null || item.getId() !== itemId)
            return;
        // const position = new Location(objectX, objectY, player.getLocation().getZ());
        // const object = MapObjects.getPrivateArea(player, objectId, position);
        // // Make sure the object actually exists in the region...
        // if (object == null) {
        //     return;
        // }
        // //Update facing..
        // player.setPositionToFace(position);
        //Handle object..
        // player.getMovementQueue().walkToObject(object, new UseItemAction(() => {
        //     switch (object.getId()) {
        //         case ObjectIdentifiers.STOVE_4: //Edgeville Stove
        //         case ObjectIdentifiers.FIRE_5: //Player-made Fire
        //         case ObjectIdentifiers.FIRE_23: //Barb village fire
        //             //Handle cooking on objects..
        //             let cookable = Cookable.getForItems(item.getId());
        //             if (cookable) {
        //                 player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to cook?", [cookable.getcookedItem()], new UseItemCreationMenuAction((productId, amount) => {
        //                     player.getSkillManager().startSkillable(new Cooking(object, cookable, amount));
        //                 })));
        //                 return;
        //             }
        //             //Handle bonfires..
        //             if (object.getId() == ObjectIdentifiers.FIRE_5) {
        //                 let log = LightableLog.getForItem(item.getId());
        //                 if (log) {
        //                     player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to burn?", [log.getLogId()], new UseItemCreationMenuAction((productId, amount) => {
        //                         player.getSkillManager().startSkillable(new Firemaking(log, amount, object));
        //                     })));
        //                     return;
        //                 }
        //             }
        //             break;
        //         case ObjectIdentifiers.WEB:
        //             if (!WebHandler.isSharpItem(item)) {
        //                 player.sendMessage("Only a sharp blade can cut through this sticky web.");
        //                 return;
        //             }
        //             WebHandler.handleSlashWeb(player, object, true);
        //             break;
        //         case 409: //Bone on Altar
        //             let b = BuriableBone.forId(item.getId());
        //             if (b) {
        //                 player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to offer?", [itemId], new UseItemCreationMenuAction((productId, amount) => {
        //                     player.getSkillManager().startSkillable(new AltarOffering(b, object, amount));
        //                 })));
        //             }
        //             break;
        //         default:
        //             player.getPacketSender().sendMessage("Nothing interesting happens.");
        //             break;
        //     }
        //     if (Bank.useItemOnDepositBox(player, item, itemSlot, object)) {
        //         return;
        //     }
        //     if (CastleWars.handleItemOnObject(player, item, object)) {
        //         return;
        //     }
        // }));
    };
    UseItemPacketListener.itemOnPlayer = function (player, packet) {
        // private static itemOnPlayer(player: Player, packet: Packet) {
        var interfaceId = packet.readUnsignedShortA();
        var targetIndex = packet.readUnsignedShort();
        var itemId = packet.readUnsignedShort();
        var slot = packet.readLEShort();
        // if (slot < 0 || slot >= player.getInventory().capacity() || targetIndex >= World.getPlayers().capacityReturn())
        //     return;
        // let target = World.getPlayers().get(targetIndex);
        // if (target == null) {
        //     return;
        // }
        var item = player.getInventory().get(slot);
        if (item == null || !player.getInventory().contains(itemId)) {
            return;
        }
        // player.getMovementQueue().walkToEntity(target, () => {
        //     if (CastleWars.handleItemOnPlayer(player, target, item)) {
        //         return;
        //     }
        //     switch (itemId) {
        //         /** For future actions.. **/
        //         case 995: {
        //             player.getPacketSender().sendMessage("Perhaps I should trade this item instead..");
        //             break;
        //         }
        //     }
        // });
    };
    UseItemPacketListener.itemOnGroundItem = function (player, packet) {
        // private static itemOnGroundItem(player: Player, packet: Packet) {
        var interfaceId = packet.readLEShort();
        var inventory_item = packet.readShortA();
        var ground_item_id = packet.readShort();
        var y = packet.readShortA();
        var unknown = packet.readLEShortA();
        var x = packet.readShort();
        //Verify item..
        if (!player.getInventory().contains(inventory_item)) {
            return;
        }
        //Verify ground item..
        // let groundItem = ItemOnGroundManager.getGroundItem(player.getUsername(), ground_item_id, new Location(x, y));
        // if (!groundItem) {
        //     return;
        // }
        // let item_position = groundItem.getPosition();
        // player.getMovementQueue().walkToGroundItem(item_position, () => {
        //     player.setPositionToFace(groundItem.getPosition());
        //     //Handle used item..
        //     switch (inventory_item) {
        //         case ItemIdentifiers.TINDERBOX: //Lighting a fire..
        //             let log = LightableLog.getForItem(ground_item_id);
        //             if (log) {
        //                 player.getSkillManager().startSkillable(new Firemaking(log, groundItem));
        //                 return;
        //             }
        //             break;
        //     }
        // });
    };
    // public execute(player: Player, packet: Packet) {
    UseItemPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0)
            return;
        switch (packet.getOpcode()
        // case PacketConstants.ITEM_ON_ITEM:
        //     UseItemPacketListener.itemOnItem(player, packet);
        //     break;
        // case PacketConstants.ITEM_ON_OBJECT:
        //     UseItemPacketListener.itemOnObject(player, packet);
        //     break;
        // case PacketConstants.ITEM_ON_GROUND_ITEM:
        //     UseItemPacketListener.itemOnGroundItem(player, packet);
        //     break;
        // case PacketConstants.ITEM_ON_NPC:
        //     UseItemPacketListener.itemOnNpc(player, packet);
        //     break;
        // case PacketConstants.ITEM_ON_PLAYER:
        //     UseItemPacketListener.itemOnPlayer(player, packet);
        //     break;
        ) {
        }
    };
    return UseItemPacketListener;
}());
exports.UseItemPacketListener = UseItemPacketListener;
//# sourceMappingURL=UseItemPacketListener.js.map