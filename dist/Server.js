"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var GameBuilder_1 = require("./game/GameBuilder");
var GameConstants_1 = require("./game/GameConstants");
var NetworkBuilder_1 = require("./net/NetworkBuilder");
var NetworkConstants_1 = require("./net/NetworkConstants");
var Flooder_1 = require("./util/flood/Flooder");
var logger_1 = require("logger");
var Server = exports.Server = /** @class */ (function () {
    function Server() {
    }
    Server.main = function (args) {
        try {
            if (args.length === 1) {
                Server.PRODUCTION = parseInt(args[0], 10) === 1;
            }
            console.info("Initializing ".concat(GameConstants_1.GameConstants.NAME, " in ").concat(Server.PRODUCTION ? 'production' : 'non-production', " mode.."));
            new GameBuilder_1.GameBuilder().initialize();
            new NetworkBuilder_1.NetworkBuilder().initialize(NetworkConstants_1.NetworkConstants.GAME_PORT);
            console.info("".concat(GameConstants_1.GameConstants.NAME, " is now online!"));
        }
        catch (e) {
            console.error("An error occurred while binding the Bootstrap: ".concat(e));
            process.exit(1);
        }
    };
    Server.logDebug = function (logMessage) {
        if (!Server.DEBUG_LOGGING) {
            return;
        }
        Server.getLogger().info(logMessage);
    };
    Server.getLogger = function () {
        return Server.logger;
    };
    Server.isUpdating = function () {
        return Server.updating;
    };
    Server.setUpdating = function (isUpdating) {
        Server.updating = isUpdating;
    };
    Server.getFlooder = function () {
        return Server.flooder;
    };
    Server.flooder = new Flooder_1.Flooder();
    Server.PRODUCTION = false;
    Server.DEBUG_LOGGING = false;
    Server.logger = logger_1.Logger.getLogger(Server.constructor.name);
    Server.updating = false;
    return Server;
}());
//# sourceMappingURL=Server.js.map