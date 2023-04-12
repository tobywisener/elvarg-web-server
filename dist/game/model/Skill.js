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
exports.Skill = void 0;
var Misc_1 = require("../../util/Misc");
var Skill = exports.Skill = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param chatboxInterface
     * @param button
     */
    function Skill(chatboxInterface, button) {
        this.chatboxInterface = chatboxInterface;
        this.button = button;
    }
    /**
     * Gets a skill for its button id.
     *
     * @param button The button id.
     * @return The skill with the matching button.
     */
    Skill.forButton = function (button) {
        return Skill.skillMap.get(button);
    };
    Skill.prototype.canSetLevel = function () {
        return Skill.ALLOWED_TO_SET_LEVELS.has(this);
    };
    /**
    
    Gets the {@link Skill}'s chatbox interface.
    @return The interface which will be sent on levelup.
    */
    Skill.prototype.getChatboxInterface = function () {
        return this.chatboxInterface;
    };
    /**
    
    Gets the {@link Skill}'s button id.
    @return The button for this skill.
    */
    Skill.prototype.getButton = function () {
        return this.button;
    };
    /**
    
    Gets the {@link Skill}'s name.
    @return The {@link Skill}'s name in a suitable format.
    */
    Skill.prototype.getName = function () {
        return Misc_1.Misc.FORMATTER.format(this.toString().toLowerCase());
    };
    Skill.ATTACK = new Skill(6247, 8654);
    Skill.DEFENCE = new Skill(6253, 8660);
    Skill.STRENGTH = new Skill(6206, 8657);
    Skill.HITPOINTS = new Skill(6216, 8655);
    Skill.RANGED = new Skill(4443, 8663);
    Skill.PRAYER = new Skill(6242, 8666);
    Skill.MAGIC = new Skill(6211, 8669);
    Skill.COOKING = new Skill(6226, 8665);
    Skill.WOODCUTTING = new Skill(4272, 8671);
    Skill.FLETCHING = new Skill(6231, 8670);
    Skill.FISHING = new Skill(6258, 8662);
    Skill.FIREMAKING = new Skill(4282, 8668);
    Skill.CRAFTING = new Skill(6263, 8667);
    Skill.SMITHING = new Skill(6221, 8659);
    Skill.MINING = new Skill(4416, 8656);
    Skill.HERBLORE = new Skill(6237, 8661);
    Skill.AGILITY = new Skill(4277, 8658);
    Skill.THIEVING = new Skill(4261, 8664);
    Skill.SLAYER = new Skill(12122, 12162);
    Skill.FARMING = new Skill(5267, 13928);
    Skill.RUNECRAFTING = new Skill(4267, 8672);
    Skill.CONSTRUCTION = new Skill(7267, 18801);
    Skill.HUNTER = new Skill(8267, 18829);
    Skill.ALLOWED_TO_SET_LEVELS = new Set([
        Skill.ATTACK,
        Skill.DEFENCE,
        Skill.STRENGTH,
        Skill.HITPOINTS,
        Skill.RANGED,
        Skill.PRAYER,
        Skill.MAGIC
    ]);
    Skill.skillMap = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                Skill.skillMap.set(skill.button, skill);
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
    return Skill;
}());
//# sourceMappingURL=Skill.js.map