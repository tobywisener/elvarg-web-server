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
exports.PlayerUpdating = void 0;
var World_1 = require("../../World");
var ItemDefinition_1 = require("../../definition/ItemDefinition");
var Player_1 = require("../impl/player/Player");
var PlayerBot_1 = require("../impl/playerbot/PlayerBot");
var Equipment_1 = require("../../model/container/impl/Equipment");
var PacketType_1 = require("../../../net/packet/PacketType");
var PacketBuilder_1 = require("../../../net/packet/PacketBuilder");
var EquipmentType_1 = require("../../model/EquipmentType");
var Appearance_1 = require("../../model/Appearance");
var Flag_1 = require("../../model/Flag");
var ByteOrder_1 = require("../../../net/packet/ByteOrder");
var Skill_1 = require("../../model/Skill");
var PlayerUpdating = exports.PlayerUpdating = /** @class */ (function () {
    function PlayerUpdating() {
    }
    PlayerUpdating.update = function (player) {
        var e_1, _a, e_2, _b;
        var update = new PacketBuilder_1.PacketBuilder();
        var packet = new PacketBuilder_1.PacketBuilder(81, PacketType_1.PacketType.VARIABLE_SHORT);
        packet.initializeAccess(PacketBuilder_1.AccessType.BIT);
        this.updateMovement(player, packet);
        this.appendUpdates(player, update, player, false, true);
        packet.putBits(8, player.getLocalPlayers().length);
        try {
            for (var _c = __values(player.getLocalPlayers()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var playerIterator = _d.value;
                if (World_1.World.getPlayers().get(playerIterator.getIndex()) != null
                    && playerIterator.getLocation().isViewableFrom(player.getLocation())
                    && !playerIterator.isNeedsPlacement()
                    && playerIterator.getPrivateArea() === player.getPrivateArea()) {
                    this.updateOtherPlayerMovement(packet, playerIterator);
                    if (playerIterator.getUpdateFlag().isUpdateRequired()) {
                        this.appendUpdates(player, update, playerIterator, false, false);
                    }
                }
                else {
                    playerIterator.onRemove();
                    packet.putBits(1, 1);
                    packet.putBits(2, 3);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var playersAdded = 0;
        try {
            for (var _e = __values(World_1.World.getPlayers()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var otherPlayer = _f.value;
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
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (update.buffer().length > 0) {
            packet.putBits(11, 2047);
            packet.initializeAccess(PacketBuilder_1.AccessType.BYTE);
            packet.putBytes(update.getBuffer());
        }
        else {
            packet.initializeAccess(PacketBuilder_1.AccessType.BYTE);
        }
        player.getSession().write(packet);
    };
    PlayerUpdating.addPlayer = function (player, target, builder) {
        builder.putBits(11, target.getIndex());
        builder.putBits(1, 1);
        builder.putBits(1, 1);
        var yDiff = target.getLocation().getY() - player.getLocation().getY();
        var xDiff = target.getLocation().getX() - player.getLocation().getX();
        builder.putBits(5, yDiff);
        builder.putBits(5, xDiff);
    };
    PlayerUpdating.updateMovement = function (player, builder) {
        if (player.isNeedsPlacement()) {
            builder.putBits(1, 1);
            builder.putBits(2, 3);
            builder.putBits(2, player.getLocation().getZ());
            builder.putBits(1, player.isResetMovementQueue() ? 1 : 0);
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
            builder.putBits(7, player.getLocation().getLocalY(player.getLastKnownRegion()));
            builder.putBits(7, player.getLocation().getLocalX(player.getLastKnownRegion()));
        }
        else if (player.getWalkingDirection().getId() == -1) {
            if (player.getUpdateFlag().isUpdateRequired()) {
                builder.putBits(1, 1);
                builder.putBits(2, 0);
            }
            else {
                builder.putBits(1, 0);
            }
        }
        else if (player.getRunningDirection().getId() == -1) {
            builder.putBits(1, 1);
            builder.putBits(2, 1);
            builder.putBits(3, player.getWalkingDirection().getId());
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        }
        else {
            builder.putBits(1, 1);
            builder.putBits(2, 2);
            builder.putBits(3, player.getWalkingDirection().getId());
            builder.putBits(3, player.getRunningDirection().getId());
            builder.putBits(1, player.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        }
    };
    PlayerUpdating.updateOtherPlayerMovement = function (builder, target) {
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
            }
            else {
                /*
                 * Signify that nothing changed.
                 */
                builder.putBits(1, 0);
            }
        }
        else if (target.getRunningDirection().getId() == -1) {
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
        }
        else {
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
    };
    PlayerUpdating.appendUpdates = function (player, builder, target, updateAppearance, noChat) {
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
        var flag = target.updateFlag;
        var mask = 0;
        if (flag.flagged(Flag_1.Flag.GRAPHIC) && target.graphic != null) {
            mask |= 0x100;
        }
        if (flag.flagged(Flag_1.Flag.ANIMATION) && target.animation != null) {
            mask |= 0x8;
        }
        if (flag.flagged(Flag_1.Flag.FORCED_CHAT) && target.forcedChat != null) {
            mask |= 0x4;
        }
        if (flag.flagged(Flag_1.Flag.CHAT) && target.currentChatMessage != null && !noChat && !player.relations.ignoreList.includes(target.longUsername)) {
            mask |= 0x80;
        }
        if (flag.flagged(Flag_1.Flag.ENTITY_INTERACTION)) {
            mask |= 0x1;
        }
        if (flag.flagged(Flag_1.Flag.APPEARANCE) || updateAppearance) {
            mask |= 0x10;
        }
        if (flag.flagged(Flag_1.Flag.FACE_POSITION) && target.positionToFace != null) {
            mask |= 0x2;
        }
        if (flag.flagged(Flag_1.Flag.SINGLE_HIT)) {
            mask |= 0x20;
        }
        if (flag.flagged(Flag_1.Flag.DOUBLE_HIT)) {
            mask |= 0x200;
        }
        if (flag.flagged(Flag_1.Flag.FORCED_MOVEMENT) && target.forceMovement != null) {
            mask |= 0x400;
        }
        if (mask >= 0x100) {
            mask |= 0x40;
            builder.putShorts(mask, ByteOrder_1.ByteOrder.LITTLE);
        }
        else {
            builder.put(mask);
        }
        if (flag.flagged(Flag_1.Flag.FORCED_MOVEMENT) && target.forceMovement != null) {
            this.updateForcedMovement(player, builder, target);
        }
        if (flag.flagged(Flag_1.Flag.GRAPHIC) && target.graphic != null) {
            this.updateGraphics(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.ANIMATION) && target.animation != null) {
            this.updateAnimation(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.FORCED_CHAT) && target.forcedChat != null) {
            this.updateForcedChat(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.CHAT) && target.currentChatMessage != null && !noChat && !player.relations.ignoreList.includes(target.longUsername)) {
            this.updateChat(builder, target, player);
        }
        if (flag.flagged(Flag_1.Flag.ENTITY_INTERACTION)) {
            this.updateEntityInteraction(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.APPEARANCE) || updateAppearance) {
            this.updateAppearance(player, builder, target);
        }
        if (flag.flagged(Flag_1.Flag.FACE_POSITION) && target.positionToFace != null) {
            this.updateFacingPosition(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.SINGLE_HIT)) {
            this.updateSingleHit(builder, target);
        }
        if (flag.flagged(Flag_1.Flag.DOUBLE_HIT)) {
            this.updateDoubleHit(builder, target);
        }
        /*if (!player.equals(target) && !updateAppearance && !noChat) {
        player.cachedUpdateBlock = builder.buffer();
        }*/
    };
    PlayerUpdating.updateChat = function (builder, target, receiver) {
        var message = target.currentChatMessage;
        var bytes = message.text;
        builder.putShorts(((message.colour & 0xff) << 8) | (message.effects & 0xff), ByteOrder_1.ByteOrder.LITTLE);
        builder.put(target.getRights().getSpriteId());
        builder.put(target.getRights().getSpriteId());
        builder.puts(bytes.length, PacketBuilder_1.ValueType.C);
        for (var ptr = bytes.length - 1; ptr >= 0; ptr--) {
            builder.put(bytes[ptr]);
        }
        if (receiver instanceof PlayerBot_1.PlayerBot && !(target instanceof PlayerBot_1.PlayerBot)) {
            // Player Bots: Automatically listen to chat messages
            receiver.chatInteraction.heard(message, target);
        }
    };
    PlayerUpdating.updateForcedChat = function (builder, target) {
        builder.putString(target.forcedChat);
    };
    PlayerUpdating.updateForcedMovement = function (player, builder, target) {
        var startX = target.forceMovement.start.getLocalX(player.lastKnownRegion);
        var startY = target.forceMovement.start.getLocalY(player.lastKnownRegion);
        var endX = target.forceMovement.end.getX();
        var endY = target.forceMovement.end.getY();
        builder.puts(startX, PacketBuilder_1.ValueType.S);
        builder.puts(startY, PacketBuilder_1.ValueType.S);
        builder.puts(startX + endX, PacketBuilder_1.ValueType.S);
        builder.puts(startY + endY, PacketBuilder_1.ValueType.S);
        builder.putShort(target.forceMovement.speed, PacketBuilder_1.ValueType.A, ByteOrder_1.ByteOrder.LITTLE);
        builder.putShort(target.forceMovement.reverseSpeed, PacketBuilder_1.ValueType.A, ByteOrder_1.ByteOrder.BIG);
        builder.putShort(target.forceMovement.animation, PacketBuilder_1.ValueType.A, ByteOrder_1.ByteOrder.LITTLE);
        builder.puts(target.forceMovement.direction, PacketBuilder_1.ValueType.S);
    };
    PlayerUpdating.updateAnimation = function (builder, target) {
        builder.putShorts(target.animation.id, ByteOrder_1.ByteOrder.LITTLE);
        builder.puts(target.animation.delay, PacketBuilder_1.ValueType.C);
    };
    PlayerUpdating.updateGraphics = function (builder, target) {
        builder.putShorts(target.graphic.id, ByteOrder_1.ByteOrder.LITTLE);
        builder.putInt(((target.graphic.height * 50) << 16) + (target.graphic.delay & 0xffff));
    };
    PlayerUpdating.updateSingleHit = function (builder, target) {
        builder.putShort(target.primaryHit.damage);
        builder.put(target.primaryHit.hitmask.ordinal);
        builder.putShort(target.points);
        builder.putShort(target.skillManager.getMaxLevel(Skill_1.Skill.HITPOINTS));
    };
    PlayerUpdating.updateDoubleHit = function (builder, target) {
        builder.putShort(target.secondaryHit.damage);
        builder.put(target.secondaryHit.hitmask.ordinal);
        builder.putShort(target.points);
        builder.putShort(target.skillManager.getMaxLevel(Skill_1.Skill.HITPOINTS));
    };
    PlayerUpdating.updateFacingPosition = function (builder, target) {
        var position = target.positionToFace;
        builder.putShort(position.x * 2 + 1, PacketBuilder_1.ValueType.A, ByteOrder_1.ByteOrder.LITTLE);
        builder.putShorts(position.y * 2 + 1, ByteOrder_1.ByteOrder.LITTLE);
    };
    PlayerUpdating.updateEntityInteraction = function (builder, target) {
        var entity = target.interactingMobile;
        if (entity != null) {
            var index = entity.index;
            if (entity instanceof Player_1.Player)
                index += +32768;
            builder.putShorts(index, ByteOrder_1.ByteOrder.LITTLE);
        }
        else {
            builder.putShorts(-1, ByteOrder_1.ByteOrder.LITTLE);
        }
    };
    PlayerUpdating.updateAppearance = function (player, out, target) {
        var appearance = target.getAppearance();
        var equipment = target.getEquipment();
        var properties = new PacketBuilder_1.PacketBuilder();
        properties.put(appearance.isMale() ? 0 : 1);
        // Head icon, prayers
        properties.put(appearance.getHeadHint());
        // Skull icon
        properties.put(target.isSkulled() ? target.getSkullType().getIconId() : -1);
        // Some sort of headhint (arrow over head)
        properties.put(0);
        if (player.getNpcTransformationId() == -1) {
            var equip = new Array(equipment.capacity());
            for (var i = 0; i < equipment.capacity(); i++) {
                equip[i] = equipment.getItems()[i].getId();
            }
            if (equip[Equipment_1.Equipment.HEAD_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.HEAD_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (equip[Equipment_1.Equipment.CAPE_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.CAPE_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (equip[Equipment_1.Equipment.AMULET_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.AMULET_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (equip[Equipment_1.Equipment.WEAPON_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.WEAPON_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (equip[Equipment_1.Equipment.BODY_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.BODY_SLOT]);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.CHEST]);
            }
            if (equip[Equipment_1.Equipment.SHIELD_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.SHIELD_SLOT]);
            }
            else {
                properties.put(0);
            }
            if (ItemDefinition_1.ItemDefinition.forId(equip[Equipment_1.Equipment.BODY_SLOT]).getEquipmentType() == EquipmentType_1.EquipmentType.PLATEBODY) {
                properties.put(0);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.ARMS]);
            }
            if (equip[Equipment_1.Equipment.LEG_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.LEG_SLOT]);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.LEGS]);
            }
            if (ItemDefinition_1.ItemDefinition.forId(equip[Equipment_1.Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType_1.EquipmentType.FULL_HELMET
                || ItemDefinition_1.ItemDefinition.forId(equip[Equipment_1.Equipment.CAPE_SLOT]).getEquipmentType() == EquipmentType_1.EquipmentType.HOODED_CAPE
                || ItemDefinition_1.ItemDefinition.forId(equip[Equipment_1.Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType_1.EquipmentType.COIF) {
                properties.put(0);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.HEAD]);
            }
            if (equip[Equipment_1.Equipment.HANDS_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.HANDS_SLOT]);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.HANDS]);
            }
            if (equip[Equipment_1.Equipment.FEET_SLOT] > -1) {
                properties.putShort(0x200 + equip[Equipment_1.Equipment.FEET_SLOT]);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.FEET]);
            }
            if (appearance.getLook()[Appearance_1.Appearance.BEARD] <= 0 || !appearance.isMale()
                || ItemDefinition_1.ItemDefinition.forId(equip[Equipment_1.Equipment.HEAD_SLOT]).getEquipmentType() == EquipmentType_1.EquipmentType.FULL_HELMET) {
                properties.put(0);
            }
            else {
                properties.putShort(0x100 + appearance.getLook()[Appearance_1.Appearance.BEARD]);
            }
        }
        else {
            properties.putShort(-1);
            properties.putShort(player.getNpcTransformationId());
        }
        properties.put(appearance.getLook()[Appearance_1.Appearance.HAIR_COLOUR]);
        properties.put(appearance.getLook()[Appearance_1.Appearance.TORSO_COLOUR]);
        properties.put(appearance.getLook()[Appearance_1.Appearance.LEG_COLOUR]);
        properties.put(appearance.getLook()[Appearance_1.Appearance.FEET_COLOUR]);
        properties.put(appearance.getLook()[Appearance_1.Appearance.SKIN_COLOUR]);
        var skillAnim = target.getSkillAnimation();
        if (skillAnim > 0) {
            for (var i = 0; i < 7; i++)
                properties.putShort(skillAnim);
        }
        else {
            var wep = target.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getDefinition();
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
        out.puts(properties.getBuffer().length, PacketBuilder_1.ValueType.C);
        out.putBytes(properties.getBuffer());
    };
    PlayerUpdating.MAX_NEW_PLAYERS_PER_CYCLE = 25;
    return PlayerUpdating;
}());
//# sourceMappingURL=PlayerUpdating.js.map