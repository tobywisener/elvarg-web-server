import { ItemDefinition } from "../definition/ItemDefinition";
import { Player } from "../entity/impl/player/Player";
import { PlayerBot } from "../entity/impl/playerbot/PlayerBot";
import { Item } from "../model/Item";
import { PlayerStatus } from "../model/PlayerStatus";
import { SecondsTimer } from "../model/SecondsTimer";
import { ItemContainer } from "../model/container/ItemContainer";
import { StackType } from "../model/container/StackType";
import { Inventory } from "../model/container/impl/Inventory";
import { Misc } from "../../util/Misc";

class PlayerItemContainer extends ItemContainer {
    constructor(player, private readonly execFunc: Function) {
      super(player);
    }
  
    stackType() {
      return StackType.DEFAULT;
    }
  
    refreshItems(): ItemContainer {
      this.execFunc();
      return this;
    }
  
    full(): ItemContainer {
      this.player.getPacketSender().sendMessage("You cannot trade more items.");
      return this;
    }
  
    capacity() {
      return 28;
    }
  }

export class Trading {
    public static readonly CONTAINER_INTERFACE_ID: number = 3415;
    public static readonly CONTAINER_INVENTORY_INTERFACE: number = 3321;
    public static readonly INVENTORY_CONTAINER_INTERFACE: number = 3322;
    // Interface data
    private static readonly INTERFACE: number = 3323;
    private static readonly CONTAINER_INTERFACE_ID_2: number = 3416;
    private static readonly CONFIRM_SCREEN_INTERFACE: number = 3443;
    // Frames data
    private static readonly TRADING_WITH_FRAME: number = 3417;
    private static readonly STATUS_FRAME_1: number = 3431;
    private static readonly STATUS_FRAME_2: number = 3535;
    private static readonly ITEM_LIST_1_FRAME: number = 3557;
    private static readonly ITEM_LIST_2_FRAME: number = 3558;
    private static readonly ITEM_VALUE_1_FRAME: number = 24209;
    private static readonly ITEM_VALUE_2_FRAME: number = 24210;

    // Nonstatic
    private player: Player;
    private container: ItemContainer;
    private interact: Player;
    private state: TradeState = TradeState.NONE;

    // Delays!!
    private button_delay: SecondsTimer = new SecondsTimer();
    private request_delay: SecondsTimer = new SecondsTimer();

    constructor(player: Player) {
        this.player = player;
        this.container = new PlayerItemContainer(player, ()=> {
                player.getPacketSender().sendInterfaceSet(Trading.INTERFACE, Trading.CONTAINER_INVENTORY_INTERFACE);
                player.getPacketSender().sendItemContainer(this.container, Trading.CONTAINER_INTERFACE_ID);
                player.getPacketSender().sendItemContainer(player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);
                player.getPacketSender().sendItemContainer(this.interact.getTrading().getContainer(), Trading.CONTAINER_INTERFACE_ID_2);
                this.interact.getPacketSender().sendItemContainer(player.getTrading().getContainer(), Trading.CONTAINER_INTERFACE_ID_2);
                return this;
        });
    }

    static listItems(items: ItemContainer): string {
        let string = "";
        let item_counter = 0;
        let list: Item[] = [];
        for (let item of items.getValidItems()) {
            for (let item_ of list) {
                if (item_.getId() == item.getId()) {
                    continue;
                }
            }
            list.push(new Item(item.getId(), items.getAmount(item.getId())));
        }
        for (let item of list) {
            if (item_counter > 0) {
                string += "\n";
            }
            string += item.getDefinition().getName().replace(/_/g, " ");
            let amt = "" + Misc.format(item.getAmount());
            if (item.getAmount() >= 1000000000) {
                amt = "@gre@" + Math.floor(item.getAmount() / 1000000000) + " billion @whi@(" + Misc.format(item.getAmount())
                    + ")";
            } else if (item.getAmount() >= 1000000) {
                amt = "@gre@" + Math.floor(item.getAmount() / 1000000) + " million @whi@(" + Misc.format(item.getAmount()) + ")";
            } else if (item.getAmount() >= 1000) {
                amt = "@cya@" + Math.floor(item.getAmount() / 1000) + "K @whi@(" + Misc.format(item.getAmount()) + ")";
            }
            string += " x @red@" + amt;
            item_counter++;
        }
        if (item_counter == 0) {
            string = "Absolutely nothing!";
        }
        return string;
    }

    private static validate(player: Player, interact: Player, playerStatus: PlayerStatus, ...tradeState: TradeState[]): boolean {
        if (player == null || interact == null) {
            return false;
        }
        if (player.getStatus() != playerStatus) {
            return false;
        }
        if (interact.getStatus() != playerStatus) {
            return false;
        }
        if (player.getTrading().getInteract() == null || player.getTrading().getInteract() != interact) {
            return false;
        }
        if (interact.getTrading().getInteract() == null || interact.getTrading().getInteract() != player) {
            return false;
        }
        let found = false;
        for (let duelState of tradeState) {
            if (player.getTrading().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        found = false;
        for (let duelState of tradeState) {
            if (interact.getTrading().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return true;
    }

    public requestTrade(t_: Player) {
        if (this.state == TradeState.NONE || this.state == TradeState.REQUESTED_TRADE) {
            if (!this.request_delay.finished()) {
                let seconds = this.request_delay.secondsRemaining();
                this.player.getPacketSender()
                    .sendMessage("You must wait another " + (seconds == 1 ? "second" : "" + seconds + " seconds")
                        + " before sending more trade requests.");
                return;
            }

            // Cache the interact...
            let interact_: Player = this.interact;
            let t_state = t_.getTrading().getState();
            let initiateTrade = false;
            this.setInteract(t_);
            this.setState(TradeState.REQUESTED_TRADE);
            if (t_state == TradeState.REQUESTED_TRADE) {
                if (t_.getTrading().getInteract() != null && t_.getTrading().getInteract() == this.player) {
                    initiateTrade = true;
                }
            }
            if (initiateTrade) {
                this.player.getTrading().initiateTrade();
                t_.getTrading().initiateTrade();
            } else {
                this.player.getPacketSender().sendMessage("You've sent a trade request to " + t_.getUsername() + ".");
                t_.getPacketSender().sendMessage(this.player.getUsername() + ":tradereq:");
                if (t_ instanceof PlayerBot) {
                    // Player Bots: Automatically accept any trade request
                    ((t_ as PlayerBot).getTradingInteraction().acceptTradeRequest(this.player));
                }
            }
            this.request_delay.start(2);
        } else {
            this.player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    }

    public initiateTrade() {
        this.player.setStatus(PlayerStatus.TRADING);
        this.setState(TradeState.TRADE_SCREEN);
        this.player.getPacketSender().sendString("Trading with: @whi@" + this.interact.getUsername(), Trading.TRADING_WITH_FRAME,);
        this.player.getPacketSender().sendString("", Trading.STATUS_FRAME_1,)
            .sendString( "Are you sure you want to make this trade?", Trading.STATUS_FRAME_2)
            .sendString("0 bm", Trading.ITEM_VALUE_1_FRAME).sendString( "0 bm", Trading.ITEM_VALUE_2_FRAME);
        this.container.resetItems();
        this.container.refreshItems();
        if (this.player instanceof PlayerBot) {
            ((this.player as PlayerBot).getTradingInteraction().addItemsToTrade(this.container, this.interact));
        }
    }

    public closeTrade() {
        if (this.state != TradeState.NONE) {
            let interact_ = this.interact;
            for (let t of this.container.getValidItems()) {
                this.container.switchItems(this.player.getInventory(), t.clone(), false, false);
            }
            this.player.getInventory().refreshItems();
            this.resetAttributes();
            this.player.getPacketSender().sendMessage("Trade declined.");
            this.player.getPacketSender().sendInterfaceRemoval();
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus.TRADING) {
                    if (interact_.getTrading().getInteract() != null && interact_.getTrading().getInteract() == this.player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    }

    public acceptTrade() {
        if (!Trading.validate(this.player, this.interact, PlayerStatus.TRADING, TradeState.TRADE_SCREEN,
            TradeState.ACCEPTED_TRADE_SCREEN, TradeState.CONFIRM_SCREEN, TradeState.ACCEPTED_CONFIRM_SCREEN
        )) {
            return;
        }
        if (!this.button_delay.finished()) {
            return;
        }
        let interact_: Player = this.interact;
        let t_state = interact_.getTrading().getState();
        if (this.state == TradeState.TRADE_SCREEN) {
            let slotsNeeded = 0;
            for (let t of this.container.getValidItems()) {
                slotsNeeded += t.getDefinition().isStackable() && this.interact.getInventory().contains(t.getId()) ? 0 : 1;
            }
            let freeSlots = this.interact.getInventory().getFreeSlots();
            if (slotsNeeded > freeSlots) {
                this.player.getPacketSender().sendMessage("")
                    .sendMessage("@or3@" + this.interact.getUsername() + " will not be able to hold that item.")
                    .sendMessage(
                        "@or3@They have " + freeSlots + " free inventory slot" + (freeSlots == 1 ? "." : "s."));

                this.interact.getPacketSender()
                    .sendMessage("Trade cannot be accepted, you don't have enough free inventory space.");
                return;
            }
            this.state = (TradeState.ACCEPTED_TRADE_SCREEN);

            this.player.getPacketSender().sendString( "Waiting for other player..", Trading.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString( "" + this.player.getUsername() + " has accepted.", Trading.STATUS_FRAME_1,);
            if (this.state == TradeState.ACCEPTED_TRADE_SCREEN && t_state == TradeState.ACCEPTED_TRADE_SCREEN) {
                this.player.getTrading().confirmScreen();
                interact_.getTrading().confirmScreen();
            } else {
                if (interact_ instanceof PlayerBot) {
                    interact_.getTradingInteraction().acceptTrade();
                }
            }
        } else if (this.state === TradeState.CONFIRM_SCREEN) {
            // Both are in the same state. Do the second-stage accept.
            this.state = (TradeState.ACCEPTED_CONFIRM_SCREEN);
            // Update status...
            this.player.getPacketSender().sendString(
                "Waiting for " + interact_.getUsername() + 's confirmation..', Trading.STATUS_FRAME_2,);
            interact_.getPacketSender().sendString(
                "" + this.player.getUsername() + " has accepted.Do you wish to do the same ?", Trading.STATUS_FRAME_2);
            if (this.state === TradeState.ACCEPTED_CONFIRM_SCREEN && t_state === TradeState.ACCEPTED_CONFIRM_SCREEN) {
                // Give items to both players...
                const receivingItems = interact_.getTrading().getContainer().getValidItems();
                for (const item of receivingItems) {
                    this.player.getInventory().addItem(item);
                }
                const givingItems = this.player.getTrading().getContainer().getValidItems();
                for (const item of givingItems) {
                    interact_.getInventory().addItem(item);
                }
                if (this.player instanceof PlayerBot && receivingItems.length > 0) {
                    (this.player as PlayerBot).getTradingInteraction().receivedItems(receivingItems, interact_);
                }
                // Reset attributes for both players...
                this.resetAttributes();
                interact_.getTrading().resetAttributes();
                // Send interface removal for both players...
                this.player.getPacketSender().sendInterfaceRemoval();
                interact_.getPacketSender().sendInterfaceRemoval();
                // Send successful trade message!
                this.player.getPacketSender().sendMessage("Trade accepted!");
                interact_.getPacketSender().sendMessage("Trade accepted!");
            }
        } else {
            if (interact_ instanceof PlayerBot) {
                (interact_ as PlayerBot).getTradingInteraction().acceptTrade();
            }
        }
        this.button_delay.start(1);
    }

    private confirmScreen() {
        // Update state
        this.state = TradeState.CONFIRM_SCREEN;

        // Send new interface
        this.player.getPacketSender().sendInterfaceSet(Trading.CONFIRM_SCREEN_INTERFACE, Trading.CONTAINER_INVENTORY_INTERFACE);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);

        // Send new interface frames
        let thisItems = Trading.listItems(this.container);
        let interactItems = Trading.listItems(this.interact.getTrading().getContainer());
        this.player.getPacketSender().sendString(thisItems, Trading.ITEM_LIST_1_FRAME,);
        this.player.getPacketSender().sendString(interactItems, Trading.ITEM_LIST_2_FRAME);
    }

    handleItem(id: number, amount: number, slot: number, from: ItemContainer, to: ItemContainer) {
        if (this.player.getInterfaceId() === Trading.INTERFACE) {

            // Validate this trade action..
            if (!Trading.validate(this.player, this.interact, PlayerStatus.TRADING,
                TradeState.TRADE_SCREEN, TradeState.ACCEPTED_TRADE_SCREEN)) {
                return;
            }

            // Check if the trade was previously accepted (and now modified)...
            let modified = false;
            if (this.state === TradeState.ACCEPTED_TRADE_SCREEN) {
                this.state = TradeState.TRADE_SCREEN;
                modified = true;
            }
            if (this.interact.getTrading().getState() === TradeState.ACCEPTED_TRADE_SCREEN) {
                this.interact.getTrading().setState(TradeState.TRADE_SCREEN);
                modified = true;
            }
            if (modified) {
                this.player.getPacketSender().sendString("@red@TRADE MODIFIED!", Trading.STATUS_FRAME_1);
                this.interact.getPacketSender().sendString( "@red@TRADE MODIFIED!", Trading.STATUS_FRAME_1);
            }
            if (this.state === TradeState.TRADE_SCREEN && this.interact.getTrading().getState() === TradeState.TRADE_SCREEN) {

                // Check if the item is in the right place
                if (from.getItems()[slot].getId() === id) {

                    // Make sure we can fit that amount in the trade
                    if (from instanceof Inventory) {
                        if (!ItemDefinition.forId(id).isStackable()) {
                            if (amount > this.container.getFreeSlots()) {
                                amount = this.container.getFreeSlots();
                            }
                        }
                    }

                    if (amount <= 0) {
                        return;
                    }

                    const item = new Item(id, amount);

                    // Do the switch!
                    if (item.getAmount() === 1) {
                        from.switchItem(to, item,  false, slot, true);
                    } else {
                        from.switchItems(to, item, false, true);
                    }

                    // Update value frames for both players
                    const plr_value = this.container.getTotalValue();
                    const other_plr_value = this.interact.getTrading().getContainer().getTotalValue();
                    this.player.getPacketSender().sendString(Misc.insertCommasToNumber(plr_value) + " bm", Trading.ITEM_VALUE_1_FRAME,);
                    this.player.getPacketSender().sendString(Misc.insertCommasToNumber(other_plr_value) + " bm", Trading.ITEM_VALUE_2_FRAME);
                    this.interact.getPacketSender().sendString(Misc.insertCommasToNumber(other_plr_value) + " bm", Trading.ITEM_VALUE_1_FRAME,);
                    this.interact.getPacketSender().sendString(Misc.insertCommasToNumber(plr_value) + " bm", Trading.ITEM_VALUE_2_FRAME);
                    if (this.interact instanceof PlayerBot) {
                        // Automatically accept the trade whenever an item is added by the player
                        this.interact.getTrading().acceptTrade();
                    }
                }
            } else {
                this.player.getPacketSender().sendInterfaceRemoval();
            }
        }
    }

    resetAttributes() {
        // Reset trade attributes
        this.setInteract(null);
        this.setState(TradeState.NONE);

        // Reset player status if it's trading.
        if (this.player.getStatus() === PlayerStatus.TRADING) {
            this.player.setStatus(PlayerStatus.NONE);
        }

        // Reset container..
        this.container.resetItems();

        // Send the new empty container to the interface
        // Just to clear the items there.
        this.player.getPacketSender().sendItemContainer(this.container, Trading.CONTAINER_INTERFACE_ID);
    }

    getState(): TradeState {
        return this.state;
    }

    setState(state: TradeState) {
        this.state = state;
    }

    getButtonDelay(): SecondsTimer {
        return this.button_delay;
    }

    getInteract(): Player {
        return this.interact;
    }

    setInteract(interact: Player) {
        this.interact = interact;
    }

    getContainer(): ItemContainer {
        return this.container;
    }
}

enum TradeState {
    NONE, REQUESTED_TRADE, TRADE_SCREEN, ACCEPTED_TRADE_SCREEN, CONFIRM_SCREEN, ACCEPTED_CONFIRM_SCREEN
}
