"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smelting = exports.EquipmentMaking = exports.Bar = exports.Smithing = void 0;
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var RequiredItem_1 = require("../../../../model/RequiredItem");
var Item_1 = require("../../../../model/Item");
var Skill_1 = require("../../../../model/Skill");
var Animation_1 = require("../../../../model/Animation");
var ItemCreationSkillable_1 = require("./ItemCreationSkillable");
var AnimationLoop_1 = require("../../../../model/AnimationLoop");
var Misc_1 = require("../../../../../util/Misc");
var SmiEntered = /** @class */ (function () {
    function SmiEntered(execFunc) {
        this.execFunc = execFunc;
    }
    SmiEntered.prototype.execute = function (amount) {
        this.execFunc();
    };
    return SmiEntered;
}());
var Smithing = /** @class */ (function (_super) {
    __extends(Smithing, _super);
    function Smithing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Smithing.handleButton = function (player, button) {
        var e_1, _a;
        var _loop_1 = function (bar) {
            var e_2, _d;
            try {
                for (var _e = (e_2 = void 0, __values(bar.getButtons())), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var b = _f.value;
                    if (b[0] == button) {
                        var amount = b[1];
                        if (amount == -1) {
                            player.setEnteredAmountAction(new SmiEntered(function (input) {
                                player.getSkillManager().startSkillable(new Smelting(bar, input));
                            }));
                            player.getPacketSender().sendEnterAmountPrompt("Enter amount of bars to smelt:");
                        }
                        else {
                            player.getSkillManager().startSkillable(new Smelting(bar, amount));
                        }
                        return { value: true };
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        try {
            for (var _b = __values(Object.values(Bar)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var bar = _c.value;
                var state_1 = _loop_1(bar);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    return Smithing;
}(ItemIdentifiers_1.ItemIdentifiers));
exports.Smithing = Smithing;
var SmithableEquipment = /** @class */ (function () {
    function SmithableEquipment(name, barId, itemId, amount, itemFrame, itemSlot, nameFrame, requiredLevel, barsRequired, barFrame) {
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
    SmithableEquipment.prototype.getItemId = function () {
        return this.itemId;
    };
    SmithableEquipment.prototype.getAmount = function () {
        return this.amount;
    };
    SmithableEquipment.prototype.getItemFrame = function () {
        return this.itemFrame;
    };
    SmithableEquipment.prototype.getItemSlot = function () {
        return this.itemSlot;
    };
    SmithableEquipment.prototype.getNameFrame = function () {
        return this.nameFrame;
    };
    SmithableEquipment.prototype.getRequiredLevel = function () {
        return this.requiredLevel;
    };
    SmithableEquipment.prototype.getBarsRequired = function () {
        return this.barsRequired;
    };
    SmithableEquipment.prototype.getBarFrame = function () {
        return this.barFrame;
    };
    SmithableEquipment.prototype.getBarId = function () {
        return this.barId;
    };
    SmithableEquipment.prototype.getName = function () {
        return this.name;
    };
    SmithableEquipment.BRONZE_DAGGER = new SmithableEquipment("Dagger", 2349, 1205, 1, 1119, 0, 1094, 1, 1, 1125);
    SmithableEquipment.BRONZE_AXE = new SmithableEquipment("Axe", 2349, 1351, 1, 1120, 0, 1091, 1, 1, 1126);
    SmithableEquipment.BRONZE_MACE = new SmithableEquipment("Mace", 2349, 1422, 1, 1120, 1, 1093, 2, 1, 1129);
    SmithableEquipment.BRONZE_MED_HELM = new SmithableEquipment("Med helm", 2349, 1139, 1, 1122, 0, 1102, 3, 1, 1127);
    SmithableEquipment.BRONZE_DART_TIPS = new SmithableEquipment("Dart tips", 2349, 819, 10, 1123, 0, 1107, 4, 1, 1128);
    SmithableEquipment.BRONZE_SWORD = new SmithableEquipment("Sword", 2349, 1277, 1, 1119, 1, 1085, 4, 1, 1124);
    SmithableEquipment.BRONZE_ARROWTIPS = new SmithableEquipment("Arrowtips", 2349, 39, 15, 1123, 1, 1108, 5, 1, 1130);
    SmithableEquipment.BRONZE_SCIMITAR = new SmithableEquipment("Scimitar", 2349, 1321, 1, 1119, 2, 1087, 5, 2, 1116);
    SmithableEquipment.BRONZE_LONG_SWORD = new SmithableEquipment("Long sword", 2349, 1291, 1, 1119, 3, 1086, 6, 2, 1089);
    SmithableEquipment.BRONZE_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2349, 864, 5, 1123, 2, 1106, 7, 1, 1131);
    SmithableEquipment.BRONZE_FULL_HELM = new SmithableEquipment("Full helm", 2349, 1155, 1, 1122, 1, 1103, 7, 2, 1113);
    SmithableEquipment.BRONZE_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2349, 1173, 1, 1122, 2, 1104, 8, 2, 1114);
    SmithableEquipment.BRONZE_WARHAMMER = new SmithableEquipment("Warhammer", 2349, 1337, 1, 1120, 2, 1083, 9, 3, 1118);
    SmithableEquipment.BRONZE_BATTLE_AXE = new SmithableEquipment("Battle axe", 2349, 1375, 1, 1120, 3, 1092, 10, 3, 1095);
    SmithableEquipment.BRONZE_CHAINBODY = new SmithableEquipment("Chainbody", 2349, 1103, 1, 1121, 0, 1098, 11, 3, 1109);
    SmithableEquipment.BRONZE_KITE_SHIELD = new SmithableEquipment("Kite shield", 2349, 1189, 1, 1122, 3, 1105, 12, 3, 1115);
    SmithableEquipment.BRONZE_CLAWS = new SmithableEquipment("Claws", 2349, 3095, 1, 1120, 4, 8429, 13, 2, 8428);
    SmithableEquipment.BRONZE_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2349, 1307, 1, 1119, 4, 1088, 14, 3, 1090);
    SmithableEquipment.BRONZE_PLATESKIRT = new SmithableEquipment("Plate skirt", 2349, 1087, 1, 1121, 2, 1100, 16, 3, 1111);
    SmithableEquipment.BRONZE_PLATELEGS = new SmithableEquipment("Plate legs", 2349, 1075, 1, 1121, 1, 1099, 16, 3, 1110);
    SmithableEquipment.BRONZE_PLATEBODY = new SmithableEquipment("Plate body", 2349, 1117, 1, 1121, 3, 1101, 18, 5, 1112);
    SmithableEquipment.BRONZE_NAILS = new SmithableEquipment("Nails", 2349, 4819, 15, 1122, 4, 13358, 4, 1, 13357);
    SmithableEquipment.BRONZE_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2349, 9375, 10, 1121, 4, 11461, 3, 1, 11459);
    SmithableEquipment.IRON_DAGGER = new SmithableEquipment("Dagger", 2351, 1203, 1, 1119, 0, 1094, 15, 1, 1125);
    SmithableEquipment.IRON_AXE = new SmithableEquipment("Axe", 2351, 1349, 1, 1120, 0, 1091, 16, 1, 1126);
    SmithableEquipment.IRON_MACE = new SmithableEquipment("Mace", 2351, 1420, 1, 1120, 1, 1093, 17, 1, 1129);
    SmithableEquipment.IRON_MED_HELM = new SmithableEquipment("Med helm", 2351, 1137, 1, 1122, 0, 1102, 18, 1, 1127);
    SmithableEquipment.IRON_DART_TIPS = new SmithableEquipment("Dart tips", 2351, 820, 10, 1123, 0, 1107, 19, 1, 1128);
    SmithableEquipment.IRON_SWORD = new SmithableEquipment("Sword", 2351, 1279, 1, 1119, 1, 1085, 19, 1, 1124);
    SmithableEquipment.IRON_ARROWTIPS = new SmithableEquipment("Arrowtips", 2351, 40, 15, 1123, 1, 1108, 20, 1, 1130);
    SmithableEquipment.IRON_SCIMITAR = new SmithableEquipment("Scimitar", 2351, 1323, 1, 1119, 2, 1087, 20, 2, 1116);
    SmithableEquipment.IRON_LONG_SWORD = new SmithableEquipment("Long sword", 2351, 1293, 1, 1119, 3, 1086, 21, 2, 1089);
    SmithableEquipment.IRON_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2351, 863, 5, 1123, 2, 1106, 22, 1, 1131);
    SmithableEquipment.IRON_FULL_HELM = new SmithableEquipment("Full helm", 2351, 1153, 1, 1122, 1, 1103, 22, 2, 1113);
    SmithableEquipment.IRON_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2351, 1175, 1, 1122, 2, 1104, 23, 2, 1114);
    SmithableEquipment.IRON_WARHAMMER = new SmithableEquipment("Warhammer", 2351, 1335, 1, 1120, 2, 1083, 24, 3, 1118);
    SmithableEquipment.IRON_BATTLE_AXE = new SmithableEquipment("Battle axe", 2351, 1363, 1, 1120, 3, 1092, 25, 3, 1095);
    SmithableEquipment.IRON_CHAINBODY = new SmithableEquipment("Chainbody", 2351, 1101, 1, 1121, 0, 1098, 26, 3, 1109);
    SmithableEquipment.IRON_KITE_SHIELD = new SmithableEquipment("Kite shield", 2351, 1191, 1, 1122, 3, 1105, 27, 3, 1115);
    SmithableEquipment.IRON_CLAWS = new SmithableEquipment("Claws", 2351, 3096, 1, 1120, 4, 8429, 28, 2, 8428);
    SmithableEquipment.IRON_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2351, 1309, 1, 1119, 4, 1088, 29, 3, 1090);
    SmithableEquipment.IRON_PLATESKIRT = new SmithableEquipment("Plate skirt", 2351, 1081, 1, 1121, 2, 1100, 31, 3, 1111);
    SmithableEquipment.IRON_PLATELEGS = new SmithableEquipment("Plate legs", 2351, 1067, 1, 1121, 1, 1099, 31, 3, 1110);
    SmithableEquipment.IRON_PLATEBODY = new SmithableEquipment("Plate body", 2351, 1115, 1, 1121, 3, 1101, 33, 5, 1112);
    SmithableEquipment.IRON_NAILS = new SmithableEquipment("Nails", 2351, 4820, 15, 1122, 4, 13358, 19, 1, 13357);
    SmithableEquipment.IRON_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2351, 9377, 10, 1121, 4, 11461, 19, 1, 11459);
    SmithableEquipment.STEEL_DAGGER = new SmithableEquipment("Dagger", 2353, 1207, 1, 1119, 0, 1094, 30, 1, 1125);
    SmithableEquipment.STEEL_AXE = new SmithableEquipment("Axe", 2353, 1353, 1, 1120, 0, 1091, 31, 1, 1126);
    SmithableEquipment.STEEL_MACE = new SmithableEquipment("Mace", 2353, 1424, 1, 1120, 1, 1093, 32, 1, 1129);
    SmithableEquipment.STEEL_MED_HELM = new SmithableEquipment("Med helm", 2353, 1141, 1, 1122, 0, 1102, 33, 1, 1127);
    SmithableEquipment.STEEL_DART_TIPS = new SmithableEquipment("Dart tips", 2353, 821, 10, 1123, 0, 1107, 34, 1, 1128);
    SmithableEquipment.STEEL_SWORD = new SmithableEquipment("Sword", 2353, 1281, 1, 1119, 1, 1085, 34, 1, 1124);
    SmithableEquipment.STEEL_ARROWTIPS = new SmithableEquipment("Arrowtips", 2353, 41, 15, 1123, 1, 1108, 35, 1, 1130);
    SmithableEquipment.STEEL_SCIMITAR = new SmithableEquipment("Scimitar", 2353, 1325, 1, 1119, 2, 1087, 35, 2, 1116);
    SmithableEquipment.STEEL_LONG_SWORD = new SmithableEquipment("Long sword", 2353, 1295, 1, 1119, 3, 1086, 36, 2, 1089);
    SmithableEquipment.STEEL_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2353, 865, 5, 1123, 2, 1106, 37, 1, 1131);
    SmithableEquipment.STEEL_FULL_HELM = new SmithableEquipment("Full helm", 2353, 1157, 1, 1122, 1, 1103, 37, 2, 1113);
    SmithableEquipment.STEEL_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2353, 1177, 1, 1122, 2, 1104, 38, 2, 1114);
    SmithableEquipment.STEEL_WARHAMMER = new SmithableEquipment("Warhammer", 2353, 1339, 1, 1120, 2, 1083, 39, 3, 1118);
    SmithableEquipment.STEEL_BATTLE_AXE = new SmithableEquipment("Battle axe", 2353, 1365, 1, 1120, 3, 1092, 40, 3, 1095);
    SmithableEquipment.STEEL_CHAINBODY = new SmithableEquipment("Chainbody", 2353, 1105, 1, 1121, 0, 1098, 41, 3, 1109);
    SmithableEquipment.STEEL_KITE_SHIELD = new SmithableEquipment("Kite shield", 2353, 1193, 1, 1122, 3, 1105, 42, 3, 1115);
    SmithableEquipment.STEEL_CLAWS = new SmithableEquipment("Claws", 2353, 3097, 1, 1120, 4, 8429, 43, 2, 8428);
    SmithableEquipment.STEEL_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2353, 1311, 1, 1119, 4, 1088, 44, 3, 1090);
    SmithableEquipment.STEEL_PLATESKIRT = new SmithableEquipment("Plate skirt", 2353, 1083, 1, 1121, 2, 1100, 46, 3, 1111);
    SmithableEquipment.STEEL_PLATELEGS = new SmithableEquipment("Plate legs", 2353, 1069, 1, 1121, 1, 1099, 46, 3, 1110);
    SmithableEquipment.STEEL_PLATEBODY = new SmithableEquipment("Plate body", 2353, 1119, 1, 1121, 3, 1101, 48, 5, 1112);
    SmithableEquipment.STEEL_NAILS = new SmithableEquipment("Nails", 2353, 1539, 15, 1122, 4, 13358, 34, 1, 13357);
    SmithableEquipment.STEEL_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2353, 9378, 10, 1121, 4, 11461, 33, 1, 11459);
    SmithableEquipment.CANNONBALL = new SmithableEquipment("Cannon ball", 2353, 2, 4, 1123, 3, 1096, 35, 1, 1132);
    SmithableEquipment.STEEL_STUDS = new SmithableEquipment("Studs", 2353, 2370, 1, 1123, 4, 1134, 36, 1, 1135);
    SmithableEquipment.MITHRIL_DAGGER = new SmithableEquipment("Dagger", 2359, 1209, 1, 1119, 0, 1094, 50, 1, 1125);
    SmithableEquipment.MITHRIL_AXE = new SmithableEquipment("Axe", 2359, 1355, 1, 1120, 0, 1091, 51, 1, 1126);
    SmithableEquipment.MITHRIL_MACE = new SmithableEquipment("Mace", 2359, 1428, 1, 1120, 1, 1093, 52, 1, 1129);
    SmithableEquipment.MITHRIL_MED_HELM = new SmithableEquipment("Med helm", 2359, 1143, 1, 1122, 0, 1102, 53, 1, 1127);
    SmithableEquipment.MITHRIL_DART_TIPS = new SmithableEquipment("Dart tips", 2359, 822, 10, 1123, 0, 1107, 54, 1, 1128);
    SmithableEquipment.MITHRIL_SWORD = new SmithableEquipment("Sword", 2359, 1285, 1, 1119, 1, 1085, 54, 1, 1124);
    SmithableEquipment.MITHRIL_ARROWTIPS = new SmithableEquipment("Arrowtips", 2359, 42, 15, 1123, 1, 1108, 55, 1, 1130);
    SmithableEquipment.MITHRIL_SCIMITAR = new SmithableEquipment("Scimitar", 2359, 1329, 1, 1119, 2, 1087, 55, 2, 1116);
    SmithableEquipment.MITHRIL_LONG_SWORD = new SmithableEquipment("Long sword", 2359, 1299, 1, 1119, 3, 1086, 56, 2, 1089);
    SmithableEquipment.MITHRIL_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2359, 866, 5, 1123, 2, 1106, 57, 1, 1131);
    SmithableEquipment.MITHRIL_FULL_HELM = new SmithableEquipment("Full helm", 2359, 1159, 1, 1122, 1, 1103, 57, 2, 1113);
    SmithableEquipment.MITHRIL_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2359, 1181, 1, 1122, 2, 1104, 58, 2, 1114);
    SmithableEquipment.MITHRIL_WARHAMMER = new SmithableEquipment("Warhammer", 2359, 1343, 1, 1120, 2, 1083, 59, 3, 1118);
    SmithableEquipment.MITHRIL_BATTLE_AXE = new SmithableEquipment("Battle axe", 2359, 1369, 1, 1120, 3, 1092, 60, 3, 1095);
    SmithableEquipment.MITHRIL_CHAINBODY = new SmithableEquipment("Chainbody", 2359, 1109, 1, 1121, 0, 1098, 61, 3, 1109);
    SmithableEquipment.MITHRIL_KITE_SHIELD = new SmithableEquipment("Kite shield", 2359, 1197, 1, 1122, 3, 1105, 62, 3, 1115);
    SmithableEquipment.MITHRIL_CLAWS = new SmithableEquipment("Claws", 2359, 3099, 1, 1120, 4, 8429, 63, 2, 8428);
    SmithableEquipment.MITHRIL_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2359, 1315, 1, 1119, 4, 1088, 64, 3, 1090);
    SmithableEquipment.MITHRIL_PLATESKIRT = new SmithableEquipment("Plate skirt", 2359, 1085, 1, 1121, 2, 1100, 66, 3, 1111);
    SmithableEquipment.MITHRIL_PLATELEGS = new SmithableEquipment("Plate legs", 2359, 1071, 1, 1121, 1, 1099, 66, 3, 1110);
    SmithableEquipment.MITHRIL_PLATEBODY = new SmithableEquipment("Plate body", 2359, 1121, 1, 1121, 3, 1101, 68, 5, 1112);
    SmithableEquipment.MITHRIL_NAILS = new SmithableEquipment("Nails", 2359, 4822, 15, 1122, 4, 13358, 54, 1, 13357);
    SmithableEquipment.MITHRIL_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2359, 9379, 10, 1121, 4, 11461, 53, 1, 11459);
    SmithableEquipment.ADAMANT_DAGGER = new SmithableEquipment("Dagger", 2361, 1211, 1, 1119, 0, 1094, 70, 1, 1125);
    SmithableEquipment.ADAMANT_AXE = new SmithableEquipment("Axe", 2361, 1357, 1, 1120, 0, 1091, 71, 1, 1126);
    SmithableEquipment.ADAMANT_MACE = new SmithableEquipment("Mace", 2361, 1430, 1, 1120, 1, 1093, 72, 1, 1129);
    SmithableEquipment.ADAMANT_MED_HELM = new SmithableEquipment("Med helm", 2361, 1145, 1, 1122, 0, 1102, 73, 1, 1127);
    SmithableEquipment.ADAMANT_DART_TIPS = new SmithableEquipment("Dart tips", 2361, 823, 10, 1123, 0, 1107, 74, 1, 1128);
    SmithableEquipment.ADAMANT_SWORD = new SmithableEquipment("Sword", 2361, 1287, 1, 1119, 1, 1085, 74, 1, 1124);
    SmithableEquipment.ADAMANT_ARROWTIPS = new SmithableEquipment("Arrowtips", 2361, 43, 15, 1123, 1, 1108, 75, 1, 1130);
    SmithableEquipment.ADAMANT_SCIMITAR = new SmithableEquipment("Scimitar", 2361, 1331, 1, 1119, 2, 1087, 75, 2, 1116);
    SmithableEquipment.ADAMANT_LONG_SWORD = new SmithableEquipment("Long sword", 2361, 1301, 1, 1119, 3, 1086, 76, 2, 1089);
    SmithableEquipment.ADAMANT_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2361, 867, 5, 1123, 2, 1106, 77, 1, 1131);
    SmithableEquipment.ADAMANT_FULL_HELM = new SmithableEquipment("Full helm", 2361, 1161, 1, 1122, 1, 1103, 77, 2, 1113);
    SmithableEquipment.ADAMANT_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2361, 1183, 1, 1122, 2, 1104, 78, 2, 1114);
    SmithableEquipment.ADAMANT_WARHAMMER = new SmithableEquipment("Warhammer", 2361, 1345, 1, 1120, 2, 1083, 79, 3, 1118);
    SmithableEquipment.ADAMANT_BATTLE_AXE = new SmithableEquipment("Battle axe", 2361, 1371, 1, 1120, 3, 1092, 80, 3, 1095);
    SmithableEquipment.ADAMANT_CHAINBODY = new SmithableEquipment("Chainbody", 2361, 1111, 1, 1121, 0, 1098, 81, 3, 1109);
    SmithableEquipment.ADAMANT_KITE_SHIELD = new SmithableEquipment("Kite shield", 2361, 1199, 1, 1122, 3, 1105, 82, 3, 1115);
    SmithableEquipment.ADAMANT_CLAWS = new SmithableEquipment("Claws", 2361, 3100, 1, 1120, 4, 8429, 83, 2, 8428);
    SmithableEquipment.ADAMANT_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2361, 1317, 1, 1119, 4, 1088, 84, 3, 1090);
    SmithableEquipment.ADAMANT_PLATESKIRT = new SmithableEquipment("Plate skirt", 2361, 1091, 1, 1121, 2, 1100, 86, 3, 1111);
    SmithableEquipment.ADAMANT_PLATELEGS = new SmithableEquipment("Plate legs", 2361, 1073, 1, 1121, 1, 1099, 86, 3, 1110);
    SmithableEquipment.ADAMANT_PLATEBODY = new SmithableEquipment("Plate body", 2361, 1123, 1, 1121, 3, 1101, 88, 5, 1112);
    SmithableEquipment.ADAMANT_NAILS = new SmithableEquipment("Nails", 2361, 4823, 15, 1122, 4, 13358, 74, 1, 13357);
    SmithableEquipment.ADAMANT_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2361, 9380, 10, 1121, 4, 11461, 73, 1, 11459);
    SmithableEquipment.RUNE_DAGGER = new SmithableEquipment("Dagger", 2363, 1213, 1, 1119, 0, 1094, 85, 1, 1125);
    SmithableEquipment.RUNE_AXE = new SmithableEquipment("Axe", 2363, 1359, 1, 1120, 0, 1091, 86, 1, 1126);
    SmithableEquipment.RUNE_MACE = new SmithableEquipment("Mace", 2363, 1432, 1, 1120, 1, 1093, 87, 1, 1129);
    SmithableEquipment.RUNE_MED_HELM = new SmithableEquipment("Med helm", 2363, 1147, 1, 1122, 0, 1102, 88, 1, 1127);
    SmithableEquipment.RUNE_DART_TIPS = new SmithableEquipment("Dart tips", 2363, 824, 10, 1123, 0, 1107, 89, 1, 1128);
    SmithableEquipment.RUNE_SWORD = new SmithableEquipment("Sword", 2363, 1289, 1, 1119, 1, 1085, 89, 1, 1124);
    SmithableEquipment.RUNE_ARROWTIPS = new SmithableEquipment("Arrowtips", 2363, 44, 15, 1123, 1, 1108, 90, 1, 1130);
    SmithableEquipment.RUNE_SCIMITAR = new SmithableEquipment("Scimitar", 2363, 1333, 1, 1119, 2, 1087, 90, 2, 1116);
    SmithableEquipment.RUNE_LONG_SWORD = new SmithableEquipment("Long sword", 2363, 1303, 1, 1119, 3, 1086, 91, 2, 1089);
    SmithableEquipment.RUNE_THROWING_KNIVES = new SmithableEquipment("Throwing knives", 2363, 868, 5, 1123, 2, 1106, 92, 1, 1131);
    SmithableEquipment.RUNE_FULL_HELM = new SmithableEquipment("Full helm", 2363, 1163, 1, 1122, 1, 1103, 92, 2, 1113);
    SmithableEquipment.RUNE_SQUARE_SHIELD = new SmithableEquipment("Square shield", 2363, 1185, 1, 1122, 2, 1104, 93, 2, 1114);
    SmithableEquipment.RUNE_WARHAMMER = new SmithableEquipment("Warhammer", 2363, 1347, 1, 1120, 2, 1083, 94, 3, 1118);
    SmithableEquipment.RUNE_BATTLE_AXE = new SmithableEquipment("Battle axe", 2363, 1373, 1, 1120, 3, 1092, 95, 3, 1095);
    SmithableEquipment.RUNE_CHAINBODY = new SmithableEquipment("Chainbody", 2363, 1113, 1, 1121, 0, 1098, 96, 3, 1109);
    SmithableEquipment.RUNE_KITE_SHIELD = new SmithableEquipment("Kite shield", 2363, 1201, 1, 1122, 3, 1105, 97, 3, 1115);
    SmithableEquipment.RUNE_CLAWS = new SmithableEquipment("Claws", 2363, 3101, 1, 1120, 4, 8429, 98, 2, 8428);
    SmithableEquipment.RUNE_2_HAND_SWORD = new SmithableEquipment("2 hand sword", 2363, 1319, 1, 1119, 4, 1088, 99, 3, 1090);
    SmithableEquipment.RUNE_PLATESKIRT = new SmithableEquipment("Plate skirt", 2363, 1093, 1, 1121, 2, 1100, 99, 3, 1111);
    SmithableEquipment.RUNE_PLATELEGS = new SmithableEquipment("Plate legs", 2363, 1079, 1, 1121, 1, 1099, 99, 3, 1110);
    SmithableEquipment.RUNE_PLATEBODY = new SmithableEquipment("Plate body", 2363, 1127, 1, 1121, 3, 1101, 99, 5, 1112);
    SmithableEquipment.RUNE_NAILS = new SmithableEquipment("Nails", 2363, 4824, 15, 1122, 4, 13358, 89, 1, 13357);
    SmithableEquipment.RUNE_UNF_BOLTS = new SmithableEquipment("Bolts (unf)", 2363, 9381, 10, 1121, 4, 11461, 88, 1, 11459);
    SmithableEquipment.RUNE_ITEMS = (SmithableEquipment.RUNE_DAGGER,
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
        SmithableEquipment.RUNE_UNF_BOLTS);
    SmithableEquipment.ADAMANT_ITEMS = (SmithableEquipment.ADAMANT_DAGGER,
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
        SmithableEquipment.ADAMANT_UNF_BOLTS);
    SmithableEquipment.MITHRIL_ITEMS = (SmithableEquipment.MITHRIL_DAGGER,
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
        SmithableEquipment.MITHRIL_KITE_SHIELD);
    SmithableEquipment.STEEL_ITEMS = (SmithableEquipment.STEEL_DAGGER,
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
        SmithableEquipment.CANNONBALL);
    SmithableEquipment.IRON_ITEMS = (SmithableEquipment.IRON_DAGGER,
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
        SmithableEquipment.IRON_UNF_BOLTS);
    SmithableEquipment.BRONZE_ITEMS = (SmithableEquipment.BRONZE_DAGGER,
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
        SmithableEquipment.BRONZE_UNF_BOLTS);
    return SmithableEquipment;
}());
var Bar = exports.Bar = /** @class */ (function () {
    function Bar(bar, ores, levelReq, xpReward, frame, buttons, items) {
        this.bar = bar;
        this.ores = ores;
        this.levelReq = levelReq;
        this.xpReward = xpReward;
        this.frame = frame;
        this.buttons = buttons;
        this.items = items;
    }
    Bar.forBarId = function (barId) {
        return Bar.smeltables.get(barId);
    };
    Bar.prototype.getBar = function () {
        return this.bar;
    };
    Bar.prototype.getOres = function () {
        return this.ores;
    };
    Bar.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    Bar.prototype.getXpReward = function () {
        return this.xpReward;
    };
    Bar.prototype.getFrame = function () {
        return this.frame;
    };
    Bar.prototype.getItems = function () {
        return this.items;
    };
    Bar.prototype.getButtons = function () {
        return this.buttons;
    };
    Bar.BRONZE_BAR = new Bar(2349, [new RequiredItem_1.RequiredItem(new Item_1.Item(438), true), new RequiredItem_1.RequiredItem(new Item_1.Item(436), true)], 1, 120, 2405, [[3987, 1], [3986, 5], [2807, 10], [2414, -1]], (SmithableEquipment.BRONZE_ITEMS));
    Bar.IRON_BAR = new Bar(2351, [new RequiredItem_1.RequiredItem(new Item_1.Item(440), true)], 15, 540, 2406, [[3991, 1], [3990, 5], [3989, 10], [3988, -1]], (SmithableEquipment.IRON_ITEMS));
    Bar.SILVER_BAR = new Bar(2355, [new RequiredItem_1.RequiredItem(new Item_1.Item(442), true)], 20, 725, 2407, [[3995, 1], [3994, 5], [3993, 10], [3992, -1]]);
    Bar.STEEL_BAR = new Bar(2353, [new RequiredItem_1.RequiredItem(new Item_1.Item(440), true), new RequiredItem_1.RequiredItem(new Item_1.Item(453, 2), true)], 30, 1350, 2409, [[3999, 1], [3998, 5], [3997, 10], [3996, -1]]);
    Bar.GOLD_BAR = new Bar(2357, [new RequiredItem_1.RequiredItem(new Item_1.Item(444), true)], 40, 2400, 2410, [[4003, 1], [4002, 5], [4001, 10], [4000, -1]]);
    Bar.MITHRIL_BAR = new Bar(2359, [new RequiredItem_1.RequiredItem(new Item_1.Item(447), true), new RequiredItem_1.RequiredItem(new Item_1.Item(453, 4), true)], 50, 3450, 2411, [[7441, 1], [7440, 5], [6397, 10], [4158, -1]], (SmithableEquipment.MITHRIL_ITEMS));
    Bar.ADAMANTITE_BAR = new Bar(2361, [new RequiredItem_1.RequiredItem(new Item_1.Item(449), true), new RequiredItem_1.RequiredItem(new Item_1.Item(453, 6), true)], 70, 4500, 2412, [[7446, 1], [7444, 5], [7443, 10], [7442, -1]], (SmithableEquipment.ADAMANT_ITEMS));
    Bar.RUNITE_BAR = new Bar(2363, [new RequiredItem_1.RequiredItem(new Item_1.Item(451), true), new RequiredItem_1.RequiredItem(new Item_1.Item(453, 8), true)], 85, 5560, 2413, [[7450, 1], [7446, 5], [7448, 10], [7447, -1]], (SmithableEquipment.ADAMANT_ITEMS));
    Bar.smeltables = new Map();
    (function () {
        var e_3, _a;
        try {
            for (var _b = __values(Object.values(Bar)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                Bar.smeltables.set(s.bar, s);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    })();
    return Bar;
}());
var EquipmentMaking = exports.EquipmentMaking = /** @class */ (function () {
    function EquipmentMaking(n1) {
        this.value = n1;
    }
    EquipmentMaking.openInterface = function (player) {
        var e_4, _a, e_5, _b;
        // Search for bar..
        var bar = null;
        try {
            for (var _c = __values(Object.values(Bar)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var b = _d.value;
                if (b.getItems()) {
                    if (player.getInventory().contains(b.getBar())) {
                        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.SMITHING) >= b.getLevelReq()) {
                            bar = b;
                            break;
                        }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // Did we find a bar in the player's inventory?
        if (bar) {
            // First, clear the interface from items..
            for (var i = 1119; i <= 1123; i++) {
                player.getPacketSender().clearItemOnInterface(i);
            }
            // Clear slots that aren't always used..
            player.getPacketSender()
                .sendString("", 1132)
                .sendString("", 1096)
                .sendString("", 1135)
                .sendString("", 1134);
            try {
                // Go through the bar's items..
                for (var _e = __values(Object.values(bar.getItems())), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var b = _f.value;
                    player.getPacketSender().sendSmithingData(b.getItemId(), b.getItemSlot(), b.getItemFrame(), b.getAmount());
                    var barColor = "@red@";
                    var itemColor = "@bla@";
                    if (player.getInventory().getAmount(b.getBarId()) >= b.getBarsRequired()) {
                        barColor = "@gre@";
                    }
                    if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.SMITHING) >= b.getRequiredLevel()) {
                        itemColor = "@whi@";
                    }
                    player.getPacketSender().sendString(barColor + b.getBarsRequired().toString() + " " + (b.getBarsRequired() > 1 ? "bars" : "bar"), b.getBarFrame());
                    player.getPacketSender().sendString(itemColor + b.getName(), b.getNameFrame());
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_5) throw e_5.error; }
            }
            // Send interface..
            player.getPacketSender().sendInterface(EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID);
        }
        else {
            player.getPacketSender().sendMessage("You don't have any bars in your inventory which can be used with your Smithing level.");
        }
    };
    EquipmentMaking.initialize = function (player, itemId, interfaceId, slot, amount) {
        var e_6, _a;
        try {
            for (var _b = __values(Object.values(SmithableEquipment)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var smithable = _c.value;
                if (smithable.getItemId() === itemId && smithable.getItemFrame() === interfaceId && smithable.getItemSlot() === slot) {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAMMER)), new RequiredItem_1.RequiredItem(new Item_1.Item(smithable.getBarId(), smithable.getBarsRequired()), true)], new Item_1.Item(smithable.getItemId(), smithable.getAmount()), amount, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(898), 3), smithable.getRequiredLevel(), 10, Skill_1.Skill.SMITHING));
                    break;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    /**
    
    The interface used for creating equipment using the
    Smithing skill.
    */
    EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID = 994;
    /**
    
    The interface ids used for selecting an item to create in the
    {@code EQUIPMENT_CREATION_INTERFACE_ID}.
    */
    EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1 = 1119;
    EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2 = 1120;
    EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3 = 1121;
    EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4 = 1122;
    EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5 = 1123;
    return EquipmentMaking;
}());
var Smelting = exports.Smelting = /** @class */ (function (_super) {
    __extends(Smelting, _super);
    /**
     * Constructs this {@link Smelting} instance.
     *
     * @param bar
     * @param amount
     */
    function Smelting(bar, amount) {
        var _this = _super.call(this, bar.getOres(), new Item_1.Item(bar.getBar()), amount, new AnimationLoop_1.AnimationLoop(Smelting.ANIMATION, 4), bar.getLevelReq(), bar.getXpReward(), Skill_1.Skill.SMITHING) || this;
        _this.bar = bar;
        return _this;
    }
    //Override finishedCycle because we need to handle special cases
    //such as Iron ore 50% chance of failing to smelt.
    Smelting.prototype.finishedCycle = function (player) {
        //Handle iron bar. It has a 50% chance of failing.
        if (this.bar === Bar.IRON_BAR) {
            if (Misc_1.Misc.getRandom(2) === 1) {
                player.getPacketSender().sendMessage("The Iron ore was too impure and you were unable to make an Iron bar.");
                //We still need to delete the ore and decrement amount.
                this.filterRequiredItems(function (r) { return r.isDelete(); }).forEach(function (r) { return player.getInventory().deletes(r.getItem()); });
                this.decrementAmount();
                return;
            }
        }
        _super.prototype.finishedCycle.call(this, player);
    };
    /**
    * The {@link Animation} the character will perform
    * when smelting.
    */
    Smelting.ANIMATION = new Animation_1.Animation(896);
    return Smelting;
}(ItemCreationSkillable_1.ItemCreationSkillable));
//# sourceMappingURL=Smithing.js.map