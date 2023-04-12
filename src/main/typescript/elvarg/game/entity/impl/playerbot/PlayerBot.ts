import { GameConstants } from '../../../GameConstants'
import { World } from '../../../World'
import { Presetables } from '../../../content/presets/Presetables'
import { PlayerBotDefinition } from '../../../definition/PlayerBotDefinition'
import { Mobile } from '../Mobile'
import { Player } from '../player/Player'
import { BotCommand } from './commands/BotCommand'
import { FightCommand } from './commands/FightCommand'
import { FollowPlayer } from './commands/FollowPlayer'
import { GoToDuelArena } from './commands/GoToDuelArena'
import { HoldItems } from './commands/HoldItems'
import { LoadPreset } from './commands/LoadPreset'
import { PlayCastleWars } from './commands/PlayCastleWars'
import { ChatInteraction } from './interaction/ChatInteraction'
import { CombatInteraction } from './interaction/CombatInteraction'
import { MovementInteraction } from './interaction/MovementInteraction'
import { TradingInteraction } from './interaction/TradingInteraction'
import { PlayerUpdating } from '../../updating/PlayerUpdating'
import { ChatMessage } from '../../../model/ChatMessage'
import { Location } from '../../../model/Location'
import { PlayerBotSession } from '../../../../net/PlayerBotSession'
import { Misc } from '../../../../util/Misc'

export enum InteractionState {
    IDLE,
    COMMAND
}

const CHAT_COMMANDS: BotCommand[] = [
    new FollowPlayer(), new HoldItems(), new LoadPreset(), new FightCommand(), new PlayCastleWars(),
    new GoToDuelArena()
];

export class PlayerBot extends Player {

    private spawnPosition = GameConstants.DEFAULT_LOCATION;
    private currentState: InteractionState = InteractionState.IDLE;
    private activeCommand: BotCommand | null;
    private definition: PlayerBotDefinition;
    private interactingWith: Player | null;

    public  getInteractingWith(): Player | null {
        return this.interactingWith;
    }

    private movementInteraction: MovementInteraction;
    public chatInteraction: ChatInteraction;
    private tradingInteraction: TradingInteraction;
    private combatInteraction: CombatInteraction;

    constructor(definition: PlayerBotDefinition) {
        super(new PlayerBotSession(), definition.getSpawnLocation());

        this.interactingWith.setUsername(definition.getUsername()).setLongUsername(Misc.stringToLong(definition.getUsername()))
            .setPasswordHashWithSalt(GameConstants.PLAYER_BOT_PASSWORD).setHostAddress("127.0.0.1");

        this.definition = definition;
        this.tradingInteraction = new TradingInteraction(this);
        this.chatInteraction = new ChatInteraction(this);
        this.movementInteraction = new MovementInteraction(this);
        this.combatInteraction = new CombatInteraction(this);

        this.interactingWith.setRigourUnlocked(true);
        this.interactingWith.setAuguryUnlocked(true);
        this.interactingWith.setAutoRetaliate(true);

        if (!World.getAddPlayerQueue().includes(this)) {
            World.getAddPlayerQueue().push(this);
        }
    }

    public getDefinition(): PlayerBotDefinition {
        return this.definition;
    }

    public getCurrentState(): InteractionState {
        return this.currentState;
    }

    public setInteractingWith(interact: Player | null) {
        this.interactingWith = interact;
    }

    public setCurrentState(interactionState: InteractionState): void {
        this.currentState = interactionState;
    }

    public getChatCommands(): BotCommand[] {
        return CHAT_COMMANDS;
    }

    public getChatInteraction(): ChatInteraction {
        return this.chatInteraction;
    }

    public getTradingInteraction(): TradingInteraction {
        return this.tradingInteraction;
    }

    public getMovementInteraction(): MovementInteraction {
        return this.movementInteraction;
    }

    public getCombatInteraction(): CombatInteraction {
        return this.combatInteraction;
    }

    public getSpawnPosition(): Location {
        return this.spawnPosition;
    }

    public getActiveCommand(): BotCommand {
        if (this.activeCommand === null) {
            throw new Error("Command not found.");

        }
        return this.activeCommand;
    }

    public stopCommand(): void {
        if (this.getActiveCommand() != null) {
            this.getActiveCommand().stop(this);
        }

        this.setInteractingWith(null);
        this.activeCommand = null;
        this.setCurrentState(InteractionState.IDLE);
    }
    public startCommand(command: BotCommand, player: Player, args: string[]): void {
        this.setInteractingWith(player);
        this.activeCommand = command;
        this.setCurrentState(InteractionState.COMMAND);
        command.start(this, args);
    }

    public sendChat(message: string): void {
        this.interactingWith.getChatMessageQueue().push(new ChatMessage(0, 0, Misc.textPack(message)));
    }

    public updateLocalPlayers(): void {
        if (this.interactingWith.getLocalPlayers().length == 0) {
            return;
        }

        for (let localPlayer of this.interactingWith.getLocalPlayers()) {
            PlayerUpdating.update(localPlayer);
        }
    }

    public process(): void {
        this.combatInteraction.process();
        super.process();
    }

    public onLogin(): void {
        super.onLogin();

        Presetables.load(this.interactingWith, this.getDefinition().getFighterPreset().getItemPreset());
    }

    public resetAttributes(): void {
        super.resetAttributes();

        this.stopCommand();
    }
}