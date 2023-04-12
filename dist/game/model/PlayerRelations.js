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
exports.PrivateChatStatus = exports.PlayerRelations = void 0;
var World_1 = require("../World");
var Misc_1 = require("../../util/Misc");
var ClanChatManager_1 = require("../content/clan/ClanChatManager");
var PlayerRelations = /** @class */ (function () {
    function PlayerRelations(player) {
        this.status = PrivateChatStatus.ON;
        this.friendList = new Array(200);
        this.ignoreList = new Array(100);
        this.privateMessageId = 1;
        this.player = player;
    }
    PlayerRelations.prototype.getPrivateMessageId = function () {
        return this.privateMessageId++;
    };
    PlayerRelations.prototype.setPrivateMessageId = function (privateMessageId) {
        this.privateMessageId = privateMessageId;
        return this;
    };
    PlayerRelations.prototype.setStatus = function (status, update) {
        this.status = status;
        if (update) {
            this.updateLists(true);
        }
        return this;
    };
    PlayerRelations.prototype.getStatus = function () {
        return this.status;
    };
    PlayerRelations.prototype.getFriendList = function () {
        return this.friendList;
    };
    PlayerRelations.prototype.getIgnoreList = function () {
        return this.ignoreList;
    };
    PlayerRelations.prototype.updateLists = function (online) {
        var e_1, _a;
        if (this.status == PrivateChatStatus.OFF) {
            online = false;
        }
        this.player.getPacketSender().sendFriendStatus(2);
        try {
            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var players = _c.value;
                if (!players) {
                    continue;
                }
                var temporaryOnlineStatus = online;
                if (players.getRelations().friendList.includes(this.player.getLongUsername())) {
                    if (this.status === PrivateChatStatus.FRIENDS_ONLY && !this.friendList.includes(players.getLongUsername())
                        || this.status === PrivateChatStatus.OFF || this.ignoreList.includes(players.getLongUsername())) {
                        temporaryOnlineStatus = false;
                    }
                    players.getPacketSender().sendFriend(this.player.getLongUsername(), temporaryOnlineStatus ? 1 : 0);
                }
                var tempOn = true;
                if (this.player.getRelations().friendList.includes(players.getLongUsername())) {
                    if (players.getRelations().status === PrivateChatStatus.FRIENDS_ONLY
                        && !players.getRelations().getFriendList().includes(this.player.getLongUsername())
                        || players.getRelations().status === PrivateChatStatus.OFF
                        || players.getRelations().getIgnoreList().includes(this.player.getLongUsername())) {
                        tempOn = false;
                    }
                    this.player.getPacketSender().sendFriend(players.getLongUsername(), tempOn ? 1 : 0);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    PlayerRelations.prototype.sendPrivateStatus = function () {
        var privateChat = this.status === PrivateChatStatus.OFF ? 2 : this.status === PrivateChatStatus.FRIENDS_ONLY ? 1 : 0;
        this.player.getPacketSender().sendChatOptions(0, privateChat, 0);
    };
    PlayerRelations.prototype.sendFriends = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.friendList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var l = _c.value;
                this.player.getPacketSender().sendFriend(l, 0);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    PlayerRelations.prototype.sendIgnores = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.ignoreList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var l = _c.value;
                this.player.getPacketSender().sendAddIgnore(l);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    PlayerRelations.prototype.sendAddFriend = function (name) {
        this.player.getPacketSender().sendFriend(name, 0);
    };
    PlayerRelations.prototype.sendDeleteFriend = function (name) {
        this.player.getPacketSender().sendDeleteFriend(name);
    };
    PlayerRelations.prototype.sendAddIgnore = function (name) {
        this.player.getPacketSender().sendAddIgnore(name);
    };
    PlayerRelations.prototype.sendDeleteIgnore = function (name) {
        this.player.getPacketSender().sendDeleteIgnore(name);
    };
    PlayerRelations.prototype.onLogin = function (player) {
        this.sendIgnores();
        this.sendFriends();
        this.sendPrivateStatus();
        return this;
    };
    PlayerRelations.prototype.addFriend = function (username) {
        var name = Misc_1.Misc.formatName(Misc_1.Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        if (this.friendList.length >= 200) {
            this.player.getPacketSender().sendMessage("Your friend list is full!");
            return;
        }
        if (this.ignoreList.indexOf(username) !== -1) {
            this.player.getPacketSender().sendMessage("Please remove " + name + " from your ignore list first.");
            return;
        }
        if (this.friendList.indexOf(username) !== -1) {
            this.player.getPacketSender().sendMessage(name + " is already on your friends list!");
        }
        else {
            this.friendList.push(username);
            this.sendAddFriend(username);
            this.updateLists(true);
            var friend = World_1.World.getPlayerByName(name);
            if (friend) {
                friend.getRelations().updateLists(true);
                ClanChatManager_1.ClanChatManager.updateRank(ClanChatManager_1.ClanChatManager.getClanChat(this.player), friend);
                if (this.player.getInterfaceId() === ClanChatManager_1.ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                    ClanChatManager_1.ClanChatManager.clanChatSetupInterface(this.player);
                }
            }
        }
    };
    PlayerRelations.prototype.isFriendWith = function (player) {
        return this.friendList.indexOf(Misc_1.Misc.stringToLong(player)) !== -1;
    };
    PlayerRelations.prototype.deleteFriend = function (username) {
        var name = Misc_1.Misc.formatName(Misc_1.Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        var friendIndex = this.friendList.indexOf(username);
        if (friendIndex !== -1) {
            this.friendList.splice(friendIndex, 1);
            this.sendDeleteFriend(username);
            this.updateLists(false);
            var unfriend = World_1.World.getPlayerByName(name);
            if (unfriend) {
                unfriend.getRelations().updateLists(false);
                ClanChatManager_1.ClanChatManager.updateRank(ClanChatManager_1.ClanChatManager.getClanChat(this.player), unfriend);
                if (this.player.getInterfaceId() === ClanChatManager_1.ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                    ClanChatManager_1.ClanChatManager.clanChatSetupInterface(this.player);
                }
            }
        }
        else {
            this.player.getPacketSender().sendMessage("This player is not on your friends list!");
        }
    };
    PlayerRelations.prototype.addIgnore = function (username) {
        var name = Misc_1.Misc.formatName(Misc_1.Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        if (this.ignoreList.length >= 100) {
            this.player.getPacketSender().sendMessage("Your ignore list is full!");
            return;
        }
        if (this.friendList.indexOf(username) !== -1) {
            this.player.getPacketSender().sendMessage("Please remove " + name + " from your friend list first.");
            return;
        }
        if (this.ignoreList.indexOf(username) !== -1) {
            this.player.getPacketSender().sendMessage(name + " is already on your ignore list!");
        }
        else {
            this.ignoreList.push(username);
            this.sendAddIgnore(username);
            this.updateLists(true);
            var ignored = World_1.World.getPlayerByName(name);
            if (ignored) {
                ignored.getRelations().updateLists(false);
            }
        }
    };
    PlayerRelations.prototype.deleteIgnore = function (username) {
        var name = Misc_1.Misc.formatName(Misc_1.Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        var ignoreIndex = this.ignoreList.indexOf(username);
        if (ignoreIndex !== -1) {
            this.ignoreList.splice(ignoreIndex, 1);
            this.sendDeleteIgnore(username);
            this.updateLists(true);
            if (this.status === PrivateChatStatus.ON) {
                var ignored = World_1.World.getPlayerByName(name);
                if (ignored) {
                    ignored.getRelations().updateLists(true);
                }
            }
        }
        else {
            this.player.getPacketSender().sendMessage("This player is not on your ignore list!");
        }
    };
    PlayerRelations.prototype.message = function (friend, message, size) {
        if ((friend.getRelations().status === PrivateChatStatus.FRIENDS_ONLY && friend.getRelations().friendList.indexOf(this.player.getLongUsername()) === -1) || friend.getRelations().status === PrivateChatStatus.OFF) {
            this.player.getPacketSender().sendMessage("This player is currently offline.");
            return;
        }
        if (this.status === PrivateChatStatus.OFF) {
            this.setStatus(PrivateChatStatus.FRIENDS_ONLY, true);
        }
        friend.getPacketSender().sendPrivateMessage(this.player, message, size);
    };
    return PlayerRelations;
}());
exports.PlayerRelations = PlayerRelations;
var PrivateChatStatus;
(function (PrivateChatStatus) {
    PrivateChatStatus[PrivateChatStatus["ON"] = 0] = "ON";
    PrivateChatStatus[PrivateChatStatus["FRIENDS_ONLY"] = 1] = "FRIENDS_ONLY";
    PrivateChatStatus[PrivateChatStatus["OFF"] = 2] = "OFF";
})(PrivateChatStatus = exports.PrivateChatStatus || (exports.PrivateChatStatus = {}));
//# sourceMappingURL=PlayerRelations.js.map