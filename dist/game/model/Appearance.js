"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appearance = void 0;
var Flag_1 = require("./Flag");
var Appearance = exports.Appearance = /** @class */ (function () {
    function Appearance(player) {
        this.canChangeAppearance = false;
        this.headHint = -1;
        this.bountyHunterSkull = -1;
        this.look = new Array(13);
        this.player = player;
        this.set();
    }
    Appearance.prototype.getHeadHint = function () {
        return this.headHint;
    };
    Appearance.prototype.setHeadHint = function (headHint) {
        this.headHint = headHint;
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        return this;
    };
    Appearance.prototype.getBountyHunterSkull = function () {
        return this.bountyHunterSkull;
    };
    Appearance.prototype.setBountyHunterSkull = function (skullHint) {
        this.bountyHunterSkull = skullHint;
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        return this;
    };
    Appearance.prototype.getCanChangeAppearance = function () {
        return this.canChangeAppearance;
    };
    Appearance.prototype.setCanChangeAppearance = function (l) {
        this.canChangeAppearance = l;
    };
    Appearance.prototype.getLook = function () {
        return this.look;
    };
    Appearance.prototype.setLookArray = function (look) {
        if (look.length < 12) {
            throw new Error("Array length must be 12.");
        }
        this.look = look;
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    Appearance.prototype.setLook = function (index, look) {
        this.look[index] = look;
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    Appearance.prototype.set = function () {
        if (this.isMale()) {
            this.look[Appearance.HEAD] = 3;
            this.look[Appearance.CHEST] = 18;
            this.look[Appearance.ARMS] = 26;
            this.look[Appearance.HANDS] = 34;
            this.look[Appearance.LEGS] = 38;
            this.look[Appearance.FEET] = 42;
            this.look[Appearance.BEARD] = 14;
        }
        else {
            this.look[Appearance.HEAD] = 48;
            this.look[Appearance.CHEST] = 57;
            this.look[Appearance.ARMS] = 65;
            this.look[Appearance.HANDS] = 68;
            this.look[Appearance.LEGS] = 77;
            this.look[Appearance.FEET] = 80;
            this.look[Appearance.BEARD] = 57;
        }
        this.look[Appearance.HAIR_COLOUR] = 2;
        this.look[Appearance.TORSO_COLOUR] = 14;
        this.look[Appearance.LEG_COLOUR] = 5;
        this.look[Appearance.FEET_COLOUR] = 4;
        this.look[Appearance.SKIN_COLOUR] = 0;
        this.player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    Appearance.prototype.isMale = function () {
        return this.look[Appearance.GENDER] == 0;
    };
    Appearance.HAIR_COLOUR = 8;
    Appearance.TORSO_COLOUR = 9;
    Appearance.LEG_COLOUR = 10;
    Appearance.FEET_COLOUR = 11;
    Appearance.SKIN_COLOUR = 12;
    Appearance.HEAD = 1;
    Appearance.CHEST = 2;
    Appearance.ARMS = 3;
    Appearance.HANDS = 4;
    Appearance.LEGS = 5;
    Appearance.FEET = 6;
    Appearance.BEARD = 7;
    Appearance.GENDER = 0;
    return Appearance;
}());
//# sourceMappingURL=Appearance.js.map