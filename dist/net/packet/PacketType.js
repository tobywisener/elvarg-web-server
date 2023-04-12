"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketType = void 0;
var PacketType;
(function (PacketType) {
    /**
     * A fixed size packet where the size never changes.
     */
    PacketType[PacketType["FIXED"] = 0] = "FIXED";
    /**
     * A variable packet where the size is described by a byte.
     */
    PacketType[PacketType["VARIABLE"] = 1] = "VARIABLE";
    /**
     * A packet where the length is sent to its destination with it as a byte.
     */
    PacketType[PacketType["VARIABLE_BYTE"] = 2] = "VARIABLE_BYTE";
    /**
     * A variable packet where the size is described by a word.
     */
    PacketType[PacketType["VARIABLE_SHORT"] = 3] = "VARIABLE_SHORT";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
//# sourceMappingURL=PacketType.js.map