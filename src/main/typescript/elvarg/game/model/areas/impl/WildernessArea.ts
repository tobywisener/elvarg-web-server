import { Boundary } from "../../Boundary";
import { Area } from "../Area";
import { Mobile } from "../../../entity/impl/Mobile";
import { BountyHunter } from '../../../content/combat/bountyhunter/BountyHunter'
import { Obelisks } from "../../../content/Obelisks";
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { CanAttackResponse } from "../../../content/combat/CombatFactory";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerBot } from "../../../entity/impl/playerbot/PlayerBot";
import { PlayerRights } from "../../rights/PlayerRights";
import { GameObject } from "../../../entity/impl/object/GameObject";

export class WildernessArea extends Area {
    getName(): string {
        return "the Wilderness";
    }

    static getLevel(y: number) {
        return ((y > 6400 ? y - 6400 : y) - 3520 / 8) + 1;
    }

    static multi(x: number, y: number) {
        if (
            (x >= 3155 && y >= 3798) ||
            (x >= 3020 && x <= 3055 && y >= 3684 && y <= 3711) ||
            (x >= 3150 && x <= 3195 && y >= 2958 && y <= 3003) ||
            (x >= 3645 && x <= 3715 && y >= 3454 && y <= 3550) ||
            (x >= 3150 && x <= 3199 && y >= 3796 && y <= 3869) ||
            (x >= 2994 && x <= 3041 && y >= 3733 && y <= 3790) ||
            (x >= 3136 && x <= 3327 && y >= 3527 && y <= 3650)
        ) {
            return true;
        }
        return false;
    }

    constructor() {
        super([
            new Boundary(2940, 3392, 3525, 3968, 0),
            new Boundary(2986, 3012, 10338, 10366, 0),
            new Boundary(3653, 3720, 3441, 3538, 0),
            new Boundary(3650, 3653, 3457, 3472, 0),
            new Boundary(3150, 3199, 3796, 3869, 0),
            new Boundary(2994, 3041, 3733, 3790, 0),
            new Boundary(3061, 3074, 10253, 10262, 0),
        ]);
    }

    public postEnter(character: Mobile) {
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            player.getPacketSender().sendInteractionOption("Attack", 2, true);
            player.getPacketSender().sendWalkableInterface(197);
            BountyHunter.updateInterface(player);
            if (!BountyHunter.PLAYERS_IN_WILD.includes(player)) {
                BountyHunter.PLAYERS_IN_WILD.push(player);
            }
        }
    }

    public postLeave(character: Mobile, logout: boolean) {
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(-1);
            player.getPacketSender().sendInteractionOption("null", 2, true);
            player.getPacketSender().sendWalkableInterface(-1);
            player.setWildernessLevel(0);
            BountyHunter.PLAYERS_IN_WILD.splice(BountyHunter.PLAYERS_IN_WILD.indexOf(player), 1);
        }
    }

    public process(character: Mobile) {
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            player.setWildernessLevel(WildernessArea.getLevel(player.getLocation().getY()));
            player.getPacketSender().sendString( "Level: " + player.getWildernessLevel(),199);
        }
    }

    public canTeleport(player: Player) {
        if (player.getWildernessLevel() > 20 && player.getRights() != PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Teleport spells are blocked in this level of Wilderness.");
            player.getPacketSender().sendMessage("You must be below level 20 of Wilderness to use teleportation spells.");
            return false;
        }
        return true;
    }

    public canAttack(attacker: Mobile, target: Mobile): CanAttackResponse {
        if (attacker.isPlayer() && target.isPlayer()) {
            let a = attacker.getAsPlayer();
            let t = target.getAsPlayer();


            let combatDifference = CombatFactory.combatLevelDifference(a.getSkillManager().getCombatLevel(),
                t.getSkillManager().getCombatLevel());
            if (combatDifference > a.getWildernessLevel() + 5 || combatDifference > t.getWildernessLevel() + 5) {
                return CanAttackResponse.LEVEL_DIFFERENCE_TOO_GREAT;
            }
            if (!(t.getArea() instanceof WildernessArea)) {
                return CanAttackResponse.CANT_ATTACK_IN_AREA;
            }
        }

        return CanAttackResponse.CAN_ATTACK;
    }

    public canTrade(player: Player, target: Player): boolean {
        return true;
    }

    public isMulti(character: Mobile): boolean {
        let x = character.getLocation().getX();
        let y = character.getLocation().getY();
        return WildernessArea.multi(x, y);
    }

    public canEat(player: Player, itemId: number): boolean {
        return true;
    }

    public canDrink(player: Player, itemId: number): boolean {
        return true;
    }

    public dropItemsOnDeath(player: Player, killer?: Player): boolean {
        return true;
    }
    
    public handleDeath(player: Player, killer?: Player): boolean {
        return false;
    }

    public onPlayerRightClick(player: Player, rightClicked: Player, option: number): void {
    }

    public defeated(player: Player, character: Mobile): void {
        if (character.isPlayer()) {
            BountyHunter.onDeath(player, character.getAsPlayer(), true, 50);
        }
    }

    public overridesNpcAggressionTolerance(player: Player, npcId: number): boolean {
        return true;
    }

    public handleObjectClick(player: Player, objectId: GameObject, type: number): boolean {
        if (Obelisks.activate(objectId.getId())) {
            return true;
        }
        return false;
    }

    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
        // Player Bots can always idle in the Wilderness
        return true;
    }
}
