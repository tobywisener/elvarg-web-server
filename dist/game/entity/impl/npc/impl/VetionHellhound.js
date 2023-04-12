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
exports.VetionHellhound = void 0;
var NPC_1 = require("../NPC");
var VetionHellhound = /** @class */ (function (_super) {
    __extends(VetionHellhound, _super);
    function VetionHellhound(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.timer = 0;
        return _this;
    }
    VetionHellhound.prototype.process = function () {
        _super.prototype.process.call(this);
        if (this.vetion != null) {
            var target = this.vetion.getCombat().getTarget();
            if (target == null) {
                target = this.vetion.getCombat().getAttacker();
            }
            if (target != null) {
                if (this.getCombat().getTarget() != target) {
                    this.getCombat().attack(target);
                }
                return;
            }
        }
        if (this.timer == 500) {
            this.appendDeath();
        }
        this.timer++;
    };
    VetionHellhound.prototype.appendDeath = function () {
        _super.prototype.appendDeath.call(this);
        if (this.vetion != null) {
            this.vetion.despawnHellhound(this);
        }
    };
    VetionHellhound.prototype.getVetion = function () {
        return this.vetion;
    };
    VetionHellhound.prototype.setVetion = function (vetion) {
        this.vetion = vetion;
    };
    return VetionHellhound;
}(NPC_1.NPC));
exports.VetionHellhound = VetionHellhound;
//# sourceMappingURL=VetionHellhound.js.map