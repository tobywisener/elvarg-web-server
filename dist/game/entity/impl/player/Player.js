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
exports.Player = void 0;
var GameConstants_1 = require("../../../GameConstants");
var World_1 = require("../../../World");
var PrayerHandler_1 = require("../../../content/PrayerHandler");
var ClanChatManager_1 = require("../../../content/clan/ClanChatManager");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var CombatSpecial_1 = require("../../../content/combat/CombatSpecial");
var CombatType_1 = require("../../../content/combat/CombatType");
var FightType_1 = require("../../../content/combat/FightType");
var WeaponInterfaces_1 = require("../../../content/combat/WeaponInterfaces");
var BountyHunter_1 = require("../../../content/combat/bountyhunter/BountyHunter");
var Autocasting_1 = require("../../../content/combat/magic/Autocasting");
var Barrows_1 = require("../../../content/minigames/impl/Barrows");
var Presetables_1 = require("../../../content/presets/Presetables");
var SkillManager_1 = require("../../../content/skill/SkillManager");
var Mobile_1 = require("../Mobile");
var NpcAggression_1 = require("../npc/NpcAggression");
var PlayerBot_1 = require("../playerbot/PlayerBot");
var Animation_1 = require("../../../model/Animation");
var Appearance_1 = require("../../../model/Appearance");
var Flag_1 = require("../../../model/Flag");
var God_1 = require("../../../model/God");
var PlayerRelations_1 = require("../../../model/PlayerRelations");
var PlayerStatus_1 = require("../../../model/PlayerStatus");
var SecondsTimer_1 = require("../../../model/SecondsTimer");
var Skill_1 = require("../../../model/Skill");
var AreaManager_1 = require("../../../model/areas/AreaManager");
var Bank_1 = require("../../../model/container/impl/Bank");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var Inventory_1 = require("../../../model/container/impl/Inventory");
var PriceChecker_1 = require("../../../model/container/impl/PriceChecker");
var DialogueManager_1 = require("../../../model/dialogues/DialogueManager");
var BonusManager_1 = require("../../../model/equipment/BonusManager");
var MovementQueue_1 = require("../../../model/movement/MovementQueue");
var DonatorRights_1 = require("../../../model/rights/DonatorRights");
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var TaskManager_1 = require("../../../task/TaskManager");
var CombatPoisonEffect_1 = require("../../../task/impl/CombatPoisonEffect");
var PlayerDeath_1 = require("../../../task/impl/PlayerDeath");
var RestoreSpecialAttackTask_1 = require("../../../task/impl/RestoreSpecialAttackTask");
var PacketSender_1 = require("../../../../net/packet/PacketSender");
var FrameUpdater_1 = require("../../../../util/FrameUpdater");
var Misc_1 = require("../../../../util/Misc");
var NpcIdentifiers_1 = require("../../../../util/NpcIdentifiers");
var Stopwatch_1 = require("../../../../util/Stopwatch");
var TimerKey_1 = require("../../../../util/timers/TimerKey");
var Trading_1 = require("../../../content/Trading");
var Duelling_1 = require("../../../content/Duelling");
var QuickPrayers_1 = require("../../../content/QuickPrayers");
var Runecrafting_1 = require("../../../content/skill/skillable/impl/Runecrafting");
var SkullType_1 = require("../../../model/SkullType");
var EffectTimer_1 = require("../../../model/EffectTimer");
var PetHandler_1 = require("../../../content/PetHandler");
var Task_1 = require("../../../task/Task");
var Player = exports.Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    /**
     * Creates this player with pre defined spawn location.
     *
     * @param playerIO
     */
    function Player(playerIO, spawnLocation) {
        var _this = _super.call(this, spawnLocation !== null && spawnLocation !== void 0 ? spawnLocation : GameConstants_1.GameConstants.DEFAULT_LOCATION.clone()) || this;
        _this.increaseStats = new SecondsTimer_1.SecondsTimer();
        _this.decreaseStats = new SecondsTimer_1.SecondsTimer();
        _this.localPlayers = [];
        _this.localNpcs = [];
        _this.packetSender = new PacketSender_1.PacketSender(_this);
        _this.appearance = new Appearance_1.Appearance(_this);
        _this.skillManager = new SkillManager_1.SkillManager(_this);
        _this.relations = new PlayerRelations_1.PlayerRelations(_this);
        _this.frameUpdater = new FrameUpdater_1.FrameUpdater();
        _this.bonusManager = new BonusManager_1.BonusManager();
        _this.quickPrayers = new QuickPrayers_1.QuickPrayers(_this);
        _this.inventory = new Inventory_1.Inventory(_this);
        _this.equipment = new Equipment_1.Equipment(_this);
        _this.priceChecker = new PriceChecker_1.PriceChecker(_this);
        _this.clickDelay = new Stopwatch_1.Stopwatch();
        _this.lastItemPickup = new Stopwatch_1.Stopwatch();
        _this.yellDelay = new SecondsTimer_1.SecondsTimer();
        _this.aggressionTolerance = new SecondsTimer_1.SecondsTimer();
        // Delay for restoring special attack
        _this.specialAttackRestore = new SecondsTimer_1.SecondsTimer();
        /*
        * Fields
        */
        _this.vengeTimer = new SecondsTimer_1.SecondsTimer();
        _this.targetSearchTimer = new SecondsTimer_1.SecondsTimer();
        _this.recentKills = []; // Contains ip addresses of recent kills
        _this.chatMessageQueue = new Array();
        // Logout
        _this.forcedLogoutTimer = new SecondsTimer_1.SecondsTimer();
        // Trading
        _this.trading = new Trading_1.Trading(_this);
        _this.dueling = new Duelling_1.Dueling(_this);
        _this.dialogueManager = new DialogueManager_1.DialogueManager(_this);
        _this.presets = new Array(Presetables_1.Presetables.MAX_PRESETS);
        _this.openPresetsOnDeath = true;
        _this.status = PlayerStatus_1.PlayerStatus.NONE;
        _this.interfaceId = -1;
        _this.walkableInterfaceId = -1;
        _this.isRunning = true;
        _this.runEnergy = 100;
        _this.lastRunRecovery = new Stopwatch_1.Stopwatch();
        _this.previousTeleports = new Map();
        _this.destroyItem = -1;
        _this.packetsBlocked = false;
        _this.questProgress = new Map();
        // Time the account was created
        _this.creationDate = new Date();
        // RC
        _this.pouches = [new Runecrafting_1.PouchContainer(Runecrafting_1.Pouch.SMALL_POUCH),
            new Runecrafting_1.PouchContainer(Runecrafting_1.Pouch.MEDIUM_POUCH), new Runecrafting_1.PouchContainer(Runecrafting_1.Pouch.LARGE_POUCH),
            new Runecrafting_1.PouchContainer(Runecrafting_1.Pouch.GIANT_POUCH)];
        _this.vengeanceTimer = new SecondsTimer_1.SecondsTimer();
        _this.safeTimer = 180;
        _this.killedBrothers = Array(Barrows_1.Brother.length).fill(false);
        _this.banks = Array(Bank_1.Bank.TOTAL_BANK_TABS).fill(null); // last index is for bank searches
        _this.searchSyntax = "";
        _this.placeholders = true;
        _this.fightType = FightType_1.FightType.UNARMED_KICK;
        _this.autoRetaliate = true;
        // GWD
        _this.godwarsKillcount = Array(Object.keys(God_1.God).length / 2).fill(0);
        // Rights
        _this.rights = PlayerRights_1.PlayerRights.NONE;
        _this.donatorRights = DonatorRights_1.DonatorRights.NONE;
        _this.loyaltyTitle = "empty";
        _this.session = playerIO;
        return _this;
    }
    Player.prototype.getSize = function () {
        return 1;
    };
    Player.prototype.onAdd = function () {
        this.onLogin();
    };
    Player.prototype.resetAttributes = function () {
        var e_1, _a;
        this.performAnimation(new Animation_1.Animation(65535));
        this.setSpecialActivated(false);
        CombatSpecial_1.CombatSpecial.updateBar(this);
        this.setHasVengeance(false);
        this.getCombat().getFireImmunityTimer().stop();
        this.getCombat().getPoisonImmunityTimer().stop();
        this.getCombat().getTeleblockTimer().stop();
        this.getTimers().cancel(TimerKey_1.TimerKey.FREEZE);
        this.getCombat().getPrayerBlockTimer().stop();
        this.setPoisonDamage(0);
        this.setWildernessLevel(0);
        this.setRecoilDamage(0);
        this.setSkullTimer(0);
        this.setSkullType(SkullType_1.SkullType.WHITE_SKULL);
        WeaponInterfaces_1.WeaponInterfaces.assign(this);
        BonusManager_1.BonusManager.update(this);
        PrayerHandler_1.PrayerHandler.deactivatePrayers(this);
        this.getEquipment().refreshItems();
        this.getInventory().refreshItems();
        try {
            for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var skill = _c.value;
                this.getSkillManager().setCurrentLevels(skill, this.getSkillManager().getMaxLevel(skill));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.setRunEnergy(100);
        this.getPacketSender().sendRunEnergy();
        this.getMovementQueue().setBlockMovement(false).reset();
        this.getPacketSender().sendEffectTimer(0, EffectTimer_1.EffectTimer.ANTIFIRE).sendEffectTimer(0, EffectTimer_1.EffectTimer.FREEZE)
            .sendEffectTimer(0, EffectTimer_1.EffectTimer.VENGEANCE).sendEffectTimer(0, EffectTimer_1.EffectTimer.TELE_BLOCK);
        this.getPacketSender().sendPoisonType(0);
        this.getPacketSender().sendSpecialAttackState(false);
        this.setUntargetable(false);
        this.isDying = false;
        this.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    /**
     * Actions that should be done when this character is removed from the world.
     */
    Player.prototype.onRemove = function () {
        this.onLogout();
    };
    Player.prototype.appendDeath = function () {
        if (!this.isDying) {
            TaskManager_1.TaskManager.submit(new PlayerDeath_1.PlayerDeathTask(this));
            this.isDying = true;
        }
    };
    Player.prototype.getHitpoints = function () {
        return this.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS);
    };
    Player.prototype.getAttackAnim = function () {
        return FightType_1.FightType.getAnimation();
    };
    Player.prototype.getAttackSound = function () {
        return FightType_1.FightType.getAttackSound();
    };
    Player.prototype.getBlockAnim = function () {
        var shield = this.getEquipment().getItems()[Equipment_1.Equipment.SHIELD_SLOT];
        var weapon = this.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT];
        var definition = shield.getId() > 0 ? shield.getDefinition() : weapon.getDefinition();
        return definition.getBlockAnim();
    };
    Player.prototype.setHitpoints = function (hitpoints) {
        if (this.isDying) {
            return this;
        }
        if (this.infiniteHealth) {
            if (this.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) > hitpoints) {
                return this;
            }
        }
        this.getSkillManager().setCurrentLevels(Skill_1.Skill.HITPOINTS, hitpoints);
        this.getPacketSender().sendSkill(Skill_1.Skill.HITPOINTS);
        if (this.getHitpoints() <= 0 && !this.isDying)
            this.appendDeath();
        return this;
    };
    Player.prototype.heal = function (amount) {
        var level = this.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS);
        if ((this.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) + amount) >= level) {
            this.setHitpoints(level);
        }
        else {
            this.setHitpoints(this.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) + amount);
        }
    };
    Player.prototype.getBaseAttack = function (type) {
        if (type == CombatType_1.CombatType.RANGED)
            return this.getSkillManager().getCurrentLevel(Skill_1.Skill.RANGED);
        else if (type == CombatType_1.CombatType.MAGIC)
            return this.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC);
        return this.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK);
    };
    Player.prototype.getBaseDefence = function (type) {
        if (type == CombatType_1.CombatType.MAGIC)
            return this.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC);
        return this.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE);
    };
    Player.prototype.getBaseAttackSpeed = function () {
        // Gets attack speed for player's weapon
        // If player is using magic, attack speed is
        // Calculated in the MagicCombatMethod class.
        var speed = this.getWeapon().getSpeed();
        if (this.getFightType().toString().toLowerCase().includes("rapid")) {
            speed--;
        }
        return speed;
    };
    Player.prototype.isPlayer = function () {
        return true;
    };
    Player.prototype.equals = function (o) {
        if (!(o instanceof Player)) {
            return false;
        }
        var p = o;
        return p.getUsername() == this.username;
    };
    Player.prototype.size = function () {
        return 1;
    };
    Player.prototype.process = function () {
        var e_2, _a;
        // Timers
        this.getTimers().process();
        // Process incoming packets...
        var session = this.getSession();
        if (session != null) {
            session.processPackets();
        }
        // Process walking queue..
        this.getMovementQueue().process();
        // Process combat
        this.getCombat().process();
        // Process aggression
        NpcAggression_1.NpcAggression.process(this);
        // Process areas..
        AreaManager_1.AreaManager.process(this);
        // Process Bounty Hunter
        BountyHunter_1.BountyHunter.process(this);
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
            this.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        }
        // Send queued chat messages
        if (this.getChatMessageQueue().length > 0) {
            this.setCurrentChatMessage(this.getChatMessageQueue().shift());
            this.getUpdateFlag().flag(Flag_1.Flag.CHAT);
        }
        else {
            this.setCurrentChatMessage(null);
        }
        // Increase run energy
        if (this.runEnergy < 100 && (!this.getMovementQueue().isMovings() || !this.isRunning)) {
            if (this.lastRunRecovery.elapsedTime(MovementQueue_1.MovementQueue.runEnergyRestoreDelay(this))) {
                this.runEnergy++;
                this.getPacketSender().sendRunEnergy();
                this.lastRunRecovery.reset();
            }
        }
        if (this instanceof PlayerBot_1.PlayerBot) {
            this.getMovementInteraction().process();
        }
        // Decrease boosted stats Increase lowered stats
        if (this.getHitpoints() > 0) {
            if (this.increaseStats.finished() || this.decreaseStats.secondsElapsed() >= (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.PRESERVE) ? 72 : 60)) {
                try {
                    for (var _b = __values(Object.values(Skill_1.Skill)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var skill = _c.value;
                        var current = this.getSkillManager().getCurrentLevel(skill);
                        var max = this.getSkillManager().getMaxLevel(skill);
                        // Should lowered stats be increased?
                        if (current < max) {
                            if (this.increaseStats.finished()) {
                                var restoreRate = 1;
                                // Rapid restore effect - 2x restore rate for all stats except hp/prayer
                                // Rapid heal - 2x restore rate for hitpoints
                                if (skill != Skill_1.Skill.HITPOINTS && skill != Skill_1.Skill.PRAYER) {
                                    if (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.RAPID_RESTORE)) {
                                        restoreRate = 2;
                                    }
                                }
                                else if (skill == Skill_1.Skill.HITPOINTS) {
                                    if (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.RAPID_HEAL)) {
                                        restoreRate = 2;
                                    }
                                }
                                this.getSkillManager().increaseCurrentLevel(skill, restoreRate, max);
                            }
                        }
                        else if (current > max) {
                            // Should boosted stats be decreased?
                            if (this.decreaseStats.secondsElapsed() >= (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.PRESERVE) ? 72 : 60)) {
                                // Never decrease Hitpoints / Prayer
                                if (skill != Skill_1.Skill.HITPOINTS && skill != Skill_1.Skill.PRAYER) {
                                    this.getSkillManager().decreaseCurrentLevel(skill, 1, 1);
                                }
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
                // Reset timers
                if (this.increaseStats.finished()) {
                    this.increaseStats.start(60);
                }
                if (this.decreaseStats
                    .secondsElapsed() >= (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.PRESERVE) ? 72 : 60)) {
                    this.decreaseStats.start((PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.PRESERVE) ? 72 : 60));
                }
            }
        }
    };
    // Construction
    /*
     
    public loadingHouse: boolean; public portalSelected: number; public inBuildingMode: boolean; public toConsCoords: number[]; public buildFurnitureId: number; public buildFurnitureX: number; public buildFurnitureY: number; public houseRooms: Room[][][] = new Array(5).fill(new Array(13).fill(new Array(13).fill(new Room()))); public playerFurniture: PlayerFurniture[] = []; public portals: Portal[] = [];
    */
    /**
     
    Can the player logout?
    @returns Yes if they can logout, false otherwise.
    */
    Player.prototype.canLogout = function () {
        if (CombatFactory_1.CombatFactory.isBeingAttacked(this)) {
            this.getPacketSender().sendMessage("You must wait a few seconds after being out of combat before doing this.");
            return false;
        }
        if (this.busy()) {
            this.getPacketSender().sendMessage("You cannot log out at the moment.");
            return false;
        }
        return true;
    };
    /**
     
    Requests a logout by sending the logout packet to the client. This leads to
    the connection being closed. The {@link ChannelEventHandler} will then add
    the player to the remove characters queue.
    */
    Player.prototype.requestLogout = function () {
        this.getPacketSender().sendLogout();
    };
    Player.prototype.onLogout = function () {
        // Notify us
        console.log("[World] Deregistering player - [username, host] : [" + this.getUsername() + ", " + this.getHostAddress() + "]");
        this.getPacketSender().sendInterfaceRemoval();
        // Leave area
        if (this.getArea() != null) {
            this.getArea().leave(this, true);
        }
        // Do stuff...
        Barrows_1.Barrows.brotherDespawn(this);
        PetHandler_1.PetHandler.pickup(this, this.getCurrentPet());
        this.getRelations().updateLists(false);
        BountyHunter_1.BountyHunter.unassign(this);
        ClanChatManager_1.ClanChatManager.leave(this, false);
        TaskManager_1.TaskManager.cancelTasks(this);
        GameConstants_1.GameConstants.PLAYER_PERSISTENCE.save(this);
        if (this.getSession() != null && this.getSession().getChannel().isOpen()) {
            this.getSession().getChannel().close();
        }
    };
    /**
     
    Called by the world's login queue!
    */
    Player.prototype.onLogin = function () {
        var e_3, _a, e_4, _b;
        // Attempt to register the player..
        console.log("[World] Registering player - [username, host] : [" + this.getUsername() + ", " + this.getHostAddress() + "]");
        this.setNeedsPlacement(true);
        this.getPacketSender().sendMapRegion().sendDetails(); // Map region, player index and player rights
        this.getPacketSender().sendTabs(); // Client sideicons
        this.getPacketSender().sendMessage("Welcome to " + GameConstants_1.GameConstants.NAME + ".");
        if (this.isDiscordLogin()) {
            this.getPacketSender().sendMessage(":discordtoken:" + this.getCachedDiscordAccessToken());
        }
        var totalExp = 0;
        var skill;
        try {
            for (var _c = __values(Object.values(Skill_1.Skill)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var skill_1 = _d.value;
                this.getSkillManager().updateSkill(skill_1);
                totalExp += this.getSkillManager().getExperience(skill_1);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.getPacketSender().sendTotalExp(totalExp);
        // Send friends and ignored players lists...
        this.getRelations().setPrivateMessageId(1).onLogin(this).updateLists(true);
        // Reset prayer configs...
        PrayerHandler_1.PrayerHandler.resetAll(this);
        this.getPacketSender().sendConfig(709, PrayerHandler_1.PrayerHandler.canUse(this, PrayerHandler_1.PrayerData.PRESERVE, false) ? 1 : 0);
        this.getPacketSender().sendConfig(711, PrayerHandler_1.PrayerHandler.canUse(this, PrayerHandler_1.PrayerData.RIGOUR, false) ? 1 : 0);
        this.getPacketSender().sendConfig(713, PrayerHandler_1.PrayerHandler.canUse(this, PrayerHandler_1.PrayerData.AUGURY, false) ? 1 : 0);
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
        WeaponInterfaces_1.WeaponInterfaces.assign(this);
        // Update weapon interface configs
        this.getPacketSender().sendConfig(FightType_1.FightType.getParentId(), FightType_1.FightType.getChildId())
            .sendConfig(172, this.autoRetaliateReturn() ? 1 : 0).updateSpecialAttackOrb();
        // Reset autocasting
        Autocasting_1.Autocasting.setAutocast(this, null);
        // Send pvp stats..
        this.getPacketSender().sendString("@or1@Killstreak: " + this.getKillstreak(), 52029)
            .sendString("@or1@Kills: " + this.getTotalKills(), 52030).sendString("@or1@Deaths: " + this.getDeaths(), 52031)
            .sendString("@or1@K/D Ratio: " + this.getKillDeathRatio(), 52033)
            .sendString("@or1@Donated: " + this.getAmountDonated(), 52034);
        // Join clanchat
        ClanChatManager_1.ClanChatManager.onLogin(this);
        // Handle timers and run tasks
        if (this.isPoisoned()) {
            this.getPacketSender().sendPoisonType(1);
            TaskManager_1.TaskManager.submit(new CombatPoisonEffect_1.CombatPoisonEffect(this));
        }
        if (this.getSpecialPercentage() < 100) {
            TaskManager_1.TaskManager.submit(new RestoreSpecialAttackTask_1.RestoreSpecialAttackTask(this));
        }
        if (!this.getVengeanceTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getVengeanceTimer().secondsRemaining(), EffectTimer_1.EffectTimer.VENGEANCE);
        }
        if (!this.getCombat().getFireImmunityTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getCombat().getFireImmunityTimer().secondsRemaining(), EffectTimer_1.EffectTimer.ANTIFIRE);
        }
        if (!this.getCombat().getTeleblockTimer().finished()) {
            this.getPacketSender().sendEffectTimer(this.getCombat().getTeleblockTimer().secondsRemaining(), EffectTimer_1.EffectTimer.TELE_BLOCK);
        }
        this.decreaseStats.start(60);
        this.increaseStats.start(60);
        this.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        if (this.newPlayer) {
            var presetIndex = Misc_1.Misc.randomInclusive(0, Presetables_1.Presetables.GLOBAL_PRESETS.length - 1);
            Presetables_1.Presetables.load(this, Presetables_1.Presetables.GLOBAL_PRESETS[presetIndex]);
        }
        if (!(this instanceof PlayerBot_1.PlayerBot)) {
            var definition 
            // Spawn player bots when a real player logs in
            = void 0;
            try {
                // Spawn player bots when a real player logs in
                for (var _e = __values(GameConstants_1.GameConstants.PLAYER_BOTS), _f = _e.next(); !_f.done; _f = _e.next()) {
                    definition = _f.value;
                    if (World_1.World.getPlayerBots().has(definition.getUsername())) {
                        continue;
                    }
                    var playerBot = new PlayerBot_1.PlayerBot(definition);
                    World_1.World.getPlayerBots().set(definition.getUsername(), playerBot);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            console.log("".concat(GameConstants_1.GameConstants.PLAYER_BOTS.length, " player bots now online."));
        }
    };
    Player.prototype.busy = function () {
        if (this.interfaceId > 0) {
            return true;
        }
        if (this.getHitpoints() <= 0) {
            return true;
        }
        if (this.isNeedsPlacement() || this.isTeleportingReturn()) {
            return true;
        }
        if (this.status != PlayerStatus_1.PlayerStatus.NONE) {
            return true;
        }
        if (this.forceMovement != null) {
            return true;
        }
        return false;
    };
    Player.prototype.isStaff = function () {
        return this.rights !== PlayerRights_1.PlayerRights.NONE;
    };
    Player.prototype.isDonator = function () {
        return (this.donatorRights != DonatorRights_1.DonatorRights.NONE);
    };
    Player.prototype.isPacketsBlocked = function () {
        return this.packetsBlocked;
    };
    Player.prototype.setPacketsBlocked = function (blocked) {
        this.packetsBlocked = blocked;
    };
    Player.prototype.getCreationDate = function () {
        return this.creationDate;
    };
    Player.prototype.setCreationDate = function (timestamp) {
        this.creationDate = timestamp;
    };
    Player.prototype.getSession = function () {
        return this.session;
    };
    Player.prototype.getUsername = function () {
        return this.username;
    };
    Player.prototype.setUsername = function (username) {
        this.username = username;
        return this;
    };
    Player.prototype.getLongUsername = function () {
        return this.longUsername;
    };
    Player.prototype.setLongUsername = function (longUsername) {
        this.longUsername = longUsername;
        return this;
    };
    Player.prototype.resetCastlewarsIdleTime = function () {
        this.castlewarsIdleTime = 200;
    };
    Player.prototype.getPasswordHashWithSalt = function () {
        return this.passwordHashWithSalt;
    };
    Player.prototype.setPasswordHashWithSalt = function (passwordHashWithSalt) {
        this.passwordHashWithSalt = passwordHashWithSalt;
        return this;
    };
    Player.prototype.getHostAddress = function () {
        return this.hostAddress;
    };
    Player.prototype.setHostAddress = function (hostAddress) {
        this.hostAddress = hostAddress;
        return this;
    };
    Player.prototype.getRights = function () {
        return this.rights;
    };
    Player.prototype.setRights = function (rights) {
        this.rights = rights;
        return this;
    };
    Player.prototype.getPacketSender = function () {
        return this.packetSender;
    };
    Player.prototype.getSkillManager = function () {
        return this.skillManager;
    };
    Player.prototype.getAppearance = function () {
        return this.appearance;
    };
    Player.prototype.getForcedLogoutTimer = function () {
        return this.forcedLogoutTimer;
    };
    Player.prototype.isDyingReturn = function () {
        return this.isDying;
    };
    Player.prototype.getLocalPlayers = function () {
        return this.localPlayers;
    };
    Player.prototype.getLocalNpcs = function () {
        return this.localNpcs;
    };
    Player.prototype.getInterfaceId = function () {
        return this.interfaceId;
    };
    Player.prototype.setInterfaceId = function (interfaceId) {
        this.interfaceId = interfaceId;
        return this;
    };
    Player.prototype.experienceLockedReturn = function () {
        return this.experienceLocked;
    };
    Player.prototype.setExperienceLocked = function (experienceLocked) {
        this.experienceLocked = experienceLocked;
    };
    Player.prototype.getRelations = function () {
        return this.relations;
    };
    Player.prototype.isAllowRegionChangePacket = function () {
        return this.allowRegionChangePacket;
    };
    Player.prototype.setAllowRegionChangePacket = function (allowRegionChangePacket) {
        this.allowRegionChangePacket = allowRegionChangePacket;
    };
    Player.prototype.getWalkableInterfaceId = function () {
        return this.walkableInterfaceId;
    };
    Player.prototype.setWalkableInterfaceId = function (interfaceId) {
        this.walkableInterfaceId = interfaceId;
    };
    Player.prototype.isRunningReturn = function () {
        return this.isRunning;
    };
    Player.prototype.setRunning = function (isRunning) {
        this.isRunning = isRunning;
        return this;
    };
    Player.prototype.getPlayerInteractingOption = function () {
        return this.playerInteractingOption;
    };
    Player.prototype.setPlayerInteractingOption = function (playerInteractingOption) {
        this.playerInteractingOption = playerInteractingOption;
        return this;
    };
    Player.prototype.getFrameUpdater = function () {
        return this.frameUpdater;
    };
    Player.prototype.getBonusManager = function () {
        return this.bonusManager;
    };
    Player.prototype.getMultiIcon = function () {
        return this.multiIcon;
    };
    Player.prototype.setMultiIcon = function (multiIcon) {
        this.multiIcon = multiIcon;
        return this;
    };
    Player.prototype.getInventory = function () {
        return this.inventory;
    };
    Player.prototype.getEquipment = function () {
        return this.equipment;
    };
    Player.prototype.getForceMovement = function () {
        return this.forceMovement;
    };
    Player.prototype.setForceMovement = function (forceMovement) {
        this.forceMovement = forceMovement;
        if (this.forceMovement != null) {
            this.getUpdateFlag().flag(Flag_1.Flag.FORCED_MOVEMENT);
        }
        return this;
    };
    Player.prototype.getSkillAnimation = function () {
        return this.skillAnimation;
    };
    Player.prototype.setSkillAnimation = function (animation) {
        this.skillAnimation = animation;
        return this;
    };
    Player.prototype.getRunEnergy = function () {
        return this.runEnergy;
    };
    Player.prototype.setRunEnergy = function (runEnergy) {
        this.runEnergy = runEnergy;
    };
    Player.prototype.isDrainingPrayer = function () {
        return this.drainingPrayer;
    };
    Player.prototype.setDrainingPrayer = function (drainingPrayer) {
        this.drainingPrayer = drainingPrayer;
    };
    Player.prototype.getPrayerPointDrain = function () {
        return this.prayerPointDrain;
    };
    Player.prototype.setPrayerPointDrain = function (prayerPointDrain) {
        this.prayerPointDrain = prayerPointDrain;
    };
    Player.prototype.getLastItemPickup = function () {
        return this.lastItemPickup;
    };
    Player.getCombatSpecial = function () {
        return this.getCombatSpecial();
    };
    Player.prototype.setCombatSpecial = function (combatSpecial) {
        this.combatSpecial = combatSpecial;
    };
    Player.prototype.getRecoilDamage = function () {
        return this.recoilDamage;
    };
    Player.prototype.setRecoilDamage = function (recoilDamage) {
        this.recoilDamage = recoilDamage;
    };
    Player.prototype.getSpellbook = function () {
        return this.spellbook;
    };
    Player.prototype.setSpellbook = function (spellbook) {
        this.spellbook = spellbook;
    };
    Player.prototype.getVengeanceTimer = function () {
        return this.vengeTimer;
    };
    Player.prototype.getWildernessLevel = function () {
        return this.wildernessLevel;
    };
    Player.prototype.setWildernessLevel = function (wildernessLevel) {
        this.wildernessLevel = wildernessLevel;
    };
    Player.prototype.isSpawnedBarrows = function () {
        return this.spawnedBarrows;
    };
    Player.prototype.setSpawnedBarrows = function (spawnedBarrows) {
        this.spawnedBarrows = spawnedBarrows;
    };
    Player.prototype.getDestroyItem = function () {
        return this.destroyItem;
    };
    Player.prototype.setDestroyItem = function (destroyItem) {
        this.destroyItem = destroyItem;
    };
    Player.prototype.isSkulled = function () {
        return this.skullTimer > 0;
    };
    Player.prototype.getAndDecrementSkullTimer = function () {
        return this.skullTimer--;
    };
    Player.prototype.getSkullTimer = function () {
        return this.skullTimer;
    };
    Player.prototype.setSkullTimer = function (skullTimer) {
        this.skullTimer = skullTimer;
    };
    Player.prototype.getPoints = function () {
        return this.points;
    };
    Player.prototype.setPoints = function (points) {
        this.points = points;
    };
    Player.prototype.incrementPoints = function (points) {
        this.points += points;
    };
    Player.prototype.isUpdateInventory = function () {
        return this.updateInventory;
    };
    Player.prototype.setUpdateInventory = function (updateInventory) {
        this.updateInventory = updateInventory;
    };
    Player.prototype.getClickDelay = function () {
        return this.clickDelay;
    };
    Player.prototype.getShop = function () {
        return this.shop;
    };
    Player.prototype.setShop = function (shop) {
        this.shop = shop;
        return this;
    };
    Player.prototype.getStatus = function () {
        return this.status;
    };
    Player.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    Player.prototype.getCurrentBankTab = function () {
        return this.currentBankTab;
    };
    Player.prototype.setCurrentBankTab = function (tab) {
        this.currentBankTab = tab;
        return this;
    };
    Player.prototype.setNoteWithdrawal = function (noteWithdrawal) {
        this.noteWithdrawal = noteWithdrawal;
    };
    Player.prototype.withdrawAsNote = function () {
        return this.noteWithdrawal;
    };
    Player.prototype.setInsertMode = function (insertMode) {
        this.insertMode = insertMode;
    };
    Player.prototype.insertModeReturn = function () {
        return this.insertMode;
    };
    Player.prototype.getBanks = function () {
        return this.banks;
    };
    Player.prototype.getBank = function (index) {
        if (this.banks[index] == null) {
            this.banks[index] = new Bank_1.Bank(this);
        }
        return this.banks[index];
    };
    Player.prototype.setBank = function (index, bank) {
        this.banks[index] = bank;
        return this;
    };
    Player.prototype.isNewPlayer = function () {
        return this.newPlayer;
    };
    Player.prototype.setNewPlayer = function (newPlayer) {
        this.newPlayer = newPlayer;
    };
    Player.prototype.isSearchingBank = function () {
        return this.searchingBank;
    };
    Player.prototype.setSearchingBank = function (searchingBank) {
        this.searchingBank = searchingBank;
    };
    Player.prototype.getSearchSyntax = function () {
        return this.searchSyntax;
    };
    Player.prototype.setSearchSyntax = function (searchSyntax) {
        this.searchSyntax = searchSyntax;
    };
    Player.prototype.isPreserveUnlocked = function () {
        return this.preserveUnlocked;
    };
    Player.prototype.getPreserveUnlocked = function () {
        return this.preserveUnlocked;
    };
    Player.prototype.setPreserveUnlocked = function (preserveUnlocked) {
        this.preserveUnlocked = preserveUnlocked;
    };
    Player.prototype.isRigourUnlocked = function () {
        return this.rigourUnlocked;
    };
    Player.prototype.getRigourUnlocked = function () {
        return this.rigourUnlocked;
    };
    Player.prototype.setRigourUnlocked = function (rigourUnlocked) {
        this.rigourUnlocked = rigourUnlocked;
    };
    Player.prototype.getAuguryUnlocked = function () {
        return this.auguryUnlocked;
    };
    Player.prototype.setAuguryUnlocked = function (auguryUnlocked) {
        this.auguryUnlocked = auguryUnlocked;
    };
    Player.prototype.getPriceChecker = function () {
        return this.priceChecker;
    };
    Player.prototype.getCurrentClanChat = function () {
        return this.currentClanChat;
    };
    Player.prototype.setCurrentClanChat = function (currentClanChat) {
        this.currentClanChat = currentClanChat;
    };
    Player.prototype.getClanChatName = function () {
        return this.clanChatName;
    };
    Player.prototype.setClanChatName = function (clanChatName) {
        this.clanChatName = clanChatName;
    };
    Player.prototype.getTrading = function () {
        return this.trading;
    };
    Player.prototype.getQuickPrayers = function () {
        return this.quickPrayers;
    };
    Player.prototype.isTargetTeleportUnlocked = function () {
        return this.targetTeleportUnlocked;
    };
    Player.prototype.getTargetTeleportUnlocked = function () {
        return this.targetTeleportUnlocked;
    };
    Player.prototype.setTargetTeleportUnlocked = function (targetTeleportUnlocked) {
        this.targetTeleportUnlocked = targetTeleportUnlocked;
    };
    Player.prototype.getYellDelay = function () {
        return this.yellDelay;
    };
    Player.prototype.getAmountDonated = function () {
        return this.amountDonated;
    };
    Player.prototype.setAmountDonated = function (amountDonated) {
        this.amountDonated = amountDonated;
    };
    Player.prototype.incrementAmountDonated = function (amountDonated) {
        this.amountDonated += amountDonated;
    };
    Player.prototype.incrementTargetKills = function () {
        this.targetKills++;
    };
    Player.prototype.getTargetKills = function () {
        return this.targetKills;
    };
    Player.prototype.setTargetKills = function (targetKills) {
        this.targetKills = targetKills;
    };
    Player.prototype.incrementKills = function () {
        this.normalKills++;
    };
    Player.prototype.getNormalKills = function () {
        return this.normalKills;
    };
    Player.prototype.setNormalKills = function (normalKills) {
        this.normalKills = normalKills;
    };
    Player.prototype.getTotalKills = function () {
        return this.totalKills;
    };
    Player.prototype.setTotalKills = function (totalKills) {
        this.totalKills = totalKills;
    };
    Player.prototype.incrementTotalKills = function () {
        this.totalKills++;
    };
    Player.prototype.incrementDeaths = function () {
        this.deaths++;
    };
    Player.prototype.getDeaths = function () {
        return this.deaths;
    };
    Player.prototype.setDeaths = function (deaths) {
        this.deaths = deaths;
    };
    Player.prototype.resetSafingTimer = function () {
        this.setSafeTimer(180);
    };
    Player.prototype.getHighestKillstreak = function () {
        return this.highestKillstreak;
    };
    Player.prototype.setHighestKillstreak = function (highestKillstreak) {
        this.highestKillstreak = highestKillstreak;
    };
    Player.prototype.getKillstreak = function () {
        return this.killstreak;
    };
    Player.prototype.setKillstreak = function (killstreak) {
        this.killstreak = killstreak;
    };
    Player.prototype.incrementKillstreak = function () {
        this.killstreak++;
    };
    Player.prototype.getKillDeathRatio = function () {
        var kc = 0;
        if (this.deaths == 0) {
            kc = this.totalKills / 1;
        }
        else {
            kc = (this.totalKills / this.deaths);
        }
        return Misc_1.Misc.FORMATTER.format(kc);
    };
    Player.prototype.getRecentKills = function () {
        return this.recentKills;
    };
    Player.prototype.getSafeTimer = function () {
        return this.safeTimer;
    };
    Player.prototype.setSafeTimer = function (safeTimer) {
        this.safeTimer = safeTimer;
    };
    Player.prototype.decrementAndGetSafeTimer = function () {
        return this.safeTimer--;
    };
    Player.prototype.getTargetSearchTimer = function () {
        return this.targetSearchTimer;
    };
    Player.prototype.getSpecialAttackRestore = function () {
        return this.specialAttackRestore;
    };
    Player.prototype.getSkullType = function () {
        return this.skullType;
    };
    Player.prototype.setSkullType = function (skullType) {
        this.skullType = skullType;
    };
    Player.prototype.getDueling = function () {
        return this.dueling;
    };
    Player.prototype.getBlowpipeScales = function () {
        return this.blowpipeScales;
    };
    Player.prototype.setBlowpipeScales = function (blowpipeScales) {
        this.blowpipeScales = blowpipeScales;
    };
    Player.prototype.incrementBlowpipeScales = function (blowpipeScales) {
        this.blowpipeScales += blowpipeScales;
    };
    Player.prototype.decrementAndGetBlowpipeScales = function () {
        return this.blowpipeScales--;
    };
    Player.prototype.getCurrentPet = function () {
        return this.currentPet;
    };
    Player.prototype.setCurrentPet = function (currentPet) {
        this.currentPet = currentPet;
    };
    Player.prototype.getAggressionTolerance = function () {
        return this.aggressionTolerance;
    };
    Player.prototype.getCachedUpdateBlock = function () {
        return this.cachedUpdateBlock;
    };
    Player.prototype.setCachedUpdateBlock = function (cachedUpdateBlock) {
        this.cachedUpdateBlock = cachedUpdateBlock;
    };
    Player.prototype.getRegionHeight = function () {
        return this.regionHeight;
    };
    Player.prototype.setRegionHeight = function (regionHeight) {
        this.regionHeight = regionHeight;
    };
    Player.prototype.getSkill = function () {
        return this.skill;
    };
    Player.prototype.setSkill = function (skill) {
        this.skill = skill;
    };
    Player.prototype.getCreationMenu = function () {
        return this.creationMenu;
    };
    Player.prototype.setCreationMenu = function (creationMenu) {
        this.creationMenu = creationMenu;
    };
    Player.prototype.getPouches = function () {
        return this.pouches;
    };
    Player.prototype.setPouches = function (pouches) {
        this.pouches = pouches;
    };
    Player.prototype.getLoyaltyTitle = function () {
        return this.loyaltyTitle;
    };
    Player.prototype.setLoyaltyTitle = function (loyaltyTitle) {
        this.loyaltyTitle = loyaltyTitle;
        this.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    Player.prototype.hasInfiniteHealth = function () {
        return this.infiniteHealth;
    };
    Player.prototype.setInfiniteHealth = function (infiniteHealth) {
        this.infiniteHealth = infiniteHealth;
    };
    Player.prototype.getDonatorRights = function () {
        return this.donatorRights;
    };
    Player.prototype.setDonatorRights = function (donatorPrivilege) {
        this.donatorRights = donatorPrivilege;
    };
    Player.prototype.getCurrentBrother = function () {
        return this.currentBrother;
    };
    Player.prototype.setCurrentBrother = function (brother) {
        this.currentBrother = brother;
    };
    Player.prototype.getBarrowsCrypt = function () {
        return this.barrowsCrypt;
    };
    Player.prototype.setBarrowsCrypt = function (crypt) {
        this.barrowsCrypt = crypt;
    };
    Player.prototype.getKilledBrothers = function () {
        return this.killedBrothers;
    };
    Player.prototype.setKilledBrothers = function (killedBrothers) {
        this.killedBrothers = killedBrothers;
    };
    Player.prototype.setKilledBrother = function (index, state) {
        this.killedBrothers[index] = state;
    };
    Player.prototype.getBarrowsChestsLooted = function () {
        return this.barrowsChestsLooted;
    };
    Player.prototype.setBarrowsChestsLooted = function (chestsLooted) {
        this.barrowsChestsLooted = chestsLooted;
    };
    Player.prototype.isPlaceholders = function () {
        return this.placeholders;
    };
    Player.prototype.setPlaceholders = function (placeholders) {
        this.placeholders = placeholders;
    };
    Player.prototype.getPresets = function () {
        return this.presets;
    };
    Player.prototype.setPresets = function (sets) {
        this.presets = sets;
    };
    Player.prototype.isOpenPresetsOnDeath = function () {
        return this.openPresetsOnDeath;
    };
    Player.prototype.setOpenPresetsOnDeath = function (openPresetsOnDeath) {
        this.openPresetsOnDeath = openPresetsOnDeath;
    };
    Player.prototype.getCurrentPreset = function () {
        return this.currentPreset;
    };
    Player.prototype.setCurrentPreset = function (currentPreset) {
        this.currentPreset = currentPreset;
    };
    Player.prototype.getChatMessageQueue = function () {
        return this.chatMessageQueue;
    };
    Player.prototype.getCurrentChatMessage = function () {
        return this.currentChatMessage;
    };
    Player.prototype.setCurrentChatMessage = function (currentChatMessage) {
        this.currentChatMessage = currentChatMessage;
    };
    Player.prototype.getPreviousTeleports = function () {
        return this.previousTeleports;
    };
    Player.prototype.isTeleportInterfaceOpen = function () {
        return this.teleportInterfaceOpen;
    };
    Player.prototype.setTeleportInterfaceOpen = function (teleportInterfaceOpen) {
        this.teleportInterfaceOpen = teleportInterfaceOpen;
    };
    Player.prototype.manipulateHit = function (hit) {
        var attacker = hit.getAttacker();
        if (attacker.isNpc()) {
            var npc = attacker.getAsNpc();
            if (npc.getId() == NpcIdentifiers_1.NpcIdentifiers.TZTOK_JAD) {
                if (PrayerHandler_1.PrayerHandler.isActivated(this, PrayerHandler_1.PrayerHandler.getProtectingPrayer(hit.getCombatType()))) {
                    hit.setTotalDamage(0);
                }
            }
        }
        return hit;
    };
    Player.prototype.getOldPosition = function () {
        return this.oldPosition;
    };
    Player.prototype.setOldPosition = function (oldPosition) {
        this.oldPosition = oldPosition;
    };
    Player.prototype.getGodwarsKillcount = function () {
        return this.godwarsKillcount;
    };
    Player.prototype.setGodwarsKillcountArray = function (godwarsKillcount) {
        this.godwarsKillcount = godwarsKillcount;
    };
    Player.prototype.setGodwarsKillcount = function (index, value) {
        this.godwarsKillcount[index] = value;
    };
    Player.prototype.setGodwarsKillcountReturn = function (godwarsKillcount) {
        this.godwarsKillcount = godwarsKillcount;
    };
    Player.prototype.getEnteredAmountAction = function () {
        return this.enteredAmountAction;
    };
    Player.prototype.setEnteredAmountAction = function (enteredAmountAction) {
        this.enteredAmountAction = enteredAmountAction;
    };
    Player.prototype.getEnteredSyntaxAction = function () {
        return this.enteredSyntaxAction;
    };
    Player.prototype.setEnteredSyntaxAction = function (enteredSyntaxAction) {
        this.enteredSyntaxAction = enteredSyntaxAction;
    };
    Player.prototype.getSlayerTask = function () {
        return this.slayerTask;
    };
    Player.prototype.setSlayerTask = function (slayerTask) {
        this.slayerTask = slayerTask;
    };
    Player.prototype.getConsecutiveTasks = function () {
        return this.consecutiveTasks;
    };
    Player.prototype.setConsecutiveTasks = function (consecutiveTasks) {
        this.consecutiveTasks = consecutiveTasks;
    };
    Player.prototype.getSlayerPoints = function () {
        return this.slayerPoints;
    };
    Player.prototype.setSlayerPoints = function (slayerPoints) {
        this.slayerPoints = slayerPoints;
    };
    Player.prototype.getDialogueManager = function () {
        return this.dialogueManager;
    };
    Player.prototype.getWeapon = function () {
        return this.weapon;
    };
    Player.prototype.setWeapon = function (weapon) {
        this.weapon = weapon;
    };
    Player.prototype.getFightType = function () {
        return this.fightType;
    };
    Player.prototype.setFightType = function (fightType) {
        this.fightType = fightType;
    };
    Player.prototype.autoRetaliateReturn = function () {
        return this.autoRetaliate;
    };
    Player.prototype.setAutoRetaliate = function (autoRetaliate) {
        this.autoRetaliate = autoRetaliate;
    };
    Player.prototype.isDiscordLoginReturn = function () {
        return this.isDiscordLogin;
    };
    Player.prototype.setDiscordLogin = function (discordLogin) {
        this.isDiscordLogin = discordLogin;
    };
    Player.prototype.getCachedDiscordAccessToken = function () {
        return this.cachedDiscordAccessToken;
    };
    Player.prototype.setCachedDiscordAccessToken = function (cachedDiscordAccessToken) {
        this.cachedDiscordAccessToken = cachedDiscordAccessToken;
    };
    Player.prototype.getQuestProgress = function () {
        return this.questProgress;
    };
    Player.prototype.getQuestPoints = function () {
        return this.questPoints;
    };
    Player.prototype.setQuestPoints = function (questPoints) {
        this.questPoints = questPoints;
    };
    Player.prototype.setQuestProgress = function (questProgress) {
        if (!questProgress) {
            return;
        }
        this.questProgress = questProgress;
    };
    Player.prototype.climb = function (down, location) {
        var _this = this;
        this.performAnimation(new Animation_1.Animation(down ? 827 : 828));
        var task = new PlayerTask(1, this.getIndex(), true, function () {
            var ticks = 0;
            ticks++;
            if (ticks === 2) {
                _this.moveTo(location);
                task.stop();
            }
        });
        TaskManager_1.TaskManager.submit(task);
    };
    /*
         * Getters/Setters
         */
    Player.Data = new Date();
    return Player;
}(Mobile_1.Mobile));
var PlayerTask = /** @class */ (function (_super) {
    __extends(PlayerTask, _super);
    function PlayerTask(n1, n2, b, execFunc) {
        var _this = _super.call(this, n1, n2, b) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    PlayerTask.prototype.execute = function () {
        this.execFunc();
    };
    return PlayerTask;
}(Task_1.Task));
//# sourceMappingURL=Player.js.map