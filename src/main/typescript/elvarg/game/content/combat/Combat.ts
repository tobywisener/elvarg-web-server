import { Server } from "../../../Server"
import { HitDamageCache } from "../../content/combat/hit/HitDamageCache"
import { HitQueue } from "../../content/combat/hit/HitQueue"
import { PendingHit } from "./hit/PendingHit";
import { CombatSpell } from "./magic/CombatSpell";
import { CombatMethod } from "./method/CombatMethod";
import { GraniteMaulCombatMethod } from "./method/impl/specials/GraniteMaulCombatMethod";
import { RangedData, RangedWeapon, Ammunition } from "./ranged/RangedData";
import { Mobile } from "../../entity/impl/Mobile";
import { Player } from "../../entity/impl/player/Player";
import { SecondsTimer } from "../../model/SecondsTimer";
import { StatementDialogue } from "../../model/dialogues/entries/impl/StatementDialogue";
import { Stopwatch } from "../../../util/Stopwatch";
import { TimerKey } from "../../../util/timers/TimerKey";
import { CombatFactory, CanAttackResponse } from "./CombatFactory";
import { CombatSpecial } from "./CombatSpecial";
export class Combat {
    private character: Mobile;
    private hitQueue: HitQueue;
    private damageMap: Map<Player, HitDamageCache> = new Map<Player, HitDamageCache>();
    private lastAttack = new Stopwatch();
    private poisonImmunityTimer = new SecondsTimer();
    private fireImmunityTimer = new SecondsTimer();
    private teleblockTimer = new SecondsTimer();
    private prayerBlockTimer = new SecondsTimer();
    public rangedWeapon: RangedData;
    public rangedData: RangedWeapon;
    public rangeAmmoData: RangedData;
    public ammuntions: Ammunition;
    private target: Mobile;
    private attacker: Mobile;
    private method: CombatMethod;
    private castSpell: CombatSpell;
    private autoCastSpell: CombatSpell;
    private previousCast: CombatSpell;
    constructor(character: Mobile) {
        this.character = character;
        this.hitQueue = new HitQueue();
    }

    public attack(target: Mobile) {
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
    }

    /**
     * Processes combat.
     */
    public process() {
        // Process the hit queue
        this.hitQueue.process(this.character);

        // Reset attacker if we haven't been attacked in 6 seconds.
        if (this.lastAttack.elapsedTime(6000)) {
            this.setUnderAttack(null);
            return;
        }

        // Handle attacking
        this.performNewAttack(false);
    }

    public performNewAttack(instant: boolean) {
        if (this.target == null || (this.character != null && this.character.isNpc() && !this.character.getAsNpc().getDefinition().doesFightBack())) {
            // Don't process attacks for NPC's who don't fight back
            return;
        }
        // Fetch the combat method the character will be attacking with
        this.method = CombatFactory.getMethod(this.character);

        this.character.setCombatFollowing(this.target);

        // Face target
        this.character.setMobileInteraction(this.target);

        if (!CombatFactory.canReach(this.character, this.method, this.target)) {
            // Make sure the character is within reach before processing combat
            return;
        }

        // Granite maul special attack, make sure we disregard delay
        // and that we do not reset the attack timer.
        let graniteMaulSpecial = (this.method instanceof GraniteMaulCombatMethod);
        if (graniteMaulSpecial) {
            instant = true;
        }

        if (!instant && this.character.getTimers().has(TimerKey.COMBAT_ATTACK)) {
            // If attack isn't instant, make sure timer is elapsed.
            Server.logDebug("Combat : Waiting on COMBAT_ATTACK timer");
            return;
        }

        switch (CombatFactory.canAttack(this.character, this.method, this.target)) {
            case CanAttackResponse.CAN_ATTACK: {
                if (this.character.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    this.method.onCombatBegan(this.character, this.attacker);
                }
                if (this.target.getCombat().getAttacker() == null) {
                    // Call the onCombatBegan hook once when combat begins
                    let targetMethod = CombatFactory.getMethod(this.target);
                    targetMethod.onCombatBegan(this.target, this.character);
                }
                this.method.start(this.character, this.target);
                let hits = this.method.hits(this.character, this.target);
                if (hits == null)
                    return;
                for (let hit of hits) {
                    CombatFactory.addPendingHit(hit);
                }
                this.method.finished(this.character, this.target);

                // Reset attack timer
                if (!graniteMaulSpecial) {
                    let speed = this.method.attackSpeed(this.character);
                    this.character.getTimers().registers(TimerKey.COMBAT_ATTACK, speed);
                }
                instant = false;
                if (this.character.isSpecialActivated()) {
                    this.character.setSpecialActivated(false);
                    if (this.character.isPlayer()) {
                        let p = this.character.getAsPlayer();
                        CombatSpecial.updateBar(p);
                    }
                }
            }
            case CanAttackResponse.ALREADY_UNDER_ATTACK: {
                if (this.character.isPlayer()) {
                    this.character.getAsPlayer().getPacketSender().sendMessage("You are already under attack!");
                }
                this.character.getCombat().reset();
            }
            case CanAttackResponse.CANT_ATTACK_IN_AREA: {
                this.character.getCombat().reset();
            }
            case CanAttackResponse.COMBAT_METHOD_NOT_ALLOWED: {
            }
            case CanAttackResponse.LEVEL_DIFFERENCE_TOO_GREAT: {
                this.character.getAsPlayer().getPacketSender().sendMessage("Your level difference is too great.");
                this.character.getAsPlayer().getPacketSender().sendMessage("You need to move deeper into the Wilderness.");
                this.character.getCombat().reset();
            }
            case CanAttackResponse.NOT_ENOUGH_SPECIAL_ENERGY: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                p.setSpecialActivated(false);
                CombatSpecial.updateBar(this.character.getAsPlayer());
                p.getCombat().reset();
            }
            case CanAttackResponse.STUNNED: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("You're currently stunned and cannot attack.");
                p.getCombat().reset();
            }
            case CanAttackResponse.DUEL_NOT_STARTED_YET: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("The duel has not started yet!");
                p.getCombat().reset();
            }
            case CanAttackResponse.DUEL_WRONG_OPPONENT: {
                let p = this.character.getAsPlayer();
                p.getPacketSender().sendMessage("This is not your opponent!");
                p.getCombat().reset();
            }
            case CanAttackResponse.DUEL_MELEE_DISABLED: {
                let p = this.character.getAsPlayer();
                StatementDialogue.send(p, "Melee has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CanAttackResponse.DUEL_RANGED_DISABLED: {
                let p = this.character.getAsPlayer();
                StatementDialogue.send(p, "Ranged has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CanAttackResponse.DUEL_MAGIC_DISABLED: {
                let p = this.character.getAsPlayer();
                StatementDialogue.send(p, "Magic has been disabled in this duel!");
                p.getCombat().reset();
            }
            case CanAttackResponse.TARGET_IS_IMMUNE: {
                if (this.character.isPlayer()) {
    (this.character as Player).getPacketSender().sendMessage("This npc is currently immune to attacks.");
}
                this.character.getCombat().reset();
            }
            case CanAttackResponse.INVALID_TARGET: {
                this.character.getCombat().reset();
            }
        }
    }

    public reset() {
        this.setTarget(null);
        this.character.setCombatFollowing(null);
        this.character.setMobileInteraction(null);
    }
    /**
* Adds damage to the damage map, as long as the argued amount of damage is
* above 0 and the argued entity is a player.
*
* @param entity the entity to add damage for.
* @param amount the amount of damage to add for the argued entity.
*/
    public addDamage(entity: Mobile, amount: number) {
        if (amount <= 0 || entity.isNpc()) {
            return;
        }

        let player = entity as Player;
        if (this.damageMap.has(player)) {
            this.damageMap.get(player).incrementDamage(amount);
            return;
        }

        this.damageMap.set(player, new HitDamageCache(amount));
    }

    public getKiller(clearMap: boolean) {
        // Return null if no players killed this entity.
        if (this.damageMap.size == 0) {
            return null;
        }

        // The damage and killer placeholders.
        let damage = 0;
        let killer: any | null | undefined = null;

        for (let entry of this.damageMap.entries()) {

            // Check if this entry is valid.
            if (entry == null) {
                continue;
            }

            // Check if the cached time is valid.
            let timeout = entry[1].getStopwatch().valueOf();
            if (timeout > CombatConstants.DAMAGE_CACHE_TIMEOUT) {
                continue;
            }

            // Check if the key for this entry has logged out.
            let player = entry[0];
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

        // Clear the damage map if needed.
        if (clearMap)
            this.damageMap.clear();

        // Return the killer placeholder.
        return killer;
    }

    public damageMapContains(player: Player): boolean {
        let damageCache:HitDamageCache = this.damageMap.get(player);
        if (damageCache == null) {
            return false;
        }
        return damageCache.getStopwatch() < CombatConstants.DAMAGE_CACHE_TIMEOUT;
    }

    public getCharacter(): Mobile {
        return this.character;
    }

    public getTarget(): Mobile {
        return this.target;
    }

    public setTarget(target: Mobile) {
        if (this.target != null && target == null && this.method != null) {
            // Target has changed to null, this means combat has ended. Call the relevant hook inside the combat method.
            this.method.onCombatEnded(this.character, this.attacker);
        }

        this.target = target;
    }

    public getHitQueue(): HitQueue {
        return this.hitQueue;
    }

    public getAttacker(): Mobile {
        return this.attacker;
    }

    public setUnderAttack(attacker: Mobile) {
        this.attacker = attacker;
        this.lastAttack.reset();
    }

    public getCastSpell(): CombatSpell {
        return this.castSpell;
    }
    public setCastSpell(castSpell: CombatSpell) {
        this.castSpell = castSpell;
    }

    public getAutocastSpell(): CombatSpell {
        return this.autoCastSpell;
    }

    public setAutocastSpell(autoCastSpell: CombatSpell) {
        this.autoCastSpell = autoCastSpell;
    }

    public getSelectedSpell(): CombatSpell {
        let spell = this.getCastSpell();
        if (spell != null) {
            return spell;
        }
        return this.getAutocastSpell();
    }

    public getPreviousCast(): CombatSpell {
        return this.previousCast;
    }

    public setPreviousCast(previousCast: CombatSpell) {
        this.previousCast = previousCast;
    }

    public getRangedWeapon(): RangedWeapon {
        return this.rangedData;
    }

    public setRangedWeapon(rangedWeapon: RangedData) {
        this.rangedWeapon = rangedWeapon;
    }

    public getAmmunition(): Ammunition {
        return this.ammuntions;
    }

    public setAmmunition(rangeAmmoData: RangedData) {
        this.rangeAmmoData = rangeAmmoData;
    }

    public getRangeAmmoData(): RangedData {
        return this.rangeAmmoData;
    }

    public setRangeAmmoData(rangeAmmoData: RangedData) {
        this.rangeAmmoData = rangeAmmoData;
    }

    public getPoisonImmunityTimer(): SecondsTimer {
        return this.poisonImmunityTimer;
    }

    public getFireImmunityTimer(): SecondsTimer {
        return this.fireImmunityTimer;
    }

    public getTeleblockTimer(): SecondsTimer {
        return this.teleblockTimer;
    }

    public getPrayerBlockTimer(): SecondsTimer {
        return this.prayerBlockTimer;
    }

    public getLastAttack(): Stopwatch {
        return this.lastAttack;
    }
}
