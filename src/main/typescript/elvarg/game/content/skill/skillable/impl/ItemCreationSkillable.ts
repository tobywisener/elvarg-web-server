import { DefaultSkillable } from "./DefaultSkillable";
import { Skill } from "../../../../model/Skill";
import { RequiredItem } from "../../../../model/RequiredItem";
import { Item } from "../../../../model/Item";
import { AnimationLoop } from "../../../../model/AnimationLoop";
import { Player } from "../../../../entity/impl/player/Player";
import { Misc } from "../../../../../util/Misc";
import { PetHandler } from "../../../PetHandler";

export class ItemCreationSkillable extends DefaultSkillable {
    private requiredItems: RequiredItem[];
    /**
     * The item we're making.
     */
    private product: Item;
    /**
     * The {@link AnimationLoop} the player will perform whilst performing this
     * skillable.
     */
    private animLoop: AnimationLoop | undefined;
    /**
     * The level required to make this item.
     */
    private requiredLevel: number;
    /**
     * The experience a player will receive in the said skill for making this item.
     */
    private experience: number;
    /**
     * The skill to reward the player experience in.
     */
    private skill: Skill;
    /**
     * The amount to make.
     */
    private amount: number;

    constructor(requiredItems: RequiredItem[], product: Item, amount: number,
        animLoop: AnimationLoop | undefined, requiredLevel: number, experience: number, skill: Skill) {
        super();
        this.requiredItems = requiredItems;
        this.product = product;
        this.amount = amount;
        this.animLoop = animLoop;
        this.requiredLevel = requiredLevel;
        this.experience = experience;
        this.skill = skill;
    }

    public startAnimationLoop(player: Player) {
        if (!this.animLoop) {
            return;
        }
        let animLoopTask = setInterval(() => {
            player.performAnimation(this.animLoop.getAnim());
        }, this.animLoop.getLoopDelay());
    }

    public cyclesRequired(player: Player): number {
        return 2;
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, this.skill);
    }

    public finishedCycle(player: Player) {
        // Decrement amount to make and stop if we hit 0.
        if (this.amount-- <= 0) {
            this.cancel(player);
        }

        // Delete items required..
        this.filterRequiredItems(r => r.isDelete()).forEach(r => player.getInventory().deletes(r.getItem()));

        // Add product..
        player.getInventory().addItem(this.product);

        // Add exp..
        player.getSkillManager().addExperiences(this.skill, this.experience);

        // Send message..
        let name = this.product.getDefinition().getName();
        let amountPrefix = Misc.anOrA(name);
        if (this.product.getAmount() > 1) {
            if (!name.endsWith("s")) {
                name += "s";
            }
            amountPrefix = this.product.getAmount().toString();
        }

        player.getPacketSender().sendMessage(`You make ${amountPrefix} ${name}.`);
    }

    public hasRequirements(player: Player): boolean {
        // Validate amount..
        if (this.amount <= 0) {
            return false;
        }

        // Check if we have required stringing level..
        if (player.getSkillManager().getCurrentLevel(this.skill) < this.requiredLevel) {
            player.getPacketSender().sendMessage("You need a " + this.skill.getName() + " level of at least "
                + this.requiredLevel.toString() + " to do this.");
            return false;
        }

        // Validate required items..
        // Check if we have the required ores..
        let hasItems = true;
        for (const item of this.requiredItems) {
            if (!player.getInventory().containsItem(item.getItem())) {
                let prefix = item.getItem().getAmount() > 1 ? item.getItem().getAmount().toString() : "some";
                player.getPacketSender().sendMessage("You " + (!hasItems ? "also need" : "need") + " " + prefix + " "
                    + item.getItem().getDefinition().getName() + ".");
                hasItems = false;
            }
        }
        if (!hasItems) {
            return false;
        }

        return super.hasRequirements(player);
    }

    public loopRequirements(): boolean {
        return true;
    }

    public allowFullInventory(): boolean {
        return true;
    }

    public decrementAmount(): void {
        this.amount--;
    }

    public getAmount(): number {
        return this.amount;
    }

    public filterRequiredItems(criteria: (value: RequiredItem) => boolean): RequiredItem[] {
        return this.requiredItems.filter(criteria);
    }

    public getRequiredItems(): RequiredItem[] {
        return this.requiredItems;
    }
}