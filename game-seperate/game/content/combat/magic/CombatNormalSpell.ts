import { CombatSpell } from "./CombatSpell";
import { Mobile } from "../../../entity/impl/Mobile";
import { Animation } from "../../../model/Animation";
import { Graphic } from "../../../model/Graphic";
import { Projectile } from "../../../model/Projectile";
import { Player } from "../../../entity/impl/player/Player";
import { Item } from "../../../model/Item";

interface CombatNormalSpellOptions {
    spellId: () => number
    maximumHit:() => number 
    castAnimation:() => Animation
    startGraphic:() => Graphic
    castProjectile:(cast: Mobile, castOn: Mobile) => Projectile
    endGraphic:() => Graphic 
    finishCast?:(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number) => void
    baseExperience?: () => number
    equipmentRequired?:(player: Player) => Item[]
    itemsRequired?:(player: Player) => Item[]
    levelRequired?:() => number
    spellEffect?:(cast: Mobile, castOn: Mobile) => void 
  }

export class CombatNormalSpell extends CombatSpell {
    getSpell(): CombatSpell {
      throw new Error("Method not implemented.");
    }
    constructor(private readonly options: CombatNormalSpellOptions){
        super();
    }

    spellId(): number {
        return this.options.spellId()
    }
    maximumHit(): number {
        return this.options.maximumHit()
    }
    castAnimation(): Animation {
        return this.options.castAnimation()
    }
    startGraphic(): Graphic {
        return this.options.startGraphic()
    }
    castProjectile(cast: Mobile, castOn: Mobile): Projectile {
        return this.options.castProjectile(cast, castOn)
    }
    endGraphic(): Graphic {
        return this.options.endGraphic()
    }

    finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
        return this.options.finishCast(cast, castOn, accurate, damage)
    }

    baseExperience(): number {
        if(this.options.baseExperience) {
          return this.options.baseExperience()
        } else {
          return this.baseExperience()
        }
    }

    equipmentRequired(player: Player): Item[] {
        if(this.options.equipmentRequired) {
          return this.options.equipmentRequired(player)
        } else {
          return this.equipmentRequired(player)
        }
    }

    itemsRequired(player: Player): Item[] {
        if(this.options.itemsRequired) {
          return this.options.itemsRequired(player)
        } else {
          return this.itemsRequired(player)
        }
    }

    levelRequired(): number {
        if(this.options.levelRequired) {
          return this.options.levelRequired()
        } else {
          return this.levelRequired()
        }
    }

    spellEffect(cast: Mobile, castOn: Mobile): void {
        if(this.options.spellEffect) {
          return this.options.spellEffect(cast, castOn)
        } else {
          return this.spellEffect(cast, castOn)
        }
    }  

}