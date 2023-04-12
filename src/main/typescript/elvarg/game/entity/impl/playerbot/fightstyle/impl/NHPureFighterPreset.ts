import { CombatFactory } from "../../../../../content/combat/CombatFactory";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { CombatType } from "../../../../../content/combat/CombatType";
import { CombatSpells } from "../../../../../content/combat/magic/CombatSpells";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { AttackStyleSwitch } from "../AttackStyleSwitch";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { EnemyDefenseAwareCombatSwitch } from "../EnemyDefenseAwareCombatSwitch";
import { TribridMaxFighterPreset } from "./TribridMaxFighterPreset";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { PrayerData } from "../../../../../content/PrayerHandler";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { MovementQueue } from "../../../../../model/movement/MovementQueue";

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

class PureCombatAction implements CombatAction {
    constructor(private readonly execFunc: Function, private readonly execShould: Function){
    }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return this.execShould();
    }
    perform(playerBot: PlayerBot, enemy: Mobile) {
        this.execFunc();
    }
    stopAfter(): boolean {
        return false;
    }

}

export class NHPureFighterPreset implements FighterPreset {
    eatAtPercent(): number {
        return 40;
    }
    public static readonly BOT_NH_PURE_83 = new Presetable("BOT NH Pure",
        [
            new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.BLACK_DHIDE_CHAPS), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_STRENGTH_4_),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.GRANITE_MAUL), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 75), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY),
            new Item(ItemIdentifiers.WATER_RUNE, 1000), new Item(ItemIdentifiers.BLOOD_RUNE, 1000), new Item(ItemIdentifiers.DEATH_RUNE, 1000), new Item(ItemIdentifiers.ANGLERFISH)
        ],
        [new Item(ItemIdentifiers.GHOSTLY_HOOD), new Item(ItemIdentifiers.ZAMORAK_CAPE), new Item(ItemIdentifiers.MAGIC_SHORTBOW), new Item(ItemIdentifiers.AMULET_OF_GLORY), new Item(ItemIdentifiers.GHOSTLY_ROBE), null, new Item(ItemIdentifiers.GHOSTLY_ROBE_2), new Item(ItemIdentifiers.MITHRIL_GLOVES), new Item(ItemIdentifiers.CLIMBING_BOOTS), new Item(ItemIdentifiers.RING_OF_RECOIL), new Item(ItemIdentifiers.RUNE_ARROW, 175),],
        /* atk, def, str, hp, range, pray, mage */
        [60, 1, 85, 99, 99, 1, 99],
        MagicSpellbook.ANCIENT,
        true
    );
    public static readonly COMBAT_ACTIONS: CombatAction[] = [
        new PureCombatSwitch([ItemIdentifiers.GRANITE_MAUL, ItemIdentifiers.BLACK_DHIDE_CHAPS], (playerBot, enemy) => {
            return playerBot.getSpecialPercentage() >= 50 && playerBot.getMovementQueue().getMobility().canMove() &&
                enemy.getHitpointsAfterPendingDamage() <= 45;
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            playerBot.getCombat().attack(enemy);
            CombatSpecial.activate(playerBot);
        }),
        new PureCombatSwitch([ItemIdentifiers.RING_OF_RECOIL], (playerBot, enemy) => {
            const hasRing = playerBot.getInventory().contains(ItemIdentifiers.RING_OF_RECOIL);
            return hasRing && !playerBot.getEquipment().contains(ItemIdentifiers.RING_OF_RECOIL);
        }, (playerBot: PlayerBot, enemy: Mobile) => { playerBot.getCombat().attack(enemy); }),
        new PureCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            return playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 1
                && !enemy.getMovementQueue().getMobility().canMove()
                && playerBot.calculateDistance(enemy) === 1
                && CombatFactory.canReach(enemy, CombatFactory.getMethod(enemy), playerBot);
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            if (playerBot.getMovementQueue().size() > 0) {
                return;
            }
            playerBot.setFollowing(null);
            MovementQueue.randomClippedStepNotSouth(playerBot, 3);
        }),
        new PureCombatSwitch([ItemIdentifiers.ZAMORAK_CAPE, ItemIdentifiers.GHOSTLY_ROBE_2, ItemIdentifiers.GHOSTLY_ROBE], (playerBot: PlayerBot, enemy: Mobile) => {
            // Freeze the player if they can move
            return enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY)
                && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
            playerBot.getCombat().attack(enemy);
        }),
        new PureCombatSwitch([ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers.DRAGON_BOLTS_E_, ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers.BLACK_DHIDE_CHAPS], (playerBot, enemy) => {
            return enemy.getHitpoints() < 40;
        }, (playerBot: PlayerBot, enemy: Mobile) => { playerBot.getCombat().attack(enemy); }),

        new EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch(
                CombatType.MAGIC,
                new PureCombatSwitch([ItemIdentifiers.ZAMORAK_CAPE, ItemIdentifiers.GHOSTLY_ROBE_2, ItemIdentifiers.GHOSTLY_ROBE],
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
                    },
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                        playerBot.getCombat().attack(enemy);
                    }
                )
            ),
            new AttackStyleSwitch(
                CombatType.RANGED,
                new PureCombatSwitch([ItemIdentifiers.MAGIC_SHORTBOW, ItemIdentifiers.RUNE_ARROW, ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers.BLACK_DHIDE_CHAPS],
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        return true;
                    },
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        playerBot.setSpecialActivated(false);
                        playerBot.getCombat().attack(enemy);
                    }
                )
            ),
        ],
            (playerBot: PlayerBot, enemy: Mobile) => {
                return true;
            })
    ]

    getItemPreset(): Presetable {
        return NHPureFighterPreset.BOT_NH_PURE_83;
    }

    getCombatActions(): CombatAction[] {
        return NHPureFighterPreset.COMBAT_ACTIONS;
    }
}