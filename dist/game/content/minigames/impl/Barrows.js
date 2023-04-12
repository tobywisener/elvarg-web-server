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
exports.Brother = exports.Barrows = void 0;
var Location_1 = require("../../../model/Location");
var CombatFactory_1 = require("../../combat/CombatFactory");
var Misc_1 = require("../../../../util/Misc");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var Item_1 = require("../../../model/Item");
var World_1 = require("../../../World");
var TimerKey_1 = require("../../../../util/timers/TimerKey");
var Boundary_1 = require("../../../model/Boundary");
var NPC_1 = require("../../../entity/impl/npc/NPC");
var Barrows = exports.Barrows = /** @class */ (function () {
    function Barrows() {
    }
    Barrows.dig = function (player) {
        var digLocation = Barrows.getDiggingLocation(player);
        if (digLocation) {
            player.getPacketSender().sendMessage("You've found a crypt!");
            player.moveTo(digLocation.digSpawn);
        }
    };
    Barrows.handleObject = function (player, object) {
        var brother = Barrows.getBrotherForCrypt(object);
        if (brother) {
            if (CombatFactory_1.CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You cannot do that whilst in combat.");
                return true;
            }
            if (player.getBarrowsCrypt() <= 0) {
                player.setBarrowsCrypt(Barrows.getRandomCrypt());
            }
            if (player.getCurrentBrother() !== null || player.getKilledBrothers()[brother.getCoffinId()]) {
                player.getPacketSender().sendMessage("The sarcophagus appears to be empty.");
                return false;
            }
            if (player.getBarrowsCrypt() == object) {
                /*player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        switch (option) {
                            case 1:
                                if (getKillcount(player) < 5) {
                                    player.getPacketSender()
                                            .sendMessage("You need a killcount of at least 5 to enter this tunnel.");
                                } else {
                                    player.moveTo(CHEST_ENTRANCE.clone().add(Misc.getRandom(2), Misc.getRandom(1)));
                                }
                                break;
                        }
                        player.getPacketSender().sendInterfaceRemoval();
                    }
                });
                DialogueManager.start(player, TUNNEL_DIALOGUE_ID);*/
                return true;
            }
            if (player.getCurrentBrother() != null || player.getKilledBrothers()[brother.getCoffinId()]) {
                player.getPacketSender().sendMessage("The sarcophagus appears to be empty.");
                return false;
            }
            Barrows.brotherSpawn(player, brother, brother.getSpawn());
            return true;
        }
        var stairs = Barrows.getStairs(object);
        if (stairs) {
            player.moveTo(stairs.stairSpawn);
            return true;
        }
        // Handle chest
        if (object == Barrows.CHEST_OBJECT_ID) {
            if (CombatFactory_1.CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You cannot do that whilst in combat.");
                return true;
            }
            if (Barrows.getKillcount(player) >= 5) {
                var boss = Barrows.getBrotherForCrypt(player.getBarrowsCrypt());
                if (boss) {
                    /** They might have already spawned the boss **/
                    if (player.getCurrentBrother() != null && player.getCurrentBrother().isRegistered()) {
                        player.getPacketSender().sendMessage("You cannot do this right now.");
                        return false;
                    }
                    if (player.getKilledBrothers()[boss.ordinal]) {
                        player.getPacketSender().clearInterfaceItems(42563, 42568);
                        var rewards = new Array();
                        if (Misc_1.Misc.randomInclusive(1, 5) == 1) {
                            rewards.push(new Item_1.Item(Misc_1.Misc.randomTypeOfList(Barrows.BARROW_ITEMS)));
                        }
                        for (var i = 0; i < 3; i++) {
                            rewards.push(new Item_1.Item(Misc_1.Misc.randomTypeOfList(Barrows.RUNES), Misc_1.Misc.randomInclusive(50, 300)));
                        }
                        if (Misc_1.Misc.getRandom(1) == 0) {
                            rewards.push(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BOLT_RACK, Misc_1.Misc.randomInclusive(50, 150)));
                        }
                        for (var i = 0; i < rewards.length; i++) {
                            var item = rewards[i];
                            player.getInventory().forceAdd(player, item);
                            player.getPacketSender().sendItemOnInterfaces(42563 + i, item.getId(), item.getAmount());
                        }
                        player.setBarrowsChestsLooted(player.getBarrowsChestsLooted() + 1);
                        player.getPacketSender().sendInterface(Barrows.REWARDS_INTERFACE_ID)
                            .sendMessage("@or3@You've looted a total of " + player.getBarrowsChestsLooted() + " chests.");
                        Barrows.reset(player);
                    }
                    else {
                        Barrows.brotherSpawn(player, boss.get(), Barrows.BOSS_SPAWN.clone());
                    }
                }
                else {
                    Barrows.reset(player);
                }
            }
            else {
                player.getPacketSender().sendMessage("The chest appears to be empty.");
            }
            return true;
        }
        return false;
    };
    Barrows.brotherDespawn = function (player) {
        var brother = player.getCurrentBrother();
        if (brother && brother.isRegistered() && !brother.isDyingFunction()) {
            World_1.World.getRemoveNPCQueue().push(brother);
            player.setCurrentBrother(null);
            player.getPacketSender().sendEntityHintRemoval(false);
        }
    };
    Barrows.brotherDeath = function (player, npc) {
        var brother = Barrows.getBrotherForNpcId(npc.getId());
        if (brother && player.getCurrentBrother() == npc) {
            player.getPacketSender().sendEntityHintRemoval(false);
            player.getKilledBrothers()[brother.get().ordinal()] = true;
            Barrows.updateInterface(player);
            player.setCurrentBrother(null);
        }
    };
    Barrows.reset = function (player) {
        player.setBarrowsCrypt(0);
        player.getPacketSender().sendEntityHintRemoval(false);
        for (var i = 0; i < player.getKilledBrothers().length; i++) {
            player.getKilledBrothers()[i] = false;
        }
        Barrows.updateInterface(player);
    };
    Barrows.updateInterface = function (player) {
        player.getPacketSender().sendString("Killcount: " + Barrows.getKillcount(player), Barrows.KILLCOUNTER_FRAME_ID);
    };
    Barrows.getKillcount = function (player) {
        var e_1, _a;
        var defeated = 0;
        try {
            for (var _b = __values(player.getKilledBrothers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var brotherDefeated = _c.value;
                if (brotherDefeated) {
                    defeated++;
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
        return defeated;
    };
    Barrows.getBrotherForCrypt = function (crypt) {
        return Object.values(Brother).filter(function (x) { return x.getCoffinId() == crypt; })[0];
    };
    Barrows.getBrotherForNpcId = function (npcId) {
        return Object.values(Brother).filter(function (x) { return x.getNpcId() == npcId; })[0];
    };
    Barrows.getStairs = function (object) {
        return Object.values(Brother).filter(function (x) { return x.getStairs() == object; })[0];
    };
    Barrows.getDiggingLocation = function (player) {
        return Object.values(Brother).filter(function (x) { return x.getBoundary().inside(player.getLocation()); })[0];
    };
    Barrows.getRandomCrypt = function () {
        return Object.values(Brother)[Misc_1.Misc.getRandom(Object.values(Brother).length - 1)].getCoffinId();
    };
    Barrows.brotherSpawn = function (player, brother, pos) {
        var npc = new NPC_1.NPC(brother.npcId, pos);
        npc.onAdd = function () {
            npc.setOwner(player);
            npc.forceChat("You dare disturb my rest!");
            npc.getTimers().extendOrRegister(TimerKey_1.TimerKey.COMBAT_ATTACK, 3);
            npc.getCombat().attack(player);
            player.getPacketSender().sendEntityHint(npc);
        };
        World_1.World.getAddNPCQueue().push(npc);
        player.setCurrentBrother(npc);
    };
    Barrows.ENTRANCE = new Location_1.Location(3565, 3306);
    Barrows.KILLCOUNTER_INTERFACE_ID = 4535;
    Barrows.KILLCOUNTER_FRAME_ID = 4536;
    Barrows.CHEST_ENTRANCE = new Location_1.Location(3551, 9691);
    Barrows.BOSS_SPAWN = new Location_1.Location(3550, 9694);
    Barrows.CHEST_OBJECT_ID = 20973;
    Barrows.TUNNEL_DIALOGUE_ID = 26;
    Barrows.BARROW_ITEMS = [4708, 4710, 4712, 4714, 4716, 4718, 4720, 4722, 4724, 4726, 4728, 4730,
        4732, 4734, 4736, 4738, 4745, 4747, 4749, 4751, 4753, 4755, 4757, 4759];
    Barrows.RUNES = [558, 560, 562, 565];
    Barrows.REWARDS_INTERFACE_ID = 42560;
    return Barrows;
}());
var Brother = /** @class */ (function () {
    function Brother() {
        this.AHRIM_THE_BLIGHTED = {
            npcId: 1672,
            coffinId: 20770,
            spawn: new Location_1.Location(3557, 9701),
            boundary: new Boundary_1.Boundary(3562, 3568, 3285, 3292, 0),
            digSpawn: new Location_1.Location(3557, 9703),
            stairs: 20667,
            stairSpawn: new Location_1.Location(3565, 3288)
        };
        this.DHAROK_THE_WRETCHED = {
            npcId: 1673,
            coffinId: 20720,
            spawn: new Location_1.Location(3553, 9716),
            boundary: new Boundary_1.Boundary(3572, 3578, 3294, 3301),
            digSpawn: new Location_1.Location(3556, 9718),
            stairs: 20668,
            stairSpawn: new Location_1.Location(3574, 3297)
        };
        this.GUTHAN_THE_INFESTED = {
            npcId: 1674,
            coffinId: 20722,
            spawn: new Location_1.Location(3540, 9705),
            boundary: new Boundary_1.Boundary(3574, 3584, 3279, 3285),
            digSpawn: new Location_1.Location(3534, 9704),
            stairs: 20669,
            stairSpawn: new Location_1.Location(3577, 3282)
        };
        this.KARIL_THE_TAINTED = {
            npcId: 1675,
            coffinId: 20771,
            spawn: new Location_1.Location(3549, 9685),
            boundary: new Boundary_1.Boundary(3564, 3568, 3273, 3278),
            digSpawn: new Location_1.Location(3546, 9684),
            stairs: 20670,
            stairSpawn: new Location_1.Location(3566, 3275)
        };
        this.TORAG_THE_CORRUPTED = {
            npcId: 1676,
            coffinId: 20721,
            spawn: new Location_1.Location(3568, 9688),
            boundary: new Boundary_1.Boundary(3550, 3556, 3280, 3284),
            digSpawn: new Location_1.Location(3568, 9683, 3),
            stairs: 20671,
            stairSpawn: new Location_1.Location(3554, 3282, 0)
        };
        this.VERAC_THE_DEFILED = {
            npcId: 1677,
            coffinId: 20772,
            spawn: new Location_1.Location(3575, 9708),
            boundary: new Boundary_1.Boundary(3553, 3560, 3294, 3301),
            digSpawn: new Location_1.Location(3578, 9706, 3),
            stairs: 20672,
            stairSpawn: new Location_1.Location(3557, 3297, 0)
        };
    }
    Brother.prototype.Brother = function (npcId, coffin, brotherSpawn, boundary, digSpawn, stairs, stairSpawn) {
        this.npcId = npcId;
        this.coffinId = coffin;
        this.spawn = brotherSpawn;
        this.boundary = boundary;
        this.digSpawn = digSpawn;
        this.stairs = stairs;
        this.stairSpawn = stairSpawn;
    };
    Brother.prototype.getNpcId = function () {
        return this.npcId;
    };
    Brother.prototype.getCoffinId = function () {
        return this.coffinId;
    };
    Brother.prototype.getSpawn = function () {
        return this.spawn;
    };
    Brother.prototype.getBoundary = function () {
        return this.boundary;
    };
    Brother.prototype.getDigSpawn = function () {
        return this.digSpawn;
    };
    Brother.prototype.getStairs = function () {
        return this.stairs;
    };
    Brother.prototype.getStairSpawn = function () {
        return this.stairSpawn;
    };
    return Brother;
}());
exports.Brother = Brother;
//# sourceMappingURL=Barrows.js.map