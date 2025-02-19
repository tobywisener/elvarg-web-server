import { PotionConsumable } from "../../../../../content/PotionConsumable";
import { PrayerData, PrayerHandler } from "../../../../../content/PrayerHandler";
import { CombatFactory } from "../../../../../content/combat/CombatFactory";
import { CombatSpecial } from "../../../../../content/combat/CombatSpecial";
import { CombatType } from "../../../../../content/combat/CombatType";
import { CombatSpells } from "../../../../../content/combat/magic/CombatSpells";
import { CombatMethod } from "../../../../../content/combat/method/CombatMethod";
import { Presetable } from "../../../../../content/presets/Presetable";
import { Mobile } from "../../../Mobile";
import { PlayerBot } from "../../PlayerBot";
import { AttackStyleSwitch } from "../AttackStyleSwitch";
import { CombatAction } from "../CombatAction";
import { CombatSwitch } from "../CombatSwitch";
import { EnemyDefenseAwareCombatSwitch } from "../EnemyDefenseAwareCombatSwitch";
import { FighterPreset } from "../FighterPreset";
import { Item } from "../../../../../model/Item";
import { ItemInSlot } from "../../../../../model/ItemInSlot";
import { MagicSpellbook } from "../../../../../model/MagicSpellbook";
import { Skill } from "../../../../../model/Skill";
import { BonusManager } from "../../../../../model/equipment/BonusManager";
import { MovementQueue } from "../../../../../model/movement/MovementQueue";
import { RandomGen } from "../../../../../../util/RandomGen";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import {Misc} from "../../../../../../util/Misc";


class MidCombatSwitch extends CombatSwitch {
    constructor(
        switchItemIds: number[],
        private readonly execFunc: (playerBot: PlayerBot, enemy: Mobile) => void,
        prayerData?: PrayerData[]
    ) {
        super(switchItemIds, prayerData);
    }

    public shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        const canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
        return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
    }

    public performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
        this.execFunc(playerBot, enemy);
    }
}

class MidCombatAction implements CombatAction {
    constructor(private readonly execFunc: Function) {

    }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return true;
    }

    perform(playerBot: PlayerBot, enemy: Mobile) {
        this.execFunc(playerBot, enemy);
    }
    stopAfter(): boolean {
        return false;
    }
}



export class MidTribridMaxFighterPreset implements FighterPreset {
    getItemPreset(): Presetable {
        throw new Error("Method not implemented.");
    }
    getCombatActions(): CombatAction[] {
        throw new Error("Method not implemented.");
    }
    eatAtPercent(): number {
        throw new Error("Method not implemented.");
    }
    private static RANDOM = new RandomGen();
    public static BOT_MID_TRIBRID: Presetable = new Presetable("Mid Tribrid",
        [
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.BLACK_DHIDE_BODY), new Item(ItemIdentifiers.ABYSSAL_WHIP), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.RUNE_CROSSBOW), new Item(ItemIdentifiers.RUNE_PLATELEGS), new Item(ItemIdentifiers.DRAGON_DEFENDER), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_), new Item(ItemIdentifiers.SUPER_RESTORE_4_),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SUPER_COMBAT_POTION_4_),
            new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.SHARK), new Item(ItemIdentifiers.ANGLERFISH),
            new Item(ItemIdentifiers.WATER_RUNE, 6000), new Item(ItemIdentifiers.BLOOD_RUNE, 2000), new Item(ItemIdentifiers.DEATH_RUNE, 4000), new Item(ItemIdentifiers.RANGING_POTION_4_),
        ],
        [
            new Item(ItemIdentifiers.HELM_OF_NEITIZNOT),
            new Item(ItemIdentifiers.SARADOMIN_CAPE),
            new Item(ItemIdentifiers.MASTER_WAND),
            new Item(ItemIdentifiers.AMULET_OF_FURY),
            new Item(ItemIdentifiers.MYSTIC_ROBE_TOP),
            new Item(ItemIdentifiers.SPIRIT_SHIELD),
            new Item(ItemIdentifiers.MYSTIC_ROBE_BOTTOM),
            new Item(ItemIdentifiers.BARROWS_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.DRAGON_BOLTS_E_, 500),
        ],
        [99, 99, 99, 99, 99, 99, 99],
        MagicSpellbook.ANCIENT,
        true
    );

    public static COMBAT_ACTIONS: CombatAction[] = [
        // Slower
        new MidCombatAction(() => {
            return Misc.getRandom(4) != 2;
        }),

        // OverHead prayers
        new MidCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            var combatMethod = CombatFactory.getMethod(enemy);
            const magicAccuracy = enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_MAGIC];
            var combatType = combatMethod.type();
            if (!CombatFactory.canReach(enemy, combatMethod, playerBot) && magicAccuracy < 35) {
                PrayerHandler.activatePrayer(playerBot, PrayerData.SMITE);
                return;
            }

            if (combatType == CombatType.MELEE && CombatFactory.canReach(enemy, combatMethod, playerBot)) {
                PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MELEE);
                return;
            }

            if (combatType == CombatType.RANGED) {
                PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MISSILES);
            } else {
                PrayerHandler.activatePrayer(playerBot, PrayerData.PROTECT_FROM_MAGIC);
            }
        }),

        new MidCombatSwitch([/*switch item ids*/], (playerBot: PlayerBot, enemy: Mobile) => {
            // perform after switch code here
        }),

        new MidCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            var combatMethod = CombatFactory.getMethod(enemy);
            let distance = playerBot.calculateDistance(enemy);
            let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 2;
            return cantAttack
                && playerBot.getMovementQueue().size() == 0
                && !enemy.getMovementQueue().getMobility().canMove()
                && distance == 1
                && CombatFactory.canReach(enemy, combatMethod, playerBot);
        }),

        new MidCombatSwitch([ItemIdentifiers.MASTER_WAND, ItemIdentifiers.SARADOMIN_CAPE, ItemIdentifiers.MYSTIC_ROBE_TOP, ItemIdentifiers.MYSTIC_ROBE_BOTTOM, ItemIdentifiers.SPIRIT_SHIELD],
            (playerBot, enemy) => {
                const canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
                return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            }, [PrayerData.PROTECT_ITEM, PrayerData.MYSTIC_MIGHT]

        ),
        new EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch(
                CombatType.MAGIC,
                new MidCombatSwitch(
                    [ItemIdentifiers.MASTER_WAND, ItemIdentifiers.SARADOMIN_CAPE, ItemIdentifiers.MYSTIC_ROBE_TOP, ItemIdentifiers.MYSTIC_ROBE_BOTTOM, ItemIdentifiers.SPIRIT_SHIELD],
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                        playerBot.getCombat().attack(enemy);
                        return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
                    },
                    [PrayerData.PROTECT_ITEM, PrayerData.AUGURY]
                )
            ),
            new AttackStyleSwitch(
                CombatType.RANGED,
                new MidCombatSwitch(
                    [ItemIdentifiers.RUNE_CROSSBOW, ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers.RUNE_PLATELEGS, ItemIdentifiers.BLACK_DHIDE_BODY],
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        playerBot.getCombat().setCastSpell(null);
                        playerBot.setSpecialActivated(false);
                        playerBot.getCombat().attack(enemy);
                        return true;
                    }
                )
            ),
            new AttackStyleSwitch(
                CombatType.MELEE,
                new MidCombatSwitch(
                    [ItemIdentifiers.ABYSSAL_WHIP, ItemIdentifiers.DRAGON_DEFENDER],
                    (playerBot: PlayerBot, enemy: Mobile) => {
                        playerBot.getCombat().setCastSpell(null);
                        playerBot.getCombat().attack(enemy);
                        return playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() <= 45;
                    },
                    [PrayerData.PROTECT_ITEM, PrayerData.PIETY]
                )
            ),
        ], (playerBot: PlayerBot, enemy: Mobile) => {
            return playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
        })
    ]
}










