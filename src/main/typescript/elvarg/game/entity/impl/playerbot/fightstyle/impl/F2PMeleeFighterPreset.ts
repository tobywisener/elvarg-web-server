import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { PrayerData } from "../../../../../content/PrayerHandler";

class MeleeCombatSwitch extends CombatSwitch {
    constructor(switchItemIds: number[], private readonly execFunc: Function) {
        super(switchItemIds);
    }

    public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
        this.execFunc();
    }

}

export class F2PMeleeFighterPreset implements FighterPreset {
    public static PRESETABLE: Presetable = new Presetable("F2P Pure",
        [
            new Item(ItemIdentifiers.RUNE_2H_SWORD), new Item(ItemIdentifiers.STRENGTH_POTION_4_), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
            new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH), new Item(ItemIdentifiers.SWORDFISH),
        ],
        [
            new Item(ItemIdentifiers.IRON_FULL_HELM),
            new Item(ItemIdentifiers.CAPE_OF_LEGENDS),
            new Item(ItemIdentifiers.MAPLE_SHORTBOW),
            new Item(ItemIdentifiers.AMULET_OF_POWER),
            new Item(ItemIdentifiers.LEATHER_BODY),
            new Item(ItemIdentifiers.GREEN_DHIDE_VAMB),
            new Item(ItemIdentifiers.GREEN_DHIDE_CHAPS),
            null,
            new Item(ItemIdentifiers.LEATHER_BOOTS),
            null,
            new Item(ItemIdentifiers.ADAMANT_ARROW, 100),
        ],
        /* atk, def, str, hp, range, pray, mage */
        [40, 1, 90, 58, 84, 1, 1],
        MagicSpellbook.NORMAL,
        true
    );

    public static COMBAT_ACTIONS: CombatAction[] = [
        new MeleeCombatSwitch([ItemIdentifiers.RUNE_2H_SWORD], () => {
          /**
           * KO Weapon - Rune 2H sword
           */
          return {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
              let canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
              return canAttackNextTick && enemy.getHitpoints() < 25;
            },
        
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
              playerBot.getCombat().attack(enemy);
            }
          }
        }),
        
        new MeleeCombatSwitch([ItemIdentifiers.MAPLE_SHORTBOW], () => {
          /**
           * Default Weapon - Maple Shortbow (Max DPS)
           */
          return {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
              return enemy.getHitpoints() >= 25;
            },
        
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
              playerBot.getCombat().attack(enemy);
            }
          }
        }),
      ];
    getItemPreset(): Presetable {
        return F2PMeleeFighterPreset.PRESETABLE;
    }

    getCombatActions(): CombatAction[] {
        return F2PMeleeFighterPreset.COMBAT_ACTIONS;
    }

    eatAtPercent(): number {
        return 40;
    }
}