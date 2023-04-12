export enum PlayerInteractingOptions {
    NONE,
    CHALLENGE,
    ATTACK
}

export class PlayerInteractingOption {
    public static forName(name: string): PlayerInteractingOption {
        if (name.toLowerCase().includes("null")) {
            return PlayerInteractingOptions.NONE;
        }
        for (let option in PlayerInteractingOption) {
            if (PlayerInteractingOptions[option] == name) {
                return PlayerInteractingOptions[option];
            }
        }
        return null;
    }
}