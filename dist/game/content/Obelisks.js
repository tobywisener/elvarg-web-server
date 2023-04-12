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
exports.Obelisks = void 0;
var World_1 = require("../../game/World");
var GameObject_1 = require("../entity/impl/object/GameObject");
var ObjectManager_1 = require("../entity/impl/object/ObjectManager");
var Graphic_1 = require("../model/Graphic");
var Location_1 = require("../model/Location");
var WildernessArea_1 = require("../model/areas/impl/WildernessArea");
var Task_1 = require("../task/Task");
var TaskManager_1 = require("../task/TaskManager");
var Misc_1 = require("../../util/Misc");
var TeleportType_1 = require("../model/teleportation/TeleportType");
var ObeliskTask = /** @class */ (function (_super) {
    __extends(ObeliskTask, _super);
    function ObeliskTask(func, funcStop) {
        var _this = _super.call(this, 4, false) || this;
        _this.func = func;
        _this.funcStop = funcStop;
        return _this;
    }
    ObeliskTask.prototype.execute = function () {
        this.func();
        this.stop();
    };
    ObeliskTask.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.funcStop();
    };
    return ObeliskTask;
}(Task_1.Task));
var Obelisks = exports.Obelisks = /** @class */ (function () {
    function Obelisks() {
    }
    Obelisks.activate = function (objectId) {
        var index = this.getObeliskIndex(objectId);
        if (index >= 0) {
            if (!Obelisks.OBELISK_ACTIVATED[index]) {
                Obelisks.OBELISK_ACTIVATED[index] = true;
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(14825, new Location_1.Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(14825, new Location_1.Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(14825, new Location_1.Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(14825, new Location_1.Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                TaskManager_1.TaskManager.submit(new ObeliskTask(function () {
                    var e_1, _a;
                    var obeliskLocation = new Location_1.Location(Obelisks.OBELISK_COORDS[index][0] + 2, Obelisks.OBELISK_COORDS[index][1] + 2);
                    var random = Misc_1.Misc.getRandom(5);
                    while (random == index)
                        random = Misc_1.Misc.getRandom(5);
                    var newLocation = new Location_1.Location(Obelisks.OBELISK_COORDS[random][0] + 2, Obelisks.OBELISK_COORDS[random][1] + 2);
                    try {
                        for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var player = _c.value;
                            if (player == null || !(player.getArea() instanceof WildernessArea_1.WildernessArea))
                                continue;
                            if (player.getLocation().isWithinDistance(obeliskLocation, 1) && !player.getCombat().getTeleblockTimer().finished())
                                player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");
                            if (player.getLocation().isWithinDistance(obeliskLocation, 1) && player.getCombat().getTeleblockTimer().finished()) {
                                player.performGraphic(new Graphic_1.Graphic(661));
                                player.moveTo(newLocation);
                                player.performAnimation(TeleportType_1.TeleportType.NORMAL.getEndAnimation());
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
                    Obelisks.deactivate(index);
                }, function () {
                    Obelisks.OBELISK_ACTIVATED[index] = false;
                }));
            }
            return true;
        }
        return false;
    };
    Obelisks.deactivate = function (index) {
        var obeliskX, obeliskY;
        for (var i = 0; i < this.obelisks.length; i++) {
            obeliskX = i == 1 || i == 3 ? this.OBELISK_COORDS[index][0] + 4 : this.OBELISK_COORDS[index][0];
            obeliskY = i >= 2 ? this.OBELISK_COORDS[index][1] + 4 : this.OBELISK_COORDS[index][1];
            ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(this.OBELISK_IDS[index], new Location_1.Location(obeliskX, obeliskY), 10, 0, undefined), true);
        }
    };
    Obelisks.getObeliskIndex = function (id) {
        for (var j = 0; j < Obelisks.OBELISK_IDS.length; j++) {
            if (Obelisks.OBELISK_IDS[j] == id)
                return j;
        }
        return -1;
    };
    /*
     * Obelisk ids
     */
    Obelisks.OBELISK_IDS = [14829, 14830, 14827, 14828, 14826, 14831];
    /*
     * The obelisks
     */
    Obelisks.obelisks = new Array(4);
    /*
     * Are the obelisks activated?
     */
    Obelisks.OBELISK_ACTIVATED = new Array(Obelisks.OBELISK_IDS.length);
    /*
     * Obelisk coords
     */
    Obelisks.OBELISK_COORDS = [
        [3154, 3618],
        [3225, 3665],
        [3033, 3730],
        [3104, 3792],
        [2978, 3864],
        [3305, 3914]
    ];
    return Obelisks;
}());
//# sourceMappingURL=Obelisks.js.map