import { Player } from '../../../entity/impl/player/Player';
import { Emblem } from './Emblem';



export class WealthType {
    public static readonly NO_TARGET = new WealthType("N/A", 876);
    public static readonly VERY_LOW = new WealthType("V. Low", 877);
    public static readonly LOW = new WealthType("Low", 878);
    public static readonly MEDIUM = new WealthType("Medium", 879);
    public static readonly HIGH = new WealthType("High", 880);
    public static readonly VERY_HIGH = new WealthType("V. High", 881);


    public tooltip: string;
    public configId: number;

    constructor(tooltip: string, configId: number) {
        this.tooltip = tooltip;
        this.configId = configId;
    }

    static getWealth(player: Player) {
        let wealth = 0;

        const items = [...player.getInventory().getItems(), ...player.getEquipment().getItems()];
        for (const item of items) {
            if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isDropable() || !item.getDefinition().isTradeable()) {
                continue;
            }
            wealth += item.getDefinition().getValue();
        }
        let type: WealthType = WealthType.VERY_LOW;
        if (wealth >= Emblem.MYSTERIOUS_EMBLEM_1.value) {
            type = WealthType.LOW;
        }
        if (wealth >= Emblem.MYSTERIOUS_EMBLEM_3.value) {
            type = WealthType.MEDIUM;
        }
        if (wealth >= Emblem.MYSTERIOUS_EMBLEM_6.value) {
            type = WealthType.HIGH;
        }
        if (wealth >= Emblem.MYSTERIOUS_EMBLEM_9.value) {
            type = WealthType.VERY_HIGH;
        }
        return type;
    }
}
