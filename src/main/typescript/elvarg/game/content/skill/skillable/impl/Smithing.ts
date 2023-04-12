import { Player } from "../../../../entity/impl/player/Player";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { RequiredItem } from "../../../../model/RequiredItem";
import { Item } from "../../../../model/Item";
import { Skill } from "../../../../model/Skill";
import { Animation } from "../../../../model/Animation";
import { ItemCreationSkillable } from "./ItemCreationSkillable";
import { AnimationLoop } from "../../../../model/AnimationLoop";
import { Misc } from "../../../../../util/Misc";
import { EnteredAmountAction } from "../../../../model/EnteredAmountAction";

class SmiEntered implements EnteredAmountAction {
    constructor(private readonly execFunc: Function) {

    }
    execute(amount: number): void {
        this.execFunc();
    }

}

export class Smithing extends ItemIdentifiers {
    static handleButton(player: Player, button: number): boolean {
        for (let bar of Object.values(Bar)) {
            for (let b of bar.getButtons()) {
                if (b[0] == button) {
                    let amount = b[1];
                    if (amount == -1) {
                        player.setEnteredAmountAction(new SmiEntered((input: number) => {
                            player.getSkillManager().startSkillable(new Smelting(bar, input));
                        }));
                        player.getPacketSender().sendEnterAmountPrompt("Enter amount of bars to smelt:");
                    } else {
                        player.getSkillManager().startSkillable(new Smelting(bar, amount));
                    }
                    return true;
                }
            }
        }
        return false;
    }
}

class SmithableEquipment {
    private static readonly BRONZE_DAGGER = new SmithableEquipment("Dagger", 2349, 1205, 1, 1119, 0, 1094, 1, 1, 1125);
    private static readonly BRONZE_AXE = new SmithableEquipment("Axe", 2349, 1351, 1, 1120, 0, 1091, 1, 1, 1126);
    private static readonly BRONZE_MACE = new SmithableEquipment("Mace", 2349, 1422, 1, 1120, 1, 1093, 2, 1, 1129);
    private static readonly BRONZE_MED_HELM = new SmithableEquipment("Med helm", 2349, 1139, 1, 1122, 0, 1102, 3, 1, 1127);
    private static readonly BRONZE_DART_TIPS = new SmithableEquipment("Dart tips", 2349, 819, 10, 1123, 0, 1107, 4, 1, 1128);
    private static readonly BRONZE_SWORD = new SmithableEquipment("Sword", 2349, 1277, 1, 1119, 1, 1085, 4, 1, 1124);
    private static readonly BRONZE_ARROWTIPS = new SmithableEquipment("Arrowtips", 2349, 39, 15, 1123, 1, 1108, 5, 1, 1130);
    private static readonly BRONZE_SCIMITAR = new SmithableEquipment("Scimitar", 2349, 1321, 1, 1119, 2, 1087, 5, 2, 1116);
    private static readonly BRONZE_LONG_SWORD = new SmithableEquipment("Long sword", 2349, 1291, 1, 1119, 3, 1086, 6, 2, 1089);
    private static readonly BRONZE_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2349, 864, 5, 1123, 2, 1106, 7, 1, 1131);
    private static readonly BRONZE_FULL_HELM = new SmithableEquipment("Full helm", 2349, 1155, 1, 1122, 1, 1103, 7, 2, 1113);
    private static readonly BRONZE_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2349, 1173, 1, 1122, 2, 1104, 8, 2, 1114);
    private static readonly BRONZE_WARHAMMER = new SmithableEquipment("Warhammer", 2349, 1337, 1, 1120, 2, 1083, 9, 3, 1118);
    private static readonly BRONZE_BATTLE_AXE = new SmithableEquipment("Battle axe", 2349, 1375, 1, 1120, 3, 1092, 10, 3, 1095);
    private static readonly BRONZE_CHAINBODY = new SmithableEquipment("Chainbody", 2349, 1103, 1, 1121, 0, 1098, 11, 3, 1109);
    private static readonly BRONZE_KITE_SHIELD = new SmithableEquipment("Kite shield", 2349, 1189, 1, 1122, 3, 1105, 12, 3, 1115);
    private static readonly BRONZE_CLAWS = new SmithableEquipment("Claws", 2349, 3095, 1, 1120, 4, 8429, 13, 2, 8428);
    private static readonly BRONZE_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2349, 1307, 1, 1119, 4, 1088, 14, 3, 1090);
    private static readonly BRONZE_PLATESKIRT = new SmithableEquipment("Plate skirt", 2349, 1087, 1, 1121, 2, 1100, 16, 3, 1111);
    private static readonly BRONZE_PLATELEGS = new SmithableEquipment("Plate legs", 2349, 1075, 1, 1121, 1, 1099, 16, 3, 1110);
    private static readonly BRONZE_PLATEBODY = new SmithableEquipment("Plate body", 2349, 1117, 1, 1121, 3, 1101, 18, 5, 1112);
    private static readonly BRONZE_NAILS = new SmithableEquipment("Nails", 2349, 4819, 15, 1122, 4, 13358, 4, 1, 13357);
    private static readonly BRONZE_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2349, 9375, 10, 1121, 4, 11461, 3, 1, 11459);

    private static readonly IRON_DAGGER = new SmithableEquipment("Dagger", 2351, 1203, 1, 1119, 0, 1094, 15, 1, 1125);
    private static readonly IRON_AXE = new SmithableEquipment("Axe", 2351, 1349, 1, 1120, 0, 1091, 16, 1, 1126);
    private static readonly IRON_MACE = new SmithableEquipment("Mace", 2351, 1420, 1, 1120, 1, 1093, 17, 1, 1129);
    private static readonly IRON_MED_HELM = new SmithableEquipment("Med helm", 2351, 1137, 1, 1122, 0, 1102, 18, 1, 1127);
    private static readonly IRON_DART_TIPS = new SmithableEquipment("Dart tips", 2351, 820, 10, 1123, 0, 1107, 19, 1, 1128);
    private static readonly IRON_SWORD = new SmithableEquipment("Sword", 2351, 1279, 1, 1119, 1, 1085, 19, 1, 1124);
    private static readonly IRON_ARROWTIPS = new SmithableEquipment("Arrowtips", 2351, 40, 15, 1123, 1, 1108, 20, 1, 1130);
    private static readonly IRON_SCIMITAR = new SmithableEquipment("Scimitar", 2351, 1323, 1, 1119, 2, 1087, 20, 2, 1116);
    private static readonly IRON_LONG_SWORD = new SmithableEquipment("Long sword", 2351, 1293, 1, 1119, 3, 1086, 21, 2, 1089);
    private static readonly IRON_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2351, 863, 5, 1123, 2, 1106, 22, 1, 1131);
    private static readonly IRON_FULL_HELM = new SmithableEquipment("Full helm", 2351, 1153, 1, 1122, 1, 1103, 22, 2, 1113);
    private static readonly IRON_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2351, 1175, 1, 1122, 2, 1104, 23, 2, 1114);
    private static readonly IRON_WARHAMMER = new SmithableEquipment("Warhammer", 2351, 1335, 1, 1120, 2, 1083, 24, 3, 1118);
    private static readonly IRON_BATTLE_AXE = new SmithableEquipment("Battle axe", 2351, 1363, 1, 1120, 3, 1092, 25, 3, 1095);
    private static readonly IRON_CHAINBODY = new SmithableEquipment("Chainbody", 2351, 1101, 1, 1121, 0, 1098, 26, 3, 1109);
    private static readonly IRON_KITE_SHIELD = new SmithableEquipment("Kite shield", 2351, 1191, 1, 1122, 3, 1105, 27, 3, 1115);
    private static readonly IRON_CLAWS = new SmithableEquipment("Claws", 2351, 3096, 1, 1120, 4, 8429, 28, 2, 8428);
    private static readonly IRON_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2351, 1309, 1, 1119, 4, 1088, 29, 3, 1090);
    private static readonly IRON_PLATESKIRT = new SmithableEquipment("Plate skirt", 2351, 1081, 1, 1121, 2, 1100, 31, 3, 1111);
    private static readonly IRON_PLATELEGS = new SmithableEquipment("Plate legs", 2351, 1067, 1, 1121, 1, 1099, 31, 3, 1110);
    private static readonly IRON_PLATEBODY = new SmithableEquipment("Plate body", 2351, 1115, 1, 1121, 3, 1101, 33, 5, 1112);
    private static readonly IRON_NAILS = new SmithableEquipment("Nails", 2351, 4820, 15, 1122, 4, 13358, 19, 1, 13357);
    private static readonly IRON_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2351, 9377, 10, 1121, 4, 11461, 19, 1, 11459);

    private static readonly STEEL_DAGGER = new SmithableEquipment("Dagger", 2353, 1207, 1, 1119, 0, 1094, 30, 1, 1125);
    private static readonly STEEL_AXE = new SmithableEquipment("Axe", 2353, 1353, 1, 1120, 0, 1091, 31, 1, 1126);
    private static readonly STEEL_MACE = new SmithableEquipment("Mace", 2353, 1424, 1, 1120, 1, 1093, 32, 1, 1129);
    private static readonly STEEL_MED_HELM = new SmithableEquipment("Med helm", 2353, 1141, 1, 1122, 0, 1102, 33, 1, 1127);
    private static readonly STEEL_DART_TIPS = new SmithableEquipment("Dart tips", 2353, 821, 10, 1123, 0, 1107, 34, 1, 1128);
    private static readonly STEEL_SWORD = new SmithableEquipment("Sword", 2353, 1281, 1, 1119, 1, 1085, 34, 1, 1124);
    private static readonly STEEL_ARROWTIPS = new SmithableEquipment("Arrowtips", 2353, 41, 15, 1123, 1, 1108, 35, 1, 1130);
    private static readonly STEEL_SCIMITAR = new SmithableEquipment("Scimitar", 2353, 1325, 1, 1119, 2, 1087, 35, 2, 1116);
    private static readonly STEEL_LONG_SWORD = new SmithableEquipment("Long sword", 2353, 1295, 1, 1119, 3, 1086, 36, 2, 1089);
    private static readonly STEEL_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2353, 865, 5, 1123, 2, 1106, 37, 1, 1131);
    private static readonly STEEL_FULL_HELM = new SmithableEquipment("Full helm", 2353, 1157, 1, 1122, 1, 1103, 37, 2, 1113);
    private static readonly STEEL_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2353, 1177, 1, 1122, 2, 1104, 38, 2, 1114);
    private static readonly STEEL_WARHAMMER = new SmithableEquipment("Warhammer", 2353, 1339, 1, 1120, 2, 1083, 39, 3, 1118);
    private static readonly STEEL_BATTLE_AXE = new SmithableEquipment("Battle axe", 2353, 1365, 1, 1120, 3, 1092, 40, 3, 1095);
    private static readonly STEEL_CHAINBODY = new SmithableEquipment("Chainbody", 2353, 1105, 1, 1121, 0, 1098, 41, 3, 1109);
    private static readonly STEEL_KITE_SHIELD = new SmithableEquipment("Kite shield", 2353, 1193, 1, 1122, 3, 1105, 42, 3, 1115);
    private static readonly STEEL_CLAWS = new SmithableEquipment("Claws", 2353, 3097, 1, 1120, 4, 8429, 43, 2, 8428);
    private static readonly STEEL_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2353, 1311, 1, 1119, 4, 1088, 44, 3, 1090);
    private static readonly STEEL_PLATESKIRT = new SmithableEquipment("Plate skirt", 2353, 1083, 1, 1121, 2, 1100, 46, 3, 1111);
    private static readonly STEEL_PLATELEGS = new SmithableEquipment("Plate legs", 2353, 1069, 1, 1121, 1, 1099, 46, 3, 1110);
    private static readonly STEEL_PLATEBODY = new SmithableEquipment("Plate body", 2353, 1119, 1, 1121, 3, 1101, 48, 5, 1112);
    private static readonly STEEL_NAILS = new SmithableEquipment("Nails", 2353, 1539, 15, 1122, 4, 13358, 34, 1, 13357);
    private static readonly STEEL_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2353, 9378, 10, 1121, 4, 11461, 33, 1, 11459);
    private static readonly CANNONBALL = new SmithableEquipment("Cannon ball", 2353, 2, 4, 1123, 3, 1096, 35, 1, 1132);
    private static readonly STEEL_STUDS = new SmithableEquipment("Studs", 2353, 2370, 1, 1123, 4, 1134, 36, 1, 1135);

    private static readonly MITHRIL_DAGGER = new SmithableEquipment("Dagger", 2359, 1209, 1, 1119, 0, 1094, 50, 1, 1125);
    private static readonly MITHRIL_AXE = new SmithableEquipment("Axe", 2359, 1355, 1, 1120, 0, 1091, 51, 1, 1126);
    private static readonly MITHRIL_MACE = new SmithableEquipment("Mace", 2359, 1428, 1, 1120, 1, 1093, 52, 1, 1129);
    private static readonly MITHRIL_MED_HELM = new SmithableEquipment("Med helm", 2359, 1143, 1, 1122, 0, 1102, 53, 1, 1127);
    private static readonly MITHRIL_DART_TIPS = new SmithableEquipment("Dart tips", 2359, 822, 10, 1123, 0, 1107, 54, 1, 1128);
    private static readonly MITHRIL_SWORD = new SmithableEquipment("Sword", 2359, 1285, 1, 1119, 1, 1085, 54, 1, 1124);
    private static readonly MITHRIL_ARROWTIPS = new SmithableEquipment("Arrowtips", 2359, 42, 15, 1123, 1, 1108, 55, 1, 1130);
    private static readonly MITHRIL_SCIMITAR = new SmithableEquipment("Scimitar", 2359, 1329, 1, 1119, 2, 1087, 55, 2, 1116);
    private static readonly MITHRIL_LONG_SWORD = new SmithableEquipment("Long sword", 2359, 1299, 1, 1119, 3, 1086, 56, 2, 1089);
    private static readonly MITHRIL_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2359, 866, 5, 1123, 2, 1106, 57, 1, 1131);
    private static readonly MITHRIL_FULL_HELM = new SmithableEquipment("Full helm", 2359, 1159, 1, 1122, 1, 1103, 57, 2, 1113);
    private static readonly MITHRIL_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2359, 1181, 1, 1122, 2, 1104, 58, 2, 1114);
    private static readonly MITHRIL_WARHAMMER = new SmithableEquipment("Warhammer", 2359, 1343, 1, 1120, 2, 1083, 59, 3, 1118);
    private static readonly MITHRIL_BATTLE_AXE = new SmithableEquipment("Battle axe", 2359, 1369, 1, 1120, 3, 1092, 60, 3, 1095);
    private static readonly MITHRIL_CHAINBODY = new SmithableEquipment("Chainbody", 2359, 1109, 1, 1121, 0, 1098, 61, 3, 1109);
    private static readonly MITHRIL_KITE_SHIELD = new SmithableEquipment("Kite shield", 2359, 1197, 1, 1122, 3, 1105, 62, 3, 1115);
    private static readonly MITHRIL_CLAWS = new SmithableEquipment("Claws", 2359, 3099, 1, 1120, 4, 8429, 63, 2, 8428);
    private static readonly MITHRIL_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2359, 1315, 1, 1119, 4, 1088, 64, 3, 1090);
    private static readonly MITHRIL_PLATESKIRT = new SmithableEquipment("Plate skirt", 2359, 1085, 1, 1121, 2, 1100, 66, 3, 1111);
    private static readonly MITHRIL_PLATELEGS = new SmithableEquipment("Plate legs", 2359, 1071, 1, 1121, 1, 1099, 66, 3, 1110);
    private static readonly MITHRIL_PLATEBODY = new SmithableEquipment("Plate body", 2359, 1121, 1, 1121, 3, 1101, 68, 5, 1112);
    private static readonly MITHRIL_NAILS = new SmithableEquipment("Nails", 2359, 4822, 15, 1122, 4, 13358, 54, 1, 13357);
    private static readonly MITHRIL_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2359, 9379, 10, 1121, 4, 11461, 53, 1, 11459);

    private static readonly ADAMANT_DAGGER = new SmithableEquipment("Dagger", 2361, 1211, 1, 1119, 0, 1094, 70, 1, 1125);
    private static readonly ADAMANT_AXE = new SmithableEquipment("Axe", 2361, 1357, 1, 1120, 0, 1091, 71, 1, 1126);
    private static readonly ADAMANT_MACE = new SmithableEquipment("Mace", 2361, 1430, 1, 1120, 1, 1093, 72, 1, 1129);
    private static readonly ADAMANT_MED_HELM = new SmithableEquipment("Med helm", 2361, 1145, 1, 1122, 0, 1102, 73, 1, 1127);
    private static readonly ADAMANT_DART_TIPS = new SmithableEquipment("Dart tips", 2361, 823, 10, 1123, 0, 1107, 74, 1, 1128);
    private static readonly ADAMANT_SWORD = new SmithableEquipment("Sword", 2361, 1287, 1, 1119, 1, 1085, 74, 1, 1124);
    private static readonly ADAMANT_ARROWTIPS = new SmithableEquipment("Arrowtips", 2361, 43, 15, 1123, 1, 1108, 75, 1, 1130);
    private static readonly ADAMANT_SCIMITAR = new SmithableEquipment("Scimitar", 2361, 1331, 1, 1119, 2, 1087, 75, 2, 1116);
    private static readonly ADAMANT_LONG_SWORD = new SmithableEquipment("Long sword", 2361, 1301, 1, 1119, 3, 1086, 76, 2, 1089);
    private static readonly ADAMANT_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2361, 867, 5, 1123, 2, 1106, 77, 1, 1131);
    private static readonly ADAMANT_FULL_HELM = new SmithableEquipment("Full helm", 2361, 1161, 1, 1122, 1, 1103, 77, 2, 1113);
    private static readonly ADAMANT_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2361, 1183, 1, 1122, 2, 1104, 78, 2, 1114);
    private static readonly ADAMANT_WARHAMMER = new SmithableEquipment("Warhammer", 2361, 1345, 1, 1120, 2, 1083, 79, 3, 1118);
    private static readonly ADAMANT_BATTLE_AXE = new SmithableEquipment("Battle axe", 2361, 1371, 1, 1120, 3, 1092, 80, 3, 1095);
    private static readonly ADAMANT_CHAINBODY = new SmithableEquipment("Chainbody", 2361, 1111, 1, 1121, 0, 1098, 81, 3, 1109);
    private static readonly ADAMANT_KITE_SHIELD = new SmithableEquipment("Kite shield", 2361, 1199, 1, 1122, 3, 1105, 82, 3, 1115);
    private static readonly ADAMANT_CLAWS = new SmithableEquipment("Claws", 2361, 3100, 1, 1120, 4, 8429, 83, 2, 8428);
    private static readonly ADAMANT_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2361, 1317, 1, 1119, 4, 1088, 84, 3, 1090);
    private static readonly ADAMANT_PLATESKIRT = new SmithableEquipment("Plate skirt", 2361, 1091, 1, 1121, 2, 1100, 86, 3, 1111);
    private static readonly ADAMANT_PLATELEGS = new SmithableEquipment("Plate legs", 2361, 1073, 1, 1121, 1, 1099, 86, 3, 1110);
    private static readonly ADAMANT_PLATEBODY = new SmithableEquipment("Plate body", 2361, 1123, 1, 1121, 3, 1101, 88, 5, 1112);
    private static readonly ADAMANT_NAILS = new SmithableEquipment("Nails", 2361, 4823, 15, 1122, 4, 13358, 74, 1, 13357);
    private static readonly ADAMANT_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2361, 9380, 10, 1121, 4, 11461, 73, 1, 11459);

    private static readonly RUNE_DAGGER = new SmithableEquipment("Dagger", 2363, 1213, 1, 1119, 0, 1094, 85, 1, 1125);
    private static readonly RUNE_AXE = new SmithableEquipment("Axe", 2363, 1359, 1, 1120, 0, 1091, 86, 1, 1126);
    private static readonly RUNE_MACE = new SmithableEquipment("Mace", 2363, 1432, 1, 1120, 1, 1093, 87, 1, 1129);
    private static readonly RUNE_MED_HELM = new SmithableEquipment("Med helm", 2363, 1147, 1, 1122, 0, 1102, 88, 1, 1127);
    private static readonly RUNE_DART_TIPS = new SmithableEquipment("Dart tips", 2363, 824, 10, 1123, 0, 1107, 89, 1, 1128);
    private static readonly RUNE_SWORD = new SmithableEquipment("Sword", 2363, 1289, 1, 1119, 1, 1085, 89, 1, 1124);
    private static readonly RUNE_ARROWTIPS = new SmithableEquipment("Arrowtips", 2363, 44, 15, 1123, 1, 1108, 90, 1, 1130);
    private static readonly RUNE_SCIMITAR = new SmithableEquipment("Scimitar", 2363, 1333, 1, 1119, 2, 1087, 90, 2, 1116);
    private static readonly RUNE_LONG_SWORD = new SmithableEquipment("Long sword", 2363, 1303, 1, 1119, 3, 1086, 91, 2, 1089);
    private static readonly RUNE_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2363, 868, 5, 1123, 2, 1106, 92, 1, 1131);
    private static readonly RUNE_FULL_HELM = new SmithableEquipment("Full helm", 2363, 1163, 1, 1122, 1, 1103, 92, 2, 1113);
    private static readonly RUNE_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2363, 1185, 1, 1122, 2, 1104, 93, 2, 1114);
    private static readonly RUNE_WARHAMMER = new SmithableEquipment("Warhammer", 2363, 1347, 1, 1120, 2, 1083, 94, 3, 1118);
    private static readonly RUNE_BATTLE_AXE = new SmithableEquipment("Battle axe", 2363, 1373, 1, 1120, 3, 1092, 95, 3, 1095);
    private static readonly RUNE_CHAINBODY = new SmithableEquipment("Chainbody", 2363, 1113, 1, 1121, 0, 1098, 96, 3, 1109);
    private static readonly RUNE_KITE_SHIELD = new SmithableEquipment("Kite shield", 2363, 1201, 1, 1122, 3, 1105, 97, 3, 1115);
    private static readonly RUNE_CLAWS = new SmithableEquipment("Claws", 2363, 3101, 1, 1120, 4, 8429, 98, 2, 8428);
    private static readonly RUNE_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2363, 1319, 1, 1119, 4, 1088, 99, 3, 1090);
    private static readonly RUNE_PLATESKIRT = new SmithableEquipment("Plate skirt", 2363, 1093, 1, 1121, 2, 1100, 99, 3, 1111);
    private static readonly RUNE_PLATELEGS = new SmithableEquipment("Plate legs", 2363, 1079, 1, 1121, 1, 1099, 99, 3, 1110);
    private static readonly RUNE_PLATEBODY = new SmithableEquipment("Plate body", 2363, 1127, 1, 1121, 3, 1101, 99, 5, 1112);
    private static readonly RUNE_NAILS = new SmithableEquipment("Nails", 2363, 4824, 15, 1122, 4, 13358, 89, 1, 13357);
    private static readonly RUNE_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2363, 9381, 10, 1121, 4, 11461, 88, 1, 11459);

    public static readonly RUNE_ITEMS = (
        SmithableEquipment.RUNE_DAGGER,
        SmithableEquipment.RUNE_AXE,
        SmithableEquipment.RUNE_MACE,
        SmithableEquipment.RUNE_MED_HELM,
        SmithableEquipment.RUNE_DART_TIPS,
        SmithableEquipment.RUNE_SWORD,
        SmithableEquipment.RUNE_ARROWTIPS,
        SmithableEquipment.RUNE_SCIMITAR,
        SmithableEquipment.RUNE_LONG_SWORD,
        SmithableEquipment.RUNE_THROWING_KNIVES,
        SmithableEquipment.RUNE_FULL_HELM,
        SmithableEquipment.RUNE_SQUARE_SHIELD,
        SmithableEquipment.RUNE_WARHAMMER,
        SmithableEquipment.RUNE_BATTLE_AXE,
        SmithableEquipment.RUNE_CHAINBODY,
        SmithableEquipment.RUNE_KITE_SHIELD,
        SmithableEquipment.RUNE_CLAWS,
        SmithableEquipment.RUNE_2_HAND_SWORD,
        SmithableEquipment.RUNE_PLATESKIRT,
        SmithableEquipment.RUNE_PLATELEGS,
        SmithableEquipment.RUNE_PLATEBODY,
        SmithableEquipment.RUNE_NAILS,
        SmithableEquipment.RUNE_UNF_BOLTS
    );

    public static readonly ADAMANT_ITEMS = (
        SmithableEquipment.ADAMANT_DAGGER,
        SmithableEquipment.ADAMANT_AXE,
        SmithableEquipment.ADAMANT_MACE,
        SmithableEquipment.ADAMANT_MED_HELM,
        SmithableEquipment.ADAMANT_DART_TIPS,
        SmithableEquipment.ADAMANT_SWORD,
        SmithableEquipment.ADAMANT_ARROWTIPS,
        SmithableEquipment.ADAMANT_SCIMITAR,
        SmithableEquipment.ADAMANT_LONG_SWORD,
        SmithableEquipment.ADAMANT_THROWING_KNIVES,
        SmithableEquipment.ADAMANT_FULL_HELM,
        SmithableEquipment.ADAMANT_SQUARE_SHIELD,
        SmithableEquipment.ADAMANT_WARHAMMER,
        SmithableEquipment.ADAMANT_BATTLE_AXE,
        SmithableEquipment.ADAMANT_CHAINBODY,
        SmithableEquipment.ADAMANT_KITE_SHIELD,
        SmithableEquipment.ADAMANT_CLAWS,
        SmithableEquipment.ADAMANT_2_HAND_SWORD,
        SmithableEquipment.ADAMANT_PLATESKIRT,
        SmithableEquipment.ADAMANT_PLATELEGS,
        SmithableEquipment.ADAMANT_PLATEBODY,
        SmithableEquipment.ADAMANT_NAILS,
        SmithableEquipment.ADAMANT_UNF_BOLTS
    );
    public static readonly MITHRIL_ITEMS = (
        SmithableEquipment.MITHRIL_DAGGER,
        SmithableEquipment.MITHRIL_AXE,
        SmithableEquipment.MITHRIL_MACE,
        SmithableEquipment.MITHRIL_MED_HELM,
        SmithableEquipment.MITHRIL_DART_TIPS,
        SmithableEquipment.MITHRIL_SWORD,
        SmithableEquipment.MITHRIL_ARROWTIPS,
        SmithableEquipment.MITHRIL_SCIMITAR,
        SmithableEquipment.MITHRIL_LONG_SWORD,
        SmithableEquipment.MITHRIL_THROWING_KNIVES,
        SmithableEquipment.MITHRIL_FULL_HELM,
        SmithableEquipment.MITHRIL_SQUARE_SHIELD,
        SmithableEquipment.MITHRIL_WARHAMMER,
        SmithableEquipment.MITHRIL_BATTLE_AXE,
        SmithableEquipment.MITHRIL_CHAINBODY,
        SmithableEquipment.MITHRIL_KITE_SHIELD
    );
    public static readonly STEEL_ITEMS = (
        SmithableEquipment.STEEL_DAGGER,
        SmithableEquipment.STEEL_AXE,
        SmithableEquipment.STEEL_MACE,
        SmithableEquipment.STEEL_MED_HELM,
        SmithableEquipment.STEEL_DART_TIPS,
        SmithableEquipment.STEEL_SWORD,
        SmithableEquipment.STEEL_ARROWTIPS,
        SmithableEquipment.STEEL_SCIMITAR,
        SmithableEquipment.STEEL_LONG_SWORD,
        SmithableEquipment.STEEL_THROWING_KNIVES,
        SmithableEquipment.STEEL_FULL_HELM,
        SmithableEquipment.STEEL_SQUARE_SHIELD,
        SmithableEquipment.STEEL_BATTLE_AXE,
        SmithableEquipment.STEEL_CHAINBODY,
        SmithableEquipment.STEEL_KITE_SHIELD,
        SmithableEquipment.STEEL_CLAWS,
        SmithableEquipment.STEEL_2_HAND_SWORD,
        SmithableEquipment.STEEL_PLATESKIRT,
        SmithableEquipment.STEEL_PLATELEGS,
        SmithableEquipment.STEEL_PLATEBODY,
        SmithableEquipment.STEEL_NAILS,
        SmithableEquipment.STEEL_UNF_BOLTS,
        SmithableEquipment.STEEL_STUDS,
        SmithableEquipment.CANNONBALL
    );

    public static readonly IRON_ITEMS = (
        SmithableEquipment.IRON_DAGGER,
        SmithableEquipment.IRON_AXE,
        SmithableEquipment.IRON_MACE,
        SmithableEquipment.IRON_MED_HELM,
        SmithableEquipment.IRON_DART_TIPS,
        SmithableEquipment.IRON_SWORD,
        SmithableEquipment.IRON_ARROWTIPS,
        SmithableEquipment.IRON_SCIMITAR,
        SmithableEquipment.IRON_LONG_SWORD,
        SmithableEquipment.IRON_THROWING_KNIVES,
        SmithableEquipment.IRON_FULL_HELM,
        SmithableEquipment.IRON_SQUARE_SHIELD,
        SmithableEquipment.IRON_WARHAMMER,
        SmithableEquipment.IRON_BATTLE_AXE,
        SmithableEquipment.IRON_CHAINBODY,
        SmithableEquipment.IRON_KITE_SHIELD,
        SmithableEquipment.IRON_CLAWS,
        SmithableEquipment.IRON_2_HAND_SWORD,
        SmithableEquipment.IRON_PLATESKIRT,
        SmithableEquipment.IRON_PLATELEGS,
        SmithableEquipment.IRON_PLATEBODY,
        SmithableEquipment.IRON_NAILS,
        SmithableEquipment.IRON_UNF_BOLTS
    );

    public static readonly BRONZE_ITEMS = (
        SmithableEquipment.BRONZE_DAGGER,
        SmithableEquipment.BRONZE_AXE,
        SmithableEquipment.BRONZE_MACE,
        SmithableEquipment.BRONZE_MED_HELM,
        SmithableEquipment.BRONZE_DART_TIPS,
        SmithableEquipment.BRONZE_SWORD,
        SmithableEquipment.BRONZE_ARROWTIPS,
        SmithableEquipment.BRONZE_SCIMITAR,
        SmithableEquipment.BRONZE_LONG_SWORD,
        SmithableEquipment.BRONZE_THROWING_KNIVES,
        SmithableEquipment.BRONZE_FULL_HELM,
        SmithableEquipment.BRONZE_SQUARE_SHIELD,
        SmithableEquipment.BRONZE_WARHAMMER,
        SmithableEquipment.BRONZE_BATTLE_AXE,
        SmithableEquipment.BRONZE_CHAINBODY,
        SmithableEquipment.BRONZE_KITE_SHIELD,
        SmithableEquipment.BRONZE_CLAWS,
        SmithableEquipment.BRONZE_2_HAND_SWORD,
        SmithableEquipment.BRONZE_PLATESKIRT,
        SmithableEquipment.BRONZE_PLATELEGS,
        SmithableEquipment.BRONZE_PLATEBODY,
        SmithableEquipment.BRONZE_NAILS,
        SmithableEquipment.BRONZE_UNF_BOLTS
    );

    private name: string;
    private barId: number;
    private itemId: number;
    private amount: number;
    private itemFrame: number;
    private itemSlot: number;
    private nameFrame: number;
    private requiredLevel: number;
    private barsRequired: number;
    private barFrame: number;

    constructor(
        name: string,
        barId: number,
        itemId: number,
        amount: number,
        itemFrame: number,
        itemSlot: number,
        nameFrame: number,
        requiredLevel: number,
        barsRequired: number,
        barFrame: number
    ) {
        this.name = name;
        this.barId = barId;
        this.itemId = itemId;
        this.amount = amount;
        this.itemFrame = itemFrame;
        this.itemSlot = itemSlot;
        this.nameFrame = nameFrame;
        this.requiredLevel = requiredLevel;
        this.barsRequired = barsRequired;
        this.barFrame = barFrame;
    }

    getItemId(): number {
        return this.itemId;
    }

    getAmount(): number {
        return this.amount;
    }

    getItemFrame(): number {
        return this.itemFrame;
    }

    getItemSlot(): number {
        return this.itemSlot;
    }

    getNameFrame(): number {
        return this.nameFrame;
    }

    getRequiredLevel(): number {
        return this.requiredLevel;
    }

    getBarsRequired(): number {
        return this.barsRequired;
    }

    getBarFrame(): number {
        return this.barFrame;
    }

    getBarId(): number {
        return this.barId;
    }

    getName(): string {
        return this.name;
    }
}

export class Bar {
    public static readonly BRONZE_BAR: Bar = new Bar(
        2349,
        [new RequiredItem(new Item(438), true), new RequiredItem(new Item(436), true)],
        1,
        120,
        2405,
        [[3987, 1], [3986, 5], [2807, 10], [2414, -1]],
        (SmithableEquipment.BRONZE_ITEMS),
    );
    public static readonly IRON_BAR: Bar = new Bar(
        2351,
        [new RequiredItem(new Item(440), true)],
        15,
        540,
        2406,
        [[3991, 1], [3990, 5], [3989, 10], [3988, -1]],
        (SmithableEquipment.IRON_ITEMS),
    );
    public static readonly SILVER_BAR: Bar = new Bar(
        2355,
        [new RequiredItem(new Item(442), true)],
        20,
        725,
        2407,
        [[3995, 1], [3994, 5], [3993, 10], [3992, -1]]
    );
    public static readonly STEEL_BAR: Bar = new Bar(
        2353,
        [new RequiredItem(new Item(440), true), new RequiredItem(new Item(453, 2), true)],
        30,
        1350,
        2409,
        [[3999, 1], [3998, 5], [3997, 10], [3996, -1]]
    );
    public static readonly GOLD_BAR: Bar = new Bar(
        2357,
        [new RequiredItem(new Item(444), true)],
        40,
        2400,
        2410,
        [[4003, 1], [4002, 5], [4001, 10], [4000, -1]],
    );
    public static readonly MITHRIL_BAR: Bar = new Bar(
        2359,
        [new RequiredItem(new Item(447), true), new RequiredItem(new Item(453, 4), true)],
        50,
        3450,
        2411,
        [[7441, 1], [7440, 5], [6397, 10], [4158, -1]],
        (SmithableEquipment.MITHRIL_ITEMS)
    );
    public static readonly ADAMANTITE_BAR: Bar = new Bar(
        2361,
        [new RequiredItem(new Item(449), true), new RequiredItem(new Item(453, 6), true)],
        70,
        4500,
        2412,
        [[7446, 1], [7444, 5], [7443, 10], [7442, -1]],
        (SmithableEquipment.ADAMANT_ITEMS)
    );
    public static readonly RUNITE_BAR: Bar = new Bar(
        2363,
        [new RequiredItem(new Item(451), true), new RequiredItem(new Item(453, 8), true)],
        85,
        5560,
        2413,
        [[7450, 1], [7446, 5], [7448, 10], [7447, -1]],
        (SmithableEquipment.ADAMANT_ITEMS)
    );

    private static smeltables: Map<number, Bar> = new Map<number, Bar>();
    public bar: number;
    public ores: RequiredItem[];
    public levelReq: number;
    public xpReward: number;
    public frame: number;
    public buttons: number[][];
    public items?: SmithableEquipment

    static {
        for (const s of Object.values(Bar)) {
            Bar.smeltables.set(s.bar, s);
        }
    }

    constructor(
        bar: number,
        ores: RequiredItem[],
        levelReq: number,
        xpReward: number,
        frame: number,
        buttons: number[][],
        items?: SmithableEquipment
    ) {
        this.bar = bar;
        this.ores = ores;
        this.levelReq = levelReq;
        this.xpReward = xpReward;
        this.frame = frame;
        this.buttons = buttons;
        this.items = items;
    }

    public static forBarId(barId: number): Bar {
        return Bar.smeltables.get(barId);
    }

    public getBar(): number {
        return this.bar;
    }

    public getOres(): RequiredItem[] {
        return this.ores;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }

    public getXpReward(): number {
        return this.xpReward;
    }

    public getFrame(): number {
        return this.frame;
    }

    public getItems(): SmithableEquipment {
        return this.items;
    }

    public getButtons(): number[][] {
        return this.buttons;
    }
}

export class EquipmentMaking {

    /**
    
    The interface used for creating equipment using the
    Smithing skill.
    */
    public static readonly EQUIPMENT_CREATION_INTERFACE_ID = 994;
    /**
    
    The interface ids used for selecting an item to create in the
    {@code EQUIPMENT_CREATION_INTERFACE_ID}.
    */
    public static readonly EQUIPMENT_CREATION_COLUMN_1 = 1119;
    public static readonly EQUIPMENT_CREATION_COLUMN_2 = 1120;
    public static readonly EQUIPMENT_CREATION_COLUMN_3 = 1121;
    public static readonly EQUIPMENT_CREATION_COLUMN_4 = 1122;
    public static readonly EQUIPMENT_CREATION_COLUMN_5 = 1123;

    private value: number;

    constructor(n1: number) {
        this.value = n1;
    }

    public static openInterface(player: Player): void {
        // Search for bar..
        let bar: Bar | null = null;
        for (const b of Object.values(Bar)) {
            if (b.getItems()) {
                if (player.getInventory().contains(b.getBar())) {
                    if (player.getSkillManager().getCurrentLevel(Skill.SMITHING) >= b.getLevelReq()) {
                        bar = b;
                        break;
                    }
                }
            }
        }
        // Did we find a bar in the player's inventory?
        if (bar) {
            // First, clear the interface from items..
            for (let i = 1119; i <= 1123; i++) {
                player.getPacketSender().clearItemOnInterface(i);
            }

            // Clear slots that aren't always used..
            player.getPacketSender()
                .sendString("", 1132)
                .sendString("", 1096)
                .sendString("", 1135)
                .sendString("", 1134);

            // Go through the bar's items..
            for (const b of Object.values(bar.getItems()!)) {
                player.getPacketSender().sendSmithingData(b.getItemId(), b.getItemSlot(), b.getItemFrame(), b.getAmount());
                let barColor = "@red@";
                let itemColor = "@bla@";
                if (player.getInventory().getAmount(b.getBarId()) >= b.getBarsRequired()) {
                    barColor = "@gre@";
                }
                if (player.getSkillManager().getCurrentLevel(Skill.SMITHING) >= b.getRequiredLevel()) {
                    itemColor = "@whi@";
                }
                player.getPacketSender().sendString(barColor + b.getBarsRequired().toString() + " " + (b.getBarsRequired() > 1 ? "bars" : "bar"), b.getBarFrame());
                player.getPacketSender().sendString(itemColor + b.getName(), b.getNameFrame());
            }

            // Send interface..
            player.getPacketSender().sendInterface(EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID);
        } else {
            player.getPacketSender().sendMessage("You don't have any bars in your inventory which can be used with your Smithing level.");
        }
    }

    public static initialize(player: Player, itemId: number, interfaceId: number, slot: number, amount: number): void {
        for (const smithable of Object.values(SmithableEquipment)) {
            if (smithable.getItemId() === itemId && smithable.getItemFrame() === interfaceId && smithable.getItemSlot() === slot) {
                player.getSkillManager().startSkillable(new ItemCreationSkillable(
                    [new RequiredItem(new Item(ItemIdentifiers.HAMMER)), new RequiredItem(new Item(smithable.getBarId(), smithable.getBarsRequired()), true)],
                    new Item(smithable.getItemId(), smithable.getAmount()), amount, new AnimationLoop(new Animation(898), 3), smithable.getRequiredLevel(), 10, Skill.SMITHING));
                break;
            }
        }
    }

}

export class Smelting extends ItemCreationSkillable {
    /**
    * The {@link Animation} the character will perform
    * when smelting.
    */
    private static readonly ANIMATION = new Animation(896);

    /**
     * The bar being smelted.
     */
    private readonly bar: Bar;

    /**
     * Constructs this {@link Smelting} instance.
     *
     * @param bar
     * @param amount
     */
    constructor(bar: Bar, amount: number) {
        super(bar.getOres(), new Item(bar.getBar()), amount, new AnimationLoop(Smelting.ANIMATION, 4), bar.getLevelReq(), bar.getXpReward(), Skill.SMITHING);
        this.bar = bar;
    }

    //Override finishedCycle because we need to handle special cases
    //such as Iron ore 50% chance of failing to smelt.
    finishedCycle(player: Player): void {
        //Handle iron bar. It has a 50% chance of failing.
        if (this.bar === Bar.IRON_BAR) {
            if (Misc.getRandom(2) === 1) {
                player.getPacketSender().sendMessage("The Iron ore was too impure and you were unable to make an Iron bar.");
                //We still need to delete the ore and decrement amount.
                this.filterRequiredItems(r => r.isDelete()).forEach(r => player.getInventory().deletes(r.getItem()));
                this.decrementAmount();
                return;
            }
        }

        super.finishedCycle(player);
    }
}
