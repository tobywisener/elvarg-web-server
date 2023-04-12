import { GameConstants } from "../../../../GameConstants";
import { Player } from "../../player/Player";
import { PlayerBot } from "../PlayerBot";
import { BotCommand } from "../commands/BotCommand";
import { CommandType } from "../commands/CommandType";
import { ChatMessage } from '../../../../model/ChatMessage'
import { Misc } from "../../../../../util/Misc";
import { Commandclass } from "../commands/CommandType";


export class ChatInteraction {
    private static SPACE_LENGTH = 1;

    playerBot: PlayerBot;

    constructor(playerBot: PlayerBot) {
        this.playerBot = playerBot;
    }

    /**
     * Called when a Player hears a message from a player within speaking distance.
     *
     * @param message
     * @param fromPlayer
     */
    public heard(message: ChatMessage, fromPlayer: Player) {
        let textByteArray = message.getText();
        let chatMessage = Misc.textUnpack(textByteArray, textByteArray.length).toLowerCase().trim();
        if (!chatMessage.startsWith(this.playerBot.getUsername().toLowerCase())) {
            // The player hasn't said the Bot's name, return
            return;
        }

        this.processCommand(chatMessage, fromPlayer, CommandType.PUBLIC_CHAT);
    }

    /**
     * Called when a Player bot receives an in game message via PacketSender.sendMessage()
     *
     * @param message
     */
    public receivedGameMessage(message: string) {
        if (this.playerBot.getInteractingWith() != null) {
            // If this bot is currently interacting with someone, no need to shout
            const messageBytes = new TextEncoder().encode(message);
            this.playerBot.getPacketSender().sendPrivateMessage(this.playerBot.getInteractingWith(), messageBytes, messageBytes.length);
        }
    }

    /**
     * Called when a Player Bot receives a private message from a Player
     *
     * @param messageByteArray
     * @param fromPlayer
     */
    public receivedPrivateMessage(messageByteArray: number[], fromPlayer: Player) {
        let chatMessage = Misc.textUnpack(messageByteArray, messageByteArray.length).toLowerCase().trim();
        this.processCommand(chatMessage, fromPlayer, CommandType.PRIVATE_CHAT);
    }

    /**
     * Method used to search a string for any player bot commands and action any found.
     *
     * @param chatMessage
     * @param fromPlayer
     * @param type
     */
    private processCommand(chatMessage: string, fromPlayer: Player, type: CommandType, typeclass?: Commandclass) {
        if (chatMessage.includes("stop")) {
            if (this.playerBot.getActiveCommand() !== null &&
                (fromPlayer === this.playerBot.getInteractingWith() || GameConstants.PLAYER_BOT_OVERRIDE.includes(fromPlayer.getAmountDonated()))) {
                this.playerBot.stopCommand();
            }

            // If the player is currently under attack from the Bot, stop combat
            if (this.playerBot.getCombat().getAttacker() == fromPlayer) {
                this.playerBot.getCombat().setUnderAttack(null);
            }

            return;
        }
        let chatCommands: BotCommand[] = this.playerBot.getChatCommands();
        for (let i = 0; i < chatCommands.length; i++) {
            let command: BotCommand = chatCommands[i];
            for (let trigger of command.triggers()) {
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
                let clipIndex = chatMessage.indexOf(trigger) + trigger.length + ChatInteraction.SPACE_LENGTH;
                let sub = chatMessage.length > clipIndex ? chatMessage.substring(clipIndex) : chatMessage;
                this.playerBot.startCommand(command, fromPlayer, sub.split(" ", 5));
                return; // Don't process any more commands
            }
        }
    }
}
