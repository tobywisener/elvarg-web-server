"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannedMember = void 0;
var SecondsTimer_1 = require("../../model/SecondsTimer");
var BannedMember = /** @class */ (function () {
    function BannedMember(name, seconds) {
        this.name = name;
        this.timer = new SecondsTimer_1.SecondsTimer();
    }
    BannedMember.prototype.getTimer = function () {
        return this.timer;
    };
    BannedMember.prototype.setTimer = function (timer) {
        this.timer = timer;
    };
    BannedMember.prototype.getName = function () {
        return this.name;
    };
    BannedMember.prototype.setName = function (name) {
        this.name = name;
    };
    return BannedMember;
}());
exports.BannedMember = BannedMember;
//# sourceMappingURL=BannedMember.js.map