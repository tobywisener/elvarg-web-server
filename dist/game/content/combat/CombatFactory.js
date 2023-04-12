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
exports.CanAttackResponse = exports.CombatFactory = void 0;
var Sound_1 = require("../../Sound");
var Sounds_1 = require("../../Sounds");
var RegionManager_1 = require("../../collision/RegionManager");
var PrayerHandler_1 = require("../PrayerHandler");
var WeaponInterfaces_1 = require("./WeaponInterfaces");
var DamageFormulas_1 = require("./formula/DamageFormulas");
var HitDamage_1 = require("./hit/HitDamage");
var HitMask_1 = require("./hit/HitMask");
var MagicCombatMethod_1 = require("./method/impl/MagicCombatMethod");
var MeleeCombatMethod_1 = require("./method/impl/MeleeCombatMethod");
var RangedCombatMethod_1 = require("./method/impl/RangedCombatMethod");
var RangedData_1 = require("./ranged/RangedData");
var NPCMovementCoordinator_1 = require("../../entity/impl/npc/NPCMovementCoordinator");
var Player_1 = require("../../entity/impl/player/Player");
var PlayerBot_1 = require("../../entity/impl/playerbot/PlayerBot");
var Animation_1 = require("../../model/Animation");
var EffectTimer_1 = require("../../model/EffectTimer");
var Flag_1 = require("../../model/Flag");
var Graphic_1 = require("../../model/Graphic");
var GraphicHeight_1 = require("../../model/GraphicHeight");
var Item_1 = require("../../model/Item");
var Location_1 = require("../../model/Location");
var Skill_1 = require("../../model/Skill");
var SkullType_1 = require("../../model/SkullType");
var AreaManager_1 = require("../../model/areas/AreaManager");
var WildernessArea_1 = require("../../model/areas/impl/WildernessArea");
var Equipment_1 = require("../../model/container/impl/Equipment");
var MovementQueue_1 = require("../../model/movement/MovementQueue");
var PathFinder_1 = require("../../model/movement/path/PathFinder");
var PlayerRights_1 = require("../../model/rights/PlayerRights");
var Task_1 = require("../../task/Task");
var TaskManager_1 = require("../../task/TaskManager");
var CombatPoisonEffect_1 = require("../../task/impl/CombatPoisonEffect");
var ItemIdentifiers_1 = require("../../../util/ItemIdentifiers");
var Misc_1 = require("../../../util/Misc");
var NpcIdentifiers_1 = require("../../../util/NpcIdentifiers");
var RandomGen_1 = require("../../../util/RandomGen");
var TimerKey_1 = require("../../../util/timers/TimerKey");
var CombatType_1 = require("./CombatType");
var CombatSpecial_1 = require("./CombatSpecial");
var CombatPoisonEffect_2 = require("../../task/impl/CombatPoisonEffect");
var Duelling_1 = require("../Duelling");
var CombatPoisonEffect_3 = require("../../task/impl/CombatPoisonEffect");
var CombatFactory = exports.CombatFactory = /** @class */ (function () {
    function CombatFactory() {
    }
    CombatFactory.getMethod = function (attacker) {
        if (attacker.isPlayer()) {
            var p = attacker.getAsPlayer();
            // Update player data..
            // Update ranged ammo / weapon
            p.getCombat().setAmmunition(RangedData_1.RangedWeapon.getFor(p));
            p.getCombat().setRangedWeapon(RangedData_1.RangedWeapon.getFor(p));
            // Check if player is maging..
            if (p.getCombat().getCastSpell() != null ||
                // Ensure player needs staff equipped to use autocast
                (p.getCombat().getAutocastSpell() != null && p.getEquipment().hasStaffEquipped())) {
                return this.MAGIC_COMBAT;
            }
            // Check special attacks..
            if (Player_1.Player.getCombatSpecial() != null) {
                if (p.isSpecialActivated()) {
                    return Player_1.Player.getCombatSpecial().getCombatMethod();
                }
            }
            // Check if player is ranging..
            if (p.getCombat().getRangedWeapon() != null) {
                return this.RANGED_COMBAT;
            }
        }
        else if (attacker.isNpc()) {
            return attacker.getAsNpc().getCombatMethod();
        }
        // Return melee by default
        return this.MELEE_COMBAT;
    };
    CombatFactory.getHitDamage = function (entity, victim, type) {
        var damage = 0;
        if (type == CombatType_1.CombatType.MELEE) {
            damage = Misc_1.Misc.randomInclusive(0, DamageFormulas_1.DamageFormulas.calculateMaxMeleeHit(entity));
            // Do melee effects with the calculated damage..
            if (victim.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MELEE]) {
                damage *= 0.6;
            }
        }
        else if (type == CombatType_1.CombatType.RANGED) {
            damage = Misc_1.Misc.randomInclusive(0, DamageFormulas_1.DamageFormulas.calculateMaxRangedHit(entity));
            if (victim.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MISSILES]) {
                damage *= 0.6;
            }
            // Do ranged effects with the calculated damage..
            if (entity.isPlayer()) {
                var player = entity.getAsPlayer();
                // Check if player is using dark bow and set damage to minimum 8, maxmimum 48 if
                // that's the case...
                if (player.isSpecialActivated()
                    && Player_1.Player.getCombatSpecial() == CombatSpecial_1.CombatSpecial.DARK_BOW) {
                    if (damage < 8) {
                        damage = 8;
                    }
                    else if (damage > 48) {
                        damage = 48;
                    }
                }
                if (player.getWeapon() == WeaponInterfaces_1.WeaponInterfaces.CROSSBOW && Misc_1.Misc.getRandom(10) == 1) {
                    var multiplier = RangedData_1.RangedData.getSpecialEffectsMultiplier(player, victim, damage);
                    damage *= multiplier;
                }
            }
        }
        else if (type == CombatType_1.CombatType.MAGIC) {
            damage = Misc_1.Misc.randomInclusive(0, DamageFormulas_1.DamageFormulas.getMagicMaxhit(entity));
            if (victim.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MAGIC]) {
                damage *= 0.6;
            }
        }
        // Do magic effects with the calculated damage..
        // We've got our damage. We can now create a HitDamage
        // instance.
        var hitDamage = new HitDamage_1.HitDamage(damage, damage == 0 ? HitMask_1.HitMask.BLUE : HitMask_1.HitMask.RED);
        /**
         * Prayers decreasing damage.
         */
        // Decrease damage if victim is a player and has prayers active..
        if ((!CombatFactory.fullVeracs(entity) || Misc_1.Misc.getRandom(4) == 1)) {
            // Check if victim is is using correct protection prayer
            if (PrayerHandler_1.PrayerHandler.isActivated(victim, PrayerHandler_1.PrayerHandler.getProtectingPrayer(type))) {
                // Apply the damage reduction mod
                if (entity.isNpc()) {
                    hitDamage.multiplyDamage(CombatConstants.PRAYER_DAMAGE_REDUCTION_AGAINST_NPCS);
                }
                else {
                    hitDamage.multiplyDamage(CombatConstants.PRAYER_DAMAGE_REDUCTION_AGAINST_PLAYERS);
                }
            }
        }
        if (victim.isPlayer() && Misc_1.Misc.getRandom(100) <= 70) {
            if (victim.getAsPlayer().getEquipment().getItems()[Equipment_1.Equipment.SHIELD_SLOT].getId() == 12817) {
                hitDamage.multiplyDamage(CombatConstants.ELYSIAN_DAMAGE_REDUCTION);
                victim.performGraphic(new Graphic_1.Graphic(321, 40)); // Elysian spirit shield effect gfx
            }
        }
        return hitDamage;
    };
    CombatFactory.validTarget = function (attacker, target) {
        if (attacker == null || target == null) {
            return false;
        }
        if (!target.isRegistered() || !attacker.isRegistered() || attacker.getHitpoints() <= 0
            || target.getHitpoints() <= 0 || attacker.isUntargetable()) {
            return false;
        }
        if (attacker.getLocation().getDistance(target.getLocation()) >= 40) {
            return false;
        }
        if (attacker.isNpc() && target.isPlayer()) {
            if (attacker.getAsNpc().getOwner() != null && attacker.getAsNpc().getOwner() != target.getAsPlayer()) {
                return false;
            }
        }
        else if (attacker.isPlayer() && target.isNpc()) {
            if (target.getAsNpc().getOwner() != null && target.getAsNpc().getOwner() != attacker.getAsPlayer()) {
                attacker.getAsPlayer().getPacketSender().sendMessage("This npc was not spawned for you.");
                return false;
            }
        }
        return true;
    };
    CombatFactory.canReach = function (attacker, method, target) {
        if (!CombatFactory.validTarget(attacker, target)) {
            attacker.getCombat().reset();
            return true;
        }
        var isMoving = target.getMovementQueue().isMovings();
        // Walk back if npc is too far away from spawn position.
        if (attacker.isNpc()) {
            var npc = attacker.getAsNpc();
            if (npc.getCurrentDefinition().doesRetreat()) {
                if (npc.getMovementCoordinator().getCoordinateState() == NPCMovementCoordinator_1.CoordinateState.RETREATING) {
                    npc.getCombat().reset();
                    return false;
                }
                if (npc.getLocation().getDistance(npc.getSpawnPosition()) >= npc.getCurrentDefinition().getCombatFollowDistance()) {
                    npc.getCombat().reset();
                    npc.getMovementCoordinator().setCoordinateState(NPCMovementCoordinator_1.CoordinateState.RETREATING);
                    return false;
                }
            }
        }
        var attackerPosition = attacker.getLocation();
        var targetPosition = target.getLocation();
        if (attackerPosition.equals(targetPosition)) {
            if (!attacker.getTimers().has(TimerKey_1.TimerKey.STEPPING_OUT)) {
                MovementQueue_1.MovementQueue.clippedStep(attacker);
                attacker.getTimers().registers(TimerKey_1.TimerKey.STEPPING_OUT, 2);
            }
            return false;
        }
        var requiredDistance = method.attackDistance(attacker);
        var distance = attacker.calculateDistance(target);
        // Standing under the target
        if (distance == 0) {
            if (attacker.isPlayer()) {
                return false;
            }
            if (attacker.isNpc() && attacker.getSize() == 0) {
                return false;
            }
        }
        if (method.type() == CombatType_1.CombatType.MELEE && isMoving && attacker.getMovementQueue().isMovings()) {
            // If we're using Melee and either player is moving, increase required distance
            requiredDistance++;
        }
        // Too far away from the target
        if (distance > requiredDistance) {
            return false;
        }
        // Don't allow diagonal attacks for smaller entities
        if (method.type() == CombatType_1.CombatType.MELEE && attacker.getSize() == 1 && target.getSize() == 1 && !isMoving && !target.getMovementQueue().isMovings()) {
            if (PathFinder_1.PathFinder.isDiagonalLocation(attacker, target)) {
                CombatFactory.stepOut(attacker, target);
                return false;
            }
        }
        // Make sure we the path is clear for projectiles..
        if (attacker.useProjectileClipping() && !RegionManager_1.RegionManager.canProjectileAttackTarget(attacker, target)) {
            return false;
        }
        return true;
    };
    CombatFactory.fullVeracs = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers_1.NpcIdentifiers.VERAC_THE_DEFILED
            : entity.getAsPlayer().getEquipment().containsAllAny([4753, 4757, 4759, 4755]);
    };
    /**
    * Determines if the entity is wearing full dharoks.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full dharoks.
    */
    CombatFactory.fullDharoks = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers_1.NpcIdentifiers.DHAROK_THE_WRETCHED
            : entity.getAsPlayer().getEquipment().containsAllAny([4716, 4720, 4722, 4718]);
    };
    /**
    * Determines if the entity is wearing full karils.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full karils.
    */
    CombatFactory.fullKarils = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers_1.NpcIdentifiers.KARIL_THE_TAINTED
            : entity.getAsPlayer().getEquipment().containsAllAny([4732, 4736, 4738, 4734]);
    };
    /**
    * Determines if the entity is wearing full ahrims.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full ahrims.
    */
    CombatFactory.fullAhrims = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers_1.NpcIdentifiers.AHRIM_THE_BLIGHTED
            : entity.getAsPlayer().getEquipment().containsAllAny([4708, 4712, 4714, 4710]);
    };
    CombatFactory.fullTorags = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getDefinition().getName() === "Torag the Corrupted"
            : entity.getAsPlayer().getEquipment().containsAllAny([4745, 4749, 4751, 4747]);
    };
    /**
     * Determines if the entity is wearing full guthans.
     *
     * @param entity the entity to determine this for.
     * @return true if the player is wearing full guthans.
     */
    CombatFactory.fullGuthans = function (entity) {
        return entity.isNpc() ? entity.getAsNpc().getDefinition().getName() === "Guthan the Infested"
            : entity.getAsPlayer().getEquipment().containsAllAny([4724, 4728, 4730, 4726]);
    };
    /**
     * Calculates the combat level difference for wilderness player vs. player
     * combat.
     *
     * @param combatLevel the combat level of the first person.
     * @param otherCombatLevel the combat level of the other person.
     * @return the combat level difference.
     */
    CombatFactory.combatLevelDifference = function (combatLevel, otherCombatLevel) {
        if (combatLevel > otherCombatLevel) {
            return (combatLevel - otherCombatLevel);
        }
        else if (otherCombatLevel > combatLevel) {
            return (otherCombatLevel - combatLevel);
        }
        else {
            return 0;
        }
    };
    CombatFactory.stepOut = function (attacker, target) {
        var tiles = [
            new Location_1.Location(target.getLocation().getX() - 1, target.getLocation().getY()),
            new Location_1.Location(target.getLocation().getX() + 1, target.getLocation().getY()),
            new Location_1.Location(target.getLocation().getX(), target.getLocation().getY() + 1),
            new Location_1.Location(target.getLocation().getX(), target.getLocation().getY() - 1)
        ];
        /** If a tile is present it will step out **/
        tiles.filter(function (t) { return !RegionManager_1.RegionManager.blocked(t, attacker.getPrivateArea()); }).sort(function (a, b) { return attacker.getLocation().getDistance(a) - attacker.getLocation().getDistance(b); }).forEach(function (tile) {
            PathFinder_1.PathFinder.calculateWalkRoute(attacker, tile.getX(), tile.getY());
        });
    };
    CombatFactory.canAttack = function (attacker, method, target) {
        if (!CombatFactory.validTarget(attacker, target)) {
            return CanAttackResponse.INVALID_TARGET;
        }
        // Here we check if we are already in combat with another entity.
        // Only check if we aren't in multi.
        if (!(AreaManager_1.AreaManager.inMulti(attacker) && AreaManager_1.AreaManager.inMulti(target))) {
            if (CombatFactory.isBeingAttacked(attacker) && attacker.getCombat().getAttacker() != target
                && attacker.getCombat().getAttacker().getHitpoints() > 0
                || !attacker.getCombat().getHitQueue().isEmpty(target)) {
                return CanAttackResponse.ALREADY_UNDER_ATTACK;
            }
            // Here we check if we are already in combat with another entity.
            if (CombatFactory.isBeingAttacked(target) && target.getCombat().getAttacker() != attacker
                || !target.getCombat().getHitQueue().isEmpty(attacker)) {
                return CanAttackResponse.ALREADY_UNDER_ATTACK;
            }
        }
        // Check if we can attack in this area
        var areaResponse = AreaManager_1.AreaManager.canAttack(attacker, target);
        if (areaResponse != CanAttackResponse.CAN_ATTACK) {
            return areaResponse;
        }
        if (!method.canAttack(attacker, target)) {
            return CanAttackResponse.COMBAT_METHOD_NOT_ALLOWED;
        }
        if (attacker.isPlayer()) {
            var p = attacker.getAsPlayer();
            // Check if we're using a special attack..
            if (p.isSpecialActivated() && Player_1.Player.getCombatSpecial() != null) {
                // Check if we have enough special attack percentage.
                // If not, reset special attack.
                if (p.getSpecialPercentage() < Player_1.Player.getCombatSpecial().getDrainAmount()) {
                    return CanAttackResponse.NOT_ENOUGH_SPECIAL_ENERGY;
                }
            }
            if (p.getTimers().has(TimerKey_1.TimerKey.STUN)) {
                return CanAttackResponse.STUNNED;
            }
            // Duel rules
            if (p.getDueling().inDuel()) {
                if (method.type() == CombatType_1.CombatType.MELEE && p.getDueling().getRules()[Duelling_1.DuelRule.NO_MELEE.getButtonId()]) {
                    return CanAttackResponse.DUEL_MELEE_DISABLED;
                }
                else if (method.type() == CombatType_1.CombatType.RANGED && p.getDueling().getRules()[Duelling_1.DuelRule.NO_RANGED.getButtonId()]) {
                    return CanAttackResponse.DUEL_RANGED_DISABLED;
                }
                else if (method.type() == CombatType_1.CombatType.MAGIC && p.getDueling().getRules()[Duelling_1.DuelRule.NO_MAGIC.getButtonId()]) {
                    return CanAttackResponse.DUEL_MAGIC_DISABLED;
                }
            }
        }
        // Check immune npcs..
        if (target.isNpc()) {
            var npc = target;
            if (npc.getTimers().has(TimerKey_1.TimerKey.ATTACK_IMMUNITY)) {
                return CanAttackResponse.TARGET_IS_IMMUNE;
            }
        }
        return CanAttackResponse.CAN_ATTACK;
    };
    CombatFactory.addPendingHit = function (qHit) {
        var attacker = qHit.getAttacker();
        var target = qHit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        if (attacker.isPlayer()) {
            // Reward the player experience for this attack..
            CombatFactory.rewardExp(attacker.getAsPlayer(), qHit);
            // Check if the player should be skulled for making this attack..
            if (target.isPlayer()) {
                CombatFactory.handleSkull(attacker.getAsPlayer(), target.getAsPlayer());
            }
        }
        // If target is teleporting or needs placement
        // Dont continue to add the hit.
        if (target.isUntargetable() || target.isNeedsPlacement()) {
            return;
        }
        // Add this hit to the target's hitQueue
        target.getCombat().getHitQueue().addPendingHit(qHit);
    };
    CombatFactory.executeHit = function (qHit) {
        var attacker = qHit.getAttacker();
        var target = qHit.getTarget();
        var method = qHit.getCombatMethod();
        var combatType = qHit.getCombatType();
        var damage = qHit.getTotalDamage();
        // If target/attacker is dead, don't continue.
        if (target.getHitpoints() <= 0 || attacker.getHitpoints() <= 0) {
            return;
        }
        // If target is teleporting or needs placement
        // Don't continue to add the hit.
        if (target.isUntargetable() || target.isNeedsPlacement()) {
            return;
        }
        // Before target takes damage, manipulate the hit to handle
        // last-second effects
        qHit = target.manipulateHit(qHit);
        // Do block animation
        target.performAnimation(new Animation_1.Animation(target.getBlockAnim()));
        // Do other stuff for players..
        if (target.isPlayer()) {
            var p_ = target.getAsPlayer();
            Sounds_1.Sounds.sendSound(p_, Sound_1.Sound.FEMALE_GETTING_HIT);
            // Close their current interface
            if (p_.getRights() != PlayerRights_1.PlayerRights.DEVELOPER && p_.busy()) {
                p_.getPacketSender().sendInterfaceRemoval();
            }
            // Prayer effects
            if (qHit.isAccurate()) {
                if (PrayerHandler_1.PrayerHandler.isActivated(p_, PrayerHandler_1.PrayerHandler.REDEMPTION)) {
                    CombatFactory.handleRedemption(attacker, p_, damage);
                }
                if (PrayerHandler_1.PrayerHandler.isActivated(attacker, PrayerHandler_1.PrayerHandler.SMITE)) {
                    CombatFactory.handleSmite(attacker, p_, damage);
                }
            }
        }
        var magic_splash = (combatType === CombatType_1.CombatType.MAGIC && !qHit.isAccurate());
        if (!(magic_splash && attacker.isPlayer())) {
            target.getCombat().getHitQueue().addPendingDamage(qHit.getHits());
        }
        // Make sure to let the combat method know we finished the attack
        // Only if this isn't custom hit (handleAfterHitEffects() will be false then)
        if (qHit.getHandleAfterHitEffects()) {
            if (method) {
                method.handleAfterHitEffects(qHit);
            }
        }
        // Check for poisonous weapons..
        // And do other effects, such as barrows effects..
        if (attacker.isPlayer()) {
            var p_ = attacker.getAsPlayer();
            // Randomly apply poison if poisonous weapon is equipped.
            if (damage > 0 && Math.floor(Math.random() * 20) <= 5) { // 1/4
                var poison = void 0;
                var isRanged = false;
                if (combatType === CombatType_1.CombatType.MELEE || p_.getWeapon() === WeaponInterfaces_1.WeaponInterfaces.DART
                    || p_.getWeapon() === WeaponInterfaces_1.WeaponInterfaces.KNIFE
                    || p_.getWeapon() === WeaponInterfaces_1.WeaponInterfaces.THROWNAXE
                    || p_.getWeapon() === WeaponInterfaces_1.WeaponInterfaces.JAVELIN) {
                    poison = CombatPoisonEffect_2.CombatPoisonData.getPoisonType(p_.getEquipment().get(Equipment_1.Equipment.WEAPON_SLOT));
                }
                else if (combatType === CombatType_1.CombatType.RANGED) {
                    isRanged = true;
                    poison = CombatPoisonEffect_2.CombatPoisonData.getPoisonType(p_.getEquipment().get(Equipment_1.Equipment.AMMUNITION_SLOT));
                }
                if (poison && (!isRanged || Math.floor(Math.random() * 10) <= 5)) { // Range 1/8
                    CombatFactory.poisonEntity(target, CombatPoisonEffect_2.CombatPoisonData.getPoisonType());
                }
            }
            // Handle barrows effects if damage is more than zero.
            if (qHit.getTotalDamage() > 0) {
                if (Math.floor(Math.random() * 10) >= 8) {
                    // Apply Guthan's effect..
                    if (this.fullGuthans(p_)) {
                        CombatFactory.handleGuthans(p_, target, qHit.getTotalDamage());
                    }
                    // Other barrows effects here..
                }
            }
        }
        else if (attacker.isNpc()) {
            var npc = attacker.getAsNpc();
            if (npc.getCurrentDefinition().isPoisonous()) {
                if (Math.floor(Math.random() * 10) <= 5) {
                    CombatFactory.poisonEntity(target, CombatPoisonEffect_3.PoisonType.SUPER);
                }
            }
        }
        if (qHit.getTotalDamage() > 0) {
            if (target.isPlayer()) {
                var player = target.getAsPlayer();
                if (player.getEquipment().get(Equipment_1.Equipment.RING_SLOT).getId() === ItemIdentifiers_1.ItemIdentifiers.RING_OF_RECOIL) {
                    CombatFactory.handleRecoil(player, attacker, qHit.getTotalDamage());
                }
            }
            if (target.hasVengeanceReturn()) {
                CombatFactory.handleVengeance(target, attacker, qHit.getTotalDamage());
            }
        }
        // Auto retaliate if needed
        CombatFactory.handleRetaliation(attacker, target);
        // Set under attack
        target.getCombat().setUnderAttack(attacker);
        // Add damage to target damage map
        target.getCombat().addDamage(attacker, qHit.getTotalDamage());
        if (target instanceof PlayerBot_1.PlayerBot) {
            target.getCombatInteraction().takenDamage(qHit.getTotalDamage(), attacker);
        }
    };
    CombatFactory.rewardExp = function (player, hit) {
        var e_1, _a;
        // Add magic exp, even if total damage is 0.
        // Since spells have a base exp reward
        if (hit.getCombatType() === CombatType_1.CombatType.MAGIC) {
            if (player.getCombat().getPreviousCast() != null) {
                if (hit.isAccurate()) {
                    player.getSkillManager().addExperiences(Skill_1.Skill.MAGIC, (hit.getTotalDamage()) /* + player.getCombat().getPreviousCast().baseExperience() */);
                }
                else {
                    // Splash should only give 52 exp..
                    player.getSkillManager().addExperience(Skill_1.Skill.MAGIC, 52, false);
                }
            }
        }
        // Don't add any exp to other skills if total damage is 0.
        if (hit.getTotalDamage() <= 0) {
            return;
        }
        // Add hp xp
        player.getSkillManager().addExperiences(Skill_1.Skill.HITPOINTS, (hit.getTotalDamage() * .70));
        // Magic xp was already added
        if (hit.getCombatType() === CombatType_1.CombatType.MAGIC) {
            return;
        }
        // Add all other skills xp
        var exp = hit.getSkills();
        try {
            for (var exp_1 = __values(exp), exp_1_1 = exp_1.next(); !exp_1_1.done; exp_1_1 = exp_1.next()) {
                var i = exp_1_1.value;
                var skill = Object.values(Skill_1.Skill)[i];
                player.getSkillManager().addExperiences(skill, (hit.getTotalDamage() / exp.length));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (exp_1_1 && !exp_1_1.done && (_a = exp_1.return)) _a.call(exp_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CombatFactory.isAttacking = function (character) {
        return character.getCombat().getTarget() != null;
    };
    CombatFactory.isBeingAttacked = function (character) {
        return character.getCombat().getAttacker() != null;
    };
    CombatFactory.inCombat = function (character) {
        return CombatFactory.isAttacking(character) || CombatFactory.isBeingAttacked(character);
    };
    CombatFactory.poisonEntity = function (entity, poisonType) {
        // We are already poisoned or the poison type is invalid, do nothing.
        if (entity.isPoisoned()) {
            return;
        }
        // If the entity is a player, we check for poison immunity. If they have
        // no immunity then we send them a message telling them that they are
        // poisoned.
        if (entity.isPlayer()) {
            var player = entity;
            if (!player.getCombat().getPoisonImmunityTimer().finished()) {
                return;
            }
            player.getPacketSender().sendMessage("You have been poisoned!");
            if (poisonType === CombatPoisonEffect_3.PoisonType.VENOM) {
                player.getPacketSender().sendPoisonType(2);
            }
            else {
                player.getPacketSender().sendPoisonType(1);
            }
        }
        entity.setPoisonDamage(CombatPoisonEffect_2.CombatPoisonData.getDemage());
        TaskManager_1.TaskManager.submit(new CombatPoisonEffect_1.CombatPoisonEffect(entity));
    };
    CombatFactory.disableProtectionPrayers = function (player) {
        // Player has already been prayer-disabled
        if (!player.getCombat().getPrayerBlockTimer().finished()) {
            return;
        }
        player.getCombat().getPrayerBlockTimer().start(200);
        PrayerHandler_1.PrayerHandler.resetPrayers(player, PrayerHandler_1.PrayerHandler.PROTECTION_PRAYERS);
        player.getPacketSender().sendMessage("You have been disabled and can no longer use protection prayers.");
    };
    CombatFactory.handleRecoil = function (player, attacker, damage) {
        if (damage == 0) {
            return;
        }
        var RECOIL_DMG_MULTIPLIER = 0.1;
        var returnDmg = Math.floor(Math.random() * 3) + 1 === 2 ? 0 : (damage * RECOIL_DMG_MULTIPLIER) + 1;
        // Increase recoil damage for a player.
        player.setRecoilDamage(player.getRecoilDamage() + returnDmg);
        // Deal damage back to attacker
        attacker.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(returnDmg, HitMask_1.HitMask.RED)]);
        // Degrading ring of recoil for a player.
        if (player.getRecoilDamage() >= 40) {
            player.getEquipment().set(Equipment_1.Equipment.RING_SLOT, new Item_1.Item(-1));
            player.getEquipment().refreshItems();
            player.getPacketSender().sendMessage("Your ring of recoil has degraded.");
            player.setRecoilDamage(0);
        }
    };
    CombatFactory.handleVengeance = function (character, attacker, damage) {
        var returnDmg = Math.floor(damage * 0.75);
        if (returnDmg <= 0) {
            return;
        }
        attacker.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(returnDmg, HitMask_1.HitMask.RED)]);
        character.forceChat("Taste Vengeance!");
        character.setHasVengeance(false);
    };
    CombatFactory.handleGuthans = function (player, target, damage) {
        target.performGraphic(new Graphic_1.Graphic(398));
        player.heal(damage);
    };
    /**
    
    Checks if a player should be skulled or not.
    
    @param attacker
    
    @param target
    */
    CombatFactory.handleSkull = function (attacker, target) {
        if (attacker.isSkulled()) {
            return;
        }
        if (!(attacker.getArea() instanceof WildernessArea_1.WildernessArea)) {
            return;
        }
        // We've probably already been skulled by this player.
        if (target.getCombat().damageMapContains(attacker) || attacker.getCombat().damageMapContains(target)) {
            return;
        }
        if (target.getCombat().getAttacker() != null && target.getCombat().getAttacker() == attacker) {
            return;
        }
        if (attacker.getCombat().getAttacker() != null && attacker.getCombat().getAttacker() == target) {
            return;
        }
        CombatFactory.skull(attacker, SkullType_1.SkullType.WHITE_SKULL, 300);
    };
    CombatFactory.skull = function (player, type, seconds) {
        player.setSkullType(type);
        player.setSkullTimer(Misc_1.Misc.getTicks(seconds));
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        if (type == SkullType_1.SkullType.RED_SKULL) {
            player.getPacketSender().sendMessage("@bla@You have received a @red@red skull@bla@! You can no longer use the Protect item prayer!");
            PrayerHandler_1.PrayerHandler.deactivatePrayer(player, PrayerHandler_1.PrayerHandler.PROTECT_ITEM);
        }
        else if (type == SkullType_1.SkullType.WHITE_SKULL) {
            player.getPacketSender().sendMessage("You've been skulled!");
        }
    };
    CombatFactory.stun = function (character, seconds, force) {
        if (!force) {
            if (character.getTimers().has(TimerKey_1.TimerKey.STUN)) {
                return;
            }
        }
        character.getTimers().registers(TimerKey_1.TimerKey.STUN, Misc_1.Misc.getTicks(seconds));
        character.getCombat().reset();
        character.getMovementQueue().reset();
        character.performGraphic(new Graphic_1.Graphic(348, GraphicHeight_1.GraphicHeight.HIGH));
        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendMessage("You've been stunned!");
        }
    };
    CombatFactory.handleRetaliation = function (attacker, target) {
        if (!CombatFactory.isAttacking(target)) {
            var auto_ret = false;
            if (target.isPlayer()) {
                auto_ret = target.getAsPlayer().autoRetaliateReturn() && !target.getMovementQueue().isMovings();
            }
            else if (target.isNpc()) {
                auto_ret = target.getAsNpc().getMovementCoordinator().getCoordinateState() == NPCMovementCoordinator_1.CoordinateState.HOME;
            }
            if (!auto_ret) {
                return;
            }
            TaskManager_1.TaskManager.submit(new CombatFactoryTask(1, target, false, function () {
                target.getCombat().attack(attacker);
            }));
        }
    };
    CombatFactory.freeze = function (character, seconds) {
        if (character.getTimers().has(TimerKey_1.TimerKey.FREEZE) || character.getTimers().has(TimerKey_1.TimerKey.FREEZE_IMMUNITY)) {
            return;
        }
        if (character.getSize() > 2) {
            return;
        }
        var ticks = Misc_1.Misc.getTicks(seconds);
        character.getTimers().registers(TimerKey_1.TimerKey.FREEZE, ticks);
        character.getTimers().registers(TimerKey_1.TimerKey.FREEZE_IMMUNITY, ticks + Misc_1.Misc.getTicks(3));
        character.getMovementQueue().reset();
        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendMessage("You have been frozen!").sendEffectTimer(seconds, EffectTimer_1.EffectTimer.FREEZE);
        }
    };
    CombatFactory.handleRedemption = function (attacker, victim, damage) {
        if ((victim.getHitpoints() - damage) <= (victim.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS) / 10)) {
            var amountToHeal = (victim.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER) * .25);
            victim.performGraphic(new Graphic_1.Graphic(436));
            victim.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, 0);
            victim.getSkillManager().setCurrentLevels(Skill_1.Skill.HITPOINTS, victim.getHitpoints() + amountToHeal);
            victim.getPacketSender().sendMessage("You've run out of prayer points!");
            PrayerHandler_1.PrayerHandler.deactivatePrayers(victim);
        }
    };
    CombatFactory.handleSmite = function (attacker, victim, damage) {
        victim.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.PRAYER, (damage / 4), 0);
    };
    CombatFactory.handleRetribution = function (killed, killer) {
        killed.performGraphic(new Graphic_1.Graphic(437));
        if (killer.getLocation().isWithinDistance(killer.getLocation(), CombatConstants.RETRIBUTION_RADIUS)) {
            killer.getCombat().getHitQueue().addPendingDamage([
                new HitDamage_1.HitDamage(Misc_1.Misc.getRandom(CombatConstants.MAXIMUM_RETRIBUTION_DAMAGE), HitMask_1.HitMask.RED)
            ]);
        }
    };
    CombatFactory.checkAmmo = function (player, amountRequired) {
        var e_2, _a;
        var rangedWeapon = player.getCombat().getRangedWeapon();
        var ammoData = player.getCombat().getAmmunition();
        if (rangedWeapon == null) {
            player.getCombat().reset();
            return false;
        }
        if (rangedWeapon === RangedData_1.RangedWeapon.TOXIC_BLOWPIPE) {
            if (player.getBlowpipeScales() <= 0) {
                player.getPacketSender().sendMessage("You must recharge your Toxic blowpipe using some Zulrah scales.");
                player.getCombat().reset();
                return false;
            }
            return true;
        }
        if (ammoData == null) {
            player.getPacketSender().sendMessage("You don't have any ammunition to fire.");
            player.getCombat().reset();
            return false;
        }
        if (rangedWeapon.getType() === RangedData_1.RangedWeaponType.KNIFE || rangedWeapon.getType() === RangedData_1.RangedWeaponType.DART
            || rangedWeapon.getType() === RangedData_1.RangedWeaponType.TOKTZ_XIL_UL) {
            return true;
        }
        var ammoSlotItem = player.getEquipment().getItems()[Equipment_1.Equipment.AMMUNITION_SLOT];
        if (ammoSlotItem.getId() == -1 || ammoSlotItem.getAmount() < amountRequired) {
            player.getPacketSender().sendMessage("You don't have the required amount of ammunition to fire that.");
            player.getCombat().reset();
            return false;
        }
        var properReq = false;
        try {
            // BAD LOOP
            for (var _b = __values(rangedWeapon.getAmmunitionData()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var d = _c.value;
                if (d == ammoData) {
                    if (d.getItemId() == ammoSlotItem.getId()) {
                        properReq = true;
                        break;
                    }
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
        if (!properReq) {
            var ammoName = ammoSlotItem.getDefinition().getName(), weaponName = player.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getDefinition().getName(), add = !ammoName.endsWith("s") && !ammoName.endsWith("(e)") ? "s" : "";
            player.getPacketSender().sendMessage("You can not use " + ammoName + "" + add + " with "
                + Misc_1.Misc.anOrA(weaponName) + " " + weaponName + ".");
            player.getCombat().reset();
            return false;
        }
        return true;
    };
    CombatFactory.decrementAmmo = function (player, pos, amount) {
        // Get the ranged weapon data
        var rangedWeapon = player.getCombat().getRangedWeapon();
        // Determine which slot we are decrementing ammo from.
        var slot = Equipment_1.Equipment.AMMUNITION_SLOT;
        // Is the weapon using a throw weapon?
        // The ammo should be dropped from the weapon slot.
        if (rangedWeapon.getType() == RangedData_1.RangedWeaponType.KNIFE || rangedWeapon.getType() == RangedData_1.RangedWeaponType.DART
            || rangedWeapon.getType() == RangedData_1.RangedWeaponType.TOKTZ_XIL_UL) {
            slot = Equipment_1.Equipment.WEAPON_SLOT;
        }
        var accumalator = player.getEquipment().get(Equipment_1.Equipment.CAPE_SLOT).getId() == 10499;
        if (accumalator) {
            if (Misc_1.Misc.getRandom(12) <= 9) {
                return;
            }
        }
        if (rangedWeapon == RangedData_1.RangedWeapon.TOXIC_BLOWPIPE) {
            if (player.decrementAndGetBlowpipeScales() <= 0) {
                player.getPacketSender().sendMessage("Your Toxic blowpipe has run out of scales!");
                player.getCombat().reset();
            }
            return;
        }
        player.getEquipment().get(slot).decrementAmountBy(amount);
        // Drop arrows if the player isn't using an accumalator
        if (player.getCombat().getAmmunition().dropOnFloor()) {
            if (!accumalator) {
                /*
                for(let i = 0; i < amount; i++) {
                    GroundItemManager.spawnGroundItem(player,
                    new GroundItem(new Item(player.getEquipment().get(slot).getId()), pos,
                    player.getUsername(), false, 120, true, 120));
                }
                */
            }
        }
        // If we are at 0 ammo remove the item from the equipment completely.
        if (player.getEquipment().get(slot).getAmount() == 0) {
            player.getPacketSender().sendMessage("You have run out of ammunition!");
            player.getEquipment().set(slot, new Item_1.Item(-1));
            if (slot == Equipment_1.Equipment.WEAPON_SLOT) {
                WeaponInterfaces_1.WeaponInterfaces.assign(player);
                player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
            }
        }
        // Refresh the equipment interface.
        player.getEquipment().refreshItems();
    };
    CombatFactory.RANDOM = new RandomGen_1.RandomGen();
    /**
     * The default melee combat method.
     */
    CombatFactory.MELEE_COMBAT = new MeleeCombatMethod_1.MeleeCombatMethod();
    /**
     * The default ranged combat method
     */
    CombatFactory.RANGED_COMBAT = new RangedCombatMethod_1.RangedCombatMethod();
    /**
     * The default magic combat method
     */
    CombatFactory.MAGIC_COMBAT = new MagicCombatMethod_1.MagicCombatMethod();
    return CombatFactory;
}());
var CanAttackResponse;
(function (CanAttackResponse) {
    CanAttackResponse[CanAttackResponse["INVALID_TARGET"] = 0] = "INVALID_TARGET";
    CanAttackResponse[CanAttackResponse["ALREADY_UNDER_ATTACK"] = 1] = "ALREADY_UNDER_ATTACK";
    CanAttackResponse[CanAttackResponse["CANT_ATTACK_IN_AREA"] = 2] = "CANT_ATTACK_IN_AREA";
    CanAttackResponse[CanAttackResponse["COMBAT_METHOD_NOT_ALLOWED"] = 3] = "COMBAT_METHOD_NOT_ALLOWED";
    CanAttackResponse[CanAttackResponse["LEVEL_DIFFERENCE_TOO_GREAT"] = 4] = "LEVEL_DIFFERENCE_TOO_GREAT";
    CanAttackResponse[CanAttackResponse["NOT_ENOUGH_SPECIAL_ENERGY"] = 5] = "NOT_ENOUGH_SPECIAL_ENERGY";
    CanAttackResponse[CanAttackResponse["STUNNED"] = 6] = "STUNNED";
    CanAttackResponse[CanAttackResponse["DUEL_NOT_STARTED_YET"] = 7] = "DUEL_NOT_STARTED_YET";
    CanAttackResponse[CanAttackResponse["DUEL_MELEE_DISABLED"] = 8] = "DUEL_MELEE_DISABLED";
    CanAttackResponse[CanAttackResponse["DUEL_RANGED_DISABLED"] = 9] = "DUEL_RANGED_DISABLED";
    CanAttackResponse[CanAttackResponse["DUEL_MAGIC_DISABLED"] = 10] = "DUEL_MAGIC_DISABLED";
    CanAttackResponse[CanAttackResponse["DUEL_WRONG_OPPONENT"] = 11] = "DUEL_WRONG_OPPONENT";
    CanAttackResponse[CanAttackResponse["TARGET_IS_IMMUNE"] = 12] = "TARGET_IS_IMMUNE";
    CanAttackResponse[CanAttackResponse["CAN_ATTACK"] = 13] = "CAN_ATTACK";
})(CanAttackResponse = exports.CanAttackResponse || (exports.CanAttackResponse = {}));
var CombatFactoryTask = /** @class */ (function (_super) {
    __extends(CombatFactoryTask, _super);
    function CombatFactoryTask(n1, target, bool, execFunc) {
        var _this = _super.call(this, n1, target, bool) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    CombatFactoryTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return CombatFactoryTask;
}(Task_1.Task));
//# sourceMappingURL=CombatFactory.js.map