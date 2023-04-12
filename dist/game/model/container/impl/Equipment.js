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
exports.Equipment = void 0;
var ItemContainer_1 = require("../ItemContainer");
var Item_1 = require("../../Item");
var StackType_1 = require("../StackType");
var WeaponInterfaces_1 = require("../../../content/combat/WeaponInterfaces");
var ItemDefinition_1 = require("../../../definition/ItemDefinition");
var Equipment = exports.Equipment = /** @class */ (function (_super) {
    __extends(Equipment, _super);
    function Equipment(player) {
        var _this = _super.call(this, player) || this;
        _this.player = player;
        return _this;
    }
    Equipment.prototype.full = function () {
        return this;
    };
    Equipment.getItemCount = function (p, s, inventory) {
        var e_1, _a, e_2, _b;
        var count = 0;
        try {
            for (var _c = __values(p.getEquipment().getItems()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var t = _d.value;
                if (t == null || t.getId() < 1 || t.getAmount() < 1)
                    continue;
                if (t.getDefinition().getName().toLowerCase().includes(s.toLowerCase()))
                    count++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (inventory) {
            try {
                for (var _e = __values(p.getInventory().getItems()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var t = _f.value;
                    if (t == null || t.getId() < 1 || t.getAmount() < 1)
                        continue;
                    if (t.getDefinition().getName().toLowerCase().includes(s.toLowerCase()))
                        count++;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return count;
    };
    Equipment.prototype.capacity = function () {
        return 14;
    };
    Equipment.prototype.stackType = function () {
        return StackType_1.StackType.DEFAULT;
    };
    Equipment.prototype.refreshItems = function () {
        this.getPlayer().getPacketSender().sendItemContainer(this, Equipment.INVENTORY_INTERFACE_ID);
        return this;
    };
    Equipment.prototype.wearingNexAmours = function () {
        var head = this.player.getEquipment().getItems()[Equipment.HEAD_SLOT].getId();
        var body = this.player.getEquipment().getItems()[Equipment.BODY_SLOT].getId();
        var legs = this.player.getEquipment().getItems()[Equipment.LEG_SLOT].getId();
        var torva = head === 14008 && body === 14009 && legs === 14010;
        var pernix = head === 14011 && body === 14012 && legs === 14013;
        var virtus = head === 14014 && body === 14015 && legs === 14016;
        return torva || pernix || virtus;
    };
    Equipment.prototype.wearingHalberd = function () {
        var itemId = this.getPlayer().getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        var itemDef = ItemDefinition_1.ItemDefinition.forId(itemId);
        return itemDef != null && itemDef.getName().toLowerCase().endsWith("halberd");
    };
    Equipment.prototype.properEquipmentForWilderness = function () {
        var e_3, _a;
        var count = 0;
        try {
            for (var _b = __values(this.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item != null && item.getDefinition().isTradeable())
                    count++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return count >= 3;
    };
    Equipment.prototype.hasStaffEquipped = function () {
        var staff = this.get(Equipment.WEAPON_SLOT);
        return (staff != null && (this.player.getWeapon() == WeaponInterfaces_1.WeaponInterfaces.STAFF
            || this.player.getWeapon() == WeaponInterfaces_1.WeaponInterfaces.ANCIENT_STAFF));
    };
    Equipment.prototype.getWeapon = function () {
        return this.get(Equipment.WEAPON_SLOT);
    };
    Equipment.prototype.hasCastleWarsBracelet = function () {
        var hands = this.get(Equipment.HANDS_SLOT);
        return hands != null && hands.getId() >= 11079 && hands.getId() <= 11083;
    };
    Equipment.prototype.hasGodsword = function () {
        return this.get(Equipment.WEAPON_SLOT) != null && this.get(Equipment.WEAPON_SLOT).getDefinition().getName().toLowerCase().includes("godsword");
    };
    Equipment.INVENTORY_INTERFACE_ID = 1688;
    Equipment.EQUIPMENT_SCREEN_INTERFACE_ID = 15106;
    Equipment.HEAD_SLOT = 0;
    Equipment.CAPE_SLOT = 1;
    Equipment.AMULET_SLOT = 2;
    Equipment.WEAPON_SLOT = 3;
    Equipment.BODY_SLOT = 4;
    Equipment.SHIELD_SLOT = 5;
    Equipment.LEG_SLOT = 7;
    Equipment.HANDS_SLOT = 9;
    Equipment.FEET_SLOT = 10;
    Equipment.RING_SLOT = 12;
    Equipment.AMMUNITION_SLOT = 13;
    Equipment.NO_ITEM = new Item_1.Item(-1);
    Equipment.ITEM_COUNT = 10;
    return Equipment;
}(ItemContainer_1.ItemContainer));
//# sourceMappingURL=Equipment.js.map