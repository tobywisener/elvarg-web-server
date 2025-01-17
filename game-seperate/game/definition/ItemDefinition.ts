import { WeaponInterfaces } from "../content/combat/WeaponInterfaces";
import { EquipmentType } from "../model/EquipmentType";

export class ItemDefinition {
    public static definitions: Map<number, ItemDefinition> = new Map<number, ItemDefinition>();
    public static DEFAULT = new ItemDefinition();

    private id: number;
    private name: string = "";
    private examine: string = "";
    private weaponInterface: any;
    private equipmentType: EquipmentType = EquipmentType.NONE;
    private doubleHanded: boolean;
    private stackable: boolean;
    private tradeable: boolean;
    private dropable: boolean;
    private sellable: boolean;
    private noted: boolean;
    private value: number;
    private bloodMoneyValue: number;
    private highAlch: number;
    private lowAlch: number;
    private dropValue: number;
    private noteId: number = -1;
    private blockAnim: number = 424;
    private standAnim: number = 808;
    private walkAnim: number = 819;
    private runAnim: number = 824;
    private standTurnAnim: number = 823;
    private turn180Anim: number = 820;
    private turn90CWAnim: number = 821;
    private turn90CCWAnim: number = 821;
    private weight: number;
    private bonuses: number[];
    private requirements: number[];

    public static forId(item: number) {
        return this.definitions.get(item) || this.DEFAULT;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getExamine(): string {
        return this.examine;
    }

    public getValue(): number {
        return this.value;
    }

    public getBloodMoneyValue(): number {
        return this.bloodMoneyValue;
    }

    public getHighAlchValue(): number {
        return this.highAlch;
    }

    public getLowAlchValue(): number {
        return this.lowAlch;
    }

    public getDropValue(): number {
        return this.dropValue;
    }

    public isStackable(): boolean {
        return this.stackable;
    }

    public isTradeable(): boolean {
        return this.tradeable;
    }

    public isSellable(): boolean {
        return this.sellable;
    }

    public isDropable(): boolean {
        return this.dropable;
    }

    public isNoted(): boolean {
        return this.noted;
    }

    public getNoteId(): number {
        return this.noteId;
    }

    public isDoubleHanded(): boolean {
        return this.doubleHanded;
    }

    public getBlockAnim(): number {
        return this.blockAnim;
    }

    public getStandAnim(): number {
        return this.standAnim;
    }

    public getWalkAnim(): number {
        return this.walkAnim;
    }

    public getRunAnim(): number {
        return this.runAnim;
    }

    public getStandTurnAnim(): number {
        return this.standTurnAnim;
    }

    public getTurn180Anim(): number {
        return this.turn180Anim;
    }

    public getTurn90CWAnim(): number {
        return this.turn90CWAnim;
    }

    public getTurn90CCWAnim(): number {
        return this.turn90CCWAnim;
    }

    public getWeight(): number {
        return this.weight;
    }

    public getBonuses(): number[] {
        return this.bonuses;
    }

    public getRequirements(): number[] {
        return this.requirements;
    }

    public getWeaponInterface(): WeaponInterfaces {
        return this.weaponInterface;
    }

    public getEquipmentType(): EquipmentType {
        return this.equipmentType;
    }

    public unNote(): number {
        return ItemDefinition.forId(this.id - 1).getName().toString() ? this.id - 1 : this.id;
    }
}