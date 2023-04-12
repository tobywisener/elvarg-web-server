import { PendingHit } from "../hit/PendingHit";
import { Mobile } from "../../../entity/impl/Mobile";
import { CombatType } from "../CombatType";

export abstract class CombatMethod {

    public start(character: Mobile, target: Mobile): void {
    }

    public finished(character: Mobile, target: Mobile): void {
    }

    public onCombatBegan(character: Mobile, target: Mobile): void {
    }

    public onCombatEnded(character: Mobile, target: Mobile): void {
    }

    public handleAfterHitEffects(hit: PendingHit): void {
    }

    public canAttack(character: Mobile, target: Mobile): boolean {
        return true;
    }

    public attackSpeed(character: Mobile): number {
        return character.getBaseAttackSpeed();
    }

    public attackDistance(character: Mobile): number {
        return 1;
    }

    public abstract type(): CombatType;
    public abstract hits(character: Mobile, target: Mobile): PendingHit[];
}
