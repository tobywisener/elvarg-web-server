"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Systems = void 0;
var NPC_1 = require("../game/entity/impl/npc/NPC");
var require_all_1 = require("require-all");
require("reflect-metadata");
var Systems = /** @class */ (function () {
    function Systems() {
    }
    Systems.init = function () {
        var npcOverrideClasses = (0, require_all_1.default)({
            dirname: "".concat(__dirname, "/game/entity/impl/npc"),
            filter: /^(?!.*base).*\.js$/,
            recursive: true,
            map: function (name, path) { return require(path).default; }
        });
        var npcClasses = Object.values(npcOverrideClasses).filter(function (clazz) { return Reflect.hasOwnMetadata('Ids', clazz.prototype); });
        var implementationClasses = npcClasses.filter(function (clazz) { return clazz.prototype instanceof NPC_1.NPC; });
        NPC_1.NPC.initImplementations(implementationClasses);
    };
    return Systems;
}());
exports.Systems = Systems;
//# sourceMappingURL=Systems.js.map