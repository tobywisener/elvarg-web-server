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
exports.Gambling = void 0;
var ObjectManager_1 = require("../entity/impl/object/ObjectManager");
var MovementQueue_1 = require("../model/movement/MovementQueue");
var TaskManager_1 = require("../task/TaskManager");
var GameObject_1 = require("../entity/impl/object/GameObject");
var TimedObjectSpawnTask_1 = require("../task/impl/TimedObjectSpawnTask");
var Animation_1 = require("../model/Animation");
var Gambling = exports.Gambling = /** @class */ (function () {
    function Gambling() {
    }
    Gambling.plantFlower = function (player) {
        var e_1, _a;
        if (!player.getClickDelay().elapsedTime(3000)) {
            return;
        }
        try {
            for (var _b = __values(player.getLocalNpcs()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var npc = _c.value;
                if (npc != null && npc.getLocation().equals(player.getLocation())) {
                    player.getPacketSender().sendMessage("You cannot plant a seed right here.");
                    return;
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
        if (ObjectManager_1.ObjectManager.existsLocation(player.getLocation())) {
            player.getPacketSender().sendMessage("You cannot plant a seed right here.");
            return;
        }
        var flowers = FlowersData.generate();
        var flowerObject = new GameObject_1.GameObject(flowers.objectId, player.getLocation().clone(), 10, 0, player.getPrivateArea());
        //Stop skilling..
        player.getSkillManager().stopSkillable();
        player.getMovementQueue().reset();
        player.getInventory().deleteNumber(Gambling.MITHRIL_SEEDS, 1);
        player.performAnimation(new Animation_1.Animation(827));
        player.getPacketSender().sendMessage("You plant the seed and suddenly some flowers appear..");
        MovementQueue_1.MovementQueue.clippedStep(player);
        //Start a task which will spawn and then delete them after a period of time.
        TaskManager_1.TaskManager.submit(new TimedObjectSpawnTask_1.TimedObjectSpawnTask(flowerObject, 60, null));
        player.setPositionToFace(flowerObject.getLocation());
        player.getClickDelay().reset();
    };
    Gambling.MITHRIL_SEEDS = 299;
    return Gambling;
}());
var FlowersData = /** @class */ (function () {
    function FlowersData(objectId, itemId) {
        this.objectId = objectId;
        this.itemId = itemId;
    }
    FlowersData.forObject = function (object) {
        var e_2, _a;
        try {
            for (var _b = __values(Object.values(FlowersData)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var data = _c.value;
                if (data.objectId === object) {
                    return data;
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
        return null;
    };
    FlowersData.generate = function () {
        var RANDOM = Math.random() * 100;
        if (RANDOM >= 1) {
            return Object.values(FlowersData)[Math.floor(Math.random() * 7)];
        }
        else {
            return Math.floor(Math.random() * 3) === 1 ? FlowersData.WHITE_FLOWERS : FlowersData.BLACK_FLOWERS;
        }
    };
    FlowersData.WHITE_FLOWERS = new FlowersData(2980, 2460);
    FlowersData.BLACK_FLOWERS = new FlowersData(2981, 2462);
    FlowersData.RED_FLOWERS = new FlowersData(2982, 2464);
    FlowersData.YELLOW_FLOWERS = new FlowersData(2983, 2466);
    FlowersData.PURPLE_FLOWERS = new FlowersData(2984, 2468);
    FlowersData.ORANGE_FLOWERS = new FlowersData(2985, 2470);
    FlowersData.PASTEL_FLOWERS = new FlowersData(2986, 2472);
    return FlowersData;
}());
//# sourceMappingURL=Gambiling.js.map