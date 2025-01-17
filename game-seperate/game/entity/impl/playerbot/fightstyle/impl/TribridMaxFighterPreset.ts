import { GameConstants } from "../../../../../GameConstants";
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
import { TeleportHandler } from "../../../../../model/teleportation/TeleportHandler";
import { TeleportType } from "../../../../../model/teleportation/TeleportType";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { TimerKey } from "../../../../../../util/timers/TimerKey";

class TribridCombatSwitch extends CombatSwitch {
    constructor(n1: number[], private readonly execFunc: Function, private readonly execShoud: Function, pd: PrayerData[]) {
        super(n1);
    }

    shouldPerform(): boolean {
        return this.execFunc();
    }

    public performAfterSwitch(): void {
        this.execShoud();
    }

}

class PureCombatAction implements CombatAction {
    constructor(private readonly execFunc: Function, private readonly execShould: Function) {
    }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return this.execFunc();
    }
    perform(playerBot: PlayerBot, enemy: Mobile) {
        this.execShould();
    }
    stopAfter(): boolean {
        return false;
    }

}

export class TribridMaxFighterPreset implements FighterPreset {
    private static BOT_HARD_TRIBRID: Presetable = new Presetable("Bot Tribrid",
        [
            new Item(ItemIdentifiers.ARMADYL_CROSSBOW), new Item(ItemIdentifiers.ARMADYL_GODSWORD), new Item(ItemIdentifiers.RANGING_POTION_4_), new Item(ItemIdentifiers.SUPER_COMBAT_POTION_4_),
            new Item(ItemIdentifiers.AVAS_ACCUMULATOR), new Item(ItemIdentifiers.KARILS_LEATHERSKIRT), new Item(ItemIdentifiers.KARILS_LEATHERTOP), new Item(ItemIdentifiers.SUPER_RESTORE_4_),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.COOKED_KARAMBWAN), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.COOKED_KARAMBWAN),
            new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.MANTA_RAY), new Item(ItemIdentifiers.ANGLERFISH),
            new Item(ItemIdentifiers.WATER_RUNE, 10000), new Item(ItemIdentifiers.BLOOD_RUNE, 10000), new Item(ItemIdentifiers.DEATH_RUNE, 10000), new Item(ItemIdentifiers.TELEPORT_TO_HOUSE, 1),
        ],
        [
            new Item(ItemIdentifiers.HELM_OF_NEITIZNOT),
            new Item(ItemIdentifiers.INFERNAL_CAPE),
            new Item(ItemIdentifiers.STAFF_OF_THE_DEAD),
            new Item(ItemIdentifiers.AMULET_OF_FURY),
            new Item(ItemIdentifiers.AHRIMS_ROBESKIRT),
            new Item(ItemIdentifiers.BLESSED_SPIRIT_SHIELD),
            new Item(ItemIdentifiers.AHRIMS_ROBETOP),
            new Item(ItemIdentifiers.BARROWS_GLOVES),
            new Item(ItemIdentifiers.CLIMBING_BOOTS),
            new Item(ItemIdentifiers.RING_OF_RECOIL),
            new Item(ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, 135),
        ],
        [99, 99, 99, 99, 99, 99, 99],
        MagicSpellbook.ANCIENT,
        true
    )
    public static COMBAT_ACTIONS: CombatAction[] = [
        new PureCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            const food = ItemInSlot.getFromInventory(ItemIdentifiers.MANTA_RAY, playerBot.getInventory());

            return food == null;
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            console.log("Escape");
            if (enemy.isPlayer()) {
                playerBot.sendChat(`Cya ${enemy.getAsPlayer().getUsername()}`);
            }
            if (TeleportHandler.checkReqs(playerBot, GameConstants.DEFAULT_LOCATION)) {
                TeleportHandler.teleport(playerBot, GameConstants.DEFAULT_LOCATION, TeleportType.TELE_TAB, false);
                playerBot.getInventory().deleteNumber(ItemIdentifiers.TELEPORT_TO_HOUSE, 1);
            }
        }),
        new PureCombatAction((playerBot: PlayerBot, enemy: Mobile) => { return true; }, (playerBot: PlayerBot, enemy: Mobile) => {
            const combatMethod = CombatFactory.getMethod(enemy);
            const combatType = combatMethod.type();

            const magicAccuracy = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_MAGIC]);

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
        new TribridCombatSwitch([ItemIdentifiers.ARMADYL_GODSWORD, ItemIdentifiers.INFERNAL_CAPE, ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers.KARILS_LEATHERTOP],
            (playerBot: PlayerBot, enemy: Mobile) => {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove()
                    && enemy.getHitpointsAfterPendingDamage() <= 49
                    && playerBot.getSpecialPercentage() >= 50
                    && !enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE];
            }, (playerBot: PlayerBot, enemy: Mobile) => {
                console.log("AGS Spec");
                playerBot.getCombat().setCastSpell(null);
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }, [PrayerData.PROTECT_ITEM, PrayerData.PIETY]),

        new PureCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            let combatMethod = CombatFactory.getMethod(enemy);
            let distance = playerBot.calculateDistance(enemy);

            let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 2;

            return cantAttack
                && playerBot.getMovementQueue().size() == 0
                && !enemy.getMovementQueue().getMobility().canMove()
                && distance == 1
                && CombatFactory.canReach(enemy, combatMethod, playerBot);
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            console.log("Retreat");
            playerBot.setFollowing(null);
            MovementQueue.randomClippedStepNotSouth(playerBot, 3);
        }),

        new PureCombatAction((playerBot: PlayerBot, enemy: Mobile) => {
            const inventory = playerBot.getInventory();
            const superRestorePotionIds = PotionConsumable.SUPER_RESTORE_POTIONS.getIds();
            for (let i = 0; i < superRestorePotionIds.length; i++) {
                const id = superRestorePotionIds[i];
                const item = ItemInSlot.getFromInventory(id, inventory);
                if (item !== null) {
                    const prayerLevel = playerBot.getSkillManager().getCurrentLevel(Skill.PRAYER);
                    if (prayerLevel < 50) {
                        return true;
                    }
                }
            }
            return false;
        }, (playerBot: PlayerBot, enemy: Mobile) => {
            console.log("Pot up");
            const inventory = playerBot.getInventory();
            const superRestorePotionIds = PotionConsumable.SUPER_RESTORE_POTIONS.getIds();
            for (let i = 0; i < superRestorePotionIds.length; i++) {
                const id = superRestorePotionIds[i];
                const item = ItemInSlot.getFromInventory(id, inventory);
                if (item !== null) {
                    PotionConsumable.drink(playerBot, item.getId(), item.getSlot());
                    break;
                }
            }
        }),

        new TribridCombatSwitch([ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers.AHRIMS_ROBETOP, ItemIdentifiers.AHRIMS_ROBESKIRT, ItemIdentifiers.BLESSED_SPIRIT_SHIELD, ItemIdentifiers.INFERNAL_CAPE],
            (playerBot: PlayerBot, enemy: Mobile) => {
                let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && enemy.getMovementQueue().getMobility().canMove() && !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) && CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
            }, (playerBot: PlayerBot, enemy: Mobile) => {
                console.log("Freeze");
                playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.getCombat().attack(enemy);
            }, [PrayerData.PROTECT_ITEM, PrayerData.AUGURY]),

        new EnemyDefenseAwareCombatSwitch([
            new AttackStyleSwitch(CombatType.MAGIC, new TribridCombatSwitch([ItemIdentifiers.STAFF_OF_THE_DEAD, ItemIdentifiers.AHRIMS_ROBETOP, ItemIdentifiers.AHRIMS_ROBESKIRT, ItemIdentifiers.BLESSED_SPIRIT_SHIELD, ItemIdentifiers.INFERNAL_CAPE], (playerBot: PlayerBot, enemy: Mobile) => { return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false); }, (playerBot: PlayerBot, enemy: Mobile) => {
                console.log("Magic");
                playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }, [PrayerData.PROTECT_ITEM, PrayerData.AUGURY])),
            new AttackStyleSwitch(CombatType.RANGED, new TribridCombatSwitch([ItemIdentifiers.ARMADYL_CROSSBOW, ItemIdentifiers.AVAS_ACCUMULATOR, ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers.KARILS_LEATHERTOP, ItemIdentifiers.BLESSED_SPIRIT_SHIELD], (playerBot: PlayerBot, enemy: Mobile) => { return true; }, (playerBot: PlayerBot, enemy: Mobile) => {
                console.log("Ranged");
                playerBot.getCombat().setCastSpell(null);
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }, [PrayerData.PROTECT_ITEM, PrayerData.RIGOUR])),
            new AttackStyleSwitch(CombatType.MELEE, new TribridCombatSwitch([ItemIdentifiers.ARMADYL_GODSWORD, ItemIdentifiers.INFERNAL_CAPE, ItemIdentifiers.KARILS_LEATHERSKIRT, ItemIdentifiers.KARILS_LEATHERTOP], (playerBot: PlayerBot, enemy: Mobile) => { return playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() <= 45; }, (playerBot: PlayerBot, enemy: Mobile) => {
                console.log("Melee");
                playerBot.getCombat().setCastSpell(null);
                playerBot.getCombat().attack(enemy);
            }, [PrayerData.PROTECT_ITEM, PrayerData.PIETY]))
        ], (playerBot: PlayerBot, enemy: Mobile) => {
            let canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
            return canAttackNextTick;
        })

    ];

    public getItemPreset(): Presetable {
        return TribridMaxFighterPreset.BOT_HARD_TRIBRID;
    }

    public getCombatActions(): CombatAction[] {
        return TribridMaxFighterPreset.COMBAT_ACTIONS;
    }

    public eatAtPercent(): number {
        return 62;
    }
}