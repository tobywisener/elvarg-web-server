export class EffectTimer {
    public static readonly VENGEANCE = new EffectTimer(157)
    public static readonly FREEZE = new EffectTimer (158)
    public static readonly ANTIFIRE = new EffectTimer (159)
    public static readonlyOVERLOAD = new EffectTimer (160)
    public static readonly TELE_BLOCK = new EffectTimer(161)

    clientSprite: number;

    constructor(clientSprite: number) {
        this.clientSprite = clientSprite;
    }

    public getClientSprite(): number {
        return this.clientSprite;
    }

    public setClientSprite(sprite: number): void {
        this.clientSprite = sprite;
    }
}