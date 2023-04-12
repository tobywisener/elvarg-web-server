"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerBotDefinition = void 0;
var PlayerBotDefinition = /** @class */ (function () {
    function PlayerBotDefinition(username, spawnLocation, fighterPreset) {
        this.username = username;
        this.spawnLocation = spawnLocation;
        this.fighterPreset = fighterPreset;
    }
    PlayerBotDefinition.prototype.getUsername = function () {
        return this.username;
    };
    PlayerBotDefinition.prototype.getSpawnLocation = function () {
        return this.spawnLocation;
    };
    PlayerBotDefinition.prototype.getFighterPreset = function () {
        return this.fighterPreset;
    };
    return PlayerBotDefinition;
}());
exports.PlayerBotDefinition = PlayerBotDefinition;
//# sourceMappingURL=PlayerBotDefinition.js.map