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
exports.BanditCombtMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Equipment_1 = require("../../../../../model/container/impl/Equipment");
var BanditCombtMethod = /** @class */ (function (_super) {
    __extends(BanditCombtMethod, _super);
    function BanditCombtMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BanditCombtMethod.prototype.onCombatBegan = function (character, target) {
        if (!character || !target) {
            return;
        }
        var npc = character.getAsNpc();
        var player = target.getAsPlayer();
        if (!npc || !player) {
            return;
        }
        var zamorakItemCount = Equipment_1.Equipment.getItemCount(player, "Zamorak", true);
        var saradominItemCount = Equipment_1.Equipment.getItemCount(player, "Saradomin", true);
        if (saradominItemCount > 0) {
            npc.forceChat("Time to die, Saradominist filth!");
        }
        else if (zamorakItemCount > 0) {
            npc.forceChat("Prepare to suffer, Zamorakian scum!");
        }
        else {
            npc.forceChat("You chose the wrong place to start trouble!");
        }
    };
    return BanditCombtMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
exports.BanditCombtMethod = BanditCombtMethod;
//# sourceMappingURL=BanditCombtMethod.js.map