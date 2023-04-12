import { PrayerData, PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { ItemInSlot } from "../../../../../model/ItemInSlot";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";

class PureCombatSwitch extends CombatSwitch {
    constructor(switchItemIds: number[], private readonly execFunc: Function, private readonly execShound: Function, prayerData?: PrayerData[]) {
        super(switchItemIds, prayerData)
    }

    shouldPerform(): boolean {
        return this.execFunc();
    }

    public performAfterSwitch(): void {
        this.execShound()
    }

}

export class ObbyMaulerFighterPreset implements FighterPreset {
    eatAtPercent
    private static readonly BOT_OBBY_MAULER_57 = new Presetable(
        "Obby Mauler",
        [
            new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.RANGING_POTION_4_),
            new Item(ItemIdentifiers.MAGIC_SHORTBOW),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.BERSERKER_NECKLACE),
            new Item(ItemIdentifiers.FIRE_CAPE),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.TZHAAR_KET_OM),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.ANGLERFISH),
        ],
        [
            new Item(ItemIdentifiers.COIF),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR),
            new Item(ItemIdentifiers.MAGIC_SHORTBOW),
            new Item(ItemIdentifiers.RUNE_ARROW, 200),
            new Item(ItemIdentifiers.AMULET_OF_GLORY),
            new Item(ItemIdentifiers.LEATHER_BODY),
            new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS),
            new Item(ItemIdentifiers.MITHRIL_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
        ],
        [1, 1, 99, 80, 70, 13, 1],
        MagicSpellbook.NORMAL,
        true
    );

    public static readonly COMBAT_ACTIONS = [
        new PureCombatSwitch([ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers.RUNE_ARROW, ItemIdentifiers.AVAS_ACCUMULATOR], (playerBot: PlayerBot, enemy: Mobile) => {
            return (
                playerBot.getSpecialPercentage() >= 55 &&
                (!enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MISSILES] &&
                    enemy.getHitpointsAfterPendingDamage() < 40)
            );
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            if (!playerBot.isSpecialActivated()) {
                CombatSpecial.activate(playerBot);
            }
            playerBot.getCombat().attack(enemy);
        }, [PrayerData.SHARP_EYE]),
        new PureCombatSwitch([ItemIdentifiers.TZHAAR_KET_OM, ItemIdentifiers.BERSERKER_NECKLACE, ItemIdentifiers.FIRE_CAPE], (playerBot: PlayerBot, enemy: Mobile) => {
            const canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() < 38;
        }, (playerBot: PlayerBot, enemy: Mobile) => { playerBot.getCombat().attack(enemy); }, [PrayerData.SUPERHUMAN_STRENGTH]),
        new PureCombatSwitch([ItemIdentifiers.RING_OF_RECOIL], (playerBot: PlayerBot, enemy: Mobile) => {
            const hasRing = ItemInSlot.getFromInventory(ItemIdentifiers.RING_OF_RECOIL, playerBot.getInventory()) != null;
            return hasRing && playerBot.getEquipment().getById(ItemIdentifiers.RING_OF_RECOIL) == null;
        }, (playerBot: PlayerBot, enemy: Mobile) => { playerBot.getCombat().attack(enemy); }),
        new PureCombatSwitch([ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers.RUNE_ARROW, ItemIdentifiers.AVAS_ACCUMULATOR], (playerBot: PlayerBot, enemy: Mobile) => { return true; }, (playerBot: PlayerBot, enemy: Mobile) => { playerBot.getCombat().attack(enemy); }, [PrayerData.SHARP_EYE]),
    ];

    getItemPreset(): Presetable {
        return ObbyMaulerFighterPreset.BOT_OBBY_MAULER_57;
    }

    getCombatActions(): CombatAction[] {
        return ObbyMaulerFighterPreset.COMBAT_ACTIONS;
    }
}
