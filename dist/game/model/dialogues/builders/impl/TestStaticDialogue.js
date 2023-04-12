"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStaticDialogue = void 0;
var DialogueBuilder_1 = require("../../../../model/dialogues/builders/DialogueBuilder");
var NpcDialogue_1 = require("../../entries/impl/NpcDialogue");
var PlayerDialogue_1 = require("../../../../model/dialogues/entries/impl/PlayerDialogue");
var TestStaticDialogue = /** @class */ (function (_super) {
    __extends(TestStaticDialogue, _super);
    function TestStaticDialogue() {
        var _this = _super.call(this) || this;
        _this.add(new PlayerDialogue_1.PlayerDialogue(0, "Well this works just fine."), new PlayerDialogue_1.PlayerDialogue(1, "Second test"), new NpcDialogue_1.NpcDialogue(2, 6797, "okay great."));
        return _this;
    }
    return TestStaticDialogue;
}(DialogueBuilder_1.DialogueBuilder));
exports.TestStaticDialogue = TestStaticDialogue;
//# sourceMappingURL=TestStaticDialogue.js.map