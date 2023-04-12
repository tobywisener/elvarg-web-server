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
exports.ObjectSpawnDefinition = void 0;
var DefaultSpawnDefinition_1 = require("./DefaultSpawnDefinition");
var ObjectSpawnDefinition = /** @class */ (function (_super) {
    __extends(ObjectSpawnDefinition, _super);
    function ObjectSpawnDefinition(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.face = 0;
        _this.type = 10;
        return _this;
    }
    ObjectSpawnDefinition.prototype.getFace = function () {
        return this.face;
    };
    ObjectSpawnDefinition.prototype.getType = function () {
        return this.type;
    };
    return ObjectSpawnDefinition;
}(DefaultSpawnDefinition_1.DefaultSpawnDefinition));
exports.ObjectSpawnDefinition = ObjectSpawnDefinition;
//# sourceMappingURL=ObjectSpawnDefinition.js.map