import { Misc } from "./Misc";

export class Chance {
    public static readonly ALWAYS = new Chance(100);
    public static readonly VERY_COMMON = new Chance(90);
    public static readonly COMMON = new Chance(75);
    public static readonly SOMETIMES = new Chance(50);
    public static readonly UNCOMMON = new Chance(35);
    public static readonly VERY_UNCOMMON = new Chance(10);
    public static readonly EXTREMELY_RARE = new Chance(5);
    public static readonly ALMOST_IMPOSSIBLE = new Chance(1);

    private percentage: number;

    constructor(percentage: number) {
        this.percentage = percentage;
    }

    success(): boolean {
        return (Misc.getRandom(100)) <= this.percentage;
    }

    getPercentage(): number {
        return this.percentage;
    }
}

