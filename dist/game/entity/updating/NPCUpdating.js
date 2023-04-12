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
exports.NPCUpdating = void 0;
var World_1 = require("../../../game/World");
var Player_1 = require("../../entity/impl/player/Player");
var Flag_1 = require("../../model/Flag");
var PacketBuilder_1 = require("../../../net/packet/PacketBuilder");
var PacketType_1 = require("../../../net/packet/PacketType");
var ByteOrder_1 = require("../../../net/packet/ByteOrder");
/**
 * Represents a player's npc updating task, which loops through all local
 * npcs and updates their masks according to their current attributes.
 *
 * @author Relex lawl
 */
/**
 * Handles the actual npc updating for the associated player.
 *
 * @return The NPCUpdating instance.
 */
var NPCUpdating = /** @class */ (function () {
    function NPCUpdating() {
    }
    NPCUpdating.update = function (player) {
        var e_1, _a, e_2, _b;
        var _c;
        var update = new PacketBuilder_1.PacketBuilder();
        var packet = new PacketBuilder_1.PacketBuilder(65, PacketType_1.PacketType.VARIABLE_SHORT);
        packet.initializeAccess(PacketBuilder_1.AccessType.BIT);
        packet.putBits(8, player.getLocalNpcs().length);
        try {
            for (var _d = __values(player.getLocalNpcs()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var npcIterator = _e.value;
                var npc = npcIterator;
                if (World_1.World.getNpcs().get(npc.getIndex()) != null
                    && npc.isVisible()
                    && player.getLocation().isViewableFrom(npc.getLocation())
                    && !npc.isNeedsPlacement()
                    && npc.getPrivateArea() == player.getPrivateArea()) {
                    NPCUpdating.updateMovement(npc, packet);
                    if (npc.getUpdateFlag().isUpdateRequired()) {
                        NPCUpdating.appendUpdates(npc, update);
                    }
                }
                else {
                    npcIterator.onRemove();
                    packet.putBits(1, 1);
                    packet.putBits(2, 3);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _f = __values(World_1.World.getNpcs()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var npc = _g.value;
                if (player.getLocalNpcs().length >= 79) //Originally 255
                    break;
                if (npc == null || player.getLocalNpcs().includes(npc) || !npc.isVisible() || npc.isNeedsPlacement()
                    || npc.getPrivateArea() != player.getPrivateArea())
                    continue;
                if (npc.getLocation().isViewableFrom(player.getLocation())) {
                    player.getLocalNpcs().push(npc);
                    NPCUpdating.addNPC(player, npc, packet);
                    if (npc.getUpdateFlag().isUpdateRequired()) {
                        NPCUpdating.appendUpdates(npc, update);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (update.getBuffer().length > 0) {
            packet.putBits(14, 16383);
            packet.initializeAccess(PacketBuilder_1.AccessType.BYTE);
            packet.writeBuffer(update.getBuffer().toString());
        }
        else {
            packet.initializeAccess(PacketBuilder_1.AccessType.BYTE);
        }
        (_c = player.getSession()) === null || _c === void 0 ? void 0 : _c.write(packet);
    };
    /**
     * Adds an npc to the associated player's client.
     *
     * @param npc     The npc to add.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.addNPC = function (player, npc, builder) {
        builder.putBits(14, npc.getIndex());
        builder.putBits(5, npc.getLocation().getY() - player.getLocation().getY());
        builder.putBits(5, npc.getLocation().getX() - player.getLocation().getX());
        builder.putBits(1, 0);
        builder.putBits(14, npc.getId());
        builder.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
    };
    /**
     * Updates the npc's movement queue.
     *
     * @param npc     The npc who's movement is updated.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.updateMovement = function (npc, out) {
        if (npc.getRunningDirection().getId() == -1) {
            if (npc.getWalkingDirection().getId() == -1) {
                if (npc.getUpdateFlag().isUpdateRequired()) {
                    out.putBits(1, 1);
                    out.putBits(2, 0);
                }
                else {
                    out.putBits(1, 0);
                }
            }
            else {
                out.putBits(1, 1);
                out.putBits(2, 1);
                out.putBits(3, npc.getWalkingDirection().getId());
                out.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
            }
        }
        else {
            out.putBits(1, 1);
            out.putBits(2, 2);
            out.putBits(3, npc.getWalkingDirection().getId());
            out.putBits(3, npc.getRunningDirection().getId());
            out.putBits(1, npc.getUpdateFlag().isUpdateRequired() ? 1 : 0);
        }
    };
    /**
     * Appends a mask update for {@code npc}.
     *
     * @param npc     The npc to update masks for.
     * @param builder The packet builder to write information on.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.appendUpdates = function (npc, block) {
        var mask = 0;
        var flag = npc.getUpdateFlag();
        if (flag.flagged(Flag_1.Flag.ANIMATION) && npc.getAnimation() != null) {
            mask |= 0x10;
        }
        if (flag.flagged(Flag_1.Flag.GRAPHIC) && npc.getGraphic() != null) {
            mask |= 0x80;
        }
        if (flag.flagged(Flag_1.Flag.SINGLE_HIT)) {
            mask |= 0x8;
        }
        if (flag.flagged(Flag_1.Flag.ENTITY_INTERACTION)) {
            mask |= 0x20;
        }
        if (flag.flagged(Flag_1.Flag.FORCED_CHAT) && npc.getForcedChat() != null) {
            mask |= 0x1;
        }
        if (flag.flagged(Flag_1.Flag.DOUBLE_HIT)) {
            mask |= 0x40;
        }
        if (flag.flagged(Flag_1.Flag.APPEARANCE) && npc.getNpcTransformationId() != -1) {
            mask |= 0x2;
        }
        if (flag.flagged(Flag_1.Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
            mask |= 0x4;
        }
        block.put(mask);
        if (flag.flagged(Flag_1.Flag.ANIMATION) && npc.getAnimation() != null) {
            NPCUpdating.updateAnimation(block, npc);
        }
        if (flag.flagged(Flag_1.Flag.GRAPHIC) && npc.getGraphic() != null) {
            NPCUpdating.updateGraphics(block, npc);
        }
        if (flag.flagged(Flag_1.Flag.SINGLE_HIT)) {
            NPCUpdating.updateSingleHit(block, npc);
        }
        if (flag.flagged(Flag_1.Flag.ENTITY_INTERACTION)) {
            var entity = npc.getInteractingMobile();
            block.putShort(entity == null ? -1 : entity.getIndex() + (entity instanceof Player_1.Player ? 32768 : 0));
        }
        if (flag.flagged(Flag_1.Flag.FORCED_CHAT) && npc.getForcedChat() != null) {
            block.putString(npc.getForcedChat());
        }
        if (flag.flagged(Flag_1.Flag.DOUBLE_HIT)) {
            NPCUpdating.updateDoubleHit(block, npc);
        }
        if (flag.flagged(Flag_1.Flag.APPEARANCE)) {
            var transform = npc.getNpcTransformationId() !== -1;
            block.put(npc.getHeadIcon());
            block.put(transform ? 1 : 0);
            if (transform) {
                block.putShort(npc.getNpcTransformationId());
            }
        }
        if (flag.flagged(Flag_1.Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
            var position = npc.getPositionToFace();
            if (npc.getUpdateFlag().flagged(Flag_1.Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
                position = npc.getPositionToFace();
                if (npc.getUpdateFlag().flagged(Flag_1.Flag.FACE_POSITION) && npc.getPositionToFace() != null) {
                    position = npc.getPositionToFace();
                    block.putShorts(position.getX() * 2 + 1, ByteOrder_1.ByteOrder.LITTLE);
                    block.putShorts(position.getY() * 2 + 1, ByteOrder_1.ByteOrder.LITTLE);
                }
            }
        }
    };
    /**
     * Updates {@code npc}'s current animation and displays it for all local players.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update animation for.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.updateAnimation = function (builder, npc) {
        builder.putShorts(npc.getAnimation().getId(), ByteOrder_1.ByteOrder.LITTLE);
        builder.put(npc.getAnimation().getDelay());
    };
    /**
     * Updates {@code npc}'s current graphics and displays it for all local players.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update graphics for.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.updateGraphics = function (builder, npc) {
        builder.putShort(npc.getGraphic().getId());
        builder.putInt(((npc.getGraphic().getHeight().valueOf() * 50) << 16) + (npc.getGraphic().getDelay() & 0xffff));
    };
    /**
     * Updates the npc's single hit.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update the single hit for.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.updateSingleHit = function (builder, npc) {
        builder.putShort(npc.getPrimaryHit().getDamage());
        builder.put(npc.getPrimaryHit().getHitmask());
        builder.putShort(npc.getHitpoints());
        builder.putShort(npc.getDefinition().getHitpoints());
    };
    /**
     * Updates the npc's double hit.
     *
     * @param builder The packet builder to write information on.
     * @param npc     The npc to update the double hit for.
     * @return The NPCUpdating instance.
     */
    NPCUpdating.updateDoubleHit = function (builder, npc) {
        builder.putShort(npc.getSecondaryHit().getDamage());
        builder.put(npc.getSecondaryHit().getHitmask());
        builder.putShort(npc.getHitpoints());
        builder.putShort(npc.getDefinition().getHitpoints());
    };
    return NPCUpdating;
}());
exports.NPCUpdating = NPCUpdating;
//# sourceMappingURL=NPCUpdating.js.map