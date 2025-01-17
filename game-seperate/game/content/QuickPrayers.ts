import { Player } from "../entity/impl/player/Player";
import { Skill } from "../model/Skill";
import { PrayerHandler } from "./PrayerHandler";
import { PrayerData } from "./PrayerHandler";

export class QuickPrayers extends PrayerHandler {
    private static readonly TOGGLE_QUICK_PRAYERS = 1500;
    private static readonly SETUP_BUTTON = 1506;
    private static readonly CONFIRM_BUTTON = 17232;
    private static readonly QUICK_PRAYERS_TAB_INTERFACE_ID = 17200;
    private static readonly CONFIG_START = 620;

    private player: Player;
    public prayers: PrayerData[] = Array.from(PrayerData.values());
    private selectingPrayers: boolean;
    private enabled: boolean;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    public sendChecks(): void {
        for (const prayer of PrayerData.values()) {
            this.sendCheck(prayer);
        }
    }

    private sendCheck(prayer: PrayerData): void {
        this.player.getPacketSender().sendConfig(QuickPrayers.CONFIG_START + this.prayers.indexOf(prayer), this.prayers.indexOf(prayer) !== null ? 0 : 1);
    }

    private uncheckSelect(toDeselect: number[], exception: number): void {
        for (const i of toDeselect) {
            if (i === exception) {
                continue;
            }
            this.uncheck(PrayerData.values()[i]);
        }
    }

    private uncheck(prayer: PrayerData): void {
        const index = this.prayers.findIndex(p => p === prayer);
        if (index !== -1) {
            this.prayers[index] = null;
            this.sendCheck(prayer);
        }
    }

    private toggle(index: number): void {
        const prayer: PrayerData = PrayerData.values()[index];

        if (this.prayers.indexOf(prayer) !== -1) {
            this.uncheck(prayer);
            return;
        }

        if (!QuickPrayers.canUse(this.player, prayer, true)) {
            this.uncheck(prayer);
            return;
        }

        const indexs = this.prayers.indexOf(prayer);
        if (indexs !== -1) {
            this.prayers[indexs] = prayer;
        }
        this.sendCheck(prayer);

        switch (index) {
            case QuickPrayers.THICK_SKIN:
            case QuickPrayers.ROCK_SKIN:
            case QuickPrayers.STEEL_SKIN:
                this.uncheckSelect(QuickPrayers.DEFENCE_PRAYERS, index);
                break;
            case QuickPrayers.BURST_OF_STRENGTH:
            case QuickPrayers.SUPERHUMAN_STRENGTH:
            case QuickPrayers.ULTIMATE_STRENGTH:
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.CLARITY_OF_THOUGHT:
            case QuickPrayers.IMPROVED_REFLEXES:
            case QuickPrayers.INCREDIBLE_REFLEXES:
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.SHARP_EYE:
            case QuickPrayers.HAWK_EYE:
            case QuickPrayers.EAGLE_EYE:
            case QuickPrayers.MYSTIC_WILL:
            case QuickPrayers.MYSTIC_LORE:
            case QuickPrayers.MYSTIC_MIGHT:
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.CHIVALRY:
            case QuickPrayers.PIETY:
            case QuickPrayers.RIGOUR:
            case QuickPrayers.AUGURY:
                this.uncheckSelect(QuickPrayers.DEFENCE_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.STRENGTH_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.ATTACK_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.RANGED_PRAYERS, index);
                this.uncheckSelect(QuickPrayers.MAGIC_PRAYERS, index);
                break;
            case QuickPrayers.PROTECT_FROM_MAGIC:
            case QuickPrayers.PROTECT_FROM_MISSILES:
            case QuickPrayers.PROTECT_FROM_MELEE:
                this.uncheckSelect(QuickPrayers.OVERHEAD_PRAYERS, index);
                break;
            case QuickPrayers.RETRIBUTION:
            case QuickPrayers.REDEMPTION:
            case QuickPrayers.SMITE:
                this.uncheckSelect(QuickPrayers.OVERHEAD_PRAYERS, index);
                break;
        }
    }

    public checkActive(): void {
        if (this.enabled) {
            for (const prayer of this.prayers) {
                if (prayer === null) continue;
                if (QuickPrayers.isActivated(this.player, this.prayers.indexOf(prayer))) {
                    return;
                }
            }
            this.enabled = false;
            this.player.getPacketSender().sendQuickPrayersState(false);
        }
    }


    public handleButton(button: number): boolean {
        switch (button) {
            case QuickPrayers.TOGGLE_QUICK_PRAYERS:
                if (this.player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                    this.player.getPacketSender().sendMessage("You don't have enough Prayer points.");
                    return true;
                }
                if (this.enabled) {
                    for (const prayer of this.prayers) {
                        if (prayer === null) continue;
                        QuickPrayers.deactivatePrayer(this.player, this.prayers.indexOf(prayer));
                    }
                    this.enabled = false;
                } else {
                    let found = false;
                    for (const prayer of this.prayers) {
                        if (prayer === null) continue;
                        QuickPrayers.activatePrayerPrayerId(this.player, this.prayers.indexOf(prayer));
                        found = true;
                    }
                    if (!found) {
                        this.player.getPacketSender().sendMessage("You have not setup any quick-prayers yet.");
                    }
                    this.enabled = found;
                }
                this.player.getPacketSender().sendQuickPrayersState(this.enabled);
                break;
            case QuickPrayers.SETUP_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608).sendTab(5);
                    this.selectingPrayers = false;
                } else {
                    this.sendChecks();
                    this.player.getPacketSender().sendTabInterface(5, QuickPrayers.QUICK_PRAYERS_TAB_INTERFACE_ID).sendTab(5);
                    this.selectingPrayers = true;
                }
                break;
            case QuickPrayers.CONFIRM_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608);
                    this.selectingPrayers = false;
                }
                break;
        }
        if (button >= 17202 && button <= 17230) {
            if (this.selectingPrayers) {
                const index = button - 17202;
                this.toggle(index);
            }
            return true;
        }
        return false;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    public getPrayers(): PrayerData[] {
        return this.prayers;
    }

    public setPrayers(prayers: PrayerData[]): void {
        this.prayers = prayers;
    }
}