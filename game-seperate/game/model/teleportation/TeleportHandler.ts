
import { Player } from "../../entity/impl/player/Player";
import { WildernessArea } from "../areas/impl/WildernessArea";
import { AreaManager } from "../areas/AreaManager";
import { TeleportType } from "./TeleportType";
import { GameConstants } from "../../GameConstants";
import { Task } from "../../task/Task";
import { TaskManager } from "../../task/TaskManager";
import { EffectTimer } from "../EffectTimer";
import { TeleportButton } from './TeleportButton'
import { Sound } from "../../Sound";
import { Sounds } from "../../Sounds";
import { Location } from "../Location";

class TelportHandlerTask extends Task {
    execute(): void {
        this.execFunc();
        this.stop();
    }
    constructor(n1: number, p: Player, b: boolean, private readonly execFunc: Function) {
        super(n1, p, b);
    }

}

export class TeleportHandler {

    /**
     * Teleports a player to the target location.
     *
     * @param player
     *            The player teleporting.
     * @param targetLocation
     *            The location to teleport to.
     * @param teleportType
     *            The type of teleport.
     */
    public static teleport(player: Player, targetLocation: Location, teleportType: TeleportType, wildernessWarning: boolean): void {
        if (wildernessWarning) {
            let warning = "";
            const area = AreaManager.get(targetLocation);
            const wilderness = area instanceof WildernessArea;
            const wildernessLevel = WildernessArea.getLevel(targetLocation.getY());
            if (wilderness) {
                warning += "Are you sure you want to teleport there? ";
                if (wildernessLevel > 0) {
                    warning += "It's in level @red@" + wildernessLevel + "@bla@ wilderness! ";
                    if (WildernessArea.multi(targetLocation.getX(), targetLocation.getY())) {
                        warning += "Additionally, @red@it's a multi zone@bla@. Other players may attack you simultaneously.";
                    } else {
                        warning += "Other players will be able to attack you.";
                    }
                } else {
                    warning += "Other players will be able to attack you.";
                }
                return;
            }
        }
        player.getMovementQueue().setBlockMovement(true).reset();
        this.onTeleporting(player);
        player.performAnimation(teleportType.getStartAnimation());
        player.performGraphic(teleportType.getStartGraphic());
        player.setUntargetable(true);
        player.setTeleporting(true);
        Sounds.sendSound(player, Sound.TELEPORT); // assuming that the function Sounds.sendSound is replaced by a local function sendSound. 
        TaskManager.submit(new TelportHandlerTask(1, player, true, () => {
            let tick: number = 0;
            if (tick == teleportType.getStartTick() - 2) {
                if (teleportType.getMiddleAnim()) {
                    player.performAnimation(teleportType.getMiddleAnim());
                }
                if (teleportType.getMiddleGraphic()) {
                    player.performGraphic(teleportType.getMiddleGraphic());
                }
            } else if (tick == teleportType.getStartTick()) {
                this.onTeleporting(player);
                player.performAnimation(teleportType.getEndAnimation());
                player.performGraphic(teleportType.getEndGraphic());
                player.setOldPosition(targetLocation);
            } else if (tick == teleportType.getStartTick() + 2) {
                player.getMovementQueue().setBlockMovement(false).reset();
                stop();
                return;
            }
            tick++;
            stop();
            player.getClickDelay().reset(0);
            player.setUntargetable(false);
        }));
        player.getClickDelay().reset();
    }



    private static onTeleporting(player: Player): void {
        player.getSkillManager().stopSkillable();
        player.getPacketSender().sendInterfaceRemoval();
        player.getCombat().reset();
    }

    public static checkReqs(player: Player, targetLocation: Location): boolean {
        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return false;
        }

        if (!player.getCombat().getTeleblockTimer().finished()) {
            if (player.getArea() instanceof WildernessArea) {
                player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");
                return false;
            } else {
                player.getCombat().getTeleblockTimer().stop();
                player.getPacketSender().sendEffectTimer(0, EffectTimer.TELE_BLOCK);
            }
        }

        if (player.getMovementQueue().isMovementBlocked()) {
            return false;
        }

        if (player.getArea() != null) {
            if (!player.getArea().canTeleport(player)) {
                return false;
            }
        }

        return true;
    }

    public static handleButton(player: Player, buttonId: number, menuId: number): boolean {
        const teleportButton = TeleportButton.get(buttonId);
        if (teleportButton != null) {
            if (player.getWildernessLevel() > 0) {
                player.getPacketSender().sendMessage("You can only use tablet to teleport out from wilderness.");
                return true;
            }
            switch (menuId) {
                case 0: // Click to teleport
                    if (teleportButton == TeleportButton.HOME) {
                        if (TeleportHandler.checkReqs(player, GameConstants.DEFAULT_LOCATION)) {
                            TeleportHandler.teleport(player, GameConstants.DEFAULT_LOCATION,
                                player.getSpellbook().getTeleportType(), false);
                            player.getPreviousTeleports().get(teleportButton);
                        }
                        return true;
                    }
                    player.getPacketSender().sendTeleportInterface(teleportButton.menu);
                    return true;
                case 1: // Previous option on teleport
                    if (player.getPreviousTeleports().get(teleportButton)) {
                        const tele = player.getPreviousTeleports().get(teleportButton);
                        if (TeleportHandler.checkReqs(player, tele)) {
                            TeleportHandler.teleport(player, tele, player.getSpellbook().getTeleportType(), true);
                        }
                    } else {
                        player.getPacketSender().sendMessage("Unable to find a previous teleport.");
                    }
                    player.getPacketSender().sendInterfaceRemoval();
                    return true;
            }
        }
        return false;
    }
}
