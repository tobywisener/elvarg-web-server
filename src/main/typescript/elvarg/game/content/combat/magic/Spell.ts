import { Misc } from "../../../../util/Misc";
import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { Equipment } from "../../../model/container/impl/Equipment";
import { Item } from "../../../model/Item";
import { MagicSpellbook } from "../../../model/MagicSpellbook";
import { Skill } from "../../../model/Skill";
import { Autocasting } from "./Autocasting";
import { CombatSpells } from "./CombatSpells";
import { PlayerMagicStaff } from "./PlayerMagicStaff";

export abstract class Spell {

    abstract spellId(): number;
    abstract levelRequired(): number;
    abstract itemsRequired(player: Player): Item[];
    abstract equipmentRequired(player: Player): Item[];
    abstract startCast(cast: Mobile, castOn: Mobile): void
    abstract baseExperience();

    public getSpellbook(): MagicSpellbook {
        return MagicSpellbook.NORMAL;
    }

    canCast(player: Player, del: boolean): boolean {
        if (player.getSkillManager().getCurrentLevel(Skill.MAGIC) < this.levelRequired()) {
            player.getPacketSender().sendMessage(`You need a Magic level of ${this.levelRequired()} to cast this spell.`);
            player.getCombat().reset();
            return false;
        }

        if (player.getArea() != null) {
            if (player.getArea().isSpellDisabled(player, this.getSpellbook(), this.spellId())) {
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }
        }

        if (player.getSpellbook() === this.getSpellbook()) {
            Autocasting.setAutocast(player, null);
            player.getCombat().setCastSpell(null);
            player.getCombat().reset();
            return false;
        }

        const items = this.itemsRequired(player);
        if (items !== null) {
            const suppressedItems = PlayerMagicStaff.suppressRunes(player, items);

            if (!player.getInventory().containsAllItem(suppressedItems)) {
                player.getPacketSender().sendMessage("You do not have the required items to cast this spell.");
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }

            const equipment = this.equipmentRequired(player);
            if (equipment !== null && !player.getEquipment().containsAllItem(equipment)) {
                player.getPacketSender().sendMessage("You do not have the required equipment to cast this spell.");
                player.getCombat().setCastSpell(null);
                player.getCombat().reset();
                return false;
            }

            if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == 11791) {
                if (Misc.getRandom(7) == 1) {
                    player.getPacketSender().sendMessage("Your Staff of the dead negated your runes for this cast.");
                    del = false;
                }
            }

            if (del) {
                let item: Item
                for (item of suppressedItems) {
                    if (item !== null) {
                        player.getInventory().deletes(item);
                    }
                }
            }
        }

        return true;
    }

}
