"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueManager = void 0;
var DynamicDialogueBuilder_1 = require("./builders/DynamicDialogueBuilder");
var TestStaticDialogue_1 = require("../../model/dialogues/builders/impl/TestStaticDialogue");
var OptionsDialogue_1 = require("./entries/impl/OptionsDialogue");
var OptionDialogue_1 = require("./entries/impl/OptionDialogue");
var DialogueExpression_1 = require("./DialogueExpression");
var DialogueManager = exports.DialogueManager = /** @class */ (function () {
    /**
     * Creates a new {@link DialogueManager} for the given {@link Player}.
     *
     * @param player
     */
    function DialogueManager(player) {
        /**
         * A {@link Map} which holds all of the current dialogue entries and indexes.
         */
        this.dialogues = new Map();
        this.player = player;
    }
    /**
     * Resets all of the attributes of the {@link DialogueManager}.
     */
    DialogueManager.prototype.reset = function () {
        this.dialogues.clear();
        this.index = -1;
    };
    /**
     * Advances, starting the next dialogue.
     */
    DialogueManager.prototype.advance = function () {
        var current = this.dialogues.get(this.index);
        if (current == null) {
            this.reset();
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        var continueAction = current.getContinueAction();
        if (continueAction != null) {
            // This dialogue has a custom continue action
            continueAction.execute(this.player);
            this.reset();
            return;
        }
        this.startDialogue(this.index + 1);
    };
    DialogueManager.prototype.startDialogue = function (index) {
        this.index = index;
        this.startDialogueOption();
    };
    DialogueManager.prototype.startStaticDialogue = function (id) {
        var builder = DialogueManager.STATIC_DIALOGUES.get(id);
        if (builder) {
            this.startDialogueOption();
        }
    };
    DialogueManager.prototype.startDialogues = function (builder) {
        this.startDialogue(0);
    };
    DialogueManager.prototype.startDialog = function (builder, index) {
        if (builder instanceof DynamicDialogueBuilder_1.DynamicDialogueBuilder) {
            builder.build(this.player);
        }
        this.startDialogueMap(builder.getDialogues(), index);
        return new DialogueExpression_1.DialogueExpression(index);
    };
    DialogueManager.prototype.startDialogueMap = function (entries, index) {
        var _this = this;
        this.reset();
        this.dialogues.clear();
        entries.forEach(function (value, key) {
            _this.dialogues.set(key, value);
        });
        this.startDialogueOption();
    };
    DialogueManager.prototype.startDialogueOption = function () {
        var dialogue = this.dialogues.get(this.index);
        if (!dialogue) {
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        dialogue.send(this.player);
    };
    DialogueManager.prototype.handleOption = function (option) {
        var dialogue = this.dialogues.get(this.index);
        if (dialogue instanceof OptionsDialogue_1.OptionsDialogue) {
            dialogue.execute(option, this.player);
            return;
        }
        if (!(dialogue instanceof OptionDialogue_1.OptionDialogue)) {
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        dialogue.execute(option);
    };
    DialogueManager.STATIC_DIALOGUES = new Map();
    (function () {
        DialogueManager.STATIC_DIALOGUES.set(0, new TestStaticDialogue_1.TestStaticDialogue());
    })();
    return DialogueManager;
}());
//# sourceMappingURL=DialogueManager.js.map