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
exports.NpcSpawnDefinition = void 0;
var DefaultSpawnDefinition_1 = require("./DefaultSpawnDefinition");
var NpcSpawnDefinition = /** @class */ (function (_super) {
    __extends(NpcSpawnDefinition, _super);
    function NpcSpawnDefinition(id, position, facing, radius, descripton) {
        var _this = _super.call(this, id, position) || this;
        _this.facing = facing;
        _this.radius = radius;
        _this.description = descripton;
        return _this;
    }
    NpcSpawnDefinition.prototype.getFacing = function () {
        return this.facing;
    };
    NpcSpawnDefinition.prototype.getRadius = function () {
        return this.radius;
    };
    NpcSpawnDefinition.prototype.equals = function (o) {
        if (!(o instanceof NpcSpawnDefinition))
            return false;
        var def = o;
        return def.getPosition().equals(this.getPosition())
            && def.getId() == this.getId()
            && def.getFacing() == this.getFacing()
            && def.getRadius() == this.getRadius();
    };
    return NpcSpawnDefinition;
}(DefaultSpawnDefinition_1.DefaultSpawnDefinition));
exports.NpcSpawnDefinition = NpcSpawnDefinition;
//# sourceMappingURL=NpcSpawnDefinition.js.map