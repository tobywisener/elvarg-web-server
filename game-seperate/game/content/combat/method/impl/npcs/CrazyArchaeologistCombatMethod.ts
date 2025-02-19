import { CombatMethod } from "../../CombatMethod";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Location } from "../../../../../model/Location";
import { Projectile } from "../../../../../model/Projectile";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatType } from "../../../CombatType";
import { HitDamage } from "../../../hit/HitDamage";
import { HitMask } from "../../../hit/HitMask";
import { PendingHit } from "../../../hit/PendingHit";
import { Animation } from "../../../../../model/Animation";
import { Task } from "../../../../../task/Task";
import { TaskManager } from "../../../../../task/TaskManager";
import { Misc } from "../../../../../../util/Misc";
import { TimerKey } from "../../../../../../util/timers/TimerKey";

class ChaosTask extends Task {
  constructor(
    n1: number,
    private readonly execFunc: Function,
    target?: Mobile,
    b?: boolean
  ) {
    super(n1, target, b);
  }
  execute(): void {
    this.execFunc();
    this.stop();
  }
}

enum Attack {
  SPECIAL_ATTACK,
  DEFAULT_RANGED_ATTACK,
  DEFAULT_MELEE_ATTACK,
}

export class CrazyArchaeologistCombatMethod extends CombatMethod {
  private static readonly QUOTES: string[] = [
    "I'm Bellock - respect me!",
    "Get off my site!",
    "No-one messes with Bellock's dig!",
    "These ruins are mine!",
    "Taste my knowledge!",
    "You belong in a museum!",
  ];

  private attack = Attack.DEFAULT_RANGED_ATTACK;
  private static readonly RANGED_END_GFX = new Graphic(305, GraphicHeight.HIGH);
  private static readonly MAKE_IT_RAIN_START_GFX = new Graphic(
    157,
    GraphicHeight.MIDDLE
  );
  private static readonly MELEE_ATTACK_ANIM = new Animation(423);
  private static readonly RANGED_ATTACK_ANIM = new Animation(3353);

  public hits(character: Mobile, target: Mobile): PendingHit[] {
    if (this.attack == Attack.SPECIAL_ATTACK) {
      return [];
    }
    let delay = 2;
    if (this.attack == Attack.DEFAULT_MELEE_ATTACK) {
      delay = 0;
    }
    return [new PendingHit(character, target, this, delay)];
  }

  public start(character: Mobile, target: Mobile) {
    if (!character.isNpc() || !target.isPlayer()) return;

    this.attack = Attack.DEFAULT_RANGED_ATTACK;

    if (
      target.getLocation().getDistance(character.getLocation()) < 2 &&
      Misc.getRandom(1) == 0
    ) {
      this.attack = Attack.DEFAULT_MELEE_ATTACK;
    }

    if (Misc.getRandom(10) < 3) {
      this.attack = Attack.SPECIAL_ATTACK;
    }

    character.forceChat(
      CrazyArchaeologistCombatMethod.QUOTES[
        Misc.getRandom(CrazyArchaeologistCombatMethod.QUOTES.length - 1)
      ]
    );

    if (this.attack == Attack.DEFAULT_RANGED_ATTACK) {
      character.performAnimation(
        CrazyArchaeologistCombatMethod.RANGED_ATTACK_ANIM
      );
      const projectile2 = Projectile.createProjectile(
        character,
        target,
        1259,
        40,
        65,
        31,
        43
      );
      projectile2.sendProjectile();
      TaskManager.submit(
        new ChaosTask(
          3,
          () => {
            target.performGraphic(
              CrazyArchaeologistCombatMethod.RANGED_END_GFX
            );
          },
          target,
          false
        )
      );
    } else if (this.attack == Attack.SPECIAL_ATTACK) {
      character.performAnimation(
        CrazyArchaeologistCombatMethod.RANGED_ATTACK_ANIM
      );
      character.forceChat("Rain of Knowledge!");
      let targetPos = target.getLocation();
      let attackPositions: Location[] = [];
      attackPositions.push(targetPos);
      for (let i = 0; i < 2; i++) {
        attackPositions.push(
          new Location(
            targetPos.getX() - 1 + Misc.getRandom(3),
            targetPos.getY() - 1 + Misc.getRandom(3),
            0
          )
        );
      }
      for (let pos of attackPositions) {
        new Projectile(
          character.getLocation(),
          pos,
          null,
          1260,
          40,
          80,
          31,
          43,
          character.getPrivateArea()
        ).sendProjectile();
      }
      TaskManager.submit(
        new ChaosTask(4, () => {
          for (let pos of attackPositions) {
            target
              .getAsPlayer()
              .getPacketSender()
              .sendGlobalGraphic(
                CrazyArchaeologistCombatMethod.MAKE_IT_RAIN_START_GFX,
                pos
              );
            for (let player of character
              .getAsNpc()
              .getPlayersWithinDistance(10)) {
              if (player.getLocation().equals(pos)) {
                player
                  .getCombat()
                  .getHitQueue()
                  .addPendingDamage([
                    new HitDamage(Misc.getRandom(25), HitMask.RED),
                  ]);
              }
            }
          }
          this.finished(character, target);
        })
      );
      character.getTimers().registers(TimerKey.COMBAT_ATTACK, 5);
    } else if (this.attack == Attack.DEFAULT_MELEE_ATTACK) {
      character.performAnimation(
        CrazyArchaeologistCombatMethod.MELEE_ATTACK_ANIM
      );
    }
  }

  attackSpeed(character: Mobile) {
    if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
      return 3;
    }
    return super.attackSpeed(character);
  }

  attackDistance(character: Mobile) {
    if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
      return 1;
    }
    if (this.attack === Attack.SPECIAL_ATTACK) {
      return 8;
    }
    return 6;
  }

  type() {
    if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
      return CombatType.MELEE;
    }
    return CombatType.RANGED;
  }
}
