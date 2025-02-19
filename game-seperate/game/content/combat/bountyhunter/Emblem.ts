export class Emblem {
    public static readonly MYSTERIOUS_EMBLEM_1 = new Emblem(12746, 500 );
    public static readonly MYSTERIOUS_EMBLEM_2 = new Emblem( 12748, 1000 );
    public static readonly MYSTERIOUS_EMBLEM_3 = new Emblem( 12749, 1800 );
    public static readonly MYSTERIOUS_EMBLEM_4 = new Emblem( 12750, 3200 );
    public static readonly MYSTERIOUS_EMBLEM_5 = new Emblem( 12751, 4800 );
    public static readonly MYSTERIOUS_EMBLEM_6 = new Emblem( 12752, 6800 );
    public static readonly MYSTERIOUS_EMBLEM_7 = new Emblem( 12753, 9000 );
    public static readonly MYSTERIOUS_EMBLEM_8 = new Emblem( 12754, 12000 );
    public static readonly MYSTERIOUS_EMBLEM_9 = new Emblem( 12755, 16000 );
    public static readonly MYSTERIOUS_EMBLEM_10 = new Emblem( 12756, 20000 );

    id: number;
    value: number;

    constructor(id: number, value: number) {
        this.id = id;
        this.value = value;
    }
}
