"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSaveRecord = void 0;
var PlayerSaveRecord = /** @class */ (function () {
    function PlayerSaveRecord(username, playerSave, updatedAt) {
        this.username = username;
        this.playerSave = playerSave;
        this.updatedAt = updatedAt;
    }
    PlayerSaveRecord.prototype.getUsername = function () {
        return this.username;
    };
    PlayerSaveRecord.prototype.setUsername = function (username) {
        this.username = username;
    };
    PlayerSaveRecord.prototype.getPlayerSave = function () {
        return this.playerSave;
    };
    PlayerSaveRecord.prototype.setPlayerSave = function (playerSave) {
        this.playerSave = playerSave;
    };
    PlayerSaveRecord.prototype.getUpdatedAt = function () {
        return this.updatedAt;
    };
    PlayerSaveRecord.prototype.setUpdatedAt = function (updatedAt) {
        this.updatedAt = updatedAt;
    };
    return PlayerSaveRecord;
}());
exports.PlayerSaveRecord = PlayerSaveRecord;
//# sourceMappingURL=PlayerSaveRecord.js.map