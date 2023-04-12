"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackType = void 0;
var StackType;
(function (StackType) {
    /*
     * Default type, items that will not stack, such as inventory items (excluding noted/stackable items).
     */
    StackType[StackType["DEFAULT"] = 0] = "DEFAULT";
    /*
     * Stacks type, items that will stack, such as shops or banks.
     */
    StackType[StackType["STACKS"] = 1] = "STACKS";
})(StackType = exports.StackType || (exports.StackType = {}));
//# sourceMappingURL=StackType.js.map