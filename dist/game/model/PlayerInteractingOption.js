"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInteractingOption = exports.PlayerInteractingOptions = void 0;
var PlayerInteractingOptions;
(function (PlayerInteractingOptions) {
    PlayerInteractingOptions[PlayerInteractingOptions["NONE"] = 0] = "NONE";
    PlayerInteractingOptions[PlayerInteractingOptions["CHALLENGE"] = 1] = "CHALLENGE";
    PlayerInteractingOptions[PlayerInteractingOptions["ATTACK"] = 2] = "ATTACK";
})(PlayerInteractingOptions = exports.PlayerInteractingOptions || (exports.PlayerInteractingOptions = {}));
var PlayerInteractingOption = /** @class */ (function () {
    function PlayerInteractingOption() {
    }
    PlayerInteractingOption.forName = function (name) {
        if (name.toLowerCase().includes("null")) {
            return PlayerInteractingOptions.NONE;
        }
        for (var option in PlayerInteractingOption) {
            if (PlayerInteractingOptions[option] == name) {
                return PlayerInteractingOptions[option];
            }
        }
        return null;
    };
    return PlayerInteractingOption;
}());
exports.PlayerInteractingOption = PlayerInteractingOption;
//# sourceMappingURL=PlayerInteractingOption.js.map