"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnObjectCommand = void 0;
var GameObject_1 = require("../../../entity/impl/object/GameObject");
var ObjectManager_1 = require("../../../entity/impl/object/ObjectManager");
var PlayerRights_1 = require("../../rights/PlayerRights");
var SpawnObjectCommand = /** @class */ (function () {
    function SpawnObjectCommand() {
    }
    SpawnObjectCommand.prototype.execute = function (player, command, parts) {
        var id = parseInt(parts[1]);
        var type = parts.length == 3 ? parseInt(parts[2]) : 10;
        var face = parts.length == 4 ? parseInt(parts[3]) : 0;
        var gameObject = new GameObject_1.GameObject(id, player.getLocation().clone(), type, face, player.getPrivateArea());
        ObjectManager_1.ObjectManager.register(gameObject, true);
    };
    SpawnObjectCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return SpawnObjectCommand;
}());
exports.SpawnObjectCommand = SpawnObjectCommand;
//# sourceMappingURL=SpawnObjectCommand.js.map