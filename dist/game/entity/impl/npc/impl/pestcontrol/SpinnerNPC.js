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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinnerNPC = void 0;
var NPC_1 = require("../../NPC");
var SpinnerCombatMethod_1 = require("../../../../../content/combat/method/impl/npcs/pestcontrol/SpinnerCombatMethod");
var NpcIdentifiers_1 = require("../../../../../../util/NpcIdentifiers");
function Ids(ids) {
    return function (target) {
        target.ids = ids;
    };
}
var SpinnerNPC = exports.SpinnerNPC = /** @class */ (function (_super) {
    __extends(SpinnerNPC, _super);
    function SpinnerNPC(id, position) {
        return _super.call(this, id, position) || this;
    }
    SpinnerNPC_1 = SpinnerNPC;
    SpinnerNPC.prototype.getCombatMethod = function () {
        return SpinnerNPC_1.COMBAT_METHOD;
    };
    var SpinnerNPC_1;
    SpinnerNPC.COMBAT_METHOD = new SpinnerCombatMethod_1.SpinnerCombatMethod();
    SpinnerNPC = SpinnerNPC_1 = __decorate([
        Ids([NpcIdentifiers_1.NpcIdentifiers.SPINNER, NpcIdentifiers_1.NpcIdentifiers.SPINNER_2, NpcIdentifiers_1.NpcIdentifiers.SPINNER_3, NpcIdentifiers_1.NpcIdentifiers.SPINNER_4, NpcIdentifiers_1.NpcIdentifiers.SPINNER_5])
    ], SpinnerNPC);
    return SpinnerNPC;
}(NPC_1.NPC));
//# sourceMappingURL=SpinnerNPC.js.map