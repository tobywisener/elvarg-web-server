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
exports.NpcSpawnDefinitionLoader = void 0;
var fs_extra_1 = require("fs-extra");
var GameConstants_1 = require("../../../GameConstants");
var World_1 = require("../../../World");
var DefinitionLoader_1 = require("../DefinitionLoader");
var NPC_1 = require("../../../entity/impl/npc/NPC");
var NpcSpawnDefinitionLoader = /** @class */ (function (_super) {
    __extends(NpcSpawnDefinitionLoader, _super);
    function NpcSpawnDefinitionLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NpcSpawnDefinitionLoader.prototype.load = function () {
        var e_1, _a;
        var reader = (0, fs_extra_1.default)(this.file());
        var defs = JSON.parse(reader.readAsText());
        try {
            for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                var def = defs_1_1.value;
                var npc = NPC_1.NPC.create(def.getId(), def.getPosition());
                npc.getMovementCoordinator().setRadius(def.getRadius());
                npc.setFace(def.getFacing());
                World_1.World.addNPCQueue.push(npc);
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
    NpcSpawnDefinitionLoader.prototype.file = function () {
        return GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY + "npc_spawns.json";
    };
    return NpcSpawnDefinitionLoader;
}(DefinitionLoader_1.DefinitionLoader));
exports.NpcSpawnDefinitionLoader = NpcSpawnDefinitionLoader;
//# sourceMappingURL=NpcSpawnDefinitionLoader.js.map