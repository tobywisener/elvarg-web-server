"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
var ChatMessage = /** @class */ (function () {
    // *
    //     * The Message constructor.
    //     *
    //     * @param colour  The color the message will have, done through color(#):
    //     * @param effects The effect the message will have, done through effect(#):
    //     * @param text    The actual message it will have.
    function ChatMessage(colour, effects, text) {
        this.colour = colour;
        this.effects = effects;
        this.text = text;
    }
    ChatMessage.prototype.getColour = function () {
        return this.colour;
    };
    ChatMessage.prototype.getEffects = function () {
        return this.effects;
    };
    ChatMessage.prototype.getText = function () {
        return this.text;
    };
    return ChatMessage;
}());
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=ChatMessage.js.map