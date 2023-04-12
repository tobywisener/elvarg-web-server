import {CastleWars} from '../../../../content/minigames/impl/CastleWars';
import {Lanthus} from '../../../../entity/impl/npc/impl/Lanthus';
import {Player} from '../../../../entity/impl/player/Player'
import {PlayerBot} from '../../../../entity/impl/playerbot/PlayerBot'

import {Boundary} from '../../../../model/Boundary';
import {Area} from '../../../../model/areas/Area';
import {ObjectIdentifiers} from  '../../../../../util/ObjectIdentifiers';
import { Team } from '../../../../content/minigames/impl/CastleWars';
import { GameObject } from '../../../../entity/impl/object/GameObject';



export class CastleWarsLobbyArea extends Area {
    private lanthus: Lanthus;

    constructor() {
        super([new Boundary(2435, 2446, 3081, 3098,0)]);
    }

    public getName(): string {
        return "the Castle Wars Lobby";
    }

    public handleObjectClick(player: Player, objectId: GameObject, type: number): boolean {
        switch (objectId.getId()) {
            case ObjectIdentifiers.ZAMORAK_PORTAL:
                CastleWars.addToWaitingRoom(player, Team.ZAMORAK);
                return true;

            case ObjectIdentifiers.SARADOMIN_PORTAL:
                CastleWars.addToWaitingRoom(player, Team.SARADOMIN);
                return true;

            case ObjectIdentifiers.GUTHIX_PORTAL:
                CastleWars.addToWaitingRoom(player, Team.GUTHIX);
                return true;

            case ObjectIdentifiers.BANK_CHEST_2:
                if (type === 1) {
                    player.getBank(player.getCurrentBankTab()).open();
                } else {
                    player.getPacketSender().sendMessage("The Grand Exchange is not available yet.");
                }

                return true;
        }

        return false;
    }

    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
        // Allow Player Bots to idle here
        return true;
    }

    public getLanthus(): Lanthus {
        return this.lanthus;
    }

    public setLanthus(lanthus: Lanthus): void {
        this.lanthus = lanthus;
    }
}