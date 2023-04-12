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
exports.FightCaves = void 0;
var Location_1 = require("../../../model/Location");
var World_1 = require("../../../World");
var TaskManager_1 = require("../../../task/TaskManager");
var FightCavesArea_1 = require("../../../model/areas/impl/FightCavesArea");
var TztokJad_1 = require("../../../entity/impl/npc/impl/TztokJad");
var Task_1 = require("../../../task/Task");
var FightCavesTask = /** @class */ (function (_super) {
    __extends(FightCavesTask, _super);
    function FightCavesTask(execFunction) {
        var _this = _super.call(this, 4, true) || this;
        _this.execFunction = execFunction;
        return _this;
    }
    FightCavesTask.prototype.execute = function () {
        this.execFunction();
    };
    return FightCavesTask;
}(Task_1.Task));
var FightCaves = exports.FightCaves = /** @class */ (function () {
    function FightCaves() {
    }
    FightCaves.start = function (player) {
        var area = new FightCavesArea_1.FightCavesArea();
        area.add(player);
        TaskManager_1.TaskManager.submit(new FightCavesTask(function () {
            var result = [14, player, false];
            var callback = function () {
                if (area.isDestroyed()) {
                    return;
                }
                World_1.World.getAddNPCQueue().push(new TztokJad_1.TztokJad(player, area, FightCaves.JAD_NPC_ID, FightCaves.JAD_SPAWN_POS.clone()));
            };
        }));
    };
    FightCaves.ENTRANCE = new Location_1.Location(2413, 5117);
    FightCaves.EXIT = new Location_1.Location(2438, 5168);
    FightCaves.JAD_SPAWN_POS = new Location_1.Location(2401, 5088);
    FightCaves.JAD_NPC_ID = 3127;
    return FightCaves;
}());
//# sourceMappingURL=FightCaves.js.map