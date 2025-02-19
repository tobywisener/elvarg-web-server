import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";

export class DragonClawCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(7527);
    private static readonly GRAPHIC = new Graphic(1171, Priority.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        let hit = new PendingHit(character, target, this, 4, true);
        // Modify the hits.. Claws have a unique maxhit formula
        let first = hit.getHits()[0].getDamage();
        let second = first <= 0 ? hit.getHits()[1].getDamage() : (first / 2);
        let third = second <= 0 ? second : (second / 2);
        let fourth = second <= 0 ? second : (second / 2);
        hit.getHits()[0].setDamage(first);
        hit.getHits()[1].setDamage(second);
        hit.getHits()[2].setDamage(third);
        hit.getHits()[3].setDamage(fourth);
        hit.updateTotalDamage();
        return [hit];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_CLAWS.getDrainAmount());
        character.performAnimation(DragonClawCombatMethod.ANIMATION);
        character.performGraphic(DragonClawCombatMethod.GRAPHIC);
    }
}