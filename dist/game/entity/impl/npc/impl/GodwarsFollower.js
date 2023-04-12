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
exports.GodwarsFollower = void 0;
var NPC_1 = require("../NPC");
var GodwarsFollower = /** @class */ (function (_super) {
    __extends(GodwarsFollower, _super);
    function GodwarsFollower(id, position, god) {
        var _this = _super.call(this, id, position) || this;
        _this.god = god;
        return _this;
    }
    GodwarsFollower.prototype.getGod = function () {
        return this.god;
    };
    return GodwarsFollower;
}(NPC_1.NPC));
exports.GodwarsFollower = GodwarsFollower;
//# sourceMappingURL=GodwarsFollower.js.map