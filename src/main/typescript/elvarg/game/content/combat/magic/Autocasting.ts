

import { CombatSpells } from "./CombatSpells";
import { Player } from "../../../entity/impl/player/Player";
import { MagicSpellbook } from "../../../model/MagicSpellbook";
import { FightType } from "../FightType";
import { Skill } from "../../../model/Skill";
import { ItemIdentifiers } from "../../../../util/ItemIdentifiers";
import { BonusManager } from "../../../model/equipment/BonusManager";
import { WeaponInterfaces } from "../WeaponInterfaces";
import { CombatSpell } from "./CombatSpell";
import { Spell } from "./Spell";




export class Autocasting {



    // Autocast buttons
    private static readonly REGULAR_AUTOCAST_BUTTON = 349;
    private static readonly DEFENSIVE_AUTOCAST_BUTTON = 24111;
    private static readonly CLOSE_REGULAR_AUTOCAST_BUTTON = 2004;
    private static readonly CLOSE_ANCIENT_AUTOCAST_BUTTON = 6161;
    private static readonly REGULAR_AUTOCAST_TAB = 1829;
    private static readonly ANCIENT_AUTOCAST_TAB = 1689;
    private static readonly IBANS_AUTOCAST_TAB = 12050;

    public static readonly ANCIENT_SPELL_AUTOCAST_STAFFS = new Set<number>([ItemIdentifiers.KODAI_WAND, ItemIdentifiers.MASTER_WAND,
    ItemIdentifiers.ANCIENT_STAFF, ItemIdentifiers.NIGHTMARE_STAFF, ItemIdentifiers.VOLATILE_NIGHTMARE_STAFF, ItemIdentifiers.ELDRITCH_NIGHTMARE_STAFF, ItemIdentifiers.TOXIC_STAFF_OF_THE_DEAD, ItemIdentifiers.ELDER_WAND, ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers.STAFF_OF_LIGHT]);

    public static readonly AUTOCAST_SPELLS = new Map<number, CombatSpell>();



    static {
        // Modern
        Autocasting.AUTOCAST_SPELLS.set(1830, CombatSpells.WIND_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1831, CombatSpells.WATER_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1832, CombatSpells.EARTH_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1833, CombatSpells.FIRE_STRIKE);
        Autocasting.AUTOCAST_SPELLS.set(1834, CombatSpells.WIND_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1835, CombatSpells.WATER_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1836, CombatSpells.EARTH_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1837, CombatSpells.FIRE_BOLT);
        Autocasting.AUTOCAST_SPELLS.set(1838, CombatSpells.WIND_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1839, CombatSpells.WATER_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1840, CombatSpells.EARTH_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1841, CombatSpells.FIRE_BLAST);
        Autocasting.AUTOCAST_SPELLS.set(1842, CombatSpells.WIND_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1843, CombatSpells.WATER_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1844, CombatSpells.EARTH_WAVE);
        Autocasting.AUTOCAST_SPELLS.set(1845, CombatSpells.FIRE_WAVE);
        // Ancients
        Autocasting.AUTOCAST_SPELLS.set(13189, CombatSpells.SMOKE_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13241, CombatSpells.SHADOW_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13247, CombatSpells.BLOOD_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(6162, CombatSpells.ICE_RUSH);
        Autocasting.AUTOCAST_SPELLS.set(13215, CombatSpells.SMOKE_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13267, CombatSpells.SHADOW_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13167, CombatSpells.BLOOD_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13125, CombatSpells.ICE_BURST);
        Autocasting.AUTOCAST_SPELLS.set(13202, CombatSpells.SMOKE_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13254, CombatSpells.SHADOW_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13158, CombatSpells.BLOOD_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13114, CombatSpells.ICE_BLITZ);
        Autocasting.AUTOCAST_SPELLS.set(13228, CombatSpells.SMOKE_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13280, CombatSpells.SHADOW_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13178, CombatSpells.BLOOD_BARRAGE);
        Autocasting.AUTOCAST_SPELLS.set(13136, CombatSpells.ICE_BARRAGE);
        

    }

    public static handleAutocastTab(player: Player, actionButtonId: number) {
        if (Autocasting.AUTOCAST_SPELLS.has(actionButtonId)) {
            Autocasting.setAutocast(player, Autocasting.AUTOCAST_SPELLS.get(actionButtonId).getSpell());
            WeaponInterfaces.assign(player);
            return true;
        }
        switch (actionButtonId) {
            case Autocasting.CLOSE_REGULAR_AUTOCAST_BUTTON:
            case Autocasting.CLOSE_ANCIENT_AUTOCAST_BUTTON:
                Autocasting.setAutocast(player, null); // When clicking cancel, remove autocast?
                player.getPacketSender().sendTabInterface(0, player.getWeapon().getInterfaceId());
                return true;
        }

        return false;
    }

    public static handleWeaponInterface(player: Player, actionButtonId: number) {
        if (actionButtonId != Autocasting.REGULAR_AUTOCAST_BUTTON && actionButtonId != Autocasting.DEFENSIVE_AUTOCAST_BUTTON) {
            return false;
        }
        if (player.getSpellbook() == MagicSpellbook.LUNAR) {
            player.getPacketSender().sendMessage("You can't autocast lunar spells.");
            return true;
        }

        if (!player.getEquipment().hasStaffEquipped()) {
            return true;
        }

        switch (player.getSpellbook()) {
            case MagicSpellbook.ANCIENT:
                if (!Autocasting.ANCIENT_SPELL_AUTOCAST_STAFFS.has(player.getEquipment().getWeapon().getId()) && player.getEquipment().getWeapon().getId() != ItemIdentifiers.AHRIMS_STAFF) {
                    // Ensure this is a staff capable of casting ancients. Ahrims staff can cast both regular and ancients.
                    player.getPacketSender().sendMessage("You can only autocast regular offensive spells with this staff.");
                    return true;
                }

                player.getPacketSender().sendTabInterface(0, Autocasting.ANCIENT_AUTOCAST_TAB);
                break;
            case MagicSpellbook.NORMAL:
                if (player.getEquipment().getWeapon().getId() == ItemIdentifiers.ANCIENT_STAFF) {
                    player.getPacketSender().sendMessage("You can only autocast ancient magicks with that.");
                    return true;
                }

                player.getPacketSender().sendTabInterface(0, Autocasting.REGULAR_AUTOCAST_TAB);
                break;
        }

        player.getPacketSender().sendMessage("You can set a default autocast spell any time from the magic tab.");
        return true;
    }

    public static toggleAutocast(player: Player, actionButtonId: number) {
        let cbSpell = CombatSpells.getCombatSpell(actionButtonId);
        if (!cbSpell) {
            return false;
        }
        if (cbSpell.levelRequired() > player.getSkillManager().getCurrentLevel(Skill.MAGIC)) {
            player.getPacketSender().sendMessage("You need a Magic level of at least " + cbSpell.levelRequired() + " to cast this spell.");
            Autocasting.setAutocast(player, null);
            return true;
        }
        if (player.getCombat().getAutocastSpell() != null && player.getCombat().getAutocastSpell() == cbSpell) {

            //Player is already autocasting this spell. Turn it off.
            Autocasting.setAutocast(player, null);

        } else {

            //Set the new autocast spell
            Autocasting.setAutocast(player, cbSpell);

        }

        return true;
    }

    public static setAutocast(player: Player, spell: CombatSpell) {
        // First, set the Player's preferred autocast spell
        player.getCombat().setAutocastSpell(spell);

        if (!player.getEquipment().hasStaffEquipped() && spell != null) {
            player.getPacketSender().sendMessage("Default spell set. Please equip a staff to use autocast.");
            return;
        }

        if (spell == null) {
            player.getPacketSender().sendAutocastId(-1).sendConfig(108, 3);
        } else {
            player.getPacketSender().sendAutocastId(spell.spellId()).sendConfig(108, 1);
        }

        BonusManager.update(player);
        Autocasting.updateConfigsOnAutocast(player, spell != null);
    }

    private static readonly STAFF_FIGHT_TYPES: FightType[] = [
        FightType.STAFF_BASH,
        FightType.STAFF_FOCUS,
        FightType.STAFF_POUND
    ];

    private static updateConfigsOnAutocast(player: Player, autocast: boolean) {
        if (autocast) {
            for (let type of Autocasting.STAFF_FIGHT_TYPES) {
                player.getPacketSender().sendConfig(FightType.getParentId(), 3);
            }
        }
    }




}