"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationDate = void 0;
var CreationDate = /** @class */ (function () {
    function CreationDate() {
    }
    CreationDate.prototype.execute = function (player, command, parts) {
        var calendar = new Date(player.getCreationDate().getTime());
        var dateSuffix;
        switch (calendar.getDate() % 10) {
            case 1:
                dateSuffix = "st";
                break;
            case 2:
                dateSuffix = "nd";
                break;
            case 3:
                dateSuffix = "rd";
                break;
            default:
                dateSuffix = "th";
                break;
        }
        player.forceChat("I started playing on the " + calendar.getDate() + dateSuffix + " of "
            + new Intl.DateTimeFormat('en-US', { month: 'long' }).format(calendar) + ", "
            + calendar.getFullYear() + "!");
    };
    CreationDate.prototype.canUse = function (player) {
        return true;
    };
    CreationDate.prototype.getDateSuffix = function (date) {
        switch (date % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    return CreationDate;
}());
exports.CreationDate = CreationDate;
//# sourceMappingURL=CreationDate.js.map