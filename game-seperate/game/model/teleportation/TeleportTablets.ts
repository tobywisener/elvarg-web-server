import { Location } from "../Location";
import { Player } from "../../entity/impl/player/Player";
import { TeleportHandler } from "./TeleportHandler";
import { TeleportType } from "./TeleportType";

export class TeleportTablets {
    public static init(player: Player, itemId: number): boolean {
        let tab = TeleportTablet.getTab(itemId);

        // Checks if the tab isn't present, if not perform nothing
        if (!tab) {
            return false;
        }

        //Handle present tab..
        if (player.getInventory().containsNumber(tab.tabId)) {
            if (TeleportHandler.checkReqs(player, tab.position)) {
                TeleportHandler.teleport(player, tab.position, TeleportType.TELE_TAB, false);
                player.getInventory().deleteNumber(tab.tabId, 1);
            }
        }

        return true;
    }
    // Teleport Tablet data storage.

}

class  TeleportTablet {
    HOME = new TeleportTablet(1, new Location(3222, 3222, 0));
    LUMBRIDGE = new TeleportTablet(8008, new Location(3222, 3218, 0));
    FALADOR = new TeleportTablet(8009, new Location(2965, 3379, 0));
    CAMELOT = new TeleportTablet(8010, new Location(2757, 3477, 0));
    ARDY = new TeleportTablet(8011, new Location(2661, 3305, 0));
    WATCH = new TeleportTablet(8012, new Location(2549, 3112, 0));
    VARROCK = new TeleportTablet(8007, new Location(3213, 3424, 0));

    /**
     * The {@value #tab_set} storing
     */
    private static readonly tab_set: ReadonlySet<TeleportTablet> = new Set(Object.values(TeleportTablet));

  /**
   * The item ID of the teleport tablet.
   */
  public readonly tabId: number;

  /**
   * The specified location that the teleport tablet will send the player upon interaction.
   */
  public readonly position: Location;

  /**
   * TeleportTablet constructor.
   *
   * @param tabId The item ID of the teleport tablet.
   * @param position The specified location that the teleport tablet will send the player upon interaction.
   */
  private constructor(tabId: number, position: Location) {
    this.tabId = tabId;
    this.position = position;
  }

  /**
   * Gets the teleport tablet with the specified item ID.
   *
   * @param tabId The item ID of the teleport tablet.
   * @returns The teleport tablet with the specified item ID, if it exists.
   */
  public static getTab(tabId: number): TeleportTablet | undefined {
    return Array.from(TeleportTablet.tab_set).find(tabs => tabs.getTab() === tabId);
  }

  /**
   * Gets the item ID of the teleport tablet.
   *
   * @returns The item ID of the teleport tablet.
   */
  public getTab(): number {
    return this.tabId;
  }

  /**
   * Gets the specified location that the teleport tablet will send the player upon interaction.
   *
   * @returns The specified location that the teleport tablet will send the player upon interaction.
   */
  public getPosition(): Location {
    return this.position;
  }
}

