
import { ItemIdentifiers } from "../../../util/ItemIdentifiers";
import { Task } from "../Task";
import { Mobile } from "../../entity/impl/Mobile";
import { Item } from "../../model/Item";
import { HitDamage } from "../../content/combat/hit/HitDamage";
import { HitMask } from "../../content/combat/hit/HitMask";

export class CombatPoisonEffect extends Task {
  private entity: Mobile;
  public tick;

  constructor(entity) {
    super(30, entity);
    this.entity = entity;
    this.tick = 0;
  }

  public execute() {
    this.tick++;

    if (!this.entity.isRegistered()) {
      this.stop();
      return;
    }

    if (!this.entity.isPoisoned()) {
      this.stop();
      return;
    }

    if (!this.entity.getCombat().getPoisonImmunityTimer().finished()) {
      this.stop();
      return;
    }

    let poisonDamage = this.tick % 5 === 0 ? this.entity.getPoisonDamage() - 1 : this.entity.getPoisonDamage();
    this, poisonDamage = poisonDamage;
    this.entity.getCombat().getHitQueue().addPendingDamage([new HitDamage(poisonDamage, HitMask.GREEN)]);

    if (poisonDamage <= 1) {
      this.stop();
      return;
    }
  }

  public stop() {
    let poisonDamage = 0;

    if (this.entity.isPlayer()) {
      this.entity.getAsPlayer().getPacketSender().sendPoisonType(0);
    }

    super.stop();
  }
}

export enum PoisonType {
  VERY_WEAK = 2,
  WEAK = 3,
  MILD = 4,
  EXTRA = 5,
  SUPER = 6,
  VENOM = 12,
}

export class CombatPoisonData {
  private static damage: number
  public static types: number[]
  private static tipos = new Map<number, PoisonType>();

  public static getDemage(): number {
    return CombatPoisonData.damage;
  }

  static init() {
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_KNIFE_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.POISONED_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DART_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_SPEAR_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DART_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DART_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_KNIFE_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.POISON_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.POISON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_SPEAR_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BLACK_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.WHITE_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.WHITE_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.WHITE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BONE_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BONE_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BONE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BLURITE_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNITE_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.SILVER_BOLTS_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLURITE_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.RUNITE_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.SILVER_BOLTS_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.BLURITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.SILVER_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.KERIS_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.KERIS_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.KERIS_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DART_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DART_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_DART_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.BRONZE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.IRON_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.STEEL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.MITHRIL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.ADAMANT_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_HASTA_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_HASTA_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.RUNE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.ABYSSAL_DAGGER_P_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_, PoisonType.EXTRA);
    CombatPoisonData.types.push(ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_JAVELIN_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_ARROW_P_, PoisonType.VERY_WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_ARROW_P_PLUS_, PoisonType.WEAK);
    CombatPoisonData.types.push(ItemIdentifiers.AMETHYST_ARROW_P_PLUS_PLUS_, PoisonType.MILD);

    CombatPoisonData.types.push(ItemIdentifiers.TOXIC_BLOWPIPE, PoisonType.VENOM);
    CombatPoisonData.types.push(ItemIdentifiers.ABYSSAL_TENTACLE, PoisonType.VENOM);
  }

  public static getPoisonType(item?: Item): PoisonType | undefined {
    if (!item || item.getId() < 1 || item.getAmount() < 1) {
      return undefined;
    }

    return CombatPoisonData.types[item.getId()];
  }
}








