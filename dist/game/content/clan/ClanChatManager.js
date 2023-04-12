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
exports.ClanChatManager = void 0;
var fs = require("fs-extra");
var path = require("path");
var GameLogic_1 = require("../../GameLogic");
var World_1 = require("../../World");
var DonatorRights_1 = require("../../model/rights/DonatorRights");
var PlayerRights_1 = require("../../model/rights/PlayerRights");
var Misc_1 = require("../../../util/Misc");
var PlayerPunishment_1 = require("../../../util/PlayerPunishment");
var ClanChat_1 = require("./ClanChat");
var ClanChatRank_1 = require("./ClanChatRank");
var GameConstants_1 = require("../../GameConstants");
var ClanChatEntered = /** @class */ (function () {
    function ClanChatEntered(execFunc) {
        this.execFunc = execFunc;
    }
    ClanChatEntered.prototype.execute = function (syntax) {
        this.execFunc();
    };
    return ClanChatEntered;
}());
var ClanChatManager = exports.ClanChatManager = /** @class */ (function () {
    function ClanChatManager() {
    }
    ClanChatManager.init = function () {
        var e_1, _a;
        try {
            var dir = path.join(ClanChatManager.FILE_DIRECTORY);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var files = fs.readdirSync(dir);
            try {
                for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    if (!fs.existsSync(dir))
                        continue;
                    var data = fs.readFileSync(file);
                    var input = new DataView(data.buffer);
                    var name_1 = input.getUint8(0);
                    var owner = input.getUint8(1);
                    var index = input.getUint16(2);
                    var clan = new ClanChat_1.ClanChat();
                    var rankId = input.getUint16(2);
                    var rankNumber = parseInt(rankId.toString());
                    clan.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER, ClanChatRank_1.ClanChatRank.forId(rankNumber));
                    clan.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK, ClanChatRank_1.ClanChatRank.forId(rankNumber));
                    clan.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK, ClanChatRank_1.ClanChatRank.forId(rankNumber));
                    var offset = 2;
                    var totalRanks = input.getInt16(0);
                    for (var i = 0; i < totalRanks; i++) {
                        var nameLength = input.getUint8(offset);
                        offset++;
                        var name_2 = new TextDecoder("utf-8").decode(new Uint8Array(data.buffer, offset, nameLength));
                        offset += nameLength;
                        var rankId_1 = input.getUint16(offset);
                        offset += 2;
                        clan.getRankedNames().set(name_2, ClanChatRank_1.ClanChatRank.forMenuId(rankId_1));
                    }
                    var totalBans = input.getInt16(0);
                    for (var i = 0; i < totalBans; i++) {
                        var input_1 = new DataView(data.buffer);
                        clan.addBannedName(input_1.getUint8(0).toString());
                    }
                    ClanChatManager.clans[index] = clan;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (exception) {
            console.log(exception);
        }
    };
    ClanChatManager.writeFile = function (clan) {
        GameLogic_1.GameLogic.submit(function () {
            var e_2, _a, e_3, _b;
            try {
                var file = "".concat(ClanChatManager.FILE_DIRECTORY).concat(clan.getName());
                if (!fs.existsSync(file)) {
                    fs.writeFileSync(file, '');
                }
                var output = fs.createWriteStream(file);
                fs.appendFileSync(file, clan.getName() + '\n');
                fs.appendFileSync(file, clan.getOwnerName() + '\n');
                fs.appendFileSync(file, clan.getIndex().toString() + '\n');
                output.write(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null
                    ? clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId()
                    : -1);
                output.write(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] != null
                    ? clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()
                    : -1);
                output.write(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] != null
                    ? clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK].getSpriteId()
                    : -1);
                fs.appendFileSync(file, clan.getRankedNames().size + '\n');
                try {
                    for (var _c = __values(clan.getRankedNames().entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var iterator = _d.value;
                        var name_3 = iterator[0];
                        var rank = iterator[1].getSpriteId();
                        fs.appendFileSync(file, name_3 + '\n');
                        output.write(rank);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                fs.appendFileSync(file, clan.getBannedNames().length + '\n');
                try {
                    for (var _e = __values(clan.getBannedNames()), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var ban = _f.value;
                        fs.appendFileSync(file, ban.getName() + '\n');
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                output.close();
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    ClanChatManager.save = function () {
        var e_4, _a;
        try {
            for (var _b = __values(ClanChatManager.clans), _c = _b.next(); !_c.done; _c = _b.next()) {
                var clan = _c.value;
                if (clan != null) {
                    ClanChatManager.writeFile(clan);
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
    };
    ClanChatManager.create = function (player, name) {
        var index = ClanChatManager.getIndex();
        if (index == -1) { // Too many clans
            player.getPacketSender().sendMessage("An error occured! Please contact an administrator and report this.");
            return null;
        }
        ClanChatManager.clans[index] = new ClanChat_1.ClanChat();
        ClanChatManager.clans[index].getRankedNames().set(player.getUsername(), ClanChatRank_1.ClanChatRank.OWNER);
        ClanChatManager.clans[index].setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK, ClanChatRank_1.ClanChatRank.OWNER);
        return ClanChatManager.clans[index];
    };
    ClanChatManager.joinChat = function (player, channel) {
        var e_5, _a;
        if (channel == null || channel === "" || channel === "null") {
            return;
        }
        if (player.getCurrentClanChat() != null) {
            player.getPacketSender().sendMessage("You are already in a clan channel.");
            return;
        }
        channel = channel.toLowerCase();
        try {
            for (var _b = __values(ClanChatManager.clans), _c = _b.next(); !_c.done; _c = _b.next()) {
                var clan = _c.value;
                if (clan == null) {
                    continue;
                }
                if (clan.getName().toLowerCase() === channel) {
                    ClanChatManager.join(player, clan);
                    return;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        player.getPacketSender().sendMessage("That channel does not exist.");
    };
    ClanChatManager.join = function (player, clan) {
        if (clan.getOwnerName() === player.getUsername()) {
            if (clan.getOwner() === null) {
                clan.setOwner(player);
            }
            clan.givePlayerRank(player, ClanChatRank_1.ClanChatRank.OWNER);
        }
        player.getPacketSender().sendMessage("Attempting to join channel...");
        if (clan.getMembers().length >= 100) {
            player.getPacketSender().sendMessage("This clan channel is currently full.");
            return;
        }
        if (clan.isBanned(player.getUsername())) {
            player.getPacketSender()
                .sendMessage("You're currently banned from using this channel. Bans expire after 30 minutes.");
            return;
        }
        // updateRank(clan, player);
        var rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
            if (rank === null || rank.getSpriteId() < clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId()) {
                player.getPacketSender().sendMessage("Your rank is not high enough to enter this channel.");
                return;
            }
        }
        player.setCurrentClanChat(clan);
        player.setClanChatName(clan.getName());
        var clanName = Misc_1.Misc.capitalizeWords(clan.getName());
        clan.addMember(player);
        player.getPacketSender().sendString("Talking in: @whi@" + clanName, 37139);
        player.getPacketSender().sendString("Owner: " + Misc_1.Misc.capitalizeWords(clan.getOwnerName()), 37140);
        player.getPacketSender().sendString("Leave Chat", 37135);
        // player.getPacketSender().sendString(29454, "Lootshare:
        // "+getLootshareStatus(clan));
        player.getPacketSender().sendMessage("Now talking in " + clan.getOwnerName() + "'s channel.");
        player.getPacketSender().sendMessage("To talk start each line of chat with the / symbol.");
        ClanChatManager.updateList(clan);
    };
    ClanChatManager.updateList = function (clan) {
        var e_6, _a, e_7, _b;
        clan.getMembers().sort(function (o1, o2) {
            var rank1 = clan.getPlayerRank(o1);
            var rank2 = clan.getPlayerRank(o2);
            if (!rank1 && !rank2) {
                return 1;
            }
            if (!rank1 && rank2) {
                return 1;
            }
            else if (rank1 && !rank2) {
                return -1;
            }
            if (rank1.getSpriteId() === rank2.getSpriteId()) {
                return 1;
            }
            if (rank1 === ClanChatRank_1.ClanChatRank.OWNER) {
                return -1;
            }
            else if (rank2 === ClanChatRank_1.ClanChatRank.OWNER) {
                return 1;
            }
            if (rank1.getSpriteId() > rank2.getSpriteId()) {
                return -1;
            }
            return 1;
        });
        try {
            for (var _c = __values(clan.getMembers()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var member = _d.value;
                if (member) {
                    var childId = 37144;
                    try {
                        for (var _e = (e_7 = void 0, __values(clan.getMembers())), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var others = _f.value;
                            if (others) {
                                var rank_1 = clan.getPlayerRank(others);
                                var image = -1;
                                if (rank_1) {
                                    image = rank_1.getSpriteId();
                                }
                                var prefix = image !== -1 ? "<img=".concat(image, ">") : "";
                                member.getPacketSender().sendString(prefix + others.getUsername(), childId);
                                childId++;
                            }
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    member.getPacketSender().clearInterfaceText(childId, 37243);
                    var rank = clan.getPlayerRank(member);
                    if (rank != null) {
                        if (rank == ClanChatRank_1.ClanChatRank.OWNER || rank == ClanChatRank_1.ClanChatRank.STAFF
                            || clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] == null
                            || rank.getSpriteId() >= clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()) {
                            member.getPacketSender().sendShowClanChatOptions(true);
                        }
                        else {
                            member.getPacketSender().sendShowClanChatOptions(false);
                        }
                    }
                    else {
                        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] == null) {
                            member.getPacketSender().sendShowClanChatOptions(true);
                        }
                        else {
                            member.getPacketSender().sendShowClanChatOptions(false);
                        }
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    ClanChatManager.sendMessage = function (player, message) {
        var e_8, _a;
        if (PlayerPunishment_1.PlayerPunishment.muted(player.getUsername()) || PlayerPunishment_1.PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot chat.");
            return;
        }
        var clan = player.getCurrentClanChat();
        if (!clan) {
            player.getPacketSender().sendMessage("You're not in a clanchat channel.");
            return;
        }
        var rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] != null) {
            if (!rank || rank.getSpriteId() < clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK].getSpriteId()) {
                player.getPacketSender().sendMessage("You do not have the required rank to speak in this channel.");
                return;
            }
        }
        var bracketColor = "<col=16777215>";
        var clanNameColor = "<col=255>";
        var nameColor = "@bla@";
        var chatColor = "<col=993D00>";
        var clanPrefix = "" + bracketColor + "[" + clanNameColor + clan.getName() + bracketColor + "]";
        var rightsPrefix = "";
        if (player.getRights() != PlayerRights_1.PlayerRights.NONE) {
            rightsPrefix = "<img=" + player.getRights().getSpriteId() + ">";
        }
        else if (player.getDonatorRights() != DonatorRights_1.DonatorRights.NONE) {
            rightsPrefix = "<img=" + DonatorRights_1.DonatorRights.getSpriteId(rightsPrefix) + ">";
        }
        try {
            for (var _b = __values(clan.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var memberPlayer = _c.value;
                if (memberPlayer != null) {
                    if (memberPlayer.getRelations().getIgnoreList().push(player.getLongUsername()))
                        continue;
                    memberPlayer.getPacketSender().sendSpecialMessage(player.getUsername(), 16, (clanPrefix + nameColor
                        + rightsPrefix + " " + Misc_1.Misc.capitalizeWords(player.getUsername()) + ": " + chatColor + Misc_1.Misc.capitalize(message)));
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    ClanChatManager.sendChatMessage = function (clan, message) {
        var e_9, _a;
        try {
            for (var _b = __values(clan.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (member != null) {
                    member.getPacketSender().sendMessage(message);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    ClanChatManager.leave = function (player, kicked) {
        var clan = player.getCurrentClanChat();
        if (!clan) {
            return;
        }
        ClanChatManager.resetInterface(player);
        player.setCurrentClanChat(null);
        clan.removeMember(player.getUsername());
        player.getPacketSender().sendShowClanChatOptions(false);
        ClanChatManager.updateList(clan);
        if (kicked) {
            player.setClanChatName("");
        }
        player.getPacketSender().sendMessage(kicked ? "You have been kicked from the channel." : "You have left the channel.");
    };
    ClanChatManager.delete = function (player) {
        var e_10, _a;
        var clan = this.getClanChat(player);
        if (this.getClanChat(player) == null) {
            player.getPacketSender().sendMessage("Your clanchat channel is already disabled.");
            return;
        }
        var file = "".concat(ClanChatManager.FILE_DIRECTORY).concat(clan.getName());
        try {
            for (var _b = __values(clan.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (member != null) {
                    this.leave(member, false);
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        if (player.getClanChatName() != null && player.getClanChatName().toLowerCase() == clan.getName().toLowerCase()) {
            player.setClanChatName("");
        }
        ClanChatManager.clans[clan.getIndex()] = null;
        fs.unlinkSync(ClanChatManager.FILE_DIRECTORY + clan.getName());
        if (player.getInterfaceId() == ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            this.clanChatSetupInterface(player);
        }
    };
    ClanChatManager.updateRank = function (clan, player2) {
        if (clan == null || player2 == null) {
            return;
        }
        var rank = clan.getPlayerRank(player2);
        var owner = clan.getOwner();
        if (owner != null) {
            if (owner.getRelations().isFriendWith(player2.getUsername())) {
                if (rank == null) {
                    clan.givePlayerRank(player2, ClanChatRank_1.ClanChatRank.FRIEND);
                    this.updateList(clan);
                }
            }
            else {
                if (rank == ClanChatRank_1.ClanChatRank.FRIEND) {
                    clan.givePlayerRank(player2, null);
                    this.updateList(clan);
                }
            }
        }
        if (player2.isStaff()) {
            if (rank == null) {
                clan.givePlayerRank(player2, ClanChatRank_1.ClanChatRank.STAFF);
                ClanChatManager.updateList(clan);
            }
        }
        else {
            if (rank == ClanChatRank_1.ClanChatRank.STAFF) {
                clan.givePlayerRank(player2, null);
                ClanChatManager.updateList(clan);
            }
        }
    };
    ClanChatManager.setName = function (player, newName) {
        var e_11, _a, e_12, _b;
        if (GameConstants_1.GameConstants.PLAYER_PERSISTENCE.exists(newName)) {
            player.getPacketSender().sendMessage("That clanchat name is already taken.");
            return;
        }
        newName = newName.toLowerCase();
        try {
            for (var _c = __values(ClanChatManager.clans), _d = _c.next(); !_d.done; _d = _c.next()) {
                var c = _d.value;
                if (c == null) {
                    continue;
                }
                if (c.getName().toLowerCase() === newName) {
                    player.getPacketSender().sendMessage("That clanchat name is already taken.");
                    return;
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_11) throw e_11.error; }
        }
        var clan = ClanChatManager.getClanChat(player);
        if (clan == null) {
            clan = ClanChatManager.create(player, newName);
        }
        if (clan == null) {
            return;
        }
        if (clan.getName().toLowerCase() === newName) {
            return;
        }
        fs.unlinkSync(ClanChatManager.FILE_DIRECTORY + clan.getName());
        clan.setName(Misc_1.Misc.capitalizeWords(newName));
        try {
            for (var _e = __values(clan.getMembers()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var member = _f.value;
                if (member == null) {
                    continue;
                }
                member.setClanChatName(clan.getName());
                member.getPacketSender().sendString("Talking in: @whi@" + clan.getName(), 37139);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_12) throw e_12.error; }
        }
        ClanChatManager.writeFile(clan);
        if (player.getCurrentClanChat() == null) {
            ClanChatManager.join(player, clan);
        }
        if (player.getInterfaceId() == ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            ClanChatManager.clanChatSetupInterface(player);
        }
    };
    ClanChatManager.kick = function (player, target) {
        var e_13, _a;
        var clan = player.getCurrentClanChat();
        if (!clan) {
            player.getPacketSender().sendMessage("You're not in a clan channel.");
            return;
        }
        var rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] != null) {
            if (!rank || rank.getSpriteId() < clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()) {
                player.getPacketSender().sendMessage("You do not have the required rank to kick this player.");
                return;
            }
        }
        try {
            for (var _b = __values(clan.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (member && member === target) {
                    var memberRank = clan.getPlayerRank(member);
                    if (memberRank != null) {
                        if (memberRank === ClanChatRank_1.ClanChatRank.STAFF) {
                            player.getPacketSender().sendMessage("That player cannot be kicked.");
                            break;
                        }
                        if (!rank || rank.getSpriteId() < memberRank.getSpriteId()) {
                            player.getPacketSender().sendMessage("You cannot kick a player who has a higher rank than you!");
                            break;
                        }
                    }
                    clan.addBannedName(member.getUsername());
                    ClanChatManager.leave(member, true);
                    ClanChatManager.sendChatMessage(player.getCurrentClanChat(), "<col=16777215>[<col=255>".concat(clan.getName(), "<col=16777215>]<col=3300CC> ").concat(member.getUsername(), " has been kicked from the channel by ").concat(player.getUsername(), "."));
                    break;
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
    };
    ClanChatManager.clanChatSetupInterface = function (player) {
        var e_14, _a;
        player.getPacketSender().clearInterfaceText(38752, 39551);
        var clan = ClanChatManager.getClanChat(player);
        if (clan == null) {
            player.getPacketSender().sendString("Clan disabled", 38332);
            player.getPacketSender().sendString("Anyone", 38334);
            player.getPacketSender().sendString("Anyone", 38336);
            player.getPacketSender().sendString("Only me", 38338);
        }
        else {
            player.getPacketSender().sendString(clan.getName(), 38332);
            var rank = void 0;
            if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] == null) {
                player.getPacketSender().sendString("Anyone", 38334);
            }
            else {
                rank = clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] == ClanChatRank_1.ClanChatRank.OWNER
                    ? "Only me"
                    : Misc_1.Misc.ucFirst(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER].toString().toLowerCase()) + "+";
                player.getPacketSender().sendString(rank, 38334);
            }
            if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] == null) {
                player.getPacketSender().sendString("Anyone", 38336);
            }
            else {
                rank = clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] == ClanChatRank_1.ClanChatRank.OWNER
                    ? "Only me"
                    : Misc_1.Misc.ucFirst(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK].toString().toLowerCase())
                        + "+";
                player.getPacketSender().sendString(rank, 38336);
            }
            if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] == null) {
                player.getPacketSender().sendString("Anyone", 38338);
            }
            else {
                var rank_2 = clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] == ClanChatRank_1.ClanChatRank.OWNER
                    ? "Only me"
                    : Misc_1.Misc.ucFirst(clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK].toString().toLowerCase())
                        + "+";
                player.getPacketSender().sendString(rank_2, 38338);
            }
            var nameInterfaceId = 38752;
            var rankInterfaceId = 38952;
            try {
                for (var _b = __values(player.getRelations().getFriendList()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var friend = _c.value;
                    var playerName = Misc_1.Misc.longToString(friend);
                    if (playerName == null || playerName === "")
                        continue;
                    playerName = Misc_1.Misc.formatPlayerName(playerName);
                    var rank_3 = (clan == null ? null : clan.getRank(playerName));
                    player.getPacketSender().sendString(playerName, nameInterfaceId++);
                    player.getPacketSender().sendString((rank_3 == null ? "Friend" : Misc_1.Misc.ucFirst(rank_3.toString().toLowerCase())), rankInterfaceId++);
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_14) throw e_14.error; }
            }
            player.getPacketSender().sendInterface(ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID);
        }
    };
    ClanChatManager.onLogin = function (player) {
        ClanChatManager.resetInterface(player);
        if (player.clanChatName != null && player.clanChatName !== "") {
            ClanChatManager.joinChat(player, player.getClanChatName());
        }
    };
    ClanChatManager.resetInterface = function (player) {
        player.getPacketSender().sendString("Talking in: N/A", 37139);
        player.getPacketSender().sendString("Owner: N/A", 37140);
        player.getPacketSender().sendString("Join Chat", 37135);
        // player.getPacketSender().sendString(29454, "Lootshare: N/A");
        player.getPacketSender().clearInterfaceText(37144, 37243);
    };
    ClanChatManager.getIndex = function () {
        for (var i = 0; i < ClanChatManager.clans.length; i++) {
            if (ClanChatManager.clans[i] == null) {
                return i;
            }
        }
        return -1;
    };
    ClanChatManager.getClans = function () {
        return ClanChatManager.clans;
    };
    ClanChatManager.prototype.static = function (index) {
        return ClanChatManager.clans[index];
    };
    ClanChatManager.getClanChat = function (player) {
        var e_15, _a;
        try {
            for (var _b = __values(ClanChatManager.clans), _c = _b.next(); !_c.done; _c = _b.next()) {
                var clan = _c.value;
                if (!clan || !clan.getOwnerName())
                    continue;
                if (clan.getOwnerName() === player.getUsername()) {
                    return clan;
                }
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_15) throw e_15.error; }
        }
        return null;
    };
    ClanChatManager.getPlayer = function (index, clan) {
        var e_16, _a;
        var clanIndex = 0;
        try {
            for (var _b = __values(clan.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var members = _c.value;
                if (members) {
                    if (clanIndex === index) {
                        return members;
                    }
                    clanIndex++;
                }
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return null;
    };
    ClanChatManager.handleButton = function (player, button, menuId) {
        var e_17, _a;
        if (player.interfaceId === ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            var clan_1 = ClanChatManager.getClanChat(player);
            switch (button) {
                case 38319:
                    if (menuId === 0) {
                        player.setEnteredSyntaxAction(new ClanChatEntered(function (input) {
                            if (input.length > 12) {
                                input = input.substring(0, 11);
                            }
                            if (!Misc_1.Misc.isValidName(input)) {
                                player.getPacketSender().sendMessage("Invalid syntax entered. Please set a valid name.");
                                return;
                            }
                            ClanChatManager.setName(player, input);
                        }));
                        player.getPacketSender().sendEnterInputPrompt("What should your clanchat channel's name be?");
                    }
                    else if (menuId === 1) {
                        ClanChatManager.delete(player);
                    }
                    return true;
                case 38322:
                case 38325:
                case 38328:
                    if (clan_1 === null) {
                        player.getPacketSender().sendMessage("Please enable your clanchat before changing this.");
                        return true;
                    }
                    var rank = null;
                    if (menuId === 0) {
                        rank = ClanChatRank_1.ClanChatRank.OWNER;
                    }
                    else if (menuId === 1) {
                        rank = ClanChatRank_1.ClanChatRank.GENERAL;
                    }
                    else if (menuId === 2) {
                        rank = ClanChatRank_1.ClanChatRank.CAPTAIN;
                    }
                    else if (menuId === 3) {
                        rank = ClanChatRank_1.ClanChatRank.LIEUTENANT;
                    }
                    else if (menuId === 4) {
                        rank = ClanChatRank_1.ClanChatRank.SERGEANT;
                    }
                    else if (menuId === 5) {
                        rank = ClanChatRank_1.ClanChatRank.CORPORAL;
                    }
                    else if (menuId === 6) {
                        rank = ClanChatRank_1.ClanChatRank.RECRUIT;
                    }
                    else if (menuId === 7) {
                        rank = ClanChatRank_1.ClanChatRank.FRIEND;
                    }
                    if (button === 38322) {
                        if (clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null
                            && clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] === rank) {
                            return true;
                        }
                        clan_1.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        if (clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            try {
                                for (var _b = __values(clan_1.getMembers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    var member = _c.value;
                                    if (member === null)
                                        continue;
                                    var memberRank = clan_1.getPlayerRank(member);
                                    if (memberRank === null || clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER]
                                        .getSpriteId() > memberRank.getSpriteId()) {
                                        member.getPacketSender()
                                            .sendMessage("Your rank is not high enough to be in this channel.");
                                        ClanChatManager.leave(member, false);
                                        player.getPacketSender()
                                            .sendMessage("@red@Warning! Changing that setting kicked the player "
                                            + member.getUsername() + " from the chat because")
                                            .sendMessage("@red@they do not have the required rank to be in the chat.");
                                        ;
                                    }
                                }
                            }
                            catch (e_17_1) { e_17 = { error: e_17_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_17) throw e_17.error; }
                            }
                        }
                        ClanChatManager.clanChatSetupInterface(player);
                    }
                    else if (button == 38325) {
                        if (clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] != null
                            && clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK] == rank) {
                            return true;
                        }
                        clan_1.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_TALK, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        ClanChatManager.clanChatSetupInterface(player);
                    }
                    else if (button == 38328) {
                        if (clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] != null
                            && clan_1.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK] == rank) {
                            return true;
                        }
                        clan_1.setRankRequirements(ClanChat_1.ClanChat.RANK_REQUIRED_TO_KICK, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        ClanChatManager.clanChatSetupInterface(player);
                        ClanChatManager.updateList(clan_1);
                    }
                    return true;
            }
        }
        var target = null;
        var clan = null;
        if (button >= 37144 && button <= 37243) {
            if ((player.currentClanChat === null || player.currentClanChat.ownerName !== player.username) && menuId !== 7) {
                player.getPacketSender().sendMessage("Only the clanchat owner can do that.");
                return true;
            }
            var index = (button - 37144);
            target = ClanChatManager.getPlayer(index, player.currentClanChat).username;
            clan = player.currentClanChat;
        }
        else if (button >= 38752 && button <= 38951) {
            var index = button - 38752;
            if (index < player.getRelations().getFriendList().length) {
                target = Misc_1.Misc.formatPlayerName(Misc_1.Misc.longToString(player.getRelations().getFriendList().indexOf(index)));
                clan = ClanChatManager.getClanChat(player);
                if (clan === null) {
                    player.getPacketSender().sendMessage("Please enable your clanchat before changing ranks.");
                    return true;
                }
            }
        }
        if (clan != null && target != null && target !== player.username) {
            switch (menuId) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    var rank = ClanChatRank_1.ClanChatRank.forMenuId(menuId);
                    var targetRank = clan.getRank(target);
                    if (targetRank != null) {
                        if (targetRank === rank) {
                            player.getPacketSender().sendMessage("That player already has that rank.");
                            return true;
                        }
                        if (targetRank === ClanChatRank_1.ClanChatRank.STAFF) {
                            player.getPacketSender().sendMessage("That player cannot be promoted or demoted.");
                            return true;
                        }
                    }
                    clan.giveRank(target, rank);
                    var p2 = World_1.World.getPlayerByName(target);
                    if (p2) {
                        ClanChatManager.updateRank(clan, p2);
                        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            if (rank === null || clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId() > rank
                                .getSpriteId()) {
                                p2.getPacketSender()
                                    .sendMessage("Your rank is not high enough to be in this channel.");
                                ClanChatManager.leave(p2, false);
                                player.getPacketSender()
                                    .sendMessage("@red@Warning! Changing that setting kicked the player "
                                    + p2.username + " from the chat because")
                                    .sendMessage("@red@they do not have the required rank to be in the chat.");
                                ;
                            }
                        }
                    }
                    ClanChatManager.updateList(clan);
                    if (player.interfaceId === ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                        ClanChatManager.clanChatSetupInterface(player);
                    }
                    break;
                case 6:
                    targetRank = player.getCurrentClanChat().getRank(target);
                    if (targetRank == null) {
                        player.getPacketSender().sendMessage("That player has no rank.");
                        return true;
                    }
                    if (targetRank == ClanChatRank_1.ClanChatRank.STAFF) {
                        player.getPacketSender().sendMessage("That player cannot be promoted or demoted.");
                        return true;
                    }
                    clan.getRankedNames().delete(target);
                    p2 = World_1.World.getPlayerByName(target);
                    if (p2) {
                        ClanChatManager.updateRank(clan, p2);
                        if (clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            rank = clan.getPlayerRank(p2);
                            if (rank == null || clan.getRankRequirement()[ClanChat_1.ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId() > rank
                                .getSpriteId()) {
                                p2.getPacketSender()
                                    .sendMessage("Your rank is not high enough to be in this channel.");
                                ClanChatManager.leave(p2, false);
                                player.getPacketSender()
                                    .sendMessage("@red@Warning! Changing that setting kicked the player "
                                    + p2.getUsername() + " from the chat because")
                                    .sendMessage("@red@they do not have the required rank to be in the chat.");
                                ;
                            }
                        }
                    }
                    ClanChatManager.updateList(clan);
                    if (player.getInterfaceId() == ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                        ClanChatManager.clanChatSetupInterface(player);
                    }
                    break;
                case 7:
                    var kick = World_1.World.getPlayerByName(target);
                    if (kick) {
                        this.kick(player, kick);
                    }
                    break;
            }
            return true;
        }
        switch (button) {
            case 37132: // CC Setup
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                ClanChatManager.clanChatSetupInterface(player);
                return true;
            case 37129: // Join / Leave clan
                if (player.getCurrentClanChat() == null) {
                    player.setEnteredSyntaxAction(new ClanChatEntered(function (input) {
                        ClanChatManager.join(player, input);
                    }));
                    player.getPacketSender().sendEnterInputPrompt("Which clanchat channel would you like to join?");
                }
                else {
                    ClanChatManager.leave(player, false);
                    player.setClanChatName("");
                }
                return true;
        }
        return false;
    };
    ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID = 38300;
    ClanChatManager.FILE_DIRECTORY = "./data/saves/clans/";
    ClanChatManager.clans = new Array(3000);
    return ClanChatManager;
}());
//# sourceMappingURL=ClanChatManager.js.map