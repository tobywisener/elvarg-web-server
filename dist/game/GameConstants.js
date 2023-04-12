"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameConstants = void 0;
var PlayerBotDefinition_1 = require("./definition/PlayerBotDefinition");
var JSONFilePlayerPersistence_1 = require("./entity/impl/player/persistence/jsonfile/JSONFilePlayerPersistence");
var TribridMaxFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/TribridMaxFighterPreset");
var DDSPureMFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/DDSPureMFighterPreset");
var DDSPureRFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/DDSPureRFighterPreset");
var F2PMeleeFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/F2PMeleeFighterPreset");
var GRangerFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/GRangerFighterPreset");
var MidTribridMaxFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/MidTribridMaxFighterPreset");
var NHPureFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/NHPureFighterPreset");
var ObbyMaulerFighterPreset_1 = require("./entity/impl/playerbot/fightstyle/impl/ObbyMaulerFighterPreset");
var Location_1 = require("./model/Location");
var PlayerRights_1 = require("./model/rights/PlayerRights");
var GameConstants = exports.GameConstants = /** @class */ (function () {
    function GameConstants() {
    }
    GameConstants.NAME = "RspsApp";
    GameConstants.CLIENT_UID = 8784521;
    GameConstants.DEFINITIONS_DIRECTORY = "./data/definitions/";
    GameConstants.CLIPPING_DIRECTORY = "./data/clipping/";
    GameConstants.PLAYER_PERSISTENCE = new JSONFilePlayerPersistence_1.JSONFilePlayerPersistence();
    GameConstants.CONCURRENCY = false;
    GameConstants.GAME_ENGINE_PROCESSING_CYCLE_RATE = 600;
    GameConstants.QUEUED_LOOP_THRESHOLD = 45;
    GameConstants.DEFAULT_LOCATION = new Location_1.Location(3089, 3524);
    GameConstants.QUEUE_SWITCHING_REFRESH = true;
    GameConstants.DROP_THRESHOLD = 2;
    GameConstants.COMBAT_SKILLS_EXP_MULTIPLIER = 6;
    GameConstants.REGULAR_SKILLS_EXP_MULTIPLIER = 18;
    GameConstants.DEBUG_ATTACK_DISTANCE = false;
    GameConstants.TAB_INTERFACES = [2423, 3917, 31000, 3213, 1644, 5608, -1, 37128, 5065, 5715, 2449,
        42500, 147, 32000];
    GameConstants.ALLOWED_SPAWNS = new Set([
        13441, 3144, 391, 397, 385, 7946, 2436, 145, 147, 149, 2440, 157, 159, 161,
        2442, 163, 165, 167, 9739, 2444, 169, 171, 173,
        3040, 3042, 3044, 3046, 2452, 2454, 2456, 2458, 2448, 181, 183, 185, 6685, 6687, 6689, 6691, 2450, 189, 191, 193, 3024, 3026, 3028, 3030, 2434,
        139, 141, 143, 4417, 4419, 4421, 4423, 229,
        1149, 3140, 4087, 4585, 1187, 11840,
        1163, 1127, 1079, 1093, 1201, 4131,
        1161, 1123, 1073, 1091, 1199, 4129,
        1159, 1121, 1071, 1091, 1197, 4127,
        1165, 1125, 1077, 1089, 1195, 4125,
        1157, 1119, 1069, 1083, 1193, 4123,
        1153, 1115, 1067, 1081, 1191, 4121,
        1155, 1117, 1075, 1087, 1189, 4119,
        4587, 1333, 1331, 1329, 1327, 1325, 1323, 1321,
        21009, 1289, 1287, 1285, 1283, 1281, 1279, 1277,
        1305, 1303, 1301, 1299, 1297, 1295, 1293, 1291,
        7158, 1319, 1317, 1315, 1313, 1311, 1309, 1307,
        1347, 1345, 1343, 1341, 1339, 1335, 1337,
        5698, 1215, 1213, 1211, 1209, 1217, 1207, 1203, 1205,
        1434, 1432, 1430, 1428, 1426, 1424, 1420, 1422,
        7462, 7461, 7460, 7459, 7458, 7457, 7456, 7455, 7454,
        11126, 2550, 4151, 4153, 10887,
        6528, 6527, 6526, 6525, 6524, 6523, 6522,
        9747, 9748, 9750, 9751, 9753, 9754, 9756, 9757, 9759, 9760, 9762, 9763, 6568, 2412, 2413, 2414,
        8850, 8849, 8848, 8847, 8846, 8845, 8844, 1540, 10828, 3755, 3753, 3751, 3749, 3748, 12831, 12829, 3842,
        3844, 12608, 12610, 12612, 11235, 859, 855, 851, 847, 845, 841, 861, 857, 853, 849, 843, 841, 9185, 9183,
        9181, 9179, 9177, 9174, 11212, 892, 890, 888, 886, 884, 882, 9245, 9244, 9243, 9242, 9241, 9240, 9239, 9238,
        9237, 9236, 9305, 9144, 9143, 9142, 9141, 9140, 877, 5667, 868, 867, 866, 869, 865, 863, 864, 19484, 5653,
        830, 829, 828, 827, 826, 825, 11230, 811, 810, 809, 808, 807, 806, 10368, 10370, 10372, 10374, 10376, 10378,
        10380, 10382, 10384, 10386, 10388, 10390, 12490, 12492, 12494, 12496, 12498, 12500, 12502, 12504, 12506,
        12508, 12510, 12512, 2503, 2497, 2491, 2501, 2495, 2489, 2499, 2493, 2487, 1135, 1099, 1065, 6322, 6324,
        6326, 6328, 6330, 10954, 10956, 10958, 6131, 6133, 6135, 1169, 1133, 1097, 1131, 1167, 1129, 1095, 10499,
        4675, 1381, 1383, 1385, 1387, 1379, 4089, 4091, 4093, 4095, 4097, 4099, 4101, 4103, 4105, 4107, 4109, 4111,
        4113, 4115, 4117, 7400, 7399, 7398, 6918, 6916, 6924, 6922, 6920, 6109, 6107, 6108, 6110, 6106, 3105, 6111,
        544, 542, 1035, 1033, 579, 577, 1011, 554, 555, 556, 557, 558, 559, 561, 563, 562, 560, 565, 566, 9075,
        1704, 1731, 1725, 1727, 1729
    ]);
    GameConstants.PLAYER_BOTS = [
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot Hello123", new Location_1.Location(3085, 3528), new ObbyMaulerFighterPreset_1.ObbyMaulerFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Elvemage", new Location_1.Location(3093, 3529), new NHPureFighterPreset_1.NHPureFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot 1337Pk", new Location_1.Location(3087, 3530), new DDSPureRFighterPreset_1.DDSPureRFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot Kids Ranqe", new Location_1.Location(3089, 3530), new GRangerFighterPreset_1.GRangerFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot Josh", new Location_1.Location(3091, 3533), new DDSPureMFighterPreset_1.DDSPureMFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot Odablock", new Location_1.Location(3091, 3536), new TribridMaxFighterPreset_1.TribridMaxFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot SKillSpecs", new Location_1.Location(3095, 3535), new MidTribridMaxFighterPreset_1.MidTribridMaxFighterPreset()),
        new PlayerBotDefinition_1.PlayerBotDefinition("Bot F2P Pure", new Location_1.Location(3096, 3530), new F2PMeleeFighterPreset_1.F2PMeleeFighterPreset()),
    ];
    GameConstants.PLAYER_BOT_PASSWORD = "wirfunerpro4n!1";
    GameConstants.PLAYER_BOT_OVERRIDE = [PlayerRights_1.PlayerRights.MODERATOR.getSpriteId(), PlayerRights_1.PlayerRights.ADMINISTRATOR.getSpriteId(), PlayerRights_1.PlayerRights.DEVELOPER.getSpriteId(), PlayerRights_1.PlayerRights.OWNER.getSpriteId()];
    return GameConstants;
}());
//# sourceMappingURL=GameConstants.js.map