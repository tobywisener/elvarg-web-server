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
exports.PlayerSave = void 0;
var Bank_1 = require("../../../../model/container/impl/Bank");
var PlayerSave = /** @class */ (function () {
    function PlayerSave() {
    }
    PlayerSave.prototype.getPasswordHashWithSalt = function () {
        return this.passwordHashWithSalt;
    };
    PlayerSave.prototype.setPasswordHashWithSalt = function (passwordHashWithSalt) {
        this.passwordHashWithSalt = passwordHashWithSalt;
    };
    PlayerSave.prototype.getTitle = function () {
        return this.title;
    };
    PlayerSave.prototype.setTitle = function (title) {
        this.title = title;
    };
    PlayerSave.prototype.getRights = function () {
        return this.rights;
    };
    PlayerSave.prototype.setRights = function (rights) {
        this.rights = rights;
    };
    PlayerSave.prototype.getDonatorRights = function () {
        return this.donatorRights;
    };
    PlayerSave.prototype.setDonatorRights = function (donatorRights) {
        this.donatorRights = donatorRights;
    };
    PlayerSave.prototype.getPosition = function () {
        return this.position;
    };
    PlayerSave.prototype.setPosition = function (position) {
        this.position = position;
    };
    PlayerSave.prototype.getSpellBook = function () {
        return this.spellBook;
    };
    PlayerSave.prototype.setSpellBook = function (spellBook) {
        this.spellBook = spellBook;
    };
    PlayerSave.prototype.getFightType = function () {
        return this.fightType;
    };
    PlayerSave.prototype.setFightType = function (fightType) {
        this.fightType = fightType;
    };
    PlayerSave.prototype.isAutoRetaliate = function () {
        return this.autoRetaliate;
    };
    PlayerSave.prototype.setAutoRetaliate = function (autoRetaliate) {
        this.autoRetaliate = autoRetaliate;
    };
    PlayerSave.prototype.isXpLocked = function () {
        return this.xpLocked;
    };
    PlayerSave.prototype.setXpLocked = function (xpLocked) {
        this.xpLocked = xpLocked;
    };
    PlayerSave.prototype.getClanChat = function () {
        return this.clanChat;
    };
    PlayerSave.prototype.setClanChat = function (clanChat) {
        this.clanChat = clanChat;
    };
    PlayerSave.prototype.isTargetTeleportUnlocked = function () {
        return this.targetTeleportUnlocked;
    };
    PlayerSave.prototype.setTargetTeleportUnlocked = function (targetTeleportUnlocked) {
        this.targetTeleportUnlocked = targetTeleportUnlocked;
    };
    PlayerSave.prototype.isPreserveUnlocked = function () {
        return this.preserveUnlocked;
    };
    PlayerSave.prototype.setPreserveUnlocked = function (preserveUnlocked) {
        this.preserveUnlocked = preserveUnlocked;
    };
    PlayerSave.prototype.isRigourUnlocked = function () {
        return this.rigourUnlocked;
    };
    PlayerSave.prototype.setRigourUnlocked = function (rigourUnlocked) {
        this.rigourUnlocked = rigourUnlocked;
    };
    PlayerSave.prototype.isAuguryUnlocked = function () {
        return this.auguryUnlocked;
    };
    PlayerSave.prototype.setAuguryUnlocked = function (auguryUnlocked) {
        this.auguryUnlocked = auguryUnlocked;
    };
    PlayerSave.prototype.isHasVengeance = function () {
        return this.hasVengeance;
    };
    PlayerSave.prototype.setHasVengeance = function (hasVengeance) {
        this.hasVengeance = hasVengeance;
    };
    PlayerSave.prototype.getLastVengeanceTimer = function () {
        return this.lastVengeanceTimer;
    };
    PlayerSave.prototype.setLastVengeanceTimer = function (lastVengeanceTimer) {
        this.lastVengeanceTimer = lastVengeanceTimer;
    };
    PlayerSave.prototype.getSpecPercentage = function () {
        return this.specPercentage;
    };
    PlayerSave.prototype.setSpecPercentage = function (specPercentage) {
        this.specPercentage = specPercentage;
    };
    PlayerSave.prototype.getRecoilDamage = function () {
        return this.recoilDamage;
    };
    PlayerSave.prototype.setRecoilDamage = function (recoilDamage) {
        this.recoilDamage = recoilDamage;
    };
    PlayerSave.prototype.getPoisonDamage = function () {
        return this.poisonDamage;
    };
    PlayerSave.prototype.setPoisonDamage = function (poisonDamage) {
        this.poisonDamage = poisonDamage;
    };
    PlayerSave.prototype.getBlowpipeScales = function () {
        return this.blowpipeScales;
    };
    PlayerSave.prototype.setBlowpipeScales = function (blowpipeScales) {
        this.blowpipeScales = blowpipeScales;
    };
    PlayerSave.prototype.getBarrowsCrypt = function () {
        return this.barrowsCrypt;
    };
    PlayerSave.prototype.setBarrowsCrypt = function (barrowsCrypt) {
        this.barrowsCrypt = barrowsCrypt;
    };
    PlayerSave.prototype.getBarrowsChests = function () {
        return this.barrowsChests;
    };
    PlayerSave.prototype.setBarrowsChests = function (barrowsChests) {
        this.barrowsChests = barrowsChests;
    };
    PlayerSave.prototype.getKilledBrothers = function () {
        return this.killedBrothers;
    };
    PlayerSave.prototype.setKilledBrothers = function (killedBrothers) {
        this.killedBrothers = killedBrothers;
    };
    PlayerSave.prototype.getGwdKills = function () {
        return this.gwdKills;
    };
    PlayerSave.prototype.setGwdKills = function (gwdKills) {
        this.gwdKills = gwdKills;
    };
    PlayerSave.prototype.getPoisonImmunityTimer = function () {
        return this.poisonImmunityTimer;
    };
    PlayerSave.prototype.setPoisonImmunityTimer = function (poisonImmunityTimer) {
        this.poisonImmunityTimer = poisonImmunityTimer;
    };
    PlayerSave.prototype.getFireImmunityTimer = function () {
        return this.fireImmunityTimer;
    };
    PlayerSave.prototype.setFireImmunityTimer = function (fireImmunityTimer) {
        this.fireImmunityTimer = fireImmunityTimer;
    };
    PlayerSave.prototype.getTeleblockTimer = function () {
        return this.teleblockTimer;
    };
    PlayerSave.prototype.setTeleblockTimer = function (teleblockTimer) {
        this.teleblockTimer = teleblockTimer;
    };
    PlayerSave.prototype.getTargetSearchTimer = function () {
        return this.targetSearchTimer;
    };
    PlayerSave.prototype.setTargetSearchTimer = function (targetSearchTimer) {
        this.targetSearchTimer = targetSearchTimer;
    };
    PlayerSave.prototype.getSpecialAttackRestoreTimer = function () {
        return this.specialAttackRestoreTimer;
    };
    PlayerSave.prototype.setSpecialAttackRestoreTimer = function (specialAttackRestoreTimer) {
        this.specialAttackRestoreTimer = specialAttackRestoreTimer;
    };
    PlayerSave.prototype.getSkullTimer = function () {
        return this.skullTimer;
    };
    PlayerSave.prototype.setSkullTimer = function (skullTimer) {
        this.skullTimer = skullTimer;
    };
    PlayerSave.prototype.getSkullType = function () {
        return this.skullType;
    };
    PlayerSave.prototype.setSkullType = function (skullType) {
        this.skullType = skullType;
    };
    PlayerSave.prototype.isRunning = function () {
        return this.running;
    };
    PlayerSave.prototype.setRunning = function (running) {
        this.running = running;
    };
    PlayerSave.prototype.getRunEnergy = function () {
        return this.runEnergy;
    };
    PlayerSave.prototype.setRunEnergy = function (runEnergy) {
        this.runEnergy = runEnergy;
    };
    PlayerSave.prototype.getTotalKills = function () {
        return this.totalKills;
    };
    PlayerSave.prototype.setTotalKills = function (totalKills) {
        this.totalKills = totalKills;
    };
    PlayerSave.prototype.getTargetKills = function () {
        return this.targetKills;
    };
    PlayerSave.prototype.setTargetKills = function (targetKills) {
        this.targetKills = targetKills;
    };
    PlayerSave.prototype.getNormalKills = function () {
        return this.normalKills;
    };
    PlayerSave.prototype.setNormalKills = function (normalKills) {
        this.normalKills = normalKills;
    };
    PlayerSave.prototype.getKillstreak = function () {
        return this.killstreak;
    };
    PlayerSave.prototype.setKillstreak = function (killstreak) {
        this.killstreak = killstreak;
    };
    PlayerSave.prototype.getHighestKillstreak = function () {
        return this.highestKillstreak;
    };
    PlayerSave.prototype.setHighestKillstreak = function (highestKillstreak) {
        this.highestKillstreak = highestKillstreak;
    };
    PlayerSave.prototype.getRecentKills = function () {
        return this.recentKills;
    };
    PlayerSave.prototype.setRecentKills = function (recentKills) {
        this.recentKills = recentKills;
    };
    PlayerSave.prototype.getDeaths = function () {
        return this.deaths;
    };
    PlayerSave.prototype.setDeaths = function (deaths) {
        this.deaths = deaths;
    };
    PlayerSave.prototype.getPoints = function () {
        return this.points;
    };
    PlayerSave.prototype.setPoints = function (points) {
        this.points = points;
    };
    PlayerSave.prototype.getPouches = function () {
        return this.pouches;
    };
    PlayerSave.prototype.setPouches = function (pouches) {
        this.pouches = pouches;
    };
    PlayerSave.prototype.getInventory = function () {
        return this.inventory;
    };
    PlayerSave.prototype.setInventory = function (inventory) {
        this.inventory = inventory;
    };
    PlayerSave.prototype.getEquipment = function () {
        return this.equipment;
    };
    PlayerSave.prototype.setEquipment = function (equipment) {
        this.equipment = equipment;
    };
    PlayerSave.prototype.getAppearance = function () {
        return this.appearance;
    };
    PlayerSave.prototype.setAppearance = function (appearance) {
        this.appearance = appearance;
    };
    PlayerSave.prototype.getSkills = function () {
        return this.skills;
    };
    PlayerSave.prototype.setSkills = function (skills) {
        this.skills = skills;
    };
    PlayerSave.prototype.getQuickPrayers = function () {
        return this.quickPrayers;
    };
    PlayerSave.prototype.setQuickPrayers = function (quickPrayers) {
        this.quickPrayers = quickPrayers;
    };
    PlayerSave.prototype.getFriends = function () {
        return this.friends;
    };
    PlayerSave.prototype.setFriends = function (friends) {
        this.friends = friends;
    };
    PlayerSave.prototype.getIgnores = function () {
        return this.ignores;
    };
    PlayerSave.prototype.setIgnores = function (ignores) {
        this.ignores = ignores;
    };
    PlayerSave.prototype.getBanks = function () {
        return this.banks;
    };
    PlayerSave.prototype.setBanks = function (banks) {
        this.banks = banks;
    };
    PlayerSave.prototype.getPresets = function () {
        return this.presets;
    };
    PlayerSave.prototype.setPresets = function (presets) {
        this.presets = presets;
    };
    PlayerSave.prototype.isDiscordLoginReturn = function () {
        return this.isDiscordLogin;
    };
    PlayerSave.prototype.setDiscordLogin = function (discordLogin) {
        this.isDiscordLogin = discordLogin;
    };
    PlayerSave.prototype.getCachedDiscordAccessToken = function () {
        return this.cachedDiscordAccessToken;
    };
    PlayerSave.prototype.setCachedDiscordAccessToken = function (cachedDiscordAccessToken) {
        this.cachedDiscordAccessToken = cachedDiscordAccessToken;
    };
    PlayerSave.prototype.getQuestPoints = function () {
        return this.questPoints;
    };
    PlayerSave.prototype.setQuestPoints = function (questPoints) {
        this.questPoints = questPoints;
    };
    PlayerSave.prototype.getQuestProgress = function () {
        return this.questProgress;
    };
    PlayerSave.prototype.setQuestProgress = function (questProgress) {
        this.questProgress = questProgress;
    };
    PlayerSave.prototype.applyToPlayer = function (player) {
        var e_1, _a, e_2, _b;
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
        try {
            for (var _c = __values(this.friends), _d = _c.next(); !_d.done; _d = _c.next()) {
                var l = _d.value;
                player.getRelations().getFriendList().push(l);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(this.ignores), _f = _e.next(); !_f.done; _f = _e.next()) {
                var l = _f.value;
                player.getRelations().getIgnoreList().push(l);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        for (var i = 0; i < player.getBanks().length; i++) {
            if (i == Bank_1.Bank.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            var bankItems = this.banks.get(i);
            if (bankItems != null) {
                player.setBank(i, new Bank_1.Bank(player)).getBank(i).addItems(bankItems, false);
            }
        }
    };
    PlayerSave.fromPlayer = function (player) {
        var playerSave = new PlayerSave();
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
        var banks = new Map();
        /** BANK **/
        for (var i = 0; i < player.banks.length; i++) {
            if (i === Bank_1.Bank.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(i) !== null) {
                banks.set(i, player.getBank(i).getValidItems());
            }
        }
        playerSave.banks = banks;
        return playerSave;
    };
    return PlayerSave;
}());
exports.PlayerSave = PlayerSave;
//# sourceMappingURL=PlayerSave.js.map