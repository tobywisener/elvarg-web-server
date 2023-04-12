export class PlayerRights {
    public static NONE = new PlayerRights(-1, "")
    public static MODERATOR = new PlayerRights(618)
    public static ADMINISTRATOR = new PlayerRights(619)
    public static OWNER = new PlayerRights(620)
    public static DEVELOPER = new PlayerRights(621)

    private spriteId: number;
    private yellTag: string;
    constructor(spriteId: number, yellTag?: string) {
        this.spriteId = spriteId;
        this.yellTag = yellTag;
    }
    public getSpriteId() {
        return this.spriteId;
    }
    public getYellTag() {
        return this.yellTag;
    }
}