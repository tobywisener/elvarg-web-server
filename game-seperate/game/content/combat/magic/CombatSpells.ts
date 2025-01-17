
import { Mobile } from "../../../entity/impl/Mobile";
import { Player } from "../../../entity/impl/player/Player";
import { Animation } from "../../../model/Animation";
import {  EffectTimer } from "../../../model/EffectTimer";
import { Graphic } from "../../../model/Graphic";
import { GraphicHeight } from "../../../model/GraphicHeight";
import { Item } from "../../../model/Item";
import { MagicSpellbook } from "../../../model/MagicSpellbook";
import { Projectile } from "../../../model/Projectile";
import { Skill } from "../../../model/Skill";
import { Sound } from "../../../Sound";
import { PoisonType } from "../../../task/impl/CombatPoisonEffect";
import { PrayerHandler } from "../../PrayerHandler";
import { CombatFactory } from "../CombatFactory";
import { PendingHit } from "../hit/PendingHit";
import { CombatAncientSpell } from "./CombatAncientSpell";
import { CombatEffectSpell } from "./CombatEffectSpell";
import { CombatNormalSpell } from "./CombatNormalSpell";
import { CombatSpell } from "./CombatSpell";

export class CombatAncientSpellExtend implements CombatAncientSpell {
    constructor(private readonly castAnimationFuntion: Function, private readonly startGraphicFunction: Function, private readonly spellEffectOnHitCalcFunction: Function, private readonly spellRadiusFunction: Function, private readonly castProjectileFunction: Function, private readonly endGraphicFunction: Function, private readonly maximumHitFunction: Function, private readonly baseExperienceFunction: Function, private readonly itemsRequiredFunction: Function, private readonly levelRequiredFunction: Function, private readonly spellIdFucntion: Function, private readonly impactSoundFunction?: Function) {
    }
    public getSpellbook(): MagicSpellbook {
        throw new Error("Method not implemented.");
    }
    public equipmentRequired(player: Player): Item[] {
        throw new Error("Method not implemented.");
    }
    canCast(player: Player): any {
        throw new Error("Method not implemented.");
    }

    public finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
        throw new Error("Method not implemented.");
    }

    public spellEffect(cast: Mobile, castOn: Mobile, damage: number): void {
        throw new Error("Method not implemented.");
    }
    public spellRadius(): number {
        return this.spellRadiusFunction();
    }
    public startCast(cast: Mobile, castOn: Mobile): void {
        throw new Error("Method not implemented.");
    }
    public getAttackSpeed(): number {
        throw new Error("Method not implemented.");
    }
    spellId(): number {
        return this.spellIdFucntion();
    }
    maximumHit(): number {
        return this.maximumHitFunction();
    }
    castAnimation(): Animation {
        return this.castAnimationFuntion();
    }
    startGraphic(): Graphic {
        return this.startGraphicFunction();
    }
    castProjectile(cast: Mobile, castOn: Mobile): Projectile {
        return this.castProjectileFunction();
    }
    endGraphic(): Graphic {
        return this.endGraphicFunction();
    }
    public onHitCalc(hit: PendingHit): void {
        throw new Error("Method not implemented.");
    }
    public spellEffectOnHitCalc(cast: Mobile, castOn: Mobile, damage: number): void {
        return this.spellEffectOnHitCalcFunction();
    }
    public impactSound(): Sound {
        return this.impactSoundFunction();
    }

    delete: boolean;

    public baseExperience() {
        return this.baseExperienceFunction();
    }
    public itemsRequired() {
        return this.itemsRequiredFunction();
    }

    public levelRequired() {
        return this.levelRequiredFunction();
    }

    private readonly spell: CombatSpell;

    /**
    
    Gets the spell attached to this element.
    @return the spell.
    */
    public getSpell(): CombatSpell {
        return this.spell;
    }


}



export class CombatSpells {
    public static WIND_STRIKE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 91, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(92, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 2;
        },
        startGraphic() {
            return new Graphic(90, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 5;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556), new Item(558)];
        },

        levelRequired() {
            return 1;
        },
        spellId() {
            return 1152;
        }
    });

    public static CONFUSE = new CombatEffectSpell({
        castAnimation() {
            return new Animation(716);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 103, 0, 20, 43, 31);
        },
        spellEffect(cast, castOn) {
            if (castOn.isPlayer()) {
                const player = castOn as Player;
                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the player has already been weakened.");
                    }
                    return;
                }
                const decrease = Math.floor(0.05 * (player.getSkillManager().getCurrentLevel(Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            }
        },
        endGraphic() {
            return new Graphic(104, GraphicHeight.HIGH);
        },
        startGraphic() {
            return new Graphic(102, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 13;
        },
        itemsRequired(player) {
            return [new Item(555, 3), new Item(557, 2), new Item(559)];
        },
        levelRequired() {
            return 3;
        },
        spellId() {
            return 1153;
        }
    });

    public static WATER_STRIKE = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(711);
        },
        castProjectile: (cast, castOn) => {
            return Projectile.createProjectile(cast, castOn, 94, 0, 20, 43, 31);
        },
        endGraphic: () => {
            return new Graphic(95, GraphicHeight.HIGH);
        },
        maximumHit: () => {
            return 4;
        },
        startGraphic: () => {
            return new Graphic(93, GraphicHeight.HIGH);
        },
        baseExperience: () => {
            return 7;
        },
        equipmentRequired: (player) => {
            return null;
        },
        itemsRequired(player): Item[] {
            return [new Item(555), new Item(556), new Item(558)];
        },
        levelRequired: () => {
            return 5;
        },
        spellId: () => {
            return 1154;
        },
    });

    public static EARTH_STRIKE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 97, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(98, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 6;
        },
        startGraphic() {
            return new Graphic(96, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 9;
        },
        equipmentRequired(player) {
            return undefined;
        },
        itemsRequired(player): Item[] {
            return [new Item(556, 1), new Item(558, 1), new Item(557, 2)];
        },
        levelRequired() {
            return 9;
        },
        spellId() {
            return 1156;
        },
    });

    public static WEAKEN = new CombatEffectSpell({
        castAnimation() {
            return new Animation(716);
        },

        castProjectile(cast: Mobile, castOn: Mobile) {
            return Projectile.createProjectile(cast, castOn, 106, 0, 20, 43, 31);
        },

        spellEffect(cast: Mobile, castOn: Mobile) {
            if (castOn.isPlayer()) {
                let player = castOn as Player;

                if (player.getSkillManager().getCurrentLevel(Skill.STRENGTH) < player.getSkillManager().getMaxLevel(Skill.STRENGTH)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage(
                            "The spell has no effect because the player has already been weakened."
                        );
                    }
                    return;
                }

                let decrease = Math.floor(0.05 * player.getSkillManager().getCurrentLevel(Skill.STRENGTH));
                player.getSkillManager().setCurrentLevelCombat(Skill.STRENGTH, player.getSkillManager().getCurrentLevel(Skill.STRENGTH) - decrease);
                player.getSkillManager().updateSkill(Skill.STRENGTH);
                player.getPacketSender().sendMessage(
                    "You feel slightly weakened."
                );
            } /*else if (castOn.isNpc()) {
                    let npc = castOn as NPC;
        
                    if (npc.getDefenceWeakened()[1] || npc.getStrengthWeakened()[1]) {
                        if (cast.isPlayer()) {
                            (cast as Player).getPacketSender().sendMessage(
                                "The spell has no effect because the NPC has already been weakened."
                            );
                        }
                        return;
                    }
        
                    npc.getDefenceWeakened()[1] = true;
                }*/
        },

        endGraphic() {
            return new Graphic(107, GraphicHeight.HIGH);
        },

        startGraphic() {
            return new Graphic(105, GraphicHeight.HIGH);
        },

        baseExperience() {
            return 21;
        },

        itemsRequired(player: Player) {
            return [new Item(555, 3), new Item(557, 2), new Item(559, 1)];
        },

        levelRequired() {
            return 11;
        },

        spellId() {
            return 1157;
        },

        getSpellbook() {
            return null;
        },
    });

    public static FIRE_STRIKE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },


        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 100, 0, 20, 43, 31);
        },

        endGraphic() {
            return new Graphic(101, GraphicHeight.HIGH);
        },

        maximumHit() {
            return 8;
        },

        startGraphic() {
            return new Graphic(99, GraphicHeight.HIGH);
        },

        baseExperience() {
            return 11;
        },

        equipmentRequired(player) {
            return null;
        },

        itemsRequired(player) {
            return [new Item(556, 1), new Item(558, 1), new Item(554, 3)];
        },

        levelRequired() {
            return 13;
        },

        spellId() {
            return 1158;
        }
    });

    public static WIND_BOLT = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(711);
        },

        castProjectile: (cast, castOn) => {
            return Projectile.createProjectile(cast, castOn, 118, 0, 20, 43, 31);
        },

        endGraphic: () => {
            return new Graphic(119, GraphicHeight.HIGH);
        },

        maximumHit: () => {
            return 9;
        },

        startGraphic: () => {
            return new Graphic(117, GraphicHeight.HIGH);
        },

        baseExperience: () => {
            return 13;
        },

        equipmentRequired: (player: Player) => {
            return undefined;
        },

        itemsRequired: (player: Player) => {
            return [new Item(556, 2), new Item(562, 1)];
        },

        levelRequired: () => {
            return 17;
        },

        spellId: () => {
            return 1160;
        }
    });

    public static CURSE = new CombatEffectSpell({
        castAnimation() {
            return new Animation(710);
        },

        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 109, 0, 20, 43, 31);
        },

        spellEffect(cast, castOn) {
            if (castOn.isPlayer()) {
                const player = castOn as Player;

                if (player.getSkillManager().getCurrentLevel(Skill.DEFENCE) < player.getSkillManager().getMaxLevel(Skill.DEFENCE)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the player has already been weakened.");
                    }
                    return;
                }

                const decrease = Math.floor(0.05 * player.getSkillManager().getCurrentLevel(Skill.DEFENCE));
                player.getSkillManager().setCurrentLevelCombat(Skill.DEFENCE, player.getSkillManager().getCurrentLevel(Skill.DEFENCE) - decrease);
                player.getSkillManager().updateSkill(Skill.DEFENCE);

                player.getPacketSender().sendMessage("You feel slightly weakened.");
            }/* else if (castOn.isNpc()) {
                const npc = castOn as NPC;
        
                if (npc.getDefenceWeakened()[2] || npc.getStrengthWeakened()[2]) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the NPC has already been weakened.");
                    }
                    return;
                }
        
                npc.getDefenceWeakened()[2] = true;
            }*/
        },

        endGraphic() {
            return new Graphic(110, GraphicHeight.HIGH);
        },

        startGraphic() {
            return new Graphic(108, GraphicHeight.HIGH);
        },

        baseExperience() {
            return 29;
        },

        itemsRequired(player) {
            return [new Item(555, 2), new Item(557, 3), new Item(559, 1)];
        },

        levelRequired() {
            return 19;
        },

        spellId() {
            return 1161;
        }
    });

    public static BIND = new CombatEffectSpell({
        castAnimation: () => {
            return new Animation(710);
        },

        castProjectile: (cast, castOn) => {
            return Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },

        spellEffect: (cast, castOn) => {
            CombatFactory.freeze(castOn, 5);
        },

        endGraphic: () => {
            return new Graphic(181, GraphicHeight.HIGH);
        },

        startGraphic: () => {
            return new Graphic(177, GraphicHeight.HIGH);
        },

        baseExperience: () => {
            return 30;
        },

        itemsRequired: (player) => {
            return [new Item(555, 3), new Item(557, 3), new Item(561, 2)];
        },

        levelRequired: () => {
            return 20;
        },

        spellId: () => {
            return 1572;
        }
    });

    public static WATER_BOLT = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 121, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(122, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 10;
        },
        startGraphic() {
            return new Graphic(120, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 16;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556, 2), new Item(562, 1), new Item(555, 2)];
        },
        levelRequired() {
            return 23;
        },
        spellId() {
            return 1163;
        }
    });

    public static EARTH_BOLT = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 124, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(125, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 11;
        },
        startGraphic() {
            return new Graphic(123, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 19;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556, 2), new Item(562, 1), new Item(557, 3)];
        },
        levelRequired() {
            return 29;
        },
        spellId() {
            return 1166;
        }
    });

    public static FIRE_BOLT = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 127, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(128, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 12;
        },
        startGraphic() {
            return new Graphic(126, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 22;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556, 3), new Item(562, 1), new Item(554, 4)];
        },
        levelRequired() {
            return 35;
        },
        spellId() {
            return 1169;
        }
    });

    public static CRUMBLE_UNDEAD = new CombatNormalSpell({
        castAnimation() {
            return new Animation(724);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 146, 0, 20, 43, 31)
                ;
        },
        endGraphic() {
            return new Graphic(147);
        },
        maximumHit() {
            return 15;
        },
        startGraphic() {
            return new Graphic(145, 6553600);
        },
        baseExperience() {
            return 24;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [
                new Item(556, 2),
                new Item(562, 1),
                new Item(557, 2),
            ];
        },
        levelRequired() {
            return 39;
        },
        spellId() {
            return 1171;
        },
    });

    public static WIND_BLAST = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 133, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(134, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 13;
        },
        startGraphic() {
            return new Graphic(132, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 25;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [
                new Item(556, 3),
                new Item(560, 1),
            ];
        },
        levelRequired() {
            return 41;
        },
        spellId() {
            return 1172;
        },
    });

    public static WATER_BLAST = new CombatNormalSpell({
        castAnimation() {
            return new Animation(711);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 136, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(137, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 14;
        },
        startGraphic() {
            return new Graphic(135, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 28;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [
                new Item(555, 3),
                new Item(556, 3),
                new Item(560, 1),
            ];
        },
        levelRequired() {
            return 47;
        },
        spellId() {
            return 1175;
        },
    });

    public static IBAN_BLAST = new CombatNormalSpell({
        castAnimation() {
            return new Animation(708);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 88, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(89);
        },
        maximumHit() {
            return 25;
        },
        startGraphic() {
            return new Graphic(87, 6553600);
        },
        baseExperience() {
            return 30;
        },
        equipmentRequired(player) {
            return [new Item(1409)];
        },
        itemsRequired(player) {
            return [new Item(560, 1), new Item(554, 5)];
        },
        levelRequired() {
            return 50;
        },
        spellId() {
            return 1539;
        }
    });

    public static SNARE = new CombatEffectSpell({
        castAnimation() {
            return new Animation(710);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },
        spellEffect(cast, castOn) {
            CombatFactory.freeze(castOn, 10);
        },
        endGraphic() {
            return new Graphic(180, GraphicHeight.HIGH);
        },
        startGraphic() {
            return new Graphic(177, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 60;
        },
        itemsRequired(player) {
            return [new Item(555, 3), new Item(557, 4), new Item(561, 3)];
        },
        levelRequired() {
            return 50;
        },
        spellId() {
            return 1582;
        }
    });

    public static MAGIC_DART = new CombatNormalSpell({
        castAnimation() {
            return new Animation(1576);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 328, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(329);
        },
        maximumHit() {
            return 19;
        },
        startGraphic() {
            return new Graphic(327, 6553600);
        },
        baseExperience() {
            return 30;
        },
        equipmentRequired(player) {
            return [new Item(4170)];
        },
        itemsRequired(player) {
            return [new Item(558, 4), new Item(560, 1)];
        },
        levelRequired() {
            return 50;
        },
        spellId() {
            return 12037;
        }
    })

    public static EARTH_BLAST = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(711);
        },
        castProjectile: (cast, castOn) => {
            return Projectile.createProjectile(cast, castOn, 139, 0, 20, 43, 31);
        },
        endGraphic: () => {
            return new Graphic(140, GraphicHeight.HIGH);
        },
        maximumHit: () => {
            return 15;
        },
        startGraphic: () => {
            return new Graphic(138, GraphicHeight.HIGH);
        },
        baseExperience: () => {
            return 31;
        },
        equipmentRequired: (player: Player) => {
            return undefined;
        },
        itemsRequired: (player: Player) => {
            return [new Item(556, 3), new Item(560, 1), new Item(557, 4)];
        },
        levelRequired: () => {
            return 53;
        },
        spellId: () => {
            return 1177;
        }
    });

    public static FIRE_BLAST = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(711);
        },
        castProjectile: (cast, castOn) => {
            return Projectile.createProjectile(cast, castOn, 130, 0, 20, 43, 31);
        },
        endGraphic: () => {
            return new Graphic(131, GraphicHeight.HIGH);
        },
        maximumHit: () => {
            return 16;
        },
        startGraphic: () => {
            return new Graphic(129, GraphicHeight.HIGH);
        },
        baseExperience: () => {
            return 34;
        },
        equipmentRequired: (player: Player) => {
            return undefined;
        },
        itemsRequired: (player: Player) => {
            return [new Item(556, 4), new Item(560, 1), new Item(554, 5)];
        },
        levelRequired: () => {
            return 59;
        },
        spellId: () => {
            return 1181;
        }
    });

    public static SARADOMIN_STRIKE = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(811);
        },
        castProjectile: (cast, castOn) => {
            return undefined;
        },
        endGraphic: () => {
            return new Graphic(76);
        },
        maximumHit: () => {
            return 20;
        },
        startGraphic: () => {
            return undefined;
        },
        baseExperience: () => {
            return 35;
        },
        equipmentRequired: (player: Player) => {
            return [new Item(2415)];
        },
        itemsRequired: (player: Player) => {
            return [new Item(556, 4), new Item(565, 2), new Item(554, 2)];
        },
        levelRequired: () => {
            return 60;
        },
        spellId: () => {
            return 1190;
        }
    });

    public static CLAWS_OF_GUTHIX = new CombatNormalSpell({
        castAnimation: () => {
            return new Animation(811);
        },
        castProjectile: (cast: Mobile, castOn: Mobile): Projectile => {
            return null;
        },
        endGraphic: (): Graphic => {
            return new Graphic(77);
        },
        maximumHit: (): number => {
            return 20;
        },
        startGraphic: (): Graphic => {
            return null;
        },
        baseExperience: (): number => {
            return 35;
        },
        equipmentRequired: (player: Player): Item[] => {
            return [new Item(2416)];
        },
        itemsRequired: (player: Player): Item[] => {
            return [new Item(556, 4), new Item(565, 2), new Item(554, 2)];
        },
        levelRequired: (): number => {
            return 60;
        },
        spellId: (): number => {
            return 1191;
        }
    });

    public static FLAMES_OF_ZAMORAK = new CombatNormalSpell({
        castAnimation() {
            return new Animation(811);
        },
        castProjectile: (cast: Mobile, castOn: Mobile): Projectile => {
            return null;
        },
        endGraphic: (): Graphic => {
            return new Graphic(78);
        },
        maximumHit: (): number => {
            return 20;
        },
        startGraphic: (): Graphic => {
            return null;
        },
        baseExperience: (): number => {
            return 35;
        },
        equipmentRequired: (player: Player): Item[] => {
            return [new Item(2417)];
        },
        itemsRequired: (player: Player): Item[] => {
            return [new Item(556, 4), new Item(565, 2), new Item(554, 2)];
        },
        levelRequired: (): number => {
            return 60;
        },
        spellId: (): number => {
            return 1192;
        }
    });

    public static WIND_WAVE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(727);
        },
        castProjectile: (cast: Mobile, castOn: Mobile): Projectile => {
            return Projectile.createProjectile(cast, castOn, 159, 0, 20, 43, 31);
        },
        endGraphic: (): Graphic => {
            return new Graphic(160, GraphicHeight.HIGH);
        },
        maximumHit: (): number => {
            return 17;
        },
        startGraphic: (): Graphic => {
            return new Graphic(158, GraphicHeight.MIDDLE);
        },
        baseExperience: (): number => {
            return 36;
        },
        equipmentRequired: (player: Player): Item[] => {
            return null;
        },
        itemsRequired: (player: Player): Item[] => {
            return [new Item(556, 5), new Item(565, 1)];
        },
        levelRequired: (): number => {
            return 62;
        },
        spellId: (): number => {
            return 1183;
        }
    });

    public static WATER_WAVE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(727);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 162, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(163, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 18;
        },
        startGraphic() {
            return new Graphic(161, GraphicHeight.MIDDLE);
        },
        baseExperience() {
            return 37;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556, 5), new Item(565, 1), new Item(555, 7)];
        },
        levelRequired() {
            return 65;
        },
        spellId() {
            return 1185;
        }
    });

    public static VULNERABILITY = new CombatEffectSpell({
        castAnimation() {
            return new Animation(729);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 168, 0, 20, 43, 31);
        },
        spellEffect(cast, castOn) {
            if (castOn.isPlayer()) {
                let player = castOn as Player;


                if (player.getSkillManager().getCurrentLevel(Skill.DEFENCE) < player.getSkillManager().getMaxLevel(Skill.DEFENCE)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the player is already weakened.");
                    }
                    return;
                }

                let decrease = Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill.DEFENCE));
                player.getSkillManager().setCurrentLevelCombat(Skill.DEFENCE, player.getSkillManager().getCurrentLevel(Skill.DEFENCE) - decrease);
                player.getSkillManager().updateSkill(Skill.DEFENCE);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            }/* else if (castOn.isNpc()) {
                let npc = castOn as NPC;
        
                if (npc.getDefenceWeakened()[2] || npc.getStrengthWeakened()[2]) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the NPC is already weakened.");
                    }
                    return;
                }
        
                npc.getStrengthWeakened()[2] = true;
            }*/
        },
        endGraphic() {
            return new Graphic(169);
        },
        startGraphic() {
            return new Graphic(167, 6553600);
        },
        baseExperience() {
            return 76;
        },
        itemsRequired(player) {
            return [new Item(557, 5), new Item(555, 5), new Item(566, 1)];
        },
        levelRequired() {
            return 66;
        },
        spellId() {
            return 1542;
        }
    });

    public static EARTH_WAVE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(727);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 165, 0, 20, 43, 31);
        },
        endGraphic() {
            return new Graphic(166, GraphicHeight.HIGH);
        },
        maximumHit() {
            return 19;
        },
        startGraphic() {
            return new Graphic(164, GraphicHeight.MIDDLE);
        },
        baseExperience() {
            return 40;
        },
        equipmentRequired(player) {
            return null;
        },
        itemsRequired(player) {
            return [new Item(556, 5), new Item(565, 1), new Item(557, 7)];
        },
        levelRequired() {
            return 70;
        },
        spellId() {
            return 1188;
        }
    });

    public static ENFEEBLE = new CombatEffectSpell({
        castAnimation: function () {
            return new Animation(729);
        },
        castProjectile: function (cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 171, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                let player = castOn as Player;
                if (player.getSkillManager().getCurrentLevel(Skill.STRENGTH) < player.getSkillManager().getMaxLevel(Skill.STRENGTH)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage("The spell has no effect because the player is already weakened.");
                    }
                    return;
                }
                let decrease = Math.floor(0.10 * (player.getSkillManager().getCurrentLevel(Skill.STRENGTH)));
                player.getSkillManager().setCurrentLevelCombat(Skill.STRENGTH, player.getSkillManager().getCurrentLevel(Skill.STRENGTH) - decrease);
                player.getSkillManager().updateSkill(Skill.STRENGTH);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            }
            /* else if (castOn.isNpc()) {
            let npc = castOn as NPC;
            if (npc.getDefenceWeakened()[1] || npc.getStrengthWeakened()[1]) {
            if (cast.isPlayer()) {
            (cast as Player).getPacketSender().sendMessage("The spell has no effect because the NPC is already weakened.");
            }
            return;
            }
            npc.getStrengthWeakened()[1] = true;
            } */
        },
        endGraphic: function () {
            return new Graphic(172);
        },
        startGraphic: function () {
            return new Graphic(170, 6553600);
        },
        baseExperience: function () {
            return 83;
        },
        itemsRequired: function (player) {
            return [new Item(557, 8), new Item(555, 8), new Item(566, 1)];
        },
        levelRequired: function () {
            return 73;
        },
        spellId: function () {
            return 1543;
        }
    });

    public static FIRE_WAVE = new CombatNormalSpell({
        castAnimation() {
            return new Animation(727);
        },


        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 156, 0, 20, 43, 31);
        },

        endGraphic() {
            return new Graphic(157, GraphicHeight.HIGH);
        },

        maximumHit() {
            return 20;
        },

        startGraphic() {
            return new Graphic(155, GraphicHeight.MIDDLE);
        },

        baseExperience() {
            return 42;
        },

        equipmentRequired(player) {
            return null;
        },

        itemsRequired(player) {
            return [new Item(556, 5), new Item(565, 1), new Item(554, 7)];
        },

        levelRequired() {
            return 75;
        },

        spellId() {
            return 1189;
        }
    });

    public static ENTANGLE = new CombatEffectSpell({
        castAnimation() {
            return new Animation(710);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },
        spellEffect(cast, castOn) {
            CombatFactory.freeze(castOn, 15);
        },
        endGraphic() {
            return new Graphic(179, GraphicHeight.HIGH);
        },
        startGraphic() {
            return new Graphic(177, GraphicHeight.HIGH);
        },
        baseExperience() {
            return 91;
        },
        itemsRequired(player) {
            return [new Item(555, 5), new Item(557, 5), new Item(561, 4)];
        },
        levelRequired() {
            return 79;
        },
        spellId() {
            return 1592;
        }
    });

    public static STUN = new CombatEffectSpell({
        castAnimation() {
            return new Animation(729);
        },
        castProjectile(cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 174, 0, 20, 43, 31);
        },
        spellEffect(cast, castOn) {
            if (castOn.isPlayer()) {
                const player = castOn as Player;

                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage(
                            "The spell has no effect because the player is already weakened.");
                    }
                    return;
                }

                const decrease = Math.floor(0.10 * (player.getSkillManager().getCurrentLevel(Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
                player.getPacketSender().sendMessage(
                    "You feel slightly weakened.");
            }/* else if (castOn.isNpc()) {
                    const npc = castOn as NPC;
        
                    if (npc.getDefenceWeakened()[0] || npc.getStrengthWeakened()[0]) {
                        if (cast.isPlayer()) {
                            (cast as Player).getPacketSender().sendMessage(
                                "The spell has no effect because the NPC is already weakened.");
                        }
                        return;
                    }
        
                    npc.getStrengthWeakened()[0] = true;
                }*/
        },
        endGraphic() {
            return new Graphic(107);
        },
        startGraphic() {
            return new Graphic(173, 6553600);
        },
        baseExperience() {
            return 90;
        },
        itemsRequired(player) {
            return [new Item(557, 12), new Item(555, 12), new Item(556, 1)];
        },
        levelRequired() {
            return 80;
        },
        spellId() {
            return 1562;
        }
    });

    public static TELEBLOCK = new CombatEffectSpell({
        castAnimation: function () {
            return new Animation(1819);
        },
        castProjectile: function (cast, castOn) {
            return Projectile.createProjectile(cast, castOn, 344, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                let player = castOn as Player;
                if (!player.getCombat().getTeleblockTimer().finished()) {
                    if (cast.isPlayer()) {
                        (cast as Player).getPacketSender().sendMessage(
                            "The spell has no effect because the player is already teleblocked."
                        );
                    }
                    return;
                }
                const seconds = player.getPrayerActive()[PrayerHandler.PROTECT_FROM_MAGIC] ? 300 : 600;
                player.getCombat().getTeleblockTimer().start(seconds);
                player.getPacketSender().sendEffectTimer(seconds, EffectTimer.TELE_BLOCK)
                    .sendMessage("You have just been teleblocked!");
            } else if (castOn.isNpc()) {
                if (cast.isPlayer()) {
                    (cast as Player).getPacketSender().sendMessage("Your spell has no effect on this target.");
                }
            }
        },
        endGraphic: function () {
            return new Graphic(345);
        },
        startGraphic: function () {
            return null;
        },
        baseExperience: function () {
            return 65;
        },
        itemsRequired: function (player) {
            return [new Item(563, 1), new Item(562, 1), new Item(560, 1)];
        },
        levelRequired: function () {
            return 85;
        },
        spellId: function () {
            return 12445;
        }
    });

    public static SMOKE_RUSH = new CombatAncientSpellExtend(
        () => { return new Animation(1978); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.poisonEntity(castOn, PoisonType.MILD); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 384, 0, 20, 43, 31); },
        () => { return new Graphic(385); },
        () => { return 13; },
        () => { return 30; },
        () => { return [new Item(556, 1), new Item(554, 1), new Item(562, 2), new Item(560, 2)]; },
        () => { return 50; },
        () => { return 12939; }
    )

    public static SHADOW_RUSH = new CombatAncientSpellExtend(
        () => { return new Animation(1978); },
        () => { },
        (cast: Mobile, castOn: Mobile, damage: number) => {
            if (castOn.isPlayer()) {
                const player = castOn as Player;
                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    return;
                }
                const decrease = Math.floor(0.1 * (player.getSkillManager().getCurrentLevel(Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
            }
        },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 378, 0, 20, 43, 31); },
        () => { return new Graphic(379); },
        () => { return 14; },
        () => { return 31; },
        () => { return [new Item(556, 1), new Item(566, 1), new Item(562, 2), new Item(560, 2)]; },
        () => { return 52; },
        () => { return 12987; }

    )
    spellEffectOnHitCalc(cast, damage: number) {
        cast.heal(Math.floor(damage * 0.10));
    }

    public static BLOOD_RUSH = new CombatAncientSpellExtend(
        () => { return new Animation(1978); },
        () => { },
        (cast: Mobile, castOn: Mobile, damage: number) => { cast.heal(Math.floor(damage * 0.10)); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 372, 0, 20, 43, 31); },
        () => { return new Graphic(373); },
        () => { return 15; },
        () => { return 33; },
        () => {
            return [
                new Item(565, 1),
                new Item(562, 2),
                new Item(560, 2),
            ];
        },
        () => { return 56; },
        () => { return 12901; }

    )

    public static ICE_RUSH = new CombatAncientSpellExtend(
        () => { return new Animation(1978); },
        () => { },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.freeze(castOn, 5); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 360, 0, 20, 43, 31); },
        () => { return new Graphic(361); },
        () => { return 18; },
        () => { return 34; },
        () => {
            return [
                new Item(555, 2),
                new Item(562, 2),
                new Item(560, 2),
            ];
        },
        () => { return 58; },
        () => { return 12861; }
    )

    public static SMOKE_BURST = new CombatAncientSpellExtend(
        () => { return new Animation(1979); },
        () => { },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.poisonEntity(castOn, PoisonType.MILD); },
        () => { return 1; },
        () => { return null; },
        () => { return new Graphic(389); },
        () => { return 13; },
        () => { return 36; },
        () => { return [new Item(556, 2), new Item(554, 2), new Item(562, 4), new Item(560, 2)]; },
        () => { return 62; },
        () => { return 12963; }

    );

    public static SHADOW_BURST = new CombatAncientSpellExtend(
        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => {
            if (castOn.isPlayer()) {
                const player = castOn as Player;


                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    return;
                }

                const decrease = Math.floor(0.1 * player.getSkillManager().getCurrentLevel(Skill.ATTACK));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
            }
        },
        () => { return 1; },
        () => { return null; },
        () => { return new Graphic(382); },
        () => { return 18; },
        () => { return 37; },
        () => { return [new Item(556, 1), new Item(566, 2), new Item(562, 4), new Item(560, 2)]; },
        () => { return 64; },
        () => { return 13011; }


    )

    public static BLOOD_BURST = new CombatAncientSpellExtend(
        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { cast.heal(Math.floor(damage * 0.15)); },
        () => { return 1; },
        () => { return null; },
        () => { return new Graphic(376); },
        () => { return 21; },
        () => { return 39; },
        () => { return [new Item(565, 2), new Item(562, 4), new Item(560, 2)]; },
        () => { return 68; },
        () => { return 12919; }
    )


    public static ICE_BURST = new CombatAncientSpellExtend(

        () => { return new Animation(1979); },
        () => { },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.freeze(castOn, 10); },
        () => { return 1; },
        () => { return null; },
        () => { return new Graphic(363) },
        () => { return 22; },
        () => { return 40; },
        () => {
            return [
                new Item(555, 4),
                new Item(562, 4),
                new Item(560, 2),
            ]
        },
        () => { return 70; },
        () => { return 12881; }

    )

    public static SMOKE_BLITZ = new CombatAncientSpellExtend(

        () => { return new Animation(1978); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.poisonEntity(castOn, PoisonType.EXTRA); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 386, 0, 20, 43, 31); },
        () => { return new Graphic(387) },
        () => { return 23; },
        () => { return 42; },
        () => { return [new Item(556, 2), new Item(554, 2), new Item(565, 2), new Item(560, 2)]; },
        () => { return 74; },
        () => { return 12951; }

    )

    public static SHADOW_BLITZ = new CombatAncientSpellExtend(

        () => { return new Animation(1978); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => {
            if (castOn.isPlayer()) {
                const player = castOn as Player;

                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    return;
                }

                const decrease = Math.floor(0.15 * (player.getSkillManager().getCurrentLevel(Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
            }
        },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 380, 0, 20, 43, 31); },
        () => { return new Graphic(381) },
        () => { return 24; },
        () => { return 43; },
        () => { return [new Item(556, 2), new Item(566, 2), new Item(565, 2), new Item(560, 2)]; },
        () => { return 76; },
        () => { return 12999; }

    )

    public static BLOOD_BLITZ = new CombatAncientSpellExtend(

        () => { return new Animation(1978); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { cast.heal(Math.floor(damage * 0.20)); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return Projectile.createProjectile(cast, castOn, 374, 0, 20, 43, 31); },
        () => { return new Graphic(375) },
        () => { return 25; },
        () => { return 45; },
        () => { return [new Item(565, 4), new Item(560, 2)]; },
        () => { return 80; },
        () => { return 12911; }

    )

    public static ICE_BLITZ = new CombatAncientSpellExtend(

        () => { return new Animation(1978); },
        () => { return new Graphic(366, 6553600); },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.freeze(castOn, 15); },
        () => { return 0; },
        (cast: Mobile, castOn: Mobile) => { return null; },
        () => { return new Graphic(367) },
        () => { return 26; },
        () => { return 46; },
        () => { return [new Item(555, 3), new Item(565, 2), new Item(560, 2)]; },
        () => { return 82; },
        () => { return 12871; }

    )

    public static SMOKE_BARRAGE = new CombatAncientSpellExtend(

        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.poisonEntity(castOn, PoisonType.SUPER); },
        () => { return 1; },
        (cast: Mobile, castOn: Mobile) => { return null; },
        () => { return new Graphic(391) },
        () => { return 27; },
        () => { return 48; },
        () => { return [new Item(556, 4), new Item(554, 4), new Item(565, 2), new Item(560, 4)]; },
        () => { return 86; },
        () => { return 12975; }

    )

    public static SHADOW_BARRAGE = new CombatAncientSpellExtend(

        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => {
            if (castOn.isPlayer()) {
                const player: Player = castOn as Player;


                if (player.getSkillManager().getCurrentLevel(Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill.ATTACK)) {
                    return;
                }

                const decrease: number = Math.floor(0.15 * (player.getSkillManager().getCurrentLevel(Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill.ATTACK);
            }
        },
        () => { return 1; },
        (cast: Mobile, castOn: Mobile) => { return null; },
        () => { return new Graphic(383) },
        () => { return 28; },
        () => { return 49; },
        () => { return [new Item(556, 4), new Item(566, 3), new Item(565, 2), new Item(560, 4)]; },
        () => { return 88; },
        () => { return 13023; }

    )

    public static BLOOD_BARRAGE = new CombatAncientSpellExtend(

        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { cast.heal(Math.floor(damage * 0.20)); },
        () => { return 1; },
        (cast: Mobile, castOn: Mobile) => { return null; },
        () => { return new Graphic(377) },
        () => { return 29; },
        () => { return 51; },
        () => { return [new Item(560, 4), new Item(566, 1), new Item(565, 4)]; },
        () => { return 92; },
        () => { return 12929; }


    )

    public static ICE_BARRAGE = new CombatAncientSpellExtend(

        () => { return new Animation(1979); },
        () => { return null; },
        (cast: Mobile, castOn: Mobile, damage: number) => { CombatFactory.freeze(castOn, 20); },
        () => { return 1; },
        (cast: Mobile, castOn: Mobile) => { return null; },
        () => { return new Graphic(369) },
        () => { return 30; },
        () => { return 52; },
        () => { return [new Item(555, 6), new Item(565, 2), new Item(560, 4)]; },
        () => { return 94; },
        () => { return 12891; },
        () => { return Sound.ICA_BARRAGE_IMPACT; }

    )
    public static TRIDENT_OF_THE_SEAS = new CombatNormalSpell({
        castAnimation(): Animation {
            return new Animation(1167);
        },

        castProjectile(cast: Mobile, castOn: Mobile): Projectile {
            return Projectile.createProjectile(cast, castOn, 1252, 0, 20, 43, 31);
        },

        endGraphic(): Graphic {
            return new Graphic(1253);
        },

        maximumHit(): number {
            return 20;
        },

        startGraphic(): Graphic {
            return new Graphic(1251, GraphicHeight.HIGH);
        },

        baseExperience(): number {
            return 50;
        },

        equipmentRequired(player: Player): Item[] {
            return null;
        },

        itemsRequired(player: Player): Item[] {
            return null;
        },

        levelRequired(): number {
            return 75;
        },

        spellId(): number {
            return 1;
        }
    });

    public static TRIDENT_OF_THE_SWAMP = new CombatNormalSpell({
        castAnimation(): Animation {
            return new Animation(1167);
        },

        castProjectile(cast: Mobile, castOn: Mobile): Projectile {
            return Projectile.createProjectile(cast, castOn, 1040, 0, 20, 43, 31);
        },

        endGraphic(): Graphic {
            return new Graphic(1042);
        },

        maximumHit(): number {
            return 20;
        },

        startGraphic(): Graphic {
            return new Graphic(665, GraphicHeight.HIGH);
        },

        baseExperience(): number {
            return 50;
        },

        equipmentRequired(player: Player): Item[] {
            return null;
        },

        itemsRequired(player: Player): Item[] {
            return null;
        },

        levelRequired(): number {
            return 75;
        },

        spellId(): number {
            return 1;
        }
    });

    /**

The spell attached to this element.
*/
    private readonly spell: CombatSpell;
    /**
    
    Creates a new {@link CombatSpells}.
    @param spell
           the spell attached to this element.
    */
    private constructor(spell: CombatSpell) {
        this.spell = spell;
    }

    /**
    
    Gets the spell attached to this element.
    @return the spell.
    */
    public getSpell(): CombatSpell {
        return this.spell;
    }

    /**

Gets the spell with a {@link CombatSpell#spellId()} of {@code id}.
@param id
       the identification of the combat spell.
@return the combat spell with that identification.
*/
    public static getCombatSpells(id: number): CombatSpells | undefined {
        const spell = Object.values(CombatSpells).find((s) => s && s.getSpell().spellId() === id);
        return spell ? spell : null;
    }



    public static getCombatSpell(spellId: number): CombatSpell | null {
        const spell = CombatSpells.getCombatSpells(spellId);
        return spell ? spell.getSpell() : null;
    }


}