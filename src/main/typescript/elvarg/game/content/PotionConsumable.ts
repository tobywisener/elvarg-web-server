import { Sound } from "../Sound"
import { Sounds } from "../Sounds"
import { Player } from "../entity/impl/player/Player"
import { Animation } from "../model/Animation"
import { EffectTimer } from "../model/EffectTimer"
import { Item } from "../model/Item"
import { Skill } from "../model/Skill"
import { TimerKey } from "../../util/timers/TimerKey"

export class PotionConsumable {
    public static ANTIFIRE_POTIONS = new PotionConsumable([2452, 2454, 2456, 2458]);
    public static ANTIPOISON_POTIONS = new PotionConsumable([2448, 181, 183, 185]);
    public static COMBAT_POTIONS = new PotionConsumable([9739, 9741, 9743, 9745]);
    public static SUPER_COMBAT_POTIONS = new PotionConsumable([12695, 12697, 12699, 12701]);
    public static MAGIC_POTIONS = new PotionConsumable([3040, 3042, 3044, 3046]);
    public static SUPER_MAGIC_POTIONS = new PotionConsumable([11726, 11727, 11728, 11729]);

    private static VIAL: number = 229;


    onEffects (player: Player) {
        switch (this) {
            case PotionConsumable.ANTIFIRE_POTIONS:
                PotionConsumable.onAntifireEffect(player, 60 * 6);
                break;
            case PotionConsumable.ANTIPOISON_POTIONS:
                PotionConsumable.onAntipoisonEffect(player, 60 * 6);
                break;
            case PotionConsumable.COMBAT_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.ATTACK, BoostType.LOW);
                PotionConsumable.onBasicEffect(player, Skill.STRENGTH, BoostType.LOW);
                break;
            case PotionConsumable.SUPER_COMBAT_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.ATTACK, BoostType.SUPER);
                PotionConsumable.onBasicEffect(player, Skill.STRENGTH, BoostType.SUPER);
                PotionConsumable.onBasicEffect(player, Skill.DEFENCE, BoostType.SUPER);
                break;
            case PotionConsumable.MAGIC_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.MAGIC, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_MAGIC_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.MAGIC, BoostType.SUPER);
                break;
        }
    }

    public static DEFENCE_POTIONS = new PotionConsumable([2432, 133, 135, 137]);
    public static STRENGTH_POTIONS = new PotionConsumable([113, 115, 117, 119]);
    public static ATTACK_POTIONS = new PotionConsumable([2428, 121, 123, 125]);
    public static SUPER_DEFENCE_POTIONS = new PotionConsumable([2442, 163, 165, 167]);
    public static SUPER_ATTACK_POTIONS = new PotionConsumable([2436, 145, 147, 149]);
    public static SUPER_STRENGTH_POTIONS = new PotionConsumable([2440, 157, 159, 161]);
    public static RANGE_POTIONS = new PotionConsumable([2444, 169, 171, 173]);
    public static SUPER_RANGE_POTIONS = new PotionConsumable([11722, 11723, 11724, 11725]);
    public static ZAMORAK_BREW = new PotionConsumable([2450, 189, 191, 193]);

    onEffectAttack(player: Player) {
        switch (this) {
            case PotionConsumable.DEFENCE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.DEFENCE, BoostType.NORMAL);
                break;
            case PotionConsumable.STRENGTH_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.STRENGTH, BoostType.NORMAL);
                break;
            case PotionConsumable.ATTACK_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.ATTACK, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_DEFENCE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.DEFENCE, BoostType.SUPER);
                break;
            case PotionConsumable.SUPER_ATTACK_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.ATTACK, BoostType.SUPER);
                break;
            case PotionConsumable.SUPER_STRENGTH_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.STRENGTH, BoostType.SUPER);
                break;
            case PotionConsumable.RANGE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.RANGED, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_RANGE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill.RANGED, BoostType.SUPER);
                break;
            case PotionConsumable.ZAMORAK_BREW:
                PotionConsumable.onZamorakEffect(player);
                break;
        }
    }

    public static SARADOMIN_BREW = new PotionConsumable([6685, 6687, 6689, 6691]);
    public static GUTHIX_REST = new PotionConsumable([4417, 4419, 4421, 4423, 1980]);
    public static SUPER_RESTORE_POTIONS = new PotionConsumable([3024, 3026, 3028, 3030]);
    public static PRAYER_POTIONS = new PotionConsumable([2434, 139, 141, 143]);

    private ids: number[];

    constructor(ids: number[]) {
        this.ids = ids;
    }

    public static drink(player: Player, item: number, slot: number): boolean {
        const potion = this.forId(item);
        if (!potion) {
            return false;
        }
        if (player.getArea() != null) {
            if (!player.getArea().canDrink(player, item)) {
                player.getPacketSender().sendMessage("You cannot use potions here.");
                return true;
            }
            if (potion === PotionConsumable.GUTHIX_REST || potion === PotionConsumable.SARADOMIN_BREW) {
                if (!player.getArea().canEat(player, item)) {
                    player.getPacketSender().sendMessage("You cannot eat here.");
                    return true;
                }
            }
        }

        // Stun
        if (player.getTimers().has(TimerKey.STUN)) {
            player.getPacketSender().sendMessage("You're currently stunned and cannot use potions.");
            return true;
        }

        if (player.getTimers().has(TimerKey.POTION)) {
            return true;
        }

        player.getTimers().registers(TimerKey.POTION, 3);
        player.getTimers().registers(TimerKey.FOOD, 3);

        player.getPacketSender().sendInterfaceRemoval();
        player.getCombat().reset();
        player.performAnimation(new Animation(829));
        Sounds.sendSound(player, Sound.DRINK);
        player.getInventory().setItem(slot, this.getReplacementItem(item)).refreshItems();
        potion.onEffects(player);

        return true;
    }

    private static getReplacementItem(item: number): Item {
        const potion = this.forId(item);
        if (potion) {
            const length = potion.ids.length;
            for (let index = 0; index < length; index++) {
                if (potion.ids[index] == item && index + 1 < length) {
                    return new Item(potion.ids[index + 1]);
                }
            }
        }
        return new Item(PotionConsumable.VIAL);
    }

    private static forId(id: number): PotionConsumable | undefined {
        for (const potion of Object.values(PotionConsumable)) {
            for (const potionId of potion.ids) {
                if (id === potionId) {
                    return potion;
                }
            }
        }
        return undefined;
    }

    private static onSaradominEffect(player: Player) {
        player.getSkillManager().increaseCurrentLevelMax(
            Skill.DEFENCE,
            Math.floor(2 + (0.120 * player.getSkillManager().getMaxLevel(Skill.DEFENCE)))
        );

        player.getSkillManager().increaseCurrentLevelMax(
            Skill.HITPOINTS,
            Math.floor(2 + (0.15 * player.getSkillManager().getMaxLevel(Skill.HITPOINTS)))
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.ATTACK,
            Math.floor(0.10 * player.getSkillManager().getMaxLevel(Skill.ATTACK)),
            -1
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.STRENGTH,
            Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill.STRENGTH)),
            -1
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.MAGIC,
            Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill.MAGIC)),
            -1
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.RANGED,
            Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill.RANGED)),
            -1
        );
    }

    private static onZamorakEffect(player: Player) {
        player.getSkillManager().increaseCurrentLevelMax(
            Skill.ATTACK,
            Math.floor(2 + (0.20 * player.getSkillManager().getMaxLevel(Skill.ATTACK)))
        );
        player.getSkillManager().increaseCurrentLevelMax(
            Skill.STRENGTH,
            Math.floor(2 + (0.12 * player.getSkillManager().getMaxLevel(Skill.STRENGTH)))
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.DEFENCE,
            Math.floor(2 + (0.10 * player.getSkillManager().getMaxLevel(Skill.DEFENCE))),
            -1
        );

        player.getSkillManager().decreaseCurrentLevel(
            Skill.HITPOINTS,
            Math.floor(2 + (0.10 * player.getSkillManager().getCurrentLevel(Skill.HITPOINTS))),
            1
        );

        player.getSkillManager().increaseCurrentLevel(
            Skill.PRAYER,
            Math.floor(0.10 * player.getSkillManager().getMaxLevel(Skill.PRAYER)),
            player.getSkillManager().getMaxLevel(Skill.PRAYER)
        );
    }

    private static onPrayerEffect(player: Player, restorePotion: boolean) {
        const maxLevel = player.getSkillManager().getMaxLevel(Skill.PRAYER);
        const min = Math.floor((restorePotion ? 8 : 7) + (maxLevel / 4));
        player.getSkillManager().increaseCurrentLevel(Skill.PRAYER, min, maxLevel);
    }

    private static onRestoreEffect(player: Player) {
        for (let index = 0; index <= 6; index++) {
            const skill = Skill[index];
            if ((skill == Skill.PRAYER) || (skill == Skill.HITPOINTS)) {
                continue;
            }
            const maxLevel = player.getSkillManager().getMaxLevel(skill);
            const currLevel = player.getSkillManager().getCurrentLevel(skill);
            if (currLevel < maxLevel) {
                player.getSkillManager().increaseCurrentLevel(skill, Math.floor(8 + (maxLevel / 4)), maxLevel);
            }
        }
    }

    private static onBasicEffect(player: Player, skill: Skill, type: BoostType) {
        const maxLevel = player.getSkillManager().getMaxLevel(skill);
        let boostLevel = Math.round(maxLevel * type.getAmount());
        if (type == BoostType.LOW) {
            boostLevel += 3;
        }
        const cap = maxLevel + boostLevel;
        if (maxLevel + boostLevel > player.getSkillManager().getCurrentLevel(skill)) {
            player.getSkillManager().increaseCurrentLevel(skill, boostLevel, cap);
        }
    }

    private static onAntifireEffect(player: Player, seconds: number) {
        player.getCombat().getFireImmunityTimer().start(seconds);
        player.getPacketSender().sendEffectTimer(seconds, EffectTimer.ANTIFIRE);
    }

    private static onAntipoisonEffect(player: Player, seconds: number) {
        player.getCombat().getPoisonImmunityTimer().start(seconds);
        player.getPacketSender().sendMessage("You are now immune to poison for another " + seconds + " seconds.");
    }

    /**
    
    Gets the identifiers which represent this potion type.
    @return the identifiers for this potion.
    */
    public getIds(): number[] {
        return this.ids;
    }
}

export class BoostType {
    public static readonly LOW = new BoostType(0.10);
    public static readonly NORMAL = new BoostType(0.13);
    public static readonly SUPER = new BoostType(0.19);
    /**
     * The amount this type will boost by.
     */
    private amount: number;

    /**
     * Creates a new {@link BoostType}.
     *
     * @param boostAmount
     *            the amount this type will boost by.
     */
    private constructor(boostAmount: number) {
        this.amount = boostAmount;
    }

    /**
     * Gets the amount this type will boost by.
     *
     * @return the boost amount.
     */
    public getAmount(): number {
        return this.amount;
    }

}
