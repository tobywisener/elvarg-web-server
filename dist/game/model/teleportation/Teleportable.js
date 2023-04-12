"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teleportable = void 0;
var Location_1 = require("../Location");
var CastleWars_1 = require("../../content/minigames/impl/CastleWars");
var TeleportButton_1 = require("../teleportation/TeleportButton");
var Teleportable = exports.Teleportable = /** @class */ (function () {
    function Teleportable(teleportButton, type, index, position) {
        this.EDGEVILLE_DITCH = new Teleportable(TeleportButton_1.TeleportButton.WILDERNESS, 0, 0, new Location_1.Location(3088, 3520));
        this.WEST_DRAGONS = new Teleportable(TeleportButton_1.TeleportButton.WILDERNESS, 0, 1, new Location_1.Location(2979, 3592));
        this.EAST_DRAGONS = new Teleportable(TeleportButton_1.TeleportButton.WILDERNESS, 0, 2, new Location_1.Location(3356, 3675));
        this.KING_BLACK_DRAGON = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 1, new Location_1.Location(3005, 3850));
        this.CHAOS_ELEMENTAL = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 2, new Location_1.Location(3267, 3916));
        this.ELDER_CHAOS_DRUID = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 3, new Location_1.Location(3236, 3636));
        this.CRAZY_ARCHAEOLOGIST = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 4, new Location_1.Location(2980, 3708));
        this.CHAOS_FANATIC = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 5, new Location_1.Location(2986, 3838));
        this.VENENATIS = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 6, new Location_1.Location(3346, 3727));
        this.VET_ION = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 7, new Location_1.Location(3187, 3787));
        this.CALLISTO = new Teleportable(TeleportButton_1.TeleportButton.BOSSES, 2, 8, new Location_1.Location(3312, 3830));
        this.BARROWS = new Teleportable(TeleportButton_1.TeleportButton.MINIGAME, 1, 1, new Location_1.Location(3565, 3313));
        this.FIGHT_CAVES = new Teleportable(TeleportButton_1.TeleportButton.MINIGAME, 1, 2, new Location_1.Location(2439, 5171));
        this.CASTLE_WARS = new Teleportable(TeleportButton_1.TeleportButton.MINIGAME, 1, 3, CastleWars_1.CastleWars.LOBBY_TELEPORT);
        this.teleportButton = teleportButton;
        this.type = type;
        this.index = index;
        this.position = position;
    }
    Teleportable.prototype.getTeleportButton = function () {
        return this.teleportButton;
    };
    Teleportable.prototype.getType = function () {
        return this.type;
    };
    Teleportable.prototype.getIndex = function () {
        return this.index;
    };
    Teleportable.prototype.getPosition = function () {
        return this.position;
    };
    Teleportable.DUEL_ARENA = new Teleportable(TeleportButton_1.TeleportButton.MINIGAME, 1, 0, new Location_1.Location(3370, 3270));
    return Teleportable;
}());
//# sourceMappingURL=Teleportable.js.map