export class TeleportButton {
    public static readonly HOME = new TeleportButton(-1, 19210, 21741, 19210);
    public static readonly TRAINING = new TeleportButton(-1, 1164, 13035, 30064);
    public static readonly MINIGAME = new TeleportButton(2, 1167, 13045, 30075);
    public static readonly WILDERNESS = new TeleportButton(0, 1170, 13053, 30083);
    public static readonly SLAYER = new TeleportButton(-1, 1174, 13061, 30114);
    public static readonly CITY = new TeleportButton(-1, 1540, 13079, 30146);
    public static readonly SKILLS = new TeleportButton(3, 1541, 13069, 30106);
    public static readonly BOSSES = new TeleportButton(1, 7455, 13087, 30138);

    menu: number;
    ids: number[];

    constructor(menu: number, ...ids: number[]) {
        this.ids = ids;
        this.menu = menu;
    }

    static teleports = new Map<number, TeleportButton>();

    static init() {
        for (const b of Object.values(TeleportButton)) {
            for (const i of b.ids) {
                TeleportButton.teleports.set(i, b);
            }
        }
    }

    static get(buttonId: number) {
        return TeleportButton.teleports.get(buttonId);
    }
}

TeleportButton.init();

export default TeleportButton;