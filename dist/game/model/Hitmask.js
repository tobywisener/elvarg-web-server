"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmask = void 0;
var Hitmask;
(function (Hitmask) {
    /*
     * A normal red hitmask.
     */
    Hitmask[Hitmask["RED"] = 0] = "RED";
    /*
     * An orange-like hitmask, representing a high-hit.
     */
    Hitmask[Hitmask["CRITICAL"] = 1] = "CRITICAL";
    /*
     * A green hitmask representing a poison hit
     */
    Hitmask[Hitmask["RED2"] = 2] = "RED2";
    /*
     * A light-yellow hitmask
     */
    Hitmask[Hitmask["LIGHT_YELLOW"] = 3] = "LIGHT_YELLOW";
    /*
     * A dark purple hitmask
     */
    Hitmask[Hitmask["DARK_PURPLE"] = 4] = "DARK_PURPLE";
    /*
     * A dark red hitmask
     */
    Hitmask[Hitmask["DARK_RED"] = 5] = "DARK_RED";
    /*
     * A dark crit hitmask
     */
    Hitmask[Hitmask["DARK_CRIT"] = 6] = "DARK_CRIT";
    /*
     * A green hitmask representing poison
     */
    Hitmask[Hitmask["DARK_GREEN"] = 7] = "DARK_GREEN";
    /*
     * No hitmask
     */
    Hitmask[Hitmask["NONE"] = 8] = "NONE";
})(Hitmask = exports.Hitmask || (exports.Hitmask = {}));
//# sourceMappingURL=Hitmask.js.map