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
exports.BuriableBone = exports.AltarOffering = exports.Prayer = void 0;
var Animation_1 = require("../../../../model/Animation");
var ItemDefinition_1 = require("../../../../definition/ItemDefinition");
var Skill_1 = require("../../../../model/Skill");
var DefaultSkillable_1 = require("./DefaultSkillable");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var Graphic_1 = require("../../../../model/Graphic");
var PrayerTask = /** @class */ (function (_super) {
    __extends(PrayerTask, _super);
    function PrayerTask(n, p, b, execFunc) {
        var _this = _super.call(this) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    PrayerTask.prototype.execute = function () {
        this.execFunc();
    };
    return PrayerTask;
}(Task_1.Task));
var Prayer = exports.Prayer = /** @class */ (function () {
    function Prayer() {
    }
    Prayer.buryBone = function (player, itemId) {
        var b = BuriableBone.forId(itemId);
        if (b) {
            if (player.getClickDelay().elapsedTime(Prayer.BONE_BURY_DELAY)) {
                player.getSkillManager().stopSkillable();
                player.getPacketSender().sendInterfaceRemoval();
                player.performAnimation(Prayer.BONE_BURY);
                player.getPacketSender().sendMessage("You dig a hole in the ground..");
                player.getInventory().deleteNumber(itemId, 1);
                setTimeout(function () {
                    player.getPacketSender().sendMessage("..and bury the " + ItemDefinition_1.ItemDefinition.forId(itemId).getName() + ".");
                    player.getSkillManager().addExperiences(Skill_1.Skill.PRAYER, b.getXp());
                }, 1000);
                player.getClickDelay().reset();
            }
            return true;
        }
        return false;
    };
    Prayer.BONE_BURY = new Animation_1.Animation(827);
    Prayer.BONE_BURY_DELAY = 1000;
    Prayer.GILDED_ALTAR_EXPERIENCE_MULTIPLIER = 3.5;
    return Prayer;
}());
var AltarOffering = exports.AltarOffering = /** @class */ (function (_super) {
    __extends(AltarOffering, _super);
    function AltarOffering(bone, altar, amount) {
        var _this = _super.call(this) || this;
        _this.bone = bone;
        _this.altar = altar;
        _this.amount = amount;
        return _this;
    }
    AltarOffering.prototype.startAnimationLoop = function (player) {
        var task = new PrayerTask(2, player, true, function () {
            player.performAnimation(AltarOffering.ALTAR_OFFERING_ANIMATION);
        });
        TaskManager_1.TaskManager.submit(task);
        this.tasks.push(task);
    };
    AltarOffering.prototype.finishedCycle = function (player) {
        if (this.amount-- <= 0) {
            this.cancel(player);
        }
        this.altar.performGraphic(AltarOffering.ALTAR_OFFERING_GRAPHIC);
        player.getInventory().deleteNumber(this.bone.getBoneID(), 1);
        player.getSkillManager().addExperiences(Skill_1.Skill.PRAYER, this.bone.getXp() * Prayer.GILDED_ALTAR_EXPERIENCE_MULTIPLIER);
        player.getPacketSender().sendMessage("The gods are pleased with your offering.");
    };
    AltarOffering.prototype.cyclesRequired = function () {
        return 2;
    };
    AltarOffering.prototype.hasRequirements = function (player) {
        //Check if player has bones..
        if (!player.getInventory().contains(this.bone.getBoneID())) {
            return false;
        }
        //Check if we offered all bones..
        if (this.amount <= 0) {
            return false;
        }
        return _super.prototype.hasRequirements.call(this, player);
    };
    AltarOffering.prototype.loopRequirements = function () {
        return true;
    };
    AltarOffering.prototype.allowFullInventory = function () {
        return true;
    };
    AltarOffering.ALTAR_OFFERING_ANIMATION = new Animation_1.Animation(713);
    AltarOffering.ALTAR_OFFERING_GRAPHIC = new Graphic_1.Graphic(624);
    return AltarOffering;
}(DefaultSkillable_1.DefaultSkillable));
var BuriableBone = exports.BuriableBone = /** @class */ (function () {
    function BuriableBone(boneId, buryXP) {
        this.BONES = { id: 526, xp: 5 };
        this.BAT_BONES = { id: 530, xp: 6 };
        this.WOLF_BONES = { id: 2859, xp: 6 };
        this.BIG_BONES = { id: 532, xp: 15 };
        this.BABYDRAGON_BONES = { id: 534, xp: 30 };
        this.JOGRE_BONE = { id: 3125, xp: 15 };
        this.ZOGRE_BONES = { id: 4812, xp: 23 };
        this.LONG_BONES = { id: 10976, xp: 15 };
        this.CURVED_BONE = { id: 10977, xp: 15 };
        this.SHAIKAHAN_BONES = { id: 3123, xp: 25 };
        this.DRAGON_BONES = { id: 536, xp: 72 };
        this.FAYRG_BONES = { id: 4830, xp: 84 };
        this.RAURG_BONES = { id: 4832, xp: 96 };
        this.OURG_BONES = { id: 14793, xp: 140 };
        this.DAGANNOTH_BONES = { id: 6729, xp: 125 };
        this.WYVERN_BONES = { id: 6816, xp: 72 };
        this.LAVA_DRAGON_BONES = { id: 11943, xp: 85 };
        this.boneId = boneId;
        this.xp = buryXP;
    }
    BuriableBone.forId = function (itemId) {
        return BuriableBone.bones.get(itemId);
    };
    BuriableBone.prototype.getBoneID = function () {
        return this.boneId;
    };
    BuriableBone.prototype.getXp = function () {
        return this.xp;
    };
    BuriableBone.bones = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(BuriableBone)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                BuriableBone.bones.set(b.getBoneID(), b);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })();
    return BuriableBone;
}());
//# sourceMappingURL=Prayer.js.map