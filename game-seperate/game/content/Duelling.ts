import { Player } from "../entity/impl/player/Player";
import { ItemContainer } from "../model/container/ItemContainer";
import { SecondsTimer } from "../model/SecondsTimer";
import { PlayerStatus } from "../model/PlayerStatus";
import { Misc } from "../../util/Misc";
import { ItemDefinition } from "../definition/ItemDefinition";
import { Inventory } from "../model/container/impl/Inventory";
import { Equipment } from "../model/container/impl/Equipment";
import { Trading } from "./Trading";
import { StackType } from "../model/container/StackType";
import { Item } from "../model/Item";
import { Location } from "../model/Location";

class PlayerItemContainer extends ItemContainer {
    constructor(player, private readonly execFunc: Function) {
      super(player);
    }

    stackType() {
      return StackType.DEFAULT;
    }

    refreshItems(): ItemContainer {
      this.execFunc();
      return this;
    }

    full(): ItemContainer {
        this.getPlayer().getPacketSender().sendMessage("You cannot stake more items.");
        return this;
    }

    capacity() {
      return 28;
    }
  }

export class Dueling {
    public static readonly MAIN_INTERFACE_CONTAINER = 6669;
    private static readonly DUELING_WITH_FRAME = 6671;
    private static readonly INTERFACE_ID = 6575;
    private static readonly CONFIRM_INTERFACE_ID = 6412;
    private static readonly SCOREBOARD_INTERFACE_ID = 6733;
    private static readonly SCOREBOARD_CONTAINER = 6822;
    private static readonly SCOREBOARD_USERNAME_FRAME = 6840;
    private static readonly SCOREBOARD_COMBAT_LEVEL_FRAME = 6839;
    private static readonly SECOND_INTERFACE_CONTAINER = 6670;
    private static readonly STATUS_FRAME_1 = 6684;
    private static readonly STATUS_FRAME_2 = 6571;
    private static readonly ITEM_LIST_1_FRAME = 6516;
    private static readonly ITEM_LIST_2_FRAME = 6517;
    private static readonly RULES_FRAME_START = 8242;
    private static readonly RULES_CONFIG_ID = 286;
    private static readonly TOTAL_WORTH_FRAME = 24234;
    private player: Player;
    private container: ItemContainer;
    // Rules
    private rules: boolean[];
    private interact: Player;
    private configValue: number;
    private state: DuelState = DuelState.NONE;
    // Delays!!
    private button_delay = new SecondsTimer();
    private request_delay = new SecondsTimer();


    constructor(player: Player) {
        this.rules = Array(Object.values(DuelRule).length).fill(false);
        this.player = player;
        this.container = new PlayerItemContainer(player, () =>{
                player.getPacketSender().sendInterfaceSet(Dueling.INTERFACE_ID, Trading.CONTAINER_INVENTORY_INTERFACE);
                player.getPacketSender().sendItemContainer(player.getInventory(),
                    Trading.INVENTORY_CONTAINER_INTERFACE);
                player.getPacketSender().sendInterfaceItems(Dueling.MAIN_INTERFACE_CONTAINER,
                    player.getDueling().getContainer().getValidItems());
                player.getPacketSender().sendInterfaceItems(Dueling.SECOND_INTERFACE_CONTAINER,
                    this.interact.getDueling().getContainer().getValidItems());
                    this.interact.getPacketSender().sendInterfaceItems(Dueling.MAIN_INTERFACE_CONTAINER,
                    this.interact.getDueling().getContainer().getValidItems());
                    this.interact.getPacketSender().sendInterfaceItems(Dueling.SECOND_INTERFACE_CONTAINER,
                    player.getDueling().getContainer().getValidItems());
                return this;
        })
    }

    private static validate(player: Player, interact: Player, playerStatus: PlayerStatus, ...duelStates: DuelState[]): boolean {
        // Verify player...
        if (player == null || interact == null) {
            return false;
        }

        // Make sure we have proper status
        if (playerStatus != null) {
            if (player.getStatus() != playerStatus) {
                return false;
            }

            // Make sure we're interacting with eachother
            if (interact.getStatus() != playerStatus) {
                return false;
            }
        }

        if (player.getDueling().getInteract() == null || player.getDueling().getInteract() != interact) {
            return false;
        }
        if (interact.getDueling().getInteract() == null || interact.getDueling().getInteract() != player) {
            return false;
        }

        // Make sure we have proper duel state.
        let found = false;
        for (let duelState of duelStates) {
            if (player.getDueling().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }

        // Do the same for our interact
        found = false;
        for (let duelState of duelStates) {
            if (interact.getDueling().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return true;
    }

    public requestDuel(t_: Player) {
        if (this.state == DuelState.NONE || this.state == DuelState.REQUESTED_DUEL) {
            // Make sure to not allow flooding!
            if (!this.request_delay.finished()) {
                let seconds = this.request_delay.secondsRemaining();
                this.player.getPacketSender().sendMessage(`You must wait another ${seconds == 1 ? "second" : `${seconds} seconds`} before sending more duel challenges.`);
                return;
            }

            // The other players' current duel state.
            const t_state = t_.getDueling().getState();

            // Should we initiate the duel or simply send a request?
            let initiateDuel = false;

            // Update this instance...
            this.setInteract(t_);
            this.setState(DuelState.REQUESTED_DUEL);

            // Check if target requested a duel with us...
            if (t_state == DuelState.REQUESTED_DUEL) {
                if (t_.getDueling().getInteract() != null && t_.getDueling().getInteract() == this.player) {
                    initiateDuel = true;
                }
            }

            // Initiate duel for both players with eachother?
            if (initiateDuel) {
                this.player.getDueling().initiateDuel();
                t_.getDueling().initiateDuel();
            } else {
                this.player.getPacketSender().sendMessage(`You've sent a duel challenge to ${t_.getUsername()}...`);
                t_.getPacketSender().sendMessage(`${this.player.getUsername()}:duelreq:`);

                if (t_.isPlayerBot()) {
                    // Player Bots: Automatically accept any duel request
                    t_.getDueling().requestDuel(this.player);
                }
            }

            // Set the request delay to 2 seconds at least.
            this.request_delay.start(2);
        } else {
            this.player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    }

    public initiateDuel() {
        // Set our duel state
        this.setState(DuelState.DUEL_SCREEN);

        // Set our player status
        this.player.setStatus(PlayerStatus.DUELING);

        // Reset right click options
        this.player.getPacketSender().sendInteractionOption("null", 2, true);
        this.player.getPacketSender().sendInteractionOption("null", 1, false);

        // Reset rule toggle configs
        this.player.getPacketSender().sendConfig(Dueling.RULES_CONFIG_ID, 0);

        // Update strings on interface
        this.player.getPacketSender()
            .sendString(`@or1@Dueling with: @whi@${this.interact.getUsername()}@or1@          Combat level: @whi@${this.interact.getSkillManager().getCombatLevel()}`, Dueling.DUELING_WITH_FRAME,)
            .sendString("", Dueling.STATUS_FRAME_1).sendString( "Lock Weapon", 669)
            .sendString("Neither player is allowed to change weapon.", 8278);

        // Send equipment on the interface..
        let equipSlot = 0;
        for (let item of this.player.getEquipment().getItems()) {
            this.player.getPacketSender().sendItemOnInterface(13824, item.getId(), equipSlot, item.getAmount());
            equipSlot++;
        }

        // Reset container
        this.container.resetItems();

        // Refresh and send container...
        this.container.refreshItems();
    }

    public closeDuel() {
        if (this.state != DuelState.NONE) {

            // Cache the current interact
            const interact_ = this.interact;

            // Return all items...
            for (let t of this.container.getValidItems()) {
                this.container.switchItems(this.player.getInventory(), t.clone(), false, false);
            }

            // Refresh inventory
            this.player.getInventory().refreshItems();

            // Reset all attributes...
            this.resetAttributes();

            // Send decline message
            this.player.getPacketSender().sendMessage("Duel declined.");
            this.player.getPacketSender().sendInterfaceRemoval();

            // Reset/close duel for other player aswell (the cached interact)
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus.DUELING) {
                    if (interact_.getDueling().getInteract() != null && interact_.getDueling().getInteract() == this.player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    }

    public resetAttributes() {

        // Reset duel attributes
        this.setInteract(null);
        this.setState(DuelState.NONE);

        // Reset player status if it's dueling.
        if (this.player.getStatus() == PlayerStatus.DUELING) {
            this.player.setStatus(PlayerStatus.NONE);
        }

        // Reset container..
        this.container.resetItems();

        // Reset rules
        for (let i = 0; i < this.rules.length; i++) {
            this.rules[i] = false;
        }

        // Clear toggles
        this.configValue = 0;
        this.player.getPacketSender().sendConfig(Dueling.RULES_CONFIG_ID, 0);

        // Update right click options..
        this.player.getPacketSender().sendInteractionOption("Challenge", 1, false);
        this.player.getPacketSender().sendInteractionOption("null", 2, true);

        // Clear head hint
        this.player.getPacketSender().sendEntityHintRemoval(true);

        // Clear items on interface
        this.player.getPacketSender().clearItemOnInterface(Dueling.MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(Dueling.SECOND_INTERFACE_CONTAINER);
    }


    public handleItem(id: number, amount: number, slot: number, from: ItemContainer, to: ItemContainer) {
        if (this.player.getInterfaceId() == Dueling.INTERFACE_ID) {

            // Validate this stake action..
            if (!Dueling.validate(this.player, this.interact, PlayerStatus.DUELING,
                ...[DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN])) {
                return;
            }

            if (ItemDefinition.forId(id).getValue() == 0) {
                this.player.getPacketSender().sendMessage("There's no point in staking that. It's spawnable!");
                return;
            }

            // Check if the duel was previously accepted (and now modified)...
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);

            // Handle the item switch..
            if (this.state == DuelState.DUEL_SCREEN && this.interact.getDueling().getState() == DuelState.DUEL_SCREEN) {

                // Check if the item is in the right place
                if (from.getItems()[slot].getId() == id) {

                    // Make sure we can fit that amount in the duel
                    if (from instanceof Inventory) {
                        if (!ItemDefinition.forId(id).isStackable()) {
                            if (amount > this.container.getFreeSlots()) {
                                amount = this.container.getFreeSlots();
                            }
                        }
                    }

                    if (amount <= 0) {
                        return;
                    }

                    const item = new Item(id, amount);

                    // Only sort items if we're withdrawing items from the duel.
                    const sort = (from == (this.player.getDueling().getContainer()));

                    // Do the switch!
                    if (item.getAmount() == 1) {
                        from.switchItem(to, item, sort, slot, true);
                    } else {
                        from.switchItems(to, item, sort, true);
                    }
                }
            } else {
                this.player.getPacketSender().sendInterfaceRemoval
            }
        }
    }

    public acceptDuel() {

        // Validate this stake action..
        if (!Dueling.validate(this.player, this.interact, PlayerStatus.DUELING, ...[DuelState.DUEL_SCREEN,
        DuelState.ACCEPTED_DUEL_SCREEN, DuelState.CONFIRM_SCREEN, DuelState.ACCEPTED_CONFIRM_SCREEN])) {
            return;
        }

        // Check button delay...
        if (!this.button_delay.finished()) {
            return;
        }

        // Cache the interact...
        const interact_ = this.interact;

        // Interact's current trade state.
        const t_state: DuelState = interact_.getDueling().getState();

        // Check which action to take..
        if (this.state == DuelState.DUEL_SCREEN) {

            // Verify that the interact can receive all items first..
            const slotsRequired = this.getFreeSlotsRequired(this.player);
            if (this.player.getInventory().getFreeSlots() < slotsRequired) {
                this.player.getPacketSender()
                    .sendMessage(`You need at least ${slotsRequired} free inventory slots for this duel.`);
                return;
            }

            if (this.rules[DuelRule.NO_MELEE.getButtonId()] && this.rules[DuelRule.NO_RANGED.getButtonId()]
                && this.rules[DuelRule.NO_MAGIC.getButtonId()]) {
                this.player.getPacketSender().sendMessage("You must enable at least one of the three combat styles.");
                return;
            }

            // Both are in the same state. Do the first-stage accept.
            this.setState(DuelState.ACCEPTED_DUEL_SCREEN);

            // Update status...
            this.player.getPacketSender().sendString( "Waiting for other player..", Dueling.STATUS_FRAME_1);
            interact_.getPacketSender().sendString( `${this.player.getUsername()} has accepted.`, Dueling.STATUS_FRAME_1);

            // Check if both have accepted..
            if (t_state === DuelState.ACCEPTED_DUEL_SCREEN) {

                // Technically here, both have accepted.
                // Go into confirm screen!
                this.player.getDueling().confirmScreen();
                interact_.getDueling().confirmScreen();
            } else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        } else if (this.state === DuelState.CONFIRM_SCREEN) {
            // Both are in the same state. Do the second-stage accept.
            this.setState(DuelState.ACCEPTED_CONFIRM_SCREEN);

            // Update status...
            this.player.getPacketSender().sendString(`Waiting for ${interact_.getUsername()}'s confirmation..`, Dueling.STATUS_FRAME_2);
            interact_.getPacketSender().sendString(`${this.player.getUsername()} has accepted. Do you wish to do the same?`, Dueling.STATUS_FRAME_2);

            // Check if both have accepted..
            if (t_state === DuelState.ACCEPTED_CONFIRM_SCREEN) {
                // Both accepted, start duel

                // Decide where they will spawn in the arena..
                const obstacle = this.rules[DuelRule.OBSTACLES.forId(11)];
                const movementDisabled = this.rules[DuelRule.NO_MOVEMENT.forId(10)];

                let pos1 = this.getRandomSpawn(obstacle);
                let pos2 = this.getRandomSpawn(obstacle);

                // Make them spawn next to each other
                if (movementDisabled) {
                    pos2 = pos1.clone().add(-1, 0);
                }

                this.player.getDueling().startDuel(pos1);
                interact_.getDueling().startDuel(pos2);
            } else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        }

        this.button_delay.start(1);
    }

    public getRandomSpawn(obstacle: boolean): Location {
        if (obstacle) {
            return new Location( 3366 + Misc.getRandom(11), 3246 + Misc.getRandom(6));
        }
        return new Location(3335 + Misc.getRandom(11), 3246 + Misc.getRandom(6));
    }

    private confirmScreen() {
        // Update state
        this.player.getDueling().setState(DuelState.CONFIRM_SCREEN);

        // Send new interface frames
        let this_items = Trading.listItems(this.container);
        let interact_item = Trading.listItems(this.interact.getDueling().getContainer());
        this.player.getPacketSender().sendString(this_items, Dueling.ITEM_LIST_1_FRAME);
        this.player.getPacketSender().sendString(interact_item, Dueling.ITEM_LIST_2_FRAME);

        // Reset all previous strings related to rules
        for (let i = 8238; i <= 8253; i++) {
            this.player.getPacketSender().sendString("", i);
        }

        // Send new ones
        this.player.getPacketSender().sendString("Hitpoints will be restored.", 8250);
        this.player.getPacketSender().sendString( "Boosted stats will be restored.", 8238);
        if (this.rules[DuelRule.OBSTACLES.forId(11)]) {
            this.player.getPacketSender().sendString( "@red@There will be obstacles in the arena.", 8239);
        }
        this.player.getPacketSender().sendString("", 8240);
        this.player.getPacketSender().sendString("", 8241);

        let ruleFrameIndex = Dueling.RULES_FRAME_START;
        for (let i = 0; i < Object.values(DuelRule).length; i++) {
            if (i == DuelRule.OBSTACLES.forId(11))
                continue;
            if (this.rules[i]) {
                this.player.getPacketSender().sendString("" + DuelRule.forButtonId(i).toString(), ruleFrameIndex);
                ruleFrameIndex++;
            }
        }

        this.player.getPacketSender().sendString("", Dueling.STATUS_FRAME_2);

        // Send new interface..
        this.player.getPacketSender().sendInterfaceSet(Dueling.CONFIRM_INTERFACE_ID, Inventory.INTERFACE_ID);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);
    }

    public checkRules(button: number): boolean {
        let rule = DuelRule.forButtonId(button);
        if (rule != null) {
            this.checkRule(rule);
            return true;
        }
        return false;
    }

    public checkRule(rule: DuelRule) {

        // Check if we're actually dueling..
        if (this.player.getStatus() != PlayerStatus.DUELING) {
            return;
        }

        // Verify stake...
        if (!Dueling.validate(this.player, this.interact, PlayerStatus.DUELING,
            ...[DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN])) {
            return;
        }

        // Verify our current state..
        if (this.state == DuelState.DUEL_SCREEN || this.state == DuelState.ACCEPTED_DUEL_SCREEN) {

            // Toggle the rule..
            if (!this.rules[rule.getButtonId()]) {
                this.rules[rule.getButtonId()] = true;
                this.configValue += rule.getConfigId();
            } else {
                this.rules[rule.getButtonId()] = false;
                this.configValue -= rule.getConfigId();
            }

            // Update interact's rules to match ours.
            this.interact.getDueling().setConfigValue(this.configValue);
            this.interact.getDueling().getRules()[rule.getButtonId()] = this.rules[rule.getButtonId()];

            // Send toggles for both players.
            this.player.getPacketSender().sendToggle(Dueling.RULES_CONFIG_ID, this.configValue);
            this.interact.getPacketSender().sendToggle(Dueling.RULES_CONFIG_ID, this.configValue);

            // Send modify status
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString("@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);
            this.interact.getPacketSender().sendString( "@red@DUEL MODIFIED!", Dueling.STATUS_FRAME_1);

            // Inform them about this "custom" rule.
            if (rule == DuelRule.LOCK_WEAPON && this.rules[rule.forId(5)]) {
                this.player.getPacketSender()
                    .sendMessage(
                        "@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
                this.interact.getPacketSender()
                    .sendMessage(
                        "@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
            }
        }
    }

    public startDuel(telePos: Location) {
        // Set current duel state
        this.setState(DuelState.STARTING_DUEL);

        // Close open interfaces
        this.player.getPacketSender().sendInterfaceRemoval();

        // Unequip items based on the rules set for this duel
        for (let i = 11; i < this.rules.length; i++) {
            const rule = DuelRule.forButtonId(i);
            if (this.rules[i]) {
                if (rule.getEquipmentSlot() < 0)
                    continue;
                if (this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getId() > 0) {
                    const item = new Item(this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getId(),
                        this.player.getEquipment().getItems()[rule.getEquipmentSlot()].getAmount());
                    this.player.getEquipment().deletes(item);
                    this.player.getInventory().addItem(item);
                }
            }
        }
        if (this.rules[DuelRule.NO_WEAPON.forId(16)] || this.rules[DuelRule.NO_SHIELD.forId(18)]) {
            if (this.player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() > 0) {
                if (ItemDefinition.forId(this.player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId())
                    .isDoubleHanded()) {
                    const item = new Item(this.player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId(),
                        this.player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getAmount());
                    this.player.getEquipment().deletes(item);
                    this.player.getInventory().addItem(item);
                }
            }
        }

        this.player.getPacketSender().clearItemOnInterface(Dueling.MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(Dueling.SECOND_INTERFACE_CONTAINER);

        // Update right click options..
        this.player.getPacketSender().sendInteractionOption("Attack", 2, true);
        this.player.getPacketSender().sendInteractionOption("null", 1, false);

        // Reset attributes..
        this.player.resetAttributes();

        // Freeze the player
        if (this.rules[DuelRule.NO_MOVEMENT.forId(10)]) {
            this.player.getMovementQueue().reset().setBlockMovement(true);
        }

        // Send interact hints
        this.player.getPacketSender().sendPositionalHint(this.interact.getLocation().clone(), 10);
        this.player.getPacketSender().sendEntityHint(this.interact);

        // Teleport the player
        this.player.moveTo(telePos);

        // Make them interact with eachother
        this.player.setMobileInteraction(this.interact);

        // Send countdown as a task
        setTimeout(() => {
            let timer = 3;
            const countdown = setInterval(() => {
                if (this.player.getDueling().getState() != DuelState.STARTING_DUEL) {
                    clearInterval(countdown);
                    return;
                }
                if (timer === 3 || timer === 2 || timer === 1) {
                    this.player.forceChat(`${timer}..`);
                } else {
                    this.player.getDueling().setState(DuelState.IN_DUEL);
                    this.player.forceChat("FIGHT!!");
                    clearInterval(countdown);
                }
                timer--;
            }, 1000);
        }, 2000);
    }

    public duelLost() {
        // Make sure both players are in a duel..
        if (Dueling.validate(this.player, this.interact, null, ...[DuelState.STARTING_DUEL, DuelState.IN_DUEL]))  {
            // Add won items to a list..
            let totalValue = 0;
            let winnings: Item[] = [];
            for (let item of this.interact.getDueling().getContainer().getValidItems()) {
                this.interact.getInventory().addItem(item);
                winnings.push(item);
                totalValue += item.getDefinition().getValue();
            }
            for (let item of this.player.getDueling().getContainer().getValidItems()) {
                this.interact.getInventory().addItem(item);
                winnings.push(item);
                totalValue += item.getDefinition().getValue();
            }

            // Send interface data..
            this.interact.getPacketSender().sendString(this.player.getUsername(), Dueling.SCOREBOARD_USERNAME_FRAME)
                .sendString( "" + this.player.getSkillManager().getCombatLevel(), Dueling.SCOREBOARD_COMBAT_LEVEL_FRAME)
                .sendString(
                "@yel@Total: @or1@" + Misc.insertCommasToNumber("" + totalValue + "") + " value!", Dueling.TOTAL_WORTH_FRAME);

            // Send winnings onto interface
            this.interact.getPacketSender().sendInterfaceItems(Dueling.SCOREBOARD_CONTAINER, winnings);

            // Send the scoreboard interface
            this.interact.getPacketSender().sendInterface(Dueling.SCOREBOARD_INTERFACE_ID);

            // Restart the winner's stats
            this.interact.resetAttributes();

            // Move players home
            let spawn = new Location(3366, 3266);
            this.interact.moveTo(spawn.clone().add(Misc.getRandom(4), Misc.getRandom(2)));
            this.player.moveTo(spawn.clone().add(Misc.getRandom(4), Misc.getRandom(2)));

            // Send messages
            this.interact.getPacketSender().sendMessage("You won the duel!");
            this.player.getPacketSender().sendMessage("You lost the duel!");

            // Reset attributes for both
            this.interact.getDueling().resetAttributes();
            this.player.getDueling().resetAttributes();
        } else {

            this.player.getDueling().resetAttributes();
            this.player.getPacketSender().sendInterfaceRemoval();

            if (this.interact != null) {
                this.interact.getDueling().resetAttributes();
                this.interact.getPacketSender().sendInterfaceRemoval();
            }
        }
    }

    public inDuel(): boolean {
        return this.state == DuelState.STARTING_DUEL || this.state == DuelState.IN_DUEL;
    }

    private getFreeSlotsRequired(player: Player): number {
        let slots = 0;
        // Count equipment that needs to be taken off
        for (let i = 11; i < player.getDueling().getRules().length; i++) {
            let rule = Object.values(DuelRule)[i];
            if (player.getDueling().getRules()[rule.ordinal()]) {
                let item = player.getEquipment().getItems()[rule.getEquipmentSlot()];
                if (!item.isValid()) {
                    continue;
                }
                if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                    slots += rule.getInventorySpaceReq();
                }
                if (rule == DuelRule.NO_WEAPON || rule == DuelRule.NO_SHIELD) {
                }
            }
        }

        // Count inventory slots from interact's container aswell as ours
        for (let item of this.container.getItems()) {
            if (item == null || !item.isValid())
                continue;
            if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                slots++;
            }
        }

        for (let item of this.interact.getDueling().getContainer().getItems()) {
            if (item == null || !item.isValid())
                continue;
            if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                slots++;
            }
        }

        return slots;
    }

    public getButtonDelay(): SecondsTimer {
        return this.button_delay;
    }

    public getState(): DuelState {
        return this.state;
    }

    public setState(state: DuelState) {
        this.state = state;
    }

    public getContainer(): ItemContainer {
        return this.container;
    }

    public getInteract(): Player {
        return this.interact;
    }

    public setInteract(interact: Player): void {
        this.interact = interact;
    }

    public getRules(): boolean[] {
        return this.rules;
    }

    public getConfigValue(): number {
        return this.configValue;
    }

    public setConfigValue(configValue: number): void {
        this.configValue = configValue;
    }

    public incrementConfigValue(configValue: number): void {
        this.configValue += configValue;
    }
}

export class DuelRule {
    public static readonly NO_RANGED = new DuelRule(16, 6725, -1, -1);
    public static readonly NO_MELEE = new DuelRule(32, 6726, -1, -1);
    public static readonly NO_MAGIC = new DuelRule(64, 6727, -1, -1);
    public static readonly NO_SPECIAL_ATTACKS = new DuelRule(8192, 7816, -1, -1);
    public static readonly LOCK_WEAPON = new DuelRule(4096, 670, -1, -1);
    public static readonly NO_FORFEIT = new DuelRule(1, 6721, -1, -1);
    public static readonly NO_POTIONS = new DuelRule(128, 6728, -1, -1);
    public static readonly NO_FOOD = new DuelRule(256, 6729, -1, -1);
    public static readonly NO_PRAYER = new DuelRule(512, 6730, -1, -1);
    public static readonly NO_MOVEMENT = new DuelRule(2, 6722, -1, -1);
    public static readonly OBSTACLES = new DuelRule(1024, 6732, -1, -1);

    public static readonly NO_HELM = new DuelRule(16384, 13813, 1, Equipment.HEAD_SLOT);
    public static readonly NO_CAPE = new DuelRule(32768, 13814, 1, Equipment.CAPE_SLOT);
    public static readonly NO_AMULET = new DuelRule(65536, 13815, 1, Equipment.AMULET_SLOT);
    public static readonly NO_AMMUNITION = new DuelRule(134217728, 13816, 1, Equipment.AMMUNITION_SLOT);
    public static readonly NO_WEAPON = new DuelRule(131072, 13817, 1, Equipment.WEAPON_SLOT);
    public static readonly NO_BODY = new DuelRule(262144, 13818, 1, Equipment.BODY_SLOT);
    public static readonly NO_SHIELD = new DuelRule(524288, 13819, 1, Equipment.SHIELD_SLOT);
    public static readonly NO_LEGS = new DuelRule(2097152, 13820, 1, Equipment.LEG_SLOT);
    public static readonly NO_RING = new DuelRule(67108864, 13821, 1, Equipment.RING_SLOT);
    public static readonly NO_BOOTS = new DuelRule(16777216, 13822, 1, Equipment.FEET_SLOT);
    public static readonly NO_GLOVES = new DuelRule(8388608, 13823, 1, Equipment.HANDS_SLOT);

    private configId: number;
    private buttonId: number;
    private inventorySpaceReq: number;
    private equipmentSlot: number;

    constructor(configId: number, buttonId: number, inventorySpaceReq: number, equipmentSlot: number) {
        this.configId = configId;
        this.buttonId = buttonId;
        this.inventorySpaceReq = inventorySpaceReq;
        this.equipmentSlot = equipmentSlot;
    }

    public forId(i: number) {
        for (const r of Object.values(DuelRule)) {
            if (r.ordinal() === i) {
                return r;
            }
        }
        return null;
    }

    public static forButtonId(buttonId: number) {
        for (const r of Object.values(DuelRule)) {
            if (r.getButtonId() === buttonId) {
                return r;
            }
        }
        return null;
    }

    public getConfigId() {
        return this.configId;
    }

    public getButtonId() {
        return this.buttonId;
    }

    public getInventorySpaceReq() {
        return this.inventorySpaceReq;
    }

    public getEquipmentSlot() {
        return this.equipmentSlot;
    }

    public toString() {
        return this.toString().toLowerCase();
    }
}


export enum DuelState {
    NONE, REQUESTED_DUEL, DUEL_SCREEN, ACCEPTED_DUEL_SCREEN, CONFIRM_SCREEN, ACCEPTED_CONFIRM_SCREEN, STARTING_DUEL, IN_DUEL
}
