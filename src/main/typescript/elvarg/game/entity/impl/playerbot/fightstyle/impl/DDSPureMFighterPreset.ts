import { FighterPreset } from "../FighterPreset";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { Item } from "../../../../../model/Item";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { TimerKey } from "../../../../../../util/timers/TimerKey";



class DragonDaggerCombatSwitch extends CombatSwitch {
  constructor(switchItemIds: number[], private readonly execFunc: Function) {
    super(switchItemIds);
  }

  public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
    this.execFunc();
  }

}


export class DDSPureMFighterPreset implements FighterPreset {
  private static BOT_DDS_PURE_M_73 = new Presetable(
    "DDS Pure (M)",
    [
      new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.SUPER_STRENGTH_4_, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.SUPER_ATTACK_4_, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.COOKED_KARAMBWAN, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.MANTA_RAY, 1),
      new Item(ItemIdentifiers.ANGLERFISH, 1)],
    [new Item(ItemIdentifiers.IRON_FULL_HELM, 1),
    new Item(ItemIdentifiers.OBSIDIAN_CAPE, 1),
    new Item(ItemIdentifiers.DRAGON_SCIMITAR, 1),
    new Item(ItemIdentifiers.AMULET_OF_GLORY, 1),
    new Item(ItemIdentifiers.IRON_PLATEBODY, 1),
    new Item(ItemIdentifiers.BOOK_OF_DARKNESS, 1),
    new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS, 1),
    new Item(ItemIdentifiers.MITHRIL_GLOVES, 1),
    new Item(ItemIdentifiers.CLIMBING_BOOTS, 1),
    new Item(ItemIdentifiers.RING_OF_RECOIL, 1),
    new Item(null)]

    , [60, 1, 99, 85, 1, 1, 1]
    , MagicSpellbook.NORMAL
    , true
  )

  public static COMBAT_ACTIONS: CombatAction[] = [
    new DragonDaggerCombatSwitch([ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], (playerBot: PlayerBot, enemy: Mobile) => {
      const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
      if (canAttackNextTick && playerBot.getSpecialPercentage() >= 25 && enemy.getHitpoints() < 46) {
        if (!playerBot.isSpecialActivated()) {
          CombatSpecial.activate(playerBot);
        }
        playerBot.getCombat().attack(enemy);
      }
    }),
    new DragonDaggerCombatSwitch([ItemIdentifiers.DRAGON_SCIMITAR], (playerBot: PlayerBot, enemy: Mobile) => {
      playerBot.setSpecialActivated(false);
      playerBot.getCombat().attack(enemy);
    }),
  ];

  getItemPreset(): Presetable {
    return DDSPureMFighterPreset.BOT_DDS_PURE_M_73;
  }

  getCombatActions(): CombatAction[] {
    return DDSPureMFighterPreset.COMBAT_ACTIONS;
  }

  eatAtPercent(): number {
    return 40;
  }
}