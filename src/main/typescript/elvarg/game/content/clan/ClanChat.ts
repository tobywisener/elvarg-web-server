import { World } from "../../World";
import { Player } from "../../entity/impl/player/Player";
import { ClanChatRank } from "./ClanChatRank";
import { BannedMember } from "./BannedMember";

export class ClanChat {
    public static RANK_REQUIRED_TO_ENTER = 0;
    public static RANK_REQUIRED_TO_KICK = 1;
    public static RANK_REQUIRED_TO_TALK = 2;
    private index: number;
    private name: string;
    private owner: Player;
    public ownerName: string;
    private lootShare: boolean;
    private rankRequirement: ClanChatRank[] = new Array(3);
    private members: Player[] = new Array();
    private bannedMembers: BannedMember[] = new Array();
    private rankedNames: Map<string, ClanChatRank> = new Map<string, ClanChatRank>();

    public ClanChat(ownerName: string, name: string, index: number) {
        let o = World.getPlayerByName(ownerName);
        this.owner = o ? o : null;
        this.ownerName = ownerName;
        this.name = name;
        this.index = index;
    }

    public getOwner(): Player {
        return this.owner;
    }
    public setOwner(owner: Player): ClanChat {
        this.owner = owner;
        return this;
    }

    public getOwnerName(): string {
        return this.ownerName;
    }

    public getIndex(): number {
        return this.index;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): ClanChat {
        this.name = name;
        return this;
    }

    public getLootShare(): boolean {
        return this.lootShare;
    }

    public setLootShare(lootShare: boolean): void {
        this.lootShare = lootShare;
    }

    public addMember(member: Player): ClanChat {
        this.members.push(member);
        return this;
    }

    public removeMember(name: string): ClanChat {
        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            if (member == null) continue;
            if (member.getUsername() === name) {
                this.members.splice(i, 1);
                break;
            }
        }
        return this;
    }

    public getPlayerRank(player: Player): ClanChatRank {
        return this.getRank(player.getUsername());
    }

    public givePlayerRank(player: Player, rank: ClanChatRank): ClanChat {
        return this.giveRank(player.getUsername(), rank);
    }

    public getRank(player: string): ClanChatRank {
        return this.rankedNames.get(player);
    }

    public giveRank(player: string, rank: ClanChatRank): ClanChat {
        this.rankedNames.set(player, rank);
        return this;
    }

    public getMembers(): Player[] {
        return this.members;
    }

    public getRankedNames(): Map<string, ClanChatRank> {
        return this.rankedNames;
    }

    public getBannedNames(): BannedMember[] {
        return this.bannedMembers;
    }

    public addBannedName(name: string): void {
        this.bannedMembers.push(new BannedMember(name, 1800));
    }

    public isBanned(name: string): boolean {
        for (let i = 0; i < this.bannedMembers.length; i++) {
            let b = this.bannedMembers[i];
            if (b == null || b.getTimer().finished()) {
                this.bannedMembers.splice(i, 1);
                continue;
            }
            if (b.getName() === name) {
                return true;
            }
        }
        return false;
    }

    public getRankRequirement(): ClanChatRank[] {
        return this.rankRequirement;
    }

    public  setRankRequirements(index: number, rankRequirement: ClanChatRank): ClanChat {
        this.rankRequirement[index] = rankRequirement;
        return this;
    }
}        