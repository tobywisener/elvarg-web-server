import { CombatMethod } from "../../CombatMethod"
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { CombatType } from "../../../CombatType";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { PendingHit } from "../../../hit/PendingHit";
import { Projectile } from "../../../../../model/Projectile";
import { Item } from "../../../../../model/Item";
import { Flag } from "../../../../../model/Flag";
import { Misc } from "../../../../../../util/Misc";
import { WeaponInterfaces } from "../../../WeaponInterfaces";
import { Player } from "../../../../../entity/impl/player/Player";
import { BonusManager } from "../../../../../model/equipment/BonusManager";


export const ChaosElementalAttackType = {
    DEFAULT: 558,
    DISARM: 551,
    TELEPORT: 554
}
export class ChaosElementalCombatMethod extends CombatMethod {
    private static readonly MELEE_COMBAT_GFX = new Graphic(869, 0);
    private static readonly RANGED_COMBAT_GFX = new Graphic(867, 0);
    private static readonly MAGIC_COMBAT_GFX = new Graphic(868, 0);
    private static currentAttack = ChaosElementalAttackType.DEFAULT;
    private static combatType: CombatType = CombatType.MELEE;

    public type(): CombatType {
        return ChaosElementalCombatMethod.combatType;
    }

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 2)];
    }

    public start(character: Mobile, target: Mobile) {
        character.performAnimation(new Animation(character.getAttackAnim()));
        const projectile2 = Projectile.createProjectile(character, target, ChaosElementalCombatMethod.currentAttack, 40, 70, 31, 43);
    projectile2.sendProjectile();
    }

    public attackDistance(character: Mobile): number {
        return 8;
    }

    public finished(character: Mobile, target: Mobile) {
        if (Misc.getRandom(100) <= 10) {
            ChaosElementalCombatMethod.currentAttack = ChaosElementalAttackType.DISARM;
        } else if (Misc.getRandom(100) <= 10) {
            ChaosElementalCombatMethod.currentAttack = ChaosElementalAttackType.TELEPORT;
        }
        const keys = Object.keys(CombatType);
        const randomIndex = Misc.getRandom(keys.length - 1);
        const combatType = CombatType[keys[randomIndex]];
        ChaosElementalCombatMethod.combatType = combatType;
    }

    static handleAfterHitEffects(hit: PendingHit) {
        if (hit.getTarget() != null) {
            switch (this.combatType) {
                case CombatType.MELEE:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.MELEE_COMBAT_GFX);
                    break;
                case CombatType.RANGED:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.RANGED_COMBAT_GFX);
                    break;
                case CombatType.MAGIC:
                    hit.getTarget().performGraphic(ChaosElementalCombatMethod.MAGIC_COMBAT_GFX);
                    break;
            }

            if (hit.getTarget().isPlayer()) {
                if (Misc.getRandom(100) <= 20) {
                    let player = hit.getTarget().getAsPlayer();

                    //DISARMING
                    if (ChaosElementalCombatMethod.currentAttack == ChaosElementalAttackType.DISARM) {
                        ChaosElementalCombatMethod.disarmAttack(player);
                    }
                    //TELEPORTING
                    else if (ChaosElementalCombatMethod.currentAttack == ChaosElementalAttackType.TELEPORT) {
                        player.moveTo(player.getLocation().add(Misc.getRandom(4), Misc.getRandom(4)));
                        player.getPacketSender().sendMessage("The Chaos elemental has teleported you.");
                    }
                }
            }
        }


    }

    static disarmAttack(player: Player) {
        if (!player.getInventory().isFull()) {
            const randomSlot = Misc.getRandom(player.getEquipment().capacity() - 1);
            const toDisarm = player.getEquipment().getItems()[randomSlot];
            if (toDisarm.isValid()) {
                player.getEquipment().set(randomSlot, new Item(-1, 0));
                player.getInventory().addItem(toDisarm.clone());
                player.getPacketSender().sendMessage("You have been disarmed!");
                WeaponInterfaces.assign(player);
                BonusManager.update(player);
                player.getUpdateFlag().flag(Flag.APPEARANCE);
            }
        }
    }
}
