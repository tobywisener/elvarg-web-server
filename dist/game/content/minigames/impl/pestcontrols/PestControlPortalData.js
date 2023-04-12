"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PestControlPortalData = void 0;
var Direction_1 = require("../../../../model/Direction");
var BonusManager_1 = require("../../../../model/equipment/BonusManager");
var PestControlPortalData = exports.PestControlPortalData = /** @class */ (function () {
    function PestControlPortalData(name, direction, colourCode, shieldId, weaknesses, xPosition, yPosition, npcSpawnX, npcSpawnY) {
        this.name = name;
        this.direction = direction;
        this.colourCode = colourCode;
        this.weaknesses = weaknesses;
        this.shieldId = shieldId;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.npcSpawnX = npcSpawnX;
        this.npcSpawnY = npcSpawnY;
    }
    ;
    PestControlPortalData.PURPLE = new PestControlPortalData("western", Direction_1.Direction.WEST, "a533ff", 1751, [BonusManager_1.BonusManager.ATTACK_RANGE], 2628, 2591, 2631, 2592);
    PestControlPortalData.BLUE = new PestControlPortalData("eastern", Direction_1.Direction.EAST, "33d7ff", 1752, [BonusManager_1.BonusManager.ATTACK_MAGIC], 2680, 2588, 2679, 2589);
    PestControlPortalData.YELLOW = new PestControlPortalData("south-eastern", Direction_1.Direction.SOUTH_EAST, "fff333", 1753, [BonusManager_1.BonusManager.ATTACK_STAB, BonusManager_1.BonusManager.ATTACK_SLASH], 2669, 2570, 2670, 2573);
    PestControlPortalData.RED = new PestControlPortalData("south-western", Direction_1.Direction.SOUTH_WEST, "e32a2a", 1754, [BonusManager_1.BonusManager.ATTACK_CRUSH], 2645, 2569, 2646, 2572);
    return PestControlPortalData;
}());
//# sourceMappingURL=PestControlPortalData.js.map