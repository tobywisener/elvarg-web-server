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
exports.Sheep = void 0;
var Sound_1 = require("../../../../Sound");
var Sounds_1 = require("../../../../Sounds");
var ItemOnGroundManager_1 = require("../../../impl/grounditem/ItemOnGroundManager");
var NPC_1 = require("../NPC");
var Animation_1 = require("../../../../model/Animation");
var Item_1 = require("../../../../model/Item");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var SheepTask = /** @class */ (function (_super) {
    __extends(SheepTask, _super);
    function SheepTask(n, execFunc) {
        var _this = _super.call(this, 3, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    SheepTask.prototype.execute = function () {
        this.execFunc();
    };
    return SheepTask;
}(Task_1.Task));
var TaskSheep = /** @class */ (function (_super) {
    __extends(TaskSheep, _super);
    function TaskSheep(n, execFunc) {
        var _this = _super.call(this, 13, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    TaskSheep.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return TaskSheep;
}(Task_1.Task));
var Sheep = exports.Sheep = /** @class */ (function (_super) {
    __extends(Sheep, _super);
    function Sheep() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sheep.prototype.firstOptionClick = function (player, npc) {
        this.shear(player, npc);
    };
    Sheep.prototype.secondOptionClick = function (player, npc) {
    };
    Sheep.prototype.thirdOptionClick = function (player, npc) {
    };
    Sheep.prototype.forthOptionClick = function (player, npc) {
    };
    Sheep.prototype.useItemOnNpc = function (player, npc, itemId, slot) {
        if (itemId !== ItemIdentifiers_1.ItemIdentifiers.SHEARS) {
            return;
        }
        this.shear(player, npc);
    };
    /**
     * Function to handle shearing of sheep.
     *
     * @param player
     */
    Sheep.prototype.shear = function (player, npc) {
        var _this = this;
        if (!player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.SHEARS)) {
            player.getPacketSender().sendMessage("You need a set of shears to do this.");
            return;
        }
        player.performAnimation(Sheep.SHEARING);
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.CUTTING);
        TaskManager_1.TaskManager.submit(new SheepTask(npc, function () {
            npc.setNpcTransformationId(_this.getSheepTransformId(npc));
            npc.forceChat("Baa!");
            if (player.getInventory().getFreeSlots() > 0) {
                player.getInventory().addItem(Sheep.ITEM_WOOL);
            }
            else {
                ItemOnGroundManager_1.ItemOnGroundManager.registers(player, Sheep.ITEM_WOOL);
                player.getPacketSender().sendMessage("You did not have enough inventory space so the Wool was dropped on the ground.");
            }
        }));
        TaskManager_1.TaskManager.submit(new TaskSheep(npc, function () {
            npc.performAnimation(Sheep.SHEEP_EATING);
            npc.setNpcTransformationId(npc.getRealId());
        }));
    };
    Sheep.prototype.getSheepTransformId = function (npc) {
        switch (npc.getId()) {
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_BLACK_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_BLACK_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_BLACK_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_BLACK_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_GREY_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_GREY_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_GREY_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_GREY_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_WHITE_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_WHITE_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_WHITE_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_WHITE_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_YELLOW_GREY_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_YELLOW_GREY_HEAD;
            case NpcIdentifiers_1.NpcIdentifiers.SHEEP_FULL_YELLOW_BLACK_HEAD:
                return NpcIdentifiers_1.NpcIdentifiers.SHEEP_BALD_YELLOW_BLACK_HEAD;
            default:
                return -1;
        }
    };
    Sheep.SHEARING = new Animation_1.Animation(893);
    Sheep.SHEEP_EATING = new Animation_1.Animation(5335);
    Sheep.ITEM_WOOL = new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WOOL);
    return Sheep;
}(NPC_1.NPC));
//# sourceMappingURL=Sheep.js.map