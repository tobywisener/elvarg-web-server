import { CombatType } from '../../../../content/combat/CombatType'
import { CombatSwitch } from './CombatSwitch'


export class AttackStyleSwitch {
    private combatType: CombatType;
    private combatSwitch: CombatSwitch;
    private maxHit: number;
    private attackRoll: number;
    private hitSpeed: number;

    constructor(combatType: CombatType, combatSwitch: CombatSwitch) {
        this.combatType = combatType;
        this.combatSwitch = combatSwitch;
        this.attackRoll = 9999999;
        this.maxHit = 120;
        this.hitSpeed = 4;
    }

    public getCombatType(): CombatType {
        return this.combatType;
    }

    public getCombatSwitch(): CombatSwitch {
        return this.combatSwitch;
    }

    public getMaxHit(): number {
        return this.maxHit;
    }

    public setMaxHit(maxHit: number): void {
        this.maxHit = maxHit;
    }

    public getAttackRoll(): number {
        return this.attackRoll;
    }

    public setAttackRoll(attackRoll: number): void {
        this.attackRoll = attackRoll;
    }

    public getHitSpeed(): number {
        return this.hitSpeed;
    }

    public setHitSpeed(hitSpeed: number): void {
        this.hitSpeed = hitSpeed;
    }
}