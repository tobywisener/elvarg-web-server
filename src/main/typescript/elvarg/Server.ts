// import { GameBuilder } from "./game/GameBuilder";
// import { GameConstants } from "./game/GameConstants";
import { NetworkBuilder } from "./net/NetworkBuilder";
import { NetworkConstants } from "./net/NetworkConstants";
import { Flooder } from "./util/flood/Flooder";
// import Logger from "logger";
var logger = require("logger");

export class Server {
  private static flooder: Flooder = new Flooder();
  public static PRODUCTION = false;
  private static DEBUG_LOGGING = false;
  private static logger = logger.createLogger(Server.constructor.name);
  private static updating = false;

  public static main(args: string[]) {
    try {
      if (args.length === 1) {
        Server.PRODUCTION = parseInt(args[0], 10) === 1;
      }

      console.info(
        `Initializing Name in ${
          Server.PRODUCTION ? "production" : "non-production"
        } mode..`
      );
      // new GameBuilder().initialize();
      new NetworkBuilder().initialize(NetworkConstants.GAME_PORT);
      console.log("Start");
      // console.info(`${GameConstants.NAME} is now online!`);
    } catch (e) {
      console.log(e, "error");
      console.error(`An error occurred while binding the Bootstrap: ${e}`);
      process.exit(1);
    }
  }

  public static logDebug(logMessage: string) {
    if (!Server.DEBUG_LOGGING) {
      return;
    }

    logger.info(logMessage);
  }

  public static getLogger() {
    return Server.logger;
  }

  public static isUpdating() {
    return Server.updating;
  }

  public static setUpdating(isUpdating: boolean) {
    Server.updating = isUpdating;
  }

  public static getFlooder() {
    return Server.flooder;
  }
}

Server.main(["1"]);
