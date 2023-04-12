import * as fs from 'fs-extra';
import * as path from 'path';
import { GameLogic } from "../../GameLogic";
import { World } from "../../World";
import { DonatorRights } from "../../model/rights/DonatorRights";
import { Player } from '../../entity/impl/player/Player';
import { PlayerRights } from "../../model/rights/PlayerRights"
import { Misc } from "../../../util/Misc";
import { PlayerPunishment } from "../../../util/PlayerPunishment";
import { ClanChat } from "./ClanChat";
import { ClanChatRank } from './ClanChatRank';
import { GameConstants } from '../../GameConstants';
import { EnteredSyntaxAction } from '../../model/EnteredSyntaxAction';

class ClanChatEntered implements EnteredSyntaxAction {
    constructor(private readonly execFunc: Function) {

    }
    execute(syntax: string): void {
        this.execFunc();
    }

}


export class ClanChatManager {

    public static CLAN_CHAT_SETUP_INTERFACE_ID = 38300;
    private static FILE_DIRECTORY = "./data/saves/clans/";
    private static clans: ClanChat[] = new Array(3000);

    public static init() {
        try {
            let dir = path.join(ClanChatManager.FILE_DIRECTORY);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            const files = fs.readdirSync(dir);
            for (let file of files) {
                if (!fs.existsSync(dir))
                    continue;
                let data = fs.readFileSync(file);
                let input = new DataView(data.buffer);
                let name = input.getUint8(0);
                let owner = input.getUint8(1);
                let index = input.getUint16(2);
                let clan = new ClanChat();
                const rankId = input.getUint16(2);
                const rankNumber = parseInt(rankId.toString());
                clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_ENTER, ClanChatRank.forId(rankNumber));
                clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_KICK, ClanChatRank.forId(rankNumber));
                clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_TALK, ClanChatRank.forId(rankNumber));
                let offset = 2;
                let totalRanks = input.getInt16(0);
                for (let i = 0; i < totalRanks; i++) {
                    let nameLength = input.getUint8(offset);
                    offset++;
                    let name = new TextDecoder("utf-8").decode(new Uint8Array(data.buffer, offset, nameLength));
                    offset += nameLength;
                    let rankId = input.getUint16(offset);
                    offset += 2;
                    clan.getRankedNames().set(name, ClanChatRank.forMenuId(rankId));
                }
                let totalBans = input.getInt16(0);
                for (let i = 0; i < totalBans; i++) {
                    let input = new DataView(data.buffer);
                    clan.addBannedName(input.getUint8(0).toString());
                }
                ClanChatManager.clans[index] = clan;
            }
        } catch (exception) {
            console.log(exception);
        }
    }

    public static writeFile(clan: ClanChat): void {
        GameLogic.submit(() => {
            try {
                let file = `${ClanChatManager.FILE_DIRECTORY}${clan.getName()}`;
                if (!fs.existsSync(file)) {
                    fs.writeFileSync(file, '');
                }
                let output = fs.createWriteStream(file);
                fs.appendFileSync(file, clan.getName() + '\n');
                fs.appendFileSync(file, clan.getOwnerName() + '\n');
                fs.appendFileSync(file, clan.getIndex().toString() + '\n');
                output.write(clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null
                    ? clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId()
                    : -1);
                output.write(clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] != null
                    ? clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()
                    : -1);
                output.write(clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] != null
                    ? clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK].getSpriteId()
                    : -1);
                fs.appendFileSync(file, clan.getRankedNames().size + '\n');
                for (let iterator of clan.getRankedNames().entries()) {
                    let name = iterator[0];
                    let rank = iterator[1].getSpriteId();
                    fs.appendFileSync(file, name + '\n');
                    output.write(rank);
                }
                fs.appendFileSync(file, clan.getBannedNames().length + '\n');
                for (let ban of clan.getBannedNames()) {
                    fs.appendFileSync(file, ban.getName() + '\n');
                }
                output.close();
            } catch (e) {
                console.log(e);
            }
        });
    }

    public static save(): void {
        for (let clan of ClanChatManager.clans) {
            if (clan != null) {
                ClanChatManager.writeFile(clan);
            }
        }
    }

    public static create(player: Player, name: string): ClanChat | null {
        let index = ClanChatManager.getIndex();
        if (index == -1) { // Too many clans
            player.getPacketSender().sendMessage("An error occured! Please contact an administrator and report this.");
            return null;
        }
        ClanChatManager.clans[index] = new ClanChat();
        ClanChatManager.clans[index].getRankedNames().set(player.getUsername(), ClanChatRank.OWNER);
        ClanChatManager.clans[index].setRankRequirements(ClanChat.RANK_REQUIRED_TO_KICK, ClanChatRank.OWNER);
        return ClanChatManager.clans[index];
    }

    public static joinChat(player: Player, channel: string): void {
        if (channel == null || channel === "" || channel === "null") {
            return;
        }
        if (player.getCurrentClanChat() != null) {
            player.getPacketSender().sendMessage("You are already in a clan channel.");
            return;
        }
        channel = channel.toLowerCase();
        for (let clan of ClanChatManager.clans) {
            if (clan == null) {
                continue;
            }
            if (clan.getName().toLowerCase() === channel) {
                ClanChatManager.join(player, clan);
                return;
            }
        }

        player.getPacketSender().sendMessage("That channel does not exist.");
    }

    private static join(player: Player, clan: ClanChat) {
        if (clan.getOwnerName() === player.getUsername()) {
            if (clan.getOwner() === null) {
                clan.setOwner(player);
            }
            clan.givePlayerRank(player, ClanChatRank.OWNER);
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

        let rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
            if (rank === null || rank.getSpriteId() < clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId()) {
                player.getPacketSender().sendMessage("Your rank is not high enough to enter this channel.");
                return;
            }
        }

        player.setCurrentClanChat(clan);
        player.setClanChatName(clan.getName());
        let clanName = Misc.capitalizeWords(clan.getName());
        clan.addMember(player);
        player.getPacketSender().sendString("Talking in: @whi@" + clanName, 37139);
        player.getPacketSender().sendString("Owner: " + Misc.capitalizeWords(clan.getOwnerName()), 37140);
        player.getPacketSender().sendString("Leave Chat", 37135);

        // player.getPacketSender().sendString(29454, "Lootshare:
        // "+getLootshareStatus(clan));
        player.getPacketSender().sendMessage("Now talking in " + clan.getOwnerName() + "'s channel.");
        player.getPacketSender().sendMessage("To talk start each line of chat with the / symbol.");
        ClanChatManager.updateList(clan);
    }

    public static updateList(clan: ClanChat) {
        clan.getMembers().sort((o1, o2) => {
            const rank1 = clan.getPlayerRank(o1);
            const rank2 = clan.getPlayerRank(o2);
            if (!rank1 && !rank2) {
                return 1;
            }
            if (!rank1 && rank2) {
                return 1;
            } else if (rank1 && !rank2) {
                return -1;
            }
            if (rank1.getSpriteId() === rank2.getSpriteId()) {
                return 1;
            }
            if (rank1 === ClanChatRank.OWNER) {
                return -1;
            } else if (rank2 === ClanChatRank.OWNER) {
                return 1;
            }
            if (rank1.getSpriteId() > rank2.getSpriteId()) {
                return -1;
            }
            return 1;
        });
        for (const member of clan.getMembers()) {
            if (member) {
                let childId = 37144;
                for (const others of clan.getMembers()) {
                    if (others) {
                        const rank = clan.getPlayerRank(others);
                        let image = -1;
                        if (rank) {
                            image = rank.getSpriteId();
                        }
                        let prefix = image !== -1 ? `<img=${image}>` : "";
                        member.getPacketSender().sendString(prefix + others.getUsername(), childId);
                        childId++;
                    }
                }
                member.getPacketSender().clearInterfaceText(childId, 37243);
                const rank: ClanChatRank = clan.getPlayerRank(member);

                if (rank != null) {
                    if (rank == ClanChatRank.OWNER || rank == ClanChatRank.STAFF
                        || clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] == null
                        || rank.getSpriteId() >= clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()) {
                        member.getPacketSender().sendShowClanChatOptions(true);
                    } else {
                        member.getPacketSender().sendShowClanChatOptions(false);
                    }
                } else {
                    if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] == null) {
                        member.getPacketSender().sendShowClanChatOptions(true);
                    } else {
                        member.getPacketSender().sendShowClanChatOptions(false);
                    }
                }

            }
        }
    }

    public static sendMessage(player: Player, message: string) {
        if (PlayerPunishment.muted(player.getUsername()) || PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot chat.");
            return;
        }
        let clan = player.getCurrentClanChat();
        if (!clan) {
            player.getPacketSender().sendMessage("You're not in a clanchat channel.");
            return;
        }
        let rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] != null) {
            if (!rank || rank.getSpriteId() < clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK].getSpriteId()) {
                player.getPacketSender().sendMessage("You do not have the required rank to speak in this channel.");
                return;
            }
        }
        let bracketColor = "<col=16777215>";
        let clanNameColor = "<col=255>";
        let nameColor: string = "@bla@";
        let chatColor = "<col=993D00>";

        let clanPrefix = "" + bracketColor + "[" + clanNameColor + clan.getName() + bracketColor + "]";

        let rightsPrefix = "";
        if (player.getRights() != PlayerRights.NONE) {
            rightsPrefix = "<img=" + player.getRights().getSpriteId() + ">";
        } else if (player.getDonatorRights() != DonatorRights.NONE) {
            rightsPrefix = "<img=" + DonatorRights.getSpriteId(rightsPrefix) + ">";
        }

        for (const memberPlayer of clan.getMembers()) {
            if (memberPlayer != null) {
                if (memberPlayer.getRelations().getIgnoreList().push(player.getLongUsername()))
                    continue;

                memberPlayer.getPacketSender().sendSpecialMessage(player.getUsername(), 16, (clanPrefix + nameColor
                    + rightsPrefix + " " + Misc.capitalizeWords(player.getUsername()) + ": " + chatColor + Misc.capitalize(message)));
            }
        }
    }

    public static sendChatMessage(clan: ClanChat, message: string) {
        for (let member of clan.getMembers()) {
            if (member != null) {
                member.getPacketSender().sendMessage(message);
            }
        }
    }

    public static leave(player: Player, kicked: boolean) {
        const clan = player.getCurrentClanChat();
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
    }

    public static delete(player: Player) {
        let clan = this.getClanChat(player);
        if (this.getClanChat(player) == null) {
            player.getPacketSender().sendMessage("Your clanchat channel is already disabled.");
            return;
        }
        let file = `${ClanChatManager.FILE_DIRECTORY}${clan.getName()}`;
        for (let member of clan.getMembers()) {
            if (member != null) {
                this.leave(member, false);
            }
        }
        if (player.getClanChatName() != null && player.getClanChatName().toLowerCase() == clan.getName().toLowerCase()) {
            player.setClanChatName("");
        }
        ClanChatManager.clans[clan.getIndex()] = null;
        fs.unlinkSync(ClanChatManager.FILE_DIRECTORY + clan.getName());
        if (player.getInterfaceId() == ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            this.clanChatSetupInterface(player);
        }
    }

    public static updateRank(clan: ClanChat, player2: Player) {
        if (clan == null || player2 == null) {
            return;
        }
        let rank = clan.getPlayerRank(player2);
        let owner = clan.getOwner();
        if (owner != null) {
            if (owner.getRelations().isFriendWith(player2.getUsername())) {
                if (rank == null) {
                    clan.givePlayerRank(player2, ClanChatRank.FRIEND);
                    this.updateList(clan);
                }
            } else {
                if (rank == ClanChatRank.FRIEND) {
                    clan.givePlayerRank(player2, null);
                    this.updateList(clan);
                }
            }
        }
        if (player2.isStaff()) {
            if (rank == null) {
                clan.givePlayerRank(player2, ClanChatRank.STAFF);
                ClanChatManager.updateList(clan);
            }
        } else {
            if (rank == ClanChatRank.STAFF) {
                clan.givePlayerRank(player2, null);
                ClanChatManager.updateList(clan);
            }
        }
    }

    public static setName(player: Player, newName: string) {
        if (GameConstants.PLAYER_PERSISTENCE.exists(newName)) {
            player.getPacketSender().sendMessage("That clanchat name is already taken.");
            return;
        }

        newName = newName.toLowerCase();

        for (const c of ClanChatManager.clans) {
            if (c == null) {
                continue;
            }
            if (c.getName().toLowerCase() === newName) {
                player.getPacketSender().sendMessage("That clanchat name is already taken.");
                return;
            }
        }

        let clan = ClanChatManager.getClanChat(player);
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
        clan.setName(Misc.capitalizeWords(newName));
        for (const member of clan.getMembers()) {
            if (member == null) {
                continue;
            }
            member.setClanChatName(clan.getName());
            member.getPacketSender().sendString("Talking in: @whi@" + clan.getName(), 37139);
        }
        ClanChatManager.writeFile(clan);
        if (player.getCurrentClanChat() == null) {
            ClanChatManager.join(player, clan);
        }
        if (player.getInterfaceId() == ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            ClanChatManager.clanChatSetupInterface(player);
        }
    }

    public static kick(player: Player, target: Player) {
        let clan = player.getCurrentClanChat();
        if (!clan) {
            player.getPacketSender().sendMessage("You're not in a clan channel.");
            return;
        }
        const rank = clan.getPlayerRank(player);
        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] != null) {
            if (!rank || rank.getSpriteId() < clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK].getSpriteId()) {
                player.getPacketSender().sendMessage("You do not have the required rank to kick this player.");
                return;
            }
        }
        for (let member of clan.getMembers()) {
            if (member && member === target) {
                const memberRank = clan.getPlayerRank(member);
                if (memberRank != null) {
                    if (memberRank === ClanChatRank.STAFF) {
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
                ClanChatManager.sendChatMessage(player.getCurrentClanChat(),
                    `<col=16777215>[<col=255>${clan.getName()}<col=16777215>]<col=3300CC> ${member.getUsername()} has been kicked from the channel by ${player.getUsername()}.`);
                break;
            }
        }
    }

    public static clanChatSetupInterface(player: Player) {
        player.getPacketSender().clearInterfaceText(38752, 39551);

        let clan = ClanChatManager.getClanChat(player);

        if (clan == null) {
            player.getPacketSender().sendString("Clan disabled", 38332);
            player.getPacketSender().sendString("Anyone", 38334);
            player.getPacketSender().sendString("Anyone", 38336);
            player.getPacketSender().sendString("Only me", 38338);
        } else {
            player.getPacketSender().sendString(clan.getName(), 38332);

            let rank: string;
            if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] == null) {
                player.getPacketSender().sendString("Anyone", 38334);
            } else {
                rank = clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] == ClanChatRank.OWNER
                    ? "Only me"
                    : Misc.ucFirst(clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER].toString().toLowerCase()) + "+";
                player.getPacketSender().sendString(rank, 38334);
            }

            if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] == null) {
                player.getPacketSender().sendString("Anyone", 38336);
            } else {
                rank = clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] == ClanChatRank.OWNER
                    ? "Only me"
                    : Misc.ucFirst(
                        clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK].toString().toLowerCase())
                    + "+";
                player.getPacketSender().sendString(rank, 38336);
            }

            if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] == null) {
                player.getPacketSender().sendString("Anyone", 38338);
            } else {
                const rank = clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] == ClanChatRank.OWNER
                    ? "Only me"
                    : Misc.ucFirst(
                        clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK].toString().toLowerCase())
                    + "+";
                player.getPacketSender().sendString(rank, 38338);
            }

            let nameInterfaceId = 38752;
            let rankInterfaceId = 38952;
            for (const friend of player.getRelations().getFriendList()) {
                let playerName = Misc.longToString(friend);
                if (playerName == null || playerName === "")
                    continue;
                playerName = Misc.formatPlayerName(playerName);
                const rank = (clan == null ? null : clan.getRank(playerName));
                player.getPacketSender().sendString(playerName, nameInterfaceId++);
                player.getPacketSender().sendString(
                    (rank == null ? "Friend" : Misc.ucFirst(rank.toString().toLowerCase())), rankInterfaceId++);
            }

            player.getPacketSender().sendInterface(ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID);
        }
    }

    public static onLogin(player: Player) {
        ClanChatManager.resetInterface(player);
        if (player.clanChatName != null && player.clanChatName !== "") {
            ClanChatManager.joinChat(player, player.getClanChatName());
        }
    }

    public static resetInterface(player: Player) {
        player.getPacketSender().sendString("Talking in: N/A", 37139);
        player.getPacketSender().sendString("Owner: N/A", 37140);
        player.getPacketSender().sendString("Join Chat", 37135);
        // player.getPacketSender().sendString(29454, "Lootshare: N/A");
        player.getPacketSender().clearInterfaceText(37144, 37243);
    }

    private static getIndex() {
        for (let i = 0; i < ClanChatManager.clans.length; i++) {
            if (ClanChatManager.clans[i] == null) {
                return i;
            }
        }
        return -1;
    }

    public static getClans() {
        return ClanChatManager.clans;
    }

    public static(index: number) {
        return ClanChatManager.clans[index];
    }

    public static getClanChat(player: Player): ClanChat | null {
        for (const clan of ClanChatManager.clans) {
            if (!clan || !clan.getOwnerName()) continue;
            if (clan.getOwnerName() === player.getUsername()) {
                return clan;
            }
        }
        return null;
    }

    public static getPlayer(index: number, clan: ClanChat): Player | null {
        let clanIndex = 0;
        for (const members of clan.getMembers()) {
            if (members) {
                if (clanIndex === index) {
                    return members;
                }
                clanIndex++;
            }
        }
        return null;
    }

    public static handleButton(player: Player, button: number, menuId: number): boolean {
        if (player.interfaceId === ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
            const clan = ClanChatManager.getClanChat(player);
            switch (button) {
                case 38319:
                    if (menuId === 0) {
                        player.setEnteredSyntaxAction(new ClanChatEntered((input) => {
                            if (input.length > 12) {
                                input = input.substring(0, 11);
                            }
                            if (!Misc.isValidName(input)) {
                                player.getPacketSender().sendMessage("Invalid syntax entered. Please set a valid name.");
                                return;
                            }
                            ClanChatManager.setName(player, input);
                        }));
                        player.getPacketSender().sendEnterInputPrompt("What should your clanchat channel's name be?");
                    } else if (menuId === 1) {
                        ClanChatManager.delete(player);
                    }
                    return true;
                case 38322:
                case 38325:
                case 38328:
                    if (clan === null) {
                        player.getPacketSender().sendMessage("Please enable your clanchat before changing this.");
                        return true;
                    }
                    let rank = null;
                    if (menuId === 0) {
                        rank = ClanChatRank.OWNER;
                    } else if (menuId === 1) {
                        rank = ClanChatRank.GENERAL;
                    } else if (menuId === 2) {
                        rank = ClanChatRank.CAPTAIN;
                    } else if (menuId === 3) {
                        rank = ClanChatRank.LIEUTENANT;
                    } else if (menuId === 4) {
                        rank = ClanChatRank.SERGEANT;
                    } else if (menuId === 5) {
                        rank = ClanChatRank.CORPORAL;
                    } else if (menuId === 6) {
                        rank = ClanChatRank.RECRUIT;
                    } else if (menuId === 7) {
                        rank = ClanChatRank.FRIEND;
                    }

                    if (button === 38322) {
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null
                            && clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] === rank) {
                            return true;
                        }
                        clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_ENTER, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            for (let member of clan.getMembers()) {
                                if (member === null)
                                    continue;
                                const memberRank = clan.getPlayerRank(member);
                                if (memberRank === null || clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER]
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
                        ClanChatManager.clanChatSetupInterface(player);
                    } else if (button == 38325) {
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] != null
                            && clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_TALK] == rank) {
                            return true;
                        }
                        clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_TALK, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        ClanChatManager.clanChatSetupInterface(player);
                    } else if (button == 38328) {
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] != null
                            && clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_KICK] == rank) {
                            return true;
                        }
                        clan.setRankRequirements(ClanChat.RANK_REQUIRED_TO_KICK, rank);
                        player.getPacketSender().sendMessage("You have changed your clanchat channel's settings.");
                        ClanChatManager.clanChatSetupInterface(player);
                        ClanChatManager.updateList(clan);
                    }

                    return true;
            }
        }
        let target: string | null = null;
        let clan: ClanChat | null = null;
        if (button >= 37144 && button <= 37243) {
            if ((player.currentClanChat === null || player.currentClanChat.ownerName !== player.username) && menuId !== 7) {
                player.getPacketSender().sendMessage("Only the clanchat owner can do that.");
                return true;
            }
            const index = (button - 37144);
            target = ClanChatManager.getPlayer(index, player.currentClanChat).username;
            clan = player.currentClanChat;
        } else if (button >= 38752 && button <= 38951) {
            const index = button - 38752;
            if (index < player.getRelations().getFriendList().length) {
                target = Misc.formatPlayerName(Misc.longToString(player.getRelations().getFriendList().indexOf(index)));
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
                    let rank = ClanChatRank.forMenuId(menuId);
                    let targetRank = clan.getRank(target);
                    if (targetRank != null) {
                        if (targetRank === rank) {
                            player.getPacketSender().sendMessage("That player already has that rank.");
                            return true;
                        }
                        if (targetRank === ClanChatRank.STAFF) {
                            player.getPacketSender().sendMessage("That player cannot be promoted or demoted.");
                            return true;
                        }
                    }
                    clan.giveRank(target, rank);
                    let p2 = World.getPlayerByName(target);
                    if (p2) {
                        ClanChatManager.updateRank(clan, p2);
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            if (rank === null || clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId() > rank
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
                    if (targetRank == ClanChatRank.STAFF) {
                        player.getPacketSender().sendMessage("That player cannot be promoted or demoted.");
                        return true;
                    }
                    clan.getRankedNames().delete(target);
                    p2 = World.getPlayerByName(target);
                    if (p2) {
                        ClanChatManager.updateRank(clan, p2);
                        if (clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER] != null) {
                            rank = clan.getPlayerRank(p2);
                            if (rank == null || clan.getRankRequirement()[ClanChat.RANK_REQUIRED_TO_ENTER].getSpriteId() > rank
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
                    const kick = World.getPlayerByName(target);
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
                    player.setEnteredSyntaxAction(new ClanChatEntered((input) => {
                        ClanChatManager.join(player, input);
                    }));
                    player.getPacketSender().sendEnterInputPrompt("Which clanchat channel would you like to join?");
                } else {
                    ClanChatManager.leave(player, false);
                    player.setClanChatName("");
                }
                return true;
        }
        return false;
    }
}



