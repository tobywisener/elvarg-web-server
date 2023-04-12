"use strict";
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
exports.CombatSpecial = void 0;
var WeaponInterfaces_1 = require("./WeaponInterfaces");
var AbyssalDaggerCombatMethod_1 = require("./method/impl/specials/AbyssalDaggerCombatMethod");
var AbyssalTentacleCombatMethod_1 = require("./method/impl/specials/AbyssalTentacleCombatMethod");
var BarrelchestAnchorCombatMethod_1 = require("./method/impl/specials/BarrelchestAnchorCombatMethod");
var DragonScimitarCombatMethod_1 = require("./method/impl/specials/DragonScimitarCombatMethod");
var DragonLongswordCombatMethod_1 = require("./method/impl/specials/DragonLongswordCombatMethod");
var DragonMaceCombatMethod_1 = require("./method/impl/specials/DragonMaceCombatMethod");
var DragonWarhammerCombatMethod_1 = require("./method/impl/specials/DragonWarhammerCombatMethod");
var SaradominSwordCombatMethod_1 = require("./method/impl/specials/SaradominSwordCombatMethod");
var AbyssalWhipCombatMethod_1 = require("./method/impl/specials/AbyssalWhipCombatMethod");
var ArmadylGodswordCombatMethod_1 = require("./method/impl/specials/ArmadylGodswordCombatMethod");
var SaradominGodswordCombatMethod_1 = require("./method/impl/specials/SaradominGodswordCombatMethod");
var BandosGodswordCombatMethod_1 = require("./method/impl/specials/BandosGodswordCombatMethod");
var ZamorakGodswordCombatMethod_1 = require("./method/impl/specials/ZamorakGodswordCombatMethod");
var AbyssalBludgeonCombatMethod_1 = require("./method/impl/specials/AbyssalBludgeonCombatMethod");
var DragonHalberdCombatMethod_1 = require("./method/impl/specials/DragonHalberdCombatMethod");
var DragonDaggerCombatMethod_1 = require("./method/impl/specials/DragonDaggerCombatMethod");
var GraniteMaulCombatMethod_1 = require("./method/impl/specials/GraniteMaulCombatMethod");
var DragonClawCombatMethod_1 = require("./method/impl/specials/DragonClawCombatMethod");
var MagicShortbowCombatMethod_1 = require("./method/impl/specials/MagicShortbowCombatMethod");
var DarkBowCombatMethod_1 = require("./method/impl/specials/DarkBowCombatMethod");
var ArmadylCrossbowCombatMethod_1 = require("./method/impl/specials/ArmadylCrossbowCombatMethod");
var BallistaCombatMethod_1 = require("./method/impl/specials/BallistaCombatMethod");
var Player_1 = require("../../entity/impl/player/Player");
var CombatFactory_1 = require("./CombatFactory");
var BonusManager_1 = require("../../model/equipment/BonusManager");
var CombatType_1 = require("./CombatType");
var TaskManager_1 = require("../../task/TaskManager");
var RestoreSpecialAttackTask_1 = require("../../task/impl/RestoreSpecialAttackTask");
var Equipment_1 = require("../../model/container/impl/Equipment");
var Duelling_1 = require("../Duelling");
var CombatSpecial = exports.CombatSpecial = /** @class */ (function () {
    function CombatSpecial(identifiers, drainAmount, strengthMultiplier, accuracyMultiplier, combatMethod, weaponInterface) {
        this.SPECIAL_ATTACK_WEAPON_IDS = new Set(Object.values(CombatSpecial).flatMap(function (cs) { return cs.identifiers; }));
        this.identifiers = identifiers;
        this.drainAmount = drainAmount;
        this.strengthMultiplier = strengthMultiplier;
        this.accuracyMultiplier = accuracyMultiplier;
        this.combatMethod = combatMethod;
        this.weaponInterface = weaponInterface;
    }
    CombatSpecial.checkSpecial = function (player, special) {
        return (Player_1.Player.getCombatSpecial() != null && Player_1.Player.getCombatSpecial() == special && player.isSpecialActivated() && player.getSpecialPercentage() >= special.getDrainAmount());
    };
    CombatSpecial.drain = function (character, amount) {
        character.decrementSpecialPercentage(amount);
        if (!character.isRecoveringSpecialAttack()) {
            TaskManager_1.TaskManager.submit(new RestoreSpecialAttackTask_1.RestoreSpecialAttackTask(character));
        }
        if (character.isPlayer()) {
            var p = character.getAsPlayer();
            CombatSpecial.updateBar(p);
        }
    };
    CombatSpecial.updateBar = function (player) {
        if (player.getWeapon().getSpecialBar() == -1 || player.getWeapon().getSpecialMeter() == -1) {
            return;
        }
        var specialCheck = 10;
        var specialBar = player.getWeapon().getSpecialMeter();
        var specialAmount = player.getSpecialPercentage() / 10;
        for (var i = 0; i < 10; i++) {
            player.getPacketSender().sendInterfaceComponentMoval(specialAmount >= specialCheck ? 500 : 0, 0, --specialBar);
            specialCheck--;
        }
        player.getPacketSender().updateSpecialAttackOrb().sendString(player.isSpecialActivated() ? ("@yel@ Special Attack (" + player.getSpecialPercentage() + "%)") : ("@bla@ Special Attack (" + player.getSpecialPercentage() + "%)"), player.getWeapon().getSpecialMeter());
        player.getPacketSender().sendSpecialAttackState(player.isSpecialActivated());
    };
    CombatSpecial.assign = function (player) {
        var e_1, _a;
        if (player.getWeapon().getSpecialBar() == -1) {
            player.setSpecialActivated(false);
            player.setCombatSpecial(null);
            CombatSpecial.updateBar(player);
            return;
        }
        try {
            for (var _b = __values(Object.values(CombatSpecial)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var c = _c.value;
                if (player.getWeapon() == c.getWeaponType()) {
                    if (c.identifiers.some(function (id) { return player.getEquipment().get(Equipment_1.Equipment.WEAPON_SLOT).getId() == id; })) {
                        player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), false);
                        player.setCombatSpecial(c);
                        return;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), true);
        player.setCombatSpecial(null);
        player.setSpecialActivated(false);
        player.getPacketSender().sendSpecialAttackState(false);
    };
    CombatSpecial.activate = function (player) {
        if (Player_1.Player.getCombatSpecial() == null) {
            return;
        }
        if (player.getDueling().inDuel() && player.getDueling().getRules()[Duelling_1.DuelRule.NO_SPECIAL_ATTACKS.getButtonId()]) {
            return;
        }
        if (player.isSpecialActivated()) {
            player.setSpecialActivated(false);
            CombatSpecial.updateBar(player);
        }
        else {
            var spec = Player_1.Player.getCombatSpecial();
            player.setSpecialActivated(true);
            CombatSpecial.updateBar(player);
            if (spec == CombatSpecial.GRANITE_MAUL) {
                if (player.getSpecialPercentage() < Player_1.Player.getCombatSpecial().getDrainAmount()) {
                    player.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                    player.setSpecialActivated(false);
                    CombatSpecial.updateBar(player);
                    return;
                }
                var target = player.getCombat().getTarget();
                if (target != null && CombatFactory_1.CombatFactory.getMethod(player).type() == CombatType_1.CombatType.MELEE) {
                    player.getCombat().performNewAttack(true);
                    return;
                }
                else {
                    // Uninformed player using gmaul without being in combat..
                    // Teach them a lesson!
                    player.getPacketSender()
                        .sendMessage("Although not required, the Granite maul special attack should be used during")
                        .sendMessage("combat for maximum effect.");
                }
            }
        }
        if (player.getInterfaceId() == BonusManager_1.BonusManager.INTERFACE_ID) {
            BonusManager_1.BonusManager.update(player);
        }
    };
    CombatSpecial.prototype.getIdentifiers = function () {
        return this.identifiers;
    };
    CombatSpecial.prototype.getDrainAmount = function () {
        return this.drainAmount;
    };
    CombatSpecial.prototype.getStrengthMultiplier = function () {
        return this.strengthMultiplier;
    };
    CombatSpecial.prototype.getAccuracyMultiplier = function () {
        return this.accuracyMultiplier;
    };
    CombatSpecial.prototype.getCombatMethod = function () {
        return this.combatMethod;
    };
    CombatSpecial.prototype.getWeaponType = function () {
        return this.weaponType;
    };
    CombatSpecial.ABYSSAL_WHIP = new CombatSpecial([4151, 21371, 15441, 15442, 15443, 15444], 50, 1, 1, new AbyssalWhipCombatMethod_1.AbyssalWhipCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.WHIP);
    CombatSpecial.ABYSSAL_TENTACLE = new CombatSpecial([12006], 50, 1, 1, new AbyssalTentacleCombatMethod_1.AbyssalTentacleCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.WHIP);
    CombatSpecial.BARRELSCHEST_ANCHOR = new CombatSpecial([10887], 50, 1.22, 1.10, new BarrelchestAnchorCombatMethod_1.BarrelchestAnchorCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.WARHAMMER);
    CombatSpecial.DRAGON_SCIMITAR = new CombatSpecial([4587], 55, 1.00, 1.25, new DragonScimitarCombatMethod_1.DragonScimitarCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.SCIMITAR);
    CombatSpecial.DRAGON_LONGSWORD = new CombatSpecial([1305], 25, 1.15, 1.25, new DragonLongswordCombatMethod_1.DragonLongswordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.LONGSWORD);
    CombatSpecial.DRAGON_MACE = new CombatSpecial([1434], 25, 1.5, 1.25, new DragonMaceCombatMethod_1.DragonMaceCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.MACE);
    CombatSpecial.DRAGON_WARHAMMER = new CombatSpecial([13576], 50, 1.5, 1.00, new DragonWarhammerCombatMethod_1.DragonWarhammerCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.WARHAMMER);
    CombatSpecial.SARADOMIN_SWORD = new CombatSpecial([11838], 100, 1.0, 1.0, new SaradominSwordCombatMethod_1.SaradominSwordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.SARADOMIN_SWORD);
    CombatSpecial.ARMADYL_GODSWORD = new CombatSpecial([11802], 50, 1.375, 2, new ArmadylGodswordCombatMethod_1.ArmadylGodswordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.GODSWORD);
    CombatSpecial.SARADOMIN_GODSWORD = new CombatSpecial([11806], 50, 1.1, 1.5, new SaradominGodswordCombatMethod_1.SaradominGodswordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.GODSWORD);
    CombatSpecial.BANDOS_GODSWORD = new CombatSpecial([11804], 100, 1.21, 1.5, new BandosGodswordCombatMethod_1.BandosGodswordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.GODSWORD);
    CombatSpecial.ZAMORAK_GODSWORD = new CombatSpecial([11808], 50, 1.1, 1.5, new ZamorakGodswordCombatMethod_1.ZamorakGodswordCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.GODSWORD);
    CombatSpecial.ABYSSAL_BLUDGEON = new CombatSpecial([13263], 50, 1.20, 1.0, new AbyssalBludgeonCombatMethod_1.AbyssalBludgeonCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.ABYSSAL_BLUDGEON);
    CombatSpecial.DRAGON_HALBERD = new CombatSpecial([3204], 30, 1.1, 1.35, new DragonHalberdCombatMethod_1.DragonHalberdCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.HALBERD);
    CombatSpecial.DRAGON_DAGGER = new CombatSpecial([1215, 1231, 5680, 5698], 25, 1.15, 1.20, new DragonDaggerCombatMethod_1.DragonDaggerCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.DRAGON_DAGGER);
    CombatSpecial.ABYSSAL_DAGGER = new CombatSpecial([13271], 50, 0.85, 1.25, new AbyssalDaggerCombatMethod_1.AbyssalDaggerCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.ABYSSAL_DAGGER);
    CombatSpecial.GRANITE_MAUL = new CombatSpecial([4153, 12848], 50, 1, 1, new GraniteMaulCombatMethod_1.GraniteMaulCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.GRANITE_MAUL);
    CombatSpecial.DRAGON_CLAWS = new CombatSpecial([13652], 50, 1, 1.35, new DragonClawCombatMethod_1.DragonClawCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.CLAWS);
    CombatSpecial.MAGIC_SHORTBOW = new CombatSpecial([861], 55, 1, 1, new MagicShortbowCombatMethod_1.MagicShortbowCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.SHORTBOW);
    CombatSpecial.DARK_BOW = new CombatSpecial([11235], 55, 1.5, 1.35, new DarkBowCombatMethod_1.DarkBowCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.DARK_BOW);
    CombatSpecial.ARMADYL_CROSSBOW = new CombatSpecial([11785], 40, 1, 2.0, new ArmadylCrossbowCombatMethod_1.ArmadylCrossbowCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.CROSSBOW);
    CombatSpecial.BALLISTA = new CombatSpecial([19481], 65, 1.25, 1.45, new BallistaCombatMethod_1.BallistaCombatMethod(), WeaponInterfaces_1.WeaponInterfaces.BALLISTA);
    return CombatSpecial;
}());
//# sourceMappingURL=CombatSpecial.js.map