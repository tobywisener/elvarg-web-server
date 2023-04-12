"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinigameHandler = void 0;
var CastleWars_1 = require("./impl/CastleWars");
var PestControl_1 = require("./impl/pestcontrols/PestControl");
var PestControlBoat_1 = require("./impl/pestcontrols/PestControlBoat");
var MinigameHandler = exports.MinigameHandler = /** @class */ (function () {
    function MinigameHandler(name, minigame) {
        this.name = name;
        this.minigame = minigame;
    }
    MinigameHandler.getAll = function () {
        return Object.values(MinigameHandler)
            .filter(function (m) { return m instanceof MinigameHandler && m.minigame != null; })
            .map(function (m) { return m.minigame; });
    };
    MinigameHandler.prototype.get = function () {
        return this.minigame;
    };
    MinigameHandler.firstClickObject = function (player, object) {
        return this.getAll().some(function (m) { return m.firstClickObject(player, object); });
    };
    MinigameHandler.handleButtonClick = function (player, button) {
        return this.getAll().some(function (m) { return m.handleButtonClick(player, button); });
    };
    MinigameHandler.process = function () {
        this.getAll().forEach(function (m) { return m.process(); });
    };
    MinigameHandler.CASTLEWARS = new MinigameHandler("Castlewars", new CastleWars_1.CastleWars());
    MinigameHandler.PEST_CONTROL = new MinigameHandler("Pest Control", new PestControl_1.PestControl(PestControlBoat_1.PestControlBoat.NOVICE));
    return MinigameHandler;
}());
//# sourceMappingURL=MinigameHandler.js.map