
import { World } from "../../../../World";
import { Minigame } from "../../Minigame";
import { NPC } from "../../../../entity/impl/npc/NPC";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { Player } from "../../../../entity/impl/player/Player";
import { Item } from "../../../../model/Item";
import { Location } from "../../../../model/Location";
import { Area } from "../../../../model/areas/Area";
import { PrivateArea } from "../../../../model/areas/impl/PrivateArea";
import { PestControlArea } from "../../../../model/areas/impl/pestcontrol/PestControlArea";
import { PestControlNoviceBoatArea } from "../../../../model/areas/impl/pestcontrol/PestControlNoviceBoatArea";
import { DialogueExpression } from "../../../../model/dialogues/DialogueExpression";
import { DialogueChainBuilder } from "../../../../model/dialogues/builders/DialogueChainBuilder";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { Misc } from "../../../../../util/Misc";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { PestControlPortalData } from './PestControlPortalData'
import { PestControlBoat } from './PestControlBoat'
import { NpcDialogue } from "../../../../model/dialogues/entries/impl/NpcDialogue";
import { StatementDialogue } from "../../../../model/dialogues/entries/impl/StatementDialogue";
import { EndDialogue } from "../../../../model/dialogues/entries/impl/EndDialogue";
import { PestControlOutpostArea } from "../../../../model/areas/impl/pestcontrol/PestControlOutpostArea";
import { PestControlPortalNPC } from "../../../../entity/impl/npc/impl/pestcontrol/PestControlPortalNPC";
class PestTask extends Task{
    constructor(n1: number, nome: string, private readonly execFunc: Function){
        super(n1)
    }
    execute(): void {
        this.execFunc();
    }
    
}

export class PestControl implements Minigame {
    static area: PrivateArea;
    static knight: NPC;
    static boatType: PestControlBoat;
    ticksElapsed: number;
    static spawned_npcs: NPC[] = [];
    static chosenPortalSpawnSequence: PestControlPortalData[];
    boatType: PestControlBoat;

    constructor(boatType: PestControlBoat) {
        this.boatType = boatType;
        PestControl.area = new PestControlArea();
    }

    static readonly GAME_AREA: Area = new PestControlArea();

    static readonly OUTPOST_AREA: Area = new PestControlOutpostArea();

    static readonly NOVICE_BOAT_AREA: Area = new PestControlNoviceBoatArea();

    /**
    * The tile which is right beside the gang plank.
    */
    static readonly GANG_PLANK_START: Location = new Location(2657, 2639, 0);

    /**
    * How many players we need to start a game
    */
    private static readonly PLAYERS_REQUIRED: number = 1; // 5 default

    static readonly DEFAULT_BOAT_WAITING_TICKS: number = 10; // 50 secs default

    private static readonly PORTAL_SEQUENCE: PestControlPortalData[][] = [
        [PestControlPortalData.BLUE, PestControlPortalData.RED, PestControlPortalData.YELLOW, PestControlPortalData.PURPLE],
        [PestControlPortalData.BLUE, PestControlPortalData.PURPLE, PestControlPortalData.RED, PestControlPortalData.YELLOW],
        [PestControlPortalData.PURPLE, PestControlPortalData.BLUE, PestControlPortalData.YELLOW, PestControlPortalData.RED],
        [PestControlPortalData.PURPLE, PestControlPortalData.YELLOW, PestControlPortalData.BLUE, PestControlPortalData.RED],
        [PestControlPortalData.YELLOW, PestControlPortalData.RED, PestControlPortalData.PURPLE, PestControlPortalData.BLUE],
        [PestControlPortalData.YELLOW, PestControlPortalData.PURPLE, PestControlPortalData.RED, PestControlPortalData.BLUE]
    ];

    private static totalPortalsUnlocked: number;

    private static unshieldPortal(): void {
        if (!this.chosenPortalSpawnSequence) return;
        const data: PestControlPortalData = this.chosenPortalSpawnSequence[this.totalPortalsUnlocked];
        const portal: NPC | undefined = this.spawned_npcs.find(n => n !== null && n.getId() === data.shieldId);
        if (!portal) return;
        this.GAME_AREA.getPlayers().forEach(p => p.getPacketSender().sendMessage(`The < col=${ data.colourCode } > ${ data.name.toLowerCase().replace("_", " ") }, ${ data.name } < /col> portal shield has dropped!`));
        this.totalPortalsUnlocked++;
        portal.setNpcTransformationId(data.shieldId - 4);
    }

    private static portalsKilled: number;

    public static healKnight(npc: NPC): void {
        this.portalsKilled++;
        this.spawned_npcs.splice(this.spawned_npcs.indexOf(npc), 1);
        if (!this.knight || this.knight.isDyingFunction()) return;
        this.knight.heal(50);
    }

    public timeExpired(): boolean {
        return this.ticksElapsed >= (100 * 20);
    }

    public static readonly NOVICE_LOBBY_TASK = new PestTask(1, PestControlBoat.NOVICE.getName(), () => {
        const novice_boat = PestControlBoat.NOVICE;
        let noviceWaitTicks = this.DEFAULT_BOAT_WAITING_TICKS;

        const playersReady = novice_boat.getQueue().length;

        if (playersReady === 0) {
            stop();
            return;
        }

        if (playersReady < this.PLAYERS_REQUIRED) return;

        if (playersReady >= 10 && Math.random() <= 0.15) {
            this.sendSquireMessage("We're about to launch!", novice_boat);
        }

        noviceWaitTicks--;

        if (noviceWaitTicks === 0 || playersReady >= 25) {
            noviceWaitTicks = this.DEFAULT_BOAT_WAITING_TICKS;
            this.begin(novice_boat);
        }
    });

    public static readonly INTERMEDIATE_LOBBY_TASK = new PestTask(1, PestControlBoat.INTERMEDIATE.name, () => {
        const intermediate_boat = PestControlBoat.INTERMEDIATE;
        let intermediateWaitTicks = this.DEFAULT_BOAT_WAITING_TICKS;

        const playersReady = intermediate_boat.getQueue().length;

        if (playersReady === 0) {
            this.INTERMEDIATE_LOBBY_TASK.stop();
            return;
        }

        if (playersReady >= 10 && Math.random() <= .15) {
            this.sendSquireMessage("We're about to launch!", intermediate_boat);
        }

        intermediateWaitTicks--;

        if (intermediateWaitTicks === 0 || playersReady >= 25) {
            intermediateWaitTicks = this.DEFAULT_BOAT_WAITING_TICKS;
            this.begin(intermediate_boat);
        }
    });

    public init(): void {
    }

    private static begin(boat: PestControlBoat): void {
        const queue = boat.getQueue();
        const area = new PestControlArea();
        this.setupEntities(boat);
        let movedPlayers = 0;
        for (let i = 0; i < queue.length; i++) {
            if (movedPlayers >= 25) {
                break;
            }
            const player = queue[i];
            if (player != null) {
                movedPlayers++;
                this.moveToGame(boat, player, area);
            }
        }
        if (queue.length > 0) {
            queue.forEach((p: Player) => {
                p.getPacketSender().sendMessage("You have been given priority level 1 over other players in joining the next game.");
            });
        }
    }

    private static sendSquireMessage(message: string, boat: PestControlBoat) {
        const squire = World.getNpcs().search(n => n.getId() == boat.squireId);
        if (!squire || !message)
            return;
        squire.forceChat(message);
    }

    public static setupEntities(boat: PestControlBoat) {
        this.spawnNPC(boat.void_knight_id, new Location(2656, 2592), true);
        this.spawnNPC(NpcIdentifiers.SQUIRE_12, new Location(2655, 2607), false);
        this.chosenPortalSpawnSequence = this.PORTAL_SEQUENCE[Misc.randoms(this.PORTAL_SEQUENCE.length - 1)];
        this.chosenPortalSpawnSequence.forEach(portal => this.spawnPortal(portal.shieldId, new Location(portal.xPosition, portal.yPosition)));

        const portalTask = new PestTask(1, "PortalTask", () => {
            let ticks: number = 50;
            if (this.totalPortalsUnlocked === 4 || this.isKnightDead()) {
                stop()
                return;
            }
            ticks--;
            if (ticks === 0 || this.totalPortalsUnlocked === 0 && Math.floor(ticks / 2) === 15) {
                this.unshieldPortal();
                ticks = 50;
            }
        });

        TaskManager.submit(portalTask);
    }

    private static moveToGame(boat: PestControlBoat, player: Player, area: PestControlArea): void {
        area.add(player);
        player.smartMoves(PestControlArea.LAUNCHER_BOAT_BOUNDARY);
        NpcDialogue.sendStatement(player, NpcIdentifiers.SQUIRE_12, [
            "You must defend the Void Knight while the portals are",
            "unsummoned. The ritual takes twenty minutes though,",
            "so you can help out by destroying them yourselves!",
            "Now GO GO GO!"
        ], DialogueExpression.DISTRESSED);

        /**
        
        gameStarted = true;
        gameTimer = 400;
        */
    }
    /**
     
    Determines whether the game is still active.
    @return
    */
    public isActive(): boolean {
        return PestControl.playersInGame() > 0 && this.boatType != null;
    }
    public static spawnNPC(id: number, pos: Location, isKnight: boolean): void {
        const npc = NPC.create(id, pos);
        if (isKnight) {
            this.knight = npc;
        }
        this.area.add(npc);
        this.spawned_npcs.push(npc);
        World.getAddNPCQueue().push(npc);
    }

    public static spawnPortal(id: number, pos: Location): void {
        const npc: PestControlPortalNPC = new PestControlPortalNPC(id, pos);
        let hitPoints: number = this.boatType == PestControlBoat.NOVICE ? 200 : 250;
        npc.setHitpoints(hitPoints);
        npc.getDefinition().setMaxHitpoints(hitPoints);
        this.area.add(npc);
        this.spawned_npcs.push(npc);
        World.getAddNPCQueue().push(npc);
    }
    
    public static isPortalsDead(): boolean {
        return this.portalsKilled === 4;
    }
    
    public static isPortal(id: number, shielded: boolean): boolean {
        const portalIds: number[] = [];
        for (const d of Object.values(PestControlPortalData)) {
            portalIds.push(shielded ? d.shieldId : d.shieldId - 4);
        }
        return portalIds.includes(id);
    }

    private static readonly PEST_CONTROL_MONSTERS: number[][] = [
        [
            NpcIdentifiers.BRAWLER, //Brawler - level 51
            NpcIdentifiers.BRAWLER_2, //Brawler - level 76
            NpcIdentifiers.BRAWLER_3, //Brawler - level 101
            NpcIdentifiers.DEFILER, //Defiler - level 33
            NpcIdentifiers.DEFILER_2, //Defiler - level 50
            NpcIdentifiers.RAVAGER, //Ravager - level 36
            NpcIdentifiers.RAVAGER_2, //Ravager - level 53
            NpcIdentifiers.RAVAGER_3, //Ravager - level 71
            NpcIdentifiers.SHIFTER, //Shifter - Level 38
            NpcIdentifiers.SHIFTER_3, //Shifter - Level 57
            NpcIdentifiers.SHIFTER, //Spinner - Level 36
            NpcIdentifiers.SHIFTER_3, //Spinner - Level 55
            NpcIdentifiers.SHIFTER_5, //Spinner - Level 74
            NpcIdentifiers.SPLATTER, //Splatter - Level 22
            NpcIdentifiers.SPLATTER_2, //Splatter - Level 33
            NpcIdentifiers.SPLATTER_3, //Splatter - Level 44
            NpcIdentifiers.TORCHER, //Torcher - Level 33
            NpcIdentifiers.TORCHER_3 //Torcher - Level 49
        ],
        [
            NpcIdentifiers.BRAWLER_2, //Brawler - level 76
            NpcIdentifiers.BRAWLER_3, //Brawler - level 101
            NpcIdentifiers.BRAWLER_4, //Brawler - level 129
            NpcIdentifiers.DEFILER_2, //Defiler - level 50
            NpcIdentifiers.DEFILER_4, //Defiler - level 66
            NpcIdentifiers.DEFILER_5, //Defiler - level 80
            NpcIdentifiers.RAVAGER_2, //Ravager - level 53
            NpcIdentifiers.RAVAGER_3, //Ravager - level 71
            NpcIdentifiers.RAVAGER_4, //Ravager - level 89
            NpcIdentifiers.SHIFTER_3, //Shifter - Level 57
            NpcIdentifiers.SHIFTER_5, //Shifter - Level 76
            NpcIdentifiers.SHIFTER_7, //Shifter - Level 90
            NpcIdentifiers.SHIFTER_3, //Spinner - Level 55
            NpcIdentifiers.SHIFTER_5, //Spinner - Level 74
            NpcIdentifiers.SHIFTER_7, //Spinner - Level 88
            NpcIdentifiers.SHIFTER_9, //Spinner - Level 92
            NpcIdentifiers.SPLATTER_2, //Splatter - Level 33
            NpcIdentifiers.SPLATTER_3, //Splatter - Level 44
            NpcIdentifiers.SPLATTER_4, //Splatter - Level 54
            NpcIdentifiers.TORCHER_3, //Torcher - Level 49
            NpcIdentifiers.TORCHER_5, //Torcher - Level 66
            NpcIdentifiers.TORCHER_7 //Torcher - Level 79
        ],
        [
            NpcIdentifiers.BRAWLER_3,//Brawler - level 101
            NpcIdentifiers.BRAWLER_4,//Brawler - level 129
            NpcIdentifiers.DEFILER_7,//Defiler - level 80
            NpcIdentifiers.DEFILER_9,//Defiler - level 97
            NpcIdentifiers.RAVAGER_3,//Ravager - level 71
            NpcIdentifiers.RAVAGER_4,//Ravager - level 89
            NpcIdentifiers.RAVAGER_5,//Ravager - level 106
            NpcIdentifiers.SHIFTER_7,//Shifter - Level 90
            NpcIdentifiers.SHIFTER_9,//Shifter - Level 104
            NpcIdentifiers.SHIFTER_5,//Spinner - Level 74
            NpcIdentifiers.SHIFTER_7,//Spinner - Level 88
            NpcIdentifiers.SHIFTER_9,//Spinner - Level 92
            NpcIdentifiers.SPLATTER_3,//Splatter - Level 44
            NpcIdentifiers.SPLATTER_4,//Splatter - Level 54
            NpcIdentifiers.SPLATTER_5,//Splatter - Level 65
            NpcIdentifiers.TORCHER_7,//Torcher - Level 79
            NpcIdentifiers.TORCHER_9,//Torcher - Level 91
            NpcIdentifiers.TORCHER_10,//Torcher - Level 92
        ]
    ]

    private static readonly SPAWN_TICK_RATE: number = 10;
    private last_spawn: number = PestControl.SPAWN_TICK_RATE;

    public firstClickObject(player: Player, object: GameObject): boolean {
        // All object handling should be done in Areas where possible
        return false;
    }

    public handleButtonClick(player: Player, button: number): boolean {
        return false;
    }

    public process(): void {
        try {
            if(!this.isActive()) {
        return;
    }

    this.ticksElapsed++;

    if (PestControl.isPortalsDead()) {
        this.endGame(true);
        return;
    }

    if (PestControl.playersInGame() < 1 || PestControl.isKnightDead() || this.timeExpired()) {
        this.endGame(false);
    }

    /**
     * NPC spawning..
     */
    if (--this.last_spawn === 0) {
        this.last_spawn = PestControl.SPAWN_TICK_RATE;
        let index = Object.values(PestControlBoat).indexOf(this.boatType);
        for (const portal of Object.values(PestControlPortalData)) {
            if (this.portalExists(portal)) {
                PestControl.spawnNPC(
                    PestControl.PEST_CONTROL_MONSTERS[index][
                    Misc.randoms(PestControl.PEST_CONTROL_MONSTERS[index].length - 1)
                    ],
                    new Location(portal.npcSpawnX, portal.npcSpawnY),
                    false
                );
            }
        }
    }
        } catch (e) {
        console.error(e);
    }
    }

    private portalExists(portal: PestControlPortalData): boolean {
        for (const npc of PestControl.spawned_npcs) {
            if (portal == null || npc == null) {
                continue;
            }
            if (npc.getLocation().equals(new Location(portal.xPosition, portal.yPosition, 0)) && !npc.isDyingFunction()) {
                return true;
            }
        }
        return false;
    }
        
    private static isKnightDead(): boolean {
        return this.knight == null || (this.knight != null && this.knight.getHitpoints() == 0);
    }

    private  static playersInGame():number {
        return PestControl.GAME_AREA.getPlayers().length
    }

    private endGame(won: boolean): void {
        PestControl.GAME_AREA.getPlayers().forEach(player => {

            player.moveTo(new Location(2657, 2639, 0));

            let damage: number = player.getAttribute("pcDamage") as number;
            const myDamage: number = damage == null ? 0 : damage;

            let reward_points: number = 2;

            if (!won) {
                NpcDialogue.send(player, PestControl.boatType.squireId, "The Void Knight was killed, another of our Order has fallen and that Island is lost.", DialogueExpression.DISTRESSED);
                return;
            }
            if (myDamage > 50) {
                PestControl.sendWinnerDialogue(player, 4, 1, PestControl.boatType);
                return;
            }
            StatementDialogue.sends(player, ["The void knights notice your lack of zeal in that battle and have not presented you with any points."]);
            player.pcPoints += reward_points;
        });

        this.reset();
    }

    public static sendWinnerDialogue(p: Player, pointsToAdd: number, coinReward: number, boat: PestControlBoat): void {
        const dialogueBuilder = new DialogueChainBuilder();
        dialogueBuilder.add(
            new NpcDialogue(0, boat.squireId, `Congratulations! You managed to destroy all the portals! We've awarded you ${pointsToAdd} Void Knight Commendation points. Please also accept these coins as a reward.`, new extTask((player: DialogueExpression) => {
                p.pcPoints += pointsToAdd;
                p.getInventory().addItem(new Item(995, coinReward));
                StatementDialogue.sends(p, ["<col=00077a>You now have</col><col=b11717> " + p.pcPoints + "</col><col=00077a> Void Knight Commendation points!", "You can speak to a Void Knight to exchange your points for rewards."]);
            })),
            new EndDialogue(1)
        );
        p.getDialogueManager().startDialog(dialogueBuilder, 0);
    }

    /**
     * Resets the game variables and map
     */
    private reset(): void {
        this.ticksElapsed = -1;
        this.boatType = PestControlBoat.NOVICE;
        PestControl.chosenPortalSpawnSequence = null;
        PestControl.totalPortalsUnlocked = 0;
        PestControl.portalsKilled = 0;
        this.last_spawn = PestControl.SPAWN_TICK_RATE;
        PestControl.spawned_npcs.filter(n => n != null).forEach(n => n.setDying(true));
        PestControl.spawned_npcs = [];
    }

    private static isQueued(player: Player, boat: PestControlBoat): boolean {
        return boat.getQueue().includes(player);
    }
        
    private static addToQueue(player: Player, boat: PestControlBoat) {
        if (PestControl.isQueued(player, boat)) {
            console.error("Error.. adding " + player.getUsername() + " to " + boat.getName() + " list.. already on the list.");
            return;
        }
        /**
        * TODO.. might be a good idea to get the players in the area then add all to the list.. however.. pest control uses a queue system not list!
        */
        boat.getQueue().push(player);
    }

    public static addToWaitingRoom(player: Player, boat: PestControlBoat): void {
        player.getPacketSender().sendMessage("You have joined the Pest Control boat.");
        player.getPacketSender().sendMessage(`You currently have ${player.pcPoints} Pest Control Points.`);
        player.getPacketSender().sendMessage(`Players needed: ${PestControl.PLAYERS_REQUIRED} to 25 players.`);
        this.addToQueue(player, boat);
        player.moveTo(boat.enterBoatLocation);
    }
}

class extTask extends DialogueExpression{
    constructor(readonly execFunc: Function){
        super(execFunc());
    }
}