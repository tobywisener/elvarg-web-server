import { Boundary } from '../../../game/model/Boundary';
import { Player } from '../../entity/impl/player/Player'
import { PlayerBot } from '../../entity/impl/playerbot/PlayerBot'
import { NPC } from '../../entity/impl/npc/NPC';
import { Mobile } from '../../entity/impl/Mobile'
import { Item } from '../../../game/model/Item'
import { CombatFactory } from '../../content/combat/CombatFactory'
import { CanAttackResponse } from '../../content/combat/CombatFactory'
import { GameObject } from '../../entity/impl/object/GameObject';
import { MagicSpellbook } from '../MagicSpellbook';


export abstract class Area {
    private boundaries: Boundary[];
    private npcs: { [key: number]: NPC } = {};
    private players: { [key: number]: Player } = {};
    private playerBots: { [key: number]: PlayerBot } = {};

    constructor(boundaries?: Boundary[]) {
        this.boundaries = boundaries;
    }


    public isSpellDisabled(player: Player, spellbook: MagicSpellbook, spellId: number): boolean {
        return false;
    }

    enter(character: Mobile) {
        if (character.isPlayerBot()) {
            this.playerBots[character.getIndex()] = character.getAsPlayerBot();
        }

        if (character.isPlayer()) {
            this.players[character.getIndex()] = (character.getAsPlayer() as unknown) as Player;
        } else if (character.isNpc()) {
            this.npcs[character.getIndex()] = character.getAsNpc();
        }
        this.postEnter(character);
    }

    postEnter(character: Mobile) { }

    leave(character: Mobile, logout: boolean) {
        if (character.isPlayerBot()) {
            delete this.playerBots[character.getIndex()];
        }

        if (character.isPlayer()) {
            delete this.players[character.getIndex()];
        } else if (character.isNpc()) {
            delete this.npcs[character.getIndex()];
        }
        this.postLeave(character, logout);
    }

    postLeave(character: Mobile, logout: boolean) { }

    process(character: Mobile) {
        // By default, do nothing in process.
    }

    canTeleport(player: Player): boolean {
        // By default, Areas allow teleporting unless otherwise specified.
        return true;
    }

    public canAttack(attacker: Mobile, target: Mobile): CanAttackResponse {
        if (attacker.isPlayer() && target.isPlayer()) {
            return CanAttackResponse.CANT_ATTACK_IN_AREA;
        }

        return CanAttackResponse.CAN_ATTACK;
    }

    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
        return false;
    }

    public defeated(player: Player, character: Mobile): void {
        // By default, do nothing when a player is defeated.
    }

    public canTrade(player: Player, target: Player): boolean {
        // By default, allow Players to trade in an Area.
        return true;
    }

    public isMulti(character: Mobile): boolean {
        // By default, Areas are single combat.
        return false;
    }

    public canEat(player: Player, itemId: number): boolean {
        // By default, players can eat in an Area.
        return true;
    }

    public canDrink(player: Player, itemId: number): boolean {
        // By default, players can drink in an Area.
        return true;
    }

    public dropItemsOnDeath(player: Player, killer?: Player): boolean {
        // By default, players will drop items in an Area.
        return true;
    }

    public handleDeath(player: Player, killer?: Player): boolean {
        // By default, players Death will be handled by the main death handler.
        return false;
    }

    public onPlayerRightClick(player: Player, rightClicked: Player, option: number): void {
        // By default, players will have the default right click in Areas.
    }

    public handleObjectClick(player: Player, objectId: GameObject, type: number): boolean {
        // By default, Areas don't need to handle any specific object clicking.
        return false;
    }

    public overridesNpcAggressionTolerance(player: Player, npcId: number): boolean {
        // By default, NPC tolerance works normally in Areas.
        return false;
    }

    public canEquipItem(player: Player, slot: number, item: Item): boolean {
        // By default, Players can equip items in all areas
        return true;
    }

    public canUnequipItem(player: Player, slot: number, item: Item): boolean {
        // By default, Players can unequip items in all areas
        return true;
    }

    public getBoundaries(): Boundary[] {
        return this.boundaries;
    }

    public getName(): string {
        return this.constructor.name;
    }

    public getNpcs(): NPC[] {
        return Object.values(this.npcs);
    }

    public getPlayers(): Player[] {
        return Object.values(this.players);
      }
      
      public getPlayerBots(): PlayerBot[] {
        return Object.values(this.playerBots);
      }
}

