import { PrayerHandler, PrayerData } from "../../../../content/PrayerHandler";
import { FightType } from "../../../../content/combat/FightType";
import { Presetable } from "../../../../content/presets/Presetable";
import { SkillManager, Skills } from "../../../../content/skill/SkillManager";
import { Runecrafting, PouchContainer } from "../../../../content/skill/skillable/impl/Runecrafting";
import { Player } from "../Player";
import { Item } from "../../../../model/Item";
import { Location } from "../../../../model/Location";
import { MagicSpellbook } from "../../../../model/MagicSpellbook";
import { SkullType } from "../../../../model/SkullType";
import { Bank } from "../../../../model/container/impl/Bank";
import { DonatorRights } from "../../../../model/rights/DonatorRights";
import { PlayerRights } from "../../../../model/rights/PlayerRights";
import { ItemContainer } from "../../../../model/container/ItemContainer";
import { StackType } from "../../../../model/container/StackType";

export class PlayerSave {
    private passwordHashWithSalt: string;
    private isDiscordLogin: boolean;
    private cachedDiscordAccessToken: string;
    private title: string;
    private rights;
    private donatorRights;
    private position: Location;
    private spellBook;
    private fightType;
    private autoRetaliate: boolean;
    private xpLocked: boolean;
    private clanChat: string;
    private targetTeleportUnlocked: boolean;
    private preserveUnlocked: boolean;
    private rigourUnlocked: boolean;
    private auguryUnlocked: boolean;
    private hasVengeance: boolean;
    private lastVengeanceTimer: number;
    private specPercentage: number;
    private recoilDamage: number;
    private poisonDamage: number;
    private blowpipeScales: number;
    private barrowsCrypt: number;
    private barrowsChests: number;
    private killedBrothers: boolean[];
    private gwdKills: number[];
    private poisonImmunityTimer: number;
    private fireImmunityTimer: number;
    private teleblockTimer: number;
    private targetSearchTimer: number;
    private specialAttackRestoreTimer: number;
    private skullTimer: number;
    private skullType;
    private running: boolean;
    private runEnergy: number;
    private totalKills: number;
    private targetKills: number;
    private normalKills: number;
    private killstreak: number;
    private highestKillstreak: number;
    private recentKills: string[];
    private deaths: number;
    private points: number;
    private pouches;
    private inventory: Item[];
    private equipment: Item[];
    private appearance: number[];
    private skills: Skills;
    private quickPrayers: PrayerData[];
    private friends: number[];
    private ignores: number[];
    private banks: Map<number, Item[]>;
    private presets: Presetable[];
    private questPoints: number;
    private questProgress: Map<number, number>;

    public getPasswordHashWithSalt(): string {
        return this.passwordHashWithSalt;
    }
    public setPasswordHashWithSalt(passwordHashWithSalt: string): void {
        this.passwordHashWithSalt = passwordHashWithSalt;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public getRights(): PlayerRights {
        return this.rights;
    }
    public setRights(rights: PlayerRights): void {
        this.rights = rights;
    }
    public getDonatorRights(): DonatorRights {
        return this.donatorRights;
    }
    public setDonatorRights(donatorRights: DonatorRights): void {
        this.donatorRights = donatorRights;
    }

    public getPosition(): Location {
        return this.position;
    }

    public setPosition(position: Location): void {
        this.position = position;
    }

    public getSpellBook(): MagicSpellbook {
        return this.spellBook;
    }

    public setSpellBook(spellBook: MagicSpellbook): void {
        this.spellBook = spellBook;
    }

    public getFightType(): FightType {
        return this.fightType;
    }

    public setFightType(fightType: FightType): void {
        this.fightType = fightType;
    }

    public isAutoRetaliate(): boolean {
        return this.autoRetaliate;
    }

    public setAutoRetaliate(autoRetaliate: boolean): void {
        this.autoRetaliate = autoRetaliate;
    }

    public isXpLocked(): boolean {
        return this.xpLocked;
    }

    public setXpLocked(xpLocked: boolean): void {
        this.xpLocked = xpLocked;
    }

    public getClanChat(): string {
        return this.clanChat;
    }

    public setClanChat(clanChat: string): void {
        this.clanChat = clanChat;
    }

    public isTargetTeleportUnlocked(): boolean {
        return this.targetTeleportUnlocked;
    }

    public setTargetTeleportUnlocked(targetTeleportUnlocked: boolean): void {
        this.targetTeleportUnlocked = targetTeleportUnlocked;
    }

    public isPreserveUnlocked(): boolean {
        return this.preserveUnlocked;
    }

    public setPreserveUnlocked(preserveUnlocked: boolean): void {
        this.preserveUnlocked = preserveUnlocked;
    }

    public isRigourUnlocked(): boolean {
        return this.rigourUnlocked;
    }

    public setRigourUnlocked(rigourUnlocked: boolean): void {
        this.rigourUnlocked = rigourUnlocked;
    }

    public isAuguryUnlocked(): boolean {
        return this.auguryUnlocked;
    }

    public setAuguryUnlocked(auguryUnlocked: boolean): void {
        this.auguryUnlocked = auguryUnlocked;
    }

    public isHasVengeance(): boolean {
        return this.hasVengeance;
    }

    public setHasVengeance(hasVengeance: boolean): void {
        this.hasVengeance = hasVengeance;
    }

    public getLastVengeanceTimer(): number {
        return this.lastVengeanceTimer;
    }

    public setLastVengeanceTimer(lastVengeanceTimer: number): void {
        this.lastVengeanceTimer = lastVengeanceTimer;
    }

    public getSpecPercentage(): number {
        return this.specPercentage;
    }

    public setSpecPercentage(specPercentage: number): void {
        this.specPercentage = specPercentage;
    }

    public getRecoilDamage(): number {
        return this.recoilDamage;
    }

    public setRecoilDamage(recoilDamage: number): void {
        this.recoilDamage = recoilDamage;
    }

    public getPoisonDamage(): number {
        return this.poisonDamage;
    }

    public setPoisonDamage(poisonDamage: number): void {
        this.poisonDamage = poisonDamage;
    }

    public getBlowpipeScales(): number {
        return this.blowpipeScales;
    }

    public setBlowpipeScales(blowpipeScales: number): void {
        this.blowpipeScales = blowpipeScales;
    }

    public getBarrowsCrypt(): number {
        return this.barrowsCrypt;
    }

    public setBarrowsCrypt(barrowsCrypt: number): void {
        this.barrowsCrypt = barrowsCrypt;
    }

    public getBarrowsChests(): number {
        return this.barrowsChests;
    }

    public setBarrowsChests(barrowsChests: number): void {
        this.barrowsChests = barrowsChests;
    }

    public getKilledBrothers(): boolean[] {
        return this.killedBrothers;
    }

    public setKilledBrothers(killedBrothers: boolean[]): void {
        this.killedBrothers = killedBrothers;
    }

    public getGwdKills(): number[] {
        return this.gwdKills;
    }

    public setGwdKills(gwdKills: number[]): void {
        this.gwdKills = gwdKills;
    }

    public getPoisonImmunityTimer(): number {
        return this.poisonImmunityTimer;
    }

    public setPoisonImmunityTimer(poisonImmunityTimer: number): void {
        this.poisonImmunityTimer = poisonImmunityTimer;
    }

    public getFireImmunityTimer(): number {
        return this.fireImmunityTimer;
    }

    public setFireImmunityTimer(fireImmunityTimer: number): void {
        this.fireImmunityTimer = fireImmunityTimer;
    }

    public getTeleblockTimer(): number {
        return this.teleblockTimer;
    }

    public setTeleblockTimer(teleblockTimer: number): void {
        this.teleblockTimer = teleblockTimer;
    }

    public getTargetSearchTimer(): number {
        return this.targetSearchTimer;
    }

    public setTargetSearchTimer(targetSearchTimer: number): void {
        this.targetSearchTimer = targetSearchTimer;
    }

    public getSpecialAttackRestoreTimer(): number {
        return this.specialAttackRestoreTimer;
    }

    public setSpecialAttackRestoreTimer(specialAttackRestoreTimer: number): void {
        this.specialAttackRestoreTimer = specialAttackRestoreTimer;
    }

    public getSkullTimer(): number {
        return this.skullTimer;
    }

    public setSkullTimer(skullTimer: number): void {
        this.skullTimer = skullTimer;
    }

    public getSkullType(): SkullType {
        return this.skullType;
    }

    public setSkullType(skullType: SkullType): void {
        this.skullType = skullType;
    }

    public isRunning(): boolean {
        return this.running;
    }

    public setRunning(running: boolean): void {
        this.running = running;
    }

    public getRunEnergy(): number {
        return this.runEnergy;
    }

    public setRunEnergy(runEnergy: number): void {
        this.runEnergy = runEnergy;
    }

    public getTotalKills(): number {
        return this.totalKills;
    }

    public setTotalKills(totalKills: number): void {
        this.totalKills = totalKills;
    }

    public getTargetKills(): number {
        return this.targetKills;
    }

    public setTargetKills(targetKills: number): void {
        this.targetKills = targetKills;
    }

    public getNormalKills(): number {
        return this.normalKills;
    }

    public setNormalKills(normalKills: number): void {
        this.normalKills = normalKills;
    }

    public getKillstreak(): number {
        return this.killstreak;
    }

    public setKillstreak(killstreak: number): void {
        this.killstreak = killstreak;
    }

    public getHighestKillstreak(): number {
        return this.highestKillstreak;
    }

    public setHighestKillstreak(highestKillstreak: number): void {
        this.highestKillstreak = highestKillstreak;
    }

    public getRecentKills(): string[] {
        return this.recentKills;
    }

    public setRecentKills(recentKills: string[]): void {
        this.recentKills = recentKills;
    }

    public getDeaths(): number {
        return this.deaths;
    }

    public setDeaths(deaths: number): void {
        this.deaths = deaths;
    }

    public getPoints(): number {
        return this.points;
    }

    public setPoints(points: number): void {
        this.points = points;
    }

    public getPouches(): PouchContainer[] {
        return this.pouches;
    }

    public setPouches(pouches: PouchContainer[]): void {
        this.pouches = pouches;
    }

    public getInventory(): Item[] {
        return this.inventory;
    }

    public setInventory(inventory: Item[]): void {
        this.inventory = inventory;
    }

    public getEquipment(): Item[] {
        return this.equipment;
    }

    public setEquipment(equipment: Item[]): void {
        this.equipment = equipment;
    }

    public getAppearance(): number[] {
        return this.appearance;
    }

    public setAppearance(appearance: number[]): void {
        this.appearance = appearance;
    }

    public getSkills(): Skills {
        return this.skills;
    }

    public setSkills(skills: Skills): void {
        this.skills = skills;
    }

    public getQuickPrayers(): PrayerData[] {
        return this.quickPrayers;
    }

    public setQuickPrayers(quickPrayers: PrayerData[]) {
        this.quickPrayers = quickPrayers;
    }

    public getFriends(): number[] {
        return this.friends;
    }

    public setFriends(friends: number[]) {
        this.friends = friends;
    }

    public getIgnores(): number[] {
        return this.ignores;
    }

    public setIgnores(ignores: number[]) {
        this.ignores = ignores;
    }

    public getBanks(): Map<number, Item[]> {
        return this.banks;
    }

    setBanks(banks: Map<number, Item[]>) {
        this.banks = banks;
    }

    getPresets(): Presetable[] {
        return this.presets;
    }

    setPresets(presets: Presetable[]) {
        this.presets = presets;
    }

    isDiscordLoginReturn(): boolean {
        return this.isDiscordLogin;
    }

    setDiscordLogin(discordLogin: boolean) {
        this.isDiscordLogin = discordLogin;
    }

    getCachedDiscordAccessToken(): string {
        return this.cachedDiscordAccessToken;
    }

    setCachedDiscordAccessToken(cachedDiscordAccessToken: string) {
        this.cachedDiscordAccessToken = cachedDiscordAccessToken;
    }

    getQuestPoints(): number {
        return this.questPoints;
    }

    setQuestPoints(questPoints: number) {
        this.questPoints = questPoints;
    }

    getQuestProgress(): Map<number, number> {
        return this.questProgress;
    }

    setQuestProgress(questProgress: Map<number, number>) {
        this.questProgress = questProgress;
    }

    applyToPlayer(player: Player) {
        player.setPasswordHashWithSalt(this.passwordHashWithSalt);
        player.setDiscordLogin(this.isDiscordLogin);
        player.setCachedDiscordAccessToken(this.cachedDiscordAccessToken);
        player.setLoyaltyTitle(this.title);

        player.setLoyaltyTitle(this.title);
        player.setRights(this.rights);
        player.setDonatorRights(this.donatorRights);
        player.setLocation(this.position);
        player.setSpellbook(this.spellBook);
        player.setFightType(this.fightType);
        player.setAutoRetaliate(this.autoRetaliate);
        player.setExperienceLocked(this.xpLocked);
        player.setClanChatName(this.clanChat);
        player.setTargetTeleportUnlocked(this.targetTeleportUnlocked);
        player.setPreserveUnlocked(this.preserveUnlocked);
        player.setRigourUnlocked(this.rigourUnlocked);
        player.setAuguryUnlocked(this.auguryUnlocked);
        player.setHasVengeance(this.hasVengeance);
        player.getVengeanceTimer().start(this.lastVengeanceTimer);
        player.setRunning(this.running);
        player.setRunEnergy(this.runEnergy);
        player.setSpecialPercentage(this.specPercentage);
        player.setRecoilDamage(this.recoilDamage);
        player.setPoisonDamage(this.poisonDamage);

        player.getCombat().getPoisonImmunityTimer().start(this.poisonImmunityTimer);
        player.getCombat().getFireImmunityTimer().start(this.fireImmunityTimer);
        player.getCombat().getTeleblockTimer().start(this.teleblockTimer);
        player.getTargetSearchTimer().start(this.targetSearchTimer);
        player.getSpecialAttackRestore().start(this.specialAttackRestoreTimer);

        player.setSkullTimer(this.skullTimer);
        player.setSkullType(this.skullType);

        player.setTotalKills(this.totalKills);
        player.setTargetKills(this.targetKills);
        player.setNormalKills(this.normalKills);
        player.setKillstreak(this.killstreak);
        player.setHighestKillstreak(this.highestKillstreak);
        player.setDeaths(this.deaths);
        player.setPoints(this.points);
        player.setPoisonDamage(this.poisonDamage);
        player.setBlowpipeScales(this.blowpipeScales);

        player.setBarrowsCrypt(this.barrowsCrypt);
        player.setBarrowsChestsLooted(this.barrowsChests);
        player.setKilledBrothers(this.killedBrothers);

        player.setGodwarsKillcountReturn(this.gwdKills);

        // RC pouches
        player.setPouches(this.pouches);

        player.getInventory().setItems(this.inventory);
        player.getEquipment().setItems(this.equipment);
        player.getAppearance().set();
        player.getSkillManager().setSkills(this.skills);
        player.getQuickPrayers().setPrayers(this.quickPrayers);
        player.setQuestPoints(this.questPoints);
        player.setQuestProgress(this.questProgress);

        if (this.presets != null) {
            player.setPresets(this.presets);
        }

        for (let l of this.friends) {
            player.getRelations().getFriendList().push(l);
        }

        for (let l of this.ignores) {
            player.getRelations().getIgnoreList().push(l);
        }

        for (let i = 0; i < player.getBanks().length; i++) {
            if (i == Bank.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            let bankItems = this.banks.get(i);
            if (bankItems != null) {
                player.setBank(i, new Bank(player)).getBank(i).addItems(bankItems, false);
            }
        }
    }
    static fromPlayer(player: Player): PlayerSave {
        let playerSave = new PlayerSave();

        playerSave.passwordHashWithSalt = player.getPasswordHashWithSalt().trim();
        playerSave.isDiscordLogin = player.isDiscordLoginReturn();
        playerSave.cachedDiscordAccessToken = player.getCachedDiscordAccessToken();
        playerSave.title = player.getLoyaltyTitle();
        playerSave.rights = player.getRights();
        playerSave.donatorRights = player.getDonatorRights();
        playerSave.position = player.getLocation();
        playerSave.spellBook = player.getSpellbook();
        playerSave.fightType = player.getFightType();
        playerSave.autoRetaliate = player.autoRetaliateReturn();
        playerSave.xpLocked = player.experienceLockedReturn();
        playerSave.clanChat = player.getClanChatName();
        playerSave.targetTeleportUnlocked = player.isTargetTeleportUnlocked();
        playerSave.preserveUnlocked = player.isPreserveUnlocked();
        playerSave.rigourUnlocked = player.isRigourUnlocked();
        playerSave.auguryUnlocked = player.getAuguryUnlocked();
        playerSave.hasVengeance = player.hasVengeanceReturn();
        playerSave.lastVengeanceTimer = player.getVengeanceTimer().secondsRemaining();
        playerSave.running = player.isRunningReturn();
        playerSave.runEnergy = player.getRunEnergy();
        playerSave.specPercentage = player.getSpecialPercentage();
        playerSave.recoilDamage = player.getRecoilDamage();
        playerSave.poisonDamage = player.getPoisonDamage();

        playerSave.poisonImmunityTimer = player.getCombat().getPoisonImmunityTimer().secondsRemaining();
        playerSave.fireImmunityTimer = player.getCombat().getFireImmunityTimer().secondsRemaining();

        playerSave.teleblockTimer = player.getCombat().getTeleblockTimer().secondsRemaining();
        playerSave.targetSearchTimer = player.getTargetSearchTimer().secondsRemaining();
        playerSave.specialAttackRestoreTimer = player.getSpecialAttackRestore().secondsRemaining();

        playerSave.skullTimer = player.getSkullTimer();
        playerSave.skullType = player.getSkullTimer();

        playerSave.totalKills = player.getTotalKills();
        playerSave.targetKills = player.getTargetKills();
        playerSave.normalKills = player.getNormalKills();
        playerSave.killstreak = player.getKillstreak();
        playerSave.highestKillstreak = player.getHighestKillstreak();
        playerSave.recentKills = player.getRecentKills();
        playerSave.deaths = player.getDeaths();
        playerSave.points = player.getPoints();
        playerSave.poisonDamage = player.getPoisonDamage();
        playerSave.blowpipeScales = player.getBlowpipeScales();

        playerSave.barrowsCrypt = player.getBarrowsCrypt();
        playerSave.barrowsChests = player.getBarrowsChestsLooted();
        playerSave.killedBrothers = player.getKilledBrothers();

        playerSave.gwdKills = player.getGodwarsKillcount();

        // RC pouches
        playerSave.pouches = player.getPouches();

        playerSave.inventory = player.getInventory().getItems();
        playerSave.equipment = player.getEquipment().getItems();
        playerSave.appearance = player.getAppearance().getLook();
        playerSave.skills = player.getSkillManager().getSkills();
        playerSave.quickPrayers = player.getQuickPrayers().getPrayers();
        playerSave.questPoints = player.getQuestPoints();
        playerSave.questProgress = player.getQuestProgress();

        playerSave.friends = player.getRelations().getFriendList();
        playerSave.ignores = player.getRelations().getIgnoreList();

        playerSave.presets = player.getPresets();

        let banks = new Map<number, Item[]>();

        /** BANK **/
        for (let i = 0; i < player.banks.length; i++) {
            if (i === Bank.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(i) !== null) {
                banks.set(i, player.getBank(i).getValidItems());
            }
        }
        playerSave.banks = banks;

        return playerSave;
    }
}