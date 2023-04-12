"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonatorRights = void 0;
var DonatorRights = exports.DonatorRights = /** @class */ (function () {
    function DonatorRights() {
    }
    DonatorRights.getSpriteId = function (rights) {
        return rights.spriteId;
    };
    DonatorRights.getYellDelay = function (rights) {
        return rights.yellDelay;
    };
    DonatorRights.getYellTag = function (rights) {
        return rights.yellTag;
    };
    DonatorRights.NONE = { spriteId: -1, yellDelay: -1, yellTag: "" };
    DonatorRights.REGULAR_DONATOR = { spriteId: 622, yellDelay: 40, yellTag: "[Donator]" };
    DonatorRights.SUPER_DONATOR = { spriteId: 623, yellDelay: 25, yellTag: "[Super Donator]" };
    DonatorRights.UBER_DONATOR = { spriteId: 624, yellDelay: 10, yellTag: "[Uber Donator]" };
    return DonatorRights;
}());
//# sourceMappingURL=DonatorRights.js.map