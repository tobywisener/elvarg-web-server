"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportTablets = void 0;
var Location_1 = require("../Location");
var TeleportHandler_1 = require("./TeleportHandler");
var TeleportType_1 = require("./TeleportType");
var TeleportTablets = /** @class */ (function () {
    function TeleportTablets() {
    }
    TeleportTablets.init = function (player, itemId) {
        var tab = TeleportTablet.getTab(itemId);
        // Checks if the tab isn't present, if not perform nothing
        if (!tab) {
            return false;
        }
        //Handle present tab..
        if (player.getInventory().containsNumber(tab.tabId)) {
            if (TeleportHandler_1.TeleportHandler.checkReqs(player, tab.position)) {
                TeleportHandler_1.TeleportHandler.teleport(player, tab.position, TeleportType_1.TeleportType.TELE_TAB, false);
                player.getInventory().deleteNumber(tab.tabId, 1);
            }
        }
        return true;
    };
    return TeleportTablets;
}());
exports.TeleportTablets = TeleportTablets;
var TeleportTablet = /** @class */ (function () {
    /**
     * TeleportTablet constructor.
     *
     * @param tabId The item ID of the teleport tablet.
     * @param position The specified location that the teleport tablet will send the player upon interaction.
     */
    function TeleportTablet(tabId, position) {
        this.HOME = new TeleportTablet(1, new Location_1.Location(3222, 3222, 0));
        this.LUMBRIDGE = new TeleportTablet(8008, new Location_1.Location(3222, 3218, 0));
        this.FALADOR = new TeleportTablet(8009, new Location_1.Location(2965, 3379, 0));
        this.CAMELOT = new TeleportTablet(8010, new Location_1.Location(2757, 3477, 0));
        this.ARDY = new TeleportTablet(8011, new Location_1.Location(2661, 3305, 0));
        this.WATCH = new TeleportTablet(8012, new Location_1.Location(2549, 3112, 0));
        this.VARROCK = new TeleportTablet(8007, new Location_1.Location(3213, 3424, 0));
        this.tabId = tabId;
        this.position = position;
    }
    /**
     * Gets the teleport tablet with the specified item ID.
     *
     * @param tabId The item ID of the teleport tablet.
     * @returns The teleport tablet with the specified item ID, if it exists.
     */
    TeleportTablet.getTab = function (tabId) {
        return Array.from(TeleportTablet.tab_set).find(function (tabs) { return tabs.getTab() === tabId; });
    };
    /**
     * Gets the item ID of the teleport tablet.
     *
     * @returns The item ID of the teleport tablet.
     */
    TeleportTablet.prototype.getTab = function () {
        return this.tabId;
    };
    /**
     * Gets the specified location that the teleport tablet will send the player upon interaction.
     *
     * @returns The specified location that the teleport tablet will send the player upon interaction.
     */
    TeleportTablet.prototype.getPosition = function () {
        return this.position;
    };
    /**
     * The {@value #tab_set} storing
     */
    TeleportTablet.tab_set = new Set(Object.values(TeleportTablet));
    return TeleportTablet;
}());
//# sourceMappingURL=TeleportTablets.js.map