import { Player } from "../../../entity/impl/player/Player";
import { ItemContainer } from "../ItemContainer";
import { StackType } from "../StackType";
import { PlayerStatus } from "../../PlayerStatus";
import { Misc } from "../../../../util/Misc";
import { Item } from "../../Item";
import { Bank } from "./Bank";

export class PriceChecker extends ItemContainer {

    public static readonly INTERFACE_ID: number = 42000;
    public static readonly CONTAINER_ID: number = 18500;
    private static readonly TEXT_START_ROW_1: number = 18300;
    private static readonly TEXT_START_ROW_2: number = 18400;

    constructor(player: Player) {
        super(player);
    }

    public open() {
        this.player.setStatus(PlayerStatus.PRICE_CHECKING);
        this.player.getMovementQueue().reset();
        this.refreshItems();
        return this;
    }

    public capacity(): number {
        return 24;
    }

    public stackType(): StackType {
        return StackType.DEFAULT;
    }

    refreshItems(): ItemContainer {
        const items_ = this.getValidItems();
        if (items_.length > 0) {
            this.player.getPacketSender().sendString("", 18355).sendString(
                Misc.insertCommasToNumber(this.getTotalValue()), 18351); // TOTAL VALUE


            // Send item prices
            for (let i = 0; i < this.capacity(); i++) {
                let itemPrice = "";
                let totalPrice = "";

                if (this.getItems()[i].isValid()) {
                    let value = this.getItems()[i].getDefinition().getValue();
                    let amount = this.getItems()[i].getAmount();
                    let total_price = (value * amount);

                    if (total_price >= Number.MAX_SAFE_INTEGER) {
                        totalPrice = "Too High!";
                    } else {
                        totalPrice = " = " + Misc.insertCommasToNumber(String(total_price));
                    }

                    itemPrice = "" + Misc.insertCommasToNumber(String(value)) + " x" + String(amount);
                }

                this.player.getPacketSender().sendString(itemPrice, PriceChecker.TEXT_START_ROW_1 + i);
                this.player.getPacketSender().sendString(totalPrice, PriceChecker.TEXT_START_ROW_2 + i);
            }

        } else {
            this.player.getPacketSender().sendString( "Click an item in your inventory to check it's wealth.", 18355)
                .sendString("0", 18351); // TOTAL VALUE

            // Reset item prices
            for (let i = 0; i < this.capacity(); i++) {
                this.player.getPacketSender().sendString("", PriceChecker.TEXT_START_ROW_1 + i,);
                this.player.getPacketSender().sendString("", PriceChecker.TEXT_START_ROW_2 + i,);
            }
        }

        this.player.getPacketSender().sendInterfaceSet(PriceChecker.INTERFACE_ID, 3321);
        this.player.getPacketSender().sendItemContainer(this, PriceChecker.CONTAINER_ID);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), 3322);
        return this;
    }

    public full() {
        this.player.getPacketSender().sendMessage("The pricechecker cannot hold any more items.");
        return this;
    }

    public withdrawAll(): void {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            for (const item of this.getValidItems()) {
                this.switchItems(this.player.getInventory(), item.clone(), false, false);
            }
            this.refreshItems();
            this.player.getInventory().refreshItems();
        }
    }

    public depositAll(): void {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            for (const item of this.player.getInventory().getValidItems()) {
                if (item.getDefinition().getValue() > 0) {
                    this.switchItems(this, item.clone(), false, false);
                }
            }
            this.refreshItems();
            this.player.getInventory().refreshItems();
        }
    }

    public deposit(id: number, amount: number, slot: number): boolean {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {

            // Verify item
            if (this.player.getInventory().getItems()[slot].getId() == id) {

                // Perform switch
                const item = new Item(id, amount);
                if (!item.getDefinition().isSellable()) {
                    this.player.getPacketSender()
                        .sendMessage("That item cannot be pricechecked because it isn't sellable.");
                    return true;
                }
                if (item.getDefinition().getValue() == 0) {
                    this.player.getPacketSender()
                        .sendMessage("There's no point pricechecking that item. It has no value.");
                    return true;
                }

                if (item.getAmount() == 1) {
                    this.player.getInventory().switchItem(this, item, false, slot, true);
                } else {

                    this.switchItems(this, item, false, true);
                }
            }
            return true;
        }
        return false;
    }

    public withdraw(id: number, amount: number, slot: number): boolean {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            // Verify item
            if (this.items[slot].getId() == id) {

                // Perform switch
                const item = new Item(id, amount);
                if (item.getAmount() == 1) {
                    this.switchItem(this.player.getInventory(), item, false, slot, true);
                } else {
                    this.switchItems(this.player.getInventory(), item, false, true);
                }
            }
            return true;
        }
        return false;
    }
}
