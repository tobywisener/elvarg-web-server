"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = exports.PetHandler = void 0;
var World_1 = require("../World");
var RegionManager_1 = require("../collision/RegionManager");
var ItemOnGroundManager_1 = require("../entity/impl/grounditem/ItemOnGroundManager");
var NPC_1 = require("../entity/impl/npc/NPC");
var Animation_1 = require("../model/Animation");
var Item_1 = require("../model/Item");
var Skill_1 = require("../model/Skill");
var Bank_1 = require("../model/container/impl/Bank");
var Misc_1 = require("../../util/Misc");
var PetHandler = exports.PetHandler = /** @class */ (function () {
    function PetHandler() {
    }
    PetHandler.onSkill = function (player, skill) {
        var e_1, _a;
        try {
            for (var _b = __values(Pet.SKILLING_PETS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pet = _c.value;
                if (pet.getSkill() && pet.getSkill() === skill) {
                    var nome = player.getUsername();
                    if (Math.floor(Math.random() * pet.getChance()) === 1) {
                        World_1.World.sendMessage("@dre@".concat(player.getUsername(), " just found a stray ").concat(pet.getName(nome), " while ").concat(skill.toString().toLowerCase(), "!"));
                        PetHandler.drop(player, pet.getItemId(), true);
                        return;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    PetHandler.drop = function (player, id, reward) {
        var e_2, _a;
        var pet = Pet.getPetForItem(id);
        if (pet) {
            // Check if we already have a pet..
            if (!player.getCurrentPet()) {
                // Spawn the pet..
                var tiles = [];
                try {
                    for (var _b = __values(player.outterTiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var tile = _c.value;
                        if (RegionManager_1.RegionManager.blocked(tile, player.getPrivateArea())) {
                            continue;
                        }
                        tiles.push(tile);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var location_1 = tiles.length == 0 ? player.getLocation().clone() : tiles[Misc_1.Misc.getRandom(tiles.length - 1)];
                var npc = NPC_1.NPC.create(pet.getId(), location_1);
                npc.setPet(true);
                npc.setOwner(player);
                npc.setFollowing(player);
                npc.setMobileInteraction(player);
                npc.setArea(player.getArea());
                World_1.World.getAddNPCQueue().push(npc);
                // Set the player's current pet to this one.
                player.setCurrentPet(npc);
                // If this is a reward, congratulate them.
                // Otherwise simply drop it on the ground.
                if (reward) {
                    player.getPacketSender().sendMessage("You have a funny feeling like you're being followed.");
                }
                else {
                    player.getInventory().deleteNumber(pet.getItemId(), 1);
                    player.getPacketSender().sendMessage("You drop your pet..");
                    player.performAnimation(PetHandler.INTERACTION_ANIM);
                    player.setPositionToFace(npc.getLocation());
                }
            }
            else {
                // We might have to add to bank if inventory is full!
                if (reward) {
                    if (!player.getInventory().isFull()) {
                        player.getInventory().adds(pet.getItemId(), 1);
                    }
                    else {
                        ItemOnGroundManager_1.ItemOnGroundManager.registerNonGlobal(player, new Item_1.Item(pet.getItemId()));
                    }
                    player.getPacketSender().sendMessage("@dre@You've received a pet!");
                }
                else {
                    player.getPacketSender().sendMessage("You already have a pet following you.");
                }
            }
            return true;
        }
        return false;
    };
    PetHandler.pickup = function (player, npc) {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }
        // Make sure npc is a pet..
        var pet = Pet.getPet(npc.getId());
        if (!pet) {
            return false;
        }
        // Make sure we're picking up our pet!
        if (player.getCurrentPet() === npc) {
            player.getMovementQueue().reset();
            // Perform animation..
            player.performAnimation(PetHandler.INTERACTION_ANIM);
            // Remove the npc from the world
            World_1.World.getRemoveNPCQueue().push(player.getCurrentPet());
            // Add pet to inventory or bank
            if (!player.getInventory().isFull()) {
                player.getInventory().adds(pet.getItemId(), 1);
            }
            else {
                player.getBank(Bank_1.Bank.getTabForItem(player, pet.getItemId())).adds(pet.getItemId(), 1);
            }
            // Send message
            player.getPacketSender().sendMessage("You pick up your pet..");
            // Reset pet
            player.setCurrentPet(null);
            return true;
        }
        return false;
    };
    PetHandler.morph = function (player, npc) {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }
        // Make sure npc is a pet..
        var pet = Pet.getPet(npc.getId());
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
    };
    /**
     * Attempts to interact with the given pet.
     *
     * @param player
     * @param npc
     * @return
     */
    PetHandler.interact = function (player, npc) {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }
        // Make sure npc is a pet..
        var pet = Pet.getPet(npc.getId());
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
            }
            else {
                //  DialogueManager.start(player, pet.get().getDialogue(player));
            }
            return true;
        }
        return false;
    };
    PetHandler.INTERACTION_ANIM = new Animation_1.Animation(827);
    return PetHandler;
}());
var Pet = exports.Pet = /** @class */ (function () {
    function Pet(petNpcId, morphId, itemId, dialogue, skill, chance, dialogueFunc) {
        this.dialogueFunc = dialogueFunc;
        if (skill != null || chance != null) {
            this.petId = petNpcId;
            this.morphId = morphId;
            this.itemId = itemId;
            this.skill = skill;
            this.chance = chance;
        }
        else {
            this.petId = petNpcId;
            this.morphId = morphId;
            this.itemId = itemId;
            this.dialogue = dialogue;
        }
    }
    Pet.getPet = function (identifier) {
        return Pet.getPet[identifier];
    };
    Pet.getPetForItem = function (identifier) {
        return Array.from(Pet.SKILLING_PETS.values())
            .find(function (pet) { return pet.itemId === identifier; });
    };
    Pet.prototype.getId = function () {
        return this.petId;
    };
    Pet.prototype.getMorphId = function () {
        return this.morphId;
    };
    Pet.prototype.canMorph = function () {
        return (this.morphId != 0);
    };
    Pet.prototype.getItemId = function () {
        return this.itemId;
    };
    Pet.prototype.getDialogue = function (player) {
        if (this.dialogueFunc) {
            return this.dialogueFunc();
        }
        return this.dialogue;
    };
    Pet.prototype.getSkill = function () {
        return this.skill;
    };
    Pet.prototype.getChance = function () {
        return this.chance;
    };
    Pet.prototype.getName = function (name) {
        var formattedName = name.toLowerCase().replace(/_/g, ' ');
        return Misc_1.Misc.capitalizeWords(formattedName);
    };
    Pet.DARK_CORE = new Pet(318, 0, 12816, 123);
    Pet.VENENATIS_SPIDERLING = new Pet(495, 0, 13177, 126);
    Pet.CALLISTO_CUB = new Pet(497, 0, 13178, 30);
    Pet.HELLPUPPY = new Pet(964, 0, 13247, 138, undefined, undefined, function (player) {
        var dialogueIds = [138, 143, 145, 150, 154];
        return dialogueIds[Misc_1.Misc.getRandom(dialogueIds.length - 1)];
    });
    Pet.CHAOS_ELEMENTAL_JR = new Pet(2055, 0, 11995, 158);
    Pet.SNAKELING = new Pet(2130, 2131, 12921, 162);
    Pet.MAGMA_SNAKELING = new Pet(2131, 2132, 12921, 169);
    Pet.TANZANITE_SNAKELING = new Pet(2132, 130, 12921, 176);
    Pet.VETION_JR = new Pet(5536, 5537, 13179, 183);
    Pet.VETION_JR_REBORN = new Pet(5537, 5536, 13179, 189);
    Pet.SCORPIAS_OFFSPRING = new Pet(5561, 0, 13181, 195);
    Pet.ABYSSAL_ORPHAN = new Pet(5884, 0, 13262, 202, undefined, undefined, function (player) {
        if (!player.getAppearance().isMale()) {
            return 206;
        }
        else {
            var dialogueIds = [202, 209];
            return dialogueIds[Misc_1.Misc.getRandom(dialogueIds.length - 1)];
        }
    });
    Pet.TZREK_JAD = new Pet(5892, 0, 13225, 212, undefined, undefined, function (player) {
        var dialogueIds = [212, 217];
        return dialogueIds[Misc_1.Misc.getRandom(dialogueIds.length - 1)];
    });
    Pet.SUPREME_HATCHLING = new Pet(6628, 0, 12643, 220);
    Pet.PRIME_HATCHLING = new Pet(6629, 0, 12644, 223);
    Pet.REX_HATCHLING = new Pet(6630, 0, 12645, 231);
    Pet.CHICK_ARRA = new Pet(6631, 0, 12649, 239);
    Pet.GENERAL_AWWDOR = new Pet(6632, 0, 12650, 247);
    Pet.COMMANDER_MINIANA = new Pet(6633, 0, 12651, 250, undefined, undefined, function (player) {
        if (player.getEquipment().contains(11806)) {
            return 252;
        }
        else {
            return 250;
        }
    });
    Pet.KRIL_TINYROTH = new Pet(6634, 0, 12652, 254);
    Pet.BABY_MOLE = new Pet(6635, 0, 12646, 261);
    Pet.PRINCE_BLACK_DRAGON = new Pet(6636, 0, 12653, 267);
    Pet.KALPHITE_PRINCESS = new Pet(6637, 6638, 12654, 271);
    Pet.MORPHED_KALPHITE_PRINCESS = new Pet(6638, 6637, 12654, 279);
    Pet.SMOKE_DEVIL = new Pet(6639, 0, 12648, 288);
    Pet.KRAKEN = new Pet(6640, 0, 12655, 291);
    Pet.PENANCE_PRINCESS = new Pet(6642, 0, 12703, 296);
    Pet.OLMLET = new Pet(7520, 0, 20851, 298);
    Pet.Skotos = new Pet(425, 0, 21273, 298);
    Pet.HERON = new Pet(6715, 0, 13320, -1, Skill_1.Skill.FISHING, 5000);
    Pet.BEAVER = new Pet(6717, 0, 13322, -1, Skill_1.Skill.WOODCUTTING, 5000);
    Pet.GREY_CHINCHOMPA = new Pet(6719, 6720, 13324, -1, Skill_1.Skill.HUNTER, 3000);
    Pet.RED_CHINCHOMPA = new Pet(6718, 6719, 13323, -1, Skill_1.Skill.HUNTER, 4000);
    Pet.BLACK_CHINCHOMPA = new Pet(6720, 6718, 13325, -1, Skill_1.Skill.HUNTER, 5000);
    Pet.ROCK_GOLEM = new Pet(6723, 0, 13321, -1, Skill_1.Skill.MINING, 5000);
    Pet.GIANT_SQUIRREL = new Pet(7334, 0, 20659, -1, Skill_1.Skill.AGILITY, 5000);
    Pet.TANGLEROOT = new Pet(7335, 0, 0, -1, Skill_1.Skill.FARMING, 5000);
    Pet.ROCKY = new Pet(7336, 0, 0, -1, Skill_1.Skill.THIEVING, 5000);
    Pet.FIRE_RIFT_GAURDIAN = new Pet(7337, 7338, 20665, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.AIR_RIFT_GUARDIAN = new Pet(7338, 7339, 20667, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.MIND_RIFT_GUARDIAN = new Pet(7339, 7340, 20669, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.WATER_RIFT_GUARDIAN = new Pet(7340, 7341, 20671, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.EARTH_RIFT_GUARDIAN = new Pet(7341, 7342, 20673, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.BODY_RIFT_GUARDIAN = new Pet(7342, 7343, 20675, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.COSMIC_RIFT_GUARDIAN = new Pet(7343, 7344, 20677, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.CHAOS_RIFT_GUARDIAN = new Pet(7344, 7345, 20679, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.NATURE_RIFT_GUARDIAN = new Pet(7345, 7346, 20681, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.LAW_RIFT_GUARDIAN = new Pet(7346, 7347, 20683, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.DEATH_RIFT_GUARDIAN = new Pet(7347, 7348, 20685, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.SOUL_RIFT_GUARDIAN = new Pet(7348, 7349, 20687, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.ASTRAL_RIFT_GUARDIAN = new Pet(7349, 7350, 20689, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.BLOOD_RIFT_GUARDIAN = new Pet(7350, 7337, 20691, -1, Skill_1.Skill.RUNECRAFTING, 8000);
    Pet.SKILLING_PETS = new Set([Pet.HERON, Pet.BEAVER, Pet.GREY_CHINCHOMPA, Pet.RED_CHINCHOMPA, Pet.BLACK_CHINCHOMPA, Pet.ROCK_GOLEM, Pet.GIANT_SQUIRREL, Pet.TANGLEROOT, Pet.ROCKY]);
    return Pet;
}());
//# sourceMappingURL=PetHandler.js.map