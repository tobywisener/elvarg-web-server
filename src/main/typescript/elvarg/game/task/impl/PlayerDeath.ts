import { GameConstants } from "../../GameConstants";
import { ItemsKeptOnDeath } from "../../content/ItemsKeptOnDeath";
import { CombatFactory } from "../../content/combat/CombatFactory";
import { Emblem } from "../../content/combat/bountyhunter/Emblem";
import { Presetables } from "../../content/presets/Presetables";
import { ItemDefinition } from "../../definition/ItemDefinition";
import { ItemOnGroundManager } from "../../entity/impl/grounditem/ItemOnGroundManager";
import { Player } from "../../entity/impl/player/Player";
import { PlayerBot } from "../../entity/impl/playerbot/PlayerBot";
import { PlayerRights } from "../../model/rights/PlayerRights";
import { Task } from "../Task";
import { Item } from "../../model/Item";
import { PrayerHandler } from "../../content/PrayerHandler";
import { Location } from "../../model/Location";
import { BrokenItem } from "../../model/BrokenItem";
import { Animation } from "../../model/Animation";

export class PlayerDeathTask extends Task {
    private player: Player;
    private killer: Player | undefined;
    private loseItems = true;
    private itemsToKeep: Item[] = [];
    private ticks = 2;


    constructor(player: Player) {
        super(1, false);
        this.player = player;
        this.killer = player.getCombat().getKiller(true);
    }

    public execute() {
        if (!this.player) {
            this.stop();
            return;
        }
        try {
            switch (this.ticks) {
                case 0: {
                    if (this.player instanceof PlayerBot) {
                        (this.player as PlayerBot).getCombatInteraction().handleDeath(this.killer);
                    }
                    if (this.player.getArea() != null) {
                        this.loseItems = this.player.getArea().dropItemsOnDeath(this.player, this.killer);
                    }
                    const droppedItems: Item[] = [];
                    if (this.loseItems) {
                        this.itemsToKeep = ItemsKeptOnDeath.getItemsToKeep(this.player);
                        const playerItems = this.player.getInventory().getValidItems().concat(this.player.getEquipment().getValidItems());
                        const position = this.player.getLocation();
                        let dropped = false;

                        for (let item of playerItems) {
                            // Keep tradeable items
                            if (!item.getDefinition().isTradeable() || this.itemsToKeep.includes(item)) {
                                if (!this.itemsToKeep.includes(item)) {
                                    this.itemsToKeep.push(item);
                                }
                                continue;
                            }
                            // Don't drop items if we're owner or dev
                            if (this.player.getRights() === PlayerRights.OWNER || this.player.getRights() === PlayerRights.DEVELOPER) {
                                break;
                            }

                            // Drop emblems but downgrade them a tier.
                            if (
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_1.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_2.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_3.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_4.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_5.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_6.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_7.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_8.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_9.id ||
                                item.getId() === Emblem.MYSTERIOUS_EMBLEM_10.id
                            ) {
                                // Tier 1 shouldnt be dropped cause it cant be downgraded
                                if (item.getId() === Emblem.MYSTERIOUS_EMBLEM_1.id) {
                                    continue;
                                }
                                if (this.killer) {
                                    const lowerEmblem =
                                        item.getId() === Emblem.MYSTERIOUS_EMBLEM_2.id ? item.getId() - 2 : item.getId() - 1;
                                    ItemOnGroundManager.registerNonGlobals(
                                        this.killer,
                                        new Item(lowerEmblem),
                                        position
                                    );
                                    this.killer.getPacketSender().sendMessage(
                                        "@red@" +
                                        this.player.getUsername() +
                                        " dropped a " +
                                        ItemDefinition.forId(lowerEmblem).getName() +
                                        "!"
                                    );
                                    dropped = true;
                                }

                                continue;
                            }

                            droppedItems.push(item);

                            // Drop item
                            ItemOnGroundManager.registerLocation(
                                this.killer ? this.killer : this.player,
                                item,
                                position
                            );
                            dropped = true;
                        }

                        // Handle defeat..
                        if (this.killer) {
                            if (this.killer.getArea() != null) {
                                this.killer.getArea().defeated(this.killer, this.player);
                            }
                            if (!dropped) {
                                this.killer.getPacketSender().sendMessage(`${this.player.getUsername()} had no valuable items to be dropped.`);
                            }
                        }

                        // Reset items
                        this.player.getInventory().resetItems().refreshItems();
                        this.player.getEquipment().resetItems().refreshItems();
                    }
                    // Restore the player's default attributes (such as stats)..
                    this.player.resetAttributes();

                    // If the player lost items..
                    if (this.loseItems) {
                        // Handle items kept on death..
                        if (this.itemsToKeep.length > 0) {
                            for (const it of this.itemsToKeep) {
                                let id = it.getId();
                                const brokenItem = BrokenItem.get(id);
                                if (brokenItem != null) {
                                    id = brokenItem.getBrokenItem();
                                    this.player.getPacketSender().sendMessage(`Your ${ItemDefinition.forId(it.getId()).getName()} has been broken. You can fix it by talking to Perdu.`);
                                }
                                this.player.getInventory().adds(id, it.getAmount());
                            }
                            this.itemsToKeep.length = 0;
                        }
                    }

                    let handledDeath: boolean = false;

                    if (this.player.getArea() != null) {
                        handledDeath = this.player.getArea().handleDeath(this.player, this.killer);
                    }

                    if (!handledDeath) {
                        this.player.moveTo(GameConstants.DEFAULT_LOCATION);
                        if (this.loseItems) {
                            if (this.player.isOpenPresetsOnDeath()) {
                                Presetables.opens(this.player);
                            }
                        }
                    }

                    // Stop the event..
                    stop();
                    break;
                }

                case 2: {
                    if (this.player instanceof PlayerBot) {
                        (<PlayerBot>this.player).getCombatInteraction().handleDying(this.killer);
                    }

                    // Reset combat..
                    this.player.getCombat().reset();

                    // Reset movement queue and disable it..
                    this.player.getMovementQueue().setBlockMovement(true).reset();

                    // Mark us as untargetable..
                    this.player.setUntargetable(true);

                    // Close all open interfaces..
                    this.player.getPacketSender().sendInterfaceRemoval();

                    // Send death message..
                    this.player.getPacketSender().sendMessage("Oh dear, you are dead!");

                    // Perform death animation..
                    this.player.performAnimation(new Animation(836));

                    // Handle retribution prayer effect on our killer, if present..
                    if (PrayerHandler.isActivated(this.player, PrayerHandler.RETRIBUTION)) {
                        if (typeof this.killer !== 'undefined' && this.killer !== null) {
                            CombatFactory.handleRetribution(this.player, this.killer);
                        }
                    }
                    break;
                }
            }
            this.ticks--;
        } catch (e) {
            super.stop();
            console.error(e);
            this.player.resetAttributes();
            this.player.moveTo(GameConstants.DEFAULT_LOCATION);
        }
    }
}
