"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commandclass = exports.CommandType = void 0;
var CommandType;
(function (CommandType) {
    CommandType["PUBLIC_CHAT"] = "public chat";
    CommandType["PRIVATE_CHAT"] = "private chat";
    CommandType["CLAN_CHAT"] = "clan chat";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var Commandclass = /** @class */ (function () {
    function Commandclass(label) {
        this.label = label;
    }
    ;
    Commandclass.prototype.getLabel = function () {
        return this.label;
    };
    return Commandclass;
}());
exports.Commandclass = Commandclass;
//# sourceMappingURL=CommandType.js.map