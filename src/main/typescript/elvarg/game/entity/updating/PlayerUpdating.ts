import {World} from '../../World'
import {ItemDefinition} from '../../definition/ItemDefinition'
import {Player} from '../impl/player/Player'
import {PlayerBot} from '../impl/playerbot/PlayerBot'
import {Equipment} from '../../model/container/impl/Equipment'
import { PacketType } from '../../../net/packet/PacketType'
import { PacketBuilder, AccessType, ValueType } from '../../../net/packet/PacketBuilder'
import { EquipmentType } from '../../model/EquipmentType'
import { Appearance } from '../../model/Appearance'
import { Flag } from '../../model/Flag'
import { ByteOrder } from '../../../net/packet/ByteOrder'
import { Skill } from '../../model/Skill'

export class PlayerUpdating {
    private static MAX_NEW_PLAYERS_PER_CYCLE = 25;

    public static update(player: Player) {
        const update = new PacketBuilder();
        const packet = new PacketBuilder(81, PacketType.VARIABLE_SHORT);
        packet.initializeAccess(AccessType.BIT);
        this.updateMovement(player, packet);
        this.appendUpdates(player, update, player, false, true);
        packet.putBits(8, player.getLocalPlayers().length);
        for (const playerIterator of player.getLocalPlayers()) {
            if (World.getPlayers().get(playerIterator.getIndex()) != null
                && playerIterator.getLocation().isViewableFrom(player.getLocation())
                && !playerIterator.isNeedsPlacement()
                && playerIterator.getPrivateArea() === player.getPrivateArea()) {
                    this.updateOtherPlayerMovement(packet, playerIterator);
                if (playerIterator.getUpdateFlag().isUpdateRequired()) {
                    this.appendUpdates(player, update, playerIterator, false, false);
                }
            } else {
                playerIterator.onRemove();
                packet.putBits(1, 1);
                packet.putBits(2, 3);
            }
        }
        let playersAdded = 0;

        for (const otherPlayer of World.getPlayers()) {
            if (player.getLocalPlayers().length >= 79 || playersAdded > PlayerUpdating.MAX_NEW_PLAYERS_PER_CYCLE)
                break;
            if (otherPlayer == null || otherPlayer == player || player.getLocalPlayers().includes(otherPlayer)
                || !otherPlayer.getLocation().isViewableFrom(player.getLocation())
                || otherPlayer.getPrivateArea() !== player.getPrivateArea()) {
                continue;
            }
            player.getLocalPlayers().push(otherPlayer);
            this.addPlayer(player, otherPlayer, packet);
            this.appendUpdates(player, update, otherPlayer, true, false);
            playersAdded++;
        }

        if (update.buffer().length > 0) {
            packet.putBits(11, 2047);
            packet.initializeAccess(AccessType.BYTE);
            packet.putBytes(update.getBuffer());
        } else {
            packet.initializeAccess(AccessType.BYTE);
        }
        player.getSession().write(packet);
    }
    private static addPlayer(player: Player, target: Player, builder: PacketBuilder) {
        builder.putBits(11, target.getIndex());
        builder.putBits(1, 1);
        builder.putBits(1, 1);
        let yDiff = target.getLocation().getY() - player.getLocation().getY();
        let xDiff = target.getLocation().getX() - player.getLocation().getX();
        builder.putBits(5, yDiff);
        builder.putBits(5, xDiff);
    }
    private static updateMovement(player: Player, builder: PacketBuilder) {
        if (player.isNeedsPlacement()) {
            builder.putBits(1, 1);
            builder.putBits(2, 3);
            builder.putBits(2, player.getLocation().getZ());
            builder.putBits(1, player.isResetMovementQueue() ? 1 : 0);
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
            builder.putBits(7, player.getLocation().getLocalY(player.getLastKnownRegion()));
            builder.putBits(7, player.getLocation().getLocalX(player.getLastKnownRegion()));
        } else if (player.getWalkingDirection().getId() == -1) {
            if (player.getUpdateFlag().isUpdateRequired()) {
                builder.putBits(1, 1);
                builder.putBits(2, 0);
            } else {
                builder.putBits(1, 0);
            }
        } else if (player.getRunningDirection().getId() == -1) {
            builder.putBits(1, 1);
            builder.putBits(2, 1);
            builder.putBits(3, player.getWalkingDirection().getId());
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        } else {
            builder.putBits(1, 1);
            builder.putBits(2, 2);
            builder.putBits(3, player.getWalkingDirection().getId());
            builder.putBits(3, player.getRunningDirection().getId());
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        }
    }
    private static updateOtherPlayerMovement(builder: PacketBuilder, target: Player) {
        // TODO: Teleport
        /*if (target.isNeedsPlacement()) {
            builder.putBits(1, target.getUpdateFlag().isUpdateRequired() ? 1 : 0);
            builder.putBits(2, 3); // Teleport
            builder.putBits(7, target.getPosition().getLocalY(target.getLastKnownRegion()));
            builder.putBits(7, target.getPosition().getLocalX(target.getLastKnownRegion()));
            return;
        }*/

        /*
         * Check which type of movement took place.
         */
        if (target.getWalkingDirection().getId() == -1) {
            /*
             * If no movement did, check if an update is required.
             */
            if (target.getUpdateFlag().isUpdateRequired()) {
                /*
                 * Signify that an update happened.
                 */
                builder.putBits(1, 1);

                /*
                 * Signify that there was no movement.
                 */
                builder.putBits(2, 0);
            } else {
                /*
                 * Signify that nothing changed.
                 */
                builder.putBits(1, 0);
            }
        } else if (target.getRunningDirection().getId() == -1) {
            /*
             * The player moved but didn't run. Signify that an update is required.
             */
            builder.putBits(1, 1);

            /*
             * Signify we moved one tile.
             */
            builder.putBits(2, 1);

            /*
             * Write the primary sprite (i.e. walk direction).
             */
            builder.putBits(3, target.getWalkingDirection().getId());

            /*
             * Write a flag indicating if a block update happened.
             */
            builder.putBits(1, target.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        } else {
            /*
             * The player ran. Signify that an update happened.
             */
            builder.putBits(1, 1);

            /*
             * Signify that we moved two tiles.
             */
            builder.putBits(2, 2);

            // Write the primary sprite (i.e. walk direction).
            builder.putBits(3, target.walkingDirection.id);

            // Write the secondary sprite (i.e. run direction).
            builder.putBits(3, target.runningDirection.id);

            // Write a flag indicating if a block update happened.
            builder.putBits(1, target.updateFlag.isUpdateRequired() ? 1 : 0);
        }
    }
    private static appendUpdates(player: Player, builder: PacketBuilder, target: Player, updateAppearance: boolean, noChat: boolean) {
        if (!target.updateFlag.isUpdateRequired() && !updateAppearance) {
            return;
        }
        // If we don't need to update again, simply send the cached update block
        // if it's available.
        /*
        if (player.cachedUpdateBlock != null && !player.equals(target) && !updateAppearance && !noChat) {
            builder.putBytes(player.cachedUpdateBlock);
            return;
        }
        */
        const flag = target.updateFlag;
        let mask = 0;
        if (flag.flagged(Flag.GRAPHIC) && target.graphic != null) {
            mask |= 0x100;
        }
        if (flag.flagged(Flag.ANIMATION) && target.animation != null) {
            mask |= 0x8;
        }
        if (flag.flagged(Flag.FORCED_CHAT) && target.forcedChat != null) {
            mask |= 0x4;
        }
        if (flag.flagged(Flag.CHAT) && target.currentChatMessage != null && !noChat && !player.relations.ignoreList.includes(target.longUsername)) {
            mask |= 0x80;
        }
        if (flag.flagged(Flag.ENTITY_INTERACTION)) {
            mask |= 0x1;
        }
        if (flag.flagged(Flag.APPEARANCE) || updateAppearance) {
            mask |= 0x10;
        }
        if (flag.flagged(Flag.FACE_POSITION) && target.positionToFace != null) {
            mask |= 0x2;
        }
        if (flag.flagged(Flag.SINGLE_HIT)) {
            mask |= 0x20;
        }
        if (flag.flagged(Flag.DOUBLE_HIT)) {
            mask |= 0x200;
        }
        if (flag.flagged(Flag.FORCED_MOVEMENT) && target.forceMovement != null) {
            mask |= 0x400;
        }
        if (mask >= 0x100) {
            mask |= 0x40;
            builder.putShorts(mask, ByteOrder.LITTLE);
        } else {
            builder.put(mask);
        }
        if (flag.flagged(Flag.FORCED_MOVEMENT) && target.forceMovement != null) {
            this.updateForcedMovement(player, builder, target);
        }
        if (flag.flagged(Flag.GRAPHIC) && target.graphic != null) {
            this.updateGraphics(builder, target);
        }
        if (flag.flagged(Flag.ANIMATION) && target.animation != null) {
            this.updateAnimation(builder, target);
        }
        if (flag.flagged(Flag.FORCED_CHAT) && target.forcedChat != null) {
            this.updateForcedChat(builder, target);
        } if (flag.flagged(Flag.CHAT) && target.currentChatMessage != null && !noChat && !player.relations.ignoreList.includes(target.longUsername)) {
            this.updateChat(builder, target, player);
        }
        if (flag.flagged(Flag.ENTITY_INTERACTION)) {
            this.updateEntityInteraction(builder, target);
        }
        if (flag.flagged(Flag.APPEARANCE) || updateAppearance) {
            this.updateAppearance(player, builder, target);
        }
        if (flag.flagged(Flag.FACE_POSITION) && target.positionToFace != null) {
            this.updateFacingPosition(builder, target);
        }
        if (flag.flagged(Flag.SINGLE_HIT)) {
            this.updateSingleHit(builder, target);
        }
        if (flag.flagged(Flag.DOUBLE_HIT)) {
            this.updateDoubleHit(builder, target);
        }
        /*if (!player.equals(target) && !updateAppearance && !noChat) {
        player.cachedUpdateBlock = builder.buffer();
        }*/
    }
    private static updateChat(builder: PacketBuilder, target: Player, receiver: Player) {
        const message = target.currentChatMessage;
        const bytes = message.text;
        builder.putShorts(((message.colour & 0xff) << 8) | (message.effects & 0xff), ByteOrder.LITTLE);
        builder.put(target.getRights().getSpriteId());
        builder.put(target.getRights().getSpriteId());
        builder.puts(bytes.length, ValueType.C);
        for (let ptr = bytes.length - 1; ptr >= 0; ptr--) {
            builder.put(bytes[ptr]);
        }
        if (receiver instanceof PlayerBot && !(target instanceof PlayerBot)) {
            // Player Bots: Automatically listen to chat messages
            (receiver as PlayerBot).chatInteraction.heard(message, target);
        }
    }
    private static updateForcedChat(builder: PacketBuilder, target: Player) {
        builder.putString(target.forcedChat);
    }
    private static updateForcedMovement(player: Player, builder: PacketBuilder, target: Player) {
        const startX = target.forceMovement.start.getLocalX(player.lastKnownRegion);
        const startY = target.forceMovement.start.getLocalY(player.lastKnownRegion);
        const endX = target.forceMovement.end.getX();
        const endY = target.forceMovement.end.getY();

        builder.puts(startX, ValueType.S);
        builder.puts(startY, ValueType.S);
        builder.puts(startX + endX, ValueType.S);
        builder.puts(startY + endY, ValueType.S);
        builder.putShort(target.forceMovement.speed, ValueType.A, ByteOrder.LITTLE);
        builder.putShort(target.forceMovement.reverseSpeed, ValueType.A, ByteOrder.BIG);
        builder.putShort(target.forceMovement.animation, ValueType.A, ByteOrder.LITTLE);
        builder.puts(target.forceMovement.direction, ValueType.S);
    }
    private static updateAnimation(builder: PacketBuilder, target: Player) {
        builder.putShorts(target.animation.id, ByteOrder.LITTLE);
        builder.puts(target.animation.delay, ValueType.C);
    }
    private static updateGraphics(builder: PacketBuilder, target: Player) {
        builder.putShorts(target.graphic.id, ByteOrder.LITTLE);
        builder.putInt(
            ((target.graphic.height * 50) << 16) + (target.graphic.delay & 0xffff));
    }
    private static updateSingleHit(builder: PacketBuilder, target: Player) {
        builder.putShort(target.primaryHit.damage);
        builder.put(target.primaryHit.hitmask.ordinal);
        builder.putShort(target.points);
        builder.putShort(target.skillManager.getMaxLevel(Skill.HITPOINTS));
    }
    private static updateDoubleHit(builder: PacketBuilder, target: Player) {
        builder.putShort(target.secondaryHit.damage);
        builder.put(target.secondaryHit.hitmask.ordinal);
        builder.putShort(target.points);
        builder.putShort(target.skillManager.getMaxLevel(Skill.HITPOINTS));
    }
    private static updateFacingPosition(builder: PacketBuilder, target: Player) {
        const position = target.positionToFace;
        builder.putShort(position.x * 2 + 1, ValueType.A, ByteOrder.LITTLE);
        builder.putShorts(position.y * 2 + 1, ByteOrder.LITTLE);
    }
    private static updateEntityInteraction(builder: PacketBuilder, target: Player) {
        let entity = target.interactingMobile;
        if (entity != null) {
            let index = entity.index;
            if (entity instanceof Player)
                index += +32768;
            builder.putShorts(index, ByteOrder.LITTLE);
        } else {
            builder.putShorts(-1, ByteOrder.LITTLE);
        }
    }
    private static updateAppearance(player: Player, out: PacketBuilder, target: Player): void {
        const appearance = target.getAppearance();
        const equipment = target.getEquipment();
        const properties = new PacketBuilder();

        properties.put(appearance.isMale() ? 0 : 1);

        // Head icon, prayers
        properties.put(appearance.getHeadHint());

        // Skull icon
        properties.put(target.isSkulled() ? target.getSkullType().getIconId() : -1);

        // Some sort of headhint (arrow over head)
        properties.put(0);

        if (player.getNpcTransformationId() == -1) {
            const equip = new Array<number>(equipment.capacity());
            for (let i = 0; i < equipment.capacity(); i++) {
                equip[i] = equipment.getItems()[i].getId();
            }
            if (equip[Equipment.HEAD_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.HEAD_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (equip[Equipment.CAPE_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.CAPE_SLOT]);
            } else {
                properties.put(0);
            }
            if (equip[Equipment.AMULET_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.AMULET_SLOT]);
            } else {
                properties.put(0);
            }
            if (equip[Equipment.WEAPON_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.WEAPON_SLOT]);
            } else {
                properties.put(0);
            }
            if (equip[Equipment.BODY_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.BODY_SLOT]);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.CHEST]);
            }
            if (equip[Equipment.SHIELD_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.SHIELD_SLOT]);
            } else {
                properties.put(0);
            }

            if (ItemDefinition.forId(equip[Equipment.BODY_SLOT]).getEquipmentType() == EquipmentType.PLATEBODY) {
                properties.put(0);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.ARMS]);
            }

            if (equip[Equipment.LEG_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.LEG_SLOT]);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.LEGS]);
            }

            if (ItemDefinition.forId(equip[Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType.FULL_HELMET
                || ItemDefinition.forId(equip[Equipment.CAPE_SLOT]).getEquipmentType() == EquipmentType.HOODED_CAPE
                || ItemDefinition.forId(equip[Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType.COIF) {
                properties.put(0);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.HEAD]);
            }

            if (equip[Equipment.HANDS_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.HANDS_SLOT]);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.HANDS]);
            }
            if (equip[Equipment.FEET_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment.FEET_SLOT]);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.FEET]);
            }
            if (appearance.getLook()[Appearance.BEARD] <= 0 || !appearance.isMale()
                || ItemDefinition.forId(equip[Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType.FULL_HELMET
            ) {
                properties.put(0);
            } else {
                properties.putShort(0x100 + appearance.getLook()[Appearance.BEARD]);
            }
        } else {
            properties.putShort(-1);
            properties.putShort(player.getNpcTransformationId());
        }
        properties.put(appearance.getLook()[Appearance.HAIR_COLOUR]);
        properties.put(appearance.getLook()[Appearance.TORSO_COLOUR]);
        properties.put(appearance.getLook()[Appearance.LEG_COLOUR]);
        properties.put(appearance.getLook()[Appearance.FEET_COLOUR]);
        properties.put(appearance.getLook()[Appearance.SKIN_COLOUR]);

        let skillAnim = target.getSkillAnimation();
        if (skillAnim > 0) {
            for (let i = 0; i < 7; i++)
                properties.putShort(skillAnim);
        } else {
            let wep = target.getEquipment().getItems()[Equipment.WEAPON_SLOT].getDefinition();
            properties.putShort(wep.getStandAnim());
            properties.putShort(0x337);
            properties.putShort(wep.getWalkAnim());
            properties.putShort(0x334);
            properties.putShort(0x335);
            properties.putShort(0x336);
            properties.putShort(wep.getRunAnim());
        }

        properties.putLong(target.getLongUsername());
        properties.put(target.getSkillManager().getCombatLevel());
        properties.put(target.getRights().getSpriteId());
        properties.putString(target.getLoyaltyTitle());

        out.puts(properties.getBuffer().length, ValueType.C);
        out.putBytes(properties.getBuffer());
    }
}
