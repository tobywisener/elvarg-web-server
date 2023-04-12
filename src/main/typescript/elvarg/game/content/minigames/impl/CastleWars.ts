import { ItemIdentifiers } from "../../../../util/ItemIdentifiers";
import { Misc } from "../../../../util/Misc";
import { TimerKey } from "../../../../util/timers/TimerKey";
import { Barricades } from "../../../entity/impl/npc/impl/Barricades";
import { GameObject } from "../../../entity/impl/object/GameObject";
import { ObjectManager } from "../../../entity/impl/object/ObjectManager";
import { Player } from "../../../entity/impl/player/Player";
import { Area } from "../../../model/areas/Area";
import { CastleWarsGameArea } from "../../../model/areas/impl/castlewars/CastleWarsGameArea";
import { CastleWarsLobbyArea } from "../../../model/areas/impl/castlewars/CastleWarsLobbyArea";
import { CastleWarsSaradominWaitingArea } from "../../../model/areas/impl/castlewars/CastleWarsSaradominWaitingArea";
import { CastleWarsZamorakWaitingArea } from "../../../model/areas/impl/castlewars/CastleWarsZamorakWaitingArea";
import { Boundary } from "../../../model/Boundary";
import { Equipment } from "../../../model/container/impl/Equipment";
import { ItemStatementDialogue } from "../../../model/dialogues/entries/impl/ItemStatementDialogue";
import { StatementDialogue } from "../../../model/dialogues/entries/impl/StatementDialogue";
import { Flag } from "../../../model/Flag";
import { GraphicHeight } from "../../../model/GraphicHeight";
import { Item } from "../../../model/Item";
import { Projectile } from "../../../model/Projectile";
import { Skill } from "../../../model/Skill";
import { Task } from "../../../task/Task";
import { TaskManager } from "../../../task/TaskManager";
import { World } from "../../../World";
import { HitDamage } from "../../combat/hit/HitDamage";
import { HitMask } from "../../combat/hit/HitMask";
import { Edible, Food } from "../../Food";
import { Minigame } from "../Minigame";
import { Location } from "../../../model/Location";
import { CountdownTask } from "../../../task/impl/CountdownTask";
import { ReadWriteLock } from "async-lock"
import { ObjectIdentifiers } from "../../../../util/ObjectIdentifiers";
import { Animation } from "../../../model/Animation";
import { cloneDeep } from 'lodash';
import { TaskType } from "../../../task/TaskType";





class ThreadSafeList<T> {
    private readonly lock = new ReadWriteLock();
    private readonly list: T[] = [];

    public add(item: T): void {
        this.lock.writeLock(() => {
            this.list.push(item);
        });
    }

    public remove(item: T): void {
        this.lock.writeLock(() => {
            const index = this.list.indexOf(item);
            if (index > -1) {
                this.list.splice(index, 1);
            }
        });
    }

    public get(index: number): T | undefined {
        return this.lock.readLock(() => this.list[index]);
    }

    public getAll(): T[] {
        return this.lock.readLock(() => [...this.list]);
    }
}


class CastleWarsTask extends Task {
    constructor(private readonly exeFunction: Function, player: Player) {
        super(0, true)
    }

    execute() {
        if (this.exeFunction()) {
            return;
        }
    }
}

enum CatapultState {
    FIXED,
    BURNING,
    REPAIR
}



export class CastleWars implements Minigame {

    /**
 * Area instances
 * <p>
 * We instantiate these here as we need to reference them directly.
 */
    public static readonly SARADOMIN_WAITING_AREA: CastleWarsSaradominWaitingArea = new CastleWarsSaradominWaitingArea();

    public static readonly ZAMORAK_WAITING_AREA: CastleWarsZamorakWaitingArea = new CastleWarsZamorakWaitingArea();

    public static readonly GAME_AREA: CastleWarsGameArea = new CastleWarsGameArea();

    public static readonly LOBBY_AREA: CastleWarsLobbyArea = new CastleWarsLobbyArea();

    private static spawned_objects: GameObject[] = cloneDeep([]);

    public init(): void {
        /** Saradomin Altar **/
        ObjectManager.register(new GameObject(411, new Location(2431, 3076, 1), 10, 1, null), true);
        /** Zamorak Altar **/
        ObjectManager.register(new GameObject(411, new Location(2373, 3135, 1), 10, 0, null), true);
    }

    public static handleItemOnPlayer(player: Player, target: Player, item: Item): boolean {
        if (item.getId() !== ItemIdentifiers.BANDAGES) {
            return false;
        }
        if (Team.getTeamForPlayer(player) !== Team.getTeamForPlayer(target)) {
            player.getPacketSender().sendMessage("You don't want to be healing your enemies!");
            return true;
        }
        CastleWars.healWithBandage(target, false);
        return true;
    }

    private static healWithBandage(player: Player, use: boolean): void {
        /**
         * TODO...
         */
        const bracelet: boolean = player.getEquipment().hasCastleWarsBracelet();
        /** Boost increases BY 50% if wearing the bracelet **/
        const maxHP: number = player.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        /** Wiki only says heal. Nothing about run energy for other players **/
        const hp: number = Math.floor(maxHP * (bracelet ? 1.6 : 1.1));
        /** Heals the target **/
        player.heal(hp);
    }

    private static isSteppingStones(loc: Location): boolean {
        return (loc.getX() >= 2418 && loc.getX() <= 2420 && loc.getY() >= 3122 && loc.getY() <= 3125) || (loc.getX() >= 2377 && loc.getX() <= 2378 && loc.getY() >= 3084 && loc.getY() <= 3088);
    }

    /**
 * The key used to schedule the start game CountdownTask.
 */
    public static START_GAME_TASK_KEY = "CW_START_GAME";

    /**
     * The task that gets scheduled to start the game.
     */
    public static START_GAME_TASK = new CountdownTask(CastleWars.START_GAME_TASK_KEY, Misc.getTicks(10), CastleWars.startGame);

    /**
     * The key used to schedule the end game CountdownTask.
     */
    public static END_GAME_TASK_KEY = "CW_END_GAME";

    /**
     * The task that gets scheduled to end the game.
     */
    public static GAME_END_TASK = new CountdownTask(CastleWars.END_GAME_TASK_KEY, Misc.getTicks(1200), CastleWars.endGame);

    /**
 * The coordinates for the gameRoom both sara/zammy
 */
    public static GAME_ROOM: [number, number][] = [[2426, 3076], // sara
    [2372, 3131], // zammy
    ];
    public static FLAG_STANDS: [number, number][] = [[2429, 3074], // sara
    [2370, 3133], // zammy
    ];

    /*
Scores for saradomin and zamorak!
/
const scores: [number, number] = [0, 0];
/
Booleans to check if a team's flag is safe
*/
    public static zammyFlag = 0;
    public static saraFlag = 0;
    /*
    
    Zamorak and saradomin banner/capes item ID's
    */
    public static SARA_BANNER = 4037;
    public static SARA_BANNER_ITEM = new Item(CastleWars.SARA_BANNER);
    public static ZAMMY_BANNER = 4039;
    public static ZAMMY_BANNER_ITEM = new Item(CastleWars.ZAMMY_BANNER);

    public static SARA_CAPE = 4041;
    public static ZAMORAK_CAPE = new Item(ItemIdentifiers.HOODED_CLOAK_2);
    public static SARADOMIN_CAPE = new Item(ItemIdentifiers.HOODED_CLOAK);
    public static SARA_HOOD = 4513;
    public static ZAMMY_HOOD = 4515;

    public static MANUAL = new Item(ItemIdentifiers.CASTLEWARS_MANUAL);

    public static TAKE_BANDAGES_ANIM = new Animation(881);

    public static ITEMS = [ItemIdentifiers.BANDAGES, ItemIdentifiers.BRONZE_PICKAXE, ItemIdentifiers.EXPLOSIVE_POTION, Barricades.ITEM_ID, ItemIdentifiers.HOODED_CLOAK_2, CastleWars.SARA_CAPE, CastleWars.SARA_BANNER, CastleWars.ZAMMY_BANNER, ItemIdentifiers.ROCK_5];

    public static CATAPULT_INTERFACE = 11169;

    public static deleteItemsOnEnd(player: Player): void {
        /** Clears cwars items **/
        CastleWars.ITEMS.forEach(i => player.getInventory().deleteNumber(i, Number.MAX_SAFE_INTEGER));
        /** List for Equipment **/
        const equip = [CastleWars.SARA_CAPE, CastleWars.SARA_HOOD, ItemIdentifiers.HOODED_CLOAK_2, CastleWars.ZAMMY_HOOD, CastleWars.SARA_BANNER, CastleWars.ZAMMY_BANNER];
        /** Deletes Equipment **/
        equip.filter(i => i != null).filter(p => player.getEquipment().contains(p)).forEach(e => player.getEquipment().deletes(new Item(e)));
    }

    public static COLLAPSE_ROCKS: [number, number, number, number][] = [ // collapsing rocks coords
        [2399, 2402, 9511, 9514], // north X Y coords sara 0
        [2390, 2393, 9500, 9503], // east X Y coords sara 1
        [2400, 2403, 9493, 9496], // south X Y coords zammy 2
        [2408, 2411, 9502, 9505] // west X Y coords zammy 3
    ];

    public static LOBBY_TELEPORT = new Location(2440, 3089, 0);

    public static TEAM_GUTHIX = 3;

    public static isGameActive(): boolean {
        return CastleWars.GAME_END_TASK.isRunning();
    }

    /**
 * Kills any players standing under the cave collapse area.
 *
 * @param cave
 */
    public static collapseCave(cave: number): void {
        CastleWars.GAME_AREA.getPlayers().forEach((player) => {
            if (player.getLocation().getX() > CastleWars.COLLAPSE_ROCKS[cave][0]
                && player.getLocation().getX() < CastleWars.COLLAPSE_ROCKS[cave][1]
                && player.getLocation().getY() > CastleWars.COLLAPSE_ROCKS[cave][2]
                && player.getLocation().getY() < CastleWars.COLLAPSE_ROCKS[cave][3]) {
                const damage = player.getSkillManager().getCurrentLevel(Skill.HITPOINTS);
                player.getCombat().getHitQueue().addPendingDamage([new HitDamage(damage, HitMask.RED)]);
            }
        });
    }

    /**
 * Method we use to add someone to the waiting room
 *
 * @param player the player that wants to join
 * @param team   the team!
 */
    public static addToWaitingRoom(player: Player, team: Team): void {
        if (player == null) {
            return;
        }

        if (CastleWars.isGameActive()) {
            player.getPacketSender().sendMessage("There's already a Castle Wars going. Please wait a few minutes before trying again.");
            return;
        }

        if (player.getEquipment().getItems()[Equipment.HEAD_SLOT].isValid()
            || player.getEquipment().getItems()[Equipment.CAPE_SLOT].isValid()) {
            StatementDialogue.send(player, "Some items are stopping you from entering the Castle Wars waiting " +
                "area. See the chat for details.");
            player.getPacketSender().sendMessage("You can't wear hats, capes or helms in the arena.");
            return;
        }

        const foodIds = Edible.getTypes();
        if (player.getEquipment().containsAny(foodIds)) {
            player.getPacketSender().sendMessage("You may not bring your own consumables inside of Castle Wars.");
            return;
        }

        const saradominPlayerCount = Team.SARADOMIN.getWaitingPlayers();
        const zamorakPlayerCount = Team.ZAMORAK.getWaitingPlayers();

        switch (team) {
            case Team.SARADOMIN:
                if (saradominPlayerCount > zamorakPlayerCount) {
                    player.getPacketSender().sendMessage("The Saradomin team is full, try Zamorak!");
                    return;
                }

                player.getPacketSender().sendMessage("You have been added to the Saradomin team.");
                break;

            case Team.ZAMORAK:
                if (zamorakPlayerCount > saradominPlayerCount) {
                    player.getPacketSender().sendMessage("The Zamorak team is full, try Saradomin!");
                    return;
                }

                player.getPacketSender().sendMessage("You have been added to the Zamorak team.");
                break;

            case Team.GUTHIX:
                // Player should join whichever team has less players
                const newTeam = zamorakPlayerCount > saradominPlayerCount ? Team.SARADOMIN : Team.ZAMORAK;
                this.addToWaitingRoom(player, newTeam);
                return;
        }

        /** Uses smart teleport with a radius of 8. **/
        player.smartMove(team.getWaitingRoom(), 8);
    }

    /**
Method to add score to scoring team
@param player the player who scored
@param wearItem banner id!
*/
    public static returnFlag(player: Player, wearItem: number): void {
        const team = Team.getTeamForPlayer(player);
        if (!player || !team) {
            return;
        }
        if (wearItem !== CastleWars.SARA_BANNER && wearItem !== CastleWars.ZAMMY_BANNER) {
            return;
        }
        let objectId = -1;
        let objectTeam = -1;
        switch (team) {
            case Team.SARADOMIN:
                if (wearItem === CastleWars.SARA_BANNER) {
                    CastleWars.setSaraFlag(0);
                    objectId = 4902;
                    objectTeam = 0;
                    player.getPacketSender().sendMessage("Returned the sara flag!");
                } else {
                    objectId = 4903;
                    objectTeam = 1;
                    CastleWars.setZammyFlag(0);
                    Team.SARADOMIN.incrementScore();
                    player.getPacketSender().sendMessage("The team of Saradomin scores 1 point!");
                }
                break;
            case Team.ZAMORAK:
                if (wearItem === CastleWars.ZAMMY_BANNER) {
                    CastleWars.setZammyFlag(0);
                    objectId = 4903;
                    objectTeam = 1;
                    player.getPacketSender().sendMessage("Returned the Zamorak flag!");
                } else {
                    objectId = 4902;
                    objectTeam = 0;
                    CastleWars.setSaraFlag(0);
                    Team.ZAMORAK.incrementScore();
                    player.getPacketSender().sendMessage("The team of Zamorak scores 1 point!");
                    CastleWars.zammyFlag = 0;
                }
                break;
        }
        CastleWars.changeFlagObject(objectId, objectTeam);
        CastleWars.removeHintIcon();
        player.getEquipment().setItem(Equipment.WEAPON_SLOT, Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getInventory().resetItems();
        player.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    /**
Method that will capture a flag when being taken by the enemy team!
@param player the player who returned the flag
*/
    public static captureFlag(player: Player, team: Team): void {
        if (player.getEquipment().getSlot(Equipment.WEAPON_SLOT) > 0) {
            player.getPacketSender().sendMessage("Please remove your weapon before attempting to capture the flag!");
            return;
        }
        if (team === Team.ZAMORAK && CastleWars.saraFlag === 0) { // sara flag
            CastleWars.setSaraFlag(1);
            CastleWars.addFlag(player, CastleWars.SARA_BANNER_ITEM);
            CastleWars.createHintIcon(player, Team.SARADOMIN);
            CastleWars.changeFlagObject(ObjectIdentifiers.STANDARD_STAND, 0);
        }

        if (team === Team.SARADOMIN && CastleWars.zammyFlag === 0) {
            CastleWars.setZammyFlag(1);
            CastleWars.addFlag(player, CastleWars.ZAMMY_BANNER_ITEM);
            CastleWars.createHintIcon(player, Team.ZAMORAK);
            CastleWars.changeFlagObject(ObjectIdentifiers.STANDARD_STAND_2, 1);
        }
    }

    /**
Method that will add the flag to a player's weapon slot
@param player the player who's getting the flag
@param banner the banner Item.
*/
    public static addFlag(player: Player, banner: Item): void {
        player.getEquipment().set(Equipment.WEAPON_SLOT, banner);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    /**
Method we use to handle the flag dropping
@param player the player who dropped the flag/died
@param team the team that the flag belongs to
*/
    public static dropFlag(player: Player, team: Team): void {
        let object = -1;
        switch (team) {
            case Team.SARADOMIN:
                CastleWars.setSaraFlag(2);
                object = 4900;
                break;
            case Team.ZAMORAK:
                CastleWars.setZammyFlag(2);
                object = 4901;
                break;
        }
        player.getEquipment().setItem(Equipment.WEAPON_SLOT, Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag.APPEARANCE);
        if (CastleWars.isSteppingStones(player.getLocation()) && object !== -1) {
            CastleWars.returnFlag(player, Team.getTeamForPlayer(player) === Team.SARADOMIN ? CastleWars.SARA_BANNER : CastleWars.ZAMMY_BANNER);
            return;
        }
        CastleWars.createFlagHintIcon(player.getLocation());
        const obj = new GameObject(object, player.getLocation(), 10, 0, null);
        // Spawn the flag object for all players
        CastleWars.spawned_objects.push(obj);
        CastleWars.GAME_AREA.getPlayers().forEach((teamPlayer) => teamPlayer.getPacketSender().sendObject(obj));
    }

    /**
Method we use to pickup the flag when it was dropped/lost
@param player the player who's picking it up
@param object the flag object
*/
    public static pickupFlag(player: Player, object: GameObject) {
        switch (object.getId()) {
            case ObjectIdentifiers.SARADOMIN_STANDARD:
                if (player.getEquipment().getSlot(Equipment.WEAPON_SLOT) > 0) {
                    player.getPacketSender().sendMessage("Please remove your weapon before attempting to get the flag again!");
                    return;
                }
                if (CastleWars.saraFlag != 2) {
                    return;
                }
                CastleWars.setSaraFlag(1);
                CastleWars.addFlag(player, CastleWars.SARA_BANNER_ITEM);
                break;
            case ObjectIdentifiers.ZAMORAK_STANDARD:
                if (player.getEquipment().getSlot(Equipment.WEAPON_SLOT) > 0) {
                    player.getPacketSender().sendMessage("Please remove your weapon before attempting to get the flag again!");
                    return;
                }
                if (CastleWars.zammyFlag != 2) {
                    return;
                }
                CastleWars.setZammyFlag(1);
                CastleWars.addFlag(player, CastleWars.ZAMMY_BANNER_ITEM);
                break;
        }
        CastleWars.createHintIcon(player, Team.getTeamForPlayer(player) == Team.SARADOMIN ? Team.SARADOMIN : Team.ZAMORAK);

        CastleWars.GAME_AREA.getPlayers().forEach((teamPlayer) => {
            const flag = new GameObject(object.getId(), object.getLocation(), 10, 0, teamPlayer.getPrivateArea());
            if (CastleWars.spawned_objects.includes(flag)) {
                CastleWars.spawned_objects.splice(CastleWars.spawned_objects.indexOf(flag), 1);
            }
            teamPlayer.getPacketSender().sendPositionalHint(object.getLocation(), -1);
            teamPlayer.getPacketSender().sendObjectRemoval(flag);
        });
    }

    /**
 * Hint icons appear to your team when a enemy steals flag
 *
 * @param player the player who took the flag
 * @param team team of the opponent team. (:
 */
    public static createHintIcon(player: Player, team: Team): void {
        CastleWars.GAME_AREA.getPlayers().forEach((teamPlayer) => {
            teamPlayer.getPacketSender().sendEntityHintRemoval(true);
            if (Team.getTeamForPlayer(teamPlayer) === team) {
                teamPlayer.getPacketSender().sendEntityHint(player);
                player.getUpdateFlag().flag(Flag.APPEARANCE);
            }
        });
    }

    /**
Hint icons appear to your team when a enemy steals flag
@param location the location of the flag hint
*/
    public static createFlagHintIcon(location: Location): void {
        CastleWars.GAME_AREA.getPlayers().forEach((teamPlayer) => teamPlayer.getPacketSender().sendPositionalHint(location, 2));
    }
    public static removeHintIcon(): void {
        CastleWars.GAME_AREA.getPlayers().forEach(p => p.getPacketSender().sendEntityHintRemoval(true));
    }

    /**
The leaving method will be used on click object or log out
@param player player who wants to leave
*/
    public static leaveWaitingRoom(player: Player): void {
        if (player == null) {
            return;
        }
        player.getPacketSender().sendEntityHintRemoval(true);
        CastleWars.deleteGameItems(player);

    }

    /*
Method that will start the game when there's enough players.
*/
    public static startGame(): void {
        CastleWars.SARADOMIN_WAITING_AREA.getPlayers().forEach((player) => {
            player.resetCastlewarsIdleTime();
            Team.SARADOMIN.addPlayer(player);
            player.getPacketSender().sendWalkableInterface(-1);
            player.moveTo(new Location(
                CastleWars.GAME_ROOM[0][0] + Misc.randoms(3),
                CastleWars.GAME_ROOM[0][1] - Misc.randoms(3), 1));
        });
        CastleWars.ZAMORAK_WAITING_AREA.getPlayers().forEach((player) => {
            player.resetCastlewarsIdleTime();
            Team.ZAMORAK.addPlayer(player);
            player.getPacketSender().sendWalkableInterface(-1);
            player.moveTo(new Location(
                CastleWars.GAME_ROOM[1][0] + Misc.randoms(3),
                CastleWars.GAME_ROOM[1][1] - Misc.randoms(3), 1));
        });

        // Schedule the game ending
        TaskManager.submit(CastleWars.GAME_END_TASK);
    }

    /*
Method we use to end an ongoing cw game.
*/
    public static endGame(): void {
        CastleWars.GAME_AREA.getPlayers().forEach((player) => {
            player.getPacketSender().sendEntityHintRemoval(true);

            const scores: number[] = [0, 0];
            const saradominWon: boolean = scores[0] > scores[1];

            if (scores[0] === scores[1]) {
                player.getInventory().adds(ItemIdentifiers.CASTLE_WARS_TICKET, 1);
                player.getPacketSender().sendMessage("Tie game! You earn 1 ticket!");
            } else if ((saradominWon && Team.SARADOMIN.getPlayers().includes(player))
                || (!saradominWon && Team.ZAMORAK.getPlayers().includes(player))) {
                player.getInventory().adds(ItemIdentifiers.CASTLE_WARS_TICKET, 2);
                player.getPacketSender().sendMessage("You won the game. You received 2 Castle Wars Tickets!");
                ItemStatementDialogue.send(player, "", ["You won!", "You captured the enemy's standard" + CastleWars.getScore(Team.getTeamForPlayer(player)) + " times.", "Enemies killed: TODO."], ItemIdentifiers.CASTLE_WARS_TICKET, 200);
            } else {
                ItemStatementDialogue.send(player, "", ["You lost!", "You captured the enemy's standard" + CastleWars.getScore(Team.getTeamForPlayer(player)) + " times.", "Enemies killed: TODO."], ItemIdentifiers.CASTLE_WARS_TICKET, 200);
                player.getPacketSender().sendMessage("You lost the game. You received no tickets!");
            }
            // Teleport player after checking scores and adding tickets.
            player.moveTo(new Location(2440 + Misc.randoms(3), 3089 - Misc.randoms(3), 0));
        });
        CastleWars.spawned_objects.forEach((o) => { if (o != null) ObjectManager.deregister(o, true); });
        CastleWars.spawned_objects.splice(0);
        // Reset game after processing players.
        CastleWars.resetGame();
    }

    public static getScore(team: Team): number {
        return team.getScore();
    }

    /**
     * reset the game variables
     */
    public static resetGame(): void {
        CastleWars.changeFlagObject(4902, 0);
        CastleWars.changeFlagObject(4903, 1);
        CastleWars.setSaraFlag(0);
        CastleWars.setZammyFlag(0);
        TaskManager.cancelTasks([CastleWars.START_GAME_TASK_KEY, CastleWars.END_GAME_TASK_KEY]);
        Team.resetTeams();
    }

    /**
 * This method will delete all items received in game. Easy to add items to
 * the array. (:
 *
 * @param player the player who want the game items deleted from.
 */
    public static deleteGameItems(player: Player): void {
        switch (player.getEquipment().getSlot(Equipment.WEAPON_SLOT)) {
            case CastleWars.SARA_BANNER:
            case CastleWars.ZAMMY_BANNER:
                player.getEquipment().setItem(Equipment.WEAPON_SLOT, Equipment.NO_ITEM);
                player.getEquipment().refreshItems();
                player.getUpdateFlag().flag(Flag.APPEARANCE);
                break;
        }
        switch (player.getEquipment().getSlot(Equipment.CAPE_SLOT)) {
            case ItemIdentifiers.HOODED_CLOAK_2:
            case CastleWars.SARA_CAPE:
                player.getEquipment().setItem(Equipment.CAPE_SLOT, Equipment.NO_ITEM);
                player.getEquipment().refreshItems();
                player.getUpdateFlag().flag(Flag.APPEARANCE);
                break;
        }
        for (let item of CastleWars.ITEMS) {
            if (player.getInventory().contains(item)) {
                player.getInventory().deletes(new Item(item, player.getInventory().getAmount(item)));
            }
        }
    }

    /**
 * Method to make sara flag change status 0 = safe, 1 = taken, 2 = dropped
 *
 * @param status
 */
    public static setSaraFlag(status: number): void {
        CastleWars.saraFlag = status;
    }

    /**
     * Method to make zammy flag change status 0 = safe, 1 = taken, 2 = dropped
     *
     * @param status
     */
    public static setZammyFlag(status: number): void {
        CastleWars.zammyFlag = status;
    }

    /**
 * Method we use for the changing the object of the flag stands when
 * capturing/returning flag
 *
 * @param objectId the object
 * @param team     the team of the player
 */
    public static changeFlagObject(objectId: number, team: number): void {
        let gameObject = new GameObject(
            objectId,
            new Location(CastleWars.FLAG_STANDS[team][0], CastleWars.FLAG_STANDS[team][1], 3),
            10,
            2,
            null
        );
        ObjectManager.register(gameObject, true);
        CastleWars.spawned_objects.push(gameObject);
    }

    public firstClickObject(player: Player, object: GameObject): boolean {
        const x = object.getLocation().getX();
        const y = object.getLocation().getY();

        const loc = object.getLocation();

        const id = object.getId();

        const type = object.getType();

        const face = object.getFace();

        const playerX = player.getLocation().getX();
        const playerY = player.getLocation().getY();
        const playerZ = player.getLocation().getZ();

        switch (object.getId()) {
            case 4386: // zamorak burnt catapult
            case 4385: { // saradomin burnt catapult
                CastleWars.repairCatapult(player, object);
                return true;
            }
            case 4381:
            case 4382: {
                CastleWars.handleCatapult(player);
                return true;
            }
            case 4469:
                if (Team.getTeamForPlayer(player) == Team.ZAMORAK) {
                    player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                    return true;
                }
                player.resetCastlewarsIdleTime();
                if (x == 2426) {
                    if (playerY == 3080) {
                        player.moveTo(new Location(2426, 3081, playerZ));
                    } else if (playerY == 3081) {
                        player.moveTo(new Location(2426, 3080, playerZ));
                    }
                } else if (x == 2422) {
                    if (playerX == 2422) {
                        player.moveTo(new Location(2423, 3076, playerZ));
                    } else if (playerX == 2423) {
                        player.moveTo(new Location(2422, 3076, playerZ));
                    }
                }
                return true;
            case 4470:
                if (Team.getTeamForPlayer(player) == Team.SARADOMIN) {
                    player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                    return true;
                }
                player.resetCastlewarsIdleTime();
                if (x == 2373 && y == 3126) {
                    if (playerY == 3126) {
                        player.moveTo(new Location(2373, 3127, 1));
                    } else if (playerY == 3127) {
                        player.moveTo(new Location(2373, 3126, 1));
                    }
                } else if (x == 2377 && y == 3131) {
                    if (playerX == 2376) {
                        player.moveTo(new Location(2377, 3131, 1));
                    } else if (playerX == 2377) {
                        player.moveTo(new Location(2376, 3131, 1));
                    }
                }
                return true;
            case 4417:
                if (x == 2428 && y == 3081 && playerZ == 1) {
                    player.moveTo(new Location(2430, 3080, 2));
                }
                if (x == 2425 && y == 3074 && playerZ == 2) {
                    player.moveTo(new Location(2426, 3074, 3));
                }
                if (x == 2419 && y == 3078 && playerZ == 0) {
                    player.moveTo(new Location(2420, 3080, 1));
                }
                return true;
            case 4415:
                if (x === 2419 && y === 3080 && playerZ === 1) {
                    player.moveTo(new Location(2419, 3077, 0));
                }
                if (x === 2430 && y === 3081 && playerZ === 2) {
                    player.moveTo(new Location(2427, 3081, 1));
                }
                if (x === 2425 && y === 3074 && playerZ === 3) {
                    player.moveTo(new Location(2425, 3077, 2));
                }
                if (x === 2374 && y === 3133 && playerZ === 3) {
                    player.moveTo(new Location(2374, 3130, 2));
                }
                if (x === 2369 && y === 3126 && playerZ === 2) {
                    player.moveTo(new Location(2372, 3126, 1));
                }
                if (x === 2380 && y === 3127 && playerZ === 1) {
                    player.moveTo(new Location(2380, 3130, 0));
                }
                return true;
            case 4411: // castle wars jumping stones
                if (x === playerX && y === playerY) {
                    player.getPacketSender().sendMessage("You are standing on the rock you clicked.");
                } else if (x > playerX && y === playerY) {
                    player.getMovementQueue().walkStep(1, 0);
                } else if (x < playerX && y === playerY) {
                    player.getMovementQueue().walkStep(-1, 0);
                } else if (y > playerY && x === playerX) {
                    player.getMovementQueue().walkStep(0, 1);
                } else if (y < playerY && x === playerX) {
                    player.getMovementQueue().walkStep(0, -1);
                } else {
                    player.getPacketSender().sendMessage("Can't reach that.");
                }
                return true;
            case 4419:
                if (x === 2417 && y === 3074 && playerZ === 0) {
                    if (playerX === 2416) {
                        player.moveTo(new Location(2417, 3077, 0));
                    } else {
                        player.moveTo(new Location(2416, 3074, 0));
                    }
                }
                return true;
            case 4911:
                if (x === 2421 && y === 3073 && playerZ === 1) {
                    player.moveTo(new Location(2421, 3074, 0));
                }
                if (x === 2378 && y === 3134 && playerZ === 1) {
                    player.moveTo(new Location(2378, 3133, 0));
                }
                return true;
            case 1747:
                if (x === 2421 && y === 3073 && playerZ === 0) {
                    player.moveTo(new Location(2421, 3074, 1));
                }
                if (x === 2378 && y === 3134 && playerZ === 0) {
                    player.moveTo(new Location(2378, 3133, 1));
                }
                return true;
            case 4912:
                if (x == 2430 && y == 3082 && playerZ == 0) {
                    player.moveTo(new Location(playerX, playerY + 6400, 0));
                }
                if (x == 2369 && y == 3125 && playerZ == 0) {
                    player.moveTo(new Location(playerX, playerY + 6400, 0));
                }
                return true;

            case 17387: // under ground ladders to top
                if (x == 2369 && y == 9525) {
                    player.moveTo(new Location(2369, 3126, 0));
                } else if (x == 2430 && y == 9482) {
                    player.moveTo(new Location(2430, 3081, 0));
                } else if (x == 2400 && y == 9508) { // middle north
                    player.moveTo(new Location(2400, 3107, 0));
                } else if (x == 2399 && y == 9499) { // middle south
                    player.moveTo(new Location(2399, 3100, 0));
                }
                return true;

            case 1757:
                if (x == 2430 && y == 9482) {
                    player.moveTo(new Location(2430, 3081, 0));
                } else if (playerX == 2533) {
                    player.moveTo(new Location(2532, 3155, 0));
                } else {
                    player.moveTo(new Location(2369, 3126, 0));
                }
                return true;

            case 4418:
                if (x == 2380 && y == 3127 && playerZ == 0) {
                    player.moveTo(new Location(2379, 3127, 1));
                }
                if (x == 2369 && y == 3126 && playerZ == 1) {
                    player.moveTo(new Location(2369, 3127, 2));
                }
                if (x == 2374 && y == 3131 && playerZ == 2) {
                    player.moveTo(new Location(2373, 3133, 3));
                }
                return true;

            case 4420:
                if (x == 2382 && y == 3131 && playerZ == 0) {
                    if (playerX >= 2383 && playerX <= 2385) {
                        player.moveTo(new Location(2382, 3130, 0));
                    } else {
                        player.moveTo(new Location(2383, 3133, 0));
                    }
                }
                return true;

            case 1568:
                if (x == 2399 && y == 3099) {
                    player.moveTo(new Location(2399, 9500, 0));
                } else {
                    player.moveTo(new Location(2400, 9507, 0));
                }
                // add missing return statement here
                return true;

            case 6281:
                player.moveTo(new Location(2370, 3132, 2));
                return true;

            case 6280:
                player.moveTo(new Location(2429, 3075, 2));
                return true;
            case 4458:
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.BANDAGES, 1);
                    player.getPacketSender().sendMessage("You get some bandages.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4461: // barricades
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(Barricades.ITEM_ID, 1);
                    player.getPacketSender().sendMessage("You get a barricade.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4463: // explosive potion!
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.EXPLOSIVE_POTION, 1);
                    player.getPacketSender().sendMessage("You get an explosive potion!");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4464: // pickaxe table
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.BRONZE_PICKAXE, 1);
                    player.getPacketSender().sendMessage("You get a bronze pickaxe for mining.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4459: // tinderbox table
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.TINDERBOX, 1);
                    player.getPacketSender().sendMessage("You get a Tinderbox.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4462:
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.ROPE, 1);
                    player.getPacketSender().sendMessage("You get some rope.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4460:
                if (!player.getTimers().has(TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers.ROCK_5, 1);
                    player.getPacketSender().sendMessage("You get a rock.");
                    player.getTimers().extendOrRegister(TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4900:
            case 4901:
                CastleWars.pickupFlag(player, object);
                return true;
            case 4389: // sara
            case 4390: // zammy waiting room portal
                CastleWars.leaveWaitingRoom(player);
                return true;
            default:
                break;
        }

        return false;
    }

    /**
Processes all actions to keep the minigame running smoothly.
*/
    public process(): void {
    }

    public static handleCatapult(player: Player): void {
        if (!player.getInventory().contains(4043)) {
            player.getPacketSender().sendMessage("You need a rock to launch from the catapult!");
            return;
        }
        CastleWars.resetCatapult(player);
        player.getPacketSender().sendInterface(CastleWars.CATAPULT_INTERFACE);
    }

    public handleButtonClick(player: Player, button: number): boolean {
        if (player.getInterfaceId() !== CastleWars.CATAPULT_INTERFACE) {
            return false;
        }

        const x: number = player.getAttribute("catapultX") as number ?? 0;
        const y: number = player.getAttribute("catapultY") as number ?? 0;
        const saradomin: boolean = Team.getTeamForPlayer(player) === Team.SARADOMIN;
        player.getPacketSender().sendInterfaceComponentMoval(1, 0, 11332);

        if (button === 11321) {//Up Y
            if (saradomin && y < 30) {
                player.setAttribute("catapultY", y + 1);
            } else if (y > 0) {
                player.setAttribute("catapultY", y - 1);
            }
        }
        if (button === 11322) {
            if (saradomin && y > 0) {//down Y
                player.setAttribute("catapultY", y - 1);
            } else if (y < 30) {
                player.setAttribute("catapultY", y + 1);
            }
        }
        if (button === 11323) {
            if (saradomin && x > 0) {//right X
                player.setAttribute("catapultX", x - 1);
            } else if (x < 30) {
                player.setAttribute("catapultX", x + 1);
            }
        }
        if (button === 11324) {//left X
            if (saradomin && x < 30) {
                player.setAttribute("catapultX", x + 1);
            } else if (x > 0) {
                player.setAttribute("catapultX", x - 1);
            }
        }

        let newX: number = player.getAttribute("catapultX") as number ?? 0;
        let newY: number = player.getAttribute("catapultY") as number ?? 0;


        player.getPacketSender().sendWidgetModel(11317, 4863 + (newY < 10 ? 0 : newY > 9 ? (newY / 10) : newY));
        player.getPacketSender().sendWidgetModel(11318, 4863 + (newY > 29 ? newY - 30 : newY > 19 ? newY - 20 : newY > 9 ? newY - 10 : newY));
        player.getPacketSender().sendWidgetModel(11319, 4863 + (newX < 10 ? 0 : newX > 9 ? (newX / 10) : newX));
        player.getPacketSender().sendWidgetModel(11320, 4863 + (newX > 29 ? newX - 30 : newX > 19 ? newX - 20 : newX > 9 ? newX - 10 : newX));

        player.getPacketSender().sendInterfaceComponentMoval(saradomin ? 90 - (newX * 2) : newX * 2, saradomin ? 90 - (newY * 2) : newY * 2, 11332);

        if (button === 11329) { // Fire button
            if (newX > 1) {
                newX /= 2;
            }
            if (newY > 1) {
                newY /= 2;
            }
            player.getPacketSender().sendInterfaceRemoval();
            const startX = saradomin ? CastleWars.saradomin_catapult_start.getX() : CastleWars.zamorak_catapult_start.getX();
            const startY = saradomin ? CastleWars.saradomin_catapult_start.getY() : CastleWars.zamorak_catapult_start.getY();
            const destination = new Location(saradomin ? (x >= 0 ? startX - x : startX + x) : (x >= 0 ? startX + x : startX - x), saradomin ? (y >= 0 ? startY + y : startY - y) : (y >= 0 ? startY - y : startY + y));
            const catapult = World.findCacheObject(player, saradomin ? 4382 : 4381, saradomin ? CastleWars.saradomin_catapult_location : CastleWars.zamorak_catapult_location);
            if (catapult != null) {
                catapult.performAnimation(new Animation(443));
            }
            new Projectile(saradomin ? CastleWars.saradomin_catapult_location : CastleWars.zamorak_catapult_location, destination, null, 304, 30, 100, 75, 75, player.getPrivateArea())
                .sendProjectile();
            TaskManager.submit(new CastleWarsTask(() => {
                let ticks = 0;
                const task = setInterval(() => {
                    ticks++;
                    if (ticks == 4) {
                        World.sendLocalGraphics(303, destination);
                    }
                    if (ticks == 6) {
                        const players = [];
                        for (const player of World.getPlayers()) {
                            if (player !== null && player.getLocation() !== null && player.getLocation().isWithinDistance(destination, 5)) {
                                players.push(player);
                            }
                        }
                        if (Array.isArray(players)) {
                            players.forEach(p => p.getCombat().getHitQueue().addPendingDamage(new HitDamage(Misc.random(5, 15), HitMask.RED)));
                        }
                        World.sendLocalGraphics(305, destination);
                        clearInterval(task);
                    }
                }, 1);
            }, player))
        }
        return true;

    }

    private static resetCatapult(player: Player): void {
        for (let i = 11317; i < 11321; i++) {
            player.getPacketSender().sendWidgetModel(i, 4863);
        }
        player.setAttribute("catapultX", 0);
        player.setAttribute("catapultY", 0);
        const team: Team = Team.getTeamForPlayer(player);
        if (team == null) {
            console.error(`error setting red cross for ${player.getUsername()} they aren't on a team!`);
            return;
        }
        const sara: boolean = team === Team.SARADOMIN;
        player.getPacketSender().sendInterfaceComponentMoval(sara ? 90 : 0, sara ? 90 : 0, 11332);
    }

    private static saradominCatapult: CatapultState = CatapultState.FIXED;
    private static zamorakCatapult: CatapultState = CatapultState.FIXED;



    private static saradomin_catapult_start: Location = new Location(2411, 3092, 0);
    private static zamorak_catapult_start: Location = new Location(2388, 3115, 0);

    private static saradomin_catapult_location: Location = new Location(2413, 3088, 0);
    private static zamorak_catapult_location: Location = new Location(2384, 3117, 0);

    /**
large doors - 4023-4024 -- 4025-4026
@param player
@param item
@param object
@return
*/
    public static handleItemOnObject(player: Player, item: Item, object: GameObject): boolean {
        const objectId: number = object.getId();
        const itemId: number = item.getId();
        const saradomin: boolean = Team.getTeamForPlayer(player) === Team.SARADOMIN;
        if (objectId === 4385) {
            if (itemId === 4051) {
                CastleWars.repairCatapult(player, object);
                return true;
            }
            return false;
        }

        /**
        
        Saradomin's burning catapult
        */
        if (objectId === 4904 || objectId === 4905) {
            if (itemId === 1929) {
                if (saradomin) {
                    if (CastleWars.saradominCatapult === CatapultState.FIXED) {
                        player.getPacketSender().sendMessage("The fire has already been extinguished.");
                        return true;
                    }
                } else {
                    if (CastleWars.zamorakCatapult === CatapultState.FIXED) {
                        player.getPacketSender().sendMessage("The fire has already been extinguished.");
                        return true;
                    }
                }

                player.getInventory().deleteNumber(1929, 1); // bucket of water
                player.getInventory().addItem(new Item(1925, 1)); // empty bucket

                if (saradomin) {
                    CastleWars.saradominCatapult = CatapultState.FIXED;
                } else {
                    CastleWars.zamorakCatapult = CatapultState.FIXED;
                }

                return true;
            }


            return false;
        }

        /**
        
        Saradomin's default catapult
        */
        if (objectId === 4382 || objectId === 4381) {
            /*
            
            Saradomin Catapult
            */
            if (itemId === 590 || itemId === 4045) {
                if (saradomin) {
                    if (CastleWars.saradominCatapult === CatapultState.BURNING) {
                        player.getPacketSender().sendMessage("The catapult is already burning!");
                        return true;
                    }
                } else {
                    if (CastleWars.zamorakCatapult === CatapultState.BURNING) {
                        player.getPacketSender().sendMessage("The catapult is already burning!");
                        return true;
                    }
                }
                if (itemId === 4045) player.getInventory().deleteNumber(4045, 1);

                //4904 zamorak, 4905 saradomin
                const onFire = new GameObject(saradomin ? 4904 : 4905, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());
                const burnt = new GameObject(saradomin ? 4385 : 4386, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());
                const fixed = new GameObject(object.getId(), object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());

                if (saradomin) {
                    CastleWars.saradominCatapult = CatapultState.BURNING;
                } else {
                    CastleWars.zamorakCatapult = CatapultState.BURNING;
                }

                ObjectManager.register(onFire, true);
                onFire.performAnimation(new Animation(1431));
                //4385 zamorak, 4386 saradomin
                const task = new CastleWarsTask(() => {

                    let ticks: number = 0;



                    ticks++;

                    if (saradomin) {
                        if (CastleWars.saradominCatapult != CatapultState.BURNING) {
                            CastleWars.changeCatapultState(task, fixed, CatapultState.FIXED, true);
                            return;
                        }
                        if (ticks == 16) {//4385, 4386
                            CastleWars.changeCatapultState(task, burnt, CatapultState.REPAIR, true);
                        }
                    } else {
                        if (CastleWars.zamorakCatapult != CatapultState.BURNING) {
                            CastleWars.changeCatapultState(task, fixed, CatapultState.FIXED, false);
                            return;
                        }
                        if (ticks == 16) {//4385, 4386
                            CastleWars.changeCatapultState(task, burnt, CatapultState.REPAIR, false);
                        }
                    }


                }, player);
                TaskManager.submit(task);
                return true;
            }
            return false;
        }
        return false;
    }


    private static repairCatapult(player: Player, object: GameObject): void {
        if (!player.getInventory().contains(4051)) {
            player.getPacketSender().sendMessage("You need a toolkit to repair the catapult.");
            return;
        }

        const isSaradomin = Team.getTeamForPlayer(player) === Team.SARADOMIN;
        if (isSaradomin) {
            if (CastleWars.saradominCatapult !== CatapultState.REPAIR) {
                player.getPacketSender().sendMessage("The catapult has already been repaired");
                return;
            }
            CastleWars.saradominCatapult = CatapultState.FIXED;
        } else {
            if (CastleWars.zamorakCatapult !== CatapultState.REPAIR) {
                player.getPacketSender().sendMessage("The catapult has already been repaired");
                return;
            }
            CastleWars.zamorakCatapult = CatapultState.FIXED;
        }

        player.getInventory().deleteNumber(4051, 1); //toolkit
        ObjectManager.register(new GameObject(isSaradomin ? 4382 : 4381, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea()), true);
        player.getPacketSender().sendMessage("You repair the catapult.");
    }

    private static changeCatapultState(task: Task, object: GameObject, state: CatapultState, saradomin: boolean): void {
        ObjectManager.register(object, true);
        if (saradomin) {
            CastleWars.saradominCatapult = state;
        } else {
            CastleWars.zamorakCatapult = state;
        }
        task.stop();
    }


}

export class Team {
    public static readonly ZAMORAK = new Team(CastleWars.ZAMORAK_WAITING_AREA, new Location(2421, 9524), new Boundary(2368, 2376, 3127, 3135, 1))
    public static readonly SARADOMIN = new Team(CastleWars.SARADOMIN_WAITING_AREA, new Location(2381, 9489), new Boundary(2423, 2431, 3072, 3080, 1))
    public static readonly GUTHIX;

    private area: Area;
    private waitingRoom: Location;
    private score: number;
    private players: Player[];

    public respawn_area_bounds: Boundary;

    constructor(area: Area, waitingRoom: Location, respawn_area_bounds: Boundary) {
        this.area = area;
        this.waitingRoom = waitingRoom;
        this.score = 0;
        this.respawn_area_bounds = respawn_area_bounds;
        this.players = [];
    }


    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    /**
 * Method to remove a player from whichever team they're on
 *
 * @param player
 */
    public static removePlayer(player: Player): void {
        if (Team.ZAMORAK.getPlayers().includes(player)) {
            const index = Team.ZAMORAK.getPlayers().indexOf(player);
            if (index > -1) {
                Team.ZAMORAK.getPlayers().splice(index, 1); // Remove o elemento na posição do índice
            }
        }

        if (Team.SARADOMIN.getPlayers().includes(player)) {
            const index = Team.ZAMORAK.getPlayers().indexOf(player);
            if (index > -1) {
                Team.ZAMORAK.getPlayers().splice(index, 1); // Remove o elemento na posição do índice
            }
        }
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getWaitingPlayers(): number {
        return this.area.getPlayers().length;
    }

    public getWaitingRoom(): Location {
        return this.waitingRoom;
    }

    public getScore(): number {
        return this.score;
    }

    public incrementScore(): void {
        this.score++;
    }

    public static resetTeams(): void {
        Team.ZAMORAK.score = 0;
        Team.SARADOMIN.score = 0;

        Team.ZAMORAK.players = [];
        Team.SARADOMIN.players = [];
    }

    /**
 * This method is used to get the teamNumber of a certain player
 *
 * @param player
 * @return
 */
    public static getTeamForPlayer(player: Player): Team | null {
        if (Team.SARADOMIN.getPlayers().includes(player)) {
            return Team.SARADOMIN;
        }

        if (Team.ZAMORAK.getPlayers().includes(player)) {
            return Team.ZAMORAK;
        }

        return null;
    }

}
