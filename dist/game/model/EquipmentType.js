"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentType = void 0;
var Equipment_1 = require("../model/container/impl/Equipment");
var EquipmentType = exports.EquipmentType = /** @class */ (function () {
    function EquipmentType(slot) {
        this.slot = slot;
    }
    EquipmentType.prototype.getSlot = function () {
        return this.slot;
    };
    EquipmentType.HOODED_CAPE = new EquipmentType(Equipment_1.Equipment.CAPE_SLOT);
    EquipmentType.CAPE = new EquipmentType(Equipment_1.Equipment.CAPE_SLOT);
    EquipmentType.SHIELD = new EquipmentType(Equipment_1.Equipment.SHIELD_SLOT);
    EquipmentType.GLOVES = new EquipmentType(Equipment_1.Equipment.HANDS_SLOT);
    EquipmentType.BOOTS = new EquipmentType(Equipment_1.Equipment.FEET_SLOT);
    EquipmentType.AMULET = new EquipmentType(Equipment_1.Equipment.AMULET_SLOT);
    EquipmentType.RING = new EquipmentType(Equipment_1.Equipment.RING_SLOT);
    EquipmentType.ARROWS = new EquipmentType(Equipment_1.Equipment.AMMUNITION_SLOT);
    EquipmentType.COIF = new EquipmentType(Equipment_1.Equipment.HEAD_SLOT);
    EquipmentType.HAT = new EquipmentType(Equipment_1.Equipment.HEAD_SLOT);
    EquipmentType.MASK = new EquipmentType(Equipment_1.Equipment.HEAD_SLOT);
    EquipmentType.MED_HELMET = new EquipmentType(Equipment_1.Equipment.HEAD_SLOT);
    EquipmentType.FULL_HELMET = new EquipmentType(Equipment_1.Equipment.HEAD_SLOT);
    EquipmentType.BODY = new EquipmentType(Equipment_1.Equipment.BODY_SLOT);
    EquipmentType.PLATEBODY = new EquipmentType(Equipment_1.Equipment.BODY_SLOT);
    EquipmentType.LEGS = new EquipmentType(Equipment_1.Equipment.LEG_SLOT);
    EquipmentType.WEAPON = new EquipmentType(Equipment_1.Equipment.WEAPON_SLOT);
    EquipmentType.NONE = new EquipmentType(-1);
    return EquipmentType;
}());
//# sourceMappingURL=EquipmentType.js.map