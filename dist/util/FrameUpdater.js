"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameUpdater = exports.Frame126 = void 0;
var hashmap_1 = require("hashmap");
var Frame126 = /** @class */ (function () {
    function Frame126(s, id) {
        this.currentState = s;
        this.id = id;
    }
    return Frame126;
}());
exports.Frame126 = Frame126;
var FrameUpdater = /** @class */ (function () {
    function FrameUpdater() {
        this.interfaceTextMap = new hashmap_1.HashMap();
    }
    FrameUpdater.prototype.shouldUpdate = function (text, id) {
        if (!this.interfaceTextMap.has(id)) {
            this.interfaceTextMap.set(id, new Frame126(text, id));
        }
        else {
            var t = this.interfaceTextMap.get(id);
            if (text === t.currentState) {
                return false;
            }
            t.currentState = text;
        }
        return true;
    };
    return FrameUpdater;
}());
exports.FrameUpdater = FrameUpdater;
//# sourceMappingURL=FrameUpdater.js.map