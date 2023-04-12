"use strict";
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
exports.ChatInteraction = void 0;
var GameConstants_1 = require("../../../../GameConstants");
var CommandType_1 = require("../commands/CommandType");
var Misc_1 = require("../../../../../util/Misc");
var ChatInteraction = exports.ChatInteraction = /** @class */ (function () {
    function ChatInteraction(playerBot) {
        this.playerBot = playerBot;
    }
    /**
     * Called when a Player hears a message from a player within speaking distance.
     *
     * @param message
     * @param fromPlayer
     */
    ChatInteraction.prototype.heard = function (message, fromPlayer) {
        var textByteArray = message.getText();
        var chatMessage = Misc_1.Misc.textUnpack(textByteArray, textByteArray.length).toLowerCase().trim();
        if (!chatMessage.startsWith(this.playerBot.getUsername().toLowerCase())) {
            // The player hasn't said the Bot's name, return
            return;
        }
        this.processCommand(chatMessage, fromPlayer, CommandType_1.CommandType.PUBLIC_CHAT);
    };
    /**
     * Called when a Player bot receives an in game message via PacketSender.sendMessage()
     *
     * @param message
     */
    ChatInteraction.prototype.receivedGameMessage = function (message) {
        if (this.playerBot.getInteractingWith() != null) {
            // If this bot is currently interacting with someone, no need to shout
            var messageBytes = new TextEncoder().encode(message);
            this.playerBot.getPacketSender().sendPrivateMessage(this.playerBot.getInteractingWith(), messageBytes, messageBytes.length);
        }
    };
    /**
     * Called when a Player Bot receives a private message from a Player
     *
     * @param messageByteArray
     * @param fromPlayer
     */
    ChatInteraction.prototype.receivedPrivateMessage = function (messageByteArray, fromPlayer) {
        var chatMessage = Misc_1.Misc.textUnpack(messageByteArray, messageByteArray.length).toLowerCase().trim();
        this.processCommand(chatMessage, fromPlayer, CommandType_1.CommandType.PRIVATE_CHAT);
    };
    /**
     * Method used to search a string for any player bot commands and action any found.
     *
     * @param chatMessage
     * @param fromPlayer
     * @param type
     */
    ChatInteraction.prototype.processCommand = function (chatMessage, fromPlayer, type, typeclass) {
        var e_1, _a;
        if (chatMessage.includes("stop")) {
            if (this.playerBot.getActiveCommand() !== null &&
                (fromPlayer === this.playerBot.getInteractingWith() || GameConstants_1.GameConstants.PLAYER_BOT_OVERRIDE.includes(fromPlayer.getAmountDonated()))) {
                this.playerBot.stopCommand();
            }
            // If the player is currently under attack from the Bot, stop combat
            if (this.playerBot.getCombat().getAttacker() == fromPlayer) {
                this.playerBot.getCombat().setUnderAttack(null);
            }
            return;
        }
        var chatCommands = this.playerBot.getChatCommands();
        for (var i = 0; i < chatCommands.length; i++) {
            var command = chatCommands[i];
            try {
                for (var _b = (e_1 = void 0, __values(command.triggers())), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var trigger = _c.value;
                    if (!chatMessage.includes(trigger)) {
                        // Command wasn't triggered
                        continue;
                    }
                    if (!command.supportedTypes().includes(type)) {
                        // Command was triggered, but method not supported
                        fromPlayer.getPacketSender().sendMessage("Sorry, this bot command can't be delivered via " + typeclass.getLabel() + ".");
                        return;
                    }
                    // Get params after trigger
                    var clipIndex = chatMessage.indexOf(trigger) + trigger.length + ChatInteraction.SPACE_LENGTH;
                    var sub = chatMessage.length > clipIndex ? chatMessage.substring(clipIndex) : chatMessage;
                    this.playerBot.startCommand(command, fromPlayer, sub.split(" ", 5));
                    return; // Don't process any more commands
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    ChatInteraction.SPACE_LENGTH = 1;
    return ChatInteraction;
}());
//# sourceMappingURL=ChatInteraction.js.map