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
exports.Spell = void 0;
var Misc_1 = require("../../../../util/Misc");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var MagicSpellbook_1 = require("../../../model/MagicSpellbook");
var Skill_1 = require("../../../model/Skill");
var Autocasting_1 = require("./Autocasting");
var PlayerMagicStaff_1 = require("./PlayerMagicStaff");
var Spell = /** @class */ (function () {
    function Spell() {
    }
    Spell.prototype.getSpellbook = function () {
        return MagicSpellbook_1.MagicSpellbook.NORMAL;
    };
    Spell.prototype.canCast = function (player, del) {
        var e_1, _a;
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC) < this.levelRequired()) {
            player.getPacketSender().sendMessage("You need a Magic level of ".concat(this.levelRequired(), " to cast this spell."));
            player.getCombat().reset();
            return false;
        }
        if (player.getArea() != null) {
            if (player.getArea().isSpellDisabled(player, this.getSpellbook(), this.spellId())) {
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }
        }
        if (player.getSpellbook() === this.getSpellbook()) {
            Autocasting_1.Autocasting.setAutocast(player, null);
            player.getCombat().setCastSpell(null);
            player.getCombat().reset();
            return false;
        }
        var items = this.itemsRequired(player);
        if (items !== null) {
            var suppressedItems = PlayerMagicStaff_1.PlayerMagicStaff.suppressRunes(player, items);
            if (!player.getInventory().containsAllItem(suppressedItems)) {
                player.getPacketSender().sendMessage("You do not have the required items to cast this spell.");
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }
            var equipment = this.equipmentRequired(player);
            if (equipment !== null && !player.getEquipment().containsAllItem(equipment)) {
                player.getPacketSender().sendMessage("You do not have the required equipment to cast this spell.");
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }
            if (player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId() == 11791) {
                if (Misc_1.Misc.getRandom(7) == 1) {
                    player.getPacketSender().sendMessage("Your Staff of the dead negated your runes for this cast.");
                    del = false;
                }
            }
            if (del) {
                var item = void 0;
                try {
                    for (var suppressedItems_1 = __values(suppressedItems), suppressedItems_1_1 = suppressedItems_1.next(); !suppressedItems_1_1.done; suppressedItems_1_1 = suppressedItems_1.next()) {
                        item = suppressedItems_1_1.value;
                        if (item !== null) {
                            player.getInventory().deletes(item);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (suppressedItems_1_1 && !suppressedItems_1_1.done && (_a = suppressedItems_1.return)) _a.call(suppressedItems_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
        return true;
    };
    return Spell;
}());
exports.Spell = Spell;
//# sourceMappingURL=Spell.js.map