import { Entity } from "../Entity";
import { Sound } from "../../Sound";
import { Combat } from "../../content/combat/Combat";
import { CombatType } from "../../content/combat/CombatType";
import { HitDamage } from "../../content/combat/hit/HitDamage";
import { PendingHit } from "../../content/combat/hit/PendingHit";
import { NPC } from "./npc/NPC";
import { Player } from "./player/Player";
import { PlayerBot } from "./playerbot/PlayerBot";
import { Animation } from "../../model/Animation";
import { Direction } from "../../model/Direction";
import { Flag } from "../../model/Flag";
import { Graphic } from "../../model/Graphic";
import { Location } from "../../model/Location";
import { UpdateFlag } from "../../model/UpdateFlag";
import { MovementQueue } from "../../model/movement/MovementQueue";
import { Task } from "../../task/Task";
import { TaskManager } from "../../task/TaskManager";
import { Stopwatch } from "../../../util/Stopwatch";
import { TimerRepository } from "../../../util/timers/TimerRepository";
import { RegionManager } from "../../collision/RegionManager";
import { Misc } from "../../../util/Misc";
import { Boundary } from "../../model/Boundary";

class MobileTask extends Task {
    constructor(ticks: number, private readonly execFunc: Function) {
        super(ticks, false);
    }
    execute(): void {
        this.execFunc();
        this.stop()
    }

}

export abstract class Mobile extends Entity {
    private index: number;
    public lastKnownRegion: Location;
    private timers = new TimerRepository();
    private combat = new Combat(this);
    private movementQueue = new MovementQueue(this);
    public forcedChat: string;
    public walkingDirection: Direction = Direction.NONE;
    public runningDirection: Direction = Direction.NONE;
    private lastCombat = new Stopwatch();
    public updateFlag = new UpdateFlag();
    public positionToFace: Location;
    public animation: Animation;
    public graphic: Graphic;
    private following: Mobile;

    private attributes = new Map<Object, Object>();

    public getAttribute(name: Object) {
        return this.attributes.get(name);
    }
    setAttribute(name: any, object: any) {
        this.attributes.set(name, object);
    }
    /*
     * Fields
     */
    interactingMobile: any;
    combatFollowing: any;
    npcTransformationId = -1;
    poisonDamage: number;
    prayerActive = new Array<boolean>(30);
    curseActive = new Array<boolean>(20);
    resetMovementQueue = false;
    needsPlacement = false;
    untargetable = false;
    hasVengeance = false;
    specialPercentage = 100;
    specialActivated = false;
    recoveringSpecialAttack = false;
    isTeleporting = false;
    primaryHit: any;
    secondaryHit: any;

    private registred: boolean

    constructor(position: Location) {
        super(position);
    }

    public abstract onAdd(): void;

    public abstract onRemove(): void;

    public abstract manipulateHit(hit: PendingHit): PendingHit;

    /**
     * Teleports the character to a target location
     *
     * @param teleportTarget
     * @return
     */
    public moveTo(teleportTarget: Location): Mobile {
        this.getMovementQueue().reset();
        this.setLocation(teleportTarget.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player) {
            this.getMovementQueue().handleRegionChange();
        }
        return this;
    }

    smartMove(location: Location, radius: number): Mobile {
        let chosen: Location | null = null;
        let requestedX: number = location.x;
        let requestedY: number = location.y;
        let height: number = location.z;

        while (true) {
            let randomX: number = Misc.random(requestedX - radius, requestedX + radius);
            let randomY: number = Misc.random(requestedY - radius, requestedY + radius);
            let randomLocation: Location = new Location(randomX, randomY, height);

            if (!RegionManager.blocked(randomLocation, null)) {
                chosen = randomLocation;
                break;
            }
        }

        this.getMovementQueue().reset();
        this.setLocation(chosen.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player) {
            this.movementQueue.handleRegionChange();
        }

        return this;
    }

    public smartMoves(bounds: Boundary): Mobile {
        let chosen: Location | null = null;
        const height = bounds.height;
        while (true) {
            const randomX = Misc.random(bounds.getX(), bounds.getX2());
            const randomY = Misc.random(bounds.getY(), bounds.getY2());
            const randomLocation = new Location(randomX, randomY, height);
            if (!RegionManager.blocked(randomLocation, null)) {
                chosen = randomLocation;
                break;
            }
        }
        this.getMovementQueue().reset();
        this.setLocation(chosen.clone());
        this.setNeedsPlacement(true);
        this.setResetMovementQueue(true);
        this.setMobileInteraction(null);
        if (this instanceof Player) {
            this.getMovementQueue().handleRegionChange();
        }
        return this;
    }

    /**
     * Resets all flags related to updating.
     */
    resetUpdating() {
        this.getUpdateFlag().reset();
        this.walkingDirection = Direction.NONE;
        this.runningDirection = Direction.NONE;
        this.needsPlacement = false;
        this.resetMovementQueue = false;
        this.forcedChat = null;
        this.interactingMobile = null;
        this.positionToFace = null;
        this.animation = null;
        this.graphic = null;
    }

    forceChat(message: string): Mobile {
        this.setForcedChat(message);
        this.getUpdateFlag().flag(Flag.FORCED_CHAT);
        return this;
    }

    setMobileInteraction(mobile: Mobile | null): Mobile {
        this.interactingMobile = mobile;
        this.getUpdateFlag().flag(Flag.ENTITY_INTERACTION);
        return this;
    }

    performAnimation(animation: Animation) {
        if (this.animation != null && animation != null) {
            if (this.animation.getPriority() > animation.getPriority()) {
                return;
            }
        }
    }

    performGraphic(graphic: Graphic) {
        if (this.graphic != null && graphic != null) {
            if (this.graphic.getPriority() > graphic.getPriority()) {
                return;
            }
        }

        this.graphic = graphic;
        this.getUpdateFlag().flag(Flag.GRAPHIC);
    }

    delayedAnimation(animation: Animation, ticks: number) {
        TaskManager.submit(new MobileTask(ticks, () => {
            this.performAnimation(animation);
        }));
    }

    delayedGraphic(graphic: Graphic, ticks: number) {
        TaskManager.submit(new MobileTask(ticks, () => { this.performGraphic(graphic) }));
    }

    boundaryTiles(): Location[] {
        const size: number = this.getSize();
        const tiles: Location[] = new Array(size * size);
        let index = 0;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                tiles[index++] = this.getLocation().transform(x, y);
            }
        }
        return tiles;
    }

    outterTiles(): Location[] {
        const size = this.getSize();
        const tiles: Location[] = new Array(size * 4);
        let index = 0;
        for (let x = 0; x < size; x++) {
            tiles[index++] = this.getLocation().transform(x, -1);
            tiles[index++] = this.getLocation().transform(x, size);
        }
        for (let y = 0; y < size; y++) {
            tiles[index++] = this.getLocation().transform(-1, y);
            tiles[index++] = this.getLocation().transform(size, y);
        }
        return tiles;
    }

    tiles(): Location[] {
        const size = this.getSize();
        const tiles: Location[] = new Array(size * size);
        let index = 0;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                tiles[index++] = this.getLocation().transform(x, y);
            }
        }
        return tiles;
    }

    calculateDistance(to: Mobile): number {
        const tiles = this.tiles();
        const otherTiles = to.tiles();
        return Location.calculateDistance(tiles, otherTiles);
    }

    useProjectileClipping(): boolean {
        return true;
    }

    public abstract appendDeath(): void;

    public heal(damage: number): void { };

    public getHitpointsAfterPendingDamage(): number {
        return this.getHitpoints() - this.getCombat().getHitQueue().getAccumulatedDamage();
    }

    public abstract getHitpoints(): number;

    public abstract setHitpoints(hitpoints: number): Mobile;

    public abstract getBaseAttack(type: CombatType): number;

    public abstract getBaseDefence(type: CombatType): number;

    public abstract getBaseAttackSpeed(): number;

    public abstract getAttackAnim(): number;

    public abstract getAttackSound(): Sound;

    public abstract getBlockAnim(): number;

    /*
     * Getters and setters Also contains methods.
     */

    isTeleportingReturn(): boolean {
        return this.isTeleporting;
    }

    setTeleporting(isTeleporting: boolean) {
        this.isTeleporting = isTeleporting;
    }

    getGraphic(): Graphic {
        return this.graphic;
    }

    getAnimation(): Animation {
        return this.animation;
    }

    /**
     * @return the lastCombat
     */
    getLastCombat(): Stopwatch {
        return this.lastCombat;
    }

    getPoisonDamage(): number {
        return this.poisonDamage;
    }

    setPoisonDamage(poisonDamage: number) {
        this.poisonDamage = poisonDamage;
    }
    isPoisoned(): boolean {
        return this.poisonDamage > 0;
    }

    getPositionToFace(): Location {
        return this.positionToFace;
    }

    setPositionToFace(positionToFace: Location): Mobile {
        this.positionToFace = positionToFace;
        this.getUpdateFlag().flag(Flag.FACE_POSITION);
        return this;
    }

    getUpdateFlag(): UpdateFlag {
        return this.updateFlag;
    }

    getMovementQueue(): MovementQueue {
        return this.movementQueue;
    }

    getCombat(): Combat {
        return this.combat;
    }

    getInteractingMobile(): Mobile {
        return this.interactingMobile;
    }

    setDirection(direction: Direction) {
        this.setPositionToFace(this.getLocation().clone().add(direction.getX(), direction.getY()));
    }

    getForcedChat(): string {
        return this.forcedChat;
    }

    setForcedChat(forcedChat: string): Mobile {
        this.forcedChat = forcedChat;
        return this;
    }

    getPrayerActive(): boolean[] {
        return this.prayerActive;
    }
    setPrayerActives(prayerActive: boolean[]): Mobile {
        this.prayerActive = prayerActive;
        return this;
    }

    getCurseActive(): boolean[] {
        return this.curseActive;
    }

    setCurseActive(curseActive: boolean[]): Mobile {
        this.curseActive = curseActive;
        return this;
    }

    setPrayerActive(id: number, prayerActive: boolean): Mobile {
        this.prayerActive[id] = prayerActive;
        return this;
    }

    setCurseActives(id: number, curseActive: boolean): Mobile {
        this.curseActive[id] = curseActive;
        return this;
    }

    getNpcTransformationId(): number {
        return this.npcTransformationId;
    }

    setNpcTransformationId(npcTransformationId: number): Mobile {
        this.npcTransformationId = npcTransformationId;
        this.getUpdateFlag().flag(Flag.APPEARANCE);
        return this;
    }

    decrementHealth(hit: HitDamage): HitDamage {
        if (this.getHitpoints() <= 0) {
            hit.setDamage(0);
            return hit;
        }
        if (hit.getDamage() > this.getHitpoints())
            hit.setDamage(this.getHitpoints());
        if (hit.getDamage() < 0)
            hit.setDamage(0);
        let outcome = this.getHitpoints() - hit.getDamage();
        if (outcome < 0)
            outcome = 0;
        this.setHitpoints(outcome);
        return hit;
    }
    getPrimaryHit(): HitDamage {
        return this.primaryHit;
    }

    setPrimaryHit(hit: HitDamage): void {
        this.primaryHit = hit;
    }

    getSecondaryHit(): HitDamage {
        return this.secondaryHit;
    }

    setSecondaryHit(hit: HitDamage): void {
        this.secondaryHit = hit;
    }

    getWalkingDirection(): Direction {
        return this.walkingDirection;
    }

    setWalkingDirection(walkDirection: Direction): void {
        this.walkingDirection = walkDirection;
    }

    getRunningDirection(): Direction {
        return this.runningDirection;
    }

    setRunningDirection(runDirection: Direction): void {
        this.runningDirection = runDirection;
    }
    isResetMovementQueue(): boolean {
        return this.resetMovementQueue;
    }

    setResetMovementQueue(resetMovementQueue: boolean): void {
        this.resetMovementQueue = resetMovementQueue;
    }

    isRegistered(): boolean {
        return this.registred;
    }

    setRegistered(registered: boolean): void {
        this.registred = registered;
    }

    isNeedsPlacement(): boolean {
        return this.needsPlacement;
    }

    setNeedsPlacement(needsPlacement: boolean): void {
        this.needsPlacement = needsPlacement;
    }

    public hasVengeanceReturn(): boolean {
        return this.hasVengeance;
    }
    setHasVengeance(hasVengeance: boolean): void {
        this.hasVengeance = hasVengeance;
    }

    isSpecialActivated(): boolean {
        return this.specialActivated;
    }

    setSpecialActivated(specialActivated: boolean): void {
        this.specialActivated = specialActivated;
    }

    getSpecialPercentage(): number {
        return this.specialPercentage;
    }

    setSpecialPercentage(specialPercentage: number): void {
        this.specialPercentage = specialPercentage;
    }

    decrementSpecialPercentage(drainAmount: number): void {
        this.specialPercentage -= drainAmount;

        if (this.specialPercentage < 0) {
            this.specialPercentage = 0;
        }
    }

    incrementSpecialPercentage(gainAmount: number): void {
        this.specialPercentage += gainAmount;

        if (this.specialPercentage > 100) {
            this.specialPercentage = 100;
        }
    }

    isRecoveringSpecialAttack(): boolean {
        return this.recoveringSpecialAttack;
    }

    setRecoveringSpecialAttack(recoveringSpecialAttack: boolean): void {
        this.recoveringSpecialAttack = recoveringSpecialAttack;
    }

    isUntargetable(): boolean {
        return this.untargetable;
    }

    setUntargetable(untargetable: boolean): void {
        this.untargetable = untargetable;
    }

    inDungeon(): boolean {
        return false;
    }

    getFollowing(): Mobile {
        return this.following;
    }

    setFollowing(following: Mobile): void {
        this.following = following;
    }

    getCombatFollowing(): Mobile {
        return this.combatFollowing;
    }

    setCombatFollowing(target: Mobile): void {
        this.combatFollowing = target;
    }

    getIndex(): number {
        return this.index;
    }

    setIndex(index: number): Mobile {
        this.index = index;
        return this;
    }

    getLastKnownRegion(): Location {
        return this.lastKnownRegion;
    }

    setLastKnownRegion(lastKnownRegion: Location): Mobile {
        this.lastKnownRegion = lastKnownRegion;
        return this;
    }

    getTimers(): TimerRepository {
        return this.timers;
    }

    isPlayer(): boolean {
        return (this instanceof Player);
    }

    isPlayerBot(): boolean {
        return (this instanceof PlayerBot);
    }

    isNpc(): boolean {
        return (this instanceof NPC);
    }

    getAsPlayer(): Player | null {
        if (!this.isPlayer()) {
            return null;
        }
        return (this as unknown as Player);
    }

    getAsPlayerBot(): PlayerBot | null {
        if (!this.isPlayerBot()) {
            return null;
        }
        return (this as unknown as PlayerBot);
    }

    getAsNpc(): NPC | null {
        if (!this.isNpc()) {
            return null;
        }
        return (this as unknown as NPC);
    }

    sendMessage(message: string): void {
        if (!this.isPlayer() || this.isPlayerBot()) {
            return;
        }

        this.getAsPlayer()?.getPacketSender()?.sendMessage(message);
    }
}