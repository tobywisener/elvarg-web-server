"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PestControlBoat = void 0;
var Location_1 = require("../../../../model/Location");
var PestControlBoat = exports.PestControlBoat = /** @class */ (function () {
    function PestControlBoat(combatLevelRequirement, objectId, enterBoatLocation, squireId, void_knight_id, name) {
        this.combatLevelRequirement = combatLevelRequirement;
        this.objectId = objectId;
        this.enterBoatLocation = enterBoatLocation;
        this.squireId = squireId;
        this.void_knight_id = void_knight_id;
        this.name = name;
    }
    ;
    PestControlBoat.prototype.getQueue = function () {
        if (!this.queue) {
            this.queue = [];
        }
        return this.queue;
    };
    PestControlBoat.getBoat = function (ladderId) {
        var _a;
        var boats = Object.values(PestControlBoat);
        return (_a = boats.find(function (l) { return l.objectId === ladderId; })) !== null && _a !== void 0 ? _a : null;
    };
    PestControlBoat.prototype.getName = function () {
        return this.name;
    };
    PestControlBoat.NOVICE = new PestControlBoat(40, 14315, new Location_1.Location(2661, 2639), 1771, 2953, "NOVICE");
    PestControlBoat.INTERMEDIATE = new PestControlBoat(70, 25631, new Location_1.Location(2640, 2644), 1772, 2953, "INTERMEDIATE");
    PestControlBoat.VETERAN = new PestControlBoat(100, 25632, new Location_1.Location(2634, 2653), 1773, 2950, "VETERAN");
    return PestControlBoat;
}());
//# sourceMappingURL=PestControlBoat.js.map