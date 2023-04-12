"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Bank = /** @class */ (function () {
    function Bank() {
    }
    Bank.prototype.execute = function (player, command, parts) {
        player.getBank(player.getCurrentBankTab()).open();
    };
    Bank.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return Bank;
}());
exports.Bank = Bank;
//# sourceMappingURL=Bank.js.map