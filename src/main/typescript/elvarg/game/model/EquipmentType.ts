import { Equipment } from "../model/container/impl/Equipment";

export class EquipmentType {
    public static readonly HOODED_CAPE = new EquipmentType(Equipment.CAPE_SLOT);
    public static readonly CAPE = new EquipmentType(Equipment.CAPE_SLOT);
    public static readonly SHIELD = new EquipmentType(Equipment.SHIELD_SLOT);
    public static readonly GLOVES =  new EquipmentType(Equipment.HANDS_SLOT);
    public static readonly BOOTS =  new EquipmentType(Equipment.FEET_SLOT);
    public static readonly AMULET = new EquipmentType(Equipment.AMULET_SLOT);
    public static readonly RING = new EquipmentType(Equipment.RING_SLOT);
    public static readonly ARROWS = new EquipmentType(Equipment.AMMUNITION_SLOT);
    public static readonly COIF = new EquipmentType(Equipment.HEAD_SLOT);
    public static readonly HAT =  new EquipmentType(Equipment.HEAD_SLOT);
    public static readonly MASK =  new EquipmentType(Equipment.HEAD_SLOT);
    public static readonly MED_HELMET = new EquipmentType(Equipment.HEAD_SLOT);
    public static readonly FULL_HELMET = new EquipmentType(Equipment.HEAD_SLOT);
    public static readonly BODY = new EquipmentType(Equipment.BODY_SLOT);
    public static readonly PLATEBODY =  new EquipmentType(Equipment.BODY_SLOT);
    public static readonly LEGS = new EquipmentType(Equipment.LEG_SLOT);
    public static readonly WEAPON =  new EquipmentType(Equipment.WEAPON_SLOT);
    public static readonly NONE = new EquipmentType(-1);

    private slot: number;

    constructor(slot: number) {
        this.slot = slot;
    }

    public getSlot() {
        return this.slot;
    }
}
