export class Prayerbook {
    private interfaceId: number;
    private message: string;

    constructor(interfaceId: number, message: string) {
        this.interfaceId = interfaceId;
        this.message = message;
    }

    public static forId(id: number): Prayerbook {
        for (let book of Object.values(Prayerbook)) {
            if (book.ordinal() == id) {
                return book;
            }
        }
        return Prayerbooks.NORMAL;
    }

    public getInterfaceId(): number {
        return this.interfaceId;
    }

    public getMessage(): string {
        return this.message;
    }
}

const Prayerbooks = {
    NORMAL: new Prayerbook(5608, "You sense a surge of purity flow through your body!"),
    CURSES: new Prayerbook(32500, "You sense a surge of power flow through your body!")
}