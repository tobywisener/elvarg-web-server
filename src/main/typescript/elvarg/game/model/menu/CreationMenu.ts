export class CreationMenu {
    /**
    * The title of this {@link CreationMenu}.
    */
    private title: string;

    /**
     * The items which can be created through this
     * {@link CreationMenu}.
     */
    private items: number[];

    /**
     * The {@link CreationMenuAction} which will be executed when the player has
     * selected an item and the amount to create.
     */
    private action: CreationMenuAction;

    /**
     * Creates a new {@link CreationMenu}.
     *
     * @param player The owner.
     * @param title  The title.
     * @param action The action to execute upon selecting amount.
     */
    constructor(title: string, items: number[], action: CreationMenuAction) {
        this.title = title;
        this.items = items;
        this.action = action;
    }

    /**
     * Executes the action.
     * @param itemId
     * @param amount
     */
    public execute(itemId: number, amount: number) {
        if (!this.items.includes(itemId)) {
            return;
        }
        this.action.execute(itemId, amount);
    }

    /**
     * Gets the title.
     *
     * @return
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * Gets the items.
     * @return
     */
    public getItems(): number[] {
        return this.items;
    }

    /**
     * Gets the action.
     *
     * @return
     */
    public getAction(): CreationMenuAction {
        return this.action;
    }
}

export interface CreationMenuAction {
    /**
    * This method will execute when a player clicks
    * on an item in the creation menu chatbox
    * interface.
    *
    * @param item The item clicked on.
    * @param amount The amount selected.
    */
    execute(item: number, amount: number): void;
}
