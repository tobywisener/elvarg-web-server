import { PrivateArea } from "../PrivateArea";
import { PestControl } from "../../../../content/minigames/impl/pestcontrols/PestControl";
import { Boundary } from "../../../Boundary";
import { MinigameHandler } from "../../../../content/minigames/MinigameHandler";
import { Mobile } from "../../../../entity/impl/Mobile";
import { Player } from "../../../../entity/impl/player/Player";
import { MagicSpellbook } from "../../../MagicSpellbook";
import { PrayerHandler } from "../../../../content/PrayerHandler";
import { EquipPacketListener } from "../../../../../net/packet/impl/EquipPacketListener";
import { ObjectDefinition } from "../../../../definition/ObjectDefinition";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { ObjectManager } from "../../../../entity/impl/object/ObjectManager";
import { PendingHit } from "../../../../content/combat/hit/PendingHit";
import { Minigame } from "../../../../content/minigames/Minigame";
import { Location } from "../../../Location";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { ObjectIdentifiers } from "../../../../../util/ObjectIdentifiers";

export class PestControlArea extends PrivateArea {

    private minigame: PestControl;

    public static readonly LAUNCHER_BOAT_BOUNDARY: Boundary = new Boundary(2656, 2659, 2609, 2614);

    /**
     * Returns the singleton instance of the Pest Control minigame.
     * <p>
     * Will fetch it if not already populated.
     *
     * @return
     */
    public getMinigame(): PestControl {
        if (this.minigame == null) {
            this.minigame = MinigameHandler.PEST_CONTROL.get() as PestControl;
        }

        return this.minigame;
    }

    public constructor() {
        super([new Boundary(2616, 2691, 2556, 2624)]);
    }

    public postEnter(character: Mobile): void {
        if (!character.isPlayer()) {
            return;
        }

        (character as Player).setWalkableInterfaceId(21100);
    }

    public allowSummonPet(player: Player): boolean {
        player.sendMessage("The squire doesn't allow you to bring your pet with you.");
        return false;
    }

    public allowDwarfCannon(player: Player): boolean {
        player.sendMessage("Cannons are not allowed in pest control.");
        return false;
    }

    public isSpellDisabled(player: Player, spellbook: MagicSpellbook, spellId: number): boolean {
        const alch = spellbook == MagicSpellbook.NORMAL && [1162, 1178].some(a => a == spellId);
        if (alch) {
            player.getPacketSender().sendMessage("You cannot use this spell in Pest Control.");
            return true;
        }
        return false;
    }

    public process(character: Mobile): void {
        if (this.minigame.isActive()) {
            // Prevent any processing if the game is not actually underway.
            return;
        }

        if (character.isNpc()) {
            // Process npcs
            // TODO: Make brawlers path to void knight
            return;
        }

        if (character.isPlayerBot()) {
            // Handle player bots
            return;
        }

        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            // Process player actions
        }
    }

    public postLeave(character: Mobile, logout: boolean): void {
        if (!character.isPlayer()) {
            return;
        }
        const player = character.getAsPlayer();

        if (logout) {
            // If player has logged out, move them to gangplank
            player.moveTo(PestControl.GANG_PLANK_START);
        }

        player.setPoisonDamage(0);
        PrayerHandler.resetAll(player);
        player.getCombat().reset();
        player.getInventory().resetItems().refreshItems();
        player.resetAttributes();
        player.setSpecialPercentage(100);
        player.setAttribute("pcDamage", 0);
        EquipPacketListener.resetWeapon(player, true);
    }

    public canTeleport(player: Player): boolean {
        player.getPacketSender().sendMessage("You cannot teleport out of pest control!");
        return false;
    }

    public isMulti(character: Mobile): boolean {
        // Pest Control is multi combat
        return true;
    }

    public dropItemsOnDeath(player: Player, killer?: Player): boolean {
        return false;
    }

    public onPlayerDealtDamage(player: Player, target: Mobile, hit: PendingHit): void {
        const pcDamage = "pcDamage";
        const pendingDamage: number = hit.getTotalDamage();
        if (pendingDamage === 0) {
            return;
        }
        let damage = player.getAttribute(pcDamage);
        if (damage === undefined) {
            player.setAttribute(pcDamage, new Number(pendingDamage));
            return;
        }
        player.setAttribute(pcDamage, Number(damage) + pendingDamage);
    }

    public handleDeath(player: Player, killer?: Player): boolean {
        player.smartMoves(PestControlArea.LAUNCHER_BOAT_BOUNDARY);
        // Returning true means default death behavior is avoided.
        return true;
    }

    public handleObjectClick(player: Player, object: GameObject, optionId: number): boolean {
        const objLoc = object.getLocation();
        const oX = objLoc.getX();
        const oY = objLoc.getY();
        const objectId = object.getId();
        const direction = object.getFace();
        const myX = player.getLocation().getX();
        const myY = player.getLocation().getY();

        switch (objectId) {
            // adicione os casos para cada objectId, se necessário
        }

        /**
         * Simple ladder formula
         */
        if (objectId == ObjectIdentifiers.LADDER_174) {
            const down = direction == 1 && myX < oX || direction == 3 && myX > oX || direction == 0 && myY < oY;
            player.climb(down, down ? new Location((direction == 0 ? oX : direction == 1 ? oX + 1 : oX - 1), (direction == 1 ? oY : direction == 3 ? oY : oY + 1)) : new Location(direction == 1 ? oX - 1 : direction == 3 ? oX + 1 : oX, direction == 0 ? oY - 1 : oY));
            return true;
        }

        if (objectId >= 14233 && objectId <= 14236) {
            const defs = ObjectDefinition.forId(objectId);

            if (defs == null) {
                console.error(`no defs for objid=${objectId}`);
                return false;
            }

            const open = ObjectDefinition.interactions?.some(d => d?.includes("Open"));

            const westernGate = oX == 2643;
            const southernGate = oY == 2585;
            const easternGate = oX == 2670;

            let spawn = objLoc;
            let gate = object;

            console.error(`direction=${direction} open=${open} ${objLoc.toString()} newOffset=${this.getGateDirectionOffset(direction, objectId, open)}`);

            if (open) {
                spawn = new Location(westernGate ? objLoc.getX() - 1 : easternGate ? objLoc.getX() + 1 : objLoc.getX(), southernGate ? objLoc.getY() - 1 : objLoc.getY());
                gate = new GameObject(objectId == 14233 ? 14234 : 14236, spawn, object.getType(), this.getGateDirectionOffset(direction, objectId, true), object.getPrivateArea());
            } else {
                spawn = new Location(oX == 2642 ? oX + 1 : oX == 2671 ? objLoc.getX() - 1 : objLoc.getX(), oY == 2584 ? objLoc.getY() + 1 : objLoc.getY());
                gate = new GameObject(objectId == 14234 ? 14233 : 14235, spawn, object.getType(), this.getGateDirectionOffset(direction, objectId, false), object.getPrivateArea());
            }
            ObjectManager.deregister(object, true);
            ObjectManager.register(gate, true);
            return true;
        }

        return false;
    }

    private getGateDirectionOffset(direction: number, objectId: number, opening: boolean): number {
        if (opening) {
            if (direction === 0) {
                if (objectId === 14233) {
                    return 1;
                }
                if (objectId === 14235) {
                    return 3;
                }
            } else if (direction === 3) {
                if (objectId === 14233) {
                    return 4;
                }
                if (objectId === 14235) {
                    return 2;
                }
            } else if (direction === 2) {
                if (objectId === 14233) {
                    return 3;
                }
                if (objectId === 14235) {
                    return 1;
                }
            }
        } else {
            if (direction === 1) {
                if (objectId === 14234) {
                    return 0;
                }
                if (objectId === 14236) {
                    return 2;
                }
            } else if (direction === 2) {
                if (objectId === 14236) {
                    return 3;
                }
            } else if (direction === 3) {
                if (objectId === 14236) {
                    return 0;
                }
                if (objectId === 14234) {
                    return 2;
                }
            } else if (direction === 4) {
                if (objectId === 14234) {
                    return 3;
                }
            }
        }
        return -1;
    }
}
