"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presetables = void 0;
var GameConstants_1 = require("../../GameConstants");
var Presetable_1 = require("./Presetable");
var Skill_1 = require("../../model/Skill");
var WildernessArea_1 = require("../../model/areas/impl/WildernessArea");
var CombatFactory_1 = require("../combat/CombatFactory");
var PredefinedPresets_1 = require("./PredefinedPresets");
var F2PMeleeFighterPreset_1 = require("../../entity/impl/playerbot/fightstyle/impl/F2PMeleeFighterPreset");
var PlayerBot_1 = require("../../entity/impl/playerbot/PlayerBot");
var PlayerRights_1 = require("../../model/rights/PlayerRights");
var Bank_1 = require("../../model/container/impl/Bank");
var Autocasting_1 = require("../combat/magic/Autocasting");
var SkillManager_1 = require("../skill/SkillManager");
var BountyHunter_1 = require("../combat/bountyhunter/BountyHunter");
var Misc_1 = require("../../../util/Misc");
var PrayerHandler_1 = require("../PrayerHandler");
var CombatSpecial_1 = require("../combat/CombatSpecial");
var Flag_1 = require("../../model/Flag");
var PreseEntered = /** @class */ (function () {
    function PreseEntered(execFunc) {
        this.execFunc = execFunc;
    }
    PreseEntered.prototype.execute = function (syntax) {
        this.execFunc();
    };
    return PreseEntered;
}());
var Presetables = exports.Presetables = /** @class */ (function () {
    function Presetables() {
    }
    /**
     * Opens the presets interface for a player.
     *
     * @param player
     */
    Presetables.opens = function (player) {
        Presetables.open(player, player.getCurrentPreset());
    };
    Presetables.open = function (player, preset) {
        if (preset) {
            // Send name
            player.getPacketSender().sendString("Presets - " + preset.getName(), 45002);
            // Send stats
            player.getPacketSender().sendString(preset.getStats()[3].toString(), 45007); // Hitpoints
            player.getPacketSender().sendString(preset.getStats()[0].toString(), 45008); // Attack
            player.getPacketSender().sendString(preset.getStats()[2].toString(), 45009); // Strength
            player.getPacketSender().sendString(preset.getStats()[1].toString(), 45010); // Defence
            player.getPacketSender().sendString(preset.getStats()[4].toString(), 45011); // Ranged
            player.getPacketSender().sendString(preset.getStats()[5].toString(), 45012); // Prayer
            player.getPacketSender().sendString(preset.getStats()[6].toString(), 45013); // Magic
            // Send spellbook
            player.getPacketSender().sendString("@yel@" + preset.getSpellbook().toString().toLowerCase(), 45014);
        }
        else {
            // Reset name
            player.getPacketSender().sendString("Presets", 45002);
            // Reset stats
            for (var i = 0; i <= 6; i++) {
                player.getPacketSender().sendString("", 45007 + i);
            }
            // Reset spellbook
            player.getPacketSender().sendString("", 45014);
        }
        // Send inventory
        for (var i = 0; i < 28; i++) {
            // Get item..
            var item = null;
            if (preset) {
                if (i < preset.getInventory().length) {
                    item = preset.getInventory()[i];
                }
            }
            // If it isn't null, send it. Otherwise, send empty slot.
            if (item) {
                player.getPacketSender().sendItemOnInterfaces(45015 + i, item.getId(), item.getAmount());
            }
            else {
                player.getPacketSender().sendItemOnInterfaces(45015 + i, -1, 1);
            }
        }
        for (var i = 0; i < 14; i++) {
            player.getPacketSender().sendItemOnInterfaces(45044 + i, -1, 1);
        }
        if (preset) {
            preset.getEquipment().filter(function (t) { return t && t.isValid(); })
                .forEach(function (t) { return player.getPacketSender().sendItemOnInterfaces(45044 + t.getDefinition().getEquipmentType().getSlot(), t.getId(), t.getAmount()); });
        }
        // Send all available global presets
        for (var i = 0; i < Presetables.MAX_PRESETS; i++) {
            player.getPacketSender().sendString(Presetables.GLOBAL_PRESETS[i] == null ? "Empty" : Presetables.GLOBAL_PRESETS[i].getName(), 45070 + i);
        }
        // Send all available player presets
        for (var i = 0; i < Presetables.MAX_PRESETS; i++) {
            player.getPacketSender().sendString(player.getPresets()[i] == null ? "Empty" : player.getPresets()[i].getName(), 45082 + i);
        }
        // Send on death toggle
        player.getPacketSender().sendConfig(987, player.isOpenPresetsOnDeath() ? 0 : 1);
        // Send interface
        player.getPacketSender().sendInterface(Presetables.INTERFACE_ID);
        // Update current preset
        player.setCurrentPreset(preset);
    };
    Presetables.loadoutToPreset = function (name, player) {
        return new Presetable_1.Presetable(name, player.getInventory().getItems().slice(), player.getEquipment().getItems().slice(), 
        /* atk, def, str, hp, range, pray, mage */
        [
            player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.STRENGTH),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.RANGED),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER),
            player.getSkillManager().getMaxLevel(Skill_1.Skill.MAGIC),
        ], player.getSpellbook(), false);
    };
    Presetables.edit = function (player, index) {
        // Check if we can edit..
        if (player.getArea() instanceof WildernessArea_1.WildernessArea) {
            player.getPacketSender().sendMessage("You can't edit a preset in the wilderness!");
            return;
        }
        if (player.getDueling().inDuel()) {
            player.getPacketSender().sendMessage("You can't edit a preset during a duel!");
            return;
        }
        if (CombatFactory_1.CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }
        if (!player.getPresets()[index]) {
            player.getPacketSender().sendMessage("This preset cannot be edited.");
            return;
        }
    };
    Presetables.load = function (player, preset) {
        var e_1, _a, e_2, _b, e_3, _c;
        var oldCbLevel = player.getSkillManager().getCombatLevel();
        // Close!
        player.getPacketSender().sendInterfaceRemoval();
        // Check if we can load...
        if (player.getArea() instanceof WildernessArea_1.WildernessArea) {
            if (!(player instanceof PlayerBot_1.PlayerBot) && player.getRights() !== PlayerRights_1.PlayerRights.DEVELOPER) {
                player.getPacketSender().sendMessage("You can't load a preset in the wilderness!");
                return;
            }
        }
        if (player.getDueling().inDuel()) {
            player.getPacketSender().sendMessage("You can't load a preset during a duel!");
            return;
        }
        // Send valuable items in inventory/equipment to bank
        var sent = false;
        var items = __spreadArray(__spreadArray([], __read(player.getInventory().getCopiedItems()), false), __read(player.getEquipment().getCopiedItems()), false);
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (!item.isValid()) {
                    continue;
                }
                var spawnable = __spreadArray([], __read(GameConstants_1.GameConstants.ALLOWED_SPAWNS), false).includes(item.getId());
                if (!spawnable) {
                    player.getBank(Bank_1.Bank.getTabForItem(player, item.getId())).add(item, false);
                    sent = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (sent) {
            player.getPacketSender().sendMessage("The non-spawnable items you had on you have been sent to your bank.");
        }
        player.getInventory().resetItems().refreshItems();
        player.getEquipment().resetItems().refreshItems();
        if (!preset.getIsGlobal()) {
            var nonSpawnables = new Array();
            // Get all the valuable items in this preset and check if player has them..
            var items_3 = __spreadArray(__spreadArray([], __read(preset.getInventory()), false), __read(preset.getEquipment()), false);
            try {
                for (var items_2 = __values(items_3), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                    var item = items_2_1.value;
                    if (!item)
                        continue;
                    var spawnable = __spreadArray([], __read(GameConstants_1.GameConstants.ALLOWED_SPAWNS), false).includes(item.getId());
                    if (!spawnable) {
                        nonSpawnables.push(item);
                        var inventoryAmt = player.getInventory().getAmount(item.getId());
                        var equipmentAmt = player.getEquipment().getAmount(item.getId());
                        var bankAmt = player.getBank(Bank_1.Bank.getTabForItem(player, item.getId())).getAmount(item.getId());
                        var totalAmt = inventoryAmt + equipmentAmt + bankAmt;
                        var preset_amt = preset.getAmount(item.getId());
                        if (totalAmt < preset_amt) {
                            player.getPacketSender().sendMessage("You don't have the non-spawnable item " + item.getDefinition().getName() + " in your inventory, equipment or bank.");
                            return;
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (items_2_1 && !items_2_1.done && (_b = items_2.return)) _b.call(items_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                // Delete valuable items from the proper place
                // Not from inventory/equipment, they will be reset anyway.
                for (var nonSpawnables_1 = __values(nonSpawnables), nonSpawnables_1_1 = nonSpawnables_1.next(); !nonSpawnables_1_1.done; nonSpawnables_1_1 = nonSpawnables_1.next()) {
                    var item = nonSpawnables_1_1.value;
                    if (player.getInventory().containsItem(item)) {
                        player.getInventory().deletes(item);
                    }
                    else if (player.getEquipment().containsItem(item)) {
                        player.getEquipment().deletes(item);
                    }
                    else {
                        player.getBank(Bank_1.Bank.getTabForItem(player, item.getId())).deletes(item);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (nonSpawnables_1_1 && !nonSpawnables_1_1.done && (_c = nonSpawnables_1.return)) _c.call(nonSpawnables_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            Misc_1.Misc.concat(preset.getInventory(), preset.getEquipment()).filter(function (t) { return t != null && t.isValid(); })
                .forEach(function (t) { return player.getInventory().addItem(t); });
            Misc_1.Misc.concat(preset.getEquipment(), preset.getEquipment()).filter(function (t) { return t != null && t.isValid(); })
                .forEach(function (t) { return player.getEquipment().setItem(t.getDefinition().getEquipmentType().getSlot(), t.clone()); });
            player.setSpellbook(preset.getSpellbook());
            Autocasting_1.Autocasting.setAutocast(player, null);
            var totalExp = 0;
            for (var i = 0; i < preset.getStats().length; i++) {
                var skill = Skill_1.Skill[i];
                var level = preset.getStats()[i];
                var exp = SkillManager_1.SkillManager.getExperienceForLevel(level);
                player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill, exp);
                totalExp += exp;
            }
            player.getPacketSender().sendString(player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) + "/" + player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER), 687);
            var newCbLevel = player.getSkillManager().getCombatLevel();
            var combatLevel = "Combat level: " + newCbLevel;
            player.getPacketSender().sendString(combatLevel, 19000).sendString(combatLevel, 5858);
            if (newCbLevel != oldCbLevel) {
                BountyHunter_1.BountyHunter.unassign(player);
            }
            player.getPacketSender().sendTabInterface(6, player.getSpellbook().getInterfaceId());
            player.getPacketSender().sendConfig(709, PrayerHandler_1.PrayerHandler.canUse(player, PrayerHandler_1.PrayerData.PRESERVE, false) ? 1 : 0);
            player.getPacketSender().sendConfig(711, PrayerHandler_1.PrayerHandler.canUse(player, PrayerHandler_1.PrayerData.RIGOUR, false) ? 1 : 0);
            player.getPacketSender().sendConfig(713, PrayerHandler_1.PrayerHandler.canUse(player, PrayerHandler_1.PrayerData.AUGURY, false) ? 1 : 0);
            player.resetAttributes();
            player.getPacketSender().sendMessage("Preset loaded!");
            player.getPacketSender().sendTotalExp(totalExp);
            // Restore special attack
            player.setSpecialPercentage(100);
            CombatSpecial_1.CombatSpecial.updateBar(player);
            player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        }
    };
    Presetables.handleButton = function (player, button) {
        var _this = this;
        if (player.getInterfaceId() != this.INTERFACE_ID && !(player instanceof PlayerBot_1.PlayerBot)) {
            return false;
        }
        switch (button) {
            case 45060: // Toggle on death show
                player.setOpenPresetsOnDeath(!player.isOpenPresetsOnDeath());
                player.getPacketSender().sendConfig(987, player.isOpenPresetsOnDeath() ? 0 : 1);
                return true;
            case 45061: // Edit preset
                var currentPreset = player.getCurrentPreset();
                if (currentPreset != null && currentPreset.getIsGlobal()) {
                    player.getPacketSender().sendMessage("You can't edit this preset!");
                }
                player.setEnteredSyntaxAction(new PreseEntered(function (input) {
                    input = Misc_1.Misc.formatText(input);
                    if (!Misc_1.Misc.isValidName(input)) {
                        player.getPacketSender().sendMessage("Invalid name for preset. Please enter characters only.");
                        player.setCurrentPreset(null);
                        _this.opens(player);
                        return;
                    }
                    var changeIndex = -1;
                    for (var i = 0; i < player.getPresets().length; i++) {
                        if (player.getPresets()[i] == player.getCurrentPreset()) {
                            changeIndex = i;
                            break;
                        }
                    }
                    if (changeIndex == -1) {
                        player.getPacketSender().sendMessage("You don't have free space left!!");
                        return;
                    }
                    var preset = _this.loadoutToPreset(input, player);
                    player.getPresets()[changeIndex] = preset;
                    player.setCurrentPreset(player.getPresets()[changeIndex]);
                    _this.load(player, player.getCurrentPreset());
                }));
                player.getPacketSender().sendEnterInputPrompt("How would you like to call your preset?");
                return true;
            case 45064: // Load preset
                if (player.getCurrentPreset() == null) {
                    player.getPacketSender().sendMessage("You haven't selected any preset yet.");
                    return true;
                }
                this.load(player, player.getCurrentPreset());
                return true;
        }
        if (button >= 45070 && button <= 45079) {
            var index = button - 45070;
            if (this.GLOBAL_PRESETS.length <= index || this.GLOBAL_PRESETS[index] == null) {
                player.getPacketSender().sendMessage("That preset is currently unavailable.");
                return true;
            }
            // Check if already in set, no need to re-open
            if (player.getCurrentPreset() != null && player.getCurrentPreset() === this.GLOBAL_PRESETS[index]) {
                return true;
            }
            this.open(player, this.GLOBAL_PRESETS[index]);
            return true;
        }
        // Custom presets selection
        if (button >= 45082 && button <= 45091) {
            var index = button - 45082;
            if (player.getPresets()[index] == null) {
                this.open(player, null);
                /*DialogueManager.start(player, 10);
                player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        if (option == 1) {
                            player.setEnteredSyntaxAction((input) => {
                                player.getPacketSender().sendInterfaceRemoval();
        
                                input = Misc.formatText(input);
        
                                if(!Misc.isValidName(input)) {
                                    player.getPacketSender().sendMessage("Invalid name for preset.");
                                    player.setCurrentPreset(null);
                                    Presetables.open(player);
                                    return;
                                }
        
                                if(player.getPresets()[index] == null) {
        
                                    //Get stats..
                                    int[] stats = new int[7];
                                    for(int i = 0; i < stats.length; i++) {
                                        stats[i] = player.getSkillManager().getMaxLevel(Skill.values()[i]);
                                    }
        
                                    Item[] inventory = player.getInventory().copyValidItemsArray();
                                    Item[] equipment = player.getEquipment().copyValidItemsArray();
                                    for(Item t : Misc.concat(inventory, equipment))
        {
                                        if(t.getDefinition().isNoted()) {
                                            player.getPacketSender().sendMessage("You cannot create presets which contain noted items.");
                                            return;
                                        }
                                    }
                                    player.getPresets()[index] = new Presetable(input, index, inventory, equipment,
                                            stats, player.getSpellbook(), false);
                                    player.setCurrentPreset(player.getPresets()[index]);

                                    Presetables.open(player);
                                }
                            });
                            player.getPacketSender().sendEnterInputPrompt("Enter a name for your preset below.");
                        } else {
                            player.getPacketSender().sendInterfaceRemoval();
                        }
                    }
                });*/
                return true;
            }
            // Check if already in set, no need to re-open
            if (player.getCurrentPreset() != null && player.getCurrentPreset() == player.getPresets()[index]) {
                return true;
            }
            this.open(player, player.getPresets()[index]);
        }
        return false;
    };
    /**
     * The max amount of premade/custom presets.
     */
    Presetables.MAX_PRESETS = 10;
    /**
     * The presets interface id.
     */
    Presetables.INTERFACE_ID = 45000;
    /**
     * Pre-made sets by the server which everyone can use.
     */
    Presetables.GLOBAL_PRESETS = [
        PredefinedPresets_1.PredefinedPresets.OBBY_MAULER_57,
        PredefinedPresets_1.PredefinedPresets.G_MAULER_70,
        PredefinedPresets_1.PredefinedPresets.DDS_PURE_M_73,
        PredefinedPresets_1.PredefinedPresets.DDS_PURE_R_73,
        PredefinedPresets_1.PredefinedPresets.NH_PURE_83,
        F2PMeleeFighterPreset_1.F2PMeleeFighterPreset.PRESETABLE,
        PredefinedPresets_1.PredefinedPresets.ATT_70_ZERKER_97,
        PredefinedPresets_1.PredefinedPresets.MAIN_RUNE_126,
        PredefinedPresets_1.PredefinedPresets.MAIN_HYBRID_126,
        PredefinedPresets_1.PredefinedPresets.MAIN_TRIBRID_126,
    ];
    return Presetables;
}());
//# sourceMappingURL=Presetables.js.map