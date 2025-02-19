"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipPacketListener = void 0;
// import { DuelRule } from "../../../game/content/Duelling";
// import { GameConstants } from "../../../game/GameConstants";
// import { Flag } from "../../../game/model/Flag";
// import { BonusManager } from "../../../game/model/equipment/BonusManager";
var EquipPacketListener = /** @class */ (function () {
    function EquipPacketListener() {
    }
    // public static resetWeapon(player: Player, deactivateSpecialAttack: boolean) {
    EquipPacketListener.resetWeapon = function (player, deactivateSpecialAttack) {
        if (deactivateSpecialAttack) {
            player.setSpecialActivated(false);
        }
        player.getPacketSender().sendSpecialAttackState(false);
        // WeaponInterfaces.assign(player);
    };
    // execute(player: Player, packet: Packet) {
    EquipPacketListener.prototype.execute = function (player, packet) {
        var id = packet.readShort();
        var slot = packet.readShortA();
        var interfaceId = packet.readShortA();
        // EquipPacketListener.equip(player, id, slot, interfaceId);
    };
    return EquipPacketListener;
}());
exports.EquipPacketListener = EquipPacketListener;
//# sourceMappingURL=EquipPacketListener.js.map