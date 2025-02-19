import { Sound } from "../../../../Sound";
import { Sounds } from "../../../../Sounds";
import { World } from "../../../../World";
import { RegionManager } from "../../../../collision/RegionManager";
import { Firemaking } from "../../../../content/skill/skillable/impl/Firemaking"
import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { Animation } from "../../../../model/Animation"
import { Item } from "../../../../model/Item"
import { Location } from "../../../../model/Location"
import { Skill } from "../../../../model/Skill"
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";

class BarricadesTask extends Task{
    constructor(p: Player, private readonly execFunc: Function){
        super(3, false)
    }
    execute(): void {
        this.execFunc();
        this.stop();
    }

}


export class Barricades {
    public static readonly NPC_ID: number = 5722;
    public static readonly NPC_ID_BURNING: number = 5723;
    public static readonly ITEM_ID: number = 4053;
    public static readonly FIREMAKING_EXPERIENCE: number = 10;

    private static barricades: Location[] = [];
    private static getBlackListedTiles(player: Player, requestedTile: Location): boolean {
        return [new Location(1, 1)].find(t => t.equals(requestedTile)) !== undefined;
    }

    public static checkTile(tile: Location): void {
        this.barricades.forEach(t => {
            if (t.equals(tile)) {
                RegionManager.removeClipping(t.getX(), t.getY(), t.getZ(), 0x200000, null);
                let index = this.barricades.indexOf(t);
                if (index !== -1) {
                    this.barricades.splice(index, 1);
                }
            }
        });
    }

    public static canSetup(player: Player): boolean {
        const tile: Location = player.getLocation();
        const existsAtTile: boolean = this.barricades.find(t => t.equals(tile)) !== undefined;
        if (existsAtTile) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        if (RegionManager.getClipping(tile.getX(), tile.getY(), tile.getZ(), player.getPrivateArea()) !== 0) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        this.deploy(player);
        return true;
    }
    private static handleTinderbox(player: Player, npc: NPC) {
        if (npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is already on fire!");
            return;
        }
        if (!player.getInventory().contains(590)) {
            player.getPacketSender().sendMessage("You need a tinderbox to set the barricade on fire.");
            return;
        }

        player.performAnimation(Firemaking.LIGHT_FIRE);
        Sounds.sendSound(player, Sound.FIRE_FIRST_ATTEMPT);

        TaskManager.submit(new BarricadesTask(player, ()=>{npc.setNpcTransformationId(this.NPC_ID_BURNING);
            npc.barricadeOnFire = true;
            player.getSkillManager().addExperiences(Skill.FIREMAKING, Barricades.FIREMAKING_EXPERIENCE);
            player.performAnimation(Animation.DEFAULT_RESET_ANIMATION);})
        );
    }

    private static handleBucketOfWater(player: Player, npc: NPC) {
        if (!npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is not on fire.");
            return;
        }
        if (!player.getInventory().contains(1929)) {
            player.getPacketSender().sendMessage("You need a bucket of water to extinguish the fire.");
            return;
        }
        player.getInventory().deletes(new Item(1929, 1));
        player.getInventory().addItem(new Item(1925, 1));
        npc.setNpcTransformationId(this.NPC_ID);
        npc.barricadeOnFire = false;
        player.getPacketSender().sendMessage("You put out the fire!");
    }

    /**
     * Upon placing and passing successful checks.
     * @param player
     */
    private static deploy(player: Player) {
        let tile = player.getLocation();
        RegionManager.addClipping(tile.getX(), tile.getY(), tile.getZ(), 0x200000, player.getPrivateArea());
        player.getInventory().deleteNumber(this.ITEM_ID, 1);
        this.barricades.push(tile);
        World.getAddNPCQueue().push(new NPC(this.NPC_ID, tile.clone()));
        Sounds.sendSound(player, Sound.PICK_UP_ITEM);
    }

    public static handleInteractiveOptions(player: Player, npc: NPC, opcode: number): boolean {
        let isBarricade = [this.NPC_ID, this.NPC_ID_BURNING].some((n) => n === npc.getId());
        if (!isBarricade) {
            return false;
        }
        if (opcode === 17) {
            /**
             * Option 2 (BURN/EXTINGUISH)
             */
            if (npc.barricadeOnFire) {
                this.handleBucketOfWater(player, npc);
                return true;
            }
            this.handleTinderbox(player, npc);
            return true;
        }
        return false;
    }

    public static itemOnBarricade(player: Player, npc: NPC, item: Item): boolean {
        switch (item.getId()) {
            case 590:
                Barricades.handleTinderbox(player, npc);
                return true;
            case 1929:
                this.handleBucketOfWater(player, npc);
                return true;
            default:
                return false;
        }
    }
}