"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationMenu = void 0;
var CreationMenu = /** @class */ (function () {
    /**
     * Creates a new {@link CreationMenu}.
     *
     * @param player The owner.
     * @param title  The title.
     * @param action The action to execute upon selecting amount.
     */
    function CreationMenu(title, items, action) {
        this.title = title;
        this.items = items;
        this.action = action;
    }
    /**
     * Executes the action.
     * @param itemId
     * @param amount
     */
    CreationMenu.prototype.execute = function (itemId, amount) {
        if (!this.items.includes(itemId)) {
            return;
        }
        this.action.execute(itemId, amount);
    };
    /**
     * Gets the title.
     *
     * @return
     */
    CreationMenu.prototype.getTitle = function () {
        return this.title;
    };
    /**
     * Gets the items.
     * @return
     */
    CreationMenu.prototype.getItems = function () {
        return this.items;
    };
    /**
     * Gets the action.
     *
     * @return
     */
    CreationMenu.prototype.getAction = function () {
        return this.action;
    };
    return CreationMenu;
}());
exports.CreationMenu = CreationMenu;
//# sourceMappingURL=CreationMenu.js.map