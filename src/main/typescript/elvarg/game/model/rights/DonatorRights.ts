export class DonatorRights {
    public static NONE = { spriteId: -1, yellDelay: -1, yellTag: "" };
    public static REGULAR_DONATOR = { spriteId: 622, yellDelay: 40, yellTag: "[Donator]" };
    public static SUPER_DONATOR = { spriteId: 623, yellDelay: 25, yellTag: "[Super Donator]" };
    public static UBER_DONATOR = { spriteId: 624, yellDelay: 10, yellTag: "[Uber Donator]" };

    public static getSpriteId(rights: any) {
        return rights.spriteId;
    }

    public static getYellDelay(rights: any) {
        return rights.yellDelay;
    }

    public static getYellTag(rights: any) {
        return rights.yellTag;
    }
}