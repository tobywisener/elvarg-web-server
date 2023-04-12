"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseItemPacketListener = void 0;
var Herblore_1 = require("../../../game/content/skill/skillable/impl/Herblore");
var Fletching_1 = require("../../../game/content/skill/skillable/impl/Fletching");
var ItemIdentifiers_1 = require("../../../util/ItemIdentifiers");
var CombatFactory_1 = require("../../../game/content/combat/CombatFactory");
var World_1 = require("../../../game/World");
var NPCInteractionSystem_1 = require("../../../game/entity/impl/npc/NPCInteractionSystem");
var ObjectIdentifiers_1 = require("../../../util/ObjectIdentifiers");
var WebHandler_1 = require("../../../game/entity/impl/object/impl/WebHandler");
var CastleWars_1 = require("../../../game/content/minigames/impl/CastleWars");
var Bank_1 = require("../../../game/model/container/impl/Bank");
var Prayer_1 = require("../../../game/content/skill/skillable/impl/Prayer");
var CreationMenu_1 = require("../../../game/model/menu/CreationMenu");
var ItemOnGroundManager_1 = require("../../../game/entity/impl/grounditem/ItemOnGroundManager");
var PacketConstants_1 = require("../PacketConstants");
var Location_1 = require("../../../game/model/Location");
var MapObjects_1 = require("../../../game/entity/impl/object/MapObjects");
var Cooking_1 = require("../../../game/content/skill/skillable/impl/Cooking");
var Firemaking_1 = require("../../../game/content/skill/skillable/impl/Firemaking");
var UseItemCreationMenuAction = /** @class */ (function () {
    function UseItemCreationMenuAction(execFunc) {
        this.execFunc = execFunc;
    }
    UseItemCreationMenuAction.prototype.execute = function (item, amount) {
        this.execFunc();
    };
    return UseItemCreationMenuAction;
}());
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
    UseItemPacketListener.itemOnItem = function (player, packet) {
        var usedWithSlot = packet.readUnsignedShort();
        var itemUsedSlot = packet.readUnsignedShortA();
        if (usedWithSlot < 0 || itemUsedSlot < 0 || itemUsedSlot >= player.getInventory().capacity() || usedWithSlot >= player.getInventory().capacity())
            return;
        var used = player.getInventory()[itemUsedSlot];
        var usedWith = player.getInventory()[usedWithSlot];
        player.getPacketSender().sendInterfaceRemoval();
        player.getSkillManager().stopSkillable();
        //Herblore
        if (Herblore_1.Herblore.makeUnfinishedPotion(player, used.getId(), usedWith.getId())
            || Herblore_1.Herblore.finishPotion(player, used.getId(), usedWith.getId())
            || Herblore_1.Herblore.concatenate(player, used, usedWith)) {
            return;
        }
        //Fletching
        if (Fletching_1.Fletching.fletchLog(player, used.getId(), usedWith.getId())
            || Fletching_1.Fletching.stringBow(player, used.getId(), usedWith.getId())
            || Fletching_1.Fletching.fletchAmmo(player, used.getId(), usedWith.getId())
            || Fletching_1.Fletching.fletchCrossbow(player, used.getId(), usedWith.getId())) {
            return;
        }
        if ((used.getId() === ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER || usedWith.getId() === ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER)
            && (used.getId() === ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER_HILT || usedWith.getId() === ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER_HILT)) {
            if (player.busy() || CombatFactory_1.CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You cannot do that right now.");
                return;
            }
            if (player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER) && player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER_HILT)) {
                player.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.DRAGON_DEFENDER, 1).deleteNumber(ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER_HILT, 1).adds(ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER, 1);
                player.getPacketSender().sendMessage("You attach your Avernic hilt onto the Dragon defender..");
            }
            return;
        }
        //Blowpipe reload
        else if (used.getId() === ItemIdentifiers_1.ItemIdentifiers.TOXIC_BLOWPIPE || usedWith.getId() === ItemIdentifiers_1.ItemIdentifiers.TOXIC_BLOWPIPE) {
            var reload = used.getId() === ItemIdentifiers_1.ItemIdentifiers.TOXIC_BLOWPIPE ? usedWith.getId() : used.getId();
            if (reload === ItemIdentifiers_1.ItemIdentifiers.ZULRAHS_SCALES) {
                var amount = player.getInventory().getAmount(12934);
                player.incrementBlowpipeScales(amount);
                player.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.ZULRAHS_SCALES, amount);
                player.getPacketSender().sendMessage("You now have ".concat(player.getBlowpipeScales(), " Zulrah scales in your blowpipe."));
            }
            else {
                player.getPacketSender().sendMessage("You cannot load the blowpipe with that!");
            }
        }
    };
    UseItemPacketListener.itemOnNpc = function (player, packet) {
        var id = packet.readShortA();
        var index = packet.readShortA();
        var slot = packet.readLEShort();
        if (index < 0 || index > World_1.World.getNpcs().capacityReturn()) {
            return;
        }
        if (slot < 0 || slot > player.getInventory().getItems().length) {
            return;
        }
        var npc = World_1.World.getNpcs().get(index);
        if (npc == null) {
            return;
        }
        var item = player.getInventory().getItems()[slot];
        if (item == null || item.getId() !== id) {
            return;
        }
        player.getMovementQueue().walkToEntity(npc, function () {
            if (NPCInteractionSystem_1.NPCInteractionSystem.handleUseItem(player, npc, id, slot)) {
                // Player is using an item on a defined NPC
                return;
            }
            switch (id) {
                default:
                    player.getPacketSender().sendMessage("Nothing interesting happens.");
                    break;
            }
        });
    };
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
        var position = new Location_1.Location(objectX, objectY, player.getLocation().getZ());
        var object = MapObjects_1.MapObjects.getPrivateArea(player, objectId, position);
        // Make sure the object actually exists in the region...
        if (object == null) {
            return;
        }
        //Update facing..
        player.setPositionToFace(position);
        //Handle object..
        player.getMovementQueue().walkToObject(object, new UseItemAction(function () {
            switch (object.getId()) {
                case ObjectIdentifiers_1.ObjectIdentifiers.STOVE_4: //Edgeville Stove
                case ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5: //Player-made Fire
                case ObjectIdentifiers_1.ObjectIdentifiers.FIRE_23: //Barb village fire
                    //Handle cooking on objects..
                    var cookable_1 = Cooking_1.Cookable.getForItems(item.getId());
                    if (cookable_1) {
                        player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to cook?", [cookable_1.getcookedItem()], new UseItemCreationMenuAction(function (productId, amount) {
                            player.getSkillManager().startSkillable(new Cooking_1.Cooking(object, cookable_1, amount));
                        })));
                        return;
                    }
                    //Handle bonfires..
                    if (object.getId() == ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5) {
                        var log_1 = Firemaking_1.LightableLog.getForItem(item.getId());
                        if (log_1) {
                            player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to burn?", [log_1.getLogId()], new UseItemCreationMenuAction(function (productId, amount) {
                                player.getSkillManager().startSkillable(new Firemaking_1.Firemaking(log_1, amount, object));
                            })));
                            return;
                        }
                    }
                    break;
                case ObjectIdentifiers_1.ObjectIdentifiers.WEB:
                    if (!WebHandler_1.WebHandler.isSharpItem(item)) {
                        player.sendMessage("Only a sharp blade can cut through this sticky web.");
                        return;
                    }
                    WebHandler_1.WebHandler.handleSlashWeb(player, object, true);
                    break;
                case 409: //Bone on Altar
                    var b_1 = Prayer_1.BuriableBone.forId(item.getId());
                    if (b_1) {
                        player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to offer?", [itemId], new UseItemCreationMenuAction(function (productId, amount) {
                            player.getSkillManager().startSkillable(new Prayer_1.AltarOffering(b_1, object, amount));
                        })));
                    }
                    break;
                default:
                    player.getPacketSender().sendMessage("Nothing interesting happens.");
                    break;
            }
            if (Bank_1.Bank.useItemOnDepositBox(player, item, itemSlot, object)) {
                return;
            }
            if (CastleWars_1.CastleWars.handleItemOnObject(player, item, object)) {
                return;
            }
        }));
    };
    UseItemPacketListener.itemOnPlayer = function (player, packet) {
        var interfaceId = packet.readUnsignedShortA();
        var targetIndex = packet.readUnsignedShort();
        var itemId = packet.readUnsignedShort();
        var slot = packet.readLEShort();
        if (slot < 0 || slot >= player.getInventory().capacity() || targetIndex >= World_1.World.getPlayers().capacityReturn())
            return;
        var target = World_1.World.getPlayers().get(targetIndex);
        if (target == null) {
            return;
        }
        var item = player.getInventory().get(slot);
        if (item == null || !player.getInventory().contains(itemId)) {
            return;
        }
        player.getMovementQueue().walkToEntity(target, function () {
            if (CastleWars_1.CastleWars.handleItemOnPlayer(player, target, item)) {
                return;
            }
            switch (itemId) {
                /** For future actions.. **/
                case 995: {
                    player.getPacketSender().sendMessage("Perhaps I should trade this item instead..");
                    break;
                }
            }
        });
    };
    UseItemPacketListener.itemOnGroundItem = function (player, packet) {
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
        var groundItem = ItemOnGroundManager_1.ItemOnGroundManager.getGroundItem(player.getUsername(), ground_item_id, new Location_1.Location(x, y));
        if (!groundItem) {
            return;
        }
        var item_position = groundItem.getPosition();
        player.getMovementQueue().walkToGroundItem(item_position, function () {
            player.setPositionToFace(groundItem.getPosition());
            //Handle used item..
            switch (inventory_item) {
                case ItemIdentifiers_1.ItemIdentifiers.TINDERBOX: //Lighting a fire..
                    var log = Firemaking_1.LightableLog.getForItem(ground_item_id);
                    if (log) {
                        player.getSkillManager().startSkillable(new Firemaking_1.Firemaking(log, groundItem));
                        return;
                    }
                    break;
            }
        });
    };
    UseItemPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0)
            return;
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.ITEM_ON_ITEM:
                UseItemPacketListener.itemOnItem(player, packet);
                break;
            case PacketConstants_1.PacketConstants.ITEM_ON_OBJECT:
                UseItemPacketListener.itemOnObject(player, packet);
                break;
            case PacketConstants_1.PacketConstants.ITEM_ON_GROUND_ITEM:
                UseItemPacketListener.itemOnGroundItem(player, packet);
                break;
            case PacketConstants_1.PacketConstants.ITEM_ON_NPC:
                UseItemPacketListener.itemOnNpc(player, packet);
                break;
            case PacketConstants_1.PacketConstants.ITEM_ON_PLAYER:
                UseItemPacketListener.itemOnPlayer(player, packet);
                break;
        }
    };
    return UseItemPacketListener;
}());
exports.UseItemPacketListener = UseItemPacketListener;
//# sourceMappingURL=UseItemPacketListener.js.map