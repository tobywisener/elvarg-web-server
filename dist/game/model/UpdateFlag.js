"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFlag = void 0;
var UpdateFlag = /** @class */ (function () {
    function UpdateFlag() {
        /**
        * A set containing the entity's update flags.
        */
        this.flags = new Set();
    }
    /**
 * Checks if {@code flag} is contained in the entity's flag set.
 *
 * @param flag The flag to check.
 * @return The flags set contains said flag.
 */
    UpdateFlag.prototype.flagged = function (flag) {
        return this.flags.has(flag);
    };
    /**
     * Checks if an update is required by checking if flags set is empty.
     *
     * @return Flags set is not empty.
     */
    UpdateFlag.prototype.isUpdateRequired = function () {
        return this.flags.size !== 0;
    };
    /**
     * Puts a flag value into the flags set.
     *
     * @param flag Flag to put into the flags set.
     * @return The UpdateFlag instance.
     */
    UpdateFlag.prototype.flag = function (flag) {
        this.flags.add(flag);
        return this;
    };
    /**
     * Removes every flag in the flags set.
     *
     * @return The UpdateFlag instance.
     */
    UpdateFlag.prototype.reset = function () {
        this.flags.clear();
        return this;
    };
    return UpdateFlag;
}());
exports.UpdateFlag = UpdateFlag;
//# sourceMappingURL=UpdateFlag.js.map