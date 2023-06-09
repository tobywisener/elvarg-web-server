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
exports.Autocasting = void 0;
var CombatSpells_1 = require("./CombatSpells");
var MagicSpellbook_1 = require("../../../model/MagicSpellbook");
var FightType_1 = require("../FightType");
var Skill_1 = require("../../../model/Skill");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var BonusManager_1 = require("../../../model/equipment/BonusManager");
var WeaponInterfaces_1 = require("../WeaponInterfaces");
var Autocasting = exports.Autocasting = /** @class */ (function () {
    function Autocasting() {
    }
    Autocasting.handleAutocastTab = function (player, actionButtonId) {
        if (Autocasting.AUTOCAST_SPELLS.has(actionButtonId)) {
            Autocasting.setAutocast(player, Autocasting.AUTOCAST_SPELLS.get(actionButtonId).getSpell());
            WeaponInterfaces_1.WeaponInterfaces.assign(player);
            return true;
        }
        switch (actionButtonId) {
            case Autocasting.CLOSE_REGULAR_AUTOCAST_BUTTON:
            case Autocasting.CLOSE_ANCIENT_AUTOCAST_BUTTON:
                Autocasting.setAutocast(player, null); // When clicking cancel, remove autocast?
                player.getPacketSender().sendTabInterface(0, player.getWeapon().getInterfaceId());
                return true;
        }
        return false;
    };
    Autocasting.handleWeaponInterface = function (player, actionButtonId) {
        if (actionButtonId != Autocasting.REGULAR_AUTOCAST_BUTTON && actionButtonId != Autocasting.DEFENSIVE_AUTOCAST_BUTTON) {
            return false;
        }
        if (player.getSpellbook() == MagicSpellbook_1.MagicSpellbook.LUNAR) {
            player.getPacketSender().sendMessage("You can't autocast lunar spells.");
            return true;
        }
        if (!player.getEquipment().hasStaffEquipped()) {
            return true;
        }
        switch (player.getSpellbook()) {
            case MagicSpellbook_1.MagicSpellbook.ANCIENT:
                if (!Autocasting.ANCIENT_SPELL_AUTOCAST_STAFFS.has(player.getEquipment().getWeapon().getId()) && player.getEquipment().getWeapon().getId() != ItemIdentifiers_1.ItemIdentifiers.AHRIMS_STAFF) {
                    // Ensure this is a staff capable of casting ancients. Ahrims staff can cast both regular and ancients.
                    player.getPacketSender().sendMessage("You can only autocast regular offensive spells with this staff.");
                    return true;
                }
                player.getPacketSender().sendTabInterface(0, Autocasting.ANCIENT_AUTOCAST_TAB);
                break;
            case MagicSpellbook_1.MagicSpellbook.NORMAL:
                if (player.getEquipment().getWeapon().getId() == ItemIdentifiers_1.ItemIdentifiers.ANCIENT_STAFF) {
                    player.getPacketSender().sendMessage("You can only autocast ancient magicks with that.");
                    return true;
                }
                player.getPacketSender().sendTabInterface(0, Autocasting.REGULAR_AUTOCAST_TAB);
                break;
        }
        player.getPacketSender().sendMessage("You can set a default autocast spell any time from the magic tab.");
        return true;
    };
    Autocasting.toggleAutocast = function (player, actionButtonId) {
        var cbSpell = CombatSpells_1.CombatSpells.getCombatSpell(actionButtonId);
        if (!cbSpell) {
            return false;
        }
        if (cbSpell.levelRequired() > player.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC)) {
            player.getPacketSender().sendMessage("You need a Magic level of at least " + cbSpell.levelRequired() + " to cast this spell.");
            Autocasting.setAutocast(player, null);
            return true;
        }
        if (player.getCombat().getAutocastSpell() != null && player.getCombat().getAutocastSpell() == cbSpell) {
            //Player is already autocasting this spell. Turn it off.
            Autocasting.setAutocast(player, null);
        }
        else {
            //Set the new autocast spell
            Autocasting.setAutocast(player, cbSpell);
        }
        return true;
    };
    Autocasting.setAutocast = function (player, spell) {
        // First, set the Player's preferred autocast spell
        player.getCombat().setAutocastSpell(spell);
        if (!player.getEquipment().hasStaffEquipped() && spell != null) {
            player.getPacketSender().sendMessage("Default spell set. Please equip a staff to use autocast.");
            return;
        }
        if (spell == null) {
            player.getPacketSender().sendAutocastId(-1).sendConfig(108, 3);
        }
        else {
            player.getPacketSender().sendAutocastId(spell.spellId()).sendConfig(108, 1);
        }
        BonusManager_1.BonusManager.update(player);
        Autocasting.updateConfigsOnAutocast(player, spell != null);
    };
    Autocasting.updateConfigsOnAutocast = function (player, autocast) {
        var e_1, _a;
        if (autocast) {
            try {
                for (var _b = __values(Autocasting.STAFF_FIGHT_TYPES), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var type = _c.value;
                    player.getPacketSender().sendConfig(FightType_1.FightType.getParentId(), 3);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    // Autocast buttons
    Autocasting.REGULAR_AUTOCAST_BUTTON = 349;
    Autocasting.DEFENSIVE_AUTOCAST_BUTTON = 24111;
    Autocasting.CLOSE_REGULAR_AUTOCAST_BUTTON = 2004;
    Autocasting.CLOSE_ANCIENT_AUTOCAST_BUTTON = 6161;
    Autocasting.REGULAR_AUTOCAST_TAB = 1829;
    Autocasting.ANCIENT_AUTOCAST_TAB = 1689;
    Autocasting.IBANS_AUTOCAST_TAB = 12050;
    Autocasting.ANCIENT_SPELL_AUTOCAST_STAFFS = new Set([ItemIdentifiers_1.ItemIdentifiers.KODAI_WAND, ItemIdentifiers_1.ItemIdentifiers.MASTER_WAND,
        ItemIdentifiers_1.ItemIdentifiers.ANCIENT_STAFF, ItemIdentifiers_1.ItemIdentifiers.NIGHTMARE_STAFF, ItemIdentifiers_1.ItemIdentifiers.VOLATILE_NIGHTMARE_STAFF, ItemIdentifiers_1.ItemIdentifiers.ELDRITCH_NIGHTMARE_STAFF, ItemIdentifiers_1.ItemIdentifiers.TOXIC_STAFF_OF_THE_DEAD, ItemIdentifiers_1.ItemIdentifiers.ELDER_WAND, ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers_1.ItemIdentifiers.STAFF_OF_LIGHT]);
    Autocasting.AUTOCAST_SPELLS = new Map();
    (function () {
        // Modern
        Autocasting.AUTOCAST_SPELLS.set(1830, CombatSpells_1.CombatSpells.WIND_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1831, CombatSpells_1.CombatSpells.WATER_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1832, CombatSpells_1.CombatSpells.EARTH_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1833, CombatSpells_1.CombatSpells.FIRE_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1834, CombatSpells_1.CombatSpells.WIND_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1835, CombatSpells_1.CombatSpells.WATER_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1836, CombatSpells_1.CombatSpells.EARTH_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1837, CombatSpells_1.CombatSpells.FIRE_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1838, CombatSpells_1.CombatSpells.WIND_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1839, CombatSpells_1.CombatSpells.WATER_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1840, CombatSpells_1.CombatSpells.EARTH_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1841, CombatSpells_1.CombatSpells.FIRE_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1842, CombatSpells_1.CombatSpells.WIND_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1843, CombatSpells_1.CombatSpells.WATER_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1844, CombatSpells_1.CombatSpells.EARTH_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1845, CombatSpells_1.CombatSpells.FIRE_WAVE);
        // Ancients
        Autocasting.AUTOCAST_SPELLS.set(13189, CombatSpells_1.CombatSpells.SMOKE_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13241, CombatSpells_1.CombatSpells.SHADOW_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13247, CombatSpells_1.CombatSpells.BLOOD_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(6162, CombatSpells_1.CombatSpells.ICE_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13215, CombatSpells_1.CombatSpells.SMOKE_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13267, CombatSpells_1.CombatSpells.SHADOW_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13167, CombatSpells_1.CombatSpells.BLOOD_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13125, CombatSpells_1.CombatSpells.ICE_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13202, CombatSpells_1.CombatSpells.SMOKE_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13254, CombatSpells_1.CombatSpells.SHADOW_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13158, CombatSpells_1.CombatSpells.BLOOD_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13114, CombatSpells_1.CombatSpells.ICE_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13228, CombatSpells_1.CombatSpells.SMOKE_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13280, CombatSpells_1.CombatSpells.SHADOW_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13178, CombatSpells_1.CombatSpells.BLOOD_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13136, CombatSpells_1.CombatSpells.ICE_BARRAGE);
    })();
    Autocasting.STAFF_FIGHT_TYPES = [
        FightType_1.FightType.STAFF_BASH,
        FightType_1.FightType.STAFF_FOCUS,
        FightType_1.FightType.STAFF_POUND
    ];
    return Autocasting;
}());
//# sourceMappingURL=Autocasting.js.map