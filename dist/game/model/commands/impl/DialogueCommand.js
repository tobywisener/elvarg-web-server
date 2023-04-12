"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var DialogueCommand = /** @class */ (function () {
    function DialogueCommand() {
    }
    DialogueCommand.prototype.execute = function (player, command, parts) {
    };
    DialogueCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return DialogueCommand;
}());
exports.DialogueCommand = DialogueCommand;
//# sourceMappingURL=DialogueCommand.js.map