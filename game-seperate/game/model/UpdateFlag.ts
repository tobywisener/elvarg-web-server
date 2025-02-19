import {Flag} from "../model/Flag";

export class UpdateFlag {
    /**
    * A set containing the entity's update flags.
    */
    private flags = new Set<Flag>();
    /**
 * Checks if {@code flag} is contained in the entity's flag set.
 *
 * @param flag The flag to check.
 * @return The flags set contains said flag.
 */
    public flagged(flag: Flag): boolean {
        return this.flags.has(flag);
    }

    /**
     * Checks if an update is required by checking if flags set is empty.
     *
     * @return Flags set is not empty.
     */
    public isUpdateRequired(): boolean {
        return this.flags.size !== 0;
    }

    /**
     * Puts a flag value into the flags set.
     *
     * @param flag Flag to put into the flags set.
     * @return The UpdateFlag instance.
     */
    public flag(flag: Flag): UpdateFlag {
        this.flags.add(flag);
        return this;
    }

    /**
     * Removes every flag in the flags set.
     *
     * @return The UpdateFlag instance.
     */
    public reset(): UpdateFlag {
        this.flags.clear();
        return this;
    }
}