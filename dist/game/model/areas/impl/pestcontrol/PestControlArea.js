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
exports.PestControlArea = void 0;
var PrivateArea_1 = require("../PrivateArea");
var PestControl_1 = require("../../../../content/minigames/impl/pestcontrols/PestControl");
var Boundary_1 = require("../../../Boundary");
var MinigameHandler_1 = require("../../../../content/minigames/MinigameHandler");
var MagicSpellbook_1 = require("../../../MagicSpellbook");
var PrayerHandler_1 = require("../../../../content/PrayerHandler");
var EquipPacketListener_1 = require("../../../../../net/packet/impl/EquipPacketListener");
var ObjectDefinition_1 = require("../../../../definition/ObjectDefinition");
var GameObject_1 = require("../../../../entity/impl/object/GameObject");
var ObjectManager_1 = require("../../../../entity/impl/object/ObjectManager");
var Location_1 = require("../../../Location");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var PestControlArea = exports.PestControlArea = /** @class */ (function (_super) {
    __extends(PestControlArea, _super);
    function PestControlArea() {
        return _super.call(this, [new Boundary_1.Boundary(2616, 2691, 2556, 2624)]) || this;
    }
    /**
     * Returns the singleton instance of the Pest Control minigame.
     * <p>
     * Will fetch it if not already populated.
     *
     * @return
     */
    PestControlArea.prototype.getMinigame = function () {
        if (this.minigame == null) {
            this.minigame = MinigameHandler_1.MinigameHandler.PEST_CONTROL.get();
        }
        return this.minigame;
    };
    PestControlArea.prototype.postEnter = function (character) {
        if (!character.isPlayer()) {
            return;
        }
        character.setWalkableInterfaceId(21100);
    };
    PestControlArea.prototype.allowSummonPet = function (player) {
        player.sendMessage("The squire doesn't allow you to bring your pet with you.");
        return false;
    };
    PestControlArea.prototype.allowDwarfCannon = function (player) {
        player.sendMessage("Cannons are not allowed in pest control.");
        return false;
    };
    PestControlArea.prototype.isSpellDisabled = function (player, spellbook, spellId) {
        var alch = spellbook == MagicSpellbook_1.MagicSpellbook.NORMAL && [1162, 1178].some(function (a) { return a == spellId; });
        if (alch) {
            player.getPacketSender().sendMessage("You cannot use this spell in Pest Control.");
            return true;
        }
        return false;
    };
    PestControlArea.prototype.process = function (character) {
        if (this.minigame.isActive()) {
            // Prevent any processing if the game is not actually underway.
            return;
        }
        if (character.isNpc()) {
            // Process npcs
            // TODO: Make brawlers path to void knight
            return;
        }
        if (character.isPlayerBot()) {
            // Handle player bots
            return;
        }
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            // Process player actions
        }
    };
    PestControlArea.prototype.postLeave = function (character, logout) {
        if (!character.isPlayer()) {
            return;
        }
        var player = character.getAsPlayer();
        if (logout) {
            // If player has logged out, move them to gangplank
            player.moveTo(PestControl_1.PestControl.GANG_PLANK_START);
        }
        player.setPoisonDamage(0);
        PrayerHandler_1.PrayerHandler.resetAll(player);
        player.getCombat().reset();
        player.getInventory().resetItems().refreshItems();
        player.resetAttributes();
        player.setSpecialPercentage(100);
        player.setAttribute("pcDamage", 0);
        EquipPacketListener_1.EquipPacketListener.resetWeapon(player, true);
    };
    PestControlArea.prototype.canTeleport = function (player) {
        player.getPacketSender().sendMessage("You cannot teleport out of pest control!");
        return false;
    };
    PestControlArea.prototype.isMulti = function (character) {
        // Pest Control is multi combat
        return true;
    };
    PestControlArea.prototype.dropItemsOnDeath = function (player, killer) {
        return false;
    };
    PestControlArea.prototype.onPlayerDealtDamage = function (player, target, hit) {
        var pcDamage = "pcDamage";
        var pendingDamage = hit.getTotalDamage();
        if (pendingDamage === 0) {
            return;
        }
        var damage = player.getAttribute(pcDamage);
        if (damage === undefined) {
            player.setAttribute(pcDamage, new Number(pendingDamage));
            return;
        }
        player.setAttribute(pcDamage, Number(damage) + pendingDamage);
    };
    PestControlArea.prototype.handleDeath = function (player, killer) {
        player.smartMoves(PestControlArea.LAUNCHER_BOAT_BOUNDARY);
        // Returning true means default death behavior is avoided.
        return true;
    };
    PestControlArea.prototype.handleObjectClick = function (player, object, optionId) {
        var _a;
        var objLoc = object.getLocation();
        var oX = objLoc.getX();
        var oY = objLoc.getY();
        var objectId = object.getId();
        var direction = object.getFace();
        var myX = player.getLocation().getX();
        var myY = player.getLocation().getY();
        switch (objectId) {
            // adicione os casos para cada objectId, se necessário
        }
        /**
         * Simple ladder formula
         */
        if (objectId == ObjectIdentifiers_1.ObjectIdentifiers.LADDER_174) {
            var down = direction == 1 && myX < oX || direction == 3 && myX > oX || direction == 0 && myY < oY;
            player.climb(down, down ? new Location_1.Location((direction == 0 ? oX : direction == 1 ? oX + 1 : oX - 1), (direction == 1 ? oY : direction == 3 ? oY : oY + 1)) : new Location_1.Location(direction == 1 ? oX - 1 : direction == 3 ? oX + 1 : oX, direction == 0 ? oY - 1 : oY));
            return true;
        }
        if (objectId >= 14233 && objectId <= 14236) {
            var defs = ObjectDefinition_1.ObjectDefinition.forId(objectId);
            if (defs == null) {
                console.error("no defs for objid=".concat(objectId));
                return false;
            }
            var open_1 = (_a = ObjectDefinition_1.ObjectDefinition.interactions) === null || _a === void 0 ? void 0 : _a.some(function (d) { return d === null || d === void 0 ? void 0 : d.includes("Open"); });
            var westernGate = oX == 2643;
            var southernGate = oY == 2585;
            var easternGate = oX == 2670;
            var spawn = objLoc;
            var gate = object;
            console.error("direction=".concat(direction, " open=").concat(open_1, " ").concat(objLoc.toString(), " newOffset=").concat(this.getGateDirectionOffset(direction, objectId, open_1)));
            if (open_1) {
                spawn = new Location_1.Location(westernGate ? objLoc.getX() - 1 : easternGate ? objLoc.getX() + 1 : objLoc.getX(), southernGate ? objLoc.getY() - 1 : objLoc.getY());
                gate = new GameObject_1.GameObject(objectId == 14233 ? 14234 : 14236, spawn, object.getType(), this.getGateDirectionOffset(direction, objectId, true), object.getPrivateArea());
            }
            else {
                spawn = new Location_1.Location(oX == 2642 ? oX + 1 : oX == 2671 ? objLoc.getX() - 1 : objLoc.getX(), oY == 2584 ? objLoc.getY() + 1 : objLoc.getY());
                gate = new GameObject_1.GameObject(objectId == 14234 ? 14233 : 14235, spawn, object.getType(), this.getGateDirectionOffset(direction, objectId, false), object.getPrivateArea());
            }
            ObjectManager_1.ObjectManager.deregister(object, true);
            ObjectManager_1.ObjectManager.register(gate, true);
            return true;
        }
        return false;
    };
    PestControlArea.prototype.getGateDirectionOffset = function (direction, objectId, opening) {
        if (opening) {
            if (direction === 0) {
                if (objectId === 14233) {
                    return 1;
                }
                if (objectId === 14235) {
                    return 3;
                }
            }
            else if (direction === 3) {
                if (objectId === 14233) {
                    return 4;
                }
                if (objectId === 14235) {
                    return 2;
                }
            }
            else if (direction === 2) {
                if (objectId === 14233) {
                    return 3;
                }
                if (objectId === 14235) {
                    return 1;
                }
            }
        }
        else {
            if (direction === 1) {
                if (objectId === 14234) {
                    return 0;
                }
                if (objectId === 14236) {
                    return 2;
                }
            }
            else if (direction === 2) {
                if (objectId === 14236) {
                    return 3;
                }
            }
            else if (direction === 3) {
                if (objectId === 14236) {
                    return 0;
                }
                if (objectId === 14234) {
                    return 2;
                }
            }
            else if (direction === 4) {
                if (objectId === 14234) {
                    return 3;
                }
            }
        }
        return -1;
    };
    PestControlArea.LAUNCHER_BOAT_BOUNDARY = new Boundary_1.Boundary(2656, 2659, 2609, 2614);
    return PestControlArea;
}(PrivateArea_1.PrivateArea));
//# sourceMappingURL=PestControlArea.js.map