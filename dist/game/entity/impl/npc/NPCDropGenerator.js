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
exports.NPCDropGenerator = void 0;
var NpcDropDefinition_1 = require("../../../definition/NpcDropDefinition");
var ItemOnGroundManager_1 = require("../grounditem/ItemOnGroundManager");
var Item_1 = require("../../../model/Item");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var RandomGen_1 = require("../../../../util/RandomGen");
var NPCDropGenerator = /** @class */ (function () {
    function NPCDropGenerator(player, def) {
        this.player = player;
        this.def = def;
    }
    NPCDropGenerator.start = function (player, npc) {
        var e_1, _a;
        var def = NpcDropDefinition_1.NpcDropDefinition.get(npc.getId());
        if (def) {
            var gen = new NPCDropGenerator(player, def);
            try {
                for (var _b = __values(gen.getDropList()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (!item.getDefinition().isStackable()) {
                        for (var i = 0; i < item.getAmount(); i++) {
                            ItemOnGroundManager_1.ItemOnGroundManager.registerLocation(player, new Item_1.Item(item.getId(), 1), npc.getLocation());
                        }
                    }
                    else {
                        ItemOnGroundManager_1.ItemOnGroundManager.registerLocation(player, item, npc.getLocation());
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
        }
    };
    NPCDropGenerator.prototype.getDropList = function () {
        var e_2, _a;
        // The {@RandomGen} which will help us randomize drops..
        var random = new RandomGen_1.RandomGen();
        // The list containing the {@link Item} that will be dropped for the player.
        var items = [];
        // The list containing the drop tables which we've gone through.
        var parsedTables = [];
        // Drop "always" items..
        if (this.def.getAlwaysDrops() != null) {
            try {
                for (var _b = __values(this.def.getAlwaysDrops()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var drop = _c.value;
                    items.push(drop.toItem(random));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        // Handle RDT.. If a drop is generated from RDT, no further items should be
        // given.
        // There are 128 slots in the rdt, many empty. When a player is wearing ring of
        // wealth, the empty slots are not counted.
        if (this.def.getRdtChance() > 0 && Math.floor(Math.random() * this.def.getRdtChance()) == 0) {
            var rdtLength = Object.keys(NpcDropDefinition_1.RDT).length / 2;
            var slots = this.wearingRingOfWealth() ? rdtLength : 128;
            var slot = Math.floor(Math.random() * slots);
            if (slot < rdtLength) {
                var rdtDrop = NpcDropDefinition_1.RDT[slot];
                if (Math.floor(Math.random() * rdtDrop.getChance()) == 0) {
                    items.push(new Item_1.Item(rdtDrop.getItemId(), rdtDrop.getAmount()));
                    return items;
                }
            }
        }
        // Handle unique drops..
        // The amount of items the player will receive from the unique drop tables.
        // Note: A player cannot receive multiple drops from the same drop table.
        var rolls = 1 + Math.floor(random.getRandom() * 3);
        for (var i = 0; i < rolls; i++) {
            var table = void 0;
            // Check if we should access the special drop table..
            if (this.def.getSpecialDrops() != null && !parsedTables.includes(NpcDropDefinition_1.DropTable.SPECIAL)) {
                if (this.def.getSpecialDrops().length > 0) {
                    var drop = this.def.getSpecialDrops()[Math.floor(random.getRandom() * this.def.getSpecialDrops().length)];
                    if (Math.floor(random.getRandom() * drop.getChance()) === 0) {
                        items.push(drop.toItem(random));
                        parsedTables.push(NpcDropDefinition_1.DropTable.SPECIAL);
                        continue;
                    }
                }
            }
            // If we didn't get a special drop, attempt to find a different table..
            if (!table) {
                var chance = Math.random() * 100;
                if ((table = this.getDropTable(chance)) != undefined) {
                    // Make sure we haven't already parsed this table.
                    if (parsedTables.includes(table)) {
                        continue;
                    }
                    // Get the items related to this drop table..
                    var dropTableItems = void 0;
                    switch (table) {
                        case NpcDropDefinition_1.DropTable.COMMON:
                            if (this.def.getCommonDrops() != null) {
                                dropTableItems = this.def.getCommonDrops();
                            }
                            break;
                        case NpcDropDefinition_1.DropTable.UNCOMMON:
                            if (this.def.getUncommonDrops() != null) {
                                dropTableItems = this.def.getUncommonDrops();
                            }
                            break;
                        case NpcDropDefinition_1.DropTable.RARE:
                            if (this.def.getRareDrops() != null) {
                                dropTableItems = this.def.getRareDrops();
                            }
                            break;
                        case NpcDropDefinition_1.DropTable.VERY_RARE:
                            if (this.def.getVeryRareDrops() != null) {
                                dropTableItems = this.def.getVeryRareDrops();
                            }
                            break;
                        default:
                            break;
                    }
                    if (!dropTableItems) {
                        continue;
                    }
                    // Get a random drop from the table..
                    var npcDrop = dropTableItems[Math.floor(random.getRandom() * dropTableItems.length)];
                    // Add the drop to the drop list.
                    items.push(npcDrop.toItem(random));
                    // Flag this table as visited..
                    parsedTables.push(table);
                }
            }
        }
        return items;
    };
    /**
     * Checks if the player is wearing a ring of wealth which will increase the
     * chances for getting a good drop.
     *
     * @return
     */
    NPCDropGenerator.prototype.wearingRingOfWealth = function () {
        return this.player.getEquipment().getItems()[Equipment_1.Equipment.RING_SLOT].getId() == 2572;
    };
    /**
     * Attempts to fetch the drop table for the given chance.
     *
     * @param drop
     * @return
     */
    NPCDropGenerator.prototype.getDropTable = function (chance) {
        var e_3, _a;
        var table;
        try {
            // Fetch one of the ordinary drop tables
            // based on our chance.
            for (var _b = __values(Object.values(NpcDropDefinition_1.DropTable)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var dropTable = _c.value;
                if (dropTable.getRandomRequired() >= 0) {
                    if (chance <= dropTable.getRandomRequired()) {
                        table = dropTable;
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return table;
    };
    return NPCDropGenerator;
}());
exports.NPCDropGenerator = NPCDropGenerator;
//# sourceMappingURL=NPCDropGenerator.js.map