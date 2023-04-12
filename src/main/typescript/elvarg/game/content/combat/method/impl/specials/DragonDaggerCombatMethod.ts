import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";
import { Sound } from "../../../../../Sound";
import { Sounds } from "../../../../../Sounds";

export class DragonDaggerCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(1062);
    private static readonly GRAPHIC = new Graphic(252, GraphicHeight.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this),
        new PendingHit(character, target, this, target.isNpc() ? 1 : 0)];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_DAGGER.getDrainAmount());
        character.performAnimation(DragonDaggerCombatMethod.ANIMATION);
        character.performGraphic(DragonDaggerCombatMethod.GRAPHIC);
        Sounds.sendSound(character.getAsPlayer(), Sound.DRAGON_DAGGER_SPECIAL);
    }
}
