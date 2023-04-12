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
exports.Quests = exports.QuestHandler = void 0;
var CooksAssistant_1 = require("./impl/CooksAssistant");
var QuestHandler = exports.QuestHandler = /** @class */ (function () {
    function QuestHandler() {
    }
    QuestHandler.updateQuestTab = function (player) {
        var e_1, _a;
        player.getPacketSender().sendString("QP: " + player + " ", 3985);
        try {
            for (var _b = __values(Object.values(Quests)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var questRecord = _c.value;
                var quest = questRecord.get();
                player.getPacketSender().sendString(quest.questTabStringId(), questRecord.getProgressColor(player) + questRecord.getName());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    QuestHandler.firstClickNpc = function (player, npc) {
        var e_2, _a;
        try {
            for (var _b = __values(Object.values(Quests)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var questRecord = _c.value;
                if (questRecord.quest.firstClickNpc(player, npc)) {
                    return true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Return false if no Quest handled this NPC click
        return false;
    };
    QuestHandler.NOT_STARTED = 0;
    return QuestHandler;
}());
var Quests = exports.Quests = /** @class */ (function () {
    function Quests(name, quest) {
        this.name = name;
        this.quest = quest;
    }
    Quests.prototype.getName = function () {
        return this.name;
    };
    Quests.prototype.get = function () {
        return this.quest;
    };
    Quests.prototype.getQuest = function () {
        return this.quest;
    };
    Quests.getProgress = function (player) {
        if (!player.getQuestProgress().has(Quests[this.toString()])) {
            return 0;
        }
        return player.getQuestProgress().get(Quests[this.toString()]);
    };
    Quests.prototype.getQuestProgress = function (player, questIndex) {
        if (!player.getQuestProgress().has(questIndex)) {
            return 0;
        }
        return player.getQuestProgress().get(questIndex);
    };
    Quests.prototype.setProgress = function (player, progress) {
        player.getQuestProgress().set(Quests[this.toString()], progress);
        QuestHandler.updateQuestTab(player);
    };
    Quests.prototype.setQuestProgress = function (player, questIndex, progress) {
        player.getQuestProgress().set(questIndex, progress);
        QuestHandler.updateQuestTab(player);
    };
    /**
    
    Gets the progress colour for the Quest tab for the given quest.
    
    @param player The player to check status for
    
    @return progressColor The status colour prefix, e.g. "@red@"
    */
    Quests.prototype.getProgressColor = function (player) {
        var questProgress = Quests.getProgress(player);
        if (questProgress == 0) {
            return "@red@";
        }
        var completeProgress = this.get().completeStatus();
        if (questProgress < completeProgress) {
            return "@yel@";
        }
        return "@gre@";
    };
    Quests.forButton = function (button) {
        var e_3, _a;
        try {
            for (var _b = __values(Object.values(Quests)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var q = _c.value;
                if (q.get().questTabButtonId() === button) {
                    return q;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return null;
    };
    Quests.getOrdinal = function (quest) {
        var e_4, _a;
        try {
            for (var _b = __values(Object.values(Quests)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var q = _c.value;
                if (q.get() === quest) {
                    return q.ordinal();
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return -1;
    };
    Quests.prototype.showRewardInterface = function (player, lines, itemID) {
        var questName = this.getName();
        player.getPacketSender().sendString("You have completed + ".concat(questName, " !"), 12144);
        player.getPacketSender().sendString("".concat(this.get().questPointsReward(), " "), 12147);
        for (var i = 0; i < 5; i++) {
            player.getPacketSender().sendString(lines[i], 12150 + i);
        }
        if (itemID > 0) {
            player.getPacketSender().sendInterfaceModel(12145, itemID, 250);
        }
        player.getPacketSender().sendInterface(12140);
    };
    Quests.handleQuestButtonClick = function (player, buttonId) {
        var quest = Quests.forButton(buttonId);
        if (quest == null) {
            // There is no quest for this button ID
            return false;
        }
        var status = player.getQuestProgress().get(quest.getQuestProgress(player, buttonId));
        quest.get().showQuestLog(player, status);
        return true;
    };
    /**
     
    This function blanks out all lines on the Quest log interface.
    @param player
    */
    Quests.clearQuestLogInterface = function (player) {
        for (var i = 8144; i < 8195; i++) {
            player.getPacketSender().sendString("", i);
        }
    };
    Quests.COOKS_ASSISTANT = new Quests("Cook's Assistant", new CooksAssistant_1.CooksAssistant());
    return Quests;
}());
//# sourceMappingURL=QuestHandler.js.map