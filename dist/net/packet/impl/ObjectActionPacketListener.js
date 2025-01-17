"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectActionPacketListener = void 0;
// import { PlayerRights } from "../../../game/model/rights/PlayerRights";
// import { Server } from "../../../Server";
// import { RegionManager } from "../../../game/collision/RegionManager";
// import { DepositBox } from "../../../game/content/DepositBox";
// import { CombatSpecial } from "../../../game/content/combat/CombatSpecial";
// import { MinigameHandler } from "../../../game/content/minigames/MinigameHandler";
// import { FightCaves } from "../../../game/content/minigames/impl/FightCaves";
// import { SkillManager } from "../../../game/content/skill/SkillManager";
// import { Smithing, Bar } from "../../../game/content/skill/skillable/impl/Smithing";
// import { EquipmentMaking } from "../../../game/content/skill/skillable/impl/Smithing";
// import { StallThieving } from '../../../game/content/skill/skillable/impl/Thieving'
// import { ObjectDefinition } from "../../../game/definition/ObjectDefinition";
// import { GameObject } from "../../../game/entity/impl/object/GameObject";
// import { MapObjects } from "../../../game/entity/impl/object/MapObjects";
// import { WebHandler } from "../../../game/entity/impl/object/impl/WebHandler";
// import { PrivateArea } from "../../../game/model/areas/impl/PrivateArea";
// import { SpellBookDialogue } from '../../../game/model/dialogues/builders/impl/SpellBookDialogue'
// import { TeleportHandler } from "../../../game/model/teleportation/TeleportHandler";
// import { TeleportType } from "../../../game/model/teleportation/TeleportType";
// import { TaskManager } from "../../../game/task/TaskManager";
// import { PacketExecutor } from "../PacketExecutor";
// import { ForceMovementTask } from "../../../game/task/impl/ForceMovementTask";
// import { ObjectIdentifiers } from "../../../util/ObjectIdentifiers";
// import { ObjectManager } from "../../../game/entity/impl/object/ObjectManager";
// import { MagicSpellbook } from "../../../game/model/MagicSpellbook";
// import { Skill } from "../../../game/model/Skill";
// import { ForceMovement } from "../../../game/model/ForceMovement";
// import { Location } from "../../../game/model/Location";
// import { Flag } from "../../../game/model/Flag";
// import { Graphic } from "../../../game/model/Graphic";
// import { Animation } from "../../../game/model/Animation";
// import { Action } from "../../../game/model/Action";
// class ObjectAction implements Action{
var ObjectAction = /** @class */ (function () {
    function ObjectAction(execFunc) {
        this.execFunc = execFunc;
    }
    ObjectAction.prototype.execute = function () {
        this.execFunc();
    };
    return ObjectAction;
}());
// export class ObjectActionPacketListener extends ObjectIdentifiers implements PacketExecutor {
var ObjectActionPacketListener = /** @class */ (function () {
    function ObjectActionPacketListener() {
    }
    return ObjectActionPacketListener;
}());
exports.ObjectActionPacketListener = ObjectActionPacketListener;
//# sourceMappingURL=ObjectActionPacketListener.js.map