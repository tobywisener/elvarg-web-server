"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGESellInt = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var ItemDefinition_1 = require("../../../definition/ItemDefinition");
var TestGESellInt = /** @class */ (function () {
    function TestGESellInt() {
    }
    TestGESellInt.prototype.execute = function (player, command, parts) {
        player.getPacketSender().
            sendItemOnInterfaces(24780, parseInt(parts[1]), 1).
            sendString(ItemDefinition_1.ItemDefinition.forId(parseInt(parts[1])).getName(), 24769).
            sendString(ItemDefinition_1.ItemDefinition.forId(parseInt(parts[1])).getExamine(), 24770);
    };
    TestGESellInt.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return TestGESellInt;
}());
exports.TestGESellInt = TestGESellInt;
//# sourceMappingURL=TestGESellInt.js.map