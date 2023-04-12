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
exports.PestControl = void 0;
var World_1 = require("../../../../World");
var NPC_1 = require("../../../../entity/impl/npc/NPC");
var Item_1 = require("../../../../model/Item");
var Location_1 = require("../../../../model/Location");
var PestControlArea_1 = require("../../../../model/areas/impl/pestcontrol/PestControlArea");
var PestControlNoviceBoatArea_1 = require("../../../../model/areas/impl/pestcontrol/PestControlNoviceBoatArea");
var DialogueExpression_1 = require("../../../../model/dialogues/DialogueExpression");
var DialogueChainBuilder_1 = require("../../../../model/dialogues/builders/DialogueChainBuilder");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var Misc_1 = require("../../../../../util/Misc");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var PestControlPortalData_1 = require("./PestControlPortalData");
var PestControlBoat_1 = require("./PestControlBoat");
var NpcDialogue_1 = require("../../../../model/dialogues/entries/impl/NpcDialogue");
var StatementDialogue_1 = require("../../../../model/dialogues/entries/impl/StatementDialogue");
var EndDialogue_1 = require("../../../../model/dialogues/entries/impl/EndDialogue");
var PestControlOutpostArea_1 = require("../../../../model/areas/impl/pestcontrol/PestControlOutpostArea");
var PestControlPortalNPC_1 = require("../../../../entity/impl/npc/impl/pestcontrol/PestControlPortalNPC");
var PestTask = /** @class */ (function (_super) {
    __extends(PestTask, _super);
    function PestTask(n1, nome, execFunc) {
        var _this = _super.call(this, n1) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    PestTask.prototype.execute = function () {
        this.execFunc();
    };
    return PestTask;
}(Task_1.Task));
var PestControl = exports.PestControl = /** @class */ (function () {
    function PestControl(boatType) {
        this.last_spawn = PestControl.SPAWN_TICK_RATE;
        this.boatType = boatType;
        PestControl.area = new PestControlArea_1.PestControlArea();
    }
    PestControl.unshieldPortal = function () {
        if (!this.chosenPortalSpawnSequence)
            return;
        var data = this.chosenPortalSpawnSequence[this.totalPortalsUnlocked];
        var portal = this.spawned_npcs.find(function (n) { return n !== null && n.getId() === data.shieldId; });
        if (!portal)
            return;
        this.GAME_AREA.getPlayers().forEach(function (p) { return p.getPacketSender().sendMessage("The < col=".concat(data.colourCode, " > ").concat(data.name.toLowerCase().replace("_", " "), ", ").concat(data.name, " < /col> portal shield has dropped!")); });
        this.totalPortalsUnlocked++;
        portal.setNpcTransformationId(data.shieldId - 4);
    };
    PestControl.healKnight = function (npc) {
        this.portalsKilled++;
        this.spawned_npcs.splice(this.spawned_npcs.indexOf(npc), 1);
        if (!this.knight || this.knight.isDyingFunction())
            return;
        this.knight.heal(50);
    };
    PestControl.prototype.timeExpired = function () {
        return this.ticksElapsed >= (100 * 20);
    };
    PestControl.prototype.init = function () {
    };
    PestControl.begin = function (boat) {
        var queue = boat.getQueue();
        var area = new PestControlArea_1.PestControlArea();
        this.setupEntities(boat);
        var movedPlayers = 0;
        for (var i = 0; i < queue.length; i++) {
            if (movedPlayers >= 25) {
                break;
            }
            var player = queue[i];
            if (player != null) {
                movedPlayers++;
                this.moveToGame(boat, player, area);
            }
        }
        if (queue.length > 0) {
            queue.forEach(function (p) {
                p.getPacketSender().sendMessage("You have been given priority level 1 over other players in joining the next game.");
            });
        }
    };
    PestControl.sendSquireMessage = function (message, boat) {
        var squire = World_1.World.getNpcs().search(function (n) { return n.getId() == boat.squireId; });
        if (!squire || !message)
            return;
        squire.forceChat(message);
    };
    PestControl.setupEntities = function (boat) {
        var _this = this;
        this.spawnNPC(boat.void_knight_id, new Location_1.Location(2656, 2592), true);
        this.spawnNPC(NpcIdentifiers_1.NpcIdentifiers.SQUIRE_12, new Location_1.Location(2655, 2607), false);
        this.chosenPortalSpawnSequence = this.PORTAL_SEQUENCE[Misc_1.Misc.randoms(this.PORTAL_SEQUENCE.length - 1)];
        this.chosenPortalSpawnSequence.forEach(function (portal) { return _this.spawnPortal(portal.shieldId, new Location_1.Location(portal.xPosition, portal.yPosition)); });
        var portalTask = new PestTask(1, "PortalTask", function () {
            var ticks = 50;
            if (_this.totalPortalsUnlocked === 4 || _this.isKnightDead()) {
                stop();
                return;
            }
            ticks--;
            if (ticks === 0 || _this.totalPortalsUnlocked === 0 && Math.floor(ticks / 2) === 15) {
                _this.unshieldPortal();
                ticks = 50;
            }
        });
        TaskManager_1.TaskManager.submit(portalTask);
    };
    PestControl.moveToGame = function (boat, player, area) {
        area.add(player);
        player.smartMoves(PestControlArea_1.PestControlArea.LAUNCHER_BOAT_BOUNDARY);
        NpcDialogue_1.NpcDialogue.sendStatement(player, NpcIdentifiers_1.NpcIdentifiers.SQUIRE_12, [
            "You must defend the Void Knight while the portals are",
            "unsummoned. The ritual takes twenty minutes though,",
            "so you can help out by destroying them yourselves!",
            "Now GO GO GO!"
        ], DialogueExpression_1.DialogueExpression.DISTRESSED);
        /**
        
        gameStarted = true;
        gameTimer = 400;
        */
    };
    /**
     
    Determines whether the game is still active.
    @return
    */
    PestControl.prototype.isActive = function () {
        return PestControl.playersInGame() > 0 && this.boatType != null;
    };
    PestControl.spawnNPC = function (id, pos, isKnight) {
        var npc = NPC_1.NPC.create(id, pos);
        if (isKnight) {
            this.knight = npc;
        }
        this.area.add(npc);
        this.spawned_npcs.push(npc);
        World_1.World.getAddNPCQueue().push(npc);
    };
    PestControl.spawnPortal = function (id, pos) {
        var npc = new PestControlPortalNPC_1.PestControlPortalNPC(id, pos);
        var hitPoints = this.boatType == PestControlBoat_1.PestControlBoat.NOVICE ? 200 : 250;
        npc.setHitpoints(hitPoints);
        npc.getDefinition().setMaxHitpoints(hitPoints);
        this.area.add(npc);
        this.spawned_npcs.push(npc);
        World_1.World.getAddNPCQueue().push(npc);
    };
    PestControl.isPortalsDead = function () {
        return this.portalsKilled === 4;
    };
    PestControl.isPortal = function (id, shielded) {
        var e_1, _b;
        var portalIds = [];
        try {
            for (var _c = __values(Object.values(PestControlPortalData_1.PestControlPortalData)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var d = _d.value;
                portalIds.push(shielded ? d.shieldId : d.shieldId - 4);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return portalIds.includes(id);
    };
    PestControl.prototype.firstClickObject = function (player, object) {
        // All object handling should be done in Areas where possible
        return false;
    };
    PestControl.prototype.handleButtonClick = function (player, button) {
        return false;
    };
    PestControl.prototype.process = function () {
        var e_2, _b;
        try {
            if (!this.isActive()) {
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
                var index = Object.values(PestControlBoat_1.PestControlBoat).indexOf(this.boatType);
                try {
                    for (var _c = __values(Object.values(PestControlPortalData_1.PestControlPortalData)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var portal = _d.value;
                        if (this.portalExists(portal)) {
                            PestControl.spawnNPC(PestControl.PEST_CONTROL_MONSTERS[index][Misc_1.Misc.randoms(PestControl.PEST_CONTROL_MONSTERS[index].length - 1)], new Location_1.Location(portal.npcSpawnX, portal.npcSpawnY), false);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    PestControl.prototype.portalExists = function (portal) {
        var e_3, _b;
        try {
            for (var _c = __values(PestControl.spawned_npcs), _d = _c.next(); !_d.done; _d = _c.next()) {
                var npc = _d.value;
                if (portal == null || npc == null) {
                    continue;
                }
                if (npc.getLocation().equals(new Location_1.Location(portal.xPosition, portal.yPosition, 0)) && !npc.isDyingFunction()) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    PestControl.isKnightDead = function () {
        return this.knight == null || (this.knight != null && this.knight.getHitpoints() == 0);
    };
    PestControl.playersInGame = function () {
        return PestControl.GAME_AREA.getPlayers().length;
    };
    PestControl.prototype.endGame = function (won) {
        PestControl.GAME_AREA.getPlayers().forEach(function (player) {
            player.moveTo(new Location_1.Location(2657, 2639, 0));
            var damage = player.getAttribute("pcDamage");
            var myDamage = damage == null ? 0 : damage;
            var reward_points = 2;
            if (!won) {
                NpcDialogue_1.NpcDialogue.send(player, PestControl.boatType.squireId, "The Void Knight was killed, another of our Order has fallen and that Island is lost.", DialogueExpression_1.DialogueExpression.DISTRESSED);
                return;
            }
            if (myDamage > 50) {
                PestControl.sendWinnerDialogue(player, 4, 1, PestControl.boatType);
                return;
            }
            StatementDialogue_1.StatementDialogue.sends(player, ["The void knights notice your lack of zeal in that battle and have not presented you with any points."]);
            player.pcPoints += reward_points;
        });
        this.reset();
    };
    PestControl.sendWinnerDialogue = function (p, pointsToAdd, coinReward, boat) {
        var dialogueBuilder = new DialogueChainBuilder_1.DialogueChainBuilder();
        dialogueBuilder.add(new NpcDialogue_1.NpcDialogue(0, boat.squireId, "Congratulations! You managed to destroy all the portals! We've awarded you ".concat(pointsToAdd, " Void Knight Commendation points. Please also accept these coins as a reward."), new extTask(function (player) {
            p.pcPoints += pointsToAdd;
            p.getInventory().addItem(new Item_1.Item(995, coinReward));
            StatementDialogue_1.StatementDialogue.sends(p, ["<col=00077a>You now have</col><col=b11717> " + p.pcPoints + "</col><col=00077a> Void Knight Commendation points!", "You can speak to a Void Knight to exchange your points for rewards."]);
        })), new EndDialogue_1.EndDialogue(1));
        p.getDialogueManager().startDialog(dialogueBuilder, 0);
    };
    /**
     * Resets the game variables and map
     */
    PestControl.prototype.reset = function () {
        this.ticksElapsed = -1;
        this.boatType = PestControlBoat_1.PestControlBoat.NOVICE;
        PestControl.chosenPortalSpawnSequence = null;
        PestControl.totalPortalsUnlocked = 0;
        PestControl.portalsKilled = 0;
        this.last_spawn = PestControl.SPAWN_TICK_RATE;
        PestControl.spawned_npcs.filter(function (n) { return n != null; }).forEach(function (n) { return n.setDying(true); });
        PestControl.spawned_npcs = [];
    };
    PestControl.isQueued = function (player, boat) {
        return boat.getQueue().includes(player);
    };
    PestControl.addToQueue = function (player, boat) {
        if (PestControl.isQueued(player, boat)) {
            console.error("Error.. adding " + player.getUsername() + " to " + boat.getName() + " list.. already on the list.");
            return;
        }
        /**
        * TODO.. might be a good idea to get the players in the area then add all to the list.. however.. pest control uses a queue system not list!
        */
        boat.getQueue().push(player);
    };
    PestControl.addToWaitingRoom = function (player, boat) {
        player.getPacketSender().sendMessage("You have joined the Pest Control boat.");
        player.getPacketSender().sendMessage("You currently have ".concat(player.pcPoints, " Pest Control Points."));
        player.getPacketSender().sendMessage("Players needed: ".concat(PestControl.PLAYERS_REQUIRED, " to 25 players."));
        this.addToQueue(player, boat);
        player.moveTo(boat.enterBoatLocation);
    };
    var _a;
    _a = PestControl;
    PestControl.spawned_npcs = [];
    PestControl.GAME_AREA = new PestControlArea_1.PestControlArea();
    PestControl.OUTPOST_AREA = new PestControlOutpostArea_1.PestControlOutpostArea();
    PestControl.NOVICE_BOAT_AREA = new PestControlNoviceBoatArea_1.PestControlNoviceBoatArea();
    /**
    * The tile which is right beside the gang plank.
    */
    PestControl.GANG_PLANK_START = new Location_1.Location(2657, 2639, 0);
    /**
    * How many players we need to start a game
    */
    PestControl.PLAYERS_REQUIRED = 1; // 5 default
    PestControl.DEFAULT_BOAT_WAITING_TICKS = 10; // 50 secs default
    PestControl.PORTAL_SEQUENCE = [
        [PestControlPortalData_1.PestControlPortalData.BLUE, PestControlPortalData_1.PestControlPortalData.RED, PestControlPortalData_1.PestControlPortalData.YELLOW, PestControlPortalData_1.PestControlPortalData.PURPLE],
        [PestControlPortalData_1.PestControlPortalData.BLUE, PestControlPortalData_1.PestControlPortalData.PURPLE, PestControlPortalData_1.PestControlPortalData.RED, PestControlPortalData_1.PestControlPortalData.YELLOW],
        [PestControlPortalData_1.PestControlPortalData.PURPLE, PestControlPortalData_1.PestControlPortalData.BLUE, PestControlPortalData_1.PestControlPortalData.YELLOW, PestControlPortalData_1.PestControlPortalData.RED],
        [PestControlPortalData_1.PestControlPortalData.PURPLE, PestControlPortalData_1.PestControlPortalData.YELLOW, PestControlPortalData_1.PestControlPortalData.BLUE, PestControlPortalData_1.PestControlPortalData.RED],
        [PestControlPortalData_1.PestControlPortalData.YELLOW, PestControlPortalData_1.PestControlPortalData.RED, PestControlPortalData_1.PestControlPortalData.PURPLE, PestControlPortalData_1.PestControlPortalData.BLUE],
        [PestControlPortalData_1.PestControlPortalData.YELLOW, PestControlPortalData_1.PestControlPortalData.PURPLE, PestControlPortalData_1.PestControlPortalData.RED, PestControlPortalData_1.PestControlPortalData.BLUE]
    ];
    PestControl.NOVICE_LOBBY_TASK = new PestTask(1, PestControlBoat_1.PestControlBoat.NOVICE.getName(), function () {
        var novice_boat = PestControlBoat_1.PestControlBoat.NOVICE;
        var noviceWaitTicks = _a.DEFAULT_BOAT_WAITING_TICKS;
        var playersReady = novice_boat.getQueue().length;
        if (playersReady === 0) {
            stop();
            return;
        }
        if (playersReady < _a.PLAYERS_REQUIRED)
            return;
        if (playersReady >= 10 && Math.random() <= 0.15) {
            _a.sendSquireMessage("We're about to launch!", novice_boat);
        }
        noviceWaitTicks--;
        if (noviceWaitTicks === 0 || playersReady >= 25) {
            noviceWaitTicks = _a.DEFAULT_BOAT_WAITING_TICKS;
            _a.begin(novice_boat);
        }
    });
    PestControl.INTERMEDIATE_LOBBY_TASK = new PestTask(1, PestControlBoat_1.PestControlBoat.INTERMEDIATE.name, function () {
        var intermediate_boat = PestControlBoat_1.PestControlBoat.INTERMEDIATE;
        var intermediateWaitTicks = _a.DEFAULT_BOAT_WAITING_TICKS;
        var playersReady = intermediate_boat.getQueue().length;
        if (playersReady === 0) {
            _a.INTERMEDIATE_LOBBY_TASK.stop();
            return;
        }
        if (playersReady >= 10 && Math.random() <= .15) {
            _a.sendSquireMessage("We're about to launch!", intermediate_boat);
        }
        intermediateWaitTicks--;
        if (intermediateWaitTicks === 0 || playersReady >= 25) {
            intermediateWaitTicks = _a.DEFAULT_BOAT_WAITING_TICKS;
            _a.begin(intermediate_boat);
        }
    });
    PestControl.PEST_CONTROL_MONSTERS = [
        [
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER,
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_2,
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_3,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_2,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_2,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_3,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_5,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_2,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_3,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_3 //Torcher - Level 49
        ],
        [
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_2,
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_3,
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_4,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_2,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_4,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_5,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_2,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_3,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_4,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_5,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_7,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_5,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_7,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_9,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_2,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_4,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_3,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_5,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_7 //Torcher - Level 79
        ],
        [
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_3,
            NpcIdentifiers_1.NpcIdentifiers.BRAWLER_4,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_7,
            NpcIdentifiers_1.NpcIdentifiers.DEFILER_9,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_3,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_4,
            NpcIdentifiers_1.NpcIdentifiers.RAVAGER_5,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_7,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_9,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_5,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_7,
            NpcIdentifiers_1.NpcIdentifiers.SHIFTER_9,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_3,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_4,
            NpcIdentifiers_1.NpcIdentifiers.SPLATTER_5,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_7,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_9,
            NpcIdentifiers_1.NpcIdentifiers.TORCHER_10, //Torcher - Level 92
        ]
    ];
    PestControl.SPAWN_TICK_RATE = 10;
    return PestControl;
}());
var extTask = /** @class */ (function (_super) {
    __extends(extTask, _super);
    function extTask(execFunc) {
        var _this = _super.call(this, execFunc()) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    return extTask;
}(DialogueExpression_1.DialogueExpression));
//# sourceMappingURL=PestControl.js.map