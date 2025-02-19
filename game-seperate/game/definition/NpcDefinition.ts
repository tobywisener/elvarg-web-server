export class NpcDefinition {
    static definitions: Map<number, NpcDefinition> = new Map<number, NpcDefinition>();
    private static DEFAULT: NpcDefinition = new NpcDefinition();
    private static DEFAULT_STATS: number[] = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    private id: number;
    private name: string;
    private examine: string;
    private size: number;
    private walkRadius: number;
    private attackable: boolean;
    private retreats: boolean;
    private aggressive: boolean;
    private aggressiveTolerance: boolean = true;
    private poisonous: boolean;
    private fightsBack: boolean = true;
    private respawn: number;
    private maxHit: number;
    private hitpoints: number = 10;
    private attackSpeed: number;
    private attackAnim: number;
    private defenceAnim: number;
    private deathAnim: number;
    private combatLevel: number;
    private stats: number[];
    private slayerLevel: number;
    private combatFollowDistance: number;
    
    public static forId(id: number): NpcDefinition {
        return this.definitions.get(id) || this.DEFAULT;
    }
    
    public getId(): number {
        return this.id;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public getExamine(): string {
        return this.examine;
    }
    
    public getSize(): number {
        return this.size;
    }
    
    public getWalkRadius(): number {
        return this.walkRadius;
    }
    
    public isAttackable(): boolean {
        return this.attackable;
    }
    
    public doesRetreat(): boolean {
        return this.retreats;
    }
    
    public isAggressive(): boolean {
        return this.aggressive;
    }

    public buildsAggressionTolerance(): boolean {
        return this.aggressiveTolerance;
    }
        
    public isPoisonous(): boolean {
        return this.poisonous;
    }
    
    public doesFightBack(): boolean {
        return this.fightsBack;
    }
    
    public getRespawn(): number {
        return this.respawn;
    }
    
    public getMaxHit(): number {
        return this.maxHit;
    }
    
    public getHitpoints(): number {
        return this.hitpoints;
    }

    public setMaxHitpoints(hitpoints: number):void {
        this.hitpoints = hitpoints;
    }
    
    public getAttackSpeed(): number {
        return this.attackSpeed;
    }
    
    public getAttackAnim(): number {
        return this.attackAnim;
    }
    
    public getDefenceAnim(): number {
        return this.defenceAnim;
    }
    
    public getDeathAnim(): number {
        return this.deathAnim;
    }
    
    public getCombatLevel(): number {
        return this.combatLevel;
    }
    
    public getStats(): number[] {
        if (!this.stats) {
            return NpcDefinition.DEFAULT_STATS;
        }
    
        return this.stats;
    }
    
    public getSlayerLevel(): number {
        return this.slayerLevel;
    }
    
    public getCombatFollowDistance(): number {
        return this.combatFollowDistance;
    }
}