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
exports.WeaponInterfaces = void 0;
var Equipment_1 = require("../../model/container/impl/Equipment");
var FightType_1 = require("../combat/FightType");
var CombatSpecial_1 = require("./CombatSpecial");
var FightStyle_1 = require("./FightStyle");
var WeaponInterfaces = exports.WeaponInterfaces = /** @class */ (function () {
    function WeaponInterfaces(interfaceId, nameLineId, speed, fightType, specialBar, specialMeter) {
        this.interfaceId = interfaceId;
        this.nameLineId = nameLineId;
        this.speed = speed;
        this.fightType = fightType;
        this.specialBar = specialBar;
        this.specialMeter = specialMeter;
    }
    /**
     * Assigns an interface to the combat sidebar based on the argued weapon.
     *
     * @param player the player that the interface will be assigned for.
     */
    WeaponInterfaces.assign = function (player) {
        var e_1, _a;
        var equippedWeapon = player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT];
        var weapon = WeaponInterfaces.UNARMED;
        //Get the currently equipped weapon's interface
        if (equippedWeapon.getId() > 0) {
            if (equippedWeapon.getDefinition().getWeaponInterface() != null) {
                weapon = equippedWeapon.getDefinition().getWeaponInterface();
            }
        }
        if (weapon == WeaponInterfaces.UNARMED) {
            player.getPacketSender().sendTabInterface(0, weapon.getInterfaceId());
            player.getPacketSender().sendString("Unarmed", weapon.getNameLineId());
            player.setWeapon(WeaponInterfaces.UNARMED);
        }
        else if (weapon == WeaponInterfaces.CROSSBOW) {
            player.getPacketSender().sendString("Weapon: ", weapon.getNameLineId() - 1);
        }
        else if (weapon == WeaponInterfaces.WHIP) {
            player.getPacketSender().sendString("Weapon: ", weapon.getNameLineId() - 1);
        }
        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, 200, item);
        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, item, 0, 1);
        player.getPacketSender().sendTabInterface(0, weapon.getInterfaceId());
        player.getPacketSender().sendString((weapon == WeaponInterfaces.UNARMED ? "Unarmed" : equippedWeapon.getDefinition().getName()), weapon.getNameLineId());
        player.setWeapon(weapon);
        CombatSpecial_1.CombatSpecial.assign(player);
        CombatSpecial_1.CombatSpecial.updateBar(player);
        try {
            //Search for an attack style matching ours
            /*  for (const type of weapon.getFightType()) {
                    if (type.getStyle() == player.getCombat().getFightType().getStyle()) {
                        player.setFightType(type);
                        player.getPacketSender().sendConfig(player.getCombat().getFightType().getParentId(), player.getCombat().getFightType().getChildId());
                        return;
                    }
                }*/
            //Set default attack style to aggressive!
            for (var _b = __values(Object.values(weapon.getFightType())), _c = _b.next(); !_c.done; _c = _b.next()) {
                var type = _c.value;
                if (type instanceof FightType_1.FightType) {
                    if (FightType_1.FightType.getStyle() == FightStyle_1.FightStyle.AGGRESSIVE) {
                        player.setFightType(type);
                        player.getPacketSender().sendConfig(FightType_1.FightType.getParentId(), FightType_1.FightType.getChildId());
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
        //Still no proper attack style.
        //Set it to the first one..
        player.setFightType(player.getWeapon().getFightType()[0]);
        player.getPacketSender().sendConfig(FightType_1.FightType.getParentId(), FightType_1.FightType.getChildId());
    };
    WeaponInterfaces.changeCombatSettings = function (player, button) {
        switch (button) {
            case 1772: // shortbow & longbow
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType_1.FightType.SHORTBOW_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType_1.FightType.LONGBOW_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType_1.FightType.CROSSBOW_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType_1.FightType.KARILS_CROSSBOW_ACCURATE);
                }
                return true;
            case 1771:
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType_1.FightType.SHORTBOW_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType_1.FightType.LONGBOW_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType_1.FightType.CROSSBOW_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType_1.FightType.KARILS_CROSSBOW_RAPID);
                }
                return true;
            case 1770:
                if (player.getWeapon() == WeaponInterfaces.SHORTBOW) {
                    player.setFightType(FightType_1.FightType.SHORTBOW_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGBOW
                    || player.getWeapon() == WeaponInterfaces.DARK_BOW) {
                    player.setFightType(FightType_1.FightType.LONGBOW_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.CROSSBOW) {
                    player.setFightType(FightType_1.FightType.CROSSBOW_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.KARILS_CROSSBOW) {
                    player.setFightType(FightType_1.FightType.KARILS_CROSSBOW_LONGRANGE);
                }
                return true;
            case 2282: // dagger & sword
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType_1.FightType.DAGGER_STAB);
                }
                else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType_1.FightType.DRAGON_DAGGER_STAB);
                }
                else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType_1.FightType.SWORD_STAB);
                }
                else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType_1.FightType.GHRAZI_RAPIER_STAB);
                }
                return true;
            case 2285:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType_1.FightType.DAGGER_LUNGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType_1.FightType.DRAGON_DAGGER_LUNGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType_1.FightType.SWORD_LUNGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType_1.FightType.GHRAZI_RAPIER_LUNGE);
                }
                return true;
            case 2284:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType_1.FightType.DAGGER_SLASH);
                }
                else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType_1.FightType.DRAGON_DAGGER_SLASH);
                }
                else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType_1.FightType.SWORD_SLASH);
                }
                else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType_1.FightType.GHRAZI_RAPIER_SLASH);
                }
                return true;
            case 2283:
                if (player.getWeapon() == WeaponInterfaces.DAGGER) {
                    player.setFightType(FightType_1.FightType.DAGGER_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.DRAGON_DAGGER) {
                    player.setFightType(FightType_1.FightType.DRAGON_DAGGER_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.SWORD) {
                    player.setFightType(FightType_1.FightType.SWORD_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.GHRAZI_RAPIER) {
                    player.setFightType(FightType_1.FightType.GHRAZI_RAPIER_BLOCK);
                }
                return true;
            case 2429: // scimitar & longsword
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType_1.FightType.SCIMITAR_CHOP);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType_1.FightType.LONGSWORD_CHOP);
                }
                return true;
            case 2432:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType_1.FightType.SCIMITAR_SLASH);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType_1.FightType.LONGSWORD_SLASH);
                }
                return true;
            case 2431:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType_1.FightType.SCIMITAR_LUNGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType_1.FightType.LONGSWORD_LUNGE);
                }
                return true;
            case 2430:
                if (player.getWeapon() == WeaponInterfaces.SCIMITAR) {
                    player.setFightType(FightType_1.FightType.SCIMITAR_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.LONGSWORD) {
                    player.setFightType(FightType_1.FightType.LONGSWORD_BLOCK);
                }
                return true;
            case 3802: // mace
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType_1.FightType.VERACS_FLAIL_POUND);
                }
                else {
                    player.setFightType(FightType_1.FightType.MACE_POUND);
                }
                return true;
            case 3805:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType_1.FightType.VERACS_FLAIL_PUMMEL);
                }
                else {
                    player.setFightType(FightType_1.FightType.MACE_PUMMEL);
                }
                return true;
            case 3804:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType_1.FightType.VERACS_FLAIL_SPIKE);
                }
                else {
                    player.setFightType(FightType_1.FightType.MACE_SPIKE);
                }
                return true;
            case 3803:
                if (player.getWeapon() == WeaponInterfaces.VERACS_FLAIL) {
                    player.setFightType(FightType_1.FightType.VERACS_FLAIL_BLOCK);
                }
                else {
                    player.setFightType(FightType_1.FightType.MACE_BLOCK);
                }
                return true;
            case 4454: // knife, thrownaxe, dart & javelin
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType_1.FightType.KNIFE_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType_1.FightType.OBBY_RING_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType_1.FightType.THROWNAXE_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType_1.FightType.DART_ACCURATE);
                }
                else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType_1.FightType.JAVELIN_ACCURATE);
                }
                return true;
            case 4453:
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType_1.FightType.KNIFE_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType_1.FightType.OBBY_RING_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType_1.FightType.THROWNAXE_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType_1.FightType.DART_RAPID);
                }
                else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType_1.FightType.JAVELIN_RAPID);
                }
                return true;
            case 4452:
                if (player.getWeapon() == WeaponInterfaces.KNIFE) {
                    player.setFightType(FightType_1.FightType.KNIFE_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.OBBY_RINGS) {
                    player.setFightType(FightType_1.FightType.OBBY_RING_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.THROWNAXE) {
                    player.setFightType(FightType_1.FightType.THROWNAXE_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.DART) {
                    player.setFightType(FightType_1.FightType.DART_LONGRANGE);
                }
                else if (player.getWeapon() == WeaponInterfaces.JAVELIN) {
                    player.setFightType(FightType_1.FightType.JAVELIN_LONGRANGE);
                }
                return true;
            case 4685: // spear
                player.setFightType(FightType_1.FightType.SPEAR_LUNGE);
                return true;
            case 4688:
                player.setFightType(FightType_1.FightType.SPEAR_SWIPE);
                return true;
            case 4687:
                player.setFightType(FightType_1.FightType.SPEAR_POUND);
                return true;
            case 4686:
                player.setFightType(FightType_1.FightType.SPEAR_BLOCK);
                return true;
            case 4711: // 2h sword
                player.setFightType(player.getEquipment().hasGodsword() ? FightType_1.FightType.GODSWORD_CHOP : FightType_1.FightType.TWOHANDEDSWORD_CHOP);
                return true;
            case 4714:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType_1.FightType.GODSWORD_SLASH : FightType_1.FightType.TWOHANDEDSWORD_SLASH);
                return true;
            case 4713:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType_1.FightType.GODSWORD_SMASH : FightType_1.FightType.TWOHANDEDSWORD_SMASH);
                return true;
            case 4712:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType_1.FightType.GODSWORD_BLOCK : FightType_1.FightType.TWOHANDEDSWORD_BLOCK);
                return true;
            case 5576: // pickaxe
                player.setFightType(FightType_1.FightType.PICKAXE_SPIKE);
                return true;
            case 5579:
                player.setFightType(FightType_1.FightType.PICKAXE_IMPALE);
                return true;
            case 5578:
                player.setFightType(FightType_1.FightType.PICKAXE_SMASH);
                return true;
            case 5577:
                player.setFightType(FightType_1.FightType.PICKAXE_BLOCK);
                return true;
            case 7768: // claws
                player.setFightType(FightType_1.FightType.CLAWS_CHOP);
                return true;
            case 7771:
                player.setFightType(FightType_1.FightType.CLAWS_SLASH);
                return true;
            case 7770:
                player.setFightType(FightType_1.FightType.CLAWS_LUNGE);
                return true;
            case 7769:
                player.setFightType(FightType_1.FightType.CLAWS_BLOCK);
                return true;
            case 8466: // halberd
                player.setFightType(FightType_1.FightType.HALBERD_JAB);
                return true;
            case 8468:
                player.setFightType(FightType_1.FightType.HALBERD_SWIPE);
                return true;
            case 8467:
                player.setFightType(FightType_1.FightType.HALBERD_FEND);
                return true;
            case 5861: // unarmed
                player.setFightType(FightType_1.FightType.UNARMED_BLOCK);
                return true;
            case 5862:
                player.setFightType(FightType_1.FightType.UNARMED_KICK);
                return true;
            case 5860:
                player.setFightType(FightType_1.FightType.UNARMED_PUNCH);
                return true;
            case 12298: // whip
                player.setFightType(FightType_1.FightType.WHIP_FLICK);
                return true;
            case 12297:
                player.setFightType(FightType_1.FightType.WHIP_LASH);
                return true;
            case 12296:
                player.setFightType(FightType_1.FightType.WHIP_DEFLECT);
                return true;
            case 336: // staff
                player.setFightType(FightType_1.FightType.STAFF_BASH);
                return true;
            case 335:
                player.setFightType(FightType_1.FightType.STAFF_POUND);
                return true;
            case 334:
                player.setFightType(FightType_1.FightType.STAFF_FOCUS);
                return true;
            case 433: // warhammer
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType_1.FightType.GRANITE_MAUL_POUND);
                }
                else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType_1.FightType.MAUL_POUND);
                }
                else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType_1.FightType.WARHAMMER_POUND);
                }
                else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType_1.FightType.ELDER_MAUL_POUND);
                }
                return true;
            case 432:
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType_1.FightType.GRANITE_MAUL_PUMMEL);
                }
                else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType_1.FightType.MAUL_PUMMEL);
                }
                else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType_1.FightType.WARHAMMER_PUMMEL);
                }
                else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType_1.FightType.ELDER_MAUL_PUMMEL);
                }
                return true;
            case 431:
                if (player.getWeapon() == WeaponInterfaces.GRANITE_MAUL) {
                    player.setFightType(FightType_1.FightType.GRANITE_MAUL_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.MAUL) {
                    player.setFightType(FightType_1.FightType.MAUL_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.WARHAMMER) {
                    player.setFightType(FightType_1.FightType.WARHAMMER_BLOCK);
                }
                else if (player.getWeapon() == WeaponInterfaces.ELDER_MAUL) {
                    player.setFightType(FightType_1.FightType.ELDER_MAUL_BLOCK);
                }
                return true;
            case 782: // scythe
                player.setFightType(FightType_1.FightType.SCYTHE_REAP);
                return true;
            case 784:
                player.setFightType(FightType_1.FightType.SCYTHE_CHOP);
                return true;
            case 785:
                player.setFightType(FightType_1.FightType.SCYTHE_JAB);
                return true;
            case 783:
                player.setFightType(FightType_1.FightType.SCYTHE_BLOCK);
                return true;
            case 1704: // battle axe
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType_1.FightType.GREATAXE_CHOP);
                }
                else {
                    player.setFightType(FightType_1.FightType.BATTLEAXE_CHOP);
                }
                return true;
            case 1707:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType_1.FightType.GREATAXE_HACK);
                }
                else {
                    player.setFightType(FightType_1.FightType.BATTLEAXE_HACK);
                }
                return true;
            case 1706:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType_1.FightType.GREATAXE_SMASH);
                }
                else {
                    player.setFightType(FightType_1.FightType.BATTLEAXE_SMASH);
                }
                return true;
            case 1705:
                if (player.getWeapon() == WeaponInterfaces.GREATAXE) {
                    player.setFightType(FightType_1.FightType.GREATAXE_BLOCK);
                }
                else {
                    player.setFightType(FightType_1.FightType.BATTLEAXE_BLOCK);
                }
                return true;
            case 29138:
            case 29038:
            case 29063:
            case 29113:
            case 29163:
            case 29188:
            case 29213:
            case 29238:
            case 30007:
            case 48023:
            case 33033:
            case 30108:
            case 7473:
            case 7562:
            case 7487:
            case 7788:
            case 8481:
            case 7612:
            case 7587:
            case 7662:
            case 7462:
            case 7548:
            case 7687:
            case 7537:
            case 7623:
            case 12322:
            case 7637:
            case 12311:
            case 155:
                CombatSpecial_1.CombatSpecial.activate(player);
                return true;
        }
        return false;
    };
    WeaponInterfaces.prototype.getInterfaceId = function () {
        return this.interfaceId;
    };
    WeaponInterfaces.prototype.getNameLineId = function () {
        return this.nameLineId;
    };
    WeaponInterfaces.prototype.getSpeed = function () {
        return this.speed;
    };
    WeaponInterfaces.prototype.getFightType = function () {
        return this.fightType;
    };
    WeaponInterfaces.prototype.getSpecialBar = function () {
        return this.specialBar;
    };
    WeaponInterfaces.prototype.getSpecialMeter = function () {
        return this.specialMeter;
    };
    WeaponInterfaces.STAFF = new WeaponInterfaces(328, 355, 5, [FightType_1.FightType.STAFF_BASH, FightType_1.FightType.STAFF_POUND, FightType_1.FightType.STAFF_FOCUS]);
    WeaponInterfaces.WARHAMMER = new WeaponInterfaces(425, 428, 6, [FightType_1.FightType.WARHAMMER_POUND,
        FightType_1.FightType.WARHAMMER_PUMMEL, FightType_1.FightType.WARHAMMER_BLOCK], 7474, 7486);
    WeaponInterfaces.MAUL = new WeaponInterfaces(425, 428, 7, [FightType_1.FightType.MAUL_POUND,
        FightType_1.FightType.MAUL_PUMMEL, FightType_1.FightType.MAUL_BLOCK], 7474, 7486);
    WeaponInterfaces.GRANITE_MAUL = new WeaponInterfaces(425, 428, 7, [FightType_1.FightType.GRANITE_MAUL_POUND,
        FightType_1.FightType.GRANITE_MAUL_PUMMEL, FightType_1.FightType.GRANITE_MAUL_BLOCK], 7474, 7486);
    WeaponInterfaces.VERACS_FLAIL = new WeaponInterfaces(3796, 3799, 5, [FightType_1.FightType.VERACS_FLAIL_POUND,
        FightType_1.FightType.VERACS_FLAIL_PUMMEL, FightType_1.FightType.VERACS_FLAIL_SPIKE,
        FightType_1.FightType.VERACS_FLAIL_BLOCK], 7624, 7636);
    WeaponInterfaces.SCYTHE = new WeaponInterfaces(776, 779, 4, [FightType_1.FightType.SCYTHE_REAP,
        FightType_1.FightType.SCYTHE_CHOP, FightType_1.FightType.SCYTHE_JAB,
        FightType_1.FightType.SCYTHE_BLOCK]);
    WeaponInterfaces.BATTLEAXE = new WeaponInterfaces(1698, 1701, 5, [FightType_1.FightType.BATTLEAXE_CHOP,
        FightType_1.FightType.BATTLEAXE_HACK, FightType_1.FightType.BATTLEAXE_SMASH,
        FightType_1.FightType.BATTLEAXE_BLOCK], 7499, 7511);
    WeaponInterfaces.GREATAXE = new WeaponInterfaces(1698, 1701, 7, [FightType_1.FightType.GREATAXE_CHOP,
        FightType_1.FightType.GREATAXE_HACK, FightType_1.FightType.GREATAXE_SMASH,
        FightType_1.FightType.GREATAXE_BLOCK], 7499, 7511);
    WeaponInterfaces.CROSSBOW = new WeaponInterfaces(1764, 1767, 6, [FightType_1.FightType.CROSSBOW_ACCURATE,
        FightType_1.FightType.CROSSBOW_RAPID, FightType_1.FightType.CROSSBOW_LONGRANGE], 7549, 7561);
    WeaponInterfaces.BALLISTA = new WeaponInterfaces(1764, 1767, 7, [FightType_1.FightType.BALLISTA_ACCURATE,
        FightType_1.FightType.BALLISTA_RAPID, FightType_1.FightType.BALLISTA_LONGRANGE], 7549, 7561);
    WeaponInterfaces.BLOWPIPE = new WeaponInterfaces(1764, 1767, 3, [FightType_1.FightType.BLOWPIPE_ACCURATE,
        FightType_1.FightType.BLOWPIPE_RAPID, FightType_1.FightType.BLOWPIPE_LONGRANGE], 7549, 7561);
    WeaponInterfaces.KARILS_CROSSBOW = new WeaponInterfaces(1764, 1767, 4, [FightType_1.FightType.KARILS_CROSSBOW_ACCURATE,
        FightType_1.FightType.KARILS_CROSSBOW_RAPID, FightType_1.FightType.KARILS_CROSSBOW_LONGRANGE], 7549, 7561);
    WeaponInterfaces.SHORTBOW = new WeaponInterfaces(1764, 1767, 4, [FightType_1.FightType.SHORTBOW_ACCURATE,
        FightType_1.FightType.SHORTBOW_RAPID, FightType_1.FightType.SHORTBOW_LONGRANGE], 7549, 7561);
    WeaponInterfaces.LONGBOW = new WeaponInterfaces(1764, 1767, 6, [FightType_1.FightType.LONGBOW_ACCURATE,
        FightType_1.FightType.LONGBOW_RAPID, FightType_1.FightType.LONGBOW_LONGRANGE], 7549, 7561);
    WeaponInterfaces.DRAGON_DAGGER = new WeaponInterfaces(2276, 2279, 4, [FightType_1.FightType.DRAGON_DAGGER_STAB,
        FightType_1.FightType.DRAGON_DAGGER_LUNGE, FightType_1.FightType.DRAGON_DAGGER_SLASH,
        FightType_1.FightType.DRAGON_DAGGER_BLOCK], 7574, 7586);
    WeaponInterfaces.ABYSSAL_DAGGER = new WeaponInterfaces(2276, 2279, 4, [FightType_1.FightType.DRAGON_DAGGER_STAB,
        FightType_1.FightType.DRAGON_DAGGER_LUNGE, FightType_1.FightType.DRAGON_DAGGER_SLASH,
        FightType_1.FightType.DRAGON_DAGGER_BLOCK], 7574, 7586);
    WeaponInterfaces.DAGGER = new WeaponInterfaces(2276, 2279, 4, [FightType_1.FightType.DAGGER_STAB,
        FightType_1.FightType.DAGGER_LUNGE, FightType_1.FightType.DAGGER_SLASH,
        FightType_1.FightType.DAGGER_BLOCK], 7574, 7586);
    WeaponInterfaces.SWORD = new WeaponInterfaces(2276, 2279, 5, [FightType_1.FightType.SWORD_STAB,
        FightType_1.FightType.SWORD_LUNGE, FightType_1.FightType.SWORD_SLASH,
        FightType_1.FightType.SWORD_BLOCK], 7574, 7586);
    WeaponInterfaces.SCIMITAR = new WeaponInterfaces(2423, 2426, 4, [FightType_1.FightType.SCIMITAR_CHOP,
        FightType_1.FightType.SCIMITAR_SLASH, FightType_1.FightType.SCIMITAR_LUNGE,
        FightType_1.FightType.SCIMITAR_BLOCK], 7599, 7611);
    WeaponInterfaces.LONGSWORD = new WeaponInterfaces(2423, 2426, 5, [FightType_1.FightType.LONGSWORD_CHOP,
        FightType_1.FightType.LONGSWORD_SLASH, FightType_1.FightType.LONGSWORD_LUNGE,
        FightType_1.FightType.LONGSWORD_BLOCK], 7599, 7611);
    WeaponInterfaces.MACE = new WeaponInterfaces(3796, 3799, 5, [FightType_1.FightType.MACE_POUND,
        FightType_1.FightType.MACE_PUMMEL, FightType_1.FightType.MACE_SPIKE,
        FightType_1.FightType.MACE_BLOCK], 7624, 7636);
    WeaponInterfaces.KNIFE = new WeaponInterfaces(4446, 4449, 3, [FightType_1.FightType.KNIFE_ACCURATE,
        FightType_1.FightType.KNIFE_RAPID, FightType_1.FightType.KNIFE_LONGRANGE], 7649, 7661);
    WeaponInterfaces.OBBY_RINGS = new WeaponInterfaces(4446, 4449, 4, [FightType_1.FightType.OBBY_RING_ACCURATE,
        FightType_1.FightType.OBBY_RING_RAPID, FightType_1.FightType.OBBY_RING_LONGRANGE], 7649, 7661);
    WeaponInterfaces.SPEAR = new WeaponInterfaces(4679, 4682, 5, [FightType_1.FightType.SPEAR_LUNGE,
        FightType_1.FightType.SPEAR_SWIPE, FightType_1.FightType.SPEAR_POUND,
        FightType_1.FightType.SPEAR_BLOCK], 7674, 7686);
    WeaponInterfaces.TWO_HANDED_SWORD = new WeaponInterfaces(4705, 4708, 7, [FightType_1.FightType.TWOHANDEDSWORD_CHOP, FightType_1.FightType.TWOHANDEDSWORD_SLASH,
        FightType_1.FightType.TWOHANDEDSWORD_SMASH, FightType_1.FightType.TWOHANDEDSWORD_BLOCK], 7699, 7711);
    WeaponInterfaces.PICKAXE = new WeaponInterfaces(5570, 5573, 5, [FightType_1.FightType.PICKAXE_SPIKE,
        FightType_1.FightType.PICKAXE_IMPALE, FightType_1.FightType.PICKAXE_SMASH,
        FightType_1.FightType.PICKAXE_BLOCK]);
    WeaponInterfaces.CLAWS = new WeaponInterfaces(7762, 7765, 4, [FightType_1.FightType.CLAWS_CHOP,
        FightType_1.FightType.CLAWS_SLASH, FightType_1.FightType.CLAWS_LUNGE,
        FightType_1.FightType.CLAWS_BLOCK], 7800, 7812);
    WeaponInterfaces.HALBERD = new WeaponInterfaces(8460, 8463, 7, [FightType_1.FightType.HALBERD_JAB,
        FightType_1.FightType.HALBERD_SWIPE, FightType_1.FightType.HALBERD_FEND], 8493, 8505);
    WeaponInterfaces.UNARMED = new WeaponInterfaces(5855, 5857, 4, [FightType_1.FightType.UNARMED_PUNCH,
        FightType_1.FightType.UNARMED_KICK, FightType_1.FightType.UNARMED_BLOCK]);
    WeaponInterfaces.WHIP = new WeaponInterfaces(12290, 12293, 4, [FightType_1.FightType.WHIP_FLICK,
        FightType_1.FightType.WHIP_LASH, FightType_1.FightType.WHIP_DEFLECT], 12323, 12335);
    WeaponInterfaces.THROWNAXE = new WeaponInterfaces(4446, 4449, 4, [FightType_1.FightType.THROWNAXE_ACCURATE, FightType_1.FightType.THROWNAXE_RAPID,
        FightType_1.FightType.THROWNAXE_LONGRANGE], 7649, 7661);
    WeaponInterfaces.DART = new WeaponInterfaces(4446, 4449, 3, [FightType_1.FightType.DART_ACCURATE,
        FightType_1.FightType.DART_RAPID, FightType_1.FightType.DART_LONGRANGE], 7649, 7661);
    WeaponInterfaces.JAVELIN = new WeaponInterfaces(4446, 4449, 3, [FightType_1.FightType.JAVELIN_ACCURATE,
        FightType_1.FightType.JAVELIN_RAPID, FightType_1.FightType.JAVELIN_LONGRANGE], 7649, 7661);
    WeaponInterfaces.ANCIENT_STAFF = new WeaponInterfaces(328, 355, 4, [FightType_1.FightType.STAFF_BASH, FightType_1.FightType.STAFF_POUND, FightType_1.FightType.STAFF_FOCUS]);
    WeaponInterfaces.DARK_BOW = new WeaponInterfaces(1764, 1767, 8, [FightType_1.FightType.LONGBOW_ACCURATE,
        FightType_1.FightType.LONGBOW_RAPID, FightType_1.FightType.LONGBOW_LONGRANGE], 7549, 7561);
    WeaponInterfaces.GODSWORD = new WeaponInterfaces(4705, 4708, 6, [FightType_1.FightType.GODSWORD_CHOP, FightType_1.FightType.GODSWORD_SLASH,
        FightType_1.FightType.GODSWORD_SMASH, FightType_1.FightType.GODSWORD_BLOCK], 7699, 7711);
    WeaponInterfaces.ABYSSAL_BLUDGEON = new WeaponInterfaces(4705, 4708, 4, [FightType_1.FightType.ABYSSAL_BLUDGEON_CHOP, FightType_1.FightType.ABYSSAL_BLUDGEON_SLASH,
        FightType_1.FightType.ABYSSAL_BLUDGEON_SMASH, FightType_1.FightType.ABYSSAL_BLUDGEON_BLOCK], 7699, 7711);
    WeaponInterfaces.SARADOMIN_SWORD = new WeaponInterfaces(4705, 4708, 4, [FightType_1.FightType.TWOHANDEDSWORD_CHOP, FightType_1.FightType.TWOHANDEDSWORD_SLASH,
        FightType_1.FightType.TWOHANDEDSWORD_SMASH, FightType_1.FightType.TWOHANDEDSWORD_BLOCK], 7699, 7711);
    WeaponInterfaces.ELDER_MAUL = new WeaponInterfaces(425, 428, 6, [FightType_1.FightType.ELDER_MAUL_POUND,
        FightType_1.FightType.ELDER_MAUL_PUMMEL, FightType_1.FightType.ELDER_MAUL_BLOCK], 7474, 7486);
    WeaponInterfaces.GHRAZI_RAPIER = new WeaponInterfaces(2276, 2279, 4, [FightType_1.FightType.GHRAZI_RAPIER_STAB,
        FightType_1.FightType.GHRAZI_RAPIER_LUNGE, FightType_1.FightType.GHRAZI_RAPIER_SLASH,
        FightType_1.FightType.GHRAZI_RAPIER_BLOCK], 7574, 7586);
    return WeaponInterfaces;
}());
//# sourceMappingURL=WeaponInterfaces.js.map