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
exports.Barricades = void 0;
var Sound_1 = require("../../../../Sound");
var Sounds_1 = require("../../../../Sounds");
var World_1 = require("../../../../World");
var RegionManager_1 = require("../../../../collision/RegionManager");
var Firemaking_1 = require("../../../../content/skill/skillable/impl/Firemaking");
var NPC_1 = require("../NPC");
var Animation_1 = require("../../../../model/Animation");
var Item_1 = require("../../../../model/Item");
var Location_1 = require("../../../../model/Location");
var Skill_1 = require("../../../../model/Skill");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var BarricadesTask = /** @class */ (function (_super) {
    __extends(BarricadesTask, _super);
    function BarricadesTask(p, execFunc) {
        var _this = _super.call(this, 3, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    BarricadesTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return BarricadesTask;
}(Task_1.Task));
var Barricades = exports.Barricades = /** @class */ (function () {
    function Barricades() {
    }
    Barricades.getBlackListedTiles = function (player, requestedTile) {
        return [new Location_1.Location(1, 1)].find(function (t) { return t.equals(requestedTile); }) !== undefined;
    };
    Barricades.checkTile = function (tile) {
        var _this = this;
        this.barricades.forEach(function (t) {
            if (t.equals(tile)) {
                RegionManager_1.RegionManager.removeClipping(t.getX(), t.getY(), t.getZ(), 0x200000, null);
                var index = _this.barricades.indexOf(t);
                if (index !== -1) {
                    _this.barricades.splice(index, 1);
                }
            }
        });
    };
    Barricades.canSetup = function (player) {
        var tile = player.getLocation();
        var existsAtTile = this.barricades.find(function (t) { return t.equals(tile); }) !== undefined;
        if (existsAtTile) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        if (RegionManager_1.RegionManager.getClipping(tile.getX(), tile.getY(), tile.getZ(), player.getPrivateArea()) !== 0) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        this.deploy(player);
        return true;
    };
    Barricades.handleTinderbox = function (player, npc) {
        var _this = this;
        if (npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is already on fire!");
            return;
        }
        if (!player.getInventory().contains(590)) {
            player.getPacketSender().sendMessage("You need a tinderbox to set the barricade on fire.");
            return;
        }
        player.performAnimation(Firemaking_1.Firemaking.LIGHT_FIRE);
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.FIRE_FIRST_ATTEMPT);
        TaskManager_1.TaskManager.submit(new BarricadesTask(player, function () {
            npc.setNpcTransformationId(_this.NPC_ID_BURNING);
            npc.barricadeOnFire = true;
            player.getSkillManager().addExperiences(Skill_1.Skill.FIREMAKING, Barricades.FIREMAKING_EXPERIENCE);
            player.performAnimation(Animation_1.Animation.DEFAULT_RESET_ANIMATION);
        }));
    };
    Barricades.handleBucketOfWater = function (player, npc) {
        if (!npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is not on fire.");
            return;
        }
        if (!player.getInventory().contains(1929)) {
            player.getPacketSender().sendMessage("You need a bucket of water to extinguish the fire.");
            return;
        }
        player.getInventory().deletes(new Item_1.Item(1929, 1));
        player.getInventory().addItem(new Item_1.Item(1925, 1));
        npc.setNpcTransformationId(this.NPC_ID);
        npc.barricadeOnFire = false;
        player.getPacketSender().sendMessage("You put out the fire!");
    };
    /**
     * Upon placing and passing successful checks.
     * @param player
     */
    Barricades.deploy = function (player) {
        var tile = player.getLocation();
        RegionManager_1.RegionManager.addClipping(tile.getX(), tile.getY(), tile.getZ(), 0x200000, player.getPrivateArea());
        player.getInventory().deleteNumber(this.ITEM_ID, 1);
        this.barricades.push(tile);
        World_1.World.getAddNPCQueue().push(new NPC_1.NPC(this.NPC_ID, tile.clone()));
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.PICK_UP_ITEM);
    };
    Barricades.handleInteractiveOptions = function (player, npc, opcode) {
        var isBarricade = [this.NPC_ID, this.NPC_ID_BURNING].some(function (n) { return n === npc.getId(); });
        if (!isBarricade) {
            return false;
        }
        if (opcode === 17) {
            /**
             * Option 2 (BURN/EXTINGUISH)
             */
            if (npc.barricadeOnFire) {
                this.handleBucketOfWater(player, npc);
                return true;
            }
            this.handleTinderbox(player, npc);
            return true;
        }
        return false;
    };
    Barricades.itemOnBarricade = function (player, npc, item) {
        switch (item.getId()) {
            case 590:
                Barricades.handleTinderbox(player, npc);
                return true;
            case 1929:
                this.handleBucketOfWater(player, npc);
                return true;
            default:
                return false;
        }
    };
    Barricades.NPC_ID = 5722;
    Barricades.NPC_ID_BURNING = 5723;
    Barricades.ITEM_ID = 4053;
    Barricades.FIREMAKING_EXPERIENCE = 10;
    Barricades.barricades = [];
    return Barricades;
}());
//# sourceMappingURL=Barricades.js.map