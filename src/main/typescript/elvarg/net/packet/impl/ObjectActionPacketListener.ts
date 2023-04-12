import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PacketConstants } from "../PacketConstants";
import { PlayerRights } from "../../../game/model/rights/PlayerRights";
import { Server } from "../../../Server";
import { RegionManager } from "../../../game/collision/RegionManager";
import { DepositBox } from "../../../game/content/DepositBox";
import { CombatSpecial } from "../../../game/content/combat/CombatSpecial";
import { MinigameHandler } from "../../../game/content/minigames/MinigameHandler";
import { FightCaves } from "../../../game/content/minigames/impl/FightCaves";
import { SkillManager } from "../../../game/content/skill/SkillManager";
import { Smithing, Bar } from "../../../game/content/skill/skillable/impl/Smithing";
import { EquipmentMaking } from "../../../game/content/skill/skillable/impl/Smithing";
import { StallThieving } from '../../../game/content/skill/skillable/impl/Thieving'
import { ObjectDefinition } from "../../../game/definition/ObjectDefinition";
import { GameObject } from "../../../game/entity/impl/object/GameObject";
import { MapObjects } from "../../../game/entity/impl/object/MapObjects";
import { WebHandler } from "../../../game/entity/impl/object/impl/WebHandler";
import { PrivateArea } from "../../../game/model/areas/impl/PrivateArea";
import { SpellBookDialogue } from '../../../game/model/dialogues/builders/impl/SpellBookDialogue'
import { TeleportHandler } from "../../../game/model/teleportation/TeleportHandler";
import { TeleportType } from "../../../game/model/teleportation/TeleportType";
import { TaskManager } from "../../../game/task/TaskManager";
import { PacketExecutor } from "../PacketExecutor";
import { ForceMovementTask } from "../../../game/task/impl/ForceMovementTask";
import { ObjectIdentifiers } from "../../../util/ObjectIdentifiers";
import { ObjectManager } from "../../../game/entity/impl/object/ObjectManager";
import { MagicSpellbook } from "../../../game/model/MagicSpellbook";
import { Skill } from "../../../game/model/Skill";
import { ForceMovement } from "../../../game/model/ForceMovement";
import { Location } from "../../../game/model/Location";
import { Flag } from "../../../game/model/Flag";
import { Graphic } from "../../../game/model/Graphic";
import { Animation } from "../../../game/model/Animation";
import { Action } from "../../../game/model/Action";

class ObjectAction implements Action{
    constructor(private readonly execFunc: Function){
        
    }
    execute(): void {
        this.execFunc();
    }

}

export class ObjectActionPacketListener extends ObjectIdentifiers implements PacketExecutor {
    private static firstClick(player: Player, object: GameObject) {
        if (ObjectActionPacketListener.doorHandler(player, object)) {
            return;
        }

        // Skills..
        if (player.getSkillManager().startSkillables(object)) {
            return;
        }

        if (MinigameHandler.firstClickObject(player, object)) {
            // Player has clicked an object inside a minigame
            return;
        }

        const defs = object.getDefinition();
        if (defs != null) {
            if (defs.name != null && defs.name === "Bank Deposit Box") {
                DepositBox.open(player);
                return;
            }

        }

        switch (object.getId()) {
            case ObjectActionPacketListener.WEB:
                if (!WebHandler.wieldingSharpItem(player)) {
                    player.getPacketSender().sendMessage("Only a sharp blade can cut through this sticky web.");
                    return;
                }
                WebHandler.handleSlashWeb(player, object, false);
                break;
            case ObjectActionPacketListener.KBD_LADDER_DOWN:
                TeleportHandler.teleport(player, new Location(3069, 10255), TeleportType.LADDER_DOWN, false);
                break;
            case ObjectActionPacketListener.KBD_LADDER_UP:
                TeleportHandler.teleport(player, new Location(3017, 3850), TeleportType.LADDER_UP, false);
                break;
            case ObjectActionPacketListener.KBD_ENTRANCE_LEVER:
                if (!player.getCombat().getTeleblockTimer().finished()) {
                    player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");
                    return;
                }
                TeleportHandler.teleport(player, new Location(2271, 4680), TeleportType.LEVER, false);
                break;
            case ObjectActionPacketListener.KBD_EXIT_LEVER:
                TeleportHandler.teleport(player, new Location(3067, 10253), TeleportType.LEVER, false);
                break;
            case ObjectActionPacketListener.FIGHT_CAVES_ENTRANCE:
                player.moveTo(FightCaves.ENTRANCE.clone());
                FightCaves.start(player);
                break;
            case ObjectActionPacketListener.FIGHT_CAVES_EXIT:
                player.moveTo(FightCaves.EXIT);
                break;
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANVIL:
                EquipmentMaking.openInterface(player);
                break;
            case ObjectActionPacketListener.ALTAR:
            case ObjectActionPacketListener.CHAOS_ALTAR_2:
                player.performAnimation(new Animation(645));
                if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) < player.getSkillManager()
                    .getMaxLevel(Skill.PRAYER)) {
                    player.getSkillManager().setCurrentLevel(Skill.PRAYER,
                        player.getSkillManager().getMaxLevel(Skill.PRAYER), true);
                    player.getPacketSender().sendMessage("You recharge your Prayer points.");
                }
                break;

            case ObjectActionPacketListener.BANK_CHEST:
                player.getBank(player.getCurrentBankTab()).open();
                break;

            case ObjectActionPacketListener.DITCH_PORTAL:
                player.getPacketSender().sendMessage("You are teleported to the Wilderness ditch.");
                player.moveTo(new Location(3087, 3520));
                break;

            case ObjectActionPacketListener.WILDERNESS_DITCH:
                //player.getMovementQueue().reset();
                if (player.getForceMovement() == null && player.getClickDelay().elapsed()) {
                    const crossDitch = new Location(0, player.getLocation().getY() < 3522 ? 3 : -3);
                    TaskManager.submit(new ForceMovementTask(player, 3, new ForceMovement(player.getLocation().clone(),
                        crossDitch, 0, 70, crossDitch.getY() == 3 ? 0 : 2, 6132)));
                    player.getClickDelay().reset();
                }
                break;

            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.performAnimation(new Animation(645));
                player.getDialogueManager().startDialogues(new SpellBookDialogue());
                break;

            case ObjectActionPacketListener.ORNATE_REJUVENATION_POOL:
                player.getPacketSender().sendMessage("You feel slightly renewed.");
                player.performGraphic(new Graphic(683));
                // Restore special attack
                player.setSpecialPercentage(100);
                CombatSpecial.updateBar(player);

                // Restore run energy
                player.setRunEnergy(100);
                player.getPacketSender().sendRunEnergy();

                for (const skill of Object.values(Skill)) {
                    const skillManager = player.getSkillManager();
                    if (skillManager.getCurrentLevel(skill) < skillManager.getMaxLevel(skill)) {
                        skillManager.setCurrentLevels(skill, skillManager.getMaxLevel(skill));
                    }
                }

                player.setPoisonDamage(0);

                player.getUpdateFlag().flag(Flag.APPEARANCE);
                break;

        }
    }

    private static secondClick(player: Player, object: GameObject) {
        // Check thieving..
        if (StallThieving.init(player, object)) {
            return;
        }
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.FURNACE_18:
                for (const bar of Object.values(Bar)) {
                    player.getPacketSender().sendInterfaceModel(bar.getFrame(), bar.getBar(), 150);
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
                MagicSpellbook.changeSpellbook(player, MagicSpellbook.NORMAL);
                break;
        }
    }

    private static thirdClick(player: Player, object: GameObject) {
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.getPacketSender().sendInterfaceRemoval();
                MagicSpellbook.changeSpellbook(player, MagicSpellbook.ANCIENT);
                break;
        }
    }

    private static fourthClick(player: Player, object: GameObject) {
        switch (object.getId()) {
            case ObjectActionPacketListener.PORTAL_51:
                //DialogueManager.sendStatement(player, "Construction will be avaliable in the future.");
                break;
            case ObjectActionPacketListener.ANCIENT_ALTAR:
                player.getPacketSender().sendInterfaceRemoval();
                MagicSpellbook.changeSpellbook(player, MagicSpellbook.LUNAR);
                break;
        }
    }

    private static objectInteract(player: Player, id: number, x: number, y: number, clickType: number) {
        const location = new Location(x, y, player.getLocation().getZ());
        const object = MapObjects.getPrivateArea(player, id, location);

        if (player.getRights() == PlayerRights.DEVELOPER) {
            const typeFace = object != null ? "[F: " + object.getFace() + " T:" + object.getType() + "]" : "";
            player.getPacketSender().sendMessage(clickType + "-click object: " + id + ". " + location + " " + typeFace);
        }

        if (object == null) {
            return;
        }

        // Get object definition
        const def = ObjectDefinition.forId(id);

        if (def == null) {
            Server.getLogger().info("ObjectDefinition for object " + id + " is null.");
            return;
        }

        player.getMovementQueue().walkToObject(object, new ObjectAction(() => {
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
    }
    private static atObject(finalY: number, finalX: number, x: number, height: number, rotation: number, width: number, y: number, privateArea: PrivateArea): boolean {
        const maxX = (finalX + width) - 1;
        const maxY = (finalY + height) - 1;
        if (x >= finalX && x <= maxX && y >= finalY && y <= maxY)
            return true;
        if (x == finalX - 1 && y >= finalY && y <= maxY && (RegionManager.getClipping(x, y, height, privateArea) & 8) == 0
            && (rotation & 8) == 0)
            return true;
        if (x == maxX + 1 && y >= finalY && y <= maxY && (RegionManager.getClipping(x, y, height, privateArea) & 0x80) == 0
            && (rotation & 2) == 0)
            return true;
        return y == finalY - 1 && x >= finalX && x <= maxX && (RegionManager.getClipping(x, y, height, privateArea) & 2) == 0
            && (rotation & 4) == 0
            || y == maxY + 1 && x >= finalX && x <= maxX && (RegionManager.getClipping(x, y, height, privateArea) & 0x20) == 0
            && (rotation & 1) == 0;
    }

    private static doorHandler(player: Player, object: GameObject): boolean {
        if (object.getDefinition().getName() != null && object.getDefinition().getName().includes("Door")) {
            const openOffset: number[][] = [[-1, 0], [0, 1], [1, 0], [0, -1], [0, -1]];
            const closeOffset: number[][] = [[1, 0], [1, 0], [0, 1], [-1, 0], [0, 1]];
            /* check if its an open or closed door */
            const open = ObjectDefinition.interactions[0].includes("Open");
            /* gets offset coords based on door face */
            const offset = open ? openOffset[object.getFace()] : closeOffset[object.getFace()];
            /* adjust door direction based on if it needs to be opened or closed */
            const face = open ? object.getFace() + 1 : object.getFace() - 1;
            let loc: Location = new Location(
                object.getLocation().getX() + offset[0],
                object.getLocation().getY() + offset[1],
                object.getLocation().getZ()
            );
            const obj = new GameObject(open ? object.getId() + 1 : object.getId() - 1, loc, object.getType(), face, null);

            /* spawns/despawns doors accordingly */

            if (open) {
                ObjectManager.register(new GameObject(-1, object.getLocation(), 0, 0, object.getPrivateArea()), true);
                ObjectManager.register(new GameObject(-1, loc, object.getType(), object.getFace(), object.getPrivateArea()), true);
            }

            ObjectManager.deregister(object, true);
            ObjectManager.register(obj, true);

            return true;
        }
        return false;
    }

    public execute(player: Player, packet: Packet) {
        if (player === null || player.getHitpoints() <= 0) {
            return;
        }

        if (player.busy()) {
            return;
        }

        let id, x, y;
        switch (packet.getOpcode()) {
            case PacketConstants.OBJECT_FIRST_CLICK_OPCODE:
                x = packet.readLEShortA();
                id = packet.readUnsignedShort();
                y = packet.readUnsignedShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 1);
                break;
            case PacketConstants.OBJECT_SECOND_CLICK_OPCODE:
                id = packet.readLEShortA();
                y = packet.readLEShort();
                x = packet.readUnsignedShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 2);
                break;
            case PacketConstants.OBJECT_THIRD_CLICK_OPCODE:
                x = packet.readLEShort();
                y = packet.readShort();
                id = packet.readLEShortA();
                ObjectActionPacketListener.objectInteract(player, id, x, y, 4);
                break;
            case PacketConstants.OBJECT_FIFTH_CLICK_OPCODE:
                break;
        }
    }
}


