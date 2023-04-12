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
exports.AreaManager = void 0;
var BarrowsArea_1 = require("../../model/areas/impl/BarrowsArea");
var DuelArenaArea_1 = require("../../model/areas/impl/DuelArenaArea");
var GodwarsDugeonArea_1 = require("../../model/areas/impl/GodwarsDugeonArea");
var KingBlackDragonArea_1 = require("../../model/areas/impl/KingBlackDragonArea");
var WildernessArea_1 = require("../../model/areas/impl/WildernessArea");
var CombatFactory_1 = require("../../content/combat/CombatFactory");
var PestControl_1 = require("../../content/minigames/impl/pestcontrols/PestControl");
var CastleWarsZamorakWaitingArea_1 = require("./impl/castlewars/CastleWarsZamorakWaitingArea");
var CastleWarsSaradominWaitingArea_1 = require("./impl/castlewars/CastleWarsSaradominWaitingArea");
var CastleWarsGameArea_1 = require("./impl/castlewars/CastleWarsGameArea");
var CastleWarsLobbyArea_1 = require("./impl/castlewars/CastleWarsLobbyArea");
var AreaManager = exports.AreaManager = /** @class */ (function () {
    function AreaManager() {
    }
    /**
     * Processes areas for the given character.
     *
     * @param c
     */
    AreaManager.process = function (c) {
        var position = c.getLocation();
        var area = c.getArea();
        var previousArea = null;
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
            var player = c.getAsPlayer();
            var multiIcon = 0;
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
    };
    AreaManager.inMulti = function (c) {
        if (c.getArea() != null) {
            return c.getArea().isMulti(c);
        }
        return false;
    };
    /**
     * Checks if a {@link Mobile} can attack another one.
     *
     * @param attacker
     * @param target
     * @return {CanAttackResponse}
     */
    AreaManager.canAttack = function (attacker, target) {
        if (attacker.getPrivateArea() != target.getPrivateArea()) {
            return CombatFactory_1.CanAttackResponse.CANT_ATTACK_IN_AREA;
        }
        if (attacker.getArea() != null) {
            return attacker.getArea().canAttack(attacker, target);
        }
        // Don't allow PvP by default
        if (attacker.isPlayer() && target.isPlayer()) {
            return CombatFactory_1.CanAttackResponse.CANT_ATTACK_IN_AREA;
        }
        return CombatFactory_1.CanAttackResponse.CAN_ATTACK;
    };
    /**
     * Gets a {@link Area} based on a given {@link Location}.
     *
     * @param position
     * @return
     */
    AreaManager.get = function (position) {
        var e_1, _a;
        try {
            for (var _b = __values(this.areas), _c = _b.next(); !_c.done; _c = _b.next()) {
                var area = _c.value;
                if (AreaManager.inside(position, area)) {
                    return area;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    /**
     * Checks if a position is inside of an area's boundaries.
     *
     * @param position
     * @return
     */
    AreaManager.inside = function (position, area) {
        var e_2, _a;
        try {
            for (var _b = __values(area.getBoundaries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                if (b.inside(position)) {
                    return true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    AreaManager.areas = [];
    (function () {
        AreaManager.areas.push(new BarrowsArea_1.BarrowsArea());
        AreaManager.areas.push(new DuelArenaArea_1.DuelArenaArea());
        AreaManager.areas.push(new WildernessArea_1.WildernessArea());
        AreaManager.areas.push(new KingBlackDragonArea_1.KingBlackDragonArea());
        AreaManager.areas.push(new GodwarsDugeonArea_1.GodwarsDungeonArea());
        AreaManager.areas.push(new CastleWarsLobbyArea_1.CastleWarsLobbyArea());
        AreaManager.areas.push(new CastleWarsZamorakWaitingArea_1.CastleWarsZamorakWaitingArea());
        AreaManager.areas.push(new CastleWarsSaradominWaitingArea_1.CastleWarsSaradominWaitingArea());
        AreaManager.areas.push(new CastleWarsGameArea_1.CastleWarsGameArea());
        AreaManager.areas.push(PestControl_1.PestControl.GAME_AREA);
        AreaManager.areas.push(PestControl_1.PestControl.NOVICE_BOAT_AREA);
        AreaManager.areas.push(PestControl_1.PestControl.OUTPOST_AREA);
    })();
    return AreaManager;
}());
//# sourceMappingURL=AreaManager.js.map