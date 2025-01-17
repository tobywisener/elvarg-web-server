import { Player } from "../../entity/impl/player/Player";
import { GameConstants } from "../../GameConstants";
import { Presetable } from "./Presetable";
import { Skill } from "../../model/Skill";
import { WildernessArea } from "../../model/areas/impl/WildernessArea";
import { CombatFactory } from "../combat/CombatFactory";
import { PredefinedPresets } from './PredefinedPresets'
import { F2PMeleeFighterPreset } from "../../entity/impl/playerbot/fightstyle/impl/F2PMeleeFighterPreset";
import { PlayerBot } from "../../entity/impl/playerbot/PlayerBot";
import { PlayerRights } from "../../model/rights/PlayerRights";
import { Bank } from "../../model/container/impl/Bank";
import { Item } from "../../model/Item";
import { Autocasting } from "../combat/magic/Autocasting";
import { SkillManager } from "../skill/SkillManager";
import { BountyHunter } from "../combat/bountyhunter/BountyHunter";
import { Misc } from "../../../util/Misc";
import { PrayerHandler, PrayerData } from "../PrayerHandler";
import { CombatSpecial } from "../combat/CombatSpecial";
import { Flag } from "../../model/Flag";
import { EnteredSyntaxAction } from "../../model/EnteredSyntaxAction";

class PreseEntered implements EnteredSyntaxAction{
    constructor(private readonly execFunc: Function){

    }
    execute(syntax: string): void {
    this.execFunc();
    }

}

export class Presetables {
    /**
     * The max amount of premade/custom presets.
     */
    public static MAX_PRESETS = 10;

    /**
     * The presets interface id.
     */
    private static INTERFACE_ID = 45000;

    /**
     * Pre-made sets by the server which everyone can use.
     */
    public static GLOBAL_PRESETS: Presetable[] = [
        PredefinedPresets.OBBY_MAULER_57,
        PredefinedPresets.G_MAULER_70,
        PredefinedPresets.DDS_PURE_M_73,
        PredefinedPresets.DDS_PURE_R_73,
        PredefinedPresets.NH_PURE_83,
        F2PMeleeFighterPreset.PRESETABLE,
        PredefinedPresets.ATT_70_ZERKER_97,
        PredefinedPresets.MAIN_RUNE_126,
        PredefinedPresets.MAIN_HYBRID_126,
        PredefinedPresets.MAIN_TRIBRID_126,
    ];

    /**
     * Opens the presets interface for a player.
     * 
     * @param player
     */
    public static opens(player: Player) {
        Presetables.open(player, player.getCurrentPreset());
    }

    public static open(player: Player, preset: Presetable) {
        if (preset) {
            // Send name
            player.getPacketSender().sendString("Presets - " + preset.getName(), 45002);

            // Send stats
            player.getPacketSender().sendString(preset.getStats()[3].toString(), 45007); // Hitpoints
            player.getPacketSender().sendString(preset.getStats()[0].toString(), 45008); // Attack
            player.getPacketSender().sendString(preset.getStats()[2].toString(), 45009); // Strength
            player.getPacketSender().sendString(preset.getStats()[1].toString(), 45010); // Defence
            player.getPacketSender().sendString(preset.getStats()[4].toString(), 45011); // Ranged
            player.getPacketSender().sendString(preset.getStats()[5].toString(), 45012); // Prayer
            player.getPacketSender().sendString(preset.getStats()[6].toString(), 45013); // Magic

            // Send spellbook
            player.getPacketSender().sendString(
                "@yel@" + preset.getSpellbook().toString().toLowerCase(), 45014);

        } else {
            // Reset name
            player.getPacketSender().sendString("Presets", 45002);

            // Reset stats
            for (let i = 0; i <= 6; i++) {
                player.getPacketSender().sendString( "", 45007 + i);
            }

            // Reset spellbook
            player.getPacketSender().sendString("", 45014);

        }

        // Send inventory
        for (let i = 0; i < 28; i++) {
            // Get item..
            let item = null;
            if (preset) {
                if (i < preset.getInventory().length) {
                    item = preset.getInventory()[i];
                }
            }

            // If it isn't null, send it. Otherwise, send empty slot.
            if (item) {
                player.getPacketSender().sendItemOnInterfaces(45015 + i, item.getId(), item.getAmount());
            } else {
                player.getPacketSender().sendItemOnInterfaces(45015 + i, -1, 1);
            }
        }
        for (let i = 0; i < 14; i++) {
            player.getPacketSender().sendItemOnInterfaces(45044 + i, -1, 1);
        }

        if (preset) {
            preset.getEquipment().filter(t => t && t.isValid())
                .forEach(t => player.getPacketSender().sendItemOnInterfaces(
                    45044 + t.getDefinition().getEquipmentType().getSlot(), t.getId(), t.getAmount()));
        }

        // Send all available global presets
        for (let i = 0; i < Presetables.MAX_PRESETS; i++) {
            player.getPacketSender().sendString(
                Presetables.GLOBAL_PRESETS[i] == null ? "Empty" : Presetables.GLOBAL_PRESETS[i].getName(), 45070 + i);
        }

        // Send all available player presets
        for (let i = 0; i < Presetables.MAX_PRESETS; i++) {
            player.getPacketSender().sendString(
                player.getPresets()[i] == null ? "Empty" : player.getPresets()[i].getName(), 45082 + i);
        }

        // Send on death toggle
        player.getPacketSender().sendConfig(987, player.isOpenPresetsOnDeath() ? 0 : 1);

        // Send interface
        player.getPacketSender().sendInterface(Presetables.INTERFACE_ID);

        // Update current preset
        player.setCurrentPreset(preset);
    }

    private static loadoutToPreset(name: string, player: Player) {
        return new Presetable(name,
            player.getInventory().getItems().slice(),
            player.getEquipment().getItems().slice(),
            /* atk, def, str, hp, range, pray, mage */
            [
                player.getSkillManager().getMaxLevel(Skill.ATTACK),
                player.getSkillManager().getMaxLevel(Skill.DEFENCE),
                player.getSkillManager().getMaxLevel(Skill.STRENGTH),
                player.getSkillManager().getMaxLevel(Skill.HITPOINTS),
                player.getSkillManager().getMaxLevel(Skill.RANGED),
                player.getSkillManager().getMaxLevel(Skill.PRAYER),
                player.getSkillManager().getMaxLevel(Skill.MAGIC),
            ],
            player.getSpellbook(),
            false
        );
    }

    private static edit(player: Player, index: number) {
        // Check if we can edit..
        if (player.getArea() instanceof WildernessArea) {
            player.getPacketSender().sendMessage("You can't edit a preset in the wilderness!");
            return;
        }
        if (player.getDueling().inDuel()) {
            player.getPacketSender().sendMessage("You can't edit a preset during a duel!");
            return;
        }
        if (CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }
        if (!player.getPresets()[index]) {
            player.getPacketSender().sendMessage("This preset cannot be edited.");
            return;
        }
    }

    public static load(player: Player, preset: Presetable) {
        let oldCbLevel = player.getSkillManager().getCombatLevel();

        // Close!
        player.getPacketSender().sendInterfaceRemoval();

        // Check if we can load...
        if (player.getArea() instanceof WildernessArea) {
            if (!(player instanceof PlayerBot) && player.getRights() !== PlayerRights.DEVELOPER) {
                player.getPacketSender().sendMessage("You can't load a preset in the wilderness!");
                return;
            }
        }
        if (player.getDueling().inDuel()) {
            player.getPacketSender().sendMessage("You can't load a preset during a duel!");
            return;
        }

        // Send valuable items in inventory/equipment to bank
        let sent = false;
        let items = [...player.getInventory().getCopiedItems(), ...player.getEquipment().getCopiedItems()]
        for (let item of items) {
            if (!item.isValid()) {
                continue;
            }
            let spawnable = [...GameConstants.ALLOWED_SPAWNS].includes(item.getId());
            if (!spawnable) {
                player.getBank(Bank.getTabForItem(player, item.getId())).add(item, false);
                sent = true;
            }
        }
        if (sent) {
            player.getPacketSender().sendMessage("The non-spawnable items you had on you have been sent to your bank.");
        }

        player.getInventory().resetItems().refreshItems();
        player.getEquipment().resetItems().refreshItems();

        if (!preset.getIsGlobal()) {
            let nonSpawnables = new Array<Item>();
            // Get all the valuable items in this preset and check if player has them..
            let items = [...preset.getInventory(), ...preset.getEquipment()]
            for (let item of items) {
                if (!item)
                    continue;

                let spawnable = [...GameConstants.ALLOWED_SPAWNS].includes(item.getId());

                if (!spawnable) {
                    nonSpawnables.push(item);

                    let inventoryAmt = player.getInventory().getAmount(item.getId());
                    let equipmentAmt = player.getEquipment().getAmount(item.getId());
                    let bankAmt = player.getBank(Bank.getTabForItem(player, item.getId())).getAmount(item.getId());
                    let totalAmt = inventoryAmt + equipmentAmt + bankAmt;

                    let preset_amt = preset.getAmount(item.getId());

                    if (totalAmt < preset_amt) {
                        player.getPacketSender().sendMessage("You don't have the non-spawnable item " + item.getDefinition().getName() + " in your inventory, equipment or bank.");
                        return;
                    }
                }
            }

            // Delete valuable items from the proper place
            // Not from inventory/equipment, they will be reset anyway.
            for (let item of nonSpawnables) {
                if (player.getInventory().containsItem(item)) {
                    player.getInventory().deletes(item);
                } else if (player.getEquipment().containsItem(item)) {
                    player.getEquipment().deletes(item);
                } else {
                    player.getBank(Bank.getTabForItem(player, item.getId())).deletes(item);
                }
            }

            Misc.concat(preset.getInventory(), preset.getEquipment()).filter(t => t != null && t.isValid())
            .forEach(t => player.getInventory().addItem(t))

            Misc.concat(preset.getEquipment(), preset.getEquipment()).filter(t => t != null && t.isValid())
            .forEach(t => player.getEquipment().setItem(t.getDefinition().getEquipmentType().getSlot(), t.clone()))

            player.setSpellbook(preset.getSpellbook())
            Autocasting.setAutocast(player, null)

            let totalExp = 0
            for (let i = 0; i < preset.getStats().length; i++) {
                let skill = Skill[i];
                let level = preset.getStats()[i]
                let exp = SkillManager.getExperienceForLevel(level)
                player.getSkillManager().setCurrentLevels(skill, level).setMaxLevel(skill, level).setExperience(skill, exp)
                totalExp += exp
            }

            player.getPacketSender().sendString( player.getSkillManager().getCurrentLevel(Skill.PRAYER) + "/" + player.getSkillManager().getMaxLevel(Skill.PRAYER),687)

            let newCbLevel = player.getSkillManager().getCombatLevel()
            let combatLevel = "Combat level: " + newCbLevel
            player.getPacketSender().sendString(combatLevel, 19000).sendString(combatLevel, 5858)

            if (newCbLevel != oldCbLevel) {
                BountyHunter.unassign(player)
            }

            player.getPacketSender().sendTabInterface(6, player.getSpellbook().getInterfaceId())
            player.getPacketSender().sendConfig(709, PrayerHandler.canUse(player, PrayerData.PRESERVE, false) ? 1 : 0)
            player.getPacketSender().sendConfig(711, PrayerHandler.canUse(player, PrayerData.RIGOUR, false) ? 1 : 0);
            player.getPacketSender().sendConfig(713, PrayerHandler.canUse(player, PrayerData.AUGURY, false) ? 1 : 0);
            player.resetAttributes();
            player.getPacketSender().sendMessage("Preset loaded!");
            player.getPacketSender().sendTotalExp(totalExp);

            // Restore special attack
            player.setSpecialPercentage(100);
            CombatSpecial.updateBar(player);

            player.getUpdateFlag().flag(Flag.APPEARANCE);
        }
    }

    public static handleButton(player: Player, button: number) {
        if (player.getInterfaceId() != this.INTERFACE_ID && !(player instanceof PlayerBot)) {
            return false;
        }

        switch (button) {
            case 45060: // Toggle on death show
                player.setOpenPresetsOnDeath(!player.isOpenPresetsOnDeath());
                player.getPacketSender().sendConfig(987, player.isOpenPresetsOnDeath() ? 0 : 1);
                return true;

            case 45061: // Edit preset
                let currentPreset = player.getCurrentPreset();
                if (currentPreset != null && currentPreset.getIsGlobal()) {
                    player.getPacketSender().sendMessage("You can't edit this preset!");
                }

                player.setEnteredSyntaxAction(new PreseEntered((input) => {
                    input = Misc.formatText(input);
 
                    if (!Misc.isValidName(input)) {
                        player.getPacketSender().sendMessage("Invalid name for preset. Please enter characters only.");
                        player.setCurrentPreset(null);
                        this.opens(player);
                        return;
                    }

                    let changeIndex = -1;
                    for (let i = 0; i < player.getPresets().length; i++) {
                        if (player.getPresets()[i] == player.getCurrentPreset()) {
                            changeIndex = i;
                            break;
                        }
                    }

                    if (changeIndex == -1) {
                        player.getPacketSender().sendMessage("You don't have free space left!!");
                        return;
                    }

                    let preset = this.loadoutToPreset(input, player);
                    player.getPresets()[changeIndex] = preset;
                    player.setCurrentPreset(player.getPresets()[changeIndex]);
                    this.load(player, player.getCurrentPreset());
                }));
                player.getPacketSender().sendEnterInputPrompt("How would you like to call your preset?");
                return true;

            case 45064: // Load preset
                if (player.getCurrentPreset() == null) {
                    player.getPacketSender().sendMessage("You haven't selected any preset yet.");
                    return true;
                }
                this.load(player, player.getCurrentPreset());
                return true;
        }

        if (button >= 45070 && button <= 45079) {
            const index = button - 45070;
            if (this.GLOBAL_PRESETS.length <= index || this.GLOBAL_PRESETS[index] == null) {
                player.getPacketSender().sendMessage("That preset is currently unavailable.");
                return true;
            }

            // Check if already in set, no need to re-open
            if (player.getCurrentPreset() != null && player.getCurrentPreset() === this.GLOBAL_PRESETS[index]) {
                return true;
            }

            this.open(player, this.GLOBAL_PRESETS[index]);
            return true;
        }

        // Custom presets selection
        if (button >= 45082 && button <= 45091) {
            const index = button - 45082;

            if (player.getPresets()[index] == null) {
                this.open(player, null);
                /*DialogueManager.start(player, 10);
                player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        if (option == 1) {
                            player.setEnteredSyntaxAction((input) => {
                                player.getPacketSender().sendInterfaceRemoval();
        
                                input = Misc.formatText(input);
        
                                if(!Misc.isValidName(input)) {
                                    player.getPacketSender().sendMessage("Invalid name for preset.");
                                    player.setCurrentPreset(null);
                                    Presetables.open(player);
                                    return;
                                }
        
                                if(player.getPresets()[index] == null) {
        
                                    //Get stats..
                                    int[] stats = new int[7];
                                    for(int i = 0; i < stats.length; i++) {
                                        stats[i] = player.getSkillManager().getMaxLevel(Skill.values()[i]);
                                    }
        
                                    Item[] inventory = player.getInventory().copyValidItemsArray();
                                    Item[] equipment = player.getEquipment().copyValidItemsArray();
                                    for(Item t : Misc.concat(inventory, equipment))
        {
                                        if(t.getDefinition().isNoted()) {
                                            player.getPacketSender().sendMessage("You cannot create presets which contain noted items.");
                                            return;
                                        }
                                    }
                                    player.getPresets()[index] = new Presetable(input, index, inventory, equipment,
                                            stats, player.getSpellbook(), false);
                                    player.setCurrentPreset(player.getPresets()[index]);

                                    Presetables.open(player);
                                }
                            });
                            player.getPacketSender().sendEnterInputPrompt("Enter a name for your preset below.");
                        } else {
                            player.getPacketSender().sendInterfaceRemoval();
                        }
                    }
                });*/
                return true;
            }

            // Check if already in set, no need to re-open
            if (player.getCurrentPreset() != null && player.getCurrentPreset() == player.getPresets()[index]) {
                return true;
            }

            this.open(player, player.getPresets()[index]);
        }
        return false;
    }
}
