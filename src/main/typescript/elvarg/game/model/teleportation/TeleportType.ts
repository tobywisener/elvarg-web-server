import { GraphicHeight } from "../GraphicHeight";
import { Priority } from "../Priority";
import { Graphic } from "../Graphic";
import { Animation } from "../Animation";

export class TeleportType {
    // Spellbooks
    public static readonly NORMAL = new TeleportType(3, new Animation(714), null, new Animation(715), new Graphic(308, 50), null, null);
    public static readonly ANCIENT = new TeleportType(5, new Animation(1979), null, Animation.DEFAULT_RESET_ANIMATION, new Graphic(392, Priority.HIGH), null, null);
    public static readonly LUNAR = new TeleportType(4, new Animation(1816), null, new Animation(715), new Graphic(308, Priority.HIGH), null, null);
    // Ladders
    public static readonly LADDER_DOWN = new TeleportType(1, new Animation(827), null, Animation.DEFAULT_RESET_ANIMATION, null, null, null);
    public static readonly LADDER_UP = new TeleportType(1, new Animation(828), null, Animation.DEFAULT_RESET_ANIMATION, null, null, null);
    // Misc
    public static readonly LEVER = new TeleportType(3, new Animation(2140), new Animation(714), new Animation(715), null, null, new Graphic(308, 50));
    public static readonly TELE_TAB = new TeleportType(3, new Animation(4071), null, Animation.DEFAULT_RESET_ANIMATION, new Graphic(678, Priority.HIGH), null, null);
    public static readonly PURO_PURO = new TeleportType(9, new Animation(6601), null, Animation.DEFAULT_RESET_ANIMATION, new Graphic(1118, Priority.HIGH), null, null);

    private readonly startAnim: Animation;
    private readonly middleAnim: Animation;
    private readonly endAnim: Animation;
    private readonly startGraphic: Graphic;
    private readonly middleGraphic: Graphic;
    private readonly endGraphic: Graphic;
    private readonly startTick: number;

    constructor(
        startTick: number,
        startAnim: Animation,
        middleAnim: Animation,
        endAnim: Animation,
        startGraphic: Graphic,
        middleGraphic: Graphic,
        endGraphic: Graphic
    ) {
        this.startTick = startTick;
        this.startAnim = startAnim;
        this.middleAnim = middleAnim;
        this.endAnim = endAnim;
        this.startGraphic = startGraphic;
        this.middleGraphic = middleGraphic;
        this.endGraphic = endGraphic;
    }

    getStartAnimation(): Animation {
        return this.startAnim;
    }

    getEndAnimation(): Animation {
        return this.endAnim;
    }

    getStartGraphic(): Graphic {
        return this.startGraphic;
    }

    getEndGraphic(): Graphic {
        return this.endGraphic;
    }

    getStartTick(): number {
        return this.startTick;
    }

    getMiddleAnim(): Animation {
        return this.middleAnim;
    }

    getMiddleGraphic(): Graphic {
        return this.middleGraphic;
    }
}



