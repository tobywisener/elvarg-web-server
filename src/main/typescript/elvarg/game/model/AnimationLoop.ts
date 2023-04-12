import { Animation } from './Animation';
export class AnimationLoop {
    anim: Animation;
    loopDelay: number;

    constructor(anim: Animation, loopDelay: number) {
        this.anim = anim;
        this.loopDelay = loopDelay;
    }

    getAnim(): Animation {
        return this.anim;
    }

    getLoopDelay(): number {
        return this.loopDelay;
    }
}
