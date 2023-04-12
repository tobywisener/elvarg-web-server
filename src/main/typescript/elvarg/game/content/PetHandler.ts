import { World } from "../World";
import { RegionManager } from "../collision/RegionManager";
import { ItemOnGroundManager } from "../entity/impl/grounditem/ItemOnGroundManager";
import { NPC } from "../entity/impl/npc/NPC";
import { Player } from "../entity/impl/player/Player";
import { Animation } from "../model/Animation";
import { Item } from "../model/Item";
import { Location } from "../model/Location";
import { Skill } from "../model/Skill";
import { Bank } from "../model/container/impl/Bank";
import { Misc } from "../../util/Misc";

export class PetHandler {
    private static INTERACTION_ANIM = new Animation(827);

    public static onSkill(player: Player, skill: Skill) {
        for (let pet of Pet.SKILLING_PETS) {
            if (pet.getSkill() && pet.getSkill() === skill) {
                let nome = player.getUsername();
                if (Math.floor(Math.random() * pet.getChance()) === 1) {
                    World.sendMessage(`@dre@${player.getUsername()} just found a stray ${pet.getName(nome)} while ${skill.toString().toLowerCase()}!`);
                    PetHandler.drop(player, pet.getItemId(), true);
                    return;
                }
            }
        }
    }

    public static drop(player: Player, id: number, reward: boolean) {
        let pet = Pet.getPetForItem(id);
        if (pet) {

            // Check if we already have a pet..
            if (!player.getCurrentPet()) {

                // Spawn the pet..
                let tiles: Location[] = [];
                for (let tile of player.outterTiles()) {
                    if (RegionManager.blocked(tile, player.getPrivateArea())) {
                        continue;
                    }
                    tiles.push(tile);
                }
                let location = tiles.length == 0 ? player.getLocation().clone() : tiles[Misc.getRandom(tiles.length - 1)];
                let npc = NPC.create(pet.getId(), location);
                npc.setPet(true);
                npc.setOwner(player);
                npc.setFollowing(player);
                npc.setMobileInteraction(player);
                npc.setArea(player.getArea());
                World.getAddNPCQueue().push(npc);

                // Set the player's current pet to this one.
                player.setCurrentPet(npc);

                // If this is a reward, congratulate them.
                // Otherwise simply drop it on the ground.
                if (reward) {
                    player.getPacketSender().sendMessage("You have a funny feeling like you're being followed.");
                } else {
                    player.getInventory().deleteNumber(pet.getItemId(), 1);
                    player.getPacketSender().sendMessage("You drop your pet..");
                    player.performAnimation(PetHandler.INTERACTION_ANIM);
                    player.setPositionToFace(npc.getLocation());
                }
            } else {
                // We might have to add to bank if inventory is full!
                if (reward) {
                    if (!player.getInventory().isFull()) {
                        player.getInventory().adds(pet.getItemId(), 1);
                    } else {
                        ItemOnGroundManager.registerNonGlobal(player, new Item(pet.getItemId()));
                    }
                    player.getPacketSender().sendMessage("@dre@You've received a pet!");
                } else {
                    player.getPacketSender().sendMessage("You already have a pet following you.");
                }
            }
            return true;
        }
        return false;
    }

    public static pickup(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }
        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet) {
            return false;
        }

        // Make sure we're picking up our pet!
        if (player.getCurrentPet() === npc) {

            player.getMovementQueue().reset();

            // Perform animation..
            player.performAnimation(PetHandler.INTERACTION_ANIM);

            // Remove the npc from the world
            World.getRemoveNPCQueue().push(player.getCurrentPet());

            // Add pet to inventory or bank
            if (!player.getInventory().isFull()) {
                player.getInventory().adds(pet.getItemId(), 1);
            } else {
                player.getBank(Bank.getTabForItem(player, pet.getItemId())).adds(pet.getItemId(), 1);
            }

            // Send message
            player.getPacketSender().sendMessage("You pick up your pet..");

            // Reset pet
            player.setCurrentPet(null);
            return true;
        }
        return false;
    }

    static morph(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }

        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet) {
            return false;
        }

        // Make sure we're picking up our own pet!
        if (player.getCurrentPet() === npc) {

            // If this pet can morph..
            if (pet.canMorph()) {
                npc.setNpcTransformationId(pet.getMorphId());
                player.getPacketSender().sendMessage("Your pet endures metamorphosis and transforms.");
            }
            return true;
        }
        return false;
    }

    /**
     * Attempts to interact with the given pet.
     *
     * @param player
     * @param npc
     * @return
     */
    static interact(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }

        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet || pet.getDialogue(player) == -1) {
            return false;
        }

        // Make sure we're interacting with our own pet!
        if (player.getCurrentPet() === npc) {
            if (player.getCurrentPet().getId() == Pet.OLMLET.getId()) {
                /* DialogueManager.start(player, 298);
                player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        switch (option) {
                            case 1:
                                DialogueManager.start(player, 300);
                                break;
                            case 2:
                                DialogueManager.start(player, 303);
                                break;
                            case 3:
                                DialogueManager.start(player, 308);
                                break;
                            case 4:
                                player.getPacketSender().sendInterfaceRemoval();
                                break;
                        }
                    }
                });*/
            } else {
                //  DialogueManager.start(player, pet.get().getDialogue(player));
            }
            return true;
        }
        return false;
    }
}

export class Pet {
    public static DARK_CORE = new Pet(318, 0, 12816, 123);
    public static VENENATIS_SPIDERLING = new Pet(495, 0, 13177, 126);
    public static CALLISTO_CUB = new Pet(497, 0, 13178, 30);
    public static HELLPUPPY = new Pet(964, 0, 13247, 138, undefined, undefined, (player: Player) => {
        const dialogueIds = [138, 143, 145, 150, 154];
        return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
    })
    public static CHAOS_ELEMENTAL_JR = new Pet(2055, 0, 11995, 158);
    public static SNAKELING = new Pet(2130, 2131, 12921, 162);
    public static MAGMA_SNAKELING = new Pet(2131, 2132, 12921, 169);
    public static TANZANITE_SNAKELING = new Pet(2132, 130, 12921, 176);
    public static VETION_JR = new Pet(5536, 5537, 13179, 183);
    public static VETION_JR_REBORN = new Pet(5537, 5536, 13179, 189);
    public static SCORPIAS_OFFSPRING = new Pet(5561, 0, 13181, 195);
    public static ABYSSAL_ORPHAN = new Pet(5884, 0, 13262, 202, undefined, undefined, (player: Player) => {
        if (!player.getAppearance().isMale()) {
            return 206;
        } else {
            const dialogueIds = [202, 209];
            return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
        }
    })
    public static TZREK_JAD = new Pet(5892, 0, 13225, 212, undefined, undefined, (player: Player) => {
        const dialogueIds = [212, 217];
        return dialogueIds[Misc.getRandom(dialogueIds.length - 1)]
    })
    public static SUPREME_HATCHLING = new Pet(6628, 0, 12643, 220);
    public static PRIME_HATCHLING = new Pet(6629, 0, 12644, 223);
    public static REX_HATCHLING = new Pet(6630, 0, 12645, 231);
    public static CHICK_ARRA = new Pet(6631, 0, 12649, 239);
    public static GENERAL_AWWDOR = new Pet(6632, 0, 12650, 247);
    public static COMMANDER_MINIANA = new Pet(6633, 0, 12651, 250, undefined, undefined, (player: Player) => {
        if (player.getEquipment().contains(11806)) {
            return 252;
        } else {
            return 250;
        }
    })
    public static KRIL_TINYROTH = new Pet(6634, 0, 12652, 254);
    public static BABY_MOLE = new Pet(6635, 0, 12646, 261);
    public static PRINCE_BLACK_DRAGON = new Pet(6636, 0, 12653, 267);
    public static KALPHITE_PRINCESS = new Pet(6637, 6638, 12654, 271);
    public static MORPHED_KALPHITE_PRINCESS = new Pet(6638, 6637, 12654, 279);
    public static SMOKE_DEVIL = new Pet(6639, 0, 12648, 288);
    public static KRAKEN = new Pet(6640, 0, 12655, 291);
    public static PENANCE_PRINCESS = new Pet(6642, 0, 12703, 296);
    public static OLMLET = new Pet(7520, 0, 20851, 298);
    public static Skotos = new Pet(425, 0, 21273, 298);
    public static HERON = new Pet(6715, 0, 13320, -1, Skill.FISHING, 5000);
    public static BEAVER = new Pet(6717, 0, 13322, -1, Skill.WOODCUTTING, 5000);
    public static GREY_CHINCHOMPA = new Pet(6719, 6720, 13324, -1, Skill.HUNTER, 3000);
    public static RED_CHINCHOMPA = new Pet(6718, 6719, 13323, -1, Skill.HUNTER, 4000);
    public static BLACK_CHINCHOMPA = new Pet(6720, 6718, 13325, -1, Skill.HUNTER, 5000);
    public static ROCK_GOLEM = new Pet(6723, 0, 13321, -1, Skill.MINING, 5000);
    public static GIANT_SQUIRREL = new Pet(7334, 0, 20659, -1, Skill.AGILITY, 5000);
    public static TANGLEROOT = new Pet(7335, 0, 0, -1, Skill.FARMING, 5000);
    public static ROCKY = new Pet(7336, 0, 0, -1, Skill.THIEVING, 5000);
    public static FIRE_RIFT_GAURDIAN = new Pet(7337, 7338, 20665, -1, Skill.RUNECRAFTING, 8000);
    public static AIR_RIFT_GUARDIAN = new Pet(7338, 7339, 20667, -1, Skill.RUNECRAFTING, 8000);
    public static MIND_RIFT_GUARDIAN = new Pet(7339, 7340, 20669, -1, Skill.RUNECRAFTING, 8000);
    public static WATER_RIFT_GUARDIAN = new Pet(7340, 7341, 20671, -1, Skill.RUNECRAFTING, 8000);
    public static EARTH_RIFT_GUARDIAN = new Pet(7341, 7342, 20673, -1, Skill.RUNECRAFTING, 8000);
    public static BODY_RIFT_GUARDIAN = new Pet(7342, 7343, 20675, -1, Skill.RUNECRAFTING, 8000);
    public static COSMIC_RIFT_GUARDIAN = new Pet(7343, 7344, 20677, -1, Skill.RUNECRAFTING, 8000);
    public static CHAOS_RIFT_GUARDIAN = new Pet(7344, 7345, 20679, -1, Skill.RUNECRAFTING, 8000);
    public static NATURE_RIFT_GUARDIAN = new Pet(7345, 7346, 20681, -1, Skill.RUNECRAFTING, 8000);
    public static LAW_RIFT_GUARDIAN = new Pet(7346, 7347, 20683, -1, Skill.RUNECRAFTING, 8000);
    public static DEATH_RIFT_GUARDIAN = new Pet(7347, 7348, 20685, -1, Skill.RUNECRAFTING, 8000);
    public static SOUL_RIFT_GUARDIAN = new Pet(7348, 7349, 20687, -1, Skill.RUNECRAFTING, 8000);
    public static ASTRAL_RIFT_GUARDIAN = new Pet(7349, 7350, 20689, -1, Skill.RUNECRAFTING, 8000);
    public static BLOOD_RIFT_GUARDIAN = new Pet(7350, 7337, 20691, -1, Skill.RUNECRAFTING, 8000);

    public static SKILLING_PETS: Set<Pet> = new Set([Pet.HERON, Pet.BEAVER, Pet.GREY_CHINCHOMPA, Pet.RED_CHINCHOMPA, Pet.BLACK_CHINCHOMPA, Pet.ROCK_GOLEM, Pet.GIANT_SQUIRREL, Pet.TANGLEROOT, Pet.ROCKY]);

    private petId: number;
    private morphId: number;
    private itemId: number;
    private dialogue: number;
    public skill: Skill;
    private chance: number;



    constructor(petNpcId: number, morphId: number, itemId: number, dialogue: number, skill?: Skill, chance?: number, private readonly dialogueFunc?: Function) {
        if (skill != null || chance != null) {
            this.petId = petNpcId;
            this.morphId = morphId;
            this.itemId = itemId
            this.skill = skill;
            this.chance = chance;
        } else {
            this.petId = petNpcId;
            this.morphId = morphId;
            this.itemId = itemId;
            this.dialogue = dialogue;
        }
    }

    public static getPet(identifier: number): Pet | undefined {
        return Pet.getPet[identifier];
    }

    public static getPetForItem(identifier: number): Pet {
        return Array.from(Pet.SKILLING_PETS.values())
            .find((pet) => pet.itemId === identifier);
    }

    public getId(): number {
        return this.petId;
    }

    public getMorphId(): number {
        return this.morphId;
    }

    public canMorph(): boolean {
        return (this.morphId != 0);
    }

    public getItemId(): number {
        return this.itemId;
    }

    public getDialogue(player: Player): number {
        if (this.dialogueFunc) {
            return this.dialogueFunc();
        }
        return this.dialogue;
    }

    public getSkill(): Skill {
        return this.skill;
    }

    public getChance(): number {
        return this.chance;
    }

    public getName(name: string): string {
        const formattedName = name.toLowerCase().replace(/_/g, ' ');
        return Misc.capitalizeWords(formattedName);
    }
}