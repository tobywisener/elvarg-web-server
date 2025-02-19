import { Task } from "../Task";
import { Mobile } from "../../entity/impl/Mobile";
import { CombatSpecial } from "../../content/combat/CombatSpecial";
export class RestoreSpecialAttackTask extends Task {
    constructor(private character: Mobile) {
    super(50);
    this.character = character;
    character.setRecoveringSpecialAttack(true);
    }
    
    public execute() {
        if (this.character == null || !this.character.isRegistered() || this.character.getSpecialPercentage() >= 100 || !this.character.isRecoveringSpecialAttack()) {
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
            return;
        }
        let amount = this.character.getSpecialPercentage() + 10;
        if (amount >= 100) {
            amount = 100;
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
        }
        this.character.setSpecialPercentage(amount);
    
        if (this.character.isPlayer()) {
            let player = this.character.getAsPlayer();
            CombatSpecial.updateBar(player);
        }
    }
}