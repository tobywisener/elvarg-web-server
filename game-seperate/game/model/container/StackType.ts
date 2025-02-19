export enum StackType {
    /*
     * Default type, items that will not stack, such as inventory items (excluding noted/stackable items).
     */
    DEFAULT,
    /*
     * Stacks type, items that will stack, such as shops or banks.
     */
    STACKS,
}