"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sound = void 0;
var Sound = exports.Sound = /** @class */ (function () {
    function Sound(id, volume, delay, loopType) {
        this.id = id;
        this.volume = volume;
        this.delay = delay;
        this.loopType = loopType;
    }
    Sound.prototype.getId = function () {
        return this.id;
    };
    Sound.prototype.getVolume = function () {
        return this.volume;
    };
    Sound.prototype.getDelay = function () {
        return this.delay;
    };
    Sound.prototype.getLoopType = function () { return this.loopType; };
    // crafting sounds
    Sound.CUTTING = new Sound(375, 1, 0, 0);
    // cooking sounds
    Sound.COOKING_COOK = new Sound(1039, 1, 10, 0);
    Sound.COOKING_BURN = new Sound(240, 1, 0, 0);
    // runecrafting sounds
    Sound.CRAFT_RUNES = new Sound(207, 0, 0, 0);
    // mining sounds
    Sound.MINING_MINE = new Sound(432, 1, 15, 0);
    Sound.MINING_ROCK_GONE = new Sound(431, 1, 0, 0);
    Sound.MINING_ROCK_RESTORE = new Sound(463, 1, 0, 0);
    Sound.MINING_ROCK_EXPLODE = new Sound(1021, 1, 0, 0);
    // fishing sounds
    Sound.FISHING_FISH = new Sound(379, 1, 10, 0);
    // woodcutting sounds
    Sound.WOODCUTTING_CHOP = new Sound(472, 1, 10, 0);
    Sound.WOODCUTTING_TREE_DOWN = new Sound(473, 1, 0, 0);
    // Getting hit
    Sound.FEMALE_GETTING_HIT = new Sound(818, 1, 25, 0);
    // weapon sounds
    Sound.IMP_ATTACKING = new Sound(10, 1, 25, 0);
    Sound.SHOOT_ARROW = new Sound(370, 1, 0, 0);
    Sound.WEAPON = new Sound(398, 1, 25, 0); // default/other
    Sound.WEAPON_GODSWORD = new Sound(390, 1, 25, 0);
    Sound.WEAPON_STAFF = new Sound(394, 1, 25, 0);
    Sound.WEAPON_BOW = new Sound(370, 1, 25, 0);
    Sound.WEAPON_BATTLE_AXE = new Sound(399, 1, 25, 0);
    Sound.WEAPON_TWO_HANDER = new Sound(400, 1, 25, 0);
    Sound.WEAPON_SCIMITAR = new Sound(396, 1, 25, 0);
    Sound.WEAPON_WHIP = new Sound(1080, 1, 25, 0);
    // Special attack
    Sound.DRAGON_DAGGER_SPECIAL = new Sound(385, 1, 25, 0);
    // Spell sounds
    Sound.SPELL_FAIL_SPLASH = new Sound(193, 1, 0, 0);
    Sound.TELEPORT = new Sound(202, 1, 0, 0);
    Sound.ICA_BARRAGE_IMPACT = new Sound(1125, 1, 0, 0);
    Sound.DROP_ITEM = new Sound(376, 1, 0, 0);
    Sound.PICK_UP_ITEM = new Sound(358, 1, 0, 0);
    Sound.SET_UP_BARRICADE = new Sound(358, 1, 0, 0);
    Sound.FIRE_LIGHT = new Sound(375, 1, 0, 0);
    Sound.FIRE_SUCCESSFUL = new Sound(608, 1, 0, 0);
    Sound.FIRE_FIRST_ATTEMPT = new Sound(2584, 1, 0, 0);
    Sound.SLASH_WEB = new Sound(237, 1, 0, 0);
    Sound.FAIL_SLASH_WEB = new Sound(2548, 1, 0, 0);
    Sound.FOOD_EAT = new Sound(317, 1, 0, 0);
    Sound.DRINK = new Sound(334, 1, 0, 0);
    return Sound;
}());
//# sourceMappingURL=Sound.js.map