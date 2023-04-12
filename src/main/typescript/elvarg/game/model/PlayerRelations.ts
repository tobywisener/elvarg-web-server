import { Player } from "../entity/impl/player/Player";
import { World } from "../World";
import { Misc } from "../../util/Misc";
import { ClanChatManager } from "../content/clan/ClanChatManager";

export class PlayerRelations {
    private status: PrivateChatStatus = PrivateChatStatus.ON;
    public friendList: Array<number> = new Array<number>(200);
    public ignoreList: Array<number> = new Array<number>(100);
    private privateMessageId = 1;
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    public getPrivateMessageId(): number {
        return this.privateMessageId++;
    }

    public setPrivateMessageId(privateMessageId: number): PlayerRelations {
        this.privateMessageId = privateMessageId;
        return this;
    }

    public setStatus(status: PrivateChatStatus, update: boolean): PlayerRelations {
        this.status = status;
        if (update) {
            this.updateLists(true);
        }
        return this;
    }

    public getStatus(): PrivateChatStatus {
        return this.status;
    }

    public getFriendList(): Array<number> {
        return this.friendList;
    }

    public getIgnoreList(): Array<number> {
        return this.ignoreList;
    }

    updateLists(online: boolean) {
        if (this.status == PrivateChatStatus.OFF) {
            online = false;
        }
        this.player.getPacketSender().sendFriendStatus(2);
        for (const players of World.getPlayers()) {
            if (!players) {
                continue;
            }
            let temporaryOnlineStatus = online;
            if (players.getRelations().friendList.includes(this.player.getLongUsername())) {
                if (this.status === PrivateChatStatus.FRIENDS_ONLY && !this.friendList.includes(players.getLongUsername())
                    || this.status === PrivateChatStatus.OFF || this.ignoreList.includes(players.getLongUsername())) {
                    temporaryOnlineStatus = false;
                }
                players.getPacketSender().sendFriend(this.player.getLongUsername(), temporaryOnlineStatus ? 1 : 0);
            }
            let tempOn = true;
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
        return this;
    }

    sendPrivateStatus() {
        const privateChat = this.status === PrivateChatStatus.OFF ? 2 : this.status === PrivateChatStatus.FRIENDS_ONLY ? 1 : 0;
        this.player.getPacketSender().sendChatOptions(0, privateChat, 0);
    }

    sendFriends() {
        for (const l of this.friendList) {
            this.player.getPacketSender().sendFriend(l, 0);
        }
    }

    public sendIgnores(): void {
        for (const l of this.ignoreList) {
            this.player.getPacketSender().sendAddIgnore(l);
        }
    }

    public sendAddFriend(name: number): void {
        this.player.getPacketSender().sendFriend(name, 0);
    }

    public sendDeleteFriend(name: number): void {
        this.player.getPacketSender().sendDeleteFriend(name);
    }

    public sendAddIgnore(name: number): void {
        this.player.getPacketSender().sendAddIgnore(name);
    }

    public sendDeleteIgnore(name: number): void {
        this.player.getPacketSender().sendDeleteIgnore(name);
    }

    public onLogin(player: Player): PlayerRelations {
        this.sendIgnores();
        this.sendFriends();
        this.sendPrivateStatus();
        return this;
    }

    public addFriend(username: number): void {
        const name = Misc.formatName(Misc.longToString(username));
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
        } else {
            this.friendList.push(username);
            this.sendAddFriend(username);
            this.updateLists(true);
            const friend = World.getPlayerByName(name);
            if (friend) {
                friend.getRelations().updateLists(true);
                ClanChatManager.updateRank(ClanChatManager.getClanChat(this.player), friend);
                if (this.player.getInterfaceId() === ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                    ClanChatManager.clanChatSetupInterface(this.player);
                }
            }
        }
    }

    public isFriendWith(player: string): boolean {
        return this.friendList.indexOf(Misc.stringToLong(player)) !== -1;
    }

    public deleteFriend(username: number): void {
        const name = Misc.formatName(Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        const friendIndex = this.friendList.indexOf(username);
        if (friendIndex !== -1) {
            this.friendList.splice(friendIndex, 1);
            this.sendDeleteFriend(username);
            this.updateLists(false);
            const unfriend = World.getPlayerByName(name);
            if (unfriend) {
                unfriend.getRelations().updateLists(false);
                ClanChatManager.updateRank(ClanChatManager.getClanChat(this.player), unfriend);
                if (this.player.getInterfaceId() === ClanChatManager.CLAN_CHAT_SETUP_INTERFACE_ID) {
                    ClanChatManager.clanChatSetupInterface(this.player);
                }
            }
        } else {
            this.player.getPacketSender().sendMessage("This player is not on your friends list!");
        }
    }

    public addIgnore(username: number): void {
        const name = Misc.formatName(Misc.longToString(username));
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
        } else {
            this.ignoreList.push(username);
            this.sendAddIgnore(username);
            this.updateLists(true);
            const ignored = World.getPlayerByName(name);
            if (ignored) {
                ignored.getRelations().updateLists(false);
            }
        }
    }

    public deleteIgnore(username: number): void {
        const name = Misc.formatName(Misc.longToString(username));
        if (name === this.player.getUsername()) {
            return;
        }
        const ignoreIndex = this.ignoreList.indexOf(username);
        if (ignoreIndex !== -1) {
            this.ignoreList.splice(ignoreIndex, 1);
            this.sendDeleteIgnore(username);
            this.updateLists(true);
            if (this.status === PrivateChatStatus.ON) {
                const ignored = World.getPlayerByName(name);
                if (ignored) {
                    ignored.getRelations().updateLists(true);
                }
            }
        } else {
            this.player.getPacketSender().sendMessage("This player is not on your ignore list!");
        }
    }

    public message(friend: Player, message: Uint8Array, size: number): void {
        if ((friend.getRelations().status === PrivateChatStatus.FRIENDS_ONLY && friend.getRelations().friendList.indexOf(this.player.getLongUsername()) === -1) || friend.getRelations().status === PrivateChatStatus.OFF) {
            this.player.getPacketSender().sendMessage("This player is currently offline.");
            return;
        }
        if (this.status === PrivateChatStatus.OFF) {
            this.setStatus(PrivateChatStatus.FRIENDS_ONLY, true);
        }
        friend.getPacketSender().sendPrivateMessage(this.player, message, size);
    }

}

export enum PrivateChatStatus {
    ON, FRIENDS_ONLY, OFF
}