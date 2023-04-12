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
exports.ObjectSpawnDefinitionLoader = void 0;
var DefinitionLoader_1 = require("../DefinitionLoader");
var GameConstants_1 = require("../../../GameConstants");
var GameObject_1 = require("../../../entity/impl/object/GameObject");
var ObjectManager_1 = require("../../../entity/impl/object/ObjectManager");
var fs_extra_1 = require("fs-extra");
var ObjectSpawnDefinitionLoader = /** @class */ (function (_super) {
    __extends(ObjectSpawnDefinitionLoader, _super);
    function ObjectSpawnDefinitionLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectSpawnDefinitionLoader.prototype.load = function () {
        var e_1, _a;
        var def;
        var reader = new fs_extra_1.default(this.file());
        var defs = JSON.parse(reader.readAsText());
        try {
            for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                def = defs_1_1.value;
                ObjectManager_1.ObjectManager.register(new GameObject_1.GameObject(def.getId(), def.getPosition(), def.getType(), def.getFace(), null), true);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (defs_1_1 && !defs_1_1.done && (_a = defs_1.return)) _a.call(defs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        reader.close();
    };
    ObjectSpawnDefinitionLoader.prototype.file = function () {
        return GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY + "object_spawns.json";
    };
    return ObjectSpawnDefinitionLoader;
}(DefinitionLoader_1.DefinitionLoader));
exports.ObjectSpawnDefinitionLoader = ObjectSpawnDefinitionLoader;
//# sourceMappingURL=ObjectSpawnDefinitionLoader.js.map