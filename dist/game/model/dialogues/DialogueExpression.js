"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueExpression = void 0;
var DialogueExpression = exports.DialogueExpression = /** @class */ (function () {
    function DialogueExpression(expression) {
        this.expression = expression;
    }
    DialogueExpression.prototype.getExpression = function () {
        return this.expression;
    };
    DialogueExpression.HAPPY = new DialogueExpression(588);
    DialogueExpression.CALM = new DialogueExpression(589);
    DialogueExpression.CALM_CONTINUED = new DialogueExpression(590);
    DialogueExpression.DEFAULT = new DialogueExpression(591);
    DialogueExpression.EVIL = new DialogueExpression(592);
    DialogueExpression.EVIL_CONTINUED = new DialogueExpression(593);
    DialogueExpression.DELIGHTED_EVIL = new DialogueExpression(594);
    DialogueExpression.ANNOYED = new DialogueExpression(595);
    DialogueExpression.DISTRESSED = new DialogueExpression(596);
    DialogueExpression.DISTRESSED_CONTINUED = new DialogueExpression(597);
    DialogueExpression.DISORIENTED_LEFT = new DialogueExpression(600);
    DialogueExpression.DISORIENTED_RIGHT = new DialogueExpression(601);
    DialogueExpression.UNINTERESTED = new DialogueExpression(602);
    DialogueExpression.SLEEPY = new DialogueExpression(603);
    DialogueExpression.PLAIN_EVIL = new DialogueExpression(604);
    DialogueExpression.LAUGHING = new DialogueExpression(605);
    DialogueExpression.LAUGHING_2 = new DialogueExpression(608);
    DialogueExpression.LONGER_LAUGHING = new DialogueExpression(606);
    DialogueExpression.LONGER_LAUGHING_2 = new DialogueExpression(607);
    DialogueExpression.EVIL_LAUGH_SHORT = new DialogueExpression(609);
    DialogueExpression.SLIGHTLY_SAD = new DialogueExpression(610);
    DialogueExpression.SAD = new DialogueExpression(599);
    DialogueExpression.VERY_SAD = new DialogueExpression(611);
    DialogueExpression.OTHER = new DialogueExpression(612);
    DialogueExpression.NEAR_TEARS = new DialogueExpression(598);
    DialogueExpression.NEAR_TEARS_2 = new DialogueExpression(613);
    DialogueExpression.ANGRY_1 = new DialogueExpression(614);
    DialogueExpression.ANGRY_2 = new DialogueExpression(615);
    DialogueExpression.ANGRY_3 = new DialogueExpression(616);
    DialogueExpression.ANGRY_4 = new DialogueExpression(617);
    return DialogueExpression;
}());
//# sourceMappingURL=DialogueExpression.js.map