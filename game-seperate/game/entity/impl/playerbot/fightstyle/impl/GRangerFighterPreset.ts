import { PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";

class GRangerCombatSwitch extends CombatSwitch {
  constructor(switchItemIds: number[], private readonly execFunc: Function) {
    super(switchItemIds);
  }

  public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
    this.execFunc();
  }

}

export class GRangerFighterPreset implements FighterPreset {
  public static BOT_G_MAULER_70 = new Presetable(
    "G Mauler (R)",
    [
      new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.GRANITE_MAUL), new Item(ItemIdentifiers.SUPER_RESTORE_4_), new Item(ItemIdentifiers.SUPER_ATTACK_4_),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.SARADOMIN_BREW_4_), new Item(ItemIdentifiers.MONKFISH),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.RING_OF_RECOIL), new Item(ItemIdentifiers.ANGLERFISH),
    ],
    [
      new Item(ItemIdentifiers.COIF),
      new Item(ItemIdentifiers.AVAS_ACCUMULATOR),
      new Item(ItemIdentifiers.MAGIC_SHORTBOW),
      new Item(ItemIdentifiers.AMULET_OF_GLORY),
      new Item(ItemIdentifiers.LEATHER_BODY),
      null,
      new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS),
      new Item(ItemIdentifiers.MITHRIL_GLOVES),
      new Item(ItemIdentifiers.CLIMBING_BOOTS),
      new Item(ItemIdentifiers.RING_OF_RECOIL),
      new Item(ItemIdentifiers.RUNE_ARROW, 75),
    ],
    [40, 1, 90, 58, 84, 1, 1],
    MagicSpellbook.NORMAL,
    true
  );

  public static COMBAT_ACTIONS: CombatAction[] = [
    new GRangerCombatSwitch([ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], (playerBot: PlayerBot, enemy: Mobile) => {
      return {
        shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
          const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
          return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 &&
            enemy.getHitpoints() < 46;
        },
        performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
          if (!playerBot.isSpecialActivated()) {
            CombatSpecial.activate(playerBot);
          }
          playerBot.getCombat().attack(enemy);
        }
      };
    }),
    new GRangerCombatSwitch([ItemIdentifiers.DRAGON_SCIMITAR], (playerBot: PlayerBot, enemy: Mobile) => {
      return {
        shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
          return true;
        },
        performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
          playerBot.setSpecialActivated(false);
          playerBot.getCombat().attack(enemy);
        }
      };
    })
  ];

  getItemPreset(): Presetable {
    return GRangerFighterPreset.BOT_G_MAULER_70;
  }

  getCombatActions(): CombatAction[] {
    return GRangerFighterPreset.COMBAT_ACTIONS;
  }

  eatAtPercent(): number {
    return 40;
  }
}






