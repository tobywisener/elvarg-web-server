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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatAncientSpell = void 0;
var MagicSpellbook_1 = require("../../../model/MagicSpellbook");
var CombatSpell_1 = require("./CombatSpell");
var CombatAncientSpell = /** @class */ (function (_super) {
    __extends(CombatAncientSpell, _super);
    function CombatAncientSpell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CombatAncientSpell.prototype.getSpellbook = function () {
        return MagicSpellbook_1.MagicSpellbook.ANCIENT;
    };
    CombatAncientSpell.prototype.finishCast = function (cast, castOn, accurate, damage) {
        // The spell wasn't accurate, so do nothing.
        if (!accurate || damage <= 0) {
            return;
        }
        // Do the spell effect here.
        this.spellEffect(cast, castOn, damage);
    };
    CombatAncientSpell.prototype.equipmentRequired = function (player) {
        // Ancient spells never require any equipment, although the method can
        // still be overridden if by some chance a spell does.
        return null;
    };
    /**
     * The effect this spell has on the target.
     *
     * @param cast   the entity casting this spell.
     * @param castOn the person being hit by this spell.
     * @param damage the damage inflicted.
     */
    CombatAncientSpell.prototype.spellEffect = function (cast, castOn, damage) { };
    return CombatAncientSpell;
}(CombatSpell_1.CombatSpell));
exports.CombatAncientSpell = CombatAncientSpell;
//# sourceMappingURL=CombatAncientSpell.js.map