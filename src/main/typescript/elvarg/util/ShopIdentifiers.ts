export class ShopIdentifiers {
    public static GENERAL_STORE: number = 0;
    public static FOOD_SHOP: number = 1;
    public static PVP_SHOP: number = 2;
    public static ARMOR_SHOP: number = 3;
    public static RANGE_SHOP: number = 4;
    public static TEAMCAPE_SHOP: number = 5;
    public static MAGE_ARMOR_SHOP: number = 6;
    public static MAGE_RUNES_SHOP: number = 7;
    public static PURE_SHOP: number = 8;
    public static TOOL_SHOP: number = 9;
    public static POINTS_SHOP: number = 10;

    private value: number;

    constructor(n1: number){
        this.value = n1
    }
}