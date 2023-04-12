import { GameConstants } from "../../../GameConstants";
import { Sound } from "../../../Sound";
import { World } from "../../../World";
import { PrayerData, PrayerHandler } from "../../../content/PrayerHandler";
import { ClanChat } from "../../../content/clan/ClanChat";
import { ClanChatManager } from "../../../content/clan/ClanChatManager";
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { CombatSpecial } from "../../../content/combat/CombatSpecial";
import { CombatType } from "../../../content/combat/CombatType";
import { FightType } from "../../../content/combat/FightType";
import { WeaponInterfaces } from "../../../content/combat/WeaponInterfaces";
import { BountyHunter } from "../../../content/combat/bountyhunter/BountyHunter"
import { PendingHit } from "../../../content/combat/hit/PendingHit";
import { Autocasting } from "../../../content/combat/magic/Autocasting";
import { Barrows, Brother } from "../../../content/minigames/impl/Barrows"
import { Presetable } from "../../../content/presets/Presetable";
import { Presetables } from "../../../content/presets/Presetables";
import { SkillManager } from "../../../content/skill/SkillManager";
import { Skillable } from "../../../content/skill/skillable/Skillable";
import { ActiveSlayerTask } from "../../../content/skill/slayer/ActiveSlayerTask"
import { ItemDefinition } from "../../../definition/ItemDefinition";
import { PlayerBotDefinition } from "../../../definition/PlayerBotDefinition";
import { Mobile } from "../Mobile";
import { NPC } from "../npc/NPC";
import { NpcAggression } from "../npc/NpcAggression";
import { PlayerBot } from "../playerbot/PlayerBot";
import { Animation } from "../../../model/Animation";
import { Appearance } from "../../../model/Appearance";
import { ChatMessage } from "../../../model/ChatMessage";
import { EnteredAmountAction } from "../../../model/EnteredAmountAction";
import { EnteredSyntaxAction } from "../../../model/EnteredSyntaxAction";
import { Flag } from "../../../model/Flag";
import { ForceMovement } from "../../../model/ForceMovement";
import { God } from "../../../model/God";
import { Location } from "../../../model/Location";
import { PlayerInteractingOption, PlayerInteractingOptions } from "../../../model/PlayerInteractingOption";
import { PlayerRelations } from "../../../model/PlayerRelations";
import { PlayerStatus } from "../../../model/PlayerStatus";
import { SecondsTimer } from "../../../model/SecondsTimer";
import { Skill } from "../../../model/Skill";
import { AreaManager } from "../../../model/areas/AreaManager";
import { Bank } from "../../../model/container/impl/Bank";
import { Equipment } from "../../../model/container/impl/Equipment";
import { Inventory } from "../../../model/container/impl/Inventory";
import { PriceChecker } from "../../../model/container/impl/PriceChecker"
import { Shop } from "../../../model/container/shop/Shop";
import { DialogueManager } from "../../../model/dialogues/DialogueManager"
import { BonusManager } from "../../../model/equipment/BonusManager";
import { CreationMenu } from "../../../model/menu/CreationMenu"
import { MovementQueue } from "../../../model/movement/MovementQueue";
import { DonatorRights } from "../../../model/rights/DonatorRights"
import { PlayerRights } from "../../../model/rights/PlayerRights";
import { TeleportButton } from "../../../model/teleportation/TeleportButton"
import { TaskManager } from "../../../task/TaskManager";
import { CombatPoisonEffect } from "../../../task/impl/CombatPoisonEffect";
import { PlayerDeathTask } from "../../../task/impl/PlayerDeath"
import { RestoreSpecialAttackTask } from "../../../task/impl/RestoreSpecialAttackTask"
import { PlayerSession } from "../../../../net/PlayerSession"
import { ChannelEventHandler } from "../../../../net/channel/ChannelEventHandler";
import { PacketSender } from "../../../../net/packet/PacketSender"
import { FrameUpdater } from "../../../../util/FrameUpdater"
import { Misc } from "../../../../util/Misc";
import { NpcIdentifiers } from "../../../../util/NpcIdentifiers";
import { Stopwatch } from "../../../../util/Stopwatch";
import { TimerKey } from "../../../../util/timers/TimerKey";
import { Trading } from "../../../content/Trading";
import { Dueling } from "../../../content/Duelling";
import { QuickPrayers } from "../../../content/QuickPrayers";
import { MagicSpellbook } from "../../../model/MagicSpellbook";
import { PouchContainer, Pouch } from "../../../content/skill/skillable/impl/Runecrafting";
import { SkullType } from "../../../model/SkullType";
import { EffectTimer } from "../../../model/EffectTimer";
import { PetHandler } from "../../../content/PetHandler";
import { Task } from "../../../task/Task";

export class Player extends Mobile {
    getSize(): number {
        return 1;
    }
    public increaseStats = new SecondsTimer();
    public decreaseStats = new SecondsTimer();
    private localPlayers: Player[] = [];
    private localNpcs: NPC[] = [];
    public packetSender = new PacketSender(this);
    public appearance = new Appearance(this);
    public skillManager = new SkillManager(this);
    public relations = new PlayerRelations(this);
    private frameUpdater = new FrameUpdater();
    private bonusManager = new BonusManager();
    public quickPrayers = new QuickPrayers(this);
    public inventory = new Inventory(this);
    public equipment = new Equipment(this);
    private priceChecker = new PriceChecker(this);
    private clickDelay = new Stopwatch();
    private lastItemPickup = new Stopwatch();
    private yellDelay = new SecondsTimer();
    private aggressionTolerance = new SecondsTimer();
    // Delay for restoring special attack
    private specialAttackRestore = new SecondsTimer();
    /*
    * Fields
    */
    private vengeTimer: SecondsTimer = new SecondsTimer();
    private targetSearchTimer = new SecondsTimer();
    public recentKills: string[] = []; // Contains ip addresses of recent kills
    private chatMessageQueue = new Array<ChatMessage>();
    public currentChatMessage: ChatMessage;
    // Logout
    public forcedLogoutTimer = new SecondsTimer();
    // Trading
    private trading = new Trading(this);
    private dueling = new Dueling(this);
    public dialogueManager = new DialogueManager(this);
    // Presets
    private currentPreset: Presetable;
    public presets: Presetable[] = new Array(Presetables.MAX_PRESETS);
    private openPresetsOnDeath = true;

    public username: string;
    private passwordHashWithSalt: string;
    private hostAddress: string;
    private isDiscordLogin
    private cachedDiscordAccessToken: string;
    public longUsername: number;
    private session: PlayerSession;
    private playerInteractingOption: PlayerInteractingOption;
    public status: PlayerStatus = PlayerStatus.NONE;
    public currentClanChat: ClanChat;
    public clanChatName: string;
    public shop: Shop;
    public interfaceId: number = -1
    private walkableInterfaceId: number = -1
    private multiIcon: number;
    private isRunning = true;
    private runEnergy = 100;
    private lastRunRecovery = new Stopwatch();
    private isDying: boolean;
    private allowRegionChangePacket: boolean;
    public experienceLocked: boolean;
    public forceMovement: ForceMovement;
    private currentPet: NPC;
    private skillAnimation: number;
    private drainingPrayer: boolean;
    private prayerPointDrain: number;
    private spellbook: MagicSpellbook;
    private previousTeleports = new Map<TeleportButton, Location>();
    private teleportInterfaceOpen: boolean;
    private destroyItem = -1;
    private updateInventory: boolean; // Updates inventory on next tick
    private newPlayer: boolean;
    private packetsBlocked = false;
    private regionHeight: number;

    public questPoints: number;
    public questProgress = new Map<number, number>();
    // Skilling
    private skill: Skillable;
    private creationMenu: CreationMenu;
    // Entering data
    public enteredAmountAction: EnteredAmountAction;
    private enteredSyntaxAction: EnteredSyntaxAction;

    // Time the account was created
    private creationDate = new Date();
    // RC
    public pouches: PouchContainer[] = [new PouchContainer(Pouch.SMALL_POUCH),
    new PouchContainer(Pouch.MEDIUM_POUCH), new PouchContainer(Pouch.LARGE_POUCH),
    new PouchContainer(Pouch.GIANT_POUCH)];
    // Slayer
    private slayerTask: ActiveSlayerTask;
    private slayerPoints: number;
    private consecutiveTasks: number;

    // Combat
    public skullType: SkullType;
    public combatSpecial: CombatSpecial;
    private recoilDamage: number;
    private vengeanceTimer = new SecondsTimer();
    private wildernessLevel: number;
    public skullTimer: number;
    public points: number;
    private amountDonated: number;
    // Blowpipe
    public blowpipeScales: number;
    // Bounty hunter
    public targetKills: number;
    public normalKills: number;
    public totalKills: number;
    public killstreak: number;
    public highestKillstreak: number;
    public deaths: number;
    private safeTimer = 180;
    public pcPoints: number;
    // Barrows
    public barrowsCrypt: number;
    public barrowsChestsLooted: number;
    public killedBrothers: boolean[] = Array(Brother.length).fill(false);
    private currentBrother: NPC;
    private preserveUnlocked: boolean;
    private rigourUnlocked: boolean;
    private auguryUnlocked: boolean;
    private targetTeleportUnlocked: boolean;
    // Banking
    public currentBankTab: number;
    public banks: Bank[] = Array(Bank.TOTAL_BANK_TABS).fill(null); // last index is for bank searches
    private noteWithdrawal: boolean;
    private insertMode: boolean;
    private searchingBank: boolean;
    private searchSyntax = "";
    private placeholders = true;
    private infiniteHealth: boolean;
    private fightType = FightType.UNARMED_KICK;
    public weapon: WeaponInterfaces;
    private autoRetaliate = true;

    // GWD
    public godwarsKillcount: number[] = Array(Object.keys(God).length / 2).fill(0);

    // Rights
    public rights = PlayerRights.NONE;
    public donatorRights = DonatorRights.NONE;
    /**
     * The cached player update block for updating.
     */
    private cachedUpdateBlock: Buffer;
    private loyaltyTitle = "empty";
    private spawnedBarrows: boolean;
    private oldPosition: Location;
    public id: number;
    public name: string;

    /**
     * Creates this player with pre defined spawn location.
     *
     * @param playerIO
     */
    constructor(playerIO: PlayerSession, spawnLocation?: Location) {
        super(spawnLocation ?? GameConstants.DEFAULT_LOCATION.clone());
        this.session = playerIO;
    }


    public onAdd() {
        this.onLogin();
    }

    resetAttributes() {
        this.performAnimation(new Animation(65535));
        this.setSpecialActivated(false);
        CombatSpecial.updateBar(this);
        this.setHasVengeance(false);
        this.getCombat().getFireImmunityTimer().stop();
        this.getCombat().getPoisonImmunityTimer().stop();
        this.getCombat().getTeleblockTimer().stop();
        this.getTimers().cancel(TimerKey.FREEZE);
        this.getCombat().getPrayerBlockTimer().stop();
        this.setPoisonDamage(0);
        this.setWildernessLevel(0);
        this.setRecoilDamage(0);
        this.setSkullTimer(0);
        this.setSkullType(SkullType.WHITE_SKULL);
        WeaponInterfaces.assign(this);
        BonusManager.update(this);
        PrayerHandler.deactivatePrayers(this);
        this.getEquipment().refreshItems();
        this.getInventory().refreshItems();
        for (let skill of Object.values(Skill))
            this.getSkillManager().setCurrentLevels(skill, this.getSkillManager().getMaxLevel(skill));
        this.setRunEnergy(100);
        this.getPacketSender().sendRunEnergy();
        this.getMovementQueue().setBlockMovement(false).reset();
        this.getPacketSender().sendEffectTimer(0, EffectTimer.ANTIFIRE).sendEffectTimer(0, EffectTimer.FREEZE)
            .sendEffectTimer(0, EffectTimer.VENGEANCE).sendEffectTimer(0, EffectTimer.TELE_BLOCK);
        this.getPacketSender().sendPoisonType(0);
        this.getPacketSender().sendSpecialAttackState(false);
        this.setUntargetable(false);
        this.isDying = false;

        this.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    /**
     * Actions that should be done when this character is removed from the world.
     */
    public onRemove() {
        this.onLogout();
    }

    public appendDeath() {
        if (!this.isDying) {
            TaskManager.submit(new PlayerDeathTask(this));
            this.isDying = true;
        }
    }

    public getHitpoints(): number {
        return this.getSkillManager().getCurrentLevel(Skill.HITPOINTS);
    }


    public getAttackAnim(): number {
        return FightType.getAnimation();
    }

    public getAttackSound(): Sound {
        return FightType.getAttackSound();
    }

    public getBlockAnim(): number {
        let shield = this.getEquipment().getItems()[Equipment.SHIELD_SLOT];
        let weapon = this.getEquipment().getItems()[Equipment.WEAPON_SLOT];
        let definition: ItemDefinition = shield.getId() > 0 ? shield.getDefinition() : weapon.getDefinition();
        return definition.getBlockAnim();
    }

    public setHitpoints(hitpoints: number): Mobile {
        if (this.isDying) {
            return this;
        }

        if (this.infiniteHealth) {
            if (this.getSkillManager().getCurrentLevel(Skill.HITPOINTS) > hitpoints) {
                return this;
            }
        }

        this.getSkillManager().setCurrentLevels(Skill.HITPOINTS, hitpoints);
        this.getPacketSender().sendSkill(Skill.HITPOINTS);
        if (this.getHitpoints() <= 0 && !this.isDying)
            this.appendDeath();
        return this;
    }
    public heal(amount: number) {
        let level = this.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        if ((this.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + amount) >= level) {
            this.setHitpoints(level);
        } else {
            this.setHitpoints(this.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + amount);
        }
    }


    public getBaseAttack(type: CombatType): number {
        if (type == CombatType.RANGED)
            return this.getSkillManager().getCurrentLevel(Skill.RANGED);
        else if (type == CombatType.MAGIC)
            return this.getSkillManager().getCurrentLevel(Skill.MAGIC);
        return this.getSkillManager().getCurrentLevel(Skill.ATTACK);
    }

    public getBaseDefence(type: CombatType): number {
        if (type == CombatType.MAGIC)
            return this.getSkillManager().getCurrentLevel(Skill.MAGIC);
        return this.getSkillManager().getCurrentLevel(Skill.DEFENCE);
    }

    public getBaseAttackSpeed(): number {

        // Gets attack speed for player's weapon
        // If player is using magic, attack speed is
        // Calculated in the MagicCombatMethod class.

        let speed = this.getWeapon().getSpeed();

        if (this.getFightType().toString().toLowerCase().includes("rapid")) {
            speed--;
        }

        return speed;
    }

    public isPlayer(): boolean {
        return true;
    }

    public equals(o: Object): boolean {
        if (!(o instanceof Player)) {
            return false;
        }
        let p = o as Player;
        return p.getUsername() == this.username;
    }

    public size(): number {
        return 1;
    }

    public process() {
        // Timers
        this.getTimers().process();

        // Process incoming packets...
        let session = this.getSession();
        if (session != null) {
            session.processPackets();
        }

        // Process walking queue..
        this.getMovementQueue().process();

        // Process combat
        this.getCombat().process();

        // Process aggression
        NpcAggression.process(this);

        // Process areas..
        AreaManager.process(this);

        // Process Bounty Hunter
        BountyHunter.process(this);

        // Updates inventory if an update
        // has been requested
        if (this.isUpdateInventory()) {
            this.getInventory().refreshItems();
            this.setUpdateInventory(false);
        }

        // Updates appearance if an update
        // has been requested
        // or if skull timer hits 0.
        if (this.isSkulled() && this.getAndDecrementSkullTimer() == 0) {
            this.getUpdateFlag().flag(Flag.APPEARANCE);
        }

        // Send queued chat messages
        if (this.getChatMessageQueue().length > 0) {
            this.setCurrentChatMessage(this.getChatMessageQueue().shift());
            this.getUpdateFlag().flag(Flag.CHAT);
        } else {
            this.setCurrentChatMessage(null);
        }

        // Increase run energy
        if (this.runEnergy < 100 && (!this.getMovementQueue().isMovings() || !this.isRunning)) {
            if (this.lastRunRecovery.elapsedTime(MovementQueue.runEnergyRestoreDelay(this))) {
                this.runEnergy++;
                this.getPacketSender().sendRunEnergy();
                this.lastRunRecovery.reset();
            }
        }

        if (this instanceof PlayerBot) {
            (this as PlayerBot).getMovementInteraction().process();
        }
        // Decrease boosted stats Increase lowered stats
        if (this.getHitpoints() > 0) {
            if (this.increaseStats.finished() || this.decreaseStats.secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60)) {
                for (let skill of Object.values(Skill)) {
                    let current = this.getSkillManager().getCurrentLevel(skill);
                    let max = this.getSkillManager().getMaxLevel(skill);

                    // Should lowered stats be increased?
                    if (current < max) {
                        if (this.increaseStats.finished()) {
                            let restoreRate = 1;

                            // Rapid restore effect - 2x restore rate for all stats except hp/prayer
                            // Rapid heal - 2x restore rate for hitpoints
                            if (skill != Skill.HITPOINTS && skill != Skill.PRAYER) {
                                if (PrayerHandler.isActivated(this, PrayerHandler.RAPID_RESTORE)) {
                                    restoreRate = 2;
                                }
                            } else if (skill == Skill.HITPOINTS) {
                                if (PrayerHandler.isActivated(this, PrayerHandler.RAPID_HEAL)) {
                                    restoreRate = 2;
                                }
                            }

                            this.getSkillManager().increaseCurrentLevel(skill, restoreRate, max);
                        }
                    } else if (current > max) {

                        // Should boosted stats be decreased?
                        if (this.decreaseStats.secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60)) {

                            // Never decrease Hitpoints / Prayer
                            if (skill != Skill.HITPOINTS && skill != Skill.PRAYER) {
                                this.getSkillManager().decreaseCurrentLevel(skill, 1, 1);
                            }

                        }
                    }
                }
                // Reset timers
                if (this.increaseStats.finished()) {
                    this.increaseStats.start(60);
                }
                if (this.decreaseStats
                    .secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60)) {
                    this.decreaseStats.start((PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60));
                }
            }
        }
    }

    // Construction
    /*
     
    public loadingHouse: boolean; public portalSelected: number; public inBuildingMode: boolean; public toConsCoords: number[]; public buildFurnitureId: number; public buildFurnitureX: number; public buildFurnitureY: number; public houseRooms: Room[][][] = new Array(5).fill(new Array(13).fill(new Array(13).fill(new Room()))); public playerFurniture: PlayerFurniture[] = []; public portals: Portal[] = [];
    */
    /**
     
    Can the player logout?
    @returns Yes if they can logout, false otherwise.
    */
    canLogout(): boolean {
        if (CombatFactory.isBeingAttacked(this)) {
            this.getPacketSender().sendMessage("You must wait a few seconds after being out of combat before doing this.");
            return false;
        }
        if (this.busy()) {
            this.getPacketSender().sendMessage("You cannot log out at the moment.");
            return false;
        }
        return true;
    }
    /**
     
    Requests a logout by sending the logout packet to the client. This leads to
    the connection being closed. The {@link ChannelEventHandler} will then add
    the player to the remove characters queue.
    */
    requestLogout() {
        this.getPacketSender().sendLogout();
    }

    onLogout() {
        // Notify us
        console.log("[World] Deregistering player - [username, host] : [" + this.getUsername() + ", " + this.getHostAddress() + "]");

        this.getPacketSender().sendInterfaceRemoval();

        // Leave area
        if (this.getArea() != null) {
            this.getArea().leave(this, true);
        }

        // Do stuff...
        Barrows.brotherDespawn(this);
        PetHandler.pickup(this, this.getCurrentPet());
        this.getRelations().updateLists(false);
        BountyHunter.unassign(this);
        ClanChatManager.leave(this, false);
        TaskManager.cancelTasks(this);
        GameConstants.PLAYER_PERSISTENCE.save(this);

        if (this.getSession() != null && this.getSession().getChannel().isOpen()) {
            this.getSession().getChannel().close();
        }
    }

    /**
     
    Called by the world's login queue!
    */
    public onLogin() {
        // Attempt to register the player..
        console.log("[World] Registering player - [username, host] : [" + this.getUsername() + ", " + this.getHostAddress() + "]");

        this.setNeedsPlacement(true);
        this.getPacketSender().sendMapRegion().sendDetails(); // Map region, player index and player rights
        this.getPacketSender().sendTabs(); // Client sideicons
        this.getPacketSender().sendMessage("Welcome to " + GameConstants.NAME + ".");
        if (this.isDiscordLogin()) {
            this.getPacketSender().sendMessage(":discordtoken:" + this.getCachedDiscordAccessToken());
        }

        let totalExp = 0;
        let skill: Skill;
        for (const skill of Object.values(Skill)) {
            this.getSkillManager().updateSkill(skill);
            totalExp += this.getSkillManager().getExperience(skill);
        }
        this.getPacketSender().sendTotalExp(totalExp);

        // Send friends and ignored players lists...
        this.getRelations().setPrivateMessageId(1).onLogin(this).updateLists(true);

        // Reset prayer configs...
        PrayerHandler.resetAll(this);
        this.getPacketSender().sendConfig(709, PrayerHandler.canUse(this, PrayerData.PRESERVE, false) ? 1 : 0);
        this.getPacketSender().sendConfig(711, PrayerHandler.canUse(this, PrayerData.RIGOUR, false) ? 1 : 0);
        this.getPacketSender().sendConfig(713, PrayerHandler.canUse(this, PrayerData.AUGURY, false) ? 1 : 0);

        // Refresh item containers..
        this.getInventory().refreshItems();
        this.getEquipment().refreshItems();

        // Interaction options on right click...
        this.getPacketSender().sendInteractionOption("Follow", 3, false);
        this.getPacketSender().sendInteractionOption("Trade With", 4, false);

        // Sending run energy attributes...
        this.getPacketSender().sendRunStatus();
        this.getPacketSender().sendRunEnergy();

        // Sending player's rights..
        this.getPacketSender().sendRights();

        // Close all interfaces, just in case...
        this.getPacketSender().sendInterfaceRemoval();

        // Update weapon data and interfaces..
        WeaponInterfaces.assign(this);
        // Update weapon interface configs
        this.getPacketSender().sendConfig(FightType.getParentId(), FightType.getChildId())
            .sendConfig(172, this.autoRetaliateReturn() ? 1 : 0).updateSpecialAttackOrb();

        // Reset autocasting
        Autocasting.setAutocast(this, null);

        // Send pvp stats..
        this.getPacketSender().sendString("@or1@Killstreak: " + this.getKillstreak(), 52029)
            .sendString("@or1@Kills: " + this.getTotalKills(), 52030).sendString("@or1@Deaths: " + this.getDeaths(), 52031)
            .sendString("@or1@K/D Ratio: " + this.getKillDeathRatio(), 52033)
            .sendString("@or1@Donated: " + this.getAmountDonated(), 52034);

        // Join clanchat
        ClanChatManager.onLogin(this);

        // Handle timers and run tasks
        if (this.isPoisoned()) {
            this.getPacketSender().sendPoisonType(1);
            TaskManager.submit(new CombatPoisonEffect(this));
        }
        if (this.getSpecialPercentage() < 100) {
            TaskManager.submit(new RestoreSpecialAttackTask(this));
        }

        if (!this.getVengeanceTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getVengeanceTimer().secondsRemaining(), EffectTimer.VENGEANCE);
        }
        if (!this.getCombat().getFireImmunityTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getCombat().getFireImmunityTimer().secondsRemaining(),
                EffectTimer.ANTIFIRE);
        }
        if (!this.getCombat().getTeleblockTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getCombat().getTeleblockTimer().secondsRemaining(),
                EffectTimer.TELE_BLOCK);
        }

        this.decreaseStats.start(60);
        this.increaseStats.start(60);

        this.getUpdateFlag().flag(Flag.APPEARANCE);

        if (this.newPlayer) {
            let presetIndex = Misc.randomInclusive(0, Presetables.GLOBAL_PRESETS.length - 1);
            Presetables.load(this, Presetables.GLOBAL_PRESETS[presetIndex]);
        }

        if (!(this instanceof PlayerBot)) {
            let definition: PlayerBotDefinition
            // Spawn player bots when a real player logs in
            for (definition of GameConstants.PLAYER_BOTS) {
                if (World.getPlayerBots().has(definition.getUsername())) {
                    continue;
                }

                let playerBot = new PlayerBot(definition);

                World.getPlayerBots().set(definition.getUsername(), playerBot);
            }

            console.log(`${GameConstants.PLAYER_BOTS.length} player bots now online.`);
        }
    }


    busy(): boolean {
        if (this.interfaceId > 0) {
            return true;
        }
        if (this.getHitpoints() <= 0) {
            return true;
        }
        if (this.isNeedsPlacement() || this.isTeleportingReturn()) {
            return true;
        }
        if (this.status != PlayerStatus.NONE) {
            return true;
        }
        if (this.forceMovement != null) {
            return true;
        }
        return false;
    }

    isStaff(): boolean {
        return this.rights !== PlayerRights.NONE;
    }

    isDonator(): boolean {
        return (this.donatorRights != DonatorRights.NONE);
    }


    isPacketsBlocked(): boolean {
        return this.packetsBlocked;
    }

    setPacketsBlocked(blocked: boolean) {
        this.packetsBlocked = blocked;
    }
    /*
         * Getters/Setters
         */
    public static Data = new Date();

    public getCreationDate(): Date {
        return this.creationDate;
    }

    public setCreationDate(timestamp: Date) {
        this.creationDate = timestamp;
    }

    public getSession(): PlayerSession {
        return this.session;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): Player {
        this.username = username;
        return this;
    }

    public getLongUsername(): number {
        return this.longUsername;
    }

    public setLongUsername(longUsername: number): Player {
        this.longUsername = longUsername;
        return this;
    }

    public castlewarsKills: number;
    castlewarsDeaths: number;
    castlewarsIdleTime: number;

    public resetCastlewarsIdleTime(): void {
		this.castlewarsIdleTime = 200;
	}

    public getPasswordHashWithSalt(): string {
        return this.passwordHashWithSalt;
    }

    public setPasswordHashWithSalt(passwordHashWithSalt: string): Player {
        this.passwordHashWithSalt = passwordHashWithSalt;
        return this;
    }
    public getHostAddress(): string {
        return this.hostAddress;
    }

    public setHostAddress(hostAddress: string): this {
        this.hostAddress = hostAddress;
        return this;
    }

    public getRights(): PlayerRights {
        return this.rights;
    }

    public setRights(rights: PlayerRights): this {
        this.rights = rights;
        return this;
    }

    public getPacketSender(): PacketSender {
        return this.packetSender;
    }

    public getSkillManager(): SkillManager {
        return this.skillManager;
    }

    public getAppearance(): Appearance {
        return this.appearance;
    }

    public getForcedLogoutTimer(): SecondsTimer {
        return this.forcedLogoutTimer;
    }

    public isDyingReturn(): boolean {
        return this.isDying;
    }

    public getLocalPlayers(): Player[] {
        return this.localPlayers;
    }

    public getLocalNpcs(): NPC[] {
        return this.localNpcs;
    }
    public getInterfaceId(): number {
        return this.interfaceId;
    }

    public setInterfaceId(interfaceId: number): this {
        this.interfaceId = interfaceId;
        return this;
    }

    public experienceLockedReturn(): boolean {
        return this.experienceLocked;
    }

    public setExperienceLocked(experienceLocked: boolean) {
        this.experienceLocked = experienceLocked;
    }

    public getRelations(): PlayerRelations {
        return this.relations;
    }

    public isAllowRegionChangePacket(): boolean {
        return this.allowRegionChangePacket;
    }

    public setAllowRegionChangePacket(allowRegionChangePacket: boolean): void {
        this.allowRegionChangePacket = allowRegionChangePacket;
    }

    public getWalkableInterfaceId(): number {
        return this.walkableInterfaceId;
    }

    public setWalkableInterfaceId(interfaceId: number) {
        this.walkableInterfaceId = interfaceId;
    }

    public isRunningReturn(): boolean {
        return this.isRunning;
    }

    public setRunning(isRunning: boolean): this {
        this.isRunning = isRunning;
        return this;
    }

    public getPlayerInteractingOption(): PlayerInteractingOption {
        return this.playerInteractingOption;
    }

    public setPlayerInteractingOption(playerInteractingOption: PlayerInteractingOption): Player {
        this.playerInteractingOption = playerInteractingOption;
        return this;
    }

    public getFrameUpdater(): FrameUpdater {
        return this.frameUpdater;
    }

    public getBonusManager(): BonusManager {
        return this.bonusManager;
    }

    public getMultiIcon(): number {
        return this.multiIcon;
    }

    public setMultiIcon(multiIcon: number): Player {
        this.multiIcon = multiIcon;
        return this;
    }

    public getInventory(): Inventory {
        return this.inventory;
    }

    public getEquipment(): Equipment {
        return this.equipment;
    }

    public getForceMovement(): ForceMovement {
        return this.forceMovement;
    }

    public setForceMovement(forceMovement: ForceMovement): Player {
        this.forceMovement = forceMovement;
        if (this.forceMovement != null) {
            this.getUpdateFlag().flag(Flag.FORCED_MOVEMENT);
        }
        return this;
    }

    public getSkillAnimation(): number {
        return this.skillAnimation;
    }

    public setSkillAnimation(animation: number): Player {
        this.skillAnimation = animation;
        return this;
    }

    public getRunEnergy(): number {
        return this.runEnergy;
    }

    public setRunEnergy(runEnergy: number) {
        this.runEnergy = runEnergy;
    }

    public isDrainingPrayer(): boolean {
        return this.drainingPrayer;
    }

    public setDrainingPrayer(drainingPrayer: boolean) {
        this.drainingPrayer = drainingPrayer;
    }

    public getPrayerPointDrain(): number {
        return this.prayerPointDrain;
    }

    public setPrayerPointDrain(prayerPointDrain: number) {
        this.prayerPointDrain = prayerPointDrain;
    }

    public getLastItemPickup(): Stopwatch {
        return this.lastItemPickup;
    }

    public static getCombatSpecial(): CombatSpecial {
        return this.getCombatSpecial();
    }

    public setCombatSpecial(combatSpecial: CombatSpecial) {
        this.combatSpecial = combatSpecial;
    }

    public getRecoilDamage(): number {
        return this.recoilDamage;
    }

    public setRecoilDamage(recoilDamage: number) {
        this.recoilDamage = recoilDamage;
    }

    public getSpellbook() {
        return this.spellbook;
    }

    public setSpellbook(spellbook: MagicSpellbook) {
        this.spellbook = spellbook;
    }

    public getVengeanceTimer(): SecondsTimer {
        return this.vengeTimer;
    }

    public getWildernessLevel(): number {
        return this.wildernessLevel;
    }

    public setWildernessLevel(wildernessLevel: number) {
        this.wildernessLevel = wildernessLevel;
    }

    public isSpawnedBarrows(): boolean {
        return this.spawnedBarrows;
    }

    public setSpawnedBarrows(spawnedBarrows: boolean) {
        this.spawnedBarrows = spawnedBarrows;
    }

    public getDestroyItem(): number {
        return this.destroyItem;
    }

    public setDestroyItem(destroyItem: number) {
        this.destroyItem = destroyItem;
    }

    public isSkulled(): boolean {
        return this.skullTimer > 0;
    }

    public getAndDecrementSkullTimer(): number {
        return this.skullTimer--;
    }

    public getSkullTimer(): number {
        return this.skullTimer;
    }

    public setSkullTimer(skullTimer: number): void {
        this.skullTimer = skullTimer;
    }

    public getPoints(): number {
        return this.points;
    }

    public setPoints(points: number): void {
        this.points = points;
    }

    public incrementPoints(points: number): void {
        this.points += points;
    }

    public isUpdateInventory(): boolean {
        return this.updateInventory;
    }

    public setUpdateInventory(updateInventory: boolean): void {
        this.updateInventory = updateInventory;
    }

    public getClickDelay(): Stopwatch {
        return this.clickDelay;
    }

    public getShop(): Shop {
        return this.shop;
    }

    public setShop(shop: Shop): Player {
        this.shop = shop;
        return this;
    }

    public getStatus(): PlayerStatus {
        return this.status;
    }

    public setStatus(status: PlayerStatus): Player {
        this.status = status;
        return this;
    }

    public getCurrentBankTab(): number {
        return this.currentBankTab;
    }

    public setCurrentBankTab(tab: number): Player {
        this.currentBankTab = tab;
        return this;
    }

    public setNoteWithdrawal(noteWithdrawal: boolean): void {
        this.noteWithdrawal = noteWithdrawal;
    }

    public withdrawAsNote(): boolean {
        return this.noteWithdrawal;
    }

    public setInsertMode(insertMode: boolean): void {
        this.insertMode = insertMode;
    }

    public insertModeReturn(): boolean {
        return this.insertMode;
    }

    public getBanks(): Bank[] {
        return this.banks;
    }

    public getBank(index: number): Bank {
        if (this.banks[index] == null) {
            this.banks[index] = new Bank(this);
        }
        return this.banks[index];
    }

    public setBank(index: number, bank: Bank): Player {
        this.banks[index] = bank;
        return this;
    }

    public isNewPlayer(): boolean {
        return this.newPlayer;
    }

    public setNewPlayer(newPlayer: boolean): void {
        this.newPlayer = newPlayer;
    }

    public isSearchingBank(): boolean {
        return this.searchingBank;
    }

    public setSearchingBank(searchingBank: boolean): void {
        this.searchingBank = searchingBank;
    }

    public getSearchSyntax(): string {
        return this.searchSyntax;
    }

    public setSearchSyntax(searchSyntax: string): void {
        this.searchSyntax = searchSyntax;
    }

    public isPreserveUnlocked(): boolean {
        return this.preserveUnlocked;
    }

    public getPreserveUnlocked(): boolean {
        return this.preserveUnlocked;
    }

    public setPreserveUnlocked(preserveUnlocked: boolean): void {
        this.preserveUnlocked = preserveUnlocked;
    }

    public isRigourUnlocked(): boolean {
        return this.rigourUnlocked;
    }

    public getRigourUnlocked(): boolean {
        return this.rigourUnlocked;
    }

    public setRigourUnlocked(rigourUnlocked: boolean): void {
        this.rigourUnlocked = rigourUnlocked;
    }


    public getAuguryUnlocked(): boolean {
        return this.auguryUnlocked;
    }

    public setAuguryUnlocked(auguryUnlocked: boolean): void {
        this.auguryUnlocked = auguryUnlocked;
    }

    public getPriceChecker(): PriceChecker {
        return this.priceChecker;
    }

    public getCurrentClanChat(): ClanChat {
        return this.currentClanChat;
    }

    public setCurrentClanChat(currentClanChat: ClanChat): void {
        this.currentClanChat = currentClanChat;
    }

    public getClanChatName(): string {
        return this.clanChatName;
    }

    public setClanChatName(clanChatName: string): void {
        this.clanChatName = clanChatName;
    }

    public getTrading(): Trading {
        return this.trading;
    }

    public getQuickPrayers(): QuickPrayers {
        return this.quickPrayers;
    }

    public isTargetTeleportUnlocked(): boolean {
        return this.targetTeleportUnlocked;
    }


    public getTargetTeleportUnlocked(): boolean {
        return this.targetTeleportUnlocked;
    }

    public setTargetTeleportUnlocked(targetTeleportUnlocked: boolean): void {
        this.targetTeleportUnlocked = targetTeleportUnlocked;
    }

    public getYellDelay(): SecondsTimer {
        return this.yellDelay;
    }

    public getAmountDonated(): number {
        return this.amountDonated;
    }

    public setAmountDonated(amountDonated: number): void {
        this.amountDonated = amountDonated;
    }

    public incrementAmountDonated(amountDonated: number): void {
        this.amountDonated += amountDonated;
    }

    public incrementTargetKills(): void {
        this.targetKills++;
    }

    public getTargetKills(): number {
        return this.targetKills;
    }

    public setTargetKills(targetKills: number): void {
        this.targetKills = targetKills;
    }

    public incrementKills(): void {
        this.normalKills++;
    }

    public getNormalKills(): number {
        return this.normalKills;
    }

    public setNormalKills(normalKills: number): void {
        this.normalKills = normalKills;
    }

    public getTotalKills(): number {
        return this.totalKills;
    }

    public setTotalKills(totalKills: number): void {
        this.totalKills = totalKills;
    }

    public incrementTotalKills(): void {
        this.totalKills++;
    }

    public incrementDeaths(): void {
        this.deaths++;
    }

    public getDeaths(): number {
        return this.deaths;
    }

    public setDeaths(deaths: number): void {
        this.deaths = deaths;
    }

    public resetSafingTimer(): void {
        this.setSafeTimer(180);
    }

    public getHighestKillstreak(): number {
        return this.highestKillstreak;
    }

    public setHighestKillstreak(highestKillstreak: number): void {
        this.highestKillstreak = highestKillstreak;
    }

    public getKillstreak(): number {
        return this.killstreak;
    }

    public setKillstreak(killstreak: number): void {
        this.killstreak = killstreak;
    }

    public incrementKillstreak() {
        this.killstreak++;
    }

    public getKillDeathRatio(): string {
        let kc = 0;
        if (this.deaths == 0) {
            kc = this.totalKills / 1;
        } else {
            kc = (this.totalKills / this.deaths);
        }
        return Misc.FORMATTER.format(kc);
    }

    public getRecentKills(): string[] {
        return this.recentKills;
    }

    public getSafeTimer(): number {
        return this.safeTimer;
    }

    public setSafeTimer(safeTimer: number) {
        this.safeTimer = safeTimer;
    }

    public decrementAndGetSafeTimer(): number {
        return this.safeTimer--;
    }

    public getTargetSearchTimer(): SecondsTimer {
        return this.targetSearchTimer;
    }

    public getSpecialAttackRestore(): SecondsTimer {
        return this.specialAttackRestore;
    }

    public getSkullType(): SkullType {
        return this.skullType;
    }

    public setSkullType(skullType: SkullType) {
        this.skullType = skullType;
    }

    public getDueling(): Dueling {
        return this.dueling;
    }

    public getBlowpipeScales(): number {
        return this.blowpipeScales;
    }

    public setBlowpipeScales(blowpipeScales: number) {
        this.blowpipeScales = blowpipeScales;
    }

    public incrementBlowpipeScales(blowpipeScales: number) {
        this.blowpipeScales += blowpipeScales;
    }

    public decrementAndGetBlowpipeScales(): number {
        return this.blowpipeScales--;
    }

    public getCurrentPet(): NPC {
        return this.currentPet;
    }

    public setCurrentPet(currentPet: NPC) {
        this.currentPet = currentPet;
    }

    public getAggressionTolerance(): SecondsTimer {
        return this.aggressionTolerance;
    }

    public getCachedUpdateBlock(): Buffer {
        return this.cachedUpdateBlock;
    }

    public setCachedUpdateBlock(cachedUpdateBlock: Buffer) {
        this.cachedUpdateBlock = cachedUpdateBlock;
    }

    public getRegionHeight(): number {
        return this.regionHeight;
    }

    public setRegionHeight(regionHeight: number) {
        this.regionHeight = regionHeight;
    }

    public getSkill(): Skillable | undefined {
        return this.skill;
    }

    public setSkill(skill: Skillable | undefined) {
        this.skill = skill;
    }

    public getCreationMenu(): CreationMenu {
        return this.creationMenu;
    }

    public setCreationMenu(creationMenu: CreationMenu): void {
        this.creationMenu = creationMenu;
    }

    public getPouches(): PouchContainer[] {
        return this.pouches;
    }

    public setPouches(pouches: PouchContainer[]): void {
        this.pouches = pouches;
    }

    public getLoyaltyTitle(): string {
        return this.loyaltyTitle;
    }

    public setLoyaltyTitle(loyaltyTitle: string): void {
        this.loyaltyTitle = loyaltyTitle;
        this.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    public hasInfiniteHealth(): boolean {
        return this.infiniteHealth;
    }

    public setInfiniteHealth(infiniteHealth: boolean): void {
        this.infiniteHealth = infiniteHealth;
    }

    public getDonatorRights(): DonatorRights {
        return this.donatorRights;
    }

    public setDonatorRights(donatorPrivilege: typeof DonatorRights.NONE): void {
        this.donatorRights = donatorPrivilege;
    }

    public getCurrentBrother(): NPC {
        return this.currentBrother;
    }

    public setCurrentBrother(brother: NPC): void {
        this.currentBrother = brother;
    }

    public getBarrowsCrypt(): number {
        return this.barrowsCrypt;
    }

    public setBarrowsCrypt(crypt: number): void {
        this.barrowsCrypt = crypt;
    }

    public getKilledBrothers(): boolean[] {
        return this.killedBrothers;
    }

    public setKilledBrothers(killedBrothers: boolean[]): void {
        this.killedBrothers = killedBrothers;
    }

    public setKilledBrother(index: number, state: boolean): void {
        this.killedBrothers[index] = state;
    }

    public getBarrowsChestsLooted(): number {
        return this.barrowsChestsLooted;
    }

    public setBarrowsChestsLooted(chestsLooted: number): void {
        this.barrowsChestsLooted = chestsLooted;
    }

    public isPlaceholders(): boolean {
        return this.placeholders;
    }

    public setPlaceholders(placeholders: boolean): void {
        this.placeholders = placeholders;
    }

    public getPresets(): Presetable[] {
        return this.presets;
    }

    public setPresets(sets: Presetable[]): void {
        this.presets = sets;
    }

    public isOpenPresetsOnDeath(): boolean {
        return this.openPresetsOnDeath;
    }

    public setOpenPresetsOnDeath(openPresetsOnDeath: boolean): void {
        this.openPresetsOnDeath = openPresetsOnDeath;
    }

    public getCurrentPreset(): Presetable {
        return this.currentPreset;
    }

    public setCurrentPreset(currentPreset: Presetable): void {
        this.currentPreset = currentPreset;
    }

    public getChatMessageQueue(): Array<ChatMessage> {
        return this.chatMessageQueue;
    }

    public getCurrentChatMessage(): ChatMessage {
        return this.currentChatMessage;
    }

    public setCurrentChatMessage(currentChatMessage: ChatMessage): void {
        this.currentChatMessage = currentChatMessage;
    }

    public getPreviousTeleports(): Map<TeleportButton, Location> {
        return this.previousTeleports;
    }

    public isTeleportInterfaceOpen(): boolean {
        return this.teleportInterfaceOpen;
    }

    public setTeleportInterfaceOpen(teleportInterfaceOpen: boolean): void {
        this.teleportInterfaceOpen = teleportInterfaceOpen;
    }

    public manipulateHit(hit: PendingHit): PendingHit {
        let attacker = hit.getAttacker();

        if (attacker.isNpc()) {
            let npc = attacker.getAsNpc();
            if (npc.getId() == NpcIdentifiers.TZTOK_JAD) {
                if (PrayerHandler.isActivated(this, PrayerHandler.getProtectingPrayer(hit.getCombatType()))) {
                    hit.setTotalDamage(0);
                }
            }
        }

        return hit;
    }

    public getOldPosition(): Location {
        return this.oldPosition;
    }

    public setOldPosition(oldPosition: Location): void {
        this.oldPosition = oldPosition;
    }

    public getGodwarsKillcount(): number[] {
        return this.godwarsKillcount;
    }

    public setGodwarsKillcountArray(godwarsKillcount: number[]): void {
        this.godwarsKillcount = godwarsKillcount;
    }

    public setGodwarsKillcount(index: number, value: number): void {
        this.godwarsKillcount[index] = value;
    }

    public setGodwarsKillcountReturn(godwarsKillcount: number[]) {
        this.godwarsKillcount = godwarsKillcount;
    }

    public getEnteredAmountAction(): EnteredAmountAction {
        return this.enteredAmountAction;
    }

    public setEnteredAmountAction(enteredAmountAction: EnteredAmountAction): void {
        this.enteredAmountAction = enteredAmountAction;
    }

    public getEnteredSyntaxAction(): EnteredSyntaxAction {
        return this.enteredSyntaxAction;
    }

    public setEnteredSyntaxAction(enteredSyntaxAction: EnteredSyntaxAction): void {
        this.enteredSyntaxAction = enteredSyntaxAction;
    }

    public getSlayerTask(): ActiveSlayerTask {
        return this.slayerTask;
    }

    public setSlayerTask(slayerTask: ActiveSlayerTask): void {
        this.slayerTask = slayerTask;
    }

    public getConsecutiveTasks(): number {
        return this.consecutiveTasks;
    }

    public setConsecutiveTasks(consecutiveTasks: number): void {
        this.consecutiveTasks = consecutiveTasks;
    }

    public getSlayerPoints(): number {
        return this.slayerPoints;
    }

    public setSlayerPoints(slayerPoints: number): void {
        this.slayerPoints = slayerPoints;
    }

    public getDialogueManager(): DialogueManager {
        return this.dialogueManager;
    }

    public getWeapon(): WeaponInterfaces {
        return this.weapon;
    }

    public setWeapon(weapon: WeaponInterfaces): void {
        this.weapon = weapon;
    }

    public getFightType(): FightType {
        return this.fightType;
    }

    public setFightType(fightType: FightType): void {
        this.fightType = fightType;
    }

    public autoRetaliateReturn(): boolean {
        return this.autoRetaliate;
    }

    public setAutoRetaliate(autoRetaliate: boolean): void {
        this.autoRetaliate = autoRetaliate;
    }

    public isDiscordLoginReturn(): boolean {
        return this.isDiscordLogin;
    }
    public setDiscordLogin(discordLogin: boolean) {
        this.isDiscordLogin = discordLogin;
    }

    public getCachedDiscordAccessToken(): string {
        return this.cachedDiscordAccessToken;
    }

    public setCachedDiscordAccessToken(cachedDiscordAccessToken: string) {
        this.cachedDiscordAccessToken = cachedDiscordAccessToken;
    }

    public getQuestProgress(): Map<number, number> {
        return this.questProgress;
    }

    public getQuestPoints(): number {
        return this.questPoints;
    }

    public setQuestPoints(questPoints: number) {
        this.questPoints = questPoints;
    }

    public setQuestProgress(questProgress: Map<number, number>) {
        if (!questProgress) {
            return;
        }
        this.questProgress = questProgress;
    }

    public climb(down: boolean, location: Location): void {
        this.performAnimation(new Animation(down ? 827 : 828));
        const task = new PlayerTask(1, this.getIndex(), true, () => {
            let ticks = 0;
            ticks++;
            if (ticks === 2) {
                this.moveTo(location);
                task.stop();
            }
        });
        TaskManager.submit(task);
    }
}

class PlayerTask extends Task{
    constructor(n1: number, n2: number, b: boolean, private readonly execFunc: Function){
        super(n1, n2, b)
    }
    execute(): void {
        this.execFunc();
    }
    
}