import { Player } from "../../../entity/impl/player/Player";

export class SlayerMaster {
    public static readonly TURAEL = new SlayerMaster(3, 1, [[10, 3], [50, 10], [100, 25], [250, 50], [1000, 75]]);
    public static readonly MAZCHNA = new SlayerMaster(20, 2, [[10, 5], [50, 15], [100, 50], [250, 70], [1000, 100]]);
    public static readonly VANNAKA = new SlayerMaster(40, 4, [[10, 20], [50, 60], [100, 100], [250, 140], [1000, 200]]);
    public static readonly CHAELDAR = new SlayerMaster(70, 10, [[10, 50], [50, 150], [100, 250], [250, 350], [1000, 500]]);
    public static readonly NIEVE = new SlayerMaster(85, 12, [[10, 60], [50, 180], [100, 300], [250, 420], [1000, 600]]);
    public static readonly DURADEL = new SlayerMaster(100, 15, [[10, 75], [50, 225], [100, 375], [250, 525], [1000, 750]]);
    
    private readonly combatLevel: number;
    private readonly basePoints: number;
    private readonly consecutiveTaskPoints: number[][];

    constructor(combatLevel: number, basePoints: number, consecutiveTaskPoints: number[][]) {
        this.combatLevel = combatLevel;
        this.basePoints = basePoints;
        this.consecutiveTaskPoints = consecutiveTaskPoints;
    }
        
        public getCombatLevel(): number {
        return this.combatLevel;
    }
        
        public getBasePoints(): number {
        return this.basePoints;
    }
        
        public getConsecutiveTaskPoints(): number[][] {
        return this.consecutiveTaskPoints;
    }
        
    public canAssign(player: Player): boolean {
        if (player.getSkillManager().getCombatLevel() < this.combatLevel) {
            return false;
        }
    }
}