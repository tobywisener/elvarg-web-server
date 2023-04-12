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
exports.NpcDefinitionLoader = void 0;
var GameConstants_1 = require("../../../GameConstants");
var NpcDefinition_1 = require("../../NpcDefinition");
var DefinitionLoader_1 = require("../DefinitionLoader");
var fs_extra_1 = require("fs-extra");
var NpcDefinitionLoader = /** @class */ (function (_super) {
    __extends(NpcDefinitionLoader, _super);
    function NpcDefinitionLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NpcDefinitionLoader.prototype.load = function () {
        var e_1, _a;
        NpcDefinition_1.NpcDefinition.definitions.clear();
        var reader = (0, fs_extra_1.fs)(this.file());
        var defs = JSON.parse(reader.readAsText());
        try {
            for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                var def = defs_1_1.value;
                NpcDefinition_1.NpcDefinition.definitions.set(def.getId(), def);
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
    NpcDefinitionLoader.prototype.file = function () {
        return GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY + "npc_defs.json";
    };
    return NpcDefinitionLoader;
}(DefinitionLoader_1.DefinitionLoader));
exports.NpcDefinitionLoader = NpcDefinitionLoader;
//# sourceMappingURL=NpcDefinitionLoader.js.map