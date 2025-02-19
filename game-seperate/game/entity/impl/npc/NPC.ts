import { Mobile } from "../Mobile";
import { Sound } from "../../../Sound";
import { World } from "../../../World";
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { CombatType } from "../../../content/combat/CombatType";
import { PendingHit } from "../../../content/combat/hit/PendingHit";
import { CombatMethod } from "../../../content/combat/method/CombatMethod";
import { NpcDefinition } from "../../../definition/NpcDefinition";
import { CoordinateState, NPCMovementCoordinator } from "./NPCMovementCoordinator";
import { Barricades } from "./impl/Barricades";
import { Player } from "../player/Player";
import { FacingDirection } from "../../../model/FacingDirection";
import { Ids } from "../../../model/Ids";
import { Location } from "../../../model/Location";
import { AreaManager } from "../../../model/areas/AreaManager";
import { WildernessArea } from "../../../model/areas/impl/WildernessArea";
import { TaskManager } from "../../../task/TaskManager";
import { NPCDeathTask } from "../../../task/impl/NPCDeathTask"
import * as util from 'util';


export class NPC extends Mobile {
    getSize(): number {
        return this.size();
    }
    private id: number;
    private movementCoordinator: NPCMovementCoordinator = new NPCMovementCoordinator(this);
    private hitpoints: number;
    private spawnPosition: Location;
    private headIcon = -1;
    private isDying: boolean;
    private owner: Player;
    private visible: boolean = true;
    private face: FacingDirection = FacingDirection.NORTH;
    private pet: boolean;
    public barricadeFireTicks = 8;
    public barricadeOnFire: boolean;

    constructor(id: number, position: Location) {
        super(position)
        this.id = id;
        this.spawnPosition = position;

        if (this.getDefinition() == null) {
            this.setHitpoints(this.hitpoints = 10);
        } else {
            this.setHitpoints(this.getDefinition().getHitpoints());
        }
    }
    private static NPC_IMPLEMENTATION_MAP: Map<number, any>;

    handleBarricadeTicks() {
        if (this.barricadeOnFire && this.barricadeFireTicks > 0) {
            this.barricadeFireTicks--;
            if (this.barricadeFireTicks == 0) {
                if (this.isBarricade()) {
                    Barricades.checkTile(this.getLocation());
                }
                this.barricadeOnFire = false;
                World.getRemoveNPCQueue().push(this);
            }
        }
    }

    /**
     * Creates a new {@link NPC}.
     * @param id
     * @param location
     * @return
     */
    public static create(id: number, location: Location) {
        let implementationClass = NPC.NPC_IMPLEMENTATION_MAP.get(id);
        if (implementationClass != null) {
            // If this NPC has been implemented by its own class, instantiate that first
            try {
                return new implementationClass(id, location);
            } catch (e) {
                console.log(e);
            }
        }

        return new NPC(id, location);
    }

    /**
     * Can this npc walk through other NPCs?
     * @return
     */
    public canWalkThroughNPCs(): boolean {
        if (this.pet) {
            return true;
        }
        return false;
    }

    /**
     * Can this npc use pathfinding when following its target?
     * 
     * @return
     */
    public canUsePathFinding(): boolean {
        return false;
    }

    public NPC(id: number, position: Location) {
        this.id = id;
        this.spawnPosition = position;

        if (this.getDefinition() == null) {
            this.setHitpoints(10);
        } else {
            this.setHitpoints(this.getDefinition().getHitpoints());
        }
    }

    public onAdd() {

    }

    public onRemove() {

    }

    public isAggressiveTo(player: Player): boolean {
        return player.getSkillManager().getCombatLevel() <= (this.getCurrentDefinition().getCombatLevel() * 2)
            || player.getArea() instanceof WildernessArea;
    }

    public aggressionDistance(): number {
        let attackDistance = CombatFactory.getMethod(this).attackDistance(this);

        return Math.max(attackDistance, 3);
    }

    public process() {
        if (this.getDefinition() != null) {
            this.getTimers().process();
            this.getMovementQueue().process();
            this.movementCoordinator.process();
            this.getCombat().process();
            this.handleBarricadeTicks();
            AreaManager.process(this);
            if (this.getCombat().getLastAttack().hasElapsed(20000)
                || this.movementCoordinator.getCoordinateState() == CoordinateState.RETREATING) {
                if (this.getDefinition().getHitpoints() > this.hitpoints) {
                    this.setHitpoints(this.hitpoints + (this.getDefinition().getHitpoints() * 0.1));
                    if (this.hitpoints > this.getDefinition().getHitpoints()) {
                        this.setHitpoints(this.getDefinition().getHitpoints());
                    }
                }
            }
        }
    }

    public getPlayersWithinDistance(distance: number): Player[] {
        let list: Player[] = [];
        for (let player of World.getPlayers()) {
            if (player == null) {
                continue;
            }
            if (player.getPrivateArea() != this.getPrivateArea()) {
                continue;
            }
            if (player.getLocation().getDistance(this.getLocation()) <= distance) {
                list.push(player);
            }
        }
        return list;
    }

    public appendDeath() {
        if (!this.isDying) {
            TaskManager.submit(new NPCDeathTask(this));
            this.isDying = true;
        }
    }

    public getHitpoints(): number {
        return this.hitpoints;
    }

    public setHitpoints(hitpoints: number): NPC {
        this.hitpoints = hitpoints;
        if (this.hitpoints <= 0)
            this.appendDeath();
        return this;
    }

    public heal(heal: number) {
        if ((this.hitpoints + heal) > this.getDefinition().getHitpoints()) {
            this.setHitpoints(this.getDefinition().getHitpoints());
            return;
        }
        this.setHitpoints(this.hitpoints + heal);
    }

    public isNpc(): boolean {
        return true;
    }

    public equals(other: Object): boolean {
        return other instanceof NPC && (other as NPC).getIndex() == this.getIndex() && (other as NPC).getId() == this.getId();
    }

    public size(): number {
        return this.getCurrentDefinition() == null ? 1 : this.getCurrentDefinition().getSize();
    }

    public getBaseAttack(type: CombatType): number {
        if (type === CombatType.RANGED) {
            return this.getCurrentDefinition().getStats()[3];
        } else if (type === CombatType.MAGIC) {
            return this.getCurrentDefinition().getStats()[4];
        }

        return this.getCurrentDefinition().getStats()[1];
        // 0 = attack
        // 1 = strength
        // 2 = defence
        // 3 = range
        // 4 = magic
    }

    public getBaseDefence(type: CombatType): number {
        let base = 0;
        switch (type) {
            case CombatType.MAGIC:
                base = this.getCurrentDefinition().getStats()[13];
                break;
            case CombatType.MELEE:
                base = this.getCurrentDefinition().getStats()[10];
                break;
            case CombatType.RANGED:
                base = this.getCurrentDefinition().getStats()[14];
                break;
        }
        // 10,11,12 = melee
        // 13 = magic
        // 14 = range
        return base;
    }

    public getBaseAttackSpeed(): number {
        return this.getCurrentDefinition().getAttackSpeed();
    }

    public getAttackAnim(): number {
        return this.getCurrentDefinition().getAttackAnim();
    }

    public getAttackSound(): Sound {
        // TODO: need to put proper sounds
        return Sound.IMP_ATTACKING;
    }

    public getBlockAnim(): number {
        return this.getCurrentDefinition().getDefenceAnim();
    }

    /*
     * Getters and setters
     */

    public getId(): number {
        if (this.getNpcTransformationId() !== -1) {
            return this.getNpcTransformationId();
        }
        return this.id;
    }

    public getRealId(): number {
        return this.id;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    public isDyingFunction(): boolean {
        return this.isDying;
    }

    public setDying(isDying: boolean): void {
        this.isDying = isDying;
    }

    public getOwner(): Player {
        return this.owner;
    }

    public setOwner(owner: Player): NPC {
        this.owner = owner;
        return this;
    }

    public getMovementCoordinator(): NPCMovementCoordinator {
        return this.movementCoordinator;
    }

    /**
     * Gets the current Definition, subject to current NPC transformation.
     *
     * @return
     */
    public getCurrentDefinition(): NpcDefinition {
        if (this.getNpcTransformationId() !== -1) {
            return NpcDefinition.forId(this.getNpcTransformationId());
        }

        return this.getDefinition();
    }

    /**
     * Gets the base definition for this NPC, regardless of NPC transformation etc.
     *
     * @return
     */
    public getDefinition(): NpcDefinition {
        return NpcDefinition.forId(this.id);
    }

    public isBarricade(): boolean {
        return [5722, 5723, 5724, 5725].some(n => this.getId() === n);
    }

    public getSpawnPosition(): Location {
        return this.spawnPosition;
    }

    public getHeadIcon(): number {
        return this.headIcon;
    }

    public setHeadIcon(headIcon: number): void {
        this.headIcon = headIcon;
        // getUpdateFlag().flag(Flag.NPC_APPEARANCE);
    }

    public getCombatMethod(): CombatMethod {
        // By default, NPCs use Melee combat.
        // This can be overridden by creating a class in entity.impl.npc.impl
        return CombatFactory.MELEE_COMBAT;
    }

    public clone(): NPC {
        return NPC.create(this.getId(), this.getSpawnPosition());
    }

    public getFace(): FacingDirection {
        return this.face;
    }

    public setFace(face: FacingDirection): void {
        this.face = face;
    }

    public isPet(): boolean {
        return this.pet;
    }

    public setPet(pet: boolean): void {
        this.pet = pet;
    }

    public manipulateHit(hit: PendingHit): PendingHit {
        return hit;
    }

    /**
     * Initializes all the NPC implementation classes.
     *
     * @param implementationClasses
     */
    public static initImplementations(implementationClasses: any[]): void {
        // Add all the implemented NPCs to NPC_IMPLEMENTATION_MAP
        this.NPC_IMPLEMENTATION_MAP = new Map<number, any[]>();
        for (const clazz of implementationClasses) {
            for (const id of clazz.getAnnotation(Ids).value()) {
                this.NPC_IMPLEMENTATION_MAP.set(id, clazz);
            }
        }
    }

}