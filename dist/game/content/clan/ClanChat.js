"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClanChat = void 0;
var World_1 = require("../../World");
var BannedMember_1 = require("./BannedMember");
var ClanChat = exports.ClanChat = /** @class */ (function () {
    function ClanChat() {
        this.rankRequirement = new Array(3);
        this.members = new Array();
        this.bannedMembers = new Array();
        this.rankedNames = new Map();
    }
    ClanChat.prototype.ClanChat = function (ownerName, name, index) {
        var o = World_1.World.getPlayerByName(ownerName);
        this.owner = o ? o : null;
        this.ownerName = ownerName;
        this.name = name;
        this.index = index;
    };
    ClanChat.prototype.getOwner = function () {
        return this.owner;
    };
    ClanChat.prototype.setOwner = function (owner) {
        this.owner = owner;
        return this;
    };
    ClanChat.prototype.getOwnerName = function () {
        return this.ownerName;
    };
    ClanChat.prototype.getIndex = function () {
        return this.index;
    };
    ClanChat.prototype.getName = function () {
        return this.name;
    };
    ClanChat.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ClanChat.prototype.getLootShare = function () {
        return this.lootShare;
    };
    ClanChat.prototype.setLootShare = function (lootShare) {
        this.lootShare = lootShare;
    };
    ClanChat.prototype.addMember = function (member) {
        this.members.push(member);
        return this;
    };
    ClanChat.prototype.removeMember = function (name) {
        for (var i = 0; i < this.members.length; i++) {
            var member = this.members[i];
            if (member == null)
                continue;
            if (member.getUsername() === name) {
                this.members.splice(i, 1);
                break;
            }
        }
        return this;
    };
    ClanChat.prototype.getPlayerRank = function (player) {
        return this.getRank(player.getUsername());
    };
    ClanChat.prototype.givePlayerRank = function (player, rank) {
        return this.giveRank(player.getUsername(), rank);
    };
    ClanChat.prototype.getRank = function (player) {
        return this.rankedNames.get(player);
    };
    ClanChat.prototype.giveRank = function (player, rank) {
        this.rankedNames.set(player, rank);
        return this;
    };
    ClanChat.prototype.getMembers = function () {
        return this.members;
    };
    ClanChat.prototype.getRankedNames = function () {
        return this.rankedNames;
    };
    ClanChat.prototype.getBannedNames = function () {
        return this.bannedMembers;
    };
    ClanChat.prototype.addBannedName = function (name) {
        this.bannedMembers.push(new BannedMember_1.BannedMember(name, 1800));
    };
    ClanChat.prototype.isBanned = function (name) {
        for (var i = 0; i < this.bannedMembers.length; i++) {
            var b = this.bannedMembers[i];
            if (b == null || b.getTimer().finished()) {
                this.bannedMembers.splice(i, 1);
                continue;
            }
            if (b.getName() === name) {
                return true;
            }
        }
        return false;
    };
    ClanChat.prototype.getRankRequirement = function () {
        return this.rankRequirement;
    };
    ClanChat.prototype.setRankRequirements = function (index, rankRequirement) {
        this.rankRequirement[index] = rankRequirement;
        return this;
    };
    ClanChat.RANK_REQUIRED_TO_ENTER = 0;
    ClanChat.RANK_REQUIRED_TO_KICK = 1;
    ClanChat.RANK_REQUIRED_TO_TALK = 2;
    return ClanChat;
}());
//# sourceMappingURL=ClanChat.js.map