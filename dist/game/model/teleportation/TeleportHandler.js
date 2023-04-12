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
exports.TeleportHandler = void 0;
var WildernessArea_1 = require("../areas/impl/WildernessArea");
var AreaManager_1 = require("../areas/AreaManager");
var GameConstants_1 = require("../../GameConstants");
var Task_1 = require("../../task/Task");
var TaskManager_1 = require("../../task/TaskManager");
var EffectTimer_1 = require("../EffectTimer");
var TeleportButton_1 = require("./TeleportButton");
var Sound_1 = require("../../Sound");
var Sounds_1 = require("../../Sounds");
var TelportHandlerTask = /** @class */ (function (_super) {
    __extends(TelportHandlerTask, _super);
    function TelportHandlerTask(n1, p, b, execFunc) {
        var _this = _super.call(this, n1, p, b) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    TelportHandlerTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return TelportHandlerTask;
}(Task_1.Task));
var TeleportHandler = /** @class */ (function () {
    function TeleportHandler() {
    }
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
    TeleportHandler.teleport = function (player, targetLocation, teleportType, wildernessWarning) {
        var _this = this;
        if (wildernessWarning) {
            var warning = "";
            var area = AreaManager_1.AreaManager.get(targetLocation);
            var wilderness = area instanceof WildernessArea_1.WildernessArea;
            var wildernessLevel = WildernessArea_1.WildernessArea.getLevel(targetLocation.getY());
            if (wilderness) {
                warning += "Are you sure you want to teleport there? ";
                if (wildernessLevel > 0) {
                    warning += "It's in level @red@" + wildernessLevel + "@bla@ wilderness! ";
                    if (WildernessArea_1.WildernessArea.multi(targetLocation.getX(), targetLocation.getY())) {
                        warning += "Additionally, @red@it's a multi zone@bla@. Other players may attack you simultaneously.";
                    }
                    else {
                        warning += "Other players will be able to attack you.";
                    }
                }
                else {
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
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.TELEPORT); // assuming that the function Sounds.sendSound is replaced by a local function sendSound. 
        TaskManager_1.TaskManager.submit(new TelportHandlerTask(1, player, true, function () {
            var tick = 0;
            if (tick == teleportType.getStartTick() - 2) {
                if (teleportType.getMiddleAnim()) {
                    player.performAnimation(teleportType.getMiddleAnim());
                }
                if (teleportType.getMiddleGraphic()) {
                    player.performGraphic(teleportType.getMiddleGraphic());
                }
            }
            else if (tick == teleportType.getStartTick()) {
                _this.onTeleporting(player);
                player.performAnimation(teleportType.getEndAnimation());
                player.performGraphic(teleportType.getEndGraphic());
                player.setOldPosition(targetLocation);
            }
            else if (tick == teleportType.getStartTick() + 2) {
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
    };
    TeleportHandler.onTeleporting = function (player) {
        player.getSkillManager().stopSkillable();
        player.getPacketSender().sendInterfaceRemoval();
        player.getCombat().reset();
    };
    TeleportHandler.checkReqs = function (player, targetLocation) {
        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return false;
        }
        if (!player.getCombat().getTeleblockTimer().finished()) {
            if (player.getArea() instanceof WildernessArea_1.WildernessArea) {
                player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");
                return false;
            }
            else {
                player.getCombat().getTeleblockTimer().stop();
                player.getPacketSender().sendEffectTimer(0, EffectTimer_1.EffectTimer.TELE_BLOCK);
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
    };
    TeleportHandler.handleButton = function (player, buttonId, menuId) {
        var teleportButton = TeleportButton_1.TeleportButton.get(buttonId);
        if (teleportButton != null) {
            if (player.getWildernessLevel() > 0) {
                player.getPacketSender().sendMessage("You can only use tablet to teleport out from wilderness.");
                return true;
            }
            switch (menuId) {
                case 0: // Click to teleport
                    if (teleportButton == TeleportButton_1.TeleportButton.HOME) {
                        if (TeleportHandler.checkReqs(player, GameConstants_1.GameConstants.DEFAULT_LOCATION)) {
                            TeleportHandler.teleport(player, GameConstants_1.GameConstants.DEFAULT_LOCATION, player.getSpellbook().getTeleportType(), false);
                            player.getPreviousTeleports().get(teleportButton);
                        }
                        return true;
                    }
                    player.getPacketSender().sendTeleportInterface(teleportButton.menu);
                    return true;
                case 1: // Previous option on teleport
                    if (player.getPreviousTeleports().get(teleportButton)) {
                        var tele = player.getPreviousTeleports().get(teleportButton);
                        if (TeleportHandler.checkReqs(player, tele)) {
                            TeleportHandler.teleport(player, tele, player.getSpellbook().getTeleportType(), true);
                        }
                    }
                    else {
                        player.getPacketSender().sendMessage("Unable to find a previous teleport.");
                    }
                    player.getPacketSender().sendInterfaceRemoval();
                    return true;
            }
        }
        return false;
    };
    return TeleportHandler;
}());
exports.TeleportHandler = TeleportHandler;
//# sourceMappingURL=TeleportHandler.js.map