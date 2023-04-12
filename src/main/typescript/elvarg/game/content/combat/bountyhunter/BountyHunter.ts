import { Emblem } from "./Emblem";
import { TargetPair } from "./TargetPair";
import { WealthType } from "./WealthType";
import { CombatFactory } from "../CombatFactory";
import { ItemOnGroundManager } from "../../../entity/impl/grounditem/ItemOnGroundManager";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerBot } from "../../../entity/impl/playerbot/PlayerBot";
import { BrokenItem } from "../../../model/BrokenItem";
import { Item } from "../../../model/Item";
import { WildernessArea } from "../../../model/areas/impl/WildernessArea";
import { ItemIdentifiers } from "../../../../util/ItemIdentifiers";
import { Misc } from "../../../../util/Misc";
export class BountyHunter {
    public static PLAYERS_IN_WILD: Player[] = [];
    public static TARGET_PAIRS: TargetPair[] = [];
    private static TARGET_WEALTH_STRING = 23305;
    private static TARGET_NAME_STRING = 23307;
    private static TARGET_LEVEL_STRING = 23308;
    private static TARGET_SEARCH_DELAY_SECONDS = 80;
    private static TARGET_ABANDON_DELAY_SECONDS = 120;

    static process(player: Player) {
        const target: Player | undefined = BountyHunter.getTargetFor(player);
        if (player.getArea() instanceof WildernessArea) {
            if (!target) {
                if (player.getTargetSearchTimer().finished()) {
                    if (!BountyHunter.validTargetContester(player)) {
                        return;
                    }
                    for (const player2 of BountyHunter.PLAYERS_IN_WILD) {
                        if (BountyHunter.validTargetContester(player2)) {
                            // Check other stuff...
                            if (player === player2) {
                                continue;
                            }
                            if (player instanceof PlayerBot && player2 instanceof PlayerBot) {
                                continue;
                            }
                            if (player.getRecentKills().includes(player2.getHostAddress())) {
                                continue;
                            }
                            let combatDifference = CombatFactory.combatLevelDifference(
                                player.getSkillManager().getCombatLevel(),
                                player2.getSkillManager().getCombatLevel()
                            );

                            if (combatDifference < (player.getWildernessLevel() + 5) && combatDifference < (player2.getWildernessLevel() + 5)) {
                                BountyHunter.assign(player, player2);
                                break;
                            }
                        }
                    }
                    player.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
                }
            } else {
                if (target) {
                    let safeTimer = player.decrementAndGetSafeTimer();
                    if (safeTimer === 180 || safeTimer === 120 || safeTimer === 60) {
                        player.getPacketSender().sendMessage(`You have ${safeTimer} seconds to get back to the wilderness before you lose your target.`);
                        target?.getPacketSender().sendMessage(`Your target has ${safeTimer} seconds to get back to the wilderness before they lose you as target.`);
                    }
                    if (safeTimer === 0) {
                        BountyHunter.unassign(player);
                        player.getTargetSearchTimer().start(BountyHunter.TARGET_ABANDON_DELAY_SECONDS);
                        player.getPacketSender().sendMessage("You have lost your target.");

                        target?.getPacketSender()?.sendMessage("You have lost your target and will be given a new one shortly.");
                        target?.getTargetSearchTimer().start((BountyHunter.TARGET_SEARCH_DELAY_SECONDS / 2));
                    }
                }
            }
        }
    }

    static assign(player1: Player, player2: Player) {
        if (!BountyHunter.getPairFor(player1) && !BountyHunter.getPairFor(player2)) {
            let pair = new TargetPair(player1, player2);
            BountyHunter.TARGET_PAIRS.push(pair);
            player1.getPacketSender().sendMessage(`You've been assigned ${player2.getUsername()} as your target!`);
            player2.getPacketSender().sendMessage(`You've been assigned ${player1.getUsername()} as your target!`);
            player1.getPacketSender().sendEntityHint(player2);
            player2.getPacketSender().sendEntityHint(player1);
            player1.resetSafingTimer();
            player2.resetSafingTimer();
            BountyHunter.updateInterface(player1);
            BountyHunter.updateInterface(player2);
            if (player1 instanceof PlayerBot) {
                (player1 as PlayerBot).getCombatInteraction().targetAssigned(player2);
            } else if (player2 instanceof PlayerBot) {
                (player2 as PlayerBot).getCombatInteraction().targetAssigned(player1);
            }
        }
    }

    static unassign(player: Player) {
        let pair = BountyHunter.getPairFor(player);
        if (pair) {
            BountyHunter.TARGET_PAIRS.splice(BountyHunter.TARGET_PAIRS.indexOf(pair), 1);
            let p1 = pair.getPlayer1();
            let p2 = pair.getPlayer2();

            p1.getPacketSender().sendEntityHintRemoval(true);
            p2.getPacketSender().sendEntityHintRemoval(true);
            BountyHunter.updateInterface(p1);
            BountyHunter.updateInterface(p2);
            p1.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
            p2.getTargetSearchTimer().start(BountyHunter.TARGET_SEARCH_DELAY_SECONDS);
        }
    }



    static getTargetFor(player: Player): Player | undefined {
        let pair = BountyHunter.getPairFor(player);
        if (pair) {
            if (pair.getPlayer1() === player) {
                return pair.getPlayer2();
            }
            if (pair.getPlayer2() === player) {
                return pair.getPlayer1();
            }
        }
        return undefined;
    }

    static getPairFor(p: Player): TargetPair | undefined {
        for (let pair of BountyHunter.TARGET_PAIRS) {
            if (p === pair.getPlayer1() || p === pair.getPlayer2()) {
                return pair;
            }
        }
        return undefined;
    }

    static onDeath(killer: Player, killed: Player, canGetFullReward: boolean, minBloodMoneyReward: number) {
        // Cache the killed player's killstreak
        const enemyKillstreak = killed.getKillstreak();
        // Reset killed player's killstreak
        if (killed.getKillstreak() > 0) {
            killed.getPacketSender().sendMessage("You have lost your " + killed.getKillstreak() + " killstreak.");
        }
        killed.setKillstreak(0);

        // Increment killed player's deaths
        killed.incrementDeaths();

        // Update interfaces for killed player containing the new deaths etc
        killed.getPacketSender().sendString( "@or1@Deaths: " + killed.getDeaths(), 52031).sendString(
            "@or1@K/D Ratio: " + killed.getKillDeathRatio(), 52033);

        // Remove first index if we've killed 1
        if (killer.getRecentKills().length >= 1) {
            killer.getRecentKills().shift();
        }

        // Should the player be rewarded for this kill?
        let fullRewardPlayer = canGetFullReward;

        // Check if we recently killed this player
        if (killer.getRecentKills().indexOf(killed.getHostAddress()) !== -1
            || killer.getHostAddress() === killed.getHostAddress()) {
            fullRewardPlayer = false;
        } else {
            killer.getRecentKills().push(killed.getHostAddress());
        }

        const target = BountyHunter.getTargetFor(killer);

        // Check if the player killed was our target..
        if (target && target === killed) {

            // Send messages
            killed.getPacketSender().sendMessage("You were defeated by your target!");
            killer.getPacketSender().sendMessage("Congratulations, you managed to defeat your target!");

            // Increment killer's target kills
            killer.incrementTargetKills();

            // Reset targets
            BountyHunter.unassign(killer);

            // If player isnt farming kills..
            if (fullRewardPlayer && !(killed instanceof PlayerBot)) {

                // Search for emblem in the player's inventory
                let inventoryEmblem = null;
                for (let i = 0; i < Emblem.length; i++) {
                    if (killer.getInventory().contains(Emblem[i].id)) {
                        inventoryEmblem = Emblem[i];
                        // Keep looping, find best emblem.
                    }
                }

                // This emblem can't be upgraded more..
                if (inventoryEmblem != null) {
                    if (inventoryEmblem != Emblem[9].name) {

                        // We found an emblem. Upgrade it!
                        // Double check that we have it inventory one more time
                        if (killer.getInventory().contains(inventoryEmblem.id)) {
                            killer.getInventory().delete(inventoryEmblem.id, 1);

                            let nextEmblemId = 1;

                            // Mysterious emblem tier 1 has a noted version too...
                            // So add 2 instead of 1 to skip it.
                            if (inventoryEmblem == Emblem[0].name) {
                                nextEmblemId = 2;
                            }

                            // Add the next emblem and notify the player
                            killer.getInventory().addItem(inventoryEmblem.id + nextEmblemId);
                            killer.getPacketSender().sendMessage("@red@Your mysterious emblem has been upgraded!");
                        }
                    } else {
                        // This emblem can't be upgraded more..
                        killer.getPacketSender().sendMessage(
                            "@red@Your mysterious emblem is already tier 10 and cannot be upgraded further.");
                    }
                }

                // Randomly drop an emblem (50% chance) when killing a target.
                if (Misc.getRandom(10) <= 5) {
                    ItemOnGroundManager.registerNonGlobals(killer, new Item(Emblem[0].id, 1),
                        killed.getLocation());
                    killer.getPacketSender().sendMessage(
                        "@red@You have been awarded with a mysterious emblem for successfully killing your target.");
                } else {
                    killer.getPacketSender().sendMessage(
                        "@red@You did not receive an emblem for this target kill. Better luck next time!");
                }
            }
        } else {
            if (fullRewardPlayer) {
                // Increment regular kills since we didn't kill a target.
                killer.incrementKills();
            }
        }

        var additionalBloodMoneyFromBrokenItems = (BrokenItem.getValueLoseOnDeath(killed) * 3) / 4; // only 75%

        if (fullRewardPlayer) {
            // Increment total kills..
            killer.incrementTotalKills();

            // Increment killstreak..
            killer.incrementKillstreak();

            // Update interfaces
            killer.getPacketSender().sendString( "@or1@Killstreak: " + killer.getKillstreak(), 52029)
                .sendString("@or1@Kills: " + killer.getTotalKills(), 52030)
                .sendString("@or1@K/D Ratio: " + killer.getKillDeathRatio(), 52033);

            if (!(killer instanceof PlayerBot)) {
                // Reward player for the kill..
                let rewardAmount: number = 130 + (100 * enemyKillstreak) + (150 * killer.getKillstreak())
                    + (10 * killer.getWildernessLevel()) + additionalBloodMoneyFromBrokenItems;

                if (killer.getInventory().contains(ItemIdentifiers.BLOOD_MONEY)
                    || killer.getInventory().getFreeSlots() > 0) {
                    killer.getInventory().adds(ItemIdentifiers.BLOOD_MONEY, rewardAmount);
                } else {
                    ItemOnGroundManager.registerNonGlobals(killer, new Item(ItemIdentifiers.BLOOD_MONEY, rewardAmount),
                        killed.getLocation());
                }
                killer.getPacketSender().sendMessage("You've received " + rewardAmount + " blood money for that kill!");
            }
            // Check if the killstreak is their highest yet..
            if (killer.getKillstreak() > killer.getHighestKillstreak()) {
                killer.setHighestKillstreak(killer.getKillstreak());
                killer.getPacketSender().sendMessage(
                    "Congratulations! Your highest killstreak is now " + killer.getHighestKillstreak() + "");
            } else {
                killer.getPacketSender().sendMessage("Your killstreak is now " + killer.getKillstreak() + ".");
            }

        } else {
            // Reward player for the kill..
            const rewardAmount = minBloodMoneyReward + Misc.getRandom(minBloodMoneyReward) + additionalBloodMoneyFromBrokenItems;

            if (killer.getInventory().contains(ItemIdentifiers.BLOOD_MONEY)
                || killer.getInventory().getFreeSlots() > 0) {
                killer.getInventory().adds(ItemIdentifiers.BLOOD_MONEY, rewardAmount);
            } else {
                ItemOnGroundManager.registerNonGlobals(killer, new Item(ItemIdentifiers.BLOOD_MONEY, rewardAmount),
                    killed.getLocation());
            }

            killer.getPacketSender().sendMessage("You've received " + rewardAmount + " blood money for that kill!");
        }

        // Update interfaces
        BountyHunter.updateInterface(killer);
        BountyHunter.updateInterface(killed);
    }

    public static updateInterface(player: Player) {
        /*
         * Optional<Player> target = getTargetFor(player);
         * 
         * // Check if we have a target... if (target.isPresent()) {
         * 
         * // We have a target - send info on interface.. final WealthType type =
         * WealthType.getWealth(target.get());
         * 
         * // Send strings player.getPacketSender().sendString(TARGET_WEALTH_STRING,
         * "Wealth: " + type.tooltip) .sendString(TARGET_NAME_STRING,
         * target.get().getUsername()) .sendString(TARGET_LEVEL_STRING, "Combat: " +
         * target.get().getSkillManager().getCombatLevel());
         * 
         * // Send wealth type showWealthType(player, type); } else {
         * 
         * // No target - reset target info on interface..
         * 
         * // Send strings.. player.getPacketSender().sendString(TARGET_WEALTH_STRING,
         * "---").sendString(TARGET_NAME_STRING, "None")
         * .sendString(TARGET_LEVEL_STRING, "Combat: ------");
         * 
         * // Send wealth type.. showWealthType(player, WealthType.NO_TARGET); }
         * 
         * // Update kda information.. player.getPacketSender().sendString(23323,
         * "Targets killed: " + player.getTargetKills()) .sendString(23324,
         * "Players killed: " + player.getNormalKills()) .sendString(23325, "Deaths: " +
         * player.getDeaths());
         * 
         */
    }

    public static showWealthType(player: Player, type: WealthType) {
        for (const types of Object.values(WealthType)) {
            let state = 0;
        
            if (types === type) {
              state = 1;
            }
        
            player.getPacketSender().sendConfig(types.configId, state);
        }
    }

    public static getValueForEmblems(player: Player, performSale: boolean) {
        let list: any[];
        for (let emblem of Object.values(Emblem)) {
            if (player.getInventory().contains(emblem.id)) {
                list.push(emblem);
            }
        }
        if (list.length === 0) {
            return 0;
        }
        let value = 0;
        for (let emblem of list) {
            let amount = player.getInventory().getAmount(emblem.id);
            if (amount > 0) {

                if (performSale) {
                    player.getInventory().deleteNumber(emblem.id, amount);
                    player.getInventory().adds(ItemIdentifiers.BLOOD_MONEY, (emblem.value * amount));
                }

                value += (emblem.value * amount);
            }
        }
        return value;
    }

    private static validTargetContester(p: Player): boolean {
        return (
            p != null &&
            p.isRegistered() &&
            p.getArea() instanceof WildernessArea &&
            p.getWildernessLevel() > 0 &&
            !p.isUntargetable() &&
            p.getHitpoints() > 0 &&
            !p.isNeedsPlacement() &&
            BountyHunter.getPairFor(p) !== undefined
          );
    }
}
