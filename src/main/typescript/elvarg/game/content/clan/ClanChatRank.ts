

export class ClanChatRank {
    public static readonly FRIEND = new ClanChatRank(-1, 197);
    public static readonly RECRUIT = new ClanChatRank(0, 198);
    public static readonly CORPORAL = new ClanChatRank(1, 199);
    public static readonly SERGEANT = new ClanChatRank(2, 200);
    public static readonly LIEUTENANT = new ClanChatRank(3, 201);
    public static readonly CAPTAIN = new ClanChatRank(4, 202);
    public static readonly GENERAL = new ClanChatRank(5, 203);
    public static readonly OWNER = new ClanChatRank(-1, 204);
    public static readonly STAFF = new ClanChatRank(-1, 203);

    public readonly actionMenuId: number;
    private readonly spriteId: number;

    constructor(actionMenuId: number, spriteId: number) {
        this.actionMenuId = actionMenuId;
        this.spriteId = spriteId;
    }

    public static forId(id: number): ClanChatRank | null {
        for (const rank of Object.values(ClanChatRank)) {
            if (rank && typeof rank === 'object' && rank.ordinal() === id) {
                return rank;
            }
        }
        return null;
    }
    
    public static forMenuId(id: number): ClanChatRank | null {
        for (const rank of Object.values(ClanChatRank)) {
            if (rank && typeof rank === 'object' && rank.actionMenuId === id) {
                return rank;
            }
        }
        return null;
    }

    public getSpriteId(): number {
        return this.spriteId;
    }
}
