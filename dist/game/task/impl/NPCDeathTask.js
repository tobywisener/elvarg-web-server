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
exports.NPCDeathTask = void 0;
var Task_1 = require("../Task");
var World_1 = require("../../World");
var Slayer_1 = require("../../../game/content/skill/slayer/Slayer");
var NPCDropGenerator_1 = require("../../../game/entity/impl/npc/NPCDropGenerator");
var Barricades_1 = require("../../entity/impl/npc/impl/Barricades");
var Animation_1 = require("../../model/Animation");
var TaskManager_1 = require("../TaskManager");
var NPCRespawnTask_1 = require("../impl/NPCRespawnTask");
var NPCDeathTask = /** @class */ (function (_super) {
    __extends(NPCDeathTask, _super);
    /**
     * The NPCDeathTask constructor.
     *
     * @param npc The npc being killed.
     */
    function NPCDeathTask(npc) {
        var _this = _super.call(this, 2) || this;
        _this.npc = npc;
        _this.ticks = 1;
        return _this;
    }
    NPCDeathTask.prototype.execute = function () {
        switch (this.ticks) {
            case 1:
                this.npc.getMovementQueue().setBlockMovement(true).reset();
                this.killer = this.npc.getCombat().getKiller(true);
                this.npc.performAnimation(new Animation_1.Animation(this.npc.getCurrentDefinition().getDeathAnim()));
                this.npc.getCombat().reset();
                this.npc.setMobileInteraction(null);
                break;
            case 0:
                if (this.killer !== undefined) {
                    if (this.killer.getArea() !== null) {
                        this.killer.getArea().defeated(this.killer, this.npc);
                    }
                    Slayer_1.Slayer.killed(this.killer, this.npc);
                    NPCDropGenerator_1.NPCDropGenerator.start(this.killer, this.npc);
                }
                this.stop();
                break;
        }
        this.ticks--;
    };
    NPCDeathTask.prototype.stop = function () {
        _super.prototype.stop.call(this);
        if (this.npc.getArea() !== null) {
            this.npc.getArea().leave(this.npc, false);
            this.npc.getArea().postLeave(this.npc, false);
            this.npc.setArea(null);
        }
        this.npc.setDying(false);
        this.npc.setNpcTransformationId(-1);
        if (this.npc.getDefinition().getRespawn() > 0) {
            TaskManager_1.TaskManager.submit(new NPCRespawnTask_1.NPCRespawnTask(this.npc, this.npc.getDefinition().getRespawn()));
        }
        if (this.npc.isBarricade()) {
            Barricades_1.Barricades.checkTile(this.npc.getLocation());
        }
        World_1.World.getRemoveNPCQueue().push(this.npc);
    };
    return NPCDeathTask;
}(Task_1.Task));
exports.NPCDeathTask = NPCDeathTask;
//# sourceMappingURL=NPCDeathTask.js.map