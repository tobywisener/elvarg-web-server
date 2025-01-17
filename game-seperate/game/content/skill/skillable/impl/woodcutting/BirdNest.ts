import { Misc } from "../../../../../../util/Misc";
import { Player } from "../../../../../entity/impl/player/Player";
import { ItemOnGroundManager } from "../../../../../entity/impl/grounditem/ItemOnGroundManager";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { Item } from "../../../../../model/Item";


export class BirdNest {
    public static AMOUNT: number = 1;
    public static SEEDS_NEST_CHANCE: number = 0.64;
    public static GOLD_NEST_CHANCE: number = 0.32;
    public static NEST_DROP_CHANCE: number = 256;

    public static getById(id: number) {
        let ring: Ring
        for (const nest in Nest) {
            if (ring.getId() === id) {
                return nest;
            }
        }
        return null;
    }

    public static getSeedById(id: number): Seed | undefined {
        for (let seed in Seed) {
            if (Seed[seed].id === id) {
                return Seed[seed];
            }
        }
    }

    public static getSeedByName(name: string): Seed | undefined {
        for (let seed in Seed) {
            if (Seed[seed].name === name) {
                return Seed[seed];
            }
        }
    }

    public static handleDropNest(player: Player): void {
        if (player.getLocation().getZ() > 0) {
            return;
        }
        let random = Math.random();
        let nest: Nest;
        if (random < BirdNest.SEEDS_NEST_CHANCE) {
            nest = Nest.SEEDS_NEST;
        } else if (random < BirdNest.SEEDS_NEST_CHANCE + BirdNest.GOLD_NEST_CHANCE) {
            nest = Nest.GOLD_BIRD_NEST;
        } else {
            let color = Misc.getRandom(2);
            switch (color) {
                case 1:
                    nest = Nest.RED_BIRD_NEST;
                    break;
                case 2:
                    nest = Nest.GREEN_BIRD_NEST;
                    break;
                default:
                    nest = Nest.BLUE_BIRD_NEST;
                    break;
            }
        }
        if (nest != null) {
            ItemOnGroundManager.registers(player, new Item(nest.getId(), 1));
            player.getPacketSender().sendMessage("@red@A bird's nest falls out of the tree.");
        }
    }

    public static handleSearchNest(p: Player, itemId: number) {
        let nest = Nest.getById(itemId);
        if (!nest) {
            return;
        }
        if (p.getInventory().getFreeSlots() <= 0) {
            p.getPacketSender().sendMessage("Your inventory is too full to take anything out of the bird's nest.");
            return;
        }
        p.getInventory().deleteNumber(itemId, 1);
        p.getInventory().adds(Nest.EMPTY.getId(), 1);
        if (nest == Nest.GOLD_BIRD_NEST) {
            this.searchRingNest(p, itemId);
        } else if (nest == Nest.SEEDS_NEST) {
            this.searchSeedNest(p, itemId);
        } else {
            this.searchEggNest(p, itemId);
        }
    }


    static searchEggNest(player: Player, itemId: number) {
        let eggId = 0;
        if (itemId == ItemIdentifiers.BIRD_NEST) {
            eggId = ItemIdentifiers.BIRDS_EGG;
        } else if (itemId == ItemIdentifiers.BIRD_NEST_3) {
            eggId = ItemIdentifiers.BIRDS_EGG_2;
        } else if (itemId == ItemIdentifiers.BIRD_NEST_2) {
            eggId = ItemIdentifiers.BIRDS_EGG_3;
        }
        if (eggId != 0) {
            player.getInventory().adds(eggId, BirdNest.AMOUNT);
            player.getPacketSender().sendMessage("You take the bird's egg out of the bird's nest.");
        }
    }

    public static searchSeedNest(player: Player, itemId: number) {
        if (itemId != ItemIdentifiers.BIRD_NEST_4) {
            return;
        }
        let random = Misc.getRandom(1000);
        let seed: Seed = null;
        if (random <= 220) {
            seed = Seed.ACORN;
        } else if (random <= 350) {
            seed = Seed.WILLOW;
        } else if (random <= 400) {
            seed = Seed.MAPLE;
        } else if (random <= 430) {
            seed = Seed.YEW;
        } else if (random <= 440) {
            seed = Seed.MAGIC;
        } else if (random <= 600) {
            seed = Seed.APPLE;
        } else if (random <= 700) {
            seed = Seed.BANANA;
        } else if (random <= 790) {
            seed = Seed.ORANGE;
        } else if (random <= 850) {
            seed = Seed.CURRY;
        } else if (random <= 900) {
            seed = Seed.PINEAPPLE;
        } else if (random <= 930) {
            seed = Seed.PAPAYA;
        } else if (random <= 960) {
            seed = Seed.PALM;
        } else if (random <= 980) {
            seed = Seed.CALQUAT;
        } else if (random <= 1000) {
            seed = Seed.SPIRIT;
        }
        if (seed != null) {
            let ring: Ring;
            player.getInventory().adds(ring.getId(), BirdNest.AMOUNT);
            if (seed == Seed.ACORN) {
                player.getPacketSender().sendMessage(`You take an ${Ring.getName()} out of the bird's nest.`);
            } else if (seed == Seed.APPLE || seed == Seed.ORANGE) {
                player.getPacketSender().sendMessage(`You take an ${Ring.getName()} tree seed out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage("You take a " + Ring.getName() + " tree seed out of the bird's nest.");
            }
        }
    }
    static searchRingNest(player: Player, itemId: number) {
        if (itemId != ItemIdentifiers.BIRD_NEST_5) {
            return;
        }
        let random = Misc.getRandom(100);
        let ring: Ring = null;
        if (random <= 35) {
            ring = Ring.GOLD;
        } else if (random <= 75) {
            ring = Ring.SAPPHIRE;
        } else if (random <= 90) {
            ring = Ring.EMERALD;
        } else if (random <= 98) {
            ring = Ring.RUBY;
        } else if (random <= 100) {
            ring = Ring.DIAMOND;
        }
        if (ring != null) {
            let ring: Ring
            player.getInventory().adds(ring.getId(), BirdNest.AMOUNT);
            if (ring == Ring.EMERALD) {
                player.getPacketSender().sendMessage(`You take an ${Ring.getName()} ring out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage(`You take a ${Ring.getName()} ring out of the bird's nest.`);
            }
        }
    }

}

export class Ring {
    public static readonly GOLD = new Ring(1635, "gold");
    public static readonly SAPPHIRE = new Ring(1637, "sapphire");
    public static readonly EMERALD = new Ring(1639, "emerald");
    public static readonly RUBY = new Ring(1641, "ruby");
    public static readonly DIAMOND = new Ring(1643, "diamond");

    private readonly id: number;
    private readonly name: String;

    constructor(id: number, name: String) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public static getName(): String {
        return this.name;
    }
}

export class Seed {
    public static readonly ACORN = new Seed(5312, "acorn");
    public static readonly WILLOW = new Seed(5313, "willow");
    public static readonly MAPLE = new Seed(5314, "maple");
    public static readonly YEW = new Seed(5315, "yew");
    public static readonly MAGIC = new Seed(5316, "magic");
    public static readonly SPIRIT = new Seed(5317, "spirit");
    public static readonly APPLE = new Seed(5283, "apple");
    public static readonly BANANA = new Seed(5284, "banana");
    public static readonly ORANGE = new Seed(5285, "orange");
    public static readonly CURRY = new Seed(5286, "curry");
    public static readonly PINEAPPLE = new Seed(5287, "pineapple");
    public static readonly PAPAYA = new Seed(5288, "papaya");
    public static readonly PALM = new Seed(5289, "palm");
    public static readonly CALQUAT = new Seed(5290, "calquat");

    private readonly id: number;
    private readonly name: String;

    constructor(id: number, name: String) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public static getName(): String {
        return this.name;
    }
}

export class Nest {
    public static readonly RED_BIRD_NEST = new Nest(ItemIdentifiers.BIRD_NEST);
    public static readonly GREEN_BIRD_NEST = new Nest(ItemIdentifiers.BIRD_NEST_2);
    public static readonly BLUE_BIRD_NEST = new Nest(ItemIdentifiers.BIRD_NEST_3);
    public static readonly SEEDS_NEST = new Nest(ItemIdentifiers.BIRD_NEST_4);
    public static readonly GOLD_BIRD_NEST = new Nest(ItemIdentifiers.BIRD_NEST_5);
    public static readonly EMPTY = new Nest(ItemIdentifiers.BIRD_NEST_6);

    private readonly id: number

    constructor(id: number) {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public static getById(id: number): Nest | null {
        for (const nest of Object.values(Nest)) {
            if (nest.getId() === id) {
                return nest;
            }
        }
        return null;
    }
}




