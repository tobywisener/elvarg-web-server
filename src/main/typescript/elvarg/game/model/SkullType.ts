export class SkullType {
    public static readonly WHITE_SKULL = new SkullType(0);
    public static readonly RED_SKULL = new SkullType (1);

    iconId: number;

    constructor(iconId: number) {
        this.iconId = iconId;
    }

    public getIconId(): number {
        return this.iconId;
    }
}