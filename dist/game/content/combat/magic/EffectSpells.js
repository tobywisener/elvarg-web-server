"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectSpells = void 0;
var Animation_1 = require("../../../model/Animation");
var EffectTimer_1 = require("../../../model/EffectTimer");
var Graphic_1 = require("../../../model/Graphic");
var GraphicHeight_1 = require("../../../model/GraphicHeight");
var Item_1 = require("../../../model/Item");
var MagicSpellbook_1 = require("../../../model/MagicSpellbook");
var Skill_1 = require("../../../model/Skill");
var EffectSpells = exports.EffectSpells = /** @class */ (function () {
    function EffectSpells(spell, spellIdFunction, levelRequiredFunction, baseExperienceFunction, itemsRequiredFunction, equipmentRequiredFunction, startCastFunction, getSpellbookFunction) {
        this.spell = spell;
        this.spellIdFunction = spellIdFunction;
        this.levelRequiredFunction = levelRequiredFunction;
        this.baseExperienceFunction = baseExperienceFunction;
        this.itemsRequiredFunction = itemsRequiredFunction;
        this.equipmentRequiredFunction = equipmentRequiredFunction;
        this.startCastFunction = startCastFunction;
        this.spell = spell;
    }
    EffectSpells.handleSpell = function (player, button) {
        var _a, _b, _c;
        var spell = EffectSpells.forSpellId(button);
        if (spell instanceof EffectSpells) {
            if (spell !== null) {
                return false;
            }
            if ((_a = EffectSpells.getSpell()) === null || _a === void 0 ? void 0 : _a.canCast(player, false)) {
                return true;
            }
            switch (spell) {
                case EffectSpells.BONES_TO_PEACHES:
                case EffectSpells.BONES_TO_BANANAS:
                    var spells_1 = EffectSpells.forSpellId(button);
                    if (!player.getClickDelay().elapsedTime(500)) {
                        return true;
                    }
                    if (!player.getInventory().contains(526)) {
                        player.getPacketSender().sendMessage("You do not have any bones in your inventory.");
                        return true;
                    }
                    player.getInventory().deleteItemSet((_b = EffectSpells.getSpell()) === null || _b === void 0 ? void 0 : _b.itemsRequired(player));
                    var i_1 = 0;
                    player.getInventory().getValidItems().forEach(function (invItem) {
                        if (invItem.getId() == 526) {
                            if (spells_1 === EffectSpells.BONES_TO_PEACHES) {
                                player.getInventory().deleteNumber(526, 1).adds(6883, 1);
                            }
                            else {
                                player.getInventory().deleteNumber(526, 1).adds(1963, 1);
                            }
                            i_1++;
                        }
                    });
                    player.performGraphic(new Graphic_1.Graphic(141, GraphicHeight_1.GraphicHeight.MIDDLE));
                    player.performAnimation(new Animation_1.Animation(722));
                    player.getSkillManager().addExperiences(Skill_1.Skill.MAGIC, ((_c = EffectSpells.getSpell()) === null || _c === void 0 ? void 0 : _c.baseExperience()) * i_1);
                    player.getClickDelay().reset();
                    break;
                case EffectSpells.VENGEANCE:
                    if (player.getDueling().inDuel()) {
                        player.getPacketSender().sendMessage("You cannot cast Vengeance during a duel!");
                        return true;
                    }
                    if (player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE) < 40) {
                        player.getPacketSender().sendMessage("You need at least level 40 Defence to cast this spell.");
                        return true;
                    }
                    if (player.hasVengeanceReturn()) {
                        player.getPacketSender().sendMessage("You already have Vengeance's effect.");
                        return true;
                    }
                    if (!player.getVengeanceTimer().finished()) {
                        player.getPacketSender().sendMessage("You must wait another " + player.getVengeanceTimer().secondsRemaining() + " seconds before you can cast that again.");
                        return true;
                    }
                    //Send message and effect timer to client
                    player.setHasVengeance(true);
                    player.getVengeanceTimer().start(30);
                    player.getPacketSender().sendEffectTimer(30, EffectTimer_1.EffectTimer.VENGEANCE)
                        .sendMessage("You now have Vengeance's effect.");
                    player.getInventory().deleteItemSet(EffectSpells.getSpell().itemsRequired(player));
                    player.performAnimation(new Animation_1.Animation(4410));
                    player.performGraphic(new Graphic_1.Graphic(726, GraphicHeight_1.GraphicHeight.HIGH));
                    break;
            }
            return true;
        }
    };
    EffectSpells.forSpellId = function (spellId) {
        var spell = EffectSpells.map.get(spellId);
        if (spell != null) {
            return spell;
        }
        return null;
    };
    EffectSpells.getSpell = function () {
        return this.spell;
    };
    EffectSpells.prototype.baseExperience = function () {
        return this.baseExperienceFunction();
    };
    EffectSpells.prototype.spellId = function () {
        return this.spellIdFunction();
    };
    EffectSpells.prototype.levelRequired = function () {
        return this.levelRequiredFunction();
    };
    EffectSpells.prototype.itemsRequired = function (player) {
        return this.itemsRequiredFunction();
    };
    EffectSpells.prototype.equipmentRequired = function (player) {
        return this.equipmentRequiredFunction();
    };
    EffectSpells.prototype.startCast = function (cast, castOn) {
        return this.startCastFunction();
    };
    EffectSpells.prototype.getSpellbook = function () {
        return this.spellIdFunction();
    };
    EffectSpells.prototype.canCast = function (player, del) {
        throw new Error("Method not implemented.");
    };
    EffectSpells.BONES_TO_BANANAS = new EffectSpells(null, function () { return 1159; }, function () { return 15; }, function () { return 650; }, function () { return [new Item_1.Item(561), new Item_1.Item(555, 2), new Item_1.Item(557, 2)]; }, function () { return null; }, function () { });
    EffectSpells.LOW_ALCHEMY = new EffectSpells(null, function () { return 1162; }, function () { return 21; }, function () { return 4000; }, function () { return [new Item_1.Item(554, 3), new Item_1.Item(561)]; }, function () { return null; }, function () { });
    EffectSpells.TELEKINETIC_GRAB = new EffectSpells(null, function () { return 1168; }, function () { return 33; }, function () { return 3988; }, function () { return [new Item_1.Item(563), new Item_1.Item(556)]; }, function () { return null; }, function () { });
    EffectSpells.SUPERHEAT_ITEM = new EffectSpells(null, function () { return 1173; }, function () { return 43; }, function () { return 6544; }, function () { return [new Item_1.Item(554, 4), new Item_1.Item(561)]; }, function () { return null; }, function () { });
    EffectSpells.HIGH_ALCHEMY = new EffectSpells(null, function () { return 1178; }, function () { return 55; }, function () { return 20000; }, function () { return [new Item_1.Item(554, 5), new Item_1.Item(561)]; }, function () { return null; }, function () { });
    EffectSpells.BONES_TO_PEACHES = new EffectSpells(null, function () { return 15877; }, function () { return 60; }, function () { return 4121; }, function () { return [new Item_1.Item(561, 2), new Item_1.Item(555, 4), new Item_1.Item(577, 4)]; }, function () { return null; }, function () { });
    EffectSpells.BAKE_PIE = new EffectSpells(null, function () { return 30017; }, function () { return 65; }, function () { return 5121; }, function () { return [new Item_1.Item(9075, 1), new Item_1.Item(554, 5), new Item_1.Item(555, 4)]; }, function () { return null; }, function () { });
    EffectSpells.VENGEANCE_OTHER = new EffectSpells(null, function () { return 30298; }, function () { return 93; }, function () { return 10000; }, function () { return [new Item_1.Item(9075, 3), new Item_1.Item(557, 10), new Item_1.Item(560, 2)]; }, function () { return null; }, function () { }, function () { return MagicSpellbook_1.MagicSpellbook.LUNAR; });
    EffectSpells.VENGEANCE = new EffectSpells(null, function () { return 30298; }, function () { return 93; }, function () { return 10000; }, function () { return [new Item_1.Item(9075, 3), new Item_1.Item(557, 10), new Item_1.Item(560, 2)]; }, function () { return null; }, function () { }, function () { return MagicSpellbook_1.MagicSpellbook.LUNAR; ; });
    EffectSpells.map = new Map();
    return EffectSpells;
}());
//# sourceMappingURL=EffectSpells.js.map