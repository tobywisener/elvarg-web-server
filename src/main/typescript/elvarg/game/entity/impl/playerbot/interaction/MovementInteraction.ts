import { RegionManager } from '../../../../collision/RegionManager'
import { CombatFactory } from '../../../../content/combat/CombatFactory'
import { PlayerBot } from '../PlayerBot'
import { Location } from '../../../../model/Location'
import { DuelArenaArea } from '../../../../model/areas/impl/DuelArenaArea'
import { MovementQueue } from '../../../../model/movement/MovementQueue'
import { TeleportHandler } from '../../../../model/teleportation/TeleportHandler'
import { TeleportType } from '../../../../model/teleportation/TeleportType'
import { Misc } from '../../../../../util/Misc'
import { Mobile } from '../../Mobile'
import { Player } from '../../player/Player'


export enum InteractionState {
    IDLE,

    // Performing a job for a player
    COMMAND
}

export class MovementInteraction {
    // The PlayerBot this interaction belongs to
    private playerBot: PlayerBot;
    private player: Player
    private mobile: Mobile
    constructor(_playerBot: PlayerBot) {
    this.playerBot = _playerBot;
    }
    public process(): void {
        if (this.mobile.getMovementQueue().getMobility().canMove() || this.player.busy()) {
            return;
        }
        switch (this.playerBot.getCurrentState()) {
            case InteractionState.COMMAND:
                // Player Bot is currently busy, do nothing
                return;
            case InteractionState.IDLE:
                if (CombatFactory.inCombat(this.playerBot) || this.player.getDueling().inDuel()) {
                    return;
                }
                // Player bot is idle, let it walk somewhere random
                if (!this.playerBot.getMovementQueue().isMovings()) {
                    if (Misc.getRandom(9) <= 1) {
                        let pos = this.generateLocalPosition();
                        if (pos != null) {
                            MovementQueue.randomClippedStep(this.playerBot, 1);
                        }
                    }
                }
                if (this.playerBot.getArea() != null && this.playerBot.getArea().canPlayerBotIdle(this.playerBot)) {
                    break;
                }
                if (this.playerBot.getLocation().getDistance(this.playerBot.getDefinition().getSpawnLocation()) > 20) {
                    // Bot is far away, teleport back to original location
                    TeleportHandler.teleport(this.playerBot, this.playerBot.getDefinition().getSpawnLocation(), TeleportType.NORMAL, false);
                }
                break;
        }
    }
    private generateLocalPosition(): Location {
        let dir = -1;
        let x = 0, y = 0;
        if (!RegionManager.blockedNorth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 0;
        } else if (!RegionManager.blockedEast(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 4;
        } else if (!RegionManager.blockedSouth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 8;
        } else if (!RegionManager.blockedWest(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 12;
        }
        let random = Misc.getRandom(3);
        let found = false;
        if (random == 0) {
            if (!RegionManager.blockedNorth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                y = 1;
                found = true;
            }
        } else if (random == 1) {
            if (!RegionManager.blockedEast(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                x = 1;
                found = true;
            }
        } else if (random == 2) {
            if (!RegionManager.blockedSouth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                y = -1;
                found = true;
            }
        } else if (random == 3) {
            if (!RegionManager.blockedWest(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                x = -1;
                found = true;
            }
        }
        if (!found) {
            if (dir == 0) {
                y = 1;
            } else if (dir == 4) {
                x = 1;
            } else if (dir == 8) {
                y = -1;
            } else if (dir == 12) {
                x = -1;
            }
        }
        if (x == 0 && y == 0)
            return null;
        let spawnX = this.playerBot.getSpawnPosition().getX();
        let spawnY = this.playerBot.getSpawnPosition().getY();
        if (x == 1) {
            if (this.playerBot.getLocation().getX() + x > spawnX + 1)
                return null;
        }
        if (x == -1) {
            if (this.playerBot.getLocation().getX() - x < spawnX - 1)
                return null;
        }
        if (y == 1) {
            if (this.playerBot.getLocation().getY() + y > spawnY + 1)
                return null;
        }
        if (y == -1) {
            if (this.playerBot.getLocation().getY() - y < spawnY - 1)
                return null;
        }
        return new Location(x, y);
    }
}