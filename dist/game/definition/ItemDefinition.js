"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDefinition = void 0;
var EquipmentType_1 = require("../model/EquipmentType");
var ItemDefinition = exports.ItemDefinition = /** @class */ (function () {
    function ItemDefinition() {
        this.name = "";
        this.examine = "";
        this.equipmentType = EquipmentType_1.EquipmentType.NONE;
        this.noteId = -1;
        this.blockAnim = 424;
        this.standAnim = 808;
        this.walkAnim = 819;
        this.runAnim = 824;
        this.standTurnAnim = 823;
        this.turn180Anim = 820;
        this.turn90CWAnim = 821;
        this.turn90CCWAnim = 821;
    }
    ItemDefinition.forId = function (item) {
        return this.definitions.get(item) || this.DEFAULT;
    };
    ItemDefinition.prototype.getId = function () {
        return this.id;
    };
    ItemDefinition.prototype.getName = function () {
        return this.name;
    };
    ItemDefinition.prototype.getExamine = function () {
        return this.examine;
    };
    ItemDefinition.prototype.getValue = function () {
        return this.value;
    };
    ItemDefinition.prototype.getBloodMoneyValue = function () {
        return this.bloodMoneyValue;
    };
    ItemDefinition.prototype.getHighAlchValue = function () {
        return this.highAlch;
    };
    ItemDefinition.prototype.getLowAlchValue = function () {
        return this.lowAlch;
    };
    ItemDefinition.prototype.getDropValue = function () {
        return this.dropValue;
    };
    ItemDefinition.prototype.isStackable = function () {
        return this.stackable;
    };
    ItemDefinition.prototype.isTradeable = function () {
        return this.tradeable;
    };
    ItemDefinition.prototype.isSellable = function () {
        return this.sellable;
    };
    ItemDefinition.prototype.isDropable = function () {
        return this.dropable;
    };
    ItemDefinition.prototype.isNoted = function () {
        return this.noted;
    };
    ItemDefinition.prototype.getNoteId = function () {
        return this.noteId;
    };
    ItemDefinition.prototype.isDoubleHanded = function () {
        return this.doubleHanded;
    };
    ItemDefinition.prototype.getBlockAnim = function () {
        return this.blockAnim;
    };
    ItemDefinition.prototype.getStandAnim = function () {
        return this.standAnim;
    };
    ItemDefinition.prototype.getWalkAnim = function () {
        return this.walkAnim;
    };
    ItemDefinition.prototype.getRunAnim = function () {
        return this.runAnim;
    };
    ItemDefinition.prototype.getStandTurnAnim = function () {
        return this.standTurnAnim;
    };
    ItemDefinition.prototype.getTurn180Anim = function () {
        return this.turn180Anim;
    };
    ItemDefinition.prototype.getTurn90CWAnim = function () {
        return this.turn90CWAnim;
    };
    ItemDefinition.prototype.getTurn90CCWAnim = function () {
        return this.turn90CCWAnim;
    };
    ItemDefinition.prototype.getWeight = function () {
        return this.weight;
    };
    ItemDefinition.prototype.getBonuses = function () {
        return this.bonuses;
    };
    ItemDefinition.prototype.getRequirements = function () {
        return this.requirements;
    };
    ItemDefinition.prototype.getWeaponInterface = function () {
        return this.weaponInterface;
    };
    ItemDefinition.prototype.getEquipmentType = function () {
        return this.equipmentType;
    };
    ItemDefinition.prototype.unNote = function () {
        return ItemDefinition.forId(this.id - 1).getName().toString() ? this.id - 1 : this.id;
    };
    ItemDefinition.definitions = new Map();
    ItemDefinition.DEFAULT = new ItemDefinition();
    return ItemDefinition;
}());
//# sourceMappingURL=ItemDefinition.js.map