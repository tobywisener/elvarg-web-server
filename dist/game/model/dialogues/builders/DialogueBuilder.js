"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueBuilder = void 0;
var DialogueBuilder = /** @class */ (function () {
    function DialogueBuilder() {
        this.dialogues = new Map();
    }
    DialogueBuilder.prototype.add = function () {
        var e_1, _a;
        var dialogues = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dialogues[_i] = arguments[_i];
        }
        try {
            for (var dialogues_1 = __values(dialogues), dialogues_1_1 = dialogues_1.next(); !dialogues_1_1.done; dialogues_1_1 = dialogues_1.next()) {
                var dialogue = dialogues_1_1.value;
                this.dialogues.set(dialogue.getIndex(), dialogue);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dialogues_1_1 && !dialogues_1_1.done && (_a = dialogues_1.return)) _a.call(dialogues_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    DialogueBuilder.prototype.getDialogues = function () {
        return this.dialogues;
    };
    return DialogueBuilder;
}());
exports.DialogueBuilder = DialogueBuilder;
//# sourceMappingURL=DialogueBuilder.js.map