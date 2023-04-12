export enum CommandType {
    PUBLIC_CHAT = "public chat",
    PRIVATE_CHAT = "private chat",
    CLAN_CHAT = "clan chat",
}
export class Commandclass {
    private label: string;

    constructor(label: string) {
        this.label = label;
    };

    getLabel(): string {
        return this.label;
    }

}