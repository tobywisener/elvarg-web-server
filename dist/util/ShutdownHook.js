"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShutdownHook = void 0;
var World_1 = require("../game/World");
var ShutdownHook = /** @class */ (function () {
    function ShutdownHook() {
    }
    ShutdownHook.prototype.run = function () {
        console.log("The shutdown hook is processing all required actions...");
        World_1.World.savePlayers();
        console.log("The shudown hook actions have been completed, shutting the server down...");
    };
    return ShutdownHook;
}());
exports.ShutdownHook = ShutdownHook;
//# sourceMappingURL=ShutdownHook.js.map