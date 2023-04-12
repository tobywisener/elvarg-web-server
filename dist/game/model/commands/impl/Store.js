"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var Store = /** @class */ (function () {
    function Store() {
    }
    Store.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendURL("http://www.deadlypkers.net");
    };
    Store.prototype.canUse = function (player) {
        return true;
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=Store.js.map