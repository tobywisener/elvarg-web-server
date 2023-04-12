import { Dueling, DuelRule } from "./Duelling";
import { CombatType } from "./combat/CombatType";
import { Mobile } from "../entity/impl/Mobile";
import { NPC } from "../entity/impl/npc/NPC";
import { Player } from "../entity/impl/player/Player";
import { Skill } from "../model/Skill";
import { SkullType } from "../model/SkullType";
import { BonusManager } from "../model/equipment/BonusManager";
import { PlayerRights } from "../model/rights/PlayerRights";
import { Task } from "../task/Task";
import { TaskManager } from "../task/TaskManager";
import { Misc } from "../../util/Misc";

export class PrayerHandler {

    public static THICK_SKIN = 0;
    public static BURST_OF_STRENGTH = 1;
    public static CLARITY_OF_THOUGHT = 2;
    public static SHARP_EYE = 3;
    public static MYSTIC_WILL = 4;
    public static ROCK_SKIN = 5;
    public static SUPERHUMAN_STRENGTH = 6;
    public static IMPROVED_REFLEXES = 7;
    public static RAPID_RESTORE = 8;
    public static RAPID_HEAL = 9;
    public static PROTECT_ITEM = 10;
    public static HAWK_EYE = 11;
    public static MYSTIC_LORE = 12;
    public static STEEL_SKIN = 13;
    public static ULTIMATE_STRENGTH = 14;
    public static INCREDIBLE_REFLEXES = 15;
    public static PROTECT_FROM_MAGIC = 16;
    public static PROTECT_FROM_MISSILES = 17;
    public static PROTECT_FROM_MELEE = 18;
    public static EAGLE_EYE = 19;
    public static MYSTIC_MIGHT = 20;
    public static RETRIBUTION = 21;
    public static REDEMPTION = 22;
    public static SMITE = 23;
    public static PRESERVE = 24;
    public static CHIVALRY = 25;
    public static PIETY = 26;
    public static RIGOUR = 27
    public static AUGURY = 28;
    public static DEFENCE_PRAYERS: number[] = [PrayerHandler.THICK_SKIN, PrayerHandler.ROCK_SKIN, PrayerHandler.STEEL_SKIN, PrayerHandler.CHIVALRY, PrayerHandler.PIETY, PrayerHandler.RIGOUR, PrayerHandler.AUGURY];
    public static STRENGTH_PRAYERS: number[] = [PrayerHandler.BURST_OF_STRENGTH, PrayerHandler.SUPERHUMAN_STRENGTH, PrayerHandler.ULTIMATE_STRENGTH, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    public static ATTACK_PRAYERS: number[] = [PrayerHandler.CLARITY_OF_THOUGHT, PrayerHandler.IMPROVED_REFLEXES, PrayerHandler.INCREDIBLE_REFLEXES, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    public static RANGED_PRAYERS: number[] = [PrayerHandler.SHARP_EYE, PrayerHandler.HAWK_EYE, PrayerHandler.EAGLE_EYE, PrayerHandler.RIGOUR];
    public static MAGIC_PRAYERS: number[] = [PrayerHandler.MYSTIC_WILL, PrayerHandler.MYSTIC_LORE, PrayerHandler.MYSTIC_MIGHT, PrayerHandler.AUGURY];
    public static OVERHEAD_PRAYERS: number[] = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE, PrayerHandler.RETRIBUTION, PrayerHandler.REDEMPTION, PrayerHandler.SMITE];
    public static PROTECTION_PRAYERS: number[] = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE];

    public static getProtectingPrayer(type: CombatType): number {
        switch (type) {
            case CombatType.MELEE:
                return PrayerHandler.PROTECT_FROM_MELEE;
            case CombatType.MAGIC:
                return PrayerHandler.PROTECT_FROM_MAGIC;
            case CombatType.RANGED:
                return PrayerHandler.PROTECT_FROM_MISSILES;
            default:
                throw new Error("Invalid combat type: " + type);
        }
    }

    public static isActivated(c: Mobile, prayer: number): boolean {
        return c.getPrayerActive()[prayer];
    }

    /**
     * Activates a prayer with specified <code>buttonId</code>.
     *
     * @param player   The player clicking on prayer button.
     * @param buttonId The button the player is clicking.
     */
    public static togglePrayer(player: Player, buttonId: number): boolean {
        let prayerData = PrayerData.actionButton.get(buttonId);
        if (prayerData != null) {
            if (!player.getPrayerActive()[prayerData.hint])
                PrayerHandler.activatePrayer(player, prayerData);
            else
                PrayerHandler.deactivatePrayer(player, prayerData.configId);
            return true;
        }
        return false;
    }

    public static activatePrayer(character: Mobile, pd: PrayerData) {
        PrayerHandler.activatePrayer(character, pd);
    }

    public static activatePrayerPrayerId(character: Mobile, prayerId: number) {
        // Get the prayer data
        const pd = PrayerData.actionButton.get(prayerId);

        // Check if it's available
        if (!pd) {
            return;
        }

        // Check if we're already praying this prayer
        if (character.getPrayerActive()[prayerId]) {
            // If we are an npc, make sure our headicon
            // is up to speed
            if (character.isNpc()) {
                const npc = character.getAsNpc();
                if (pd.hint !== -1) {
                    const hintId = this.getHeadHint(character);
                    if (npc.getHeadIcon() !== hintId) {
                        npc.setHeadIcon(hintId);
                    }
                }
            }
            return;
        }

        // If we're a player, make sure we can use this prayer
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                player.getPacketSender().sendConfig(pd.configId, 0);
                player.getPacketSender().sendMessage("You do not have enough Prayer points.");
                return;
            }
            if (!PrayerHandler.canUse(player, pd, true)) {
                return;
            }
        }

        switch (prayerId) {
            case PrayerHandler.THICK_SKIN:
            case PrayerHandler.ROCK_SKIN:
            case PrayerHandler.STEEL_SKIN:
                PrayerHandler.resetPrayersC(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                break;
            case PrayerHandler.BURST_OF_STRENGTH:
            case PrayerHandler.SUPERHUMAN_STRENGTH:
            case PrayerHandler.ULTIMATE_STRENGTH:
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CLARITY_OF_THOUGHT:
            case PrayerHandler.IMPROVED_REFLEXES:
            case PrayerHandler.INCREDIBLE_REFLEXES:
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.SHARP_EYE:
            case PrayerHandler.HAWK_EYE:
            case PrayerHandler.EAGLE_EYE:
            case PrayerHandler.MYSTIC_WILL:
            case PrayerHandler.MYSTIC_LORE:
            case PrayerHandler.MYSTIC_MIGHT:
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CHIVALRY:
            case PrayerHandler.PIETY:
            case PrayerHandler.RIGOUR:
            case PrayerHandler.AUGURY:
                PrayerHandler.resetPrayersC(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                PrayerHandler.resetPrayersC(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.PROTECT_FROM_MAGIC:
            case PrayerHandler.PROTECT_FROM_MISSILES:
            case PrayerHandler.PROTECT_FROM_MELEE:
                PrayerHandler.resetPrayersC(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
            case PrayerHandler.RETRIBUTION:
            case PrayerHandler.REDEMPTION:
            case PrayerHandler.SMITE:
                PrayerHandler.resetPrayersC(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
        }
        character.setPrayerActive(prayerId, true);


        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 1);
            PrayerHandler.startDrain(player);
            if (pd.hint !== -1) {
                const hintId = PrayerHandler.getHeadHint(character);
                player.getAppearance().setHeadHint(hintId);
            }

            if (player.getInterfaceId() === BonusManager.INTERFACE_ID) {
                BonusManager.update(player);
            }
        } else if (character.isNpc()) {
            const npc = character.getAsNpc();
            if (pd.hint !== -1) {
                const hintId = PrayerHandler.getHeadHint(character);
                if (npc.getHeadIcon() !== hintId) {
                    npc.setHeadIcon(hintId);
                }
            }
        }
    }

    public static canUse(player: Player, prayer: PrayerData, msg: boolean): boolean {
        if (player.getSkillManager().getMaxLevel(Skill.PRAYER) < (prayer.requirement)) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Prayer level of at least" + prayer.requirement + " to use" + PrayerData.getPrayerName() + ".");
            }
            return false;
        }
        if (prayer === PrayerData.CHIVALRY && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 60) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 60 to use Chivalry.");
            }
            return false;
        }
        if (prayer === PrayerData.PIETY && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use Piety.");
            }
            return false;
        }
        if ((prayer === PrayerData.RIGOUR || prayer === PrayerData.AUGURY) && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use that prayer.");
            }
            return false;
        }
        if (prayer === PrayerData.PROTECT_ITEM) {
            if (player.isSkulled() && player.getSkullType() === SkullType.RED_SKULL) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    // DialogueManager.sendStatement(player, "You cannot use the Protect Item prayer with a red skull!");
                }
                return false;
            }
        }
        if (!player.getCombat().getPrayerBlockTimer().finished()) {
            if (prayer == PrayerData.PROTECT_FROM_MELEE || prayer == PrayerData.PROTECT_FROM_MISSILES
                || prayer == PrayerData.PROTECT_FROM_MAGIC) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    player.getPacketSender()
                        .sendMessage("You have been disabled and can no longer use protection prayers.");
                }
                return false;
            }
        }

        // Prayer locks
        let locked = false;

        if (prayer == PrayerData.PRESERVE && !player.isPreserveUnlocked()
            || prayer == PrayerData.RIGOUR && !player.isRigourUnlocked()
            || prayer == PrayerData.AUGURY && !player.getAuguryUnlocked()) {
            if (player.getRights() != PlayerRights.OWNER && player.getRights() != PlayerRights.DEVELOPER) {
                locked = true;
            }
        }

        if (locked) {
            if (msg) {
                player.getPacketSender().sendMessage("You have not unlocked that Prayer yet.");
            }
            return false;
        }

        // Duel, disabled prayer?
        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_PRAYER.getButtonId()]) {
            if (msg) {
                //   DialogueManager.sendStatement(player, "Prayer has been disabled in this duel!");
                player.getPacketSender().sendConfig(prayer.configId, 0);
            }
            return false;
        }
        return true;
    }

    public static deactivatePrayer(c: Mobile, prayerId: number): void {
        if (!c.getPrayerActive()[prayerId]) {
            return;
        }
        const pd = PrayerData.prayerData.get(prayerId);
        c.getPrayerActive()[prayerId] = false;
        if (c.isPlayer()) {
            const player = c.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                const hintId = this.getHeadHint(c);
                player.getAppearance().setHeadHint(hintId);
            }

            player.getQuickPrayers().checkActive();
            BonusManager.update(player);
        } else if (c.isNpc()) {
            if (pd.hint !== -1) {
                const hintId = this.getHeadHint(c);
                if (c.getAsNpc().getHeadIcon() !== hintId) {
                    c.getAsNpc().setHeadIcon(hintId);
                }
            }
        }
    }

    public static deactivatePrayers(character: Mobile): void {
        for (let i = 0; i < character.getPrayerActive().length; i++) {
            this.deactivatePrayer(character, i);
        }
        if (character.isPlayer()) {
            character.getAsPlayer().getQuickPrayers().setEnabled(false);
            character.getAsPlayer().getPacketSender().sendQuickPrayersState(false);
        } else if (character.isNpc()) {
            if (character.getAsNpc().getHeadIcon() !== -1) {
                character.getAsNpc().setHeadIcon(-1);
            }
        }
    }

    public static resetAll(player: Player): void {
        for (let i = 0; i < player.getPrayerActive().length; i++) {
            const pd = PrayerData.prayerData.get(i);
            if (!pd) continue;
            player.getPrayerActive()[i] = false;
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                const hintId = this.getHeadHint(player);
                player.getAppearance().setHeadHint(hintId);
            }
        }
        player.getQuickPrayers().setEnabled(false);
        player.getPacketSender().sendQuickPrayersState(false);
    }

    public static getHeadHint(character: Mobile): number {
        const prayers = character.getPrayerActive();
        if (prayers[PrayerHandler.PROTECT_FROM_MELEE]) {
            return 0;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MISSILES]) {
            return 1;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MAGIC]) {
            return 2;
        }
        if (prayers[PrayerHandler.RETRIBUTION]) {
            return 3;
        }
        if (prayers[PrayerHandler.SMITE]) {
            return 4;
        }
        if (prayers[PrayerHandler.REDEMPTION]) {
            return 5;
        }
        return -1;
    }

    public static startDrain(player: Player) {
        if (player.isDrainingPrayer()) {
            return;
        }
        player.setDrainingPrayer(true);
        let task = new PlayerHandlerTask(player,  () => {
            let drainPerTick = 0;
            let pointDrain = player.getPrayerPointDrain();
            for (let i = 0; i < player.getPrayerActive().length; i++) {
                if (!player.getPrayerActive()[i]) {
                    continue;
                }
                let pd = PrayerData.prayerData.get(i);
                if (!pd) {
                    continue;
                }
                let drainMinute = pd.drainRate;
                let drainSeconds = drainMinute / 60;
                let drainTicks = (drainSeconds * 0.6);
                drainPerTick += drainTicks;
            }
            if (player.getHitpoints() <= 0 || drainPerTick <= 0) {
                stop();
                return;
            }
            let bonus = player.getBonusManager().getOtherBonus()[BonusManager.PRAYER];
            drainPerTick /= (1 + (0.0333 * bonus));
        
            pointDrain += drainPerTick;
            let drainTreshold = Math.floor(pointDrain);
            if (drainTreshold >= 1) {
                let total = (player.getSkillManager().getCurrentLevel(Skill.PRAYER) - drainTreshold);
                player.getSkillManager().setCurrentLevel(Skill.PRAYER, total, true);
                if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                    PrayerHandler.deactivatePrayers(player);
                    player.getPacketSender().sendMessage("You have run out of Prayer points!");
                    stop();
                    return;
                }
                pointDrain -= drainTreshold;
                if (pointDrain < 0) {
                    pointDrain = 0;
                }
            }
            player.setPrayerPointDrain(pointDrain);
    
            function stop() {
                player.setPrayerPointDrain(0);
                player.setDrainingPrayer(false);
                task.stop();
            }
        });
    }



    public static resetPrayersC(c: Mobile, prayers: number[], prayerID: number): void {
        for (let i = 0; i < prayers.length; i++) {
            if (prayers[i] != prayerID)
                this.deactivatePrayer(c, prayers[i]);
        }
    }

    /**
     * Resets prayers in the array
     *
     * @param player
     * @param prayers
     */
    public static resetPrayers(player: Player, prayers: number[]): void {
        for (let i = 0; i < prayers.length; i++) {
            PrayerHandler.deactivatePrayer(player, prayers[i]);
        }
    }

    /**
     * Checks if action button ID is a prayer button.
     *
     * @param buttonId action button being hit.
     */
    public static isButton(actionButtonID: number): boolean {
        return PrayerData.actionButton.has(actionButtonID);
    }
}



export class PrayerData {

    public static readonly THICK_SKIN = new PrayerData(1, 5, 5609, 83);
    public static readonly BURST_OF_STRENGTH =  new PrayerData(4, 5, 5610, 84);
    public static readonly CLARITY_OF_THOUGHT = new PrayerData(7, 5, 5611, 85);
    public static readonly SHARP_EYE = new PrayerData(8, 5, 19812, 700);
    public static readonly MYSTIC_WILL = new PrayerData(9, 5, 19814, 701);
    public static readonly ROCK_SKIN = new PrayerData (10, 10, 5612, 86);
    public static readonly SUPERHUMAN_STRENGTH = new PrayerData (13, 10, 5613, 87);
    public static readonly IMPROVED_REFLEXES = new PrayerData (16, 10, 5614, 88);
    public static readonly RAPID_RESTORE = new PrayerData (19, 2.3, 5615, 89);
    public static readonly RAPID_HEAL = new PrayerData (22, 3, 5616, 90);
    public static readonly PROTECT_ITEM = new PrayerData (25, 3, 5617, 91);
    public static readonly HAWK_EYE = new PrayerData (26, 10, 19816, 702);
    public static readonly MYSTIC_LORE = new PrayerData (27, 10, 19818, 703);
    public static readonly STEEL_SKIN = new PrayerData (28, 20, 5618, 92);
    public static readonly ULTIMATE_STRENGTH = new PrayerData (31, 20, 5619, 93);
    public static readonly INCREDIBLE_REFLEXES = new PrayerData (34, 20, 5620, 94);
    public static readonly PROTECT_FROM_MAGIC = new PrayerData (37, 20, 5621, 95, [2]);
    public static readonly PROTECT_FROM_MISSILES = new PrayerData (40, 20, 5622, 96, [1]);
    public static readonly PROTECT_FROM_MELEE = new PrayerData (43, 20, 5623, 97, [0]);
    public static readonly EAGLE_EYE = new PrayerData(44, 20, 19821, 704);
    public static readonly MYSTIC_MIGHT = new PrayerData (45, 20, 19823, 705);
    public static readonly RETRIBUTION = new PrayerData (46, 5, 683, 98, [4]);
    public static readonly REDEMPTION = new PrayerData (49, 10, 684, 99, [5]);
    public static readonly SMITE = new PrayerData (52, 32.0, 685, 100, [6]);
    public static readonly PRESERVE = new PrayerData (55, 3, 28001, 708);
    public static readonly CHIVALRY = new PrayerData (60, 38.5, 19825, 706);
    public static readonly PIETY = new PrayerData (70, 38.5, 19827, 707);
    public static readonly RIGOUR = new PrayerData (74, 38.5, 28004, 710);
    public static readonly AUGURY = new PrayerData (77, 38.5, 28007, 712);

    /**
       * Contains the PrayerData with their corresponding prayerId.
       */
    public static prayerData: Map<number, PrayerData> = new Map<number, PrayerData>();
    /**
     * Contains the PrayerData with their corresponding buttonId.
     */
    public static actionButton: Map<number, PrayerData> = new Map<number, PrayerData>();

    /**
     * Populates the prayerId and buttonId maps.
     */
    static {
        for (const pd of Object.values(PrayerData)) {
            this.prayerData.set(pd.ordinal(), pd);
            this.actionButton.set(pd.buttonId, pd);
        }
    }

    /**
     * The prayer's level requirement for player to be able to activate it.
     */
    public requirement: number;
    /**
     * The prayer's action button id in prayer tab.
     */
    private buttonId: number;
    /**
     * The prayer's config id to switch their glow on/off by sending the sendConfig
     * packet.
     */
    public configId: number;
    /**
     * The rate of which the player's prayer points will be drained at 
     * per minute.
     */
    public drainRate: number;
    /**
     * The prayer's head icon hint index.
     */
    public hint: number = -1;
    /**
     * The prayer's formatted name.
     */
    private name: string;

    constructor(requirement: number, drainRate: number, buttonId: number, configId: number, hint?: number[]) {
        this.requirement = requirement;
        this.drainRate = drainRate;
        this.buttonId = buttonId;
        this.configId = configId;
        if (hint.length > 0)
            this.hint = hint[0];
    }

    /**
     * Gets the prayer's formatted name.
     *
     * @return The prayer's name
     */
    public static getPrayerName(): string {
        if (this.name == null)
            return Misc.capitalizeWords(toString().toLowerCase().replace("_", " "));
        return this.name;
    }

    public static *values(): Iterable<PrayerData> {
        yield PrayerData.THICK_SKIN;
        yield PrayerData.BURST_OF_STRENGTH;
        yield PrayerData.CLARITY_OF_THOUGHT
        yield PrayerData.SHARP_EYE
        yield PrayerData.MYSTIC_WILL
        yield PrayerData.ROCK_SKIN
        yield PrayerData.SUPERHUMAN_STRENGTH
        yield PrayerData.IMPROVED_REFLEXES
        yield PrayerData.RAPID_RESTORE
        yield PrayerData.RAPID_HEAL
        yield PrayerData.PROTECT_ITEM
        yield PrayerData.HAWK_EYE
        yield PrayerData.MYSTIC_LORE
        yield PrayerData.STEEL_SKIN
        yield PrayerData.ULTIMATE_STRENGTH
        yield PrayerData.INCREDIBLE_REFLEXES
        yield PrayerData.PROTECT_FROM_MAGIC
        yield PrayerData.PROTECT_FROM_MISSILES
        yield PrayerData.PROTECT_FROM_MELEE
        yield PrayerData.EAGLE_EYE
        yield PrayerData.MYSTIC_MIGHT
        yield PrayerData.RETRIBUTION
        yield PrayerData.REDEMPTION
        yield PrayerData.SMITE
        yield PrayerData.PRESERVE
        yield PrayerData.CHIVALRY
        yield PrayerData.PIETY
        yield PrayerData.RIGOUR
        yield PrayerData.AUGURY
      }

}

class PlayerHandlerTask extends Task{
    constructor(p: Player,private readonly execFunc: Function){
        super(1, false);
    }
    execute(): void {
        this.execFunc();
    }

}

