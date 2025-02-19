import { Autocasting } from '../content/combat/magic/Autocasting';
import { Player } from '../entity/impl/player/Player';
import { TeleportType } from '../model/teleportation/TeleportType';
import { Skill } from './Skill';


export class MagicSpellbook {
    private interfaceId: number;
    /**
    * The spellbook's teleport type
    */

    public static NORMAL = new MagicSpellbook( 1151, TeleportType.NORMAL );
    public static ANCIENT = new MagicSpellbook(  12855, TeleportType.ANCIENT );
    public static LUNAR = new MagicSpellbook( 29999, TeleportType.LUNAR );
    
    private teleportType: TeleportType;

    private constructor(interfaceId: number, teleportType: TeleportType) {
        this.interfaceId = interfaceId;
        this.teleportType = teleportType;
    }

    public static forId(id: number): MagicSpellbook {
        for (let book in MagicSpellbook) {
            if (MagicSpellbook[book].ordinal === id) {
                return MagicSpellbook[book];
            }
        }
        return MagicSpellbook.NORMAL;
    }

    public static changeSpellbook(player: Player, book: MagicSpellbook) {
        if (book === player.getSpellbook()) {
            // Already using this spellbook
            return;
        }
        if (book === MagicSpellbook.LUNAR) {
            if (player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 40) {
                player.getPacketSender().sendMessage("You need at least level 40 Defence to use the Lunar spellbook.");
                return;
            }
        }

        //Update spellbook
        player.setSpellbook(book);

        //Reset autocast
        Autocasting.setAutocast(player, null);

        //Send notification message
        player.getPacketSender().sendMessage("You have changed your magic spellbook.")

            //Send the new spellbook interface to the client side tabs
            .sendTabInterface(6, player.getSpellbook().getInterfaceId());
    }

    /**
     * Gets the interface to switch tab interface to.
     *
     * @return The interface id of said spellbook.
     */
    public getInterfaceId(): number {
        return this.interfaceId;
    }

    /**
     * Gets the spellbook's teleport type
     *
     * @return The teleport type of said spellbook.
     */
    public getTeleportType(): TeleportType {
        return this.teleportType;
    }
}
