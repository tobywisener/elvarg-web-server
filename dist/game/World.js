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
exports.GameTask = exports.World = void 0;
var Server_1 = require("../Server");
var MinigameHandler_1 = require("./content/minigames/MinigameHandler");
var MobileList_1 = require("../game/entity/impl/MobileList");
var ItemOnGroundManager_1 = require("./entity/impl/grounditem/ItemOnGroundManager");
var MapObjects_1 = require("./entity/impl/object/MapObjects");
var NPCUpdating_1 = require("../game/entity/updating/NPCUpdating");
var PlayerUpdating_1 = require("./entity/updating/PlayerUpdating");
var GameSyncExecutor_1 = require("./entity/updating/sync/GameSyncExecutor");
var Graphic_1 = require("./model/Graphic");
var TaskManager_1 = require("./task/TaskManager");
var GameConstants_1 = require("../game/GameConstants");
var Misc_1 = require("../util/Misc");
var immer_1 = require("immer");
var GameSyncTask_1 = require("./entity/updating/sync/GameSyncTask");
var World = exports.World = /** @class */ (function () {
    function World() {
        this.players = new MobileList_1.MobileList(0);
        this.npcs = new MobileList_1.MobileList(0);
        this.playerBots = new Map();
        this.items = new Array();
        this.objects = new Array();
        this.removedObjects = new Set();
        this.addPlayerQueue = new Array();
        this.removePlayerQueue = new Array();
        this.addNPCQueue = new Array();
        this.removeNPCQueue = new Array();
    }
    World.getPlayerById = function (id) {
        return this.playerArray.find(function (player) { return player.id === id; });
    };
    World.getPlayerByName = function (username) {
        return this.players.search(function (p) { return p !== null && p.getUsername() === Misc_1.Misc.formatText(username); });
    };
    /**
    * Broadcasts a message to all players in the game.
    *
    * @param message
    *            The message to broadcast.
    */
    World.sendMessage = function (message) {
        World.players.forEach(function (p) { return p.getPacketSender().sendMessage(message); });
    };
    /**
    * Broadcasts a message to all staff-members in the game.
    *
    * @param message
    *            The message to broadcast.
    */
    World.sendStaffMessage = function (message) {
        var players = [];
        World.players.forEach(function (p) {
            if (p && p.isStaff()) {
                players.push(p);
            }
        });
        players.forEach(function (p) { return p.getPacketSender().sendMessage(message); });
    };
    /**
    * Saves all players in the game.
    */
    World.savePlayers = function () {
        this.players.forEach(function (player) { return GameConstants_1.GameConstants.PLAYER_PERSISTENCE.save(player); });
    };
    World.getPlayers = function () {
        return this.players;
    };
    World.getNpcs = function () {
        return this.npcs;
    };
    World.getPlayerBots = function () {
        return this.playerBots;
    };
    World.getItems = function () {
        return this.items;
    };
    World.getObjects = function () {
        return this.objects;
    };
    World.getRemovedObjects = function () {
        return this.removedObjects;
    };
    World.getAddPlayerQueue = function () {
        return this.addPlayerQueue;
    };
    World.getRemovePlayerQueue = function () {
        return this.removePlayerQueue;
    };
    World.getAddNPCQueue = function () {
        return this.addNPCQueue;
    };
    World.getRemoveNPCQueue = function () {
        return this.removeNPCQueue;
    };
    World.prototype.findSpawnedObject = function (id, loc) {
        return World.objects.find(function (i) { return i.getId() === id && i.getLocation().equals(loc); });
    };
    World.findCacheObject = function (player, id, loc) {
        return MapObjects_1.MapObjects.getPrivateArea(player, id, loc);
    };
    World.sendLocalGraphics = function (id, position) {
        var e_1, _a;
        try {
            for (var _b = __values(World.players), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                if (player && player.getLocation().isWithinDistance(position, 32)) {
                    player.getPacketSender().sendGraphic(new Graphic_1.Graphic(id), position);
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
    World.prototype.getPlayerByName = function (username) {
        return World.players.search(function (p) { return p != null && p.getUsername().toLowerCase() === username.toLowerCase(); });
    };
    World.prototype.sendMessage = function (message) {
        World.players.forEach(function (p) { return p.getPacketSender().sendMessage(message); });
    };
    World.prototype.sendStaffMessage = function (message) {
        World.players.forEach(function (p) {
            if (p && p !== null && p.isStaff()) {
                p.getPacketSender().sendMessage(message);
            }
        });
    };
    World.prototype.savePlayers = function () {
        World.players.forEach(GameConstants_1.GameConstants.PLAYER_PERSISTENCE.save);
    };
    World.process = function () {
        // Process all active {@link Task}s..
        TaskManager_1.TaskManager.process();
        // Process all minigames
        MinigameHandler_1.MinigameHandler.process();
        // Process all ground items..
        ItemOnGroundManager_1.ItemOnGroundManager.process();
        // Add pending players..
        for (var i = 0; i < GameConstants_1.GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            var player = World.addPlayerQueue.shift();
            if (!player)
                break;
            // Kick any copies before adding the new player
            var existingPlayer = World.getPlayerByName(player.username);
            if (existingPlayer) {
                existingPlayer.requestLogout();
            }
            World.players.add(player);
        }
        // Deregister queued players.
        var amount = 0;
        World.removePlayerQueue.forEach(function (player, index) {
            if (!player || amount >= GameConstants_1.GameConstants.QUEUED_LOOP_THRESHOLD) {
                return;
            }
            if (player.canLogout() || player.forcedLogoutTimer.finished() || Server_1.Server.isUpdating()) {
                World.players.remove(player);
                World.removePlayerQueue.splice(index, 1);
            }
            amount++;
        });
        // Add pending Npcs..
        for (var i = 0; i < GameConstants_1.GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            var npc = World.addNPCQueue.shift();
            if (!npc)
                break;
            World.npcs.add(npc);
        }
        // Removing pending npcs..
        for (var i = 0; i < GameConstants_1.GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            var npc = World.removeNPCQueue.shift();
            if (!npc)
                break;
            World.npcs.remove(npc);
        }
        // Handle synchronization tasks.
        World.executor.sync(new GameTask(true, function (index) {
            var player = World.players.get(index);
            try {
                player.process();
            }
            catch (e) {
                console.error(e);
                player.requestLogout();
            }
        }, false));
        World.executor.sync(new GameTask(false, function (index) {
            var npc = World.npcs.get(index);
            try {
                npc.process();
            }
            catch (e) {
                console.error(e);
            }
        }, false));
        World.executor.sync(new GameTask(true, function (index) {
            var player = World.players.get(index);
            try {
                PlayerUpdating_1.PlayerUpdating.update(player);
                NPCUpdating_1.NPCUpdating.update(player);
            }
            catch (e) {
                console.error(e);
                player.requestLogout();
            }
        }));
        World.executor.sync(new GameTask(true, function (index) {
            var player = World.players.get(index);
            (0, immer_1.produce)(player, function (draft) {
                try {
                    draft.resetUpdating();
                    draft.setCachedUpdateBlock(null);
                    draft.getSession().flush();
                }
                catch (e) {
                    console.log(e);
                    draft.requestLogout();
                }
            });
        }));
        World.executor.sync(new GameTask(false, function (index) {
            var npc = World.npcs.get(index);
            (0, immer_1.produce)(npc, function (draft) {
                try {
                    draft.resetUpdating();
                }
                catch (e) {
                    console.log(e);
                }
            });
        }));
    };
    World.MAX_PLAYERS = 500;
    World.players = new MobileList_1.MobileList(World.MAX_PLAYERS);
    World.playerBots = new Map();
    World.npcs = new MobileList_1.MobileList(5000);
    World.items = [];
    World.playerArray = [];
    /**
     * The collection of active {@link GameObject}s..
     */
    World.objects = [];
    /**
     * The collection of {@link Players}s waiting to be added to the game.
     */
    World.addPlayerQueue = new Array();
    /**
     * The collection of {@link Players}s waiting to be removed from the game.
     */
    World.removePlayerQueue = new Array();
    /**
     * The collection of {@link Players}s waiting to be added to the game.
     */
    World.addNPCQueue = new Array();
    /**
     * The collection of {@link Players}s waiting to be removed from the game.
     */
    World.removeNPCQueue = new Array();
    /**
     * The manager for game synchronization.
     */
    World.executor = new GameSyncExecutor_1.GameSyncExecutor();
    return World;
}());
var NPCSyncTask = /** @class */ (function () {
    function NPCSyncTask(isParallel, isPlayerTask) {
        this.isParallel = isParallel;
        this.isPlayerTask = isPlayerTask;
    }
    NPCSyncTask.prototype.execute = function (index) {
        var npc = World.getNpcs().get(index);
        try {
            npc.process();
        }
        catch (e) {
            console.error("Erro ao processar NPC: ", e);
            throw new Error("Erro ao processar NPC");
        }
    };
    return NPCSyncTask;
}());
var PlayerSyncTask = /** @class */ (function () {
    function PlayerSyncTask(isPlayerTask) {
        this.isParallel = true;
        this.isPlayerTask = isPlayerTask;
    }
    PlayerSyncTask.prototype.execute = function (index) {
        var player = World.getPlayers().get(index);
        try {
            PlayerUpdating_1.PlayerUpdating.update(player);
            NPCUpdating_1.NPCUpdating.update(player);
        }
        catch (e) {
            console.error("Erro ao atualizar jogador: ", e);
            player.onLogout();
            throw new Error("Erro ao atualizar jogador");
        }
    };
    return PlayerSyncTask;
}());
var GameTask = /** @class */ (function (_super) {
    __extends(GameTask, _super);
    function GameTask(b, execFunc, c) {
        var _this = _super.call(this, b, c) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    GameTask.prototype.execute = function () {
        this.execFunc();
    };
    return GameTask;
}(GameSyncTask_1.GameSyncTask));
exports.GameTask = GameTask;
//# sourceMappingURL=World.js.map