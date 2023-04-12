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
exports.PlayerBot = exports.InteractionState = void 0;
var GameConstants_1 = require("../../../GameConstants");
var World_1 = require("../../../World");
var Presetables_1 = require("../../../content/presets/Presetables");
var Player_1 = require("../player/Player");
var FightCommand_1 = require("./commands/FightCommand");
var FollowPlayer_1 = require("./commands/FollowPlayer");
var GoToDuelArena_1 = require("./commands/GoToDuelArena");
var HoldItems_1 = require("./commands/HoldItems");
var LoadPreset_1 = require("./commands/LoadPreset");
var PlayCastleWars_1 = require("./commands/PlayCastleWars");
var ChatInteraction_1 = require("./interaction/ChatInteraction");
var CombatInteraction_1 = require("./interaction/CombatInteraction");
var MovementInteraction_1 = require("./interaction/MovementInteraction");
var TradingInteraction_1 = require("./interaction/TradingInteraction");
var PlayerUpdating_1 = require("../../updating/PlayerUpdating");
var ChatMessage_1 = require("../../../model/ChatMessage");
var PlayerBotSession_1 = require("../../../../net/PlayerBotSession");
var Misc_1 = require("../../../../util/Misc");
var InteractionState;
(function (InteractionState) {
    InteractionState[InteractionState["IDLE"] = 0] = "IDLE";
    InteractionState[InteractionState["COMMAND"] = 1] = "COMMAND";
})(InteractionState = exports.InteractionState || (exports.InteractionState = {}));
var CHAT_COMMANDS = [
    new FollowPlayer_1.FollowPlayer(), new HoldItems_1.HoldItems(), new LoadPreset_1.LoadPreset(), new FightCommand_1.FightCommand(), new PlayCastleWars_1.PlayCastleWars(),
    new GoToDuelArena_1.GoToDuelArena()
];
var PlayerBot = /** @class */ (function (_super) {
    __extends(PlayerBot, _super);
    function PlayerBot(definition) {
        var _this = _super.call(this, new PlayerBotSession_1.PlayerBotSession(), definition.getSpawnLocation()) || this;
        _this.spawnPosition = GameConstants_1.GameConstants.DEFAULT_LOCATION;
        _this.currentState = InteractionState.IDLE;
        _this.interactingWith.setUsername(definition.getUsername()).setLongUsername(Misc_1.Misc.stringToLong(definition.getUsername()))
            .setPasswordHashWithSalt(GameConstants_1.GameConstants.PLAYER_BOT_PASSWORD).setHostAddress("127.0.0.1");
        _this.definition = definition;
        _this.tradingInteraction = new TradingInteraction_1.TradingInteraction(_this);
        _this.chatInteraction = new ChatInteraction_1.ChatInteraction(_this);
        _this.movementInteraction = new MovementInteraction_1.MovementInteraction(_this);
        _this.combatInteraction = new CombatInteraction_1.CombatInteraction(_this);
        _this.interactingWith.setRigourUnlocked(true);
        _this.interactingWith.setAuguryUnlocked(true);
        _this.interactingWith.setAutoRetaliate(true);
        if (!World_1.World.getAddPlayerQueue().includes(_this)) {
            World_1.World.getAddPlayerQueue().push(_this);
        }
        return _this;
    }
    PlayerBot.prototype.getInteractingWith = function () {
        return this.interactingWith;
    };
    PlayerBot.prototype.getDefinition = function () {
        return this.definition;
    };
    PlayerBot.prototype.getCurrentState = function () {
        return this.currentState;
    };
    PlayerBot.prototype.setInteractingWith = function (interact) {
        this.interactingWith = interact;
    };
    PlayerBot.prototype.setCurrentState = function (interactionState) {
        this.currentState = interactionState;
    };
    PlayerBot.prototype.getChatCommands = function () {
        return CHAT_COMMANDS;
    };
    PlayerBot.prototype.getChatInteraction = function () {
        return this.chatInteraction;
    };
    PlayerBot.prototype.getTradingInteraction = function () {
        return this.tradingInteraction;
    };
    PlayerBot.prototype.getMovementInteraction = function () {
        return this.movementInteraction;
    };
    PlayerBot.prototype.getCombatInteraction = function () {
        return this.combatInteraction;
    };
    PlayerBot.prototype.getSpawnPosition = function () {
        return this.spawnPosition;
    };
    PlayerBot.prototype.getActiveCommand = function () {
        if (this.activeCommand === null) {
            throw new Error("Command not found.");
        }
        return this.activeCommand;
    };
    PlayerBot.prototype.stopCommand = function () {
        if (this.getActiveCommand() != null) {
            this.getActiveCommand().stop(this);
        }
        this.setInteractingWith(null);
        this.activeCommand = null;
        this.setCurrentState(InteractionState.IDLE);
    };
    PlayerBot.prototype.startCommand = function (command, player, args) {
        this.setInteractingWith(player);
        this.activeCommand = command;
        this.setCurrentState(InteractionState.COMMAND);
        command.start(this, args);
    };
    PlayerBot.prototype.sendChat = function (message) {
        this.interactingWith.getChatMessageQueue().push(new ChatMessage_1.ChatMessage(0, 0, Misc_1.Misc.textPack(message)));
    };
    PlayerBot.prototype.updateLocalPlayers = function () {
        var e_1, _a;
        if (this.interactingWith.getLocalPlayers().length == 0) {
            return;
        }
        try {
            for (var _b = __values(this.interactingWith.getLocalPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var localPlayer = _c.value;
                PlayerUpdating_1.PlayerUpdating.update(localPlayer);
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
    PlayerBot.prototype.process = function () {
        this.combatInteraction.process();
        _super.prototype.process.call(this);
    };
    PlayerBot.prototype.onLogin = function () {
        _super.prototype.onLogin.call(this);
        Presetables_1.Presetables.load(this.interactingWith, this.getDefinition().getFighterPreset().getItemPreset());
    };
    PlayerBot.prototype.resetAttributes = function () {
        _super.prototype.resetAttributes.call(this);
        this.stopCommand();
    };
    return PlayerBot;
}(Player_1.Player));
exports.PlayerBot = PlayerBot;
//# sourceMappingURL=PlayerBot.js.map