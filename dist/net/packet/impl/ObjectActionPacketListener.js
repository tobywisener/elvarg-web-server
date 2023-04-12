"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ObjectActionPacketListener = void 0;
var PacketConstants_1 = require("../PacketConstants");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var Server_1 = require("../../../Server");
var RegionManager_1 = require("../../../game/collision/RegionManager");
var DepositBox_1 = require("../../../game/content/DepositBox");
var CombatSpecial_1 = require("../../../game/content/combat/CombatSpecial");
var MinigameHandler_1 = require("../../../game/content/minigames/MinigameHandler");
var FightCaves_1 = require("../../../game/content/minigames/impl/FightCaves");
var Smithing_1 = require("../../../game/content/skill/skillable/impl/Smithing");
var Smithing_2 = require("../../../game/content/skill/skillable/impl/Smithing");
var Thieving_1 = require("../../../game/content/skill/skillable/impl/Thieving");
var ObjectDefinition_1 = require("../../../game/definition/ObjectDefinition");
var GameObject_1 = require("../../../game/entity/impl/object/GameObject");
var MapObjects_1 = require("../../../game/entity/impl/object/MapObjects");
var WebHandler_1 = require("../../../game/entity/impl/object/impl/WebHandler");
var SpellBookDialogue_1 = require("../../../game/model/dialogues/builders/impl/SpellBookDialogue");
var TeleportHandler_1 = require("../../../game/model/teleportation/TeleportHandler");
var TeleportType_1 = require("../../../game/model/teleportation/TeleportType");
var TaskManager_1 = require("../../../game/task/TaskManager");
var ForceMovementTask_1 = require("../../../game/task/impl/ForceMovementTask");
var ObjectIdentifiers_1 = require("../../../util/ObjectIdentifiers");
var ObjectManager_1 = require("../../../game/entity/impl/object/ObjectManager");
var MagicSpellbook_1 = require("../../../game/model/MagicSpellbook");
var Skill_1 = require("../../../game/model/Skill");
var ForceMovement_1 = require("../../../game/model/ForceMovement");
var Location_1 = require("../../../game/model/Location");
var Flag_1 = require("../../../game/model/Flag");
var Graphic_1 = require("../../../game/model/Graphic");
var Animation_1 = require("../../../game/model/Animation");
var ObjectAction = /** @class */ (function () {
    function ObjectAction(execFunc) {
        this.execFunc = execFunc;
    }
    ObjectAction.prototype.execute = function () {
        this.execFunc();
    };
    return ObjectAction;
}());
var ObjectActionPacketListener = /** @class */ (function (_super) {
    __extends(ObjectActionPacketListener, _super);
    function ObjectActionPacketListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectActionPacketListener.firstClick = function (player, object) {
        var e_1, _a;
        if (ObjectActionPacketListener.doorHandler(player, object)) {
            return;
        }
        // Skills..
        if (player.getSkillManager().startSkillables(object)) {
            return;
        }
        if (MinigameHandler_1.MinigameHandler.firstClickObject(player, object)) {
            // Player has clicked an object inside a minigame
            return;
        }
        var defs = object.getDefinition();
        if (defs != null) {
            if (defs.name != null && defs.name === "Bank Deposit Box") {
                DepositBox_1.DepositBox.open(player);
                return;
            }
        }
        switch (object.getId()) {
            case ObjectActionPacketListener.WEB:
                if (!WebHandler_1.WebHandler.wieldingSharpItem(player)) {
                    player.getPacketSender().sendMessage("Only a sharp blade can cut through this sticky web.");
                    return;
                }
                WebHandler_1.WebHandler.handleSlashWeb(player, object, false);
                break;
            case ObjectActionPacketListener.KBD_LADDER_DOWN:
                TeleportHandler_1.TeleportHandler.teleport(player, new Location_1.Location(3069, 10255), TeleportType_1.TeleportType.LADDER_DOWN, false);
                break;
            case ObjectActionPacketListener.KBD_LADDER_UP:
                TeleportHandler_1.TeleportHandler.teleport(player, new Location_1.Location(3017, 3850), TeleportType_1.TeleportType.LADDER_UP, false);
                break;
            case ObjectActionPacketListener.KBD_ENTRANCE_LEVER:
                if (!player.getCombat().getTeleblockTimer().finished()) {
                    player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");
                    return;
                }
                TeleportHandler_1.TeleportHandler.teleport(player, new Location_1.Location(2271, 4680), TeleportType_1.TeleportType.LEVER, false);
                break;
            case ObjectActionPacketListener.KBD_EXIT_LEVER:
                TeleportHandler_1.TeleportHandler.teleport(player, new Location_1.Location(3067, 10253), TeleportType_1.TeleportType.LEVER, false);
                break;
            case ObjectActionPacketListener.FIGHT_CAVES_ENTRANCE:
                player.moveTo(FightCaves_1.FightCaves.ENTRANCE.clone());
                FightCaves_1.FightCaves.start(player);
                break;
            case ObjectActionPacketListener.FIGHT_CAVES_EXIT:
                player.moveTo(FightCaves_1.FightCaves.EXIT);
                break;
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANVIL:
                Smithing_2.EquipmentMaking.openInterface(player);
                break;
            case ObjectActionPacketListener.ALTAR:
            case ObjectActionPacketListener.CHAOS_ALTAR_2:
                player.performAnimation(new Animation_1.Animation(645));
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) < player.getSkillManager()
                    .getMaxLevel(Skill_1.Skill.PRAYER)) {
                    player.getSkillManager().setCurrentLevel(Skill_1.Skill.PRAYER, player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER), true);
                    player.getPacketSender().sendMessage("You recharge your Prayer points.");
                }
                break;
            case ObjectActionPacketListener.BANK_CHEST:
                player.getBank(player.getCurrentBankTab()).open();
                break;
            case ObjectActionPacketListener.DITCH_PORTAL:
                player.getPacketSender().sendMessage("You are teleported to the Wilderness ditch.");
                player.moveTo(new Location_1.Location(3087, 3520));
                break;
            case ObjectActionPacketListener.WILDERNESS_DITCH:
                //player.getMovementQueue().reset();
                if (player.getForceMovement() == null && player.getClickDelay().elapsed()) {
                    var crossDitch = new Location_1.Location(0, player.getLocation().getY() < 3522 ? 3 : -3);
                    TaskManager_1.TaskManager.submit(new ForceMovementTask_1.ForceMovementTask(player, 3, new ForceMovement_1.ForceMovement(player.getLocation().clone(), crossDitch, 0, 70, crossDitch.getY() == 3 ? 0 : 2, 6132)));
                    player.getClickDelay().reset();
                }
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.performAnimation(new Animation_1.Animation(645));
                player.getDialogueManager().startDialogues(new SpellBookDialogue_1.SpellBookDialogue());
                break;
            case ObjectActionPacketListener.ORNATE_REJUVENATION_POOL:
                player.getPacketSender().sendMessage("You feel slightly renewed.");
                player.performGraphic(new Graphic_1.Graphic(683));
                // Restore special attack
                player.setSpecialPercentage(100);
                CombatSpecial_1.CombatSpecial.updateBar(player);
                // Restore run energy
                player.setRunEnergy(100);
                player.getPacketSender().sendRunEnergy();
                try {
                    for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var skill = _c.value;
                        var skillManager = player.getSkillManager();
                        if (skillManager.getCurrentLevel(skill) < skillManager.getMaxLevel(skill)) {
                            skillManager.setCurrentLevels(skill, skillManager.getMaxLevel(skill));
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
                player.setPoisonDamage(0);
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
                break;
        }
    };
    ObjectActionPacketListener.secondClick = function (player, object) {
        var e_2, _a;
        // Check thieving..
        if (Thieving_1.StallThieving.init(player, object)) {
            return;
        }
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.FURNACE_18:
                try {
                    for (var _b = __values(Object.values(Smithing_1.Bar)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var bar = _c.value;
                        player.getPacketSender().sendInterfaceModel(bar.getFrame(), bar.getBar(), 150);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                player.getPacketSender().sendChatboxInterface(2400);
                break;
            case ObjectActionPacketListener.BANK_CHEST:
            case ObjectActionPacketListener.BANK:
            case ObjectActionPacketListener.BANK_BOOTH:
            case ObjectActionPacketListener.BANK_BOOTH_2:
            case ObjectActionPacketListener.BANK_BOOTH_3:
            case ObjectActionPacketListener.BANK_BOOTH_4:
                player.getBank(player.getCurrentBankTab()).open();
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.getPacketSender().sendInterfaceRemoval();
                MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.NORMAL);
                break;
        }
    };
    ObjectActionPacketListener.thirdClick = function (player, object) {
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.getPacketSender().sendInterfaceRemoval();
                MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.ANCIENT);
                break;
        }
    };
    ObjectActionPacketListener.fourthClick = function (player, object) {
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.getPacketSender().sendInterfaceRemoval();
                MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.LUNAR);
                break;
        }
    };
    ObjectActionPacketListener.objectInteract = function (player, id, x, y, clickType) {
        var location = new Location_1.Location(x, y, player.getLocation().getZ());
        var object = MapObjects_1.MapObjects.getPrivateArea(player, id, location);
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            var typeFace = object != null ? "[F: " + object.getFace() + " T:" + object.getType() + "]" : "";
            player.getPacketSender().sendMessage(clickType + "-click object: " + id + ". " + location + " " + typeFace);
        }
        if (object == null) {
            return;
        }
        // Get object definition
        var def = ObjectDefinition_1.ObjectDefinition.forId(id);
        if (def == null) {
            Server_1.Server.getLogger().info("ObjectDefinition for object " + id + " is null.");
            return;
        }
        player.getMovementQueue().walkToObject(object, new ObjectAction(function () {
            // Face object..
            player.setPositionToFace(location);
            // Areas
            if (player.getArea() != null) {
                if (player.getArea().handleObjectClick(player, object, clickType)) {
                    return;
                }
            }
            switch (clickType) {
                case 1:
                    ObjectActionPacketListener.firstClick(player, object);
                    break;
                case 2:
                    ObjectActionPacketListener.secondClick(player, object);
                    break;
                case 3:
                    ObjectActionPacketListener.thirdClick(player, object);
                    break;
                case 4:
                    ObjectActionPacketListener.fourthClick(player, object);
                    break;
            }
        }));
    };
    ObjectActionPacketListener.atObject = function (finalY, finalX, x, height, rotation, width, y, privateArea) {
        var maxX = (finalX + width) - 1;
        var maxY = (finalY + height) - 1;
        if (x >= finalX && x <= maxX && y >= finalY && y <= maxY)
            return true;
        if (x == finalX - 1 && y >= finalY && y <= maxY && (RegionManager_1.RegionManager.getClipping(x, y, height, privateArea) & 8) == 0
            && (rotation & 8) == 0)
            return true;
        if (x == maxX + 1 && y >= finalY && y <= maxY && (RegionManager_1.RegionManager.getClipping(x, y, height, privateArea) & 0x80) == 0
            && (rotation & 2) == 0)
            return true;
        return y == finalY - 1 && x >= finalX && x <= maxX && (RegionManager_1.RegionManager.getClipping(x, y, height, privateArea) & 2) == 0
            && (rotation & 4) == 0
            || y == maxY + 1 && x >= finalX && x <= maxX && (RegionManager_1.RegionManager.getClipping(x, y, height, privateArea) & 0x20) == 0
                && (rotation & 1) == 0;
    };
    ObjectActionPacketListener.doorHandler = function (player, object) {
        if (object.getDefinition().getName() != null && object.getDefinition().getName().includes("Door")) {
            var openOffset = [[-1, 0], [0, 1], [1, 0], [0, -1], [0, -1]];
            var closeOffset = [[1, 0], [1, 0], [0, 1], [-1, 0], [0, 1]];
            /* check if its an open or closed door */
            var open_1 = ObjectDefinition_1.ObjectDefinition.interactions[0].includes("Open");
            /* gets offset coords based on door face */
            var offset = open_1 ? openOffset[object.getFace()] : closeOffset[object.getFace()];
            /* adjust door direction based on if it needs to be opened or closed */
            var face = open_1 ? object.getFace() + 1 : object.getFace() - 1;
            var loc = new Location_1.Location(object.getLocation().getX() + offset[0], object.getLocation().getY() + offset[1], object.getLocation().getZ());
            var obj = new GameObject_1.GameObject(open_1 ? object.getId() + 1 : object.getId() - 1, loc, object.getType(), face, null);
            /* spawns/despawns doors accordingly */
            if (open_1) {
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(-1, object.getLocation(), 0, 0, object.getPrivateArea()), true);
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(-1, loc, object.getType(), object.getFace(), object.getPrivateArea()), true);
            }
            ObjectManager_1.ObjectManager.deregister(object, true);
            ObjectManager_1.ObjectManager.register(obj, true);
            return true;
        }
        return false;
    };
    ObjectActionPacketListener.prototype.execute = function (player, packet) {
        if (player === null || player.getHitpoints() <= 0) {
            return;
        }
        if (player.busy()) {
            return;
        }
        var id, x, y;
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.OBJECT_FIRST_CLICK_OPCODE:
                x = packet.readLEShortA();
                id = packet.readUnsignedShort();
                y = packet.readUnsignedShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 1);
                break;
            case PacketConstants_1.PacketConstants.OBJECT_SECOND_CLICK_OPCODE:
                id = packet.readLEShortA();
                y = packet.readLEShort();
                x = packet.readUnsignedShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 2);
                break;
            case PacketConstants_1.PacketConstants.OBJECT_THIRD_CLICK_OPCODE:
                x = packet.readLEShort();
                y = packet.readShort();
                id = packet.readLEShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 4);
                break;
            case PacketConstants_1.PacketConstants.OBJECT_FIFTH_CLICK_OPCODE:
                break;
        }
    };
    return ObjectActionPacketListener;
}(ObjectIdentifiers_1.ObjectIdentifiers));
exports.ObjectActionPacketListener = ObjectActionPacketListener;
//# sourceMappingURL=ObjectActionPacketListener.js.map