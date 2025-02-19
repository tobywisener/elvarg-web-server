

import { Location } from "../Location";
import {CastleWars} from '../../content/minigames/impl/CastleWars'
import { Mobile } from "../../entity/impl/Mobile";
import { BarrowsArea } from '../../model/areas/impl/BarrowsArea'
import { DuelArenaArea } from '../../model/areas/impl/DuelArenaArea'
import {GodwarsDungeonArea} from '../../model/areas/impl/GodwarsDugeonArea'
import {KingBlackDragonArea} from '../../model/areas/impl/KingBlackDragonArea'
import {WildernessArea} from '../../model/areas/impl/WildernessArea'
import { Area } from "./Area";
import { CanAttackResponse } from "../../content/combat/CombatFactory";
import { Boundary } from "../Boundary";
import { PestControl } from "../../content/minigames/impl/pestcontrols/PestControl";
import { CastleWarsZamorakWaitingArea } from "./impl/castlewars/CastleWarsZamorakWaitingArea";
import { CastleWarsSaradominWaitingArea } from "./impl/castlewars/CastleWarsSaradominWaitingArea";
import { CastleWarsGameArea } from "./impl/castlewars/CastleWarsGameArea";
import { CastleWarsLobbyArea } from "./impl/castlewars/CastleWarsLobbyArea";

export class AreaManager {

    public static areas: Area[] = [];
/* TODO: Fix Areas
    static {
        AreaManager.areas.push(new BarrowsArea());
        AreaManager.areas.push(new DuelArenaArea());
        AreaManager.areas.push(new WildernessArea());
        AreaManager.areas.push(new KingBlackDragonArea());
        AreaManager.areas.push(new GodwarsDungeonArea());
        AreaManager.areas.push(new CastleWarsLobbyArea());
        AreaManager.areas.push(new CastleWarsZamorakWaitingArea());
        AreaManager.areas.push(new CastleWarsSaradominWaitingArea());
        AreaManager.areas.push(new CastleWarsGameArea());
        AreaManager.areas.push(PestControl.GAME_AREA);
        AreaManager.areas.push(PestControl.NOVICE_BOAT_AREA);
        AreaManager.areas.push(PestControl.OUTPOST_AREA);
    }
*/
    /**
     * Processes areas for the given character.
     *
     * @param c
     */
    public static process(c: Mobile): void {
        let position = c.getLocation();
        let area = c.getArea();

        let previousArea: Area | null = null;

        if (area != null) {
            if (!AreaManager.inside(position, area)) {
                area.leave(c, false);
                previousArea = area;
                area = null;
            }
        }

        if (area == null) {
            area = AreaManager.get(position);
            if (area != null) {
                area.enter(c);
            }
        }

        // Handle processing..
        if (area != null) {
            area.process(c);
        }

        // Handle multiicon update..
        if (c.isPlayer()) {
            let player = c.getAsPlayer();

            let multiIcon = 0;

            if (area != null) {
                multiIcon = area.isMulti(player) ? 1 : 0;
            }

            if (player.getMultiIcon() != multiIcon) {
                player.getPacketSender().sendMultiIcon(multiIcon);
            }
        }

        // Update area..
        c.setArea(area);

        // Handle postLeave...
        if (previousArea != null) {
            previousArea.postLeave(c, false);
        }
    }

    public static inMulti(c: Mobile): boolean {
        if (c.getArea() != null) {
            return c.getArea().isMulti(c);
        }
        return false;
    }

    /**
     * Checks if a {@link Mobile} can attack another one.
     *
     * @param attacker
     * @param target
     * @return {CanAttackResponse}
     */
    public static canAttack(attacker: Mobile, target: Mobile):CanAttackResponse {
        if (attacker.getPrivateArea() != target.getPrivateArea()) {
            return CanAttackResponse.CANT_ATTACK_IN_AREA;
        }

        if (attacker.getArea() != null) {
            return attacker.getArea().canAttack(attacker, target);
        }

        // Don't allow PvP by default
        if (attacker.isPlayer() && target.isPlayer()) {
            return CanAttackResponse.CANT_ATTACK_IN_AREA;
        }

        return CanAttackResponse.CAN_ATTACK;
    }

    /**
     * Gets a {@link Area} based on a given {@link Location}.
     *
     * @param position
     * @return
     */
    public static get(position: Location): Area | null {
        for (let area of this.areas) {
            if (AreaManager.inside(position, area)) {
                return area;
            }
        }
        return null;
    }

    /**
     * Checks if a position is inside of an area's boundaries.
     *
     * @param position
     * @return
     */
    public static inside(position: Location, area: Area): boolean {
        for (let b of area.getBoundaries()) {
            if (b.inside(position)) {
                return true;
            }
        }
        return false;
    }
}
