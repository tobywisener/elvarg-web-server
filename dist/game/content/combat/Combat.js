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
exports.Combat = void 0;
var Server_1 = require("../../../Server");
var HitDamageCache_1 = require("../../content/combat/hit/HitDamageCache");
var HitQueue_1 = require("../../content/combat/hit/HitQueue");
var GraniteMaulCombatMethod_1 = require("./method/impl/specials/GraniteMaulCombatMethod");
var SecondsTimer_1 = require("../../model/SecondsTimer");
var StatementDialogue_1 = require("../../model/dialogues/entries/impl/StatementDialogue");
var Stopwatch_1 = require("../../../util/Stopwatch");
var TimerKey_1 = require("../../../util/timers/TimerKey");
var CombatFactory_1 = require("./CombatFactory");
var CombatSpecial_1 = require("./CombatSpecial");
var Combat = /** @class */ (function () {
    function Combat(character) {
        this.damageMap = new Map();
        this.lastAttack = new Stopwatch_1.Stopwatch();
        this.poisonImmunityTimer = new SecondsTimer_1.SecondsTimer();
        this.fireImmunityTimer = new SecondsTimer_1.SecondsTimer();
        this.teleblockTimer = new SecondsTimer_1.SecondsTimer();
        this.prayerBlockTimer = new SecondsTimer_1.SecondsTimer();
        this.character = character;
        this.hitQueue = new HitQueue_1.HitQueue();
    }
    Combat.prototype.attack = function (target) {
        // Update the target
        this.setTarget(target);
        if (this.character != null && this.character.isNpc() && !this.character.getAsNpc().getDefinition().doesFightBack()) {
            // Don't follow or face enemy if NPC doesn't fight back
            return;
        }
        // Start facing the target
        this.character.setMobileInteraction(target);
        // Perform the first attack now (in same tick)
        this.performNewAttack(false);
    };
    /**
     * Processes combat.
     */
    Combat.prototype.process = function () {
        // Process the hit queue
        this.hitQueue.process(this.character);
        // Reset attacker if we haven't been attacked in 6 seconds.
        if (this.lastAttack.elapsedTime(6000)) {
            this.setUnderAttack(null);
            return;
        }
        // Handle attacking
        this.performNewAttack(false);
    };
    Combat.prototype.performNewAttack = function (instant) {
        var e_1, _a;
        if (this.target == null || (this.character != null && this.character.isNpc() && !this.character.getAsNpc().getDefinition().doesFightBack())) {
            // Don't process attacks for NPC's who don't fight back
            return;
        }
        // Fetch the combat method the character will be attacking with
        this.method = CombatFactory_1.CombatFactory.getMethod(this.character);
        this.character.setCombatFollowing(this.target);
        // Face target
        this.character.setMobileInteraction(this.target);
        if (!CombatFactory_1.CombatFactory.canReach(this.character, this.method, this.target)) {
            // Make sure the character is within reach before processing combat
            return;
        }
        // Granite maul special attack, make sure we disregard delay
        // and that we do not reset the attack timer.
        var graniteMaulSpecial = (this.method instanceof GraniteMaulCombatMethod_1.GraniteMaulCombatMethod);
        if (graniteMaulSpecial) {
            instant = true;
        }
        if (!instant && this.character.getTimers().has(TimerKey_1.TimerKey.COMBAT_ATTACK)) {
            // If attack isn't instant, make sure timer is elapsed.
            Server_1.Server.logDebug("Combat : Waiting on COMBAT_ATTACK timer");
            return;
        }
        switch (CombatFactory_1.CombatFactory.canAttack(this.character, this.method, this.target)) {
            case CombatFactory_1.CanAttackResponse.CAN_ATTACK: {
                if (this.character.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    this.method.onCombatBegan(this.character, this.attacker);
                }
                if (this.target.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    var targetMethod = CombatFactory_1.CombatFactory.getMethod(this.target);
                    targetMethod.onCombatBegan(this.target, this.character);
                }
                this.method.start(this.character, this.target);
                var hits = this.method.hits(this.character, this.target);
                if (hits == null)
                    return;
                try {
                    for (var hits_1 = __values(hits), hits_1_1 = hits_1.next(); !hits_1_1.done; hits_1_1 = hits_1.next()) {
                        var hit = hits_1_1.value;
                        CombatFactory_1.CombatFactory.addPendingHit(hit);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (hits_1_1 && !hits_1_1.done && (_a = hits_1.return)) _a.call(hits_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.method.finished(this.character, this.target);
                // Reset attack timer
                if (!graniteMaulSpecial) {
                    var speed = this.method.attackSpeed(this.character);
                    this.character.getTimers().registers(TimerKey_1.TimerKey.COMBAT_ATTACK, speed);
                }
                instant = false;
                if (this.character.isSpecialActivated()) {
                    this.character.setSpecialActivated(false);
                    if (this.character.isPlayer()) {
                        var p = this.character.getAsPlayer();
                        CombatSpecial_1.CombatSpecial.updateBar(p);
                    }
                }
            }
            case CombatFactory_1.CanAttackResponse.ALREADY_UNDER_ATTACK: {
                if (this.character.isPlayer()) {
                    this.character.getAsPlayer().getPacketSender().sendMessage("You are already under attack!");
                }
                this.character.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.CANT_ATTACK_IN_AREA: {
                this.character.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.COMBAT_METHOD_NOT_ALLOWED: {
            }
            case CombatFactory_1.CanAttackResponse.LEVEL_DIFFERENCE_TOO_GREAT: {
                this.character.getAsPlayer().getPacketSender().sendMessage("Your level difference is too great.");
                this.character.getAsPlayer().getPacketSender().sendMessage("You need to move deeper into the Wilderness.");
                this.character.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.NOT_ENOUGH_SPECIAL_ENERGY: {
                var p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                p.setSpecialActivated(false);
                CombatSpecial_1.CombatSpecial.updateBar(this.character.getAsPlayer());
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.STUNNED: {
                var p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You're currently stunned and cannot attack.");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.DUEL_NOT_STARTED_YET: {
                var p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("The duel has not started yet!");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.DUEL_WRONG_OPPONENT: {
                var p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("This is not your opponent!");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.DUEL_MELEE_DISABLED: {
                var p = this.character.getAsPlayer();
                StatementDialogue_1.StatementDialogue.send(p, "Melee has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.DUEL_RANGED_DISABLED: {
                var p = this.character.getAsPlayer();
                StatementDialogue_1.StatementDialogue.send(p, "Ranged has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.DUEL_MAGIC_DISABLED: {
                var p = this.character.getAsPlayer();
                StatementDialogue_1.StatementDialogue.send(p, "Magic has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.TARGET_IS_IMMUNE: {
                if (this.character.isPlayer()) {
                    this.character.getPacketSender().sendMessage("This npc is currently immune to attacks.");
                }
                this.character.getCombat().reset();
            }
            case CombatFactory_1.CanAttackResponse.INVALID_TARGET: {
                this.character.getCombat().reset();
            }
        }
    };
    Combat.prototype.reset = function () {
        this.setTarget(null);
        this.character.setCombatFollowing(null);
        this.character.setMobileInteraction(null);
    };
    /**
* Adds damage to the damage map, as long as the argued amount of damage is
* above 0 and the argued entity is a player.
*
* @param entity the entity to add damage for.
* @param amount the amount of damage to add for the argued entity.
*/
    Combat.prototype.addDamage = function (entity, amount) {
        if (amount <= 0 || entity.isNpc()) {
            return;
        }
        var player = entity;
        if (this.damageMap.has(player)) {
            this.damageMap.get(player).incrementDamage(amount);
            return;
        }
        this.damageMap.set(player, new HitDamageCache_1.HitDamageCache(amount));
    };
    Combat.prototype.getKiller = function (clearMap) {
        var e_2, _a;
        // Return null if no players killed this entity.
        if (this.damageMap.size == 0) {
            return null;
        }
        // The damage and killer placeholders.
        var damage = 0;
        var killer = null;
        try {
            for (var _b = __values(this.damageMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                // Check if this entry is valid.
                if (entry == null) {
                    continue;
                }
                // Check if the cached time is valid.
                var timeout = entry[1].getStopwatch().valueOf();
                if (timeout > CombatConstants.DAMAGE_CACHE_TIMEOUT) {
                    continue;
                }
                // Check if the key for this entry has logged out.
                var player = entry[0];
                if (!player.isRegistered()) {
                    continue;
                }
                // If their damage is above the placeholder value, they become the
                // new 'placeholder'.
                if (entry[1].getDamage() > damage) {
                    damage = entry[1].getDamage();
                    killer = entry[0];
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Clear the damage map if needed.
        if (clearMap)
            this.damageMap.clear();
        // Return the killer placeholder.
        return killer;
    };
    Combat.prototype.damageMapContains = function (player) {
        var damageCache = this.damageMap.get(player);
        if (damageCache == null) {
            return false;
        }
        return damageCache.getStopwatch() < CombatConstants.DAMAGE_CACHE_TIMEOUT;
    };
    Combat.prototype.getCharacter = function () {
        return this.character;
    };
    Combat.prototype.getTarget = function () {
        return this.target;
    };
    Combat.prototype.setTarget = function (target) {
        if (this.target != null && target == null && this.method != null) {
            // Target has changed to null, this means combat has ended. Call the relevant hook inside the combat method.
            this.method.onCombatEnded(this.character, this.attacker);
        }
        this.target = target;
    };
    Combat.prototype.getHitQueue = function () {
        return this.hitQueue;
    };
    Combat.prototype.getAttacker = function () {
        return this.attacker;
    };
    Combat.prototype.setUnderAttack = function (attacker) {
        this.attacker = attacker;
        this.lastAttack.reset();
    };
    Combat.prototype.getCastSpell = function () {
        return this.castSpell;
    };
    Combat.prototype.setCastSpell = function (castSpell) {
        this.castSpell = castSpell;
    };
    Combat.prototype.getAutocastSpell = function () {
        return this.autoCastSpell;
    };
    Combat.prototype.setAutocastSpell = function (autoCastSpell) {
        this.autoCastSpell = autoCastSpell;
    };
    Combat.prototype.getSelectedSpell = function () {
        var spell = this.getCastSpell();
        if (spell != null) {
            return spell;
        }
        return this.getAutocastSpell();
    };
    Combat.prototype.getPreviousCast = function () {
        return this.previousCast;
    };
    Combat.prototype.setPreviousCast = function (previousCast) {
        this.previousCast = previousCast;
    };
    Combat.prototype.getRangedWeapon = function () {
        return this.rangedData;
    };
    Combat.prototype.setRangedWeapon = function (rangedWeapon) {
        this.rangedWeapon = rangedWeapon;
    };
    Combat.prototype.getAmmunition = function () {
        return this.ammuntions;
    };
    Combat.prototype.setAmmunition = function (rangeAmmoData) {
        this.rangeAmmoData = rangeAmmoData;
    };
    Combat.prototype.getRangeAmmoData = function () {
        return this.rangeAmmoData;
    };
    Combat.prototype.setRangeAmmoData = function (rangeAmmoData) {
        this.rangeAmmoData = rangeAmmoData;
    };
    Combat.prototype.getPoisonImmunityTimer = function () {
        return this.poisonImmunityTimer;
    };
    Combat.prototype.getFireImmunityTimer = function () {
        return this.fireImmunityTimer;
    };
    Combat.prototype.getTeleblockTimer = function () {
        return this.teleblockTimer;
    };
    Combat.prototype.getPrayerBlockTimer = function () {
        return this.prayerBlockTimer;
    };
    Combat.prototype.getLastAttack = function () {
        return this.lastAttack;
    };
    return Combat;
}());
exports.Combat = Combat;
//# sourceMappingURL=Combat.js.map