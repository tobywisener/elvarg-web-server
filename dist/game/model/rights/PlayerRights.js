"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRights = void 0;
var PlayerRights = exports.PlayerRights = /** @class */ (function () {
    function PlayerRights(spriteId, yellTag) {
        this.spriteId = spriteId;
        this.yellTag = yellTag;
    }
    PlayerRights.prototype.getSpriteId = function () {
        return this.spriteId;
    };
    PlayerRights.prototype.getYellTag = function () {
        return this.yellTag;
    };
    PlayerRights.NONE = new PlayerRights(-1, "");
    PlayerRights.MODERATOR = new PlayerRights(618);
    PlayerRights.ADMINISTRATOR = new PlayerRights(619);
    PlayerRights.OWNER = new PlayerRights(620);
    PlayerRights.DEVELOPER = new PlayerRights(621);
    return PlayerRights;
}());
//# sourceMappingURL=PlayerRights.js.map