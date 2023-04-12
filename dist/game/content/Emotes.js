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
exports.EmoteData = exports.Emotes = void 0;
var CombatFactory_1 = require("./combat/CombatFactory");
var SkillManager_1 = require("./skill/SkillManager");
var Animation_1 = require("../model/Animation");
var Graphic_1 = require("../model/Graphic");
var Skill_1 = require("../model/Skill");
var Skillcape_1 = require("../model/Skillcape");
var Equipment_1 = require("../model/container/impl/Equipment");
var Misc_1 = require("../../util/Misc");
var Emotes = /** @class */ (function () {
    function Emotes() {
    }
    Emotes.doEmote = function (player, button) {
        var data = EmoteData.forId(button);
        if (data != null) {
            Emotes.animation(player, data.animation, data.graphic);
            return true;
        }
        // Skill cape button
        if (button == 19052) {
            var cape = Skillcape_1.Skillcape.forId(player.getEquipment().getItems()[Equipment_1.Equipment.CAPE_SLOT].getId());
            if (cape != null) {
                if (cape != Skillcape_1.Skillcape.QUEST_POINT) {
                    if (cape < Skillcape_1.Skillcape.QUEST_POINT) {
                        // Check if player is maxed in skill
                        var skill = Object.values(Skill_1.Skill)[cape.getDelay()];
                        var level = SkillManager_1.SkillManager.getMaxAchievingLevel(skill);
                        if (player.getSkillManager().getMaxLevel(skill) < level) {
                            player.getPacketSender().sendMessage("You need ".concat(Misc_1.Misc.anOrA(skill.toString()), " ").concat(Misc_1.Misc.formatPlayerName(skill.toString().toLowerCase()), " level of at least ").concat(level, " to do this emote."));
                            return false;
                        }
                    }
                    else {
                        // Custom capes..
                        /*if(cape == Skillcape.MAX_CAPE) {
                          //Check if all level 99s
                          for(Skill skill : Skill.values()) {
                            int level = SkillManager.getMaxAchievingLevel(skill);
                            if (player.getSkillManager().getMaxLevel(skill) < level) {
                              player.getPacketSender().sendMessage("You need "+Misc.anOrA(skill.getName())+" " + Misc.formatPlayerName(skill.getName().toLowerCase()) + " level of at least "+ level + " to do this emote.");
                              return false;
                            }
                          }
                        }*/
                    }
                }
                Emotes.animation(player, cape.getAnimation(), cape.getGraphic());
            }
            return true;
        }
        return false;
    };
    Emotes.animation = function (player, anim, graphic) {
        if (CombatFactory_1.CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot do this right now.");
            return;
        }
        //Stop skilling..
        player.getSkillManager().stopSkillable();
        //Stop movement..
        player.getMovementQueue().reset();
        if (anim !== null) {
            player.performAnimation(anim);
        }
        if (graphic !== null) {
            player.performGraphic(graphic);
        }
    };
    return Emotes;
}());
exports.Emotes = Emotes;
var EMOTES = {
    YES: [168, new Animation_1.Animation(855), null],
    NO: [169, new Animation_1.Animation(856), null],
    BOW: [164, new Animation_1.Animation(858), null],
    ANGRY: [165, new Animation_1.Animation(859), null],
    THINK: [162, new Animation_1.Animation(857), null],
    WAVE: [163, new Animation_1.Animation(863), null],
    SHRUG: [13370, new Animation_1.Animation(2113), null],
    CHEER: [171, new Animation_1.Animation(862), null],
    BECKON: [167, new Animation_1.Animation(864), null],
    LAUGH: [170, new Animation_1.Animation(861), null],
    JUMP_FOR_JOY: [13366, new Animation_1.Animation(2109), null],
    YAWN: [13368, new Animation_1.Animation(2111), null],
    DANCE: [166, new Animation_1.Animation(866), null],
    JIG: [13363, new Animation_1.Animation(2106), null],
    SPIN: [13364, new Animation_1.Animation(2107), null],
    HEADBANG: [13365, new Animation_1.Animation(2108), null],
    CRY: [161, new Animation_1.Animation(860), null],
    KISS: [11100, new Animation_1.Animation(1374), new Graphic_1.Graphic(574, 25)],
    PANIC: [13362, new Animation_1.Animation(2105), null],
    RASPBERRY: [13367, new Animation_1.Animation(2110), null],
    CRAP: [172, new Animation_1.Animation(865), null],
    SALUTE: [13369, new Animation_1.Animation(2112), null],
    GOBLIN_BOW: [13383, new Animation_1.Animation(2127), null],
    GOBLIN_SALUTE: [13384, new Animation_1.Animation(2128), null],
    GLASS_BOX: [667, new Animation_1.Animation(1131), null],
    CLIMB_ROPE: [6503, new Animation_1.Animation(1130), null],
    LEAN: [6506, new Animation_1.Animation(1129), null],
    GLASS_WALL: [666, new Animation_1.Animation(1128), null],
    ZOMBIE_WALK: [18464, new Animation_1.Animation(3544), null],
    ZOMBIE_DANCE: [18465, new Animation_1.Animation(3543), null],
    SCARED: [15166, new Animation_1.Animation(2836), null],
    RABBIT_HOP: [18686, new Animation_1.Animation(6111), null]
    /*ZOMBIE_HAND: [15166, new Animation(7272), new Graphic(1244)],
    SAFETY_FIRST: [6540, new Animation(8770), new Graphic(1553)],
    AIR_GUITAR: [11101, new Animation(2414), new Graphic(1537)],
    SNOWMAN_DANCE: [11102, new Animation(7531), null],
    FREEZE: [11103, new Animation(11044), new Graphic(1973)],*/
};
var EmoteData = exports.EmoteData = /** @class */ (function () {
    function EmoteData(button, animation, graphic) {
        this.button = button;
        this.animation = animation;
        this.graphic = graphic;
    }
    EmoteData.forId = function (button) {
        return EmoteData.emotes.get(button);
    };
    EmoteData.emotes = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(EmoteData)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var t = _c.value;
                var button = t.button;
                EmoteData.emotes.set(button, t);
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
    return EmoteData;
}());
//# sourceMappingURL=Emotes.js.map