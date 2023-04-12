"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightCommand = void 0;
var World_1 = require("../../../../World");
var CommandType_1 = require("./CommandType");
var FightCommand = /** @class */ (function () {
    function FightCommand() {
    }
    FightCommand.prototype.triggers = function () {
        return ["fight"];
    };
    FightCommand.prototype.start = function (playerBot, args) {
        if (!args || args.length == 0 || args[0].toLowerCase() == "me") {
            playerBot.getCombat().attack(playerBot.getInteractingWith());
            playerBot.getInteractingWith().getCombat().attack(playerBot);
            playerBot.sendChat("Sure, Good luck!");
            return;
        }
        var searchName = args.join(" ");
        if (searchName.toLowerCase() == playerBot.getUsername() || !World_1.World.getPlayerBots().has(searchName)) {
            playerBot.sendChat("Sorry, can't find " + searchName + "...");
            return;
        }
        var targetBot = World_1.World.getPlayerBots().get(searchName);
        if (playerBot.getLocation().getDistance(targetBot.getLocation()) >= 40) {
            playerBot.sendChat("Sorry, " + searchName + " is too far away.");
            return;
        }
        playerBot.getCombat().attack(targetBot);
        targetBot.getCombat().attack(playerBot);
    };
    FightCommand.prototype.stop = function (playerBot) {
        playerBot.getCombat().reset();
    };
    FightCommand.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT];
    };
    return FightCommand;
}());
exports.FightCommand = FightCommand;
//# sourceMappingURL=FightCommand.js.map