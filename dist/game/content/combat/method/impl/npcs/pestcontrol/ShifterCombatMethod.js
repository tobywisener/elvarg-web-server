"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShifterCombatMethod = void 0;
var CombatType_1 = require("../../../../CombatType");
var Location_1 = require("../../../../../../model/Location");
var World_1 = require("../../../../../../World");
var PathFinder_1 = require("../../../../../../model/movement/path/PathFinder");
var MeleeCombatMethod_1 = require("../../MeleeCombatMethod");
var Task_1 = require("../../../../../../task/Task");
var TaskManager_1 = require("../../../../../../task/TaskManager");
var Graphic_1 = require("../../../../../../model/Graphic");
var NpcIdentifiers_1 = require("../../../../../../../util/NpcIdentifiers");
var ShifterCombatMethod = exports.ShifterCombatMethod = /** @class */ (function (_super) {
    __extends(ShifterCombatMethod, _super);
    function ShifterCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShifterCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MELEE;
    };
    ShifterCombatMethod.prototype.onTick = function (npc, target) {
        if (npc == null || npc.isDyingFunction()) {
            return;
        }
        var knight = World_1.World.getNpcs().stream()
            .find(function (n) { return n != null && n.getId() == NpcIdentifiers_1.NpcIdentifiers.VOID_KNIGHT_8; });
        if (!knight) {
            return;
        }
        var knightNPC = knight.getAsNpc();
        if (target == null) {
            if (Math.random() <= 0.2) {
                // 20% chance to tp to middle
                this.teleport(npc, null, true);
                PathFinder_1.PathFinder.calculateEntityRoute(npc, knightNPC.getLocation().getX(), knightNPC.getLocation().getY());
                npc.getCombat().setTarget(knightNPC);
            }
            else {
                var players = World_1.World.getPlayers();
                var p = players.stream().find(function (n) { return n !== null && n.getLocation().isWithinDistance(n.getLocation(), 10); });
                if (!p) {
                    return;
                }
                var t = p;
                PathFinder_1.PathFinder.calculateEntityRoute(npc, p.getLocation().getX(), p.getLocation().getY());
                npc.getCombat().setTarget(t);
            }
        }
        else {
            var distance = target.getLocation().getDistance(npc.getLocation());
            if (distance > 1) {
                if (Math.random() <= 0.1) {
                    this.teleport(npc, target, false);
                }
            }
        }
    };
    ShifterCombatMethod.prototype.teleport = function (npc, target, center) {
        World_1.World.sendLocalGraphics(654, npc.getLocation());
        TaskManager_1.TaskManager.submit(new ShifterTask(function () {
            var _a;
            var ticks = 0;
            ticks++;
            if (ticks === 1) {
                if (center) {
                    target.smartMove(ShifterCombatMethod.CENTER, 2);
                }
                else {
                    target.smartMove((_a = target === null || target === void 0 ? void 0 : target.getLocation()) !== null && _a !== void 0 ? _a : new Location_1.Location(0, 0, 0), 2);
                }
                npc.performGraphic(new Graphic_1.Graphic(654));
            }
            if (ticks === 2) {
                npc.performGraphic(new Graphic_1.Graphic(654));
                stop();
            }
        }));
    };
    ShifterCombatMethod.CENTER = new Location_1.Location(2657, 2592, 0);
    return ShifterCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
var ShifterTask = /** @class */ (function (_super) {
    __extends(ShifterTask, _super);
    function ShifterTask(execFunc) {
        var _this = _super.call(this, 1, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    ShifterTask.prototype.execute = function () {
        this.execFunc();
    };
    return ShifterTask;
}(Task_1.Task));
//# sourceMappingURL=ShifterCombatMethod.js.map