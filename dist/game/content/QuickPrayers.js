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
exports.QuickPrayers = void 0;
var Skill_1 = require("../model/Skill");
var PrayerHandler_1 = require("./PrayerHandler");
var PrayerHandler_2 = require("./PrayerHandler");
var QuickPrayers = exports.QuickPrayers = /** @class */ (function (_super) {
    __extends(QuickPrayers, _super);
    function QuickPrayers(player) {
        var _this = _super.call(this) || this;
        _this.prayers = Array.from(PrayerHandler_2.PrayerData.values());
        _this.player = player;
        return _this;
    }
    QuickPrayers.prototype.sendChecks = function () {
        var e_1, _a;
        try {
            for (var _b = __values(PrayerHandler_2.PrayerData.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var prayer = _c.value;
                this.sendCheck(prayer);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    QuickPrayers.prototype.sendCheck = function (prayer) {
        this.player.getPacketSender().sendConfig(QuickPrayers.CONFIG_START + this.prayers.indexOf(prayer), this.prayers.indexOf(prayer) !== null ? 0 : 1);
    };
    QuickPrayers.prototype.uncheckSelect = function (toDeselect, exception) {
        var e_2, _a;
        try {
            for (var toDeselect_1 = __values(toDeselect), toDeselect_1_1 = toDeselect_1.next(); !toDeselect_1_1.done; toDeselect_1_1 = toDeselect_1.next()) {
                var i = toDeselect_1_1.value;
                if (i === exception) {
                    continue;
                }
                this.uncheck(PrayerHandler_2.PrayerData.values()[i]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (toDeselect_1_1 && !toDeselect_1_1.done && (_a = toDeselect_1.return)) _a.call(toDeselect_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    QuickPrayers.prototype.uncheck = function (prayer) {
        var index = this.prayers.findIndex(function (p) { return p === prayer; });
        if (index !== -1) {
            this.prayers[index] = null;
            this.sendCheck(prayer);
        }
    };
    QuickPrayers.prototype.toggle = function (index) {
        var prayer = PrayerHandler_2.PrayerData.values()[index];
        if (this.prayers.indexOf(prayer) !== -1) {
            this.uncheck(prayer);
            return;
        }
        if (!QuickPrayers.canUse(this.player, prayer, true)) {
            this.uncheck(prayer);
            return;
        }
        var indexs = this.prayers.indexOf(prayer);
        if (indexs !== -1) {
            this.prayers[indexs] = prayer;
        }
        this.sendCheck(prayer);
        switch (index) {
            case QuickPrayers.THICK_SKIN:
            case QuickPrayers.ROCK_SKIN:
            case QuickPrayers.STEEL_SKIN:
                this.uncheckSelect(QuickPrayers.DEFENCE_PRAYERS, index);
                break;
            case QuickPrayers.BURST_OF_STRENGTH:
            case QuickPrayers.SUPERHUMAN_STRENGTH:
            case QuickPrayers.ULTIMATE_STRENGTH:
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.CLARITY_OF_THOUGHT:
            case QuickPrayers.IMPROVED_REFLEXES:
            case QuickPrayers.INCREDIBLE_REFLEXES:
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.SHARP_EYE:
            case QuickPrayers.HAWK_EYE:
            case QuickPrayers.EAGLE_EYE:
            case QuickPrayers.MYSTIC_WILL:
            case QuickPrayers.MYSTIC_LORE:
            case QuickPrayers.MYSTIC_MIGHT:
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.CHIVALRY:
            case QuickPrayers.PIETY:
            case QuickPrayers.RIGOUR:
            case QuickPrayers.AUGURY:
                this.uncheckSelect(QuickPrayers.DEFENCE_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.PROTECT_FROM_MAGIC:
            case QuickPrayers.PROTECT_FROM_MISSILES:
            case QuickPrayers.PROTECT_FROM_MELEE:
                this.uncheckSelect(QuickPrayers.OVERHEAD_PRAYERS, index);
                break;
            case QuickPrayers.RETRIBUTION:
            case QuickPrayers.REDEMPTION:
            case QuickPrayers.SMITE:
                this.uncheckSelect(QuickPrayers.OVERHEAD_PRAYERS, index);
                break;
        }
    };
    QuickPrayers.prototype.checkActive = function () {
        var e_3, _a;
        if (this.enabled) {
            try {
                for (var _b = __values(this.prayers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var prayer = _c.value;
                    if (prayer === null)
                        continue;
                    if (QuickPrayers.isActivated(this.player, this.prayers.indexOf(prayer))) {
                        return;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.enabled = false;
            this.player.getPacketSender().sendQuickPrayersState(false);
        }
    };
    QuickPrayers.prototype.handleButton = function (button) {
        var e_4, _a, e_5, _b;
        switch (button) {
            case QuickPrayers.TOGGLE_QUICK_PRAYERS:
                if (this.player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) <= 0) {
                    this.player.getPacketSender().sendMessage("You don't have enough Prayer points.");
                    return true;
                }
                if (this.enabled) {
                    try {
                        for (var _c = __values(this.prayers), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var prayer = _d.value;
                            if (prayer === null)
                                continue;
                            QuickPrayers.deactivatePrayer(this.player, this.prayers.indexOf(prayer));
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    this.enabled = false;
                }
                else {
                    var found = false;
                    try {
                        for (var _e = __values(this.prayers), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var prayer = _f.value;
                            if (prayer === null)
                                continue;
                            QuickPrayers.activatePrayerPrayerId(this.player, this.prayers.indexOf(prayer));
                            found = true;
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    if (!found) {
                        this.player.getPacketSender().sendMessage("You have not setup any quick-prayers yet.");
                    }
                    this.enabled = found;
                }
                this.player.getPacketSender().sendQuickPrayersState(this.enabled);
                break;
            case QuickPrayers.SETUP_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608).sendTab(5);
                    this.selectingPrayers = false;
                }
                else {
                    this.sendChecks();
                    this.player.getPacketSender().sendTabInterface(5, QuickPrayers.QUICK_PRAYERS_TAB_INTERFACE_ID).sendTab(5);
                    this.selectingPrayers = true;
                }
                break;
            case QuickPrayers.CONFIRM_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608);
                    this.selectingPrayers = false;
                }
                break;
        }
        if (button >= 17202 && button <= 17230) {
            if (this.selectingPrayers) {
                var index = button - 17202;
                this.toggle(index);
            }
            return true;
        }
        return false;
    };
    QuickPrayers.prototype.setEnabled = function (enabled) {
        this.enabled = enabled;
    };
    QuickPrayers.prototype.getPrayers = function () {
        return this.prayers;
    };
    QuickPrayers.prototype.setPrayers = function (prayers) {
        this.prayers = prayers;
    };
    QuickPrayers.TOGGLE_QUICK_PRAYERS = 1500;
    QuickPrayers.SETUP_BUTTON = 1506;
    QuickPrayers.CONFIRM_BUTTON = 17232;
    QuickPrayers.QUICK_PRAYERS_TAB_INTERFACE_ID = 17200;
    QuickPrayers.CONFIG_START = 620;
    return QuickPrayers;
}(PrayerHandler_1.PrayerHandler));
//# sourceMappingURL=QuickPrayers.js.map