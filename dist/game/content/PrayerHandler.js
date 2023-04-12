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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerData = exports.PrayerHandler = void 0;
var Duelling_1 = require("./Duelling");
var CombatType_1 = require("./combat/CombatType");
var Skill_1 = require("../model/Skill");
var SkullType_1 = require("../model/SkullType");
var BonusManager_1 = require("../model/equipment/BonusManager");
var PlayerRights_1 = require("../model/rights/PlayerRights");
var Task_1 = require("../task/Task");
var Misc_1 = require("../../util/Misc");
var PrayerHandler = exports.PrayerHandler = /** @class */ (function () {
    function PrayerHandler() {
    }
    PrayerHandler.getProtectingPrayer = function (type) {
        switch (type) {
            case CombatType_1.CombatType.MELEE:
                return PrayerHandler.PROTECT_FROM_MELEE;
            case CombatType_1.CombatType.MAGIC:
                return PrayerHandler.PROTECT_FROM_MAGIC;
            case CombatType_1.CombatType.RANGED:
                return PrayerHandler.PROTECT_FROM_MISSILES;
            default:
                throw new Error("Invalid combat type: " + type);
        }
    };
    PrayerHandler.isActivated = function (c, prayer) {
        return c.getPrayerActive()[prayer];
    };
    /**
     * Activates a prayer with specified <code>buttonId</code>.
     *
     * @param player   The player clicking on prayer button.
     * @param buttonId The button the player is clicking.
     */
    PrayerHandler.togglePrayer = function (player, buttonId) {
        var prayerData = PrayerData.actionButton.get(buttonId);
        if (prayerData != null) {
            if (!player.getPrayerActive()[prayerData.hint])
                PrayerHandler.activatePrayer(player, prayerData);
            else
                PrayerHandler.deactivatePrayer(player, prayerData.configId);
            return true;
        }
        return false;
    };
    PrayerHandler.activatePrayer = function (character, pd) {
        PrayerHandler.activatePrayer(character, pd);
    };
    PrayerHandler.activatePrayerPrayerId = function (character, prayerId) {
        // Get the prayer data
        var pd = PrayerData.actionButton.get(prayerId);
        // Check if it's available
        if (!pd) {
            return;
        }
        // Check if we're already praying this prayer
        if (character.getPrayerActive()[prayerId]) {
            // If we are an npc, make sure our headicon
            // is up to speed
            if (character.isNpc()) {
                var npc = character.getAsNpc();
                if (pd.hint !== -1) {
                    var hintId = this.getHeadHint(character);
                    if (npc.getHeadIcon() !== hintId) {
                        npc.setHeadIcon(hintId);
                    }
                }
            }
            return;
        }
        // If we're a player, make sure we can use this prayer
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) <= 0) {
                player.getPacketSender().sendConfig(pd.configId, 0);
                player.getPacketSender().sendMessage("You do not have enough Prayer points.");
                return;
            }
            if (!PrayerHandler.canUse(player, pd, true)) {
                return;
            }
        }
        switch (prayerId) {
            case PrayerHandler.THICK_SKIN:
            case PrayerHandler.ROCK_SKIN:
            case PrayerHandler.STEEL_SKIN:
                PrayerHandler.resetPrayersC(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                break;
            case PrayerHandler.BURST_OF_STRENGTH:
            case PrayerHandler.SUPERHUMAN_STRENGTH:
            case PrayerHandler.ULTIMATE_STRENGTH:
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CLARITY_OF_THOUGHT:
            case PrayerHandler.IMPROVED_REFLEXES:
            case PrayerHandler.INCREDIBLE_REFLEXES:
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.SHARP_EYE:
            case PrayerHandler.HAWK_EYE:
            case PrayerHandler.EAGLE_EYE:
            case PrayerHandler.MYSTIC_WILL:
            case PrayerHandler.MYSTIC_LORE:
            case PrayerHandler.MYSTIC_MIGHT:
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CHIVALRY:
            case PrayerHandler.PIETY:
            case PrayerHandler.RIGOUR:
            case PrayerHandler.AUGURY:
                PrayerHandler.resetPrayersC(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.PROTECT_FROM_MAGIC:
            case PrayerHandler.PROTECT_FROM_MISSILES:
            case PrayerHandler.PROTECT_FROM_MELEE:
                PrayerHandler.resetPrayersC(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
            case PrayerHandler.RETRIBUTION:
            case PrayerHandler.REDEMPTION:
            case PrayerHandler.SMITE:
                PrayerHandler.resetPrayersC(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
        }
        character.setPrayerActive(prayerId, true);
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 1);
            PrayerHandler.startDrain(player);
            if (pd.hint !== -1) {
                var hintId = PrayerHandler.getHeadHint(character);
                player.getAppearance().setHeadHint(hintId);
            }
            if (player.getInterfaceId() === BonusManager_1.BonusManager.INTERFACE_ID) {
                BonusManager_1.BonusManager.update(player);
            }
        }
        else if (character.isNpc()) {
            var npc = character.getAsNpc();
            if (pd.hint !== -1) {
                var hintId = PrayerHandler.getHeadHint(character);
                if (npc.getHeadIcon() !== hintId) {
                    npc.setHeadIcon(hintId);
                }
            }
        }
    };
    PrayerHandler.canUse = function (player, prayer, msg) {
        if (player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER) < (prayer.requirement)) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Prayer level of at least" + prayer.requirement + " to use" + PrayerData.getPrayerName() + ".");
            }
            return false;
        }
        if (prayer === PrayerData.CHIVALRY && player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE) < 60) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 60 to use Chivalry.");
            }
            return false;
        }
        if (prayer === PrayerData.PIETY && player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use Piety.");
            }
            return false;
        }
        if ((prayer === PrayerData.RIGOUR || prayer === PrayerData.AUGURY) && player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use that prayer.");
            }
            return false;
        }
        if (prayer === PrayerData.PROTECT_ITEM) {
            if (player.isSkulled() && player.getSkullType() === SkullType_1.SkullType.RED_SKULL) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    // DialogueManager.sendStatement(player, "You cannot use the Protect Item prayer with a red skull!");
                }
                return false;
            }
        }
        if (!player.getCombat().getPrayerBlockTimer().finished()) {
            if (prayer == PrayerData.PROTECT_FROM_MELEE || prayer == PrayerData.PROTECT_FROM_MISSILES
                || prayer == PrayerData.PROTECT_FROM_MAGIC) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    player.getPacketSender()
                        .sendMessage("You have been disabled and can no longer use protection prayers.");
                }
                return false;
            }
        }
        // Prayer locks
        var locked = false;
        if (prayer == PrayerData.PRESERVE && !player.isPreserveUnlocked()
            || prayer == PrayerData.RIGOUR && !player.isRigourUnlocked()
            || prayer == PrayerData.AUGURY && !player.getAuguryUnlocked()) {
            if (player.getRights() != PlayerRights_1.PlayerRights.OWNER && player.getRights() != PlayerRights_1.PlayerRights.DEVELOPER) {
                locked = true;
            }
        }
        if (locked) {
            if (msg) {
                player.getPacketSender().sendMessage("You have not unlocked that Prayer yet.");
            }
            return false;
        }
        // Duel, disabled prayer?
        if (player.getDueling().inDuel() && player.getDueling().getRules()[Duelling_1.DuelRule.NO_PRAYER.getButtonId()]) {
            if (msg) {
                //   DialogueManager.sendStatement(player, "Prayer has been disabled in this duel!");
                player.getPacketSender().sendConfig(prayer.configId, 0);
            }
            return false;
        }
        return true;
    };
    PrayerHandler.deactivatePrayer = function (c, prayerId) {
        if (!c.getPrayerActive()[prayerId]) {
            return;
        }
        var pd = PrayerData.prayerData.get(prayerId);
        c.getPrayerActive()[prayerId] = false;
        if (c.isPlayer()) {
            var player = c.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                var hintId = this.getHeadHint(c);
                player.getAppearance().setHeadHint(hintId);
            }
            player.getQuickPrayers().checkActive();
            BonusManager_1.BonusManager.update(player);
        }
        else if (c.isNpc()) {
            if (pd.hint !== -1) {
                var hintId = this.getHeadHint(c);
                if (c.getAsNpc().getHeadIcon() !== hintId) {
                    c.getAsNpc().setHeadIcon(hintId);
                }
            }
        }
    };
    PrayerHandler.deactivatePrayers = function (character) {
        for (var i = 0; i < character.getPrayerActive().length; i++) {
            this.deactivatePrayer(character, i);
        }
        if (character.isPlayer()) {
            character.getAsPlayer().getQuickPrayers().setEnabled(false);
            character.getAsPlayer().getPacketSender().sendQuickPrayersState(false);
        }
        else if (character.isNpc()) {
            if (character.getAsNpc().getHeadIcon() !== -1) {
                character.getAsNpc().setHeadIcon(-1);
            }
        }
    };
    PrayerHandler.resetAll = function (player) {
        for (var i = 0; i < player.getPrayerActive().length; i++) {
            var pd = PrayerData.prayerData.get(i);
            if (!pd)
                continue;
            player.getPrayerActive()[i] = false;
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                var hintId = this.getHeadHint(player);
                player.getAppearance().setHeadHint(hintId);
            }
        }
        player.getQuickPrayers().setEnabled(false);
        player.getPacketSender().sendQuickPrayersState(false);
    };
    PrayerHandler.getHeadHint = function (character) {
        var prayers = character.getPrayerActive();
        if (prayers[PrayerHandler.PROTECT_FROM_MELEE]) {
            return 0;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MISSILES]) {
            return 1;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MAGIC]) {
            return 2;
        }
        if (prayers[PrayerHandler.RETRIBUTION]) {
            return 3;
        }
        if (prayers[PrayerHandler.SMITE]) {
            return 4;
        }
        if (prayers[PrayerHandler.REDEMPTION]) {
            return 5;
        }
        return -1;
    };
    PrayerHandler.startDrain = function (player) {
        if (player.isDrainingPrayer()) {
            return;
        }
        player.setDrainingPrayer(true);
        var task = new PlayerHandlerTask(player, function () {
            var drainPerTick = 0;
            var pointDrain = player.getPrayerPointDrain();
            for (var i = 0; i < player.getPrayerActive().length; i++) {
                if (!player.getPrayerActive()[i]) {
                    continue;
                }
                var pd = PrayerData.prayerData.get(i);
                if (!pd) {
                    continue;
                }
                var drainMinute = pd.drainRate;
                var drainSeconds = drainMinute / 60;
                var drainTicks = (drainSeconds * 0.6);
                drainPerTick += drainTicks;
            }
            if (player.getHitpoints() <= 0 || drainPerTick <= 0) {
                stop();
                return;
            }
            var bonus = player.getBonusManager().getOtherBonus()[BonusManager_1.BonusManager.PRAYER];
            drainPerTick /= (1 + (0.0333 * bonus));
            pointDrain += drainPerTick;
            var drainTreshold = Math.floor(pointDrain);
            if (drainTreshold >= 1) {
                var total = (player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) - drainTreshold);
                player.getSkillManager().setCurrentLevel(Skill_1.Skill.PRAYER, total, true);
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) <= 0) {
                    PrayerHandler.deactivatePrayers(player);
                    player.getPacketSender().sendMessage("You have run out of Prayer points!");
                    stop();
                    return;
                }
                pointDrain -= drainTreshold;
                if (pointDrain < 0) {
                    pointDrain = 0;
                }
            }
            player.setPrayerPointDrain(pointDrain);
            function stop() {
                player.setPrayerPointDrain(0);
                player.setDrainingPrayer(false);
                task.stop();
            }
        });
    };
    PrayerHandler.resetPrayersC = function (c, prayers, prayerID) {
        for (var i = 0; i < prayers.length; i++) {
            if (prayers[i] != prayerID)
                this.deactivatePrayer(c, prayers[i]);
        }
    };
    /**
     * Resets prayers in the array
     *
     * @param player
     * @param prayers
     */
    PrayerHandler.resetPrayers = function (player, prayers) {
        for (var i = 0; i < prayers.length; i++) {
            PrayerHandler.deactivatePrayer(player, prayers[i]);
        }
    };
    /**
     * Checks if action button ID is a prayer button.
     *
     * @param buttonId action button being hit.
     */
    PrayerHandler.isButton = function (actionButtonID) {
        return PrayerData.actionButton.has(actionButtonID);
    };
    PrayerHandler.THICK_SKIN = 0;
    PrayerHandler.BURST_OF_STRENGTH = 1;
    PrayerHandler.CLARITY_OF_THOUGHT = 2;
    PrayerHandler.SHARP_EYE = 3;
    PrayerHandler.MYSTIC_WILL = 4;
    PrayerHandler.ROCK_SKIN = 5;
    PrayerHandler.SUPERHUMAN_STRENGTH = 6;
    PrayerHandler.IMPROVED_REFLEXES = 7;
    PrayerHandler.RAPID_RESTORE = 8;
    PrayerHandler.RAPID_HEAL = 9;
    PrayerHandler.PROTECT_ITEM = 10;
    PrayerHandler.HAWK_EYE = 11;
    PrayerHandler.MYSTIC_LORE = 12;
    PrayerHandler.STEEL_SKIN = 13;
    PrayerHandler.ULTIMATE_STRENGTH = 14;
    PrayerHandler.INCREDIBLE_REFLEXES = 15;
    PrayerHandler.PROTECT_FROM_MAGIC = 16;
    PrayerHandler.PROTECT_FROM_MISSILES = 17;
    PrayerHandler.PROTECT_FROM_MELEE = 18;
    PrayerHandler.EAGLE_EYE = 19;
    PrayerHandler.MYSTIC_MIGHT = 20;
    PrayerHandler.RETRIBUTION = 21;
    PrayerHandler.REDEMPTION = 22;
    PrayerHandler.SMITE = 23;
    PrayerHandler.PRESERVE = 24;
    PrayerHandler.CHIVALRY = 25;
    PrayerHandler.PIETY = 26;
    PrayerHandler.RIGOUR = 27;
    PrayerHandler.AUGURY = 28;
    PrayerHandler.DEFENCE_PRAYERS = [PrayerHandler.THICK_SKIN, PrayerHandler.ROCK_SKIN, PrayerHandler.STEEL_SKIN, PrayerHandler.CHIVALRY, PrayerHandler.PIETY, PrayerHandler.RIGOUR, PrayerHandler.AUGURY];
    PrayerHandler.STRENGTH_PRAYERS = [PrayerHandler.BURST_OF_STRENGTH, PrayerHandler.SUPERHUMAN_STRENGTH, PrayerHandler.ULTIMATE_STRENGTH, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    PrayerHandler.ATTACK_PRAYERS = [PrayerHandler.CLARITY_OF_THOUGHT, PrayerHandler.IMPROVED_REFLEXES, PrayerHandler.INCREDIBLE_REFLEXES, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    PrayerHandler.RANGED_PRAYERS = [PrayerHandler.SHARP_EYE, PrayerHandler.HAWK_EYE, PrayerHandler.EAGLE_EYE, PrayerHandler.RIGOUR];
    PrayerHandler.MAGIC_PRAYERS = [PrayerHandler.MYSTIC_WILL, PrayerHandler.MYSTIC_LORE, PrayerHandler.MYSTIC_MIGHT, PrayerHandler.AUGURY];
    PrayerHandler.OVERHEAD_PRAYERS = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE, PrayerHandler.RETRIBUTION, PrayerHandler.REDEMPTION, PrayerHandler.SMITE];
    PrayerHandler.PROTECTION_PRAYERS = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE];
    return PrayerHandler;
}());
var PrayerData = exports.PrayerData = /** @class */ (function () {
    function PrayerData(requirement, drainRate, buttonId, configId, hint) {
        /**
         * The prayer's head icon hint index.
         */
        this.hint = -1;
        this.requirement = requirement;
        this.drainRate = drainRate;
        this.buttonId = buttonId;
        this.configId = configId;
        if (hint.length > 0)
            this.hint = hint[0];
    }
    /**
     * Gets the prayer's formatted name.
     *
     * @return The prayer's name
     */
    PrayerData.getPrayerName = function () {
        if (this.name == null)
            return Misc_1.Misc.capitalizeWords(toString().toLowerCase().replace("_", " "));
        return this.name;
    };
    PrayerData.values = function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, PrayerData.THICK_SKIN];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.BURST_OF_STRENGTH];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.CLARITY_OF_THOUGHT];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.SHARP_EYE];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.MYSTIC_WILL];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.ROCK_SKIN];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.SUPERHUMAN_STRENGTH];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.IMPROVED_REFLEXES];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.RAPID_RESTORE];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.RAPID_HEAL];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PROTECT_ITEM];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.HAWK_EYE];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.MYSTIC_LORE];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.STEEL_SKIN];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.ULTIMATE_STRENGTH];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.INCREDIBLE_REFLEXES];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PROTECT_FROM_MAGIC];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PROTECT_FROM_MISSILES];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PROTECT_FROM_MELEE];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.EAGLE_EYE];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.MYSTIC_MIGHT];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.RETRIBUTION];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.REDEMPTION];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.SMITE];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PRESERVE];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.CHIVALRY];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.PIETY];
                case 27:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.RIGOUR];
                case 28:
                    _b.sent();
                    return [4 /*yield*/, PrayerData.AUGURY];
                case 29:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    };
    var _a;
    _a = PrayerData;
    PrayerData.THICK_SKIN = new PrayerData(1, 5, 5609, 83);
    PrayerData.BURST_OF_STRENGTH = new PrayerData(4, 5, 5610, 84);
    PrayerData.CLARITY_OF_THOUGHT = new PrayerData(7, 5, 5611, 85);
    PrayerData.SHARP_EYE = new PrayerData(8, 5, 19812, 700);
    PrayerData.MYSTIC_WILL = new PrayerData(9, 5, 19814, 701);
    PrayerData.ROCK_SKIN = new PrayerData(10, 10, 5612, 86);
    PrayerData.SUPERHUMAN_STRENGTH = new PrayerData(13, 10, 5613, 87);
    PrayerData.IMPROVED_REFLEXES = new PrayerData(16, 10, 5614, 88);
    PrayerData.RAPID_RESTORE = new PrayerData(19, 2.3, 5615, 89);
    PrayerData.RAPID_HEAL = new PrayerData(22, 3, 5616, 90);
    PrayerData.PROTECT_ITEM = new PrayerData(25, 3, 5617, 91);
    PrayerData.HAWK_EYE = new PrayerData(26, 10, 19816, 702);
    PrayerData.MYSTIC_LORE = new PrayerData(27, 10, 19818, 703);
    PrayerData.STEEL_SKIN = new PrayerData(28, 20, 5618, 92);
    PrayerData.ULTIMATE_STRENGTH = new PrayerData(31, 20, 5619, 93);
    PrayerData.INCREDIBLE_REFLEXES = new PrayerData(34, 20, 5620, 94);
    PrayerData.PROTECT_FROM_MAGIC = new PrayerData(37, 20, 5621, 95, [2]);
    PrayerData.PROTECT_FROM_MISSILES = new PrayerData(40, 20, 5622, 96, [1]);
    PrayerData.PROTECT_FROM_MELEE = new PrayerData(43, 20, 5623, 97, [0]);
    PrayerData.EAGLE_EYE = new PrayerData(44, 20, 19821, 704);
    PrayerData.MYSTIC_MIGHT = new PrayerData(45, 20, 19823, 705);
    PrayerData.RETRIBUTION = new PrayerData(46, 5, 683, 98, [4]);
    PrayerData.REDEMPTION = new PrayerData(49, 10, 684, 99, [5]);
    PrayerData.SMITE = new PrayerData(52, 32.0, 685, 100, [6]);
    PrayerData.PRESERVE = new PrayerData(55, 3, 28001, 708);
    PrayerData.CHIVALRY = new PrayerData(60, 38.5, 19825, 706);
    PrayerData.PIETY = new PrayerData(70, 38.5, 19827, 707);
    PrayerData.RIGOUR = new PrayerData(74, 38.5, 28004, 710);
    PrayerData.AUGURY = new PrayerData(77, 38.5, 28007, 712);
    /**
       * Contains the PrayerData with their corresponding prayerId.
       */
    PrayerData.prayerData = new Map();
    /**
     * Contains the PrayerData with their corresponding buttonId.
     */
    PrayerData.actionButton = new Map();
    /**
     * Populates the prayerId and buttonId maps.
     */
    (function () {
        var e_1, _b;
        try {
            for (var _c = __values(Object.values(PrayerData)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var pd = _d.value;
                _a.prayerData.set(pd.ordinal(), pd);
                _a.actionButton.set(pd.buttonId, pd);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })();
    return PrayerData;
}());
var PlayerHandlerTask = /** @class */ (function (_super) {
    __extends(PlayerHandlerTask, _super);
    function PlayerHandlerTask(p, execFunc) {
        var _this = _super.call(this, 1, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    PlayerHandlerTask.prototype.execute = function () {
        this.execFunc();
    };
    return PlayerHandlerTask;
}(Task_1.Task));
//# sourceMappingURL=PrayerHandler.js.map