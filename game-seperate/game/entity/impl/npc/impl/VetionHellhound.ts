import { Mobile } from "../../Mobile";
import {Location} from "../../../../model/Location"
import { NPC } from "../NPC";
import {Vetion} from "./Vetion"


export class VetionHellhound extends NPC {

    private vetion: Vetion;
    private timer = 0;

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public process() {
        super.process();

        if (this.vetion != null) {
            let target = this.vetion.getCombat().getTarget();
            if (target == null) {
                target = this.vetion.getCombat().getAttacker();
            }

            if (target != null) {
                if (this.getCombat().getTarget() != target) {
                    this.getCombat().attack(target);
                }
                return;
            }
        }

        if (this.timer == 500) {
            this.appendDeath();
        }
        this.timer++;

    }

    public appendDeath() {
        super.appendDeath();
        if (this.vetion != null) {
            this.vetion.despawnHellhound(this);
        }
    }

    public getVetion(): Vetion {
        return this.vetion;
    }

    public setVetion(vetion: Vetion) {
        this.vetion = vetion;
    }
}
