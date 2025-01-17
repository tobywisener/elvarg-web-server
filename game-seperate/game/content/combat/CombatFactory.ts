import { Sound } from "../../Sound";
import { Sounds } from "../../Sounds";
import { RegionManager } from "../../collision/RegionManager";
import { PrayerHandler } from "../PrayerHandler";
import { Dueling } from "../Duelling";
import { WeaponInterfaces } from "./WeaponInterfaces";
import { DamageFormulas } from "./formula/DamageFormulas";
import { HitDamage } from "./hit/HitDamage";
import { HitMask } from "./hit/HitMask";
import { PendingHit } from "./hit/PendingHit";
import { CombatSpells } from "./magic/CombatSpells";
import { CombatMethod } from "./method/CombatMethod";
import { MagicCombatMethod } from "./method/impl/MagicCombatMethod";
import { MeleeCombatMethod } from "./method/impl/MeleeCombatMethod";
import { RangedCombatMethod } from "./method/impl/RangedCombatMethod";
import { RangedData, RangedWeapon, RangedWeaponType } from "./ranged/RangedData";
import { Mobile } from "../../entity/impl/Mobile";
import { NPC } from "../../entity/impl/npc/NPC";
import { CoordinateState, NPCMovementCoordinator } from "../../entity/impl/npc/NPCMovementCoordinator";
import { Player } from "../../entity/impl/player/Player";
import { PlayerBot } from "../../entity/impl/playerbot/PlayerBot";
import { Animation } from "../../model/Animation";
import { EffectTimer } from "../../model/EffectTimer"
import { Flag } from "../../model/Flag";
import { Graphic } from "../../model/Graphic";
import { GraphicHeight } from "../../model/GraphicHeight";
import { Item } from "../../model/Item";
import { Location } from "../../model/Location";
import { Skill } from "../../model/Skill";
import { SkullType } from "../../model/SkullType"
import { AreaManager } from "../../model/areas/AreaManager";
import { WildernessArea } from "../../model/areas/impl/WildernessArea";
import { Equipment } from "../../model/container/impl/Equipment";
import { MovementQueue } from "../../model/movement/MovementQueue";
import { PathFinder } from "../../model/movement/path/PathFinder";
import { PlayerRights } from "../../model/rights/PlayerRights";
import { Task } from "../../task/Task";
import { TaskManager } from "../../task/TaskManager";
import { CombatPoisonEffect } from "../../task/impl/CombatPoisonEffect"
import { ItemIdentifiers } from "../../../util/ItemIdentifiers";
import { Misc } from "../../../util/Misc";
import { NpcIdentifiers } from "../../../util/NpcIdentifiers";
import { RandomGen } from "../../../util/RandomGen";
import { TimerKey } from "../../../util/timers/TimerKey";
import { CombatType } from "./CombatType";
import { CombatSpecial } from "./CombatSpecial";
import { CombatPoisonData } from "../../task/impl/CombatPoisonEffect";
import { DuelRule } from "../Duelling";
import { PoisonType } from "../../task/impl/CombatPoisonEffect";


export class CombatFactory {
    private static readonly RANDOM = new RandomGen();
    /**
     * The default melee combat method.
     */
    public static readonly MELEE_COMBAT = new MeleeCombatMethod();

    /**
     * The default ranged combat method
     */
    public static readonly RANGED_COMBAT = new RangedCombatMethod();

    /**
     * The default magic combat method
     */
    public static readonly MAGIC_COMBAT = new MagicCombatMethod();

    static getMethod(attacker: Mobile) {
        if (attacker.isPlayer()) {
            let p: Player = attacker.getAsPlayer();
            // Update player data..
            // Update ranged ammo / weapon
            p.getCombat().setAmmunition(RangedWeapon.getFor(p));
            p.getCombat().setRangedWeapon(RangedWeapon.getFor(p));

            // Check if player is maging..
            if (p.getCombat().getCastSpell() != null ||
                // Ensure player needs staff equipped to use autocast
                (p.getCombat().getAutocastSpell() != null && p.getEquipment().hasStaffEquipped())) {
                return this.MAGIC_COMBAT;
            }

            // Check special attacks..
            if (Player.getCombatSpecial() != null) {
                if (p.isSpecialActivated()) {
                    return Player.getCombatSpecial().getCombatMethod();
                }
            }

            // Check if player is ranging..
            if (p.getCombat().getRangedWeapon() != null) {
                return this.RANGED_COMBAT;
            }

        } else if (attacker.isNpc()) {
            return attacker.getAsNpc().getCombatMethod();
        }

        // Return melee by default
        return this.MELEE_COMBAT;
    }

    static getHitDamage(entity: Mobile, victim: Mobile, type: CombatType) {
        let damage = 0;
        if (type == CombatType.MELEE) {
            damage = Misc.randomInclusive(0, DamageFormulas.calculateMaxMeleeHit(entity));

            // Do melee effects with the calculated damage..
            if (victim.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE]) {
                damage *= 0.6;
            }

        } else if (type == CombatType.RANGED) {
            damage = Misc.randomInclusive(0, DamageFormulas.calculateMaxRangedHit(entity));

            if (victim.getPrayerActive()[PrayerHandler.PROTECT_FROM_MISSILES]) {
                damage *= 0.6;
            }

            // Do ranged effects with the calculated damage..
            if (entity.isPlayer()) {

                let player = entity.getAsPlayer();

                // Check if player is using dark bow and set damage to minimum 8, maxmimum 48 if
                // that's the case...
                if (player.isSpecialActivated()
                    && Player.getCombatSpecial() == CombatSpecial.DARK_BOW) {
                    if (damage < 8) {
                        damage = 8;
                    } else if (damage > 48) {
                        damage = 48;
                    }
                }
                if (player.getWeapon() == WeaponInterfaces.CROSSBOW && Misc.getRandom(10) == 1) {
                    let multiplier = RangedData.getSpecialEffectsMultiplier(player, victim, damage);
                    damage *= multiplier;
                }
            }
        } else if (type == CombatType.MAGIC) {
            damage = Misc.randomInclusive(0, DamageFormulas.getMagicMaxhit(entity));
            if (victim.getPrayerActive()[PrayerHandler.PROTECT_FROM_MAGIC]) {
                damage *= 0.6;
            }
        }

        // Do magic effects with the calculated damage..
        // We've got our damage. We can now create a HitDamage
        // instance.
        let hitDamage = new HitDamage(damage, damage == 0 ? HitMask.BLUE : HitMask.RED);

        /**
         * Prayers decreasing damage.
         */

        // Decrease damage if victim is a player and has prayers active..
        if ((!CombatFactory.fullVeracs(entity) || Misc.getRandom(4) == 1)) {

            // Check if victim is is using correct protection prayer
            if (PrayerHandler.isActivated(victim, PrayerHandler.getProtectingPrayer(type))) {

                // Apply the damage reduction mod
                if (entity.isNpc()) {
                    hitDamage.multiplyDamage(CombatConstants.PRAYER_DAMAGE_REDUCTION_AGAINST_NPCS);
                } else {
                    hitDamage.multiplyDamage(CombatConstants.PRAYER_DAMAGE_REDUCTION_AGAINST_PLAYERS);
                }
            }
        }
        if (victim.isPlayer() && Misc.getRandom(100) <= 70) {
            if (victim.getAsPlayer().getEquipment().getItems()[Equipment.SHIELD_SLOT].getId() == 12817) {
                hitDamage.multiplyDamage(CombatConstants.ELYSIAN_DAMAGE_REDUCTION);
                victim.performGraphic(new Graphic(321, 40)); // Elysian spirit shield effect gfx
            }
        }

        return hitDamage;
    }

    static validTarget(attacker: Mobile, target: Mobile) {
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
        } else if (attacker.isPlayer() && target.isNpc()) {
            if (target.getAsNpc().getOwner() != null && target.getAsNpc().getOwner() != attacker.getAsPlayer()) {
                attacker.getAsPlayer().getPacketSender().sendMessage("This npc was not spawned for you.");
                return false;
            }
        }

        return true;
    }

    static canReach(attacker: Mobile, method: CombatMethod, target: Mobile) {
        if (!CombatFactory.validTarget(attacker, target)) {
            attacker.getCombat().reset();
            return true;
        }
        let isMoving = target.getMovementQueue().isMovings();

        // Walk back if npc is too far away from spawn position.
        if (attacker.isNpc()) {
            let npc = attacker.getAsNpc();
            if (npc.getCurrentDefinition().doesRetreat()) {
                if (npc.getMovementCoordinator().getCoordinateState() == CoordinateState.RETREATING) {
                    npc.getCombat().reset();
                    return false;
                }
                if (npc.getLocation().getDistance(npc.getSpawnPosition()) >= npc.getCurrentDefinition().getCombatFollowDistance()) {
                    npc.getCombat().reset();
                    npc.getMovementCoordinator().setCoordinateState(CoordinateState.RETREATING);
                    return false;
                }
            }
        }

        let attackerPosition = attacker.getLocation();
        let targetPosition = target.getLocation();

        if (attackerPosition.equals(targetPosition)) {
            if (!attacker.getTimers().has(TimerKey.STEPPING_OUT)) {
                MovementQueue.clippedStep(attacker);
                attacker.getTimers().registers(TimerKey.STEPPING_OUT, 2);
            }
            return false;
        }
        let requiredDistance = method.attackDistance(attacker);
        let distance = attacker.calculateDistance(target);

        // Standing under the target
        if (distance == 0) {
            if (attacker.isPlayer()) {
                return false;
            }
            if (attacker.isNpc() && attacker.getSize() == 0) {
                return false;
            }
        }

        if (method.type() == CombatType.MELEE && isMoving && attacker.getMovementQueue().isMovings()) {
            // If we're using Melee and either player is moving, increase required distance
            requiredDistance++;
        }

        // Too far away from the target
        if (distance > requiredDistance) {
            return false;
        }

        // Don't allow diagonal attacks for smaller entities
        if (method.type() == CombatType.MELEE && attacker.getSize() == 1 && target.getSize() == 1 && !isMoving && !target.getMovementQueue().isMovings()) {
            if (PathFinder.isDiagonalLocation(attacker, target)) {
                CombatFactory.stepOut(attacker, target);
                return false;
            }
        }

        // Make sure we the path is clear for projectiles..
        if (attacker.useProjectileClipping() && !RegionManager.canProjectileAttackTarget(attacker, target)) {
            return false;
        }

        return true;
    }

    public static fullVeracs(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers.VERAC_THE_DEFILED
            : entity.getAsPlayer().getEquipment().containsAllAny([4753, 4757, 4759, 4755]);
    }

    /**
    * Determines if the entity is wearing full dharoks.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full dharoks.
    */
    public static fullDharoks(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers.DHAROK_THE_WRETCHED
            : entity.getAsPlayer().getEquipment().containsAllAny([4716, 4720, 4722, 4718]);
    }

    /**
    * Determines if the entity is wearing full karils.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full karils.
    */
    public static fullKarils(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers.KARIL_THE_TAINTED
            : entity.getAsPlayer().getEquipment().containsAllAny([4732, 4736, 4738, 4734]);
    }

    /**
    * Determines if the entity is wearing full ahrims.
    *
    * @param entity the entity to determine this for.
    * @return true if the player is wearing full ahrims.
    */
    public static fullAhrims(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getId() == NpcIdentifiers.AHRIM_THE_BLIGHTED
            : entity.getAsPlayer().getEquipment().containsAllAny([4708, 4712, 4714, 4710]);
    }

    public static fullTorags(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getDefinition().getName() === "Torag the Corrupted"
            : entity.getAsPlayer().getEquipment().containsAllAny([4745, 4749, 4751, 4747]);
    }

    /**
     * Determines if the entity is wearing full guthans.
     *
     * @param entity the entity to determine this for.
     * @return true if the player is wearing full guthans.
     */
    public static fullGuthans(entity: Mobile): boolean {
        return entity.isNpc() ? entity.getAsNpc().getDefinition().getName() === "Guthan the Infested"
            : entity.getAsPlayer().getEquipment().containsAllAny([4724, 4728, 4730, 4726]);
    }

    /**
     * Calculates the combat level difference for wilderness player vs. player
     * combat.
     *
     * @param combatLevel the combat level of the first person.
     * @param otherCombatLevel the combat level of the other person.
     * @return the combat level difference.
     */
    public static combatLevelDifference(combatLevel: number, otherCombatLevel: number): number {
        if (combatLevel > otherCombatLevel) {
            return (combatLevel - otherCombatLevel);
        } else if (otherCombatLevel > combatLevel) {
            return (otherCombatLevel - combatLevel);
        } else {
            return 0;
        }
    }

    private static stepOut(attacker: Mobile, target: Mobile) {
        let tiles = [
            new Location(target.getLocation().getX() - 1, target.getLocation().getY()),
            new Location(target.getLocation().getX() + 1, target.getLocation().getY()),
            new Location(target.getLocation().getX(), target.getLocation().getY() + 1),
            new Location(target.getLocation().getX(), target.getLocation().getY() - 1)
        ];
        /** If a tile is present it will step out **/
        tiles.filter(t => !RegionManager.blocked(t, attacker.getPrivateArea())).sort((a, b) => attacker.getLocation().getDistance(a) - attacker.getLocation().getDistance(b)).forEach(tile => {
            PathFinder.calculateWalkRoute(attacker, tile.getX(), tile.getY());
        });
    }

    public static canAttack(attacker: Mobile, method: CombatMethod, target: Mobile): CanAttackResponse {
        if (!CombatFactory.validTarget(attacker, target)) {
            return CanAttackResponse.INVALID_TARGET;
        }

        // Here we check if we are already in combat with another entity.
        // Only check if we aren't in multi.
        if (!(AreaManager.inMulti(attacker) && AreaManager.inMulti(target))) {
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
        let areaResponse = AreaManager.canAttack(attacker, target);
        if (areaResponse != CanAttackResponse.CAN_ATTACK) {
            return areaResponse;
        }

        if (!method.canAttack(attacker, target)) {
            return CanAttackResponse.COMBAT_METHOD_NOT_ALLOWED;
        }

        if (attacker.isPlayer()) {
            let p: Player = attacker.getAsPlayer();

            // Check if we're using a special attack..
            if (p.isSpecialActivated() && Player.getCombatSpecial() != null) {
                // Check if we have enough special attack percentage.
                // If not, reset special attack.
                if (p.getSpecialPercentage() < Player.getCombatSpecial().getDrainAmount()) {
                    return CanAttackResponse.NOT_ENOUGH_SPECIAL_ENERGY;
                }
            }

            if (p.getTimers().has(TimerKey.STUN)) {
                return CanAttackResponse.STUNNED;
            }

            // Duel rules
            if (p.getDueling().inDuel()) {
                if (method.type() == CombatType.MELEE && p.getDueling().getRules()[DuelRule.NO_MELEE.getButtonId()]) {
                    return CanAttackResponse.DUEL_MELEE_DISABLED;
                } else if (method.type() == CombatType.RANGED && p.getDueling().getRules()[DuelRule.NO_RANGED.getButtonId()]) {
                    return CanAttackResponse.DUEL_RANGED_DISABLED;
                } else if (method.type() == CombatType.MAGIC && p.getDueling().getRules()[DuelRule.NO_MAGIC.getButtonId()]) {
                    return CanAttackResponse.DUEL_MAGIC_DISABLED;
                }
            }
        }

        // Check immune npcs..
        if (target.isNpc()) {
            let npc = <NPC>target;
            if (npc.getTimers().has(TimerKey.ATTACK_IMMUNITY)) {
                return CanAttackResponse.TARGET_IS_IMMUNE;
            }
        }
        return CanAttackResponse.CAN_ATTACK;
    }

    public static addPendingHit(qHit: PendingHit) {
        let attacker = qHit.getAttacker();
        let target = qHit.getTarget();
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
    }

    public static executeHit(qHit: PendingHit) {
        let attacker = qHit.getAttacker();
        let target = qHit.getTarget();
        let method = qHit.getCombatMethod();
        let combatType = qHit.getCombatType();
        let damage = qHit.getTotalDamage();

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
        target.performAnimation(new Animation(target.getBlockAnim()));

        // Do other stuff for players..
        if (target.isPlayer()) {
            let p_ = target.getAsPlayer();
            Sounds.sendSound(p_, Sound.FEMALE_GETTING_HIT);

            // Close their current interface
            if (p_.getRights() != PlayerRights.DEVELOPER && p_.busy()) {
                p_.getPacketSender().sendInterfaceRemoval();
            }

            // Prayer effects
            if (qHit.isAccurate()) {

                if (PrayerHandler.isActivated(p_, PrayerHandler.REDEMPTION)) {
                    CombatFactory.handleRedemption(attacker, p_, damage);
                }

                if (PrayerHandler.isActivated(attacker, PrayerHandler.SMITE)) {
                    CombatFactory.handleSmite(attacker, p_, damage);
                }
            }
        }
        let magic_splash = (combatType === CombatType.MAGIC && !qHit.isAccurate());
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
            let p_ = attacker.getAsPlayer();
            // Randomly apply poison if poisonous weapon is equipped.
            if (damage > 0 && Math.floor(Math.random() * 20) <= 5) { // 1/4

                let poison: CombatPoisonData
                let isRanged = false;

                if (combatType === CombatType.MELEE || p_.getWeapon() === WeaponInterfaces.DART
                    || p_.getWeapon() === WeaponInterfaces.KNIFE
                    || p_.getWeapon() === WeaponInterfaces.THROWNAXE
                    || p_.getWeapon() === WeaponInterfaces.JAVELIN) {
                    poison = CombatPoisonData.getPoisonType(p_.getEquipment().get(Equipment.WEAPON_SLOT));
                } else if (combatType === CombatType.RANGED) {
                    isRanged = true;
                    poison = CombatPoisonData.getPoisonType(p_.getEquipment().get(Equipment.AMMUNITION_SLOT));
                }

                if (poison && (!isRanged || Math.floor(Math.random() * 10) <= 5)) { // Range 1/8
                    CombatFactory.poisonEntity(target, CombatPoisonData.getPoisonType());
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
        } else if (attacker.isNpc()) {
            let npc = attacker.getAsNpc();
            if (npc.getCurrentDefinition().isPoisonous()) {
                if (Math.floor(Math.random() * 10) <= 5) {
                    CombatFactory.poisonEntity(target, PoisonType.SUPER);
                }
            }


        }
        if (qHit.getTotalDamage() > 0) {
            if (target.isPlayer()) {
                let player = target.getAsPlayer();
                if (player.getEquipment().get(Equipment.RING_SLOT).getId() === ItemIdentifiers.RING_OF_RECOIL) {
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

        if (target instanceof PlayerBot) {
            (target as PlayerBot).getCombatInteraction().takenDamage(qHit.getTotalDamage(), attacker);
        }
    }

    public static rewardExp(player: Player, hit: PendingHit) {
        // Add magic exp, even if total damage is 0.
        // Since spells have a base exp reward
        if (hit.getCombatType() === CombatType.MAGIC) {
            if (player.getCombat().getPreviousCast() != null) {
                if (hit.isAccurate()) {
                    player.getSkillManager().addExperiences(Skill.MAGIC,
                        (hit.getTotalDamage())/* + player.getCombat().getPreviousCast().baseExperience() */);
                } else {
                    // Splash should only give 52 exp..
                    player.getSkillManager().addExperience(Skill.MAGIC, 52, false);
                }
            }
        }

        // Don't add any exp to other skills if total damage is 0.
        if (hit.getTotalDamage() <= 0) {
            return;
        }

        // Add hp xp
        player.getSkillManager().addExperiences(Skill.HITPOINTS, (hit.getTotalDamage() * .70));

        // Magic xp was already added
        if (hit.getCombatType() === CombatType.MAGIC) {
            return;
        }

        // Add all other skills xp
        let exp = hit.getSkills();
        for (let i of exp) {
            let skill = Object.values(Skill)[i];
            player.getSkillManager().addExperiences(skill, (hit.getTotalDamage() / exp.length));
        }
    }

    public static isAttacking(character: Mobile): boolean {
        return character.getCombat().getTarget() != null;
    }

    public static isBeingAttacked(character: Mobile): boolean {
        return character.getCombat().getAttacker() != null;
    }

    public static inCombat(character: Mobile): boolean {
        return CombatFactory.isAttacking(character) || CombatFactory.isBeingAttacked(character);
    }

    public static poisonEntity(entity: Mobile, poisonType: CombatPoisonData) {
        // We are already poisoned or the poison type is invalid, do nothing.
        if (entity.isPoisoned()) {
            return;
        }

        // If the entity is a player, we check for poison immunity. If they have
        // no immunity then we send them a message telling them that they are
        // poisoned.
        if (entity.isPlayer()) {
            let player = (entity as Player);
            if (!player.getCombat().getPoisonImmunityTimer().finished()) {
                return;
            }
            player.getPacketSender().sendMessage("You have been poisoned!");
            if (poisonType === PoisonType.VENOM) {
                player.getPacketSender().sendPoisonType(2);
            } else {
                player.getPacketSender().sendPoisonType(1);
            }
        }

        entity.setPoisonDamage(CombatPoisonData.getDemage());
        TaskManager.submit(new CombatPoisonEffect(entity));
    }

    public static disableProtectionPrayers(player: Player) {
        // Player has already been prayer-disabled
        if (!player.getCombat().getPrayerBlockTimer().finished()) {
            return;
        }
        player.getCombat().getPrayerBlockTimer().start(200);
        PrayerHandler.resetPrayers(player, PrayerHandler.PROTECTION_PRAYERS);
        player.getPacketSender().sendMessage("You have been disabled and can no longer use protection prayers.");
    }

    public static handleRecoil(player: Player, attacker: Mobile, damage: number) {
        if (damage == 0) {
            return;
        }
        const RECOIL_DMG_MULTIPLIER = 0.1;
        let returnDmg = Math.floor(Math.random() * 3) + 1 === 2 ? 0 : (damage * RECOIL_DMG_MULTIPLIER) + 1;

        // Increase recoil damage for a player.
        player.setRecoilDamage(player.getRecoilDamage() + returnDmg);

        // Deal damage back to attacker
        attacker.getCombat().getHitQueue().addPendingDamage([new HitDamage(returnDmg, HitMask.RED)]);

        // Degrading ring of recoil for a player.
        if (player.getRecoilDamage() >= 40) {
            player.getEquipment().set(Equipment.RING_SLOT, new Item(-1));
            player.getEquipment().refreshItems();
            player.getPacketSender().sendMessage("Your ring of recoil has degraded.");
            player.setRecoilDamage(0);
        }
    }

    public static handleVengeance(character: Mobile, attacker: Mobile, damage: number) {
        let returnDmg = Math.floor(damage * 0.75);
        if (returnDmg <= 0) {
            return;
        }
        attacker.getCombat().getHitQueue().addPendingDamage([new HitDamage(returnDmg, HitMask.RED)]);
        character.forceChat("Taste Vengeance!");
        character.setHasVengeance(false);
    }

    public static handleGuthans(player: Player, target: Mobile, damage: number) {
        target.performGraphic(new Graphic(398));
        player.heal(damage);
    }
    /**
    
    Checks if a player should be skulled or not.
    
    @param attacker
    
    @param target
    */
    public static handleSkull(attacker: Player, target: Player) {

        if (attacker.isSkulled()) {
            return;
        }

        if (!(attacker.getArea() instanceof WildernessArea)) {
            return;
        }

        // We've probably already been skulled by this player.
        if (target.getCombat().damageMapContains(attacker) || attacker.getCombat().damageMapContains(target)) {
            return;
        }

        if (target.getCombat().getAttacker() != null && target.getCombat().getAttacker() == attacker) {
            return
        }

        if (attacker.getCombat().getAttacker() != null && attacker.getCombat().getAttacker() == target) {
            return;
        }

        CombatFactory.skull(attacker, SkullType.WHITE_SKULL, 300);
    }

    static skull(player: Player, type: SkullType, seconds: number) {
        player.setSkullType(type);
        player.setSkullTimer(Misc.getTicks(seconds));
        player.getUpdateFlag().flag(Flag.APPEARANCE);
        if (type == SkullType.RED_SKULL) {
            player.getPacketSender().sendMessage(
                "@bla@You have received a @red@red skull@bla@! You can no longer use the Protect item prayer!");
            PrayerHandler.deactivatePrayer(player, PrayerHandler.PROTECT_ITEM);
        } else if (type == SkullType.WHITE_SKULL) {
            player.getPacketSender().sendMessage("You've been skulled!");
        }
    }

    static stun(character: Mobile, seconds: number, force: boolean) {
        if (!force) {
            if (character.getTimers().has(TimerKey.STUN)) {
                return;
            }
        }

        character.getTimers().registers(TimerKey.STUN, Misc.getTicks(seconds));
        character.getCombat().reset();
        character.getMovementQueue().reset();
        character.performGraphic(new Graphic(348, GraphicHeight.HIGH));

        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendMessage("You've been stunned!");
        }
    }

    static handleRetaliation(attacker: Mobile, target: Mobile) {
        if (!CombatFactory.isAttacking(target)) {
            let auto_ret = false;
            if (target.isPlayer()) {
                auto_ret = target.getAsPlayer().autoRetaliateReturn() && !target.getMovementQueue().isMovings();
            } else if (target.isNpc()) {
                auto_ret = target.getAsNpc().getMovementCoordinator().getCoordinateState() == CoordinateState.HOME;
            }

            if (!auto_ret) {
                return;
            }

            TaskManager.submit(new CombatFactoryTask(1, target, false, () => {
                target.getCombat().attack(attacker);
            }));
        }
    }

    static freeze(character: Mobile, seconds: number) {
        if (character.getTimers().has(TimerKey.FREEZE) || character.getTimers().has(TimerKey.FREEZE_IMMUNITY)) {
            return;
        }

        if (character.getSize() > 2) {
            return;
        }

        const ticks = Misc.getTicks(seconds);
        character.getTimers().registers(TimerKey.FREEZE, ticks);
        character.getTimers().registers(TimerKey.FREEZE_IMMUNITY, ticks + Misc.getTicks(3));
        character.getMovementQueue().reset();

        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendMessage("You have been frozen!").sendEffectTimer(seconds, EffectTimer.FREEZE);
        }
    }

    private static handleRedemption(attacker: Mobile, victim: Player, damage: number) {
        if ((victim.getHitpoints() - damage) <= (victim.getSkillManager().getMaxLevel(Skill.HITPOINTS) / 10)) {
            const amountToHeal = (victim.getSkillManager().getMaxLevel(Skill.PRAYER) * .25);
            victim.performGraphic(new Graphic(436));
            victim.getSkillManager().setCurrentLevels(Skill.PRAYER, 0);
            victim.getSkillManager().setCurrentLevels(Skill.HITPOINTS, victim.getHitpoints() + amountToHeal);
            victim.getPacketSender().sendMessage("You've run out of prayer points!");
            PrayerHandler.deactivatePrayers(victim);
        }
    }

    private static handleSmite(attacker: Mobile, victim: Player, damage: number) {
        victim.getSkillManager().decreaseCurrentLevel(Skill.PRAYER, (damage / 4), 0);
    }

    static handleRetribution(killed: Player, killer: Player) {
        killed.performGraphic(new Graphic(437));
        if (killer.getLocation().isWithinDistance(killer.getLocation(), CombatConstants.RETRIBUTION_RADIUS)) {
            killer.getCombat().getHitQueue().addPendingDamage([
                new HitDamage(Misc.getRandom(CombatConstants.MAXIMUM_RETRIBUTION_DAMAGE), HitMask.RED)]);
        }
    }

    public static checkAmmo(player: Player, amountRequired: number): boolean {
        const rangedWeapon = player.getCombat().getRangedWeapon();
        const ammoData = player.getCombat().getAmmunition();

        if (rangedWeapon == null) {
            player.getCombat().reset();
            return false;
        }

        if (rangedWeapon === RangedWeapon.TOXIC_BLOWPIPE) {
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

        if (rangedWeapon.getType() === RangedWeaponType.KNIFE || rangedWeapon.getType() === RangedWeaponType.DART
            || rangedWeapon.getType() === RangedWeaponType.TOKTZ_XIL_UL) {
            return true;
        }

        let ammoSlotItem = player.getEquipment().getItems()[Equipment.AMMUNITION_SLOT];
        if (ammoSlotItem.getId() == -1 || ammoSlotItem.getAmount() < amountRequired) {
            player.getPacketSender().sendMessage("You don't have the required amount of ammunition to fire that.");
            player.getCombat().reset();
            return false;
        }

        let properReq = false;

        // BAD LOOP
        for (let d of rangedWeapon.getAmmunitionData()) {
            if (d == ammoData) {
                if (d.getItemId() == ammoSlotItem.getId()) {
                    properReq = true;
                    break;
                }
            }
        }

        if (!properReq) {
            let ammoName = ammoSlotItem.getDefinition().getName(),
                weaponName = player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getDefinition().getName(),
                add = !ammoName.endsWith("s") && !ammoName.endsWith("(e)") ? "s" : "";
            player.getPacketSender().sendMessage("You can not use " + ammoName + "" + add + " with "
                + Misc.anOrA(weaponName) + " " + weaponName + ".");
            player.getCombat().reset();
            return false;
        }

        return true;
    }

    public static decrementAmmo(player: Player, pos: Location, amount: number) {
        // Get the ranged weapon data
        const rangedWeapon = player.getCombat().getRangedWeapon();

        // Determine which slot we are decrementing ammo from.
        let slot = Equipment.AMMUNITION_SLOT;

        // Is the weapon using a throw weapon?
        // The ammo should be dropped from the weapon slot.
        if (rangedWeapon.getType() == RangedWeaponType.KNIFE || rangedWeapon.getType() == RangedWeaponType.DART
            || rangedWeapon.getType() == RangedWeaponType.TOKTZ_XIL_UL) {
            slot = Equipment.WEAPON_SLOT;
        }

        let accumalator = player.getEquipment().get(Equipment.CAPE_SLOT).getId() == 10499;
        if (accumalator) {
            if (Misc.getRandom(12) <= 9) {
                return;
            }
        }

        if (rangedWeapon == RangedWeapon.TOXIC_BLOWPIPE) {
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
            player.getEquipment().set(slot, new Item(-1));

            if (slot == Equipment.WEAPON_SLOT) {
                WeaponInterfaces.assign(player);
                player.getUpdateFlag().flag(Flag.APPEARANCE);
            }
        }

        // Refresh the equipment interface.
        player.getEquipment().refreshItems();
    }

}


export enum CanAttackResponse {
    INVALID_TARGET,
    ALREADY_UNDER_ATTACK,
    CANT_ATTACK_IN_AREA,
    COMBAT_METHOD_NOT_ALLOWED,
    LEVEL_DIFFERENCE_TOO_GREAT,
    NOT_ENOUGH_SPECIAL_ENERGY,
    STUNNED,
    DUEL_NOT_STARTED_YET,
    DUEL_MELEE_DISABLED,
    DUEL_RANGED_DISABLED,
    DUEL_MAGIC_DISABLED,
    DUEL_WRONG_OPPONENT,
    TARGET_IS_IMMUNE,
    CAN_ATTACK,
}


class CombatFactoryTask extends Task{
    constructor(n1: number, target: Mobile, bool: boolean, private readonly execFunc: Function){
        super(n1, target, bool)
    }

    execute(): void {
        this.execFunc();
        this.stop();
    }
    
}