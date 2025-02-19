import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { PrayerData } from "../../../../../content/PrayerHandler";

class DragonDaggerCombatSwitch extends CombatSwitch {
    constructor(switchItemIds: number[], private readonly execFunc: Function) {
        super(switchItemIds);
    }

    public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
        this.execFunc();
    }

}

export class DDSPureRFighterPreset implements FighterPreset {

    public BOT_DDS_PURE_R_73: Presetable = new Presetable("DDS Pure (R)",
        [
            new Item(ItemIdentifiers.RUNE_CROSSBOW),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75),
            new Item(ItemIdentifiers.RANGING_POTION_4_),
            new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.ANGLERFISH)
        ],


        [
            new Item(ItemIdentifiers.COIF),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR),
            new Item(ItemIdentifiers.MAGIC_SHORTBOW),
            new Item(ItemIdentifiers.AMULET_OF_GLORY),
            new Item(ItemIdentifiers.LEATHER_BODY),
            null,
            new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS),
            new Item(ItemIdentifiers.MITHRIL_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.RUNE_ARROW, 75)
        ],
        [60, 1, 99, 85, 99, 1, 1],
        MagicSpellbook.NORMAL,
        true
    )

    public COMBAT_ACTIONS: CombatAction[] = [
        new DragonDaggerCombatSwitch([ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_], (playerBot: PlayerBot, enemy: Mobile) => {
            const shouldPerform = playerBot.getSpecialPercentage() >= 25 && enemy.getHitpoints() < 45;
            if (shouldPerform) {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        }),
        new DragonDaggerCombatSwitch([ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers.DRAGON_BOLTS_E_], (playerBot: PlayerBot, enemy: Mobile) => {
            const shouldPerform = enemy.getHitpoints() < 40;
            if (shouldPerform) {
                playerBot.getCombat().attack(enemy);
            }
        }),
        new DragonDaggerCombatSwitch([ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers.RUNE_ARROW], (playerBot: PlayerBot, enemy: Mobile) => {
            playerBot.setSpecialActivated(false);
            playerBot.getCombat().attack(enemy);
        }),
    ];

    getItemPreset(): Presetable {
        return this.BOT_DDS_PURE_R_73;
    };

    getCombatActions(): CombatAction[] {
        return this.COMBAT_ACTIONS;
    };

    eatAtPercent(): number {
        return 40;
    }
}