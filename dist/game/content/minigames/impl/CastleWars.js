"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = exports.CastleWars = void 0;
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../util/Misc");
var TimerKey_1 = require("../../../../util/timers/TimerKey");
var Barricades_1 = require("../../../entity/impl/npc/impl/Barricades");
var GameObject_1 = require("../../../entity/impl/object/GameObject");
var ObjectManager_1 = require("../../../entity/impl/object/ObjectManager");
var CastleWarsGameArea_1 = require("../../../model/areas/impl/castlewars/CastleWarsGameArea");
var CastleWarsLobbyArea_1 = require("../../../model/areas/impl/castlewars/CastleWarsLobbyArea");
var CastleWarsSaradominWaitingArea_1 = require("../../../model/areas/impl/castlewars/CastleWarsSaradominWaitingArea");
var CastleWarsZamorakWaitingArea_1 = require("../../../model/areas/impl/castlewars/CastleWarsZamorakWaitingArea");
var Boundary_1 = require("../../../model/Boundary");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var ItemStatementDialogue_1 = require("../../../model/dialogues/entries/impl/ItemStatementDialogue");
var StatementDialogue_1 = require("../../../model/dialogues/entries/impl/StatementDialogue");
var Flag_1 = require("../../../model/Flag");
var Item_1 = require("../../../model/Item");
var Projectile_1 = require("../../../model/Projectile");
var Skill_1 = require("../../../model/Skill");
var Task_1 = require("../../../task/Task");
var TaskManager_1 = require("../../../task/TaskManager");
var World_1 = require("../../../World");
var HitDamage_1 = require("../../combat/hit/HitDamage");
var HitMask_1 = require("../../combat/hit/HitMask");
var Food_1 = require("../../Food");
var Location_1 = require("../../../model/Location");
var CountdownTask_1 = require("../../../task/impl/CountdownTask");
var async_lock_1 = require("async-lock");
var ObjectIdentifiers_1 = require("../../../../util/ObjectIdentifiers");
var Animation_1 = require("../../../model/Animation");
var lodash_1 = require("lodash");
var ThreadSafeList = /** @class */ (function () {
    function ThreadSafeList() {
        this.lock = new async_lock_1.ReadWriteLock();
        this.list = [];
    }
    ThreadSafeList.prototype.add = function (item) {
        var _this = this;
        this.lock.writeLock(function () {
            _this.list.push(item);
        });
    };
    ThreadSafeList.prototype.remove = function (item) {
        var _this = this;
        this.lock.writeLock(function () {
            var index = _this.list.indexOf(item);
            if (index > -1) {
                _this.list.splice(index, 1);
            }
        });
    };
    ThreadSafeList.prototype.get = function (index) {
        var _this = this;
        return this.lock.readLock(function () { return _this.list[index]; });
    };
    ThreadSafeList.prototype.getAll = function () {
        var _this = this;
        return this.lock.readLock(function () { return __spreadArray([], __read(_this.list), false); });
    };
    return ThreadSafeList;
}());
var CastleWarsTask = /** @class */ (function (_super) {
    __extends(CastleWarsTask, _super);
    function CastleWarsTask(exeFunction, player) {
        var _this = _super.call(this, 0, true) || this;
        _this.exeFunction = exeFunction;
        return _this;
    }
    CastleWarsTask.prototype.execute = function () {
        if (this.exeFunction()) {
            return;
        }
    };
    return CastleWarsTask;
}(Task_1.Task));
var CatapultState;
(function (CatapultState) {
    CatapultState[CatapultState["FIXED"] = 0] = "FIXED";
    CatapultState[CatapultState["BURNING"] = 1] = "BURNING";
    CatapultState[CatapultState["REPAIR"] = 2] = "REPAIR";
})(CatapultState || (CatapultState = {}));
var CastleWars = exports.CastleWars = /** @class */ (function () {
    function CastleWars() {
    }
    CastleWars.prototype.init = function () {
        /** Saradomin Altar **/
        ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(411, new Location_1.Location(2431, 3076, 1), 10, 1, null), true);
        /** Zamorak Altar **/
        ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(411, new Location_1.Location(2373, 3135, 1), 10, 0, null), true);
    };
    CastleWars.handleItemOnPlayer = function (player, target, item) {
        if (item.getId() !== ItemIdentifiers_1.ItemIdentifiers.BANDAGES) {
            return false;
        }
        if (Team.getTeamForPlayer(player) !== Team.getTeamForPlayer(target)) {
            player.getPacketSender().sendMessage("You don't want to be healing your enemies!");
            return true;
        }
        CastleWars.healWithBandage(target, false);
        return true;
    };
    CastleWars.healWithBandage = function (player, use) {
        /**
         * TODO...
         */
        var bracelet = player.getEquipment().hasCastleWarsBracelet();
        /** Boost increases BY 50% if wearing the bracelet **/
        var maxHP = player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS);
        /** Wiki only says heal. Nothing about run energy for other players **/
        var hp = Math.floor(maxHP * (bracelet ? 1.6 : 1.1));
        /** Heals the target **/
        player.heal(hp);
    };
    CastleWars.isSteppingStones = function (loc) {
        return (loc.getX() >= 2418 && loc.getX() <= 2420 && loc.getY() >= 3122 && loc.getY() <= 3125) || (loc.getX() >= 2377 && loc.getX() <= 2378 && loc.getY() >= 3084 && loc.getY() <= 3088);
    };
    CastleWars.deleteItemsOnEnd = function (player) {
        /** Clears cwars items **/
        CastleWars.ITEMS.forEach(function (i) { return player.getInventory().deleteNumber(i, Number.MAX_SAFE_INTEGER); });
        /** List for Equipment **/
        var equip = [CastleWars.SARA_CAPE, CastleWars.SARA_HOOD, ItemIdentifiers_1.ItemIdentifiers.HOODED_CLOAK_2, CastleWars.ZAMMY_HOOD, CastleWars.SARA_BANNER, CastleWars.ZAMMY_BANNER];
        /** Deletes Equipment **/
        equip.filter(function (i) { return i != null; }).filter(function (p) { return player.getEquipment().contains(p); }).forEach(function (e) { return player.getEquipment().deletes(new Item_1.Item(e)); });
    };
    CastleWars.isGameActive = function () {
        return CastleWars.GAME_END_TASK.isRunning();
    };
    /**
 * Kills any players standing under the cave collapse area.
 *
 * @param cave
 */
    CastleWars.collapseCave = function (cave) {
        CastleWars.GAME_AREA.getPlayers().forEach(function (player) {
            if (player.getLocation().getX() > CastleWars.COLLAPSE_ROCKS[cave][0]
                && player.getLocation().getX() < CastleWars.COLLAPSE_ROCKS[cave][1]
                && player.getLocation().getY() > CastleWars.COLLAPSE_ROCKS[cave][2]
                && player.getLocation().getY() < CastleWars.COLLAPSE_ROCKS[cave][3]) {
                var damage = player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS);
                player.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(damage, HitMask_1.HitMask.RED)]);
            }
        });
    };
    /**
 * Method we use to add someone to the waiting room
 *
 * @param player the player that wants to join
 * @param team   the team!
 */
    CastleWars.addToWaitingRoom = function (player, team) {
        if (player == null) {
            return;
        }
        if (CastleWars.isGameActive()) {
            player.getPacketSender().sendMessage("There's already a Castle Wars going. Please wait a few minutes before trying again.");
            return;
        }
        if (player.getEquipment().getItems()[Equipment_1.Equipment.HEAD_SLOT].isValid()
            || player.getEquipment().getItems()[Equipment_1.Equipment.CAPE_SLOT].isValid()) {
            StatementDialogue_1.StatementDialogue.send(player, "Some items are stopping you from entering the Castle Wars waiting " +
                "area. See the chat for details.");
            player.getPacketSender().sendMessage("You can't wear hats, capes or helms in the arena.");
            return;
        }
        var foodIds = Food_1.Edible.getTypes();
        if (player.getEquipment().containsAny(foodIds)) {
            player.getPacketSender().sendMessage("You may not bring your own consumables inside of Castle Wars.");
            return;
        }
        var saradominPlayerCount = Team.SARADOMIN.getWaitingPlayers();
        var zamorakPlayerCount = Team.ZAMORAK.getWaitingPlayers();
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
                var newTeam = zamorakPlayerCount > saradominPlayerCount ? Team.SARADOMIN : Team.ZAMORAK;
                this.addToWaitingRoom(player, newTeam);
                return;
        }
        /** Uses smart teleport with a radius of 8. **/
        player.smartMove(team.getWaitingRoom(), 8);
    };
    /**
Method to add score to scoring team
@param player the player who scored
@param wearItem banner id!
*/
    CastleWars.returnFlag = function (player, wearItem) {
        var team = Team.getTeamForPlayer(player);
        if (!player || !team) {
            return;
        }
        if (wearItem !== CastleWars.SARA_BANNER && wearItem !== CastleWars.ZAMMY_BANNER) {
            return;
        }
        var objectId = -1;
        var objectTeam = -1;
        switch (team) {
            case Team.SARADOMIN:
                if (wearItem === CastleWars.SARA_BANNER) {
                    CastleWars.setSaraFlag(0);
                    objectId = 4902;
                    objectTeam = 0;
                    player.getPacketSender().sendMessage("Returned the sara flag!");
                }
                else {
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
                }
                else {
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
        player.getEquipment().setItem(Equipment_1.Equipment.WEAPON_SLOT, Equipment_1.Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getInventory().resetItems();
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    /**
Method that will capture a flag when being taken by the enemy team!
@param player the player who returned the flag
*/
    CastleWars.captureFlag = function (player, team) {
        if (player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT) > 0) {
            player.getPacketSender().sendMessage("Please remove your weapon before attempting to capture the flag!");
            return;
        }
        if (team === Team.ZAMORAK && CastleWars.saraFlag === 0) { // sara flag
            CastleWars.setSaraFlag(1);
            CastleWars.addFlag(player, CastleWars.SARA_BANNER_ITEM);
            CastleWars.createHintIcon(player, Team.SARADOMIN);
            CastleWars.changeFlagObject(ObjectIdentifiers_1.ObjectIdentifiers.STANDARD_STAND, 0);
        }
        if (team === Team.SARADOMIN && CastleWars.zammyFlag === 0) {
            CastleWars.setZammyFlag(1);
            CastleWars.addFlag(player, CastleWars.ZAMMY_BANNER_ITEM);
            CastleWars.createHintIcon(player, Team.ZAMORAK);
            CastleWars.changeFlagObject(ObjectIdentifiers_1.ObjectIdentifiers.STANDARD_STAND_2, 1);
        }
    };
    /**
Method that will add the flag to a player's weapon slot
@param player the player who's getting the flag
@param banner the banner Item.
*/
    CastleWars.addFlag = function (player, banner) {
        player.getEquipment().set(Equipment_1.Equipment.WEAPON_SLOT, banner);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    /**
Method we use to handle the flag dropping
@param player the player who dropped the flag/died
@param team the team that the flag belongs to
*/
    CastleWars.dropFlag = function (player, team) {
        var object = -1;
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
        player.getEquipment().setItem(Equipment_1.Equipment.WEAPON_SLOT, Equipment_1.Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        if (CastleWars.isSteppingStones(player.getLocation()) && object !== -1) {
            CastleWars.returnFlag(player, Team.getTeamForPlayer(player) === Team.SARADOMIN ? CastleWars.SARA_BANNER : CastleWars.ZAMMY_BANNER);
            return;
        }
        CastleWars.createFlagHintIcon(player.getLocation());
        var obj = new GameObject_1.GameObject(object, player.getLocation(), 10, 0, null);
        // Spawn the flag object for all players
        CastleWars.spawned_objects.push(obj);
        CastleWars.GAME_AREA.getPlayers().forEach(function (teamPlayer) { return teamPlayer.getPacketSender().sendObject(obj); });
    };
    /**
Method we use to pickup the flag when it was dropped/lost
@param player the player who's picking it up
@param object the flag object
*/
    CastleWars.pickupFlag = function (player, object) {
        switch (object.getId()) {
            case ObjectIdentifiers_1.ObjectIdentifiers.SARADOMIN_STANDARD:
                if (player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT) > 0) {
                    player.getPacketSender().sendMessage("Please remove your weapon before attempting to get the flag again!");
                    return;
                }
                if (CastleWars.saraFlag != 2) {
                    return;
                }
                CastleWars.setSaraFlag(1);
                CastleWars.addFlag(player, CastleWars.SARA_BANNER_ITEM);
                break;
            case ObjectIdentifiers_1.ObjectIdentifiers.ZAMORAK_STANDARD:
                if (player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT) > 0) {
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
        CastleWars.GAME_AREA.getPlayers().forEach(function (teamPlayer) {
            var flag = new GameObject_1.GameObject(object.getId(), object.getLocation(), 10, 0, teamPlayer.getPrivateArea());
            if (CastleWars.spawned_objects.includes(flag)) {
                CastleWars.spawned_objects.splice(CastleWars.spawned_objects.indexOf(flag), 1);
            }
            teamPlayer.getPacketSender().sendPositionalHint(object.getLocation(), -1);
            teamPlayer.getPacketSender().sendObjectRemoval(flag);
        });
    };
    /**
 * Hint icons appear to your team when a enemy steals flag
 *
 * @param player the player who took the flag
 * @param team team of the opponent team. (:
 */
    CastleWars.createHintIcon = function (player, team) {
        CastleWars.GAME_AREA.getPlayers().forEach(function (teamPlayer) {
            teamPlayer.getPacketSender().sendEntityHintRemoval(true);
            if (Team.getTeamForPlayer(teamPlayer) === team) {
                teamPlayer.getPacketSender().sendEntityHint(player);
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
            }
        });
    };
    /**
Hint icons appear to your team when a enemy steals flag
@param location the location of the flag hint
*/
    CastleWars.createFlagHintIcon = function (location) {
        CastleWars.GAME_AREA.getPlayers().forEach(function (teamPlayer) { return teamPlayer.getPacketSender().sendPositionalHint(location, 2); });
    };
    CastleWars.removeHintIcon = function () {
        CastleWars.GAME_AREA.getPlayers().forEach(function (p) { return p.getPacketSender().sendEntityHintRemoval(true); });
    };
    /**
The leaving method will be used on click object or log out
@param player player who wants to leave
*/
    CastleWars.leaveWaitingRoom = function (player) {
        if (player == null) {
            return;
        }
        player.getPacketSender().sendEntityHintRemoval(true);
        CastleWars.deleteGameItems(player);
    };
    /*
Method that will start the game when there's enough players.
*/
    CastleWars.startGame = function () {
        CastleWars.SARADOMIN_WAITING_AREA.getPlayers().forEach(function (player) {
            player.resetCastlewarsIdleTime();
            Team.SARADOMIN.addPlayer(player);
            player.getPacketSender().sendWalkableInterface(-1);
            player.moveTo(new Location_1.Location(CastleWars.GAME_ROOM[0][0] + Misc_1.Misc.randoms(3), CastleWars.GAME_ROOM[0][1] - Misc_1.Misc.randoms(3), 1));
        });
        CastleWars.ZAMORAK_WAITING_AREA.getPlayers().forEach(function (player) {
            player.resetCastlewarsIdleTime();
            Team.ZAMORAK.addPlayer(player);
            player.getPacketSender().sendWalkableInterface(-1);
            player.moveTo(new Location_1.Location(CastleWars.GAME_ROOM[1][0] + Misc_1.Misc.randoms(3), CastleWars.GAME_ROOM[1][1] - Misc_1.Misc.randoms(3), 1));
        });
        // Schedule the game ending
        TaskManager_1.TaskManager.submit(CastleWars.GAME_END_TASK);
    };
    /*
Method we use to end an ongoing cw game.
*/
    CastleWars.endGame = function () {
        CastleWars.GAME_AREA.getPlayers().forEach(function (player) {
            player.getPacketSender().sendEntityHintRemoval(true);
            var scores = [0, 0];
            var saradominWon = scores[0] > scores[1];
            if (scores[0] === scores[1]) {
                player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.CASTLE_WARS_TICKET, 1);
                player.getPacketSender().sendMessage("Tie game! You earn 1 ticket!");
            }
            else if ((saradominWon && Team.SARADOMIN.getPlayers().includes(player))
                || (!saradominWon && Team.ZAMORAK.getPlayers().includes(player))) {
                player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.CASTLE_WARS_TICKET, 2);
                player.getPacketSender().sendMessage("You won the game. You received 2 Castle Wars Tickets!");
                ItemStatementDialogue_1.ItemStatementDialogue.send(player, "", ["You won!", "You captured the enemy's standard" + CastleWars.getScore(Team.getTeamForPlayer(player)) + " times.", "Enemies killed: TODO."], ItemIdentifiers_1.ItemIdentifiers.CASTLE_WARS_TICKET, 200);
            }
            else {
                ItemStatementDialogue_1.ItemStatementDialogue.send(player, "", ["You lost!", "You captured the enemy's standard" + CastleWars.getScore(Team.getTeamForPlayer(player)) + " times.", "Enemies killed: TODO."], ItemIdentifiers_1.ItemIdentifiers.CASTLE_WARS_TICKET, 200);
                player.getPacketSender().sendMessage("You lost the game. You received no tickets!");
            }
            // Teleport player after checking scores and adding tickets.
            player.moveTo(new Location_1.Location(2440 + Misc_1.Misc.randoms(3), 3089 - Misc_1.Misc.randoms(3), 0));
        });
        CastleWars.spawned_objects.forEach(function (o) { if (o != null)
            ObjectManager_1.ObjectManager.deregister(o, true); });
        CastleWars.spawned_objects.splice(0);
        // Reset game after processing players.
        CastleWars.resetGame();
    };
    CastleWars.getScore = function (team) {
        return team.getScore();
    };
    /**
     * reset the game variables
     */
    CastleWars.resetGame = function () {
        CastleWars.changeFlagObject(4902, 0);
        CastleWars.changeFlagObject(4903, 1);
        CastleWars.setSaraFlag(0);
        CastleWars.setZammyFlag(0);
        TaskManager_1.TaskManager.cancelTasks([CastleWars.START_GAME_TASK_KEY, CastleWars.END_GAME_TASK_KEY]);
        Team.resetTeams();
    };
    /**
 * This method will delete all items received in game. Easy to add items to
 * the array. (:
 *
 * @param player the player who want the game items deleted from.
 */
    CastleWars.deleteGameItems = function (player) {
        var e_1, _a;
        switch (player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT)) {
            case CastleWars.SARA_BANNER:
            case CastleWars.ZAMMY_BANNER:
                player.getEquipment().setItem(Equipment_1.Equipment.WEAPON_SLOT, Equipment_1.Equipment.NO_ITEM);
                player.getEquipment().refreshItems();
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
                break;
        }
        switch (player.getEquipment().getSlot(Equipment_1.Equipment.CAPE_SLOT)) {
            case ItemIdentifiers_1.ItemIdentifiers.HOODED_CLOAK_2:
            case CastleWars.SARA_CAPE:
                player.getEquipment().setItem(Equipment_1.Equipment.CAPE_SLOT, Equipment_1.Equipment.NO_ITEM);
                player.getEquipment().refreshItems();
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
                break;
        }
        try {
            for (var _b = __values(CastleWars.ITEMS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (player.getInventory().contains(item)) {
                    player.getInventory().deletes(new Item_1.Item(item, player.getInventory().getAmount(item)));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
 * Method to make sara flag change status 0 = safe, 1 = taken, 2 = dropped
 *
 * @param status
 */
    CastleWars.setSaraFlag = function (status) {
        CastleWars.saraFlag = status;
    };
    /**
     * Method to make zammy flag change status 0 = safe, 1 = taken, 2 = dropped
     *
     * @param status
     */
    CastleWars.setZammyFlag = function (status) {
        CastleWars.zammyFlag = status;
    };
    /**
 * Method we use for the changing the object of the flag stands when
 * capturing/returning flag
 *
 * @param objectId the object
 * @param team     the team of the player
 */
    CastleWars.changeFlagObject = function (objectId, team) {
        var gameObject = new GameObject_1.GameObject(objectId, new Location_1.Location(CastleWars.FLAG_STANDS[team][0], CastleWars.FLAG_STANDS[team][1], 3), 10, 2, null);
        ObjectManager_1.ObjectManager.register(gameObject, true);
        CastleWars.spawned_objects.push(gameObject);
    };
    CastleWars.prototype.firstClickObject = function (player, object) {
        var x = object.getLocation().getX();
        var y = object.getLocation().getY();
        var loc = object.getLocation();
        var id = object.getId();
        var type = object.getType();
        var face = object.getFace();
        var playerX = player.getLocation().getX();
        var playerY = player.getLocation().getY();
        var playerZ = player.getLocation().getZ();
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
                        player.moveTo(new Location_1.Location(2426, 3081, playerZ));
                    }
                    else if (playerY == 3081) {
                        player.moveTo(new Location_1.Location(2426, 3080, playerZ));
                    }
                }
                else if (x == 2422) {
                    if (playerX == 2422) {
                        player.moveTo(new Location_1.Location(2423, 3076, playerZ));
                    }
                    else if (playerX == 2423) {
                        player.moveTo(new Location_1.Location(2422, 3076, playerZ));
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
                        player.moveTo(new Location_1.Location(2373, 3127, 1));
                    }
                    else if (playerY == 3127) {
                        player.moveTo(new Location_1.Location(2373, 3126, 1));
                    }
                }
                else if (x == 2377 && y == 3131) {
                    if (playerX == 2376) {
                        player.moveTo(new Location_1.Location(2377, 3131, 1));
                    }
                    else if (playerX == 2377) {
                        player.moveTo(new Location_1.Location(2376, 3131, 1));
                    }
                }
                return true;
            case 4417:
                if (x == 2428 && y == 3081 && playerZ == 1) {
                    player.moveTo(new Location_1.Location(2430, 3080, 2));
                }
                if (x == 2425 && y == 3074 && playerZ == 2) {
                    player.moveTo(new Location_1.Location(2426, 3074, 3));
                }
                if (x == 2419 && y == 3078 && playerZ == 0) {
                    player.moveTo(new Location_1.Location(2420, 3080, 1));
                }
                return true;
            case 4415:
                if (x === 2419 && y === 3080 && playerZ === 1) {
                    player.moveTo(new Location_1.Location(2419, 3077, 0));
                }
                if (x === 2430 && y === 3081 && playerZ === 2) {
                    player.moveTo(new Location_1.Location(2427, 3081, 1));
                }
                if (x === 2425 && y === 3074 && playerZ === 3) {
                    player.moveTo(new Location_1.Location(2425, 3077, 2));
                }
                if (x === 2374 && y === 3133 && playerZ === 3) {
                    player.moveTo(new Location_1.Location(2374, 3130, 2));
                }
                if (x === 2369 && y === 3126 && playerZ === 2) {
                    player.moveTo(new Location_1.Location(2372, 3126, 1));
                }
                if (x === 2380 && y === 3127 && playerZ === 1) {
                    player.moveTo(new Location_1.Location(2380, 3130, 0));
                }
                return true;
            case 4411: // castle wars jumping stones
                if (x === playerX && y === playerY) {
                    player.getPacketSender().sendMessage("You are standing on the rock you clicked.");
                }
                else if (x > playerX && y === playerY) {
                    player.getMovementQueue().walkStep(1, 0);
                }
                else if (x < playerX && y === playerY) {
                    player.getMovementQueue().walkStep(-1, 0);
                }
                else if (y > playerY && x === playerX) {
                    player.getMovementQueue().walkStep(0, 1);
                }
                else if (y < playerY && x === playerX) {
                    player.getMovementQueue().walkStep(0, -1);
                }
                else {
                    player.getPacketSender().sendMessage("Can't reach that.");
                }
                return true;
            case 4419:
                if (x === 2417 && y === 3074 && playerZ === 0) {
                    if (playerX === 2416) {
                        player.moveTo(new Location_1.Location(2417, 3077, 0));
                    }
                    else {
                        player.moveTo(new Location_1.Location(2416, 3074, 0));
                    }
                }
                return true;
            case 4911:
                if (x === 2421 && y === 3073 && playerZ === 1) {
                    player.moveTo(new Location_1.Location(2421, 3074, 0));
                }
                if (x === 2378 && y === 3134 && playerZ === 1) {
                    player.moveTo(new Location_1.Location(2378, 3133, 0));
                }
                return true;
            case 1747:
                if (x === 2421 && y === 3073 && playerZ === 0) {
                    player.moveTo(new Location_1.Location(2421, 3074, 1));
                }
                if (x === 2378 && y === 3134 && playerZ === 0) {
                    player.moveTo(new Location_1.Location(2378, 3133, 1));
                }
                return true;
            case 4912:
                if (x == 2430 && y == 3082 && playerZ == 0) {
                    player.moveTo(new Location_1.Location(playerX, playerY + 6400, 0));
                }
                if (x == 2369 && y == 3125 && playerZ == 0) {
                    player.moveTo(new Location_1.Location(playerX, playerY + 6400, 0));
                }
                return true;
            case 17387: // under ground ladders to top
                if (x == 2369 && y == 9525) {
                    player.moveTo(new Location_1.Location(2369, 3126, 0));
                }
                else if (x == 2430 && y == 9482) {
                    player.moveTo(new Location_1.Location(2430, 3081, 0));
                }
                else if (x == 2400 && y == 9508) { // middle north
                    player.moveTo(new Location_1.Location(2400, 3107, 0));
                }
                else if (x == 2399 && y == 9499) { // middle south
                    player.moveTo(new Location_1.Location(2399, 3100, 0));
                }
                return true;
            case 1757:
                if (x == 2430 && y == 9482) {
                    player.moveTo(new Location_1.Location(2430, 3081, 0));
                }
                else if (playerX == 2533) {
                    player.moveTo(new Location_1.Location(2532, 3155, 0));
                }
                else {
                    player.moveTo(new Location_1.Location(2369, 3126, 0));
                }
                return true;
            case 4418:
                if (x == 2380 && y == 3127 && playerZ == 0) {
                    player.moveTo(new Location_1.Location(2379, 3127, 1));
                }
                if (x == 2369 && y == 3126 && playerZ == 1) {
                    player.moveTo(new Location_1.Location(2369, 3127, 2));
                }
                if (x == 2374 && y == 3131 && playerZ == 2) {
                    player.moveTo(new Location_1.Location(2373, 3133, 3));
                }
                return true;
            case 4420:
                if (x == 2382 && y == 3131 && playerZ == 0) {
                    if (playerX >= 2383 && playerX <= 2385) {
                        player.moveTo(new Location_1.Location(2382, 3130, 0));
                    }
                    else {
                        player.moveTo(new Location_1.Location(2383, 3133, 0));
                    }
                }
                return true;
            case 1568:
                if (x == 2399 && y == 3099) {
                    player.moveTo(new Location_1.Location(2399, 9500, 0));
                }
                else {
                    player.moveTo(new Location_1.Location(2400, 9507, 0));
                }
                // add missing return statement here
                return true;
            case 6281:
                player.moveTo(new Location_1.Location(2370, 3132, 2));
                return true;
            case 6280:
                player.moveTo(new Location_1.Location(2429, 3075, 2));
                return true;
            case 4458:
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.BANDAGES, 1);
                    player.getPacketSender().sendMessage("You get some bandages.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4461: // barricades
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(Barricades_1.Barricades.ITEM_ID, 1);
                    player.getPacketSender().sendMessage("You get a barricade.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4463: // explosive potion!
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.EXPLOSIVE_POTION, 1);
                    player.getPacketSender().sendMessage("You get an explosive potion!");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4464: // pickaxe table
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.BRONZE_PICKAXE, 1);
                    player.getPacketSender().sendMessage("You get a bronze pickaxe for mining.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4459: // tinderbox table
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX, 1);
                    player.getPacketSender().sendMessage("You get a Tinderbox.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4462:
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.ROPE, 1);
                    player.getPacketSender().sendMessage("You get some rope.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
                }
                return true;
            case 4460:
                if (!player.getTimers().has(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM)) {
                    player.performAnimation(CastleWars.TAKE_BANDAGES_ANIM);
                    player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.ROCK_5, 1);
                    player.getPacketSender().sendMessage("You get a rock.");
                    player.getTimers().extendOrRegister(TimerKey_1.TimerKey.CASTLEWARS_TAKE_ITEM, 2);
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
    };
    /**
Processes all actions to keep the minigame running smoothly.
*/
    CastleWars.prototype.process = function () {
    };
    CastleWars.handleCatapult = function (player) {
        if (!player.getInventory().contains(4043)) {
            player.getPacketSender().sendMessage("You need a rock to launch from the catapult!");
            return;
        }
        CastleWars.resetCatapult(player);
        player.getPacketSender().sendInterface(CastleWars.CATAPULT_INTERFACE);
    };
    CastleWars.prototype.handleButtonClick = function (player, button) {
        var _a, _b, _c, _d;
        if (player.getInterfaceId() !== CastleWars.CATAPULT_INTERFACE) {
            return false;
        }
        var x = (_a = player.getAttribute("catapultX")) !== null && _a !== void 0 ? _a : 0;
        var y = (_b = player.getAttribute("catapultY")) !== null && _b !== void 0 ? _b : 0;
        var saradomin = Team.getTeamForPlayer(player) === Team.SARADOMIN;
        player.getPacketSender().sendInterfaceComponentMoval(1, 0, 11332);
        if (button === 11321) { //Up Y
            if (saradomin && y < 30) {
                player.setAttribute("catapultY", y + 1);
            }
            else if (y > 0) {
                player.setAttribute("catapultY", y - 1);
            }
        }
        if (button === 11322) {
            if (saradomin && y > 0) { //down Y
                player.setAttribute("catapultY", y - 1);
            }
            else if (y < 30) {
                player.setAttribute("catapultY", y + 1);
            }
        }
        if (button === 11323) {
            if (saradomin && x > 0) { //right X
                player.setAttribute("catapultX", x - 1);
            }
            else if (x < 30) {
                player.setAttribute("catapultX", x + 1);
            }
        }
        if (button === 11324) { //left X
            if (saradomin && x < 30) {
                player.setAttribute("catapultX", x + 1);
            }
            else if (x > 0) {
                player.setAttribute("catapultX", x - 1);
            }
        }
        var newX = (_c = player.getAttribute("catapultX")) !== null && _c !== void 0 ? _c : 0;
        var newY = (_d = player.getAttribute("catapultY")) !== null && _d !== void 0 ? _d : 0;
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
            var startX = saradomin ? CastleWars.saradomin_catapult_start.getX() : CastleWars.zamorak_catapult_start.getX();
            var startY = saradomin ? CastleWars.saradomin_catapult_start.getY() : CastleWars.zamorak_catapult_start.getY();
            var destination_1 = new Location_1.Location(saradomin ? (x >= 0 ? startX - x : startX + x) : (x >= 0 ? startX + x : startX - x), saradomin ? (y >= 0 ? startY + y : startY - y) : (y >= 0 ? startY - y : startY + y));
            var catapult = World_1.World.findCacheObject(player, saradomin ? 4382 : 4381, saradomin ? CastleWars.saradomin_catapult_location : CastleWars.zamorak_catapult_location);
            if (catapult != null) {
                catapult.performAnimation(new Animation_1.Animation(443));
            }
            new Projectile_1.Projectile(saradomin ? CastleWars.saradomin_catapult_location : CastleWars.zamorak_catapult_location, destination_1, null, 304, 30, 100, 75, 75, player.getPrivateArea())
                .sendProjectile();
            TaskManager_1.TaskManager.submit(new CastleWarsTask(function () {
                var ticks = 0;
                var task = setInterval(function () {
                    var e_2, _a;
                    ticks++;
                    if (ticks == 4) {
                        World_1.World.sendLocalGraphics(303, destination_1);
                    }
                    if (ticks == 6) {
                        var players = [];
                        try {
                            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var player_1 = _c.value;
                                if (player_1 !== null && player_1.getLocation() !== null && player_1.getLocation().isWithinDistance(destination_1, 5)) {
                                    players.push(player_1);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (Array.isArray(players)) {
                            players.forEach(function (p) { return p.getCombat().getHitQueue().addPendingDamage(new HitDamage_1.HitDamage(Misc_1.Misc.random(5, 15), HitMask_1.HitMask.RED)); });
                        }
                        World_1.World.sendLocalGraphics(305, destination_1);
                        clearInterval(task);
                    }
                }, 1);
            }, player));
        }
        return true;
    };
    CastleWars.resetCatapult = function (player) {
        for (var i = 11317; i < 11321; i++) {
            player.getPacketSender().sendWidgetModel(i, 4863);
        }
        player.setAttribute("catapultX", 0);
        player.setAttribute("catapultY", 0);
        var team = Team.getTeamForPlayer(player);
        if (team == null) {
            console.error("error setting red cross for ".concat(player.getUsername(), " they aren't on a team!"));
            return;
        }
        var sara = team === Team.SARADOMIN;
        player.getPacketSender().sendInterfaceComponentMoval(sara ? 90 : 0, sara ? 90 : 0, 11332);
    };
    /**
large doors - 4023-4024 -- 4025-4026
@param player
@param item
@param object
@return
*/
    CastleWars.handleItemOnObject = function (player, item, object) {
        var objectId = object.getId();
        var itemId = item.getId();
        var saradomin = Team.getTeamForPlayer(player) === Team.SARADOMIN;
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
                }
                else {
                    if (CastleWars.zamorakCatapult === CatapultState.FIXED) {
                        player.getPacketSender().sendMessage("The fire has already been extinguished.");
                        return true;
                    }
                }
                player.getInventory().deleteNumber(1929, 1); // bucket of water
                player.getInventory().addItem(new Item_1.Item(1925, 1)); // empty bucket
                if (saradomin) {
                    CastleWars.saradominCatapult = CatapultState.FIXED;
                }
                else {
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
                }
                else {
                    if (CastleWars.zamorakCatapult === CatapultState.BURNING) {
                        player.getPacketSender().sendMessage("The catapult is already burning!");
                        return true;
                    }
                }
                if (itemId === 4045)
                    player.getInventory().deleteNumber(4045, 1);
                //4904 zamorak, 4905 saradomin
                var onFire = new GameObject_1.GameObject(saradomin ? 4904 : 4905, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());
                var burnt_1 = new GameObject_1.GameObject(saradomin ? 4385 : 4386, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());
                var fixed_1 = new GameObject_1.GameObject(object.getId(), object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea());
                if (saradomin) {
                    CastleWars.saradominCatapult = CatapultState.BURNING;
                }
                else {
                    CastleWars.zamorakCatapult = CatapultState.BURNING;
                }
                ObjectManager_1.ObjectManager.register(onFire, true);
                onFire.performAnimation(new Animation_1.Animation(1431));
                //4385 zamorak, 4386 saradomin
                var task_1 = new CastleWarsTask(function () {
                    var ticks = 0;
                    ticks++;
                    if (saradomin) {
                        if (CastleWars.saradominCatapult != CatapultState.BURNING) {
                            CastleWars.changeCatapultState(task_1, fixed_1, CatapultState.FIXED, true);
                            return;
                        }
                        if (ticks == 16) { //4385, 4386
                            CastleWars.changeCatapultState(task_1, burnt_1, CatapultState.REPAIR, true);
                        }
                    }
                    else {
                        if (CastleWars.zamorakCatapult != CatapultState.BURNING) {
                            CastleWars.changeCatapultState(task_1, fixed_1, CatapultState.FIXED, false);
                            return;
                        }
                        if (ticks == 16) { //4385, 4386
                            CastleWars.changeCatapultState(task_1, burnt_1, CatapultState.REPAIR, false);
                        }
                    }
                }, player);
                TaskManager_1.TaskManager.submit(task_1);
                return true;
            }
            return false;
        }
        return false;
    };
    CastleWars.repairCatapult = function (player, object) {
        if (!player.getInventory().contains(4051)) {
            player.getPacketSender().sendMessage("You need a toolkit to repair the catapult.");
            return;
        }
        var isSaradomin = Team.getTeamForPlayer(player) === Team.SARADOMIN;
        if (isSaradomin) {
            if (CastleWars.saradominCatapult !== CatapultState.REPAIR) {
                player.getPacketSender().sendMessage("The catapult has already been repaired");
                return;
            }
            CastleWars.saradominCatapult = CatapultState.FIXED;
        }
        else {
            if (CastleWars.zamorakCatapult !== CatapultState.REPAIR) {
                player.getPacketSender().sendMessage("The catapult has already been repaired");
                return;
            }
            CastleWars.zamorakCatapult = CatapultState.FIXED;
        }
        player.getInventory().deleteNumber(4051, 1); //toolkit
        ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(isSaradomin ? 4382 : 4381, object.getLocation(), object.getType(), object.getFace(), object.getPrivateArea()), true);
        player.getPacketSender().sendMessage("You repair the catapult.");
    };
    CastleWars.changeCatapultState = function (task, object, state, saradomin) {
        ObjectManager_1.ObjectManager.register(object, true);
        if (saradomin) {
            CastleWars.saradominCatapult = state;
        }
        else {
            CastleWars.zamorakCatapult = state;
        }
        task.stop();
    };
    /**
 * Area instances
 * <p>
 * We instantiate these here as we need to reference them directly.
 */
    CastleWars.SARADOMIN_WAITING_AREA = new CastleWarsSaradominWaitingArea_1.CastleWarsSaradominWaitingArea();
    CastleWars.ZAMORAK_WAITING_AREA = new CastleWarsZamorakWaitingArea_1.CastleWarsZamorakWaitingArea();
    CastleWars.GAME_AREA = new CastleWarsGameArea_1.CastleWarsGameArea();
    CastleWars.LOBBY_AREA = new CastleWarsLobbyArea_1.CastleWarsLobbyArea();
    CastleWars.spawned_objects = (0, lodash_1.cloneDeep)([]);
    /**
 * The key used to schedule the start game CountdownTask.
 */
    CastleWars.START_GAME_TASK_KEY = "CW_START_GAME";
    /**
     * The task that gets scheduled to start the game.
     */
    CastleWars.START_GAME_TASK = new CountdownTask_1.CountdownTask(CastleWars.START_GAME_TASK_KEY, Misc_1.Misc.getTicks(10), CastleWars.startGame);
    /**
     * The key used to schedule the end game CountdownTask.
     */
    CastleWars.END_GAME_TASK_KEY = "CW_END_GAME";
    /**
     * The task that gets scheduled to end the game.
     */
    CastleWars.GAME_END_TASK = new CountdownTask_1.CountdownTask(CastleWars.END_GAME_TASK_KEY, Misc_1.Misc.getTicks(1200), CastleWars.endGame);
    /**
 * The coordinates for the gameRoom both sara/zammy
 */
    CastleWars.GAME_ROOM = [[2426, 3076],
        [2372, 3131], // zammy
    ];
    CastleWars.FLAG_STANDS = [[2429, 3074],
        [2370, 3133], // zammy
    ];
    /*
Scores for saradomin and zamorak!
/
const scores: [number, number] = [0, 0];
/
Booleans to check if a team's flag is safe
*/
    CastleWars.zammyFlag = 0;
    CastleWars.saraFlag = 0;
    /*
    
    Zamorak and saradomin banner/capes item ID's
    */
    CastleWars.SARA_BANNER = 4037;
    CastleWars.SARA_BANNER_ITEM = new Item_1.Item(CastleWars.SARA_BANNER);
    CastleWars.ZAMMY_BANNER = 4039;
    CastleWars.ZAMMY_BANNER_ITEM = new Item_1.Item(CastleWars.ZAMMY_BANNER);
    CastleWars.SARA_CAPE = 4041;
    CastleWars.ZAMORAK_CAPE = new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HOODED_CLOAK_2);
    CastleWars.SARADOMIN_CAPE = new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HOODED_CLOAK);
    CastleWars.SARA_HOOD = 4513;
    CastleWars.ZAMMY_HOOD = 4515;
    CastleWars.MANUAL = new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_MANUAL);
    CastleWars.TAKE_BANDAGES_ANIM = new Animation_1.Animation(881);
    CastleWars.ITEMS = [ItemIdentifiers_1.ItemIdentifiers.BANDAGES, ItemIdentifiers_1.ItemIdentifiers.BRONZE_PICKAXE, ItemIdentifiers_1.ItemIdentifiers.EXPLOSIVE_POTION, Barricades_1.Barricades.ITEM_ID, ItemIdentifiers_1.ItemIdentifiers.HOODED_CLOAK_2, CastleWars.SARA_CAPE, CastleWars.SARA_BANNER, CastleWars.ZAMMY_BANNER, ItemIdentifiers_1.ItemIdentifiers.ROCK_5];
    CastleWars.CATAPULT_INTERFACE = 11169;
    CastleWars.COLLAPSE_ROCKS = [
        [2399, 2402, 9511, 9514],
        [2390, 2393, 9500, 9503],
        [2400, 2403, 9493, 9496],
        [2408, 2411, 9502, 9505] // west X Y coords zammy 3
    ];
    CastleWars.LOBBY_TELEPORT = new Location_1.Location(2440, 3089, 0);
    CastleWars.TEAM_GUTHIX = 3;
    CastleWars.saradominCatapult = CatapultState.FIXED;
    CastleWars.zamorakCatapult = CatapultState.FIXED;
    CastleWars.saradomin_catapult_start = new Location_1.Location(2411, 3092, 0);
    CastleWars.zamorak_catapult_start = new Location_1.Location(2388, 3115, 0);
    CastleWars.saradomin_catapult_location = new Location_1.Location(2413, 3088, 0);
    CastleWars.zamorak_catapult_location = new Location_1.Location(2384, 3117, 0);
    return CastleWars;
}());
var Team = exports.Team = /** @class */ (function () {
    function Team(area, waitingRoom, respawn_area_bounds) {
        this.area = area;
        this.waitingRoom = waitingRoom;
        this.score = 0;
        this.respawn_area_bounds = respawn_area_bounds;
        this.players = [];
    }
    Team.prototype.addPlayer = function (player) {
        this.players.push(player);
    };
    /**
 * Method to remove a player from whichever team they're on
 *
 * @param player
 */
    Team.removePlayer = function (player) {
        if (Team.ZAMORAK.getPlayers().includes(player)) {
            var index = Team.ZAMORAK.getPlayers().indexOf(player);
            if (index > -1) {
                Team.ZAMORAK.getPlayers().splice(index, 1); // Remove o elemento na posição do índice
            }
        }
        if (Team.SARADOMIN.getPlayers().includes(player)) {
            var index = Team.ZAMORAK.getPlayers().indexOf(player);
            if (index > -1) {
                Team.ZAMORAK.getPlayers().splice(index, 1); // Remove o elemento na posição do índice
            }
        }
    };
    Team.prototype.getPlayers = function () {
        return this.players;
    };
    Team.prototype.getWaitingPlayers = function () {
        return this.area.getPlayers().length;
    };
    Team.prototype.getWaitingRoom = function () {
        return this.waitingRoom;
    };
    Team.prototype.getScore = function () {
        return this.score;
    };
    Team.prototype.incrementScore = function () {
        this.score++;
    };
    Team.resetTeams = function () {
        Team.ZAMORAK.score = 0;
        Team.SARADOMIN.score = 0;
        Team.ZAMORAK.players = [];
        Team.SARADOMIN.players = [];
    };
    /**
 * This method is used to get the teamNumber of a certain player
 *
 * @param player
 * @return
 */
    Team.getTeamForPlayer = function (player) {
        if (Team.SARADOMIN.getPlayers().includes(player)) {
            return Team.SARADOMIN;
        }
        if (Team.ZAMORAK.getPlayers().includes(player)) {
            return Team.ZAMORAK;
        }
        return null;
    };
    Team.ZAMORAK = new Team(CastleWars.ZAMORAK_WAITING_AREA, new Location_1.Location(2421, 9524), new Boundary_1.Boundary(2368, 2376, 3127, 3135, 1));
    Team.SARADOMIN = new Team(CastleWars.SARADOMIN_WAITING_AREA, new Location_1.Location(2381, 9489), new Boundary_1.Boundary(2423, 2431, 3072, 3080, 1));
    return Team;
}());
//# sourceMappingURL=CastleWars.js.map