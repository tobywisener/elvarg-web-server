
import { Direction } from "../../../../model/Direction";
import { BonusManager } from "../../../../model/equipment/BonusManager";
export class PestControlPortalData {

  public static readonly PURPLE = new PestControlPortalData("western", Direction.WEST, "a533ff", 1751, [BonusManager.ATTACK_RANGE], 2628, 2591, 2631, 2592);
  public static readonly BLUE = new PestControlPortalData("eastern", Direction.EAST, "33d7ff", 1752, [BonusManager.ATTACK_MAGIC], 2680, 2588, 2679, 2589);
  public static readonly YELLOW = new PestControlPortalData("south-eastern", Direction.SOUTH_EAST, "fff333", 1753, [BonusManager.ATTACK_STAB, BonusManager.ATTACK_SLASH],
    2669, 2570, 2670, 2573);
  public static readonly RED = new PestControlPortalData("south-western", Direction.SOUTH_WEST, "e32a2a", 1754, [BonusManager.ATTACK_CRUSH], 2645, 2569, 2646, 2572);
  ;

  public direction: Direction;
  public name: string;
  public colourCode: string;
  public weaknesses: Array<number>;
  public shieldId: number;
  public xPosition: number;
  public yPosition: number;
  public npcSpawnX: number;
  public npcSpawnY: number;

  constructor(
    name: string,
    direction: Direction,
    colourCode: string,
    shieldId: number,
    weaknesses: number[],
    xPosition: number,
    yPosition: number,
    npcSpawnX: number,
    npcSpawnY: number
  ) {
    this.name = name;
    this.direction = direction;
    this.colourCode = colourCode;
    this.weaknesses = weaknesses;
    this.shieldId = shieldId;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.npcSpawnX = npcSpawnX;
    this.npcSpawnY = npcSpawnY;
  }
}