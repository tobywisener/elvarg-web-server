import { Player } from "../../../entity/impl/player/Player";
import { StackType } from "../StackType";
import { ItemContainer } from "../ItemContainer";

console.log(typeof ItemContainer, "ItemContainer");

export class Inventory extends ItemContainer {
  public static readonly INTERFACE_ID: number = 3214;

  constructor(public player: Player) {
    super(player);
  }

  public capacity(): number {
    return 28;
  }

  public stackType(): StackType {
    return StackType.DEFAULT;
  }

  public refreshItems(): ItemContainer {
    this.getPlayer()
      .getPacketSender()
      .sendItemContainer(this, Inventory.INTERFACE_ID);
    return this;
  }

  public full(itemId?: number): ItemContainer {
    this.getPlayer()
      .getPacketSender()
      .sendMessage("Not enough space in your inventory.");
    return this;
  }
}
