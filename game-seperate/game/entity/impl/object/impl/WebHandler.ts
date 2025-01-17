import { Sound } from "../../../../Sound";
import { Sounds } from "../../../../Sounds";
import { Player } from "../../player/Player";
import { GameObject } from "../GameObject";
import { Item } from "../../../../model/Item";
import { Animation } from "../../../../model/Animation";
import { TaskManager } from "../../../../task/TaskManager";
import { TimedObjectReplacementTask } from "../../../../task/impl/TimedObjectReplacementTask";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { Misc } from "../../../../../util/Misc";
import { ObjectIdentifiers } from "../../../../../util/ObjectIdentifiers";

const WEB_RESPAWN = 400;
const SLASH_SOUND: Sound = Sound.SLASH_WEB;
const FAIL_SLASH_SOUND: Sound = Sound.FAIL_SLASH_WEB;
const ITEM_ON_WEB_ANIMATION: Animation = new Animation(911);
let lastSlash: number;
const SHARP_ITEM_PATTERN = /(.*2h.*|.*sword.*|.*dagger.*|.*rapier.*|.*scimitar.*|.*halberd.*|.*spear.*|.*axe.*|.*excalibur.*|.*claws.*|.*whip.*)/i;

/**
 * Allows us to cut sticky webs to walk through - wilderness / mage arena.
 *  @author syuil (Michael)
 */

export class WebHandler {

    public static isSharpItem(item: Item): boolean {
        const sharpItemMatcher = SHARP_ITEM_PATTERN.exec(item.getDefinition().getName());
        return sharpItemMatcher != null || (item.getDefinition().getId() == ItemIdentifiers.KNIFE);
    }

    public static wieldingSharpItem(player: Player): boolean {
        for (let t of player.getEquipment().getItems()) {
            if (t != null && t.getId() > 0 && t.getAmount() > 0) {
                const sharpItemMatcher = SHARP_ITEM_PATTERN.exec(t.getDefinition().getName());
                if (sharpItemMatcher != null) {
                    return true;
                }
            }
        }
        return false;
    }

    public static handleSlashWeb(player: Player, web: GameObject, itemOnWeb: boolean) {
        if (web == null) return;

        if (web.getDefinition().getName().toLowerCase() !== "web") return;

        const currentTime = Date.now();
        if (currentTime - lastSlash < 4000) return;

        player.performAnimation(itemOnWeb ? ITEM_ON_WEB_ANIMATION : new Animation(player.getAttackAnim()));

        const successfulSlashChance = Misc.randoms(2);
        if (successfulSlashChance < 2) {
            player.sendMessage("You slash the web apart.");
            Sounds.sendSound(player, SLASH_SOUND);
            TaskManager.submit(new TimedObjectReplacementTask(web, new GameObject(ObjectIdentifiers.SLASHED_WEB, web.getLocation(), web.getType(), web.getFace(), player.getPrivateArea()), WEB_RESPAWN));
        } else {
            Sounds.sendSound(player, FAIL_SLASH_SOUND);
            player.sendMessage("You fail to slash the web.");
        }

        lastSlash = currentTime;
    }
}

