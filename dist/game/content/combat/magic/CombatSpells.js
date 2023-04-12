"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatSpells = exports.CombatAncientSpellExtend = void 0;
var Animation_1 = require("../../../model/Animation");
var EffectTimer_1 = require("../../../model/EffectTimer");
var Graphic_1 = require("../../../model/Graphic");
var GraphicHeight_1 = require("../../../model/GraphicHeight");
var Item_1 = require("../../../model/Item");
var Projectile_1 = require("../../../model/Projectile");
var Skill_1 = require("../../../model/Skill");
var Sound_1 = require("../../../Sound");
var CombatPoisonEffect_1 = require("../../../task/impl/CombatPoisonEffect");
var PrayerHandler_1 = require("../../PrayerHandler");
var CombatFactory_1 = require("../CombatFactory");
var CombatEffectSpell_1 = require("./CombatEffectSpell");
var CombatNormalSpell_1 = require("./CombatNormalSpell");
var CombatAncientSpellExtend = /** @class */ (function () {
    function CombatAncientSpellExtend(castAnimationFuntion, startGraphicFunction, spellEffectOnHitCalcFunction, spellRadiusFunction, castProjectileFunction, endGraphicFunction, maximumHitFunction, baseExperienceFunction, itemsRequiredFunction, levelRequiredFunction, spellIdFucntion, impactSoundFunction) {
        this.castAnimationFuntion = castAnimationFuntion;
        this.startGraphicFunction = startGraphicFunction;
        this.spellEffectOnHitCalcFunction = spellEffectOnHitCalcFunction;
        this.spellRadiusFunction = spellRadiusFunction;
        this.castProjectileFunction = castProjectileFunction;
        this.endGraphicFunction = endGraphicFunction;
        this.maximumHitFunction = maximumHitFunction;
        this.baseExperienceFunction = baseExperienceFunction;
        this.itemsRequiredFunction = itemsRequiredFunction;
        this.levelRequiredFunction = levelRequiredFunction;
        this.spellIdFucntion = spellIdFucntion;
        this.impactSoundFunction = impactSoundFunction;
    }
    CombatAncientSpellExtend.prototype.getSpellbook = function () {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.equipmentRequired = function (player) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.canCast = function (player) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.finishCast = function (cast, castOn, accurate, damage) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.spellEffect = function (cast, castOn, damage) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.spellRadius = function () {
        return this.spellRadiusFunction();
    };
    CombatAncientSpellExtend.prototype.startCast = function (cast, castOn) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.getAttackSpeed = function () {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.spellId = function () {
        return this.spellIdFucntion();
    };
    CombatAncientSpellExtend.prototype.maximumHit = function () {
        return this.maximumHitFunction();
    };
    CombatAncientSpellExtend.prototype.castAnimation = function () {
        return this.castAnimationFuntion();
    };
    CombatAncientSpellExtend.prototype.startGraphic = function () {
        return this.startGraphicFunction();
    };
    CombatAncientSpellExtend.prototype.castProjectile = function (cast, castOn) {
        return this.castProjectileFunction();
    };
    CombatAncientSpellExtend.prototype.endGraphic = function () {
        return this.endGraphicFunction();
    };
    CombatAncientSpellExtend.prototype.onHitCalc = function (hit) {
        throw new Error("Method not implemented.");
    };
    CombatAncientSpellExtend.prototype.spellEffectOnHitCalc = function (cast, castOn, damage) {
        return this.spellEffectOnHitCalcFunction();
    };
    CombatAncientSpellExtend.prototype.impactSound = function () {
        return this.impactSoundFunction();
    };
    CombatAncientSpellExtend.prototype.baseExperience = function () {
        return this.baseExperienceFunction();
    };
    CombatAncientSpellExtend.prototype.itemsRequired = function () {
        return this.itemsRequiredFunction();
    };
    CombatAncientSpellExtend.prototype.levelRequired = function () {
        return this.levelRequiredFunction();
    };
    /**
    
    Gets the spell attached to this element.
    @return the spell.
    */
    CombatAncientSpellExtend.prototype.getSpell = function () {
        return this.spell;
    };
    return CombatAncientSpellExtend;
}());
exports.CombatAncientSpellExtend = CombatAncientSpellExtend;
var CombatSpells = exports.CombatSpells = /** @class */ (function () {
    /**
    
    Creates a new {@link CombatSpells}.
    @param spell
           the spell attached to this element.
    */
    function CombatSpells(spell) {
        this.spell = spell;
    }
    CombatSpells.prototype.spellEffectOnHitCalc = function (cast, damage) {
        cast.heal(Math.floor(damage * 0.10));
    };
    /**
    
    Gets the spell attached to this element.
    @return the spell.
    */
    CombatSpells.prototype.getSpell = function () {
        return this.spell;
    };
    /**

Gets the spell with a {@link CombatSpell#spellId()} of {@code id}.
@param id
       the identification of the combat spell.
@return the combat spell with that identification.
*/
    CombatSpells.getCombatSpells = function (id) {
        var spell = Object.values(CombatSpells).find(function (s) { return s && s.getSpell().spellId() === id; });
        return spell ? spell : null;
    };
    CombatSpells.getCombatSpell = function (spellId) {
        var spell = CombatSpells.getCombatSpells(spellId);
        return spell ? spell.getSpell() : null;
    };
    CombatSpells.WIND_STRIKE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 91, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(92, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 2;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(90, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 5;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556), new Item_1.Item(558)];
        },
        levelRequired: function () {
            return 1;
        },
        spellId: function () {
            return 1152;
        }
    });
    CombatSpells.CONFUSE = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(716);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 103, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player has already been weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.05 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            }
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(104, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(102, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 13;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 3), new Item_1.Item(557, 2), new Item_1.Item(559)];
        },
        levelRequired: function () {
            return 3;
        },
        spellId: function () {
            return 1153;
        }
    });
    CombatSpells.WATER_STRIKE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 94, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(95, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 4;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(93, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 7;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555), new Item_1.Item(556), new Item_1.Item(558)];
        },
        levelRequired: function () {
            return 5;
        },
        spellId: function () {
            return 1154;
        },
    });
    CombatSpells.EARTH_STRIKE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 97, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(98, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 6;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(96, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 9;
        },
        equipmentRequired: function (player) {
            return undefined;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 1), new Item_1.Item(558, 1), new Item_1.Item(557, 2)];
        },
        levelRequired: function () {
            return 9;
        },
        spellId: function () {
            return 1156;
        },
    });
    CombatSpells.WEAKEN = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(716);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 106, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH) < player.getSkillManager().getMaxLevel(Skill_1.Skill.STRENGTH)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player has already been weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.05 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.STRENGTH, player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.STRENGTH);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
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
        endGraphic: function () {
            return new Graphic_1.Graphic(107, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(105, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 21;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 3), new Item_1.Item(557, 2), new Item_1.Item(559, 1)];
        },
        levelRequired: function () {
            return 11;
        },
        spellId: function () {
            return 1157;
        },
        getSpellbook: function () {
            return null;
        },
    });
    CombatSpells.FIRE_STRIKE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 100, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(101, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 8;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(99, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 11;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 1), new Item_1.Item(558, 1), new Item_1.Item(554, 3)];
        },
        levelRequired: function () {
            return 13;
        },
        spellId: function () {
            return 1158;
        }
    });
    CombatSpells.WIND_BOLT = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 118, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(119, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 9;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(117, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 13;
        },
        equipmentRequired: function (player) {
            return undefined;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 2), new Item_1.Item(562, 1)];
        },
        levelRequired: function () {
            return 17;
        },
        spellId: function () {
            return 1160;
        }
    });
    CombatSpells.CURSE = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(710);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 109, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE) < player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player has already been weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.05 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.DEFENCE, player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.DEFENCE);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            } /* else if (castOn.isNpc()) {
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
        endGraphic: function () {
            return new Graphic_1.Graphic(110, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(108, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 29;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 2), new Item_1.Item(557, 3), new Item_1.Item(559, 1)];
        },
        levelRequired: function () {
            return 19;
        },
        spellId: function () {
            return 1161;
        }
    });
    CombatSpells.BIND = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(710);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            CombatFactory_1.CombatFactory.freeze(castOn, 5);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(181, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(177, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 30;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 3), new Item_1.Item(557, 3), new Item_1.Item(561, 2)];
        },
        levelRequired: function () {
            return 20;
        },
        spellId: function () {
            return 1572;
        }
    });
    CombatSpells.WATER_BOLT = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 121, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(122, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 10;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(120, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 16;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 2), new Item_1.Item(562, 1), new Item_1.Item(555, 2)];
        },
        levelRequired: function () {
            return 23;
        },
        spellId: function () {
            return 1163;
        }
    });
    CombatSpells.EARTH_BOLT = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 124, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(125, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 11;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(123, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 19;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 2), new Item_1.Item(562, 1), new Item_1.Item(557, 3)];
        },
        levelRequired: function () {
            return 29;
        },
        spellId: function () {
            return 1166;
        }
    });
    CombatSpells.FIRE_BOLT = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 127, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(128, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 12;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(126, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 22;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 3), new Item_1.Item(562, 1), new Item_1.Item(554, 4)];
        },
        levelRequired: function () {
            return 35;
        },
        spellId: function () {
            return 1169;
        }
    });
    CombatSpells.CRUMBLE_UNDEAD = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(724);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 146, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(147);
        },
        maximumHit: function () {
            return 15;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(145, 6553600);
        },
        baseExperience: function () {
            return 24;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [
                new Item_1.Item(556, 2),
                new Item_1.Item(562, 1),
                new Item_1.Item(557, 2),
            ];
        },
        levelRequired: function () {
            return 39;
        },
        spellId: function () {
            return 1171;
        },
    });
    CombatSpells.WIND_BLAST = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 133, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(134, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 13;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(132, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 25;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [
                new Item_1.Item(556, 3),
                new Item_1.Item(560, 1),
            ];
        },
        levelRequired: function () {
            return 41;
        },
        spellId: function () {
            return 1172;
        },
    });
    CombatSpells.WATER_BLAST = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 136, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(137, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 14;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(135, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 28;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [
                new Item_1.Item(555, 3),
                new Item_1.Item(556, 3),
                new Item_1.Item(560, 1),
            ];
        },
        levelRequired: function () {
            return 47;
        },
        spellId: function () {
            return 1175;
        },
    });
    CombatSpells.IBAN_BLAST = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(708);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 88, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(89);
        },
        maximumHit: function () {
            return 25;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(87, 6553600);
        },
        baseExperience: function () {
            return 30;
        },
        equipmentRequired: function (player) {
            return [new Item_1.Item(1409)];
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(560, 1), new Item_1.Item(554, 5)];
        },
        levelRequired: function () {
            return 50;
        },
        spellId: function () {
            return 1539;
        }
    });
    CombatSpells.SNARE = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(710);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            CombatFactory_1.CombatFactory.freeze(castOn, 10);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(180, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(177, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 60;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 3), new Item_1.Item(557, 4), new Item_1.Item(561, 3)];
        },
        levelRequired: function () {
            return 50;
        },
        spellId: function () {
            return 1582;
        }
    });
    CombatSpells.MAGIC_DART = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(1576);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 328, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(329);
        },
        maximumHit: function () {
            return 19;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(327, 6553600);
        },
        baseExperience: function () {
            return 30;
        },
        equipmentRequired: function (player) {
            return [new Item_1.Item(4170)];
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(558, 4), new Item_1.Item(560, 1)];
        },
        levelRequired: function () {
            return 50;
        },
        spellId: function () {
            return 12037;
        }
    });
    CombatSpells.EARTH_BLAST = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 139, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(140, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 15;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(138, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 31;
        },
        equipmentRequired: function (player) {
            return undefined;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 3), new Item_1.Item(560, 1), new Item_1.Item(557, 4)];
        },
        levelRequired: function () {
            return 53;
        },
        spellId: function () {
            return 1177;
        }
    });
    CombatSpells.FIRE_BLAST = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(711);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 130, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(131, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 16;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(129, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 34;
        },
        equipmentRequired: function (player) {
            return undefined;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 4), new Item_1.Item(560, 1), new Item_1.Item(554, 5)];
        },
        levelRequired: function () {
            return 59;
        },
        spellId: function () {
            return 1181;
        }
    });
    CombatSpells.SARADOMIN_STRIKE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(811);
        },
        castProjectile: function (cast, castOn) {
            return undefined;
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(76);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return undefined;
        },
        baseExperience: function () {
            return 35;
        },
        equipmentRequired: function (player) {
            return [new Item_1.Item(2415)];
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 4), new Item_1.Item(565, 2), new Item_1.Item(554, 2)];
        },
        levelRequired: function () {
            return 60;
        },
        spellId: function () {
            return 1190;
        }
    });
    CombatSpells.CLAWS_OF_GUTHIX = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(811);
        },
        castProjectile: function (cast, castOn) {
            return null;
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(77);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return null;
        },
        baseExperience: function () {
            return 35;
        },
        equipmentRequired: function (player) {
            return [new Item_1.Item(2416)];
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 4), new Item_1.Item(565, 2), new Item_1.Item(554, 2)];
        },
        levelRequired: function () {
            return 60;
        },
        spellId: function () {
            return 1191;
        }
    });
    CombatSpells.FLAMES_OF_ZAMORAK = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(811);
        },
        castProjectile: function (cast, castOn) {
            return null;
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(78);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return null;
        },
        baseExperience: function () {
            return 35;
        },
        equipmentRequired: function (player) {
            return [new Item_1.Item(2417)];
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 4), new Item_1.Item(565, 2), new Item_1.Item(554, 2)];
        },
        levelRequired: function () {
            return 60;
        },
        spellId: function () {
            return 1192;
        }
    });
    CombatSpells.WIND_WAVE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(727);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 159, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(160, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 17;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(158, GraphicHeight_1.GraphicHeight.MIDDLE);
        },
        baseExperience: function () {
            return 36;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 5), new Item_1.Item(565, 1)];
        },
        levelRequired: function () {
            return 62;
        },
        spellId: function () {
            return 1183;
        }
    });
    CombatSpells.WATER_WAVE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(727);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 162, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(163, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 18;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(161, GraphicHeight_1.GraphicHeight.MIDDLE);
        },
        baseExperience: function () {
            return 37;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 5), new Item_1.Item(565, 1), new Item_1.Item(555, 7)];
        },
        levelRequired: function () {
            return 65;
        },
        spellId: function () {
            return 1185;
        }
    });
    CombatSpells.VULNERABILITY = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(729);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 168, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE) < player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player is already weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.DEFENCE, player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.DEFENCE);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            } /* else if (castOn.isNpc()) {
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
        endGraphic: function () {
            return new Graphic_1.Graphic(169);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(167, 6553600);
        },
        baseExperience: function () {
            return 76;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(557, 5), new Item_1.Item(555, 5), new Item_1.Item(566, 1)];
        },
        levelRequired: function () {
            return 66;
        },
        spellId: function () {
            return 1542;
        }
    });
    CombatSpells.EARTH_WAVE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(727);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 165, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(166, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 19;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(164, GraphicHeight_1.GraphicHeight.MIDDLE);
        },
        baseExperience: function () {
            return 40;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 5), new Item_1.Item(565, 1), new Item_1.Item(557, 7)];
        },
        levelRequired: function () {
            return 70;
        },
        spellId: function () {
            return 1188;
        }
    });
    CombatSpells.ENFEEBLE = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(729);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 171, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH) < player.getSkillManager().getMaxLevel(Skill_1.Skill.STRENGTH)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player is already weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.10 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH)));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.STRENGTH, player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.STRENGTH);
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
            return new Graphic_1.Graphic(172);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(170, 6553600);
        },
        baseExperience: function () {
            return 83;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(557, 8), new Item_1.Item(555, 8), new Item_1.Item(566, 1)];
        },
        levelRequired: function () {
            return 73;
        },
        spellId: function () {
            return 1543;
        }
    });
    CombatSpells.FIRE_WAVE = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(727);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 156, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(157, GraphicHeight_1.GraphicHeight.HIGH);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(155, GraphicHeight_1.GraphicHeight.MIDDLE);
        },
        baseExperience: function () {
            return 42;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(556, 5), new Item_1.Item(565, 1), new Item_1.Item(554, 7)];
        },
        levelRequired: function () {
            return 75;
        },
        spellId: function () {
            return 1189;
        }
    });
    CombatSpells.ENTANGLE = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(710);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 178, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            CombatFactory_1.CombatFactory.freeze(castOn, 15);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(179, GraphicHeight_1.GraphicHeight.HIGH);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(177, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 91;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(555, 5), new Item_1.Item(557, 5), new Item_1.Item(561, 4)];
        },
        levelRequired: function () {
            return 79;
        },
        spellId: function () {
            return 1592;
        }
    });
    CombatSpells.STUN = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(729);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 174, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player is already weakened.");
                    }
                    return;
                }
                var decrease = Math.floor(0.10 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK)));
                player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
                player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
                player.getPacketSender().sendMessage("You feel slightly weakened.");
            } /* else if (castOn.isNpc()) {
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
        endGraphic: function () {
            return new Graphic_1.Graphic(107);
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(173, 6553600);
        },
        baseExperience: function () {
            return 90;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(557, 12), new Item_1.Item(555, 12), new Item_1.Item(556, 1)];
        },
        levelRequired: function () {
            return 80;
        },
        spellId: function () {
            return 1562;
        }
    });
    CombatSpells.TELEBLOCK = new CombatEffectSpell_1.CombatEffectSpell({
        castAnimation: function () {
            return new Animation_1.Animation(1819);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 344, 0, 20, 43, 31);
        },
        spellEffect: function (cast, castOn) {
            if (castOn.isPlayer()) {
                var player = castOn;
                if (!player.getCombat().getTeleblockTimer().finished()) {
                    if (cast.isPlayer()) {
                        cast.getPacketSender().sendMessage("The spell has no effect because the player is already teleblocked.");
                    }
                    return;
                }
                var seconds = player.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MAGIC] ? 300 : 600;
                player.getCombat().getTeleblockTimer().start(seconds);
                player.getPacketSender().sendEffectTimer(seconds, EffectTimer_1.EffectTimer.TELE_BLOCK)
                    .sendMessage("You have just been teleblocked!");
            }
            else if (castOn.isNpc()) {
                if (cast.isPlayer()) {
                    cast.getPacketSender().sendMessage("Your spell has no effect on this target.");
                }
            }
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(345);
        },
        startGraphic: function () {
            return null;
        },
        baseExperience: function () {
            return 65;
        },
        itemsRequired: function (player) {
            return [new Item_1.Item(563, 1), new Item_1.Item(562, 1), new Item_1.Item(560, 1)];
        },
        levelRequired: function () {
            return 85;
        },
        spellId: function () {
            return 12445;
        }
    });
    CombatSpells.SMOKE_RUSH = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { return null; }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.poisonEntity(castOn, CombatPoisonEffect_1.PoisonType.MILD); }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 384, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(385); }, function () { return 13; }, function () { return 30; }, function () { return [new Item_1.Item(556, 1), new Item_1.Item(554, 1), new Item_1.Item(562, 2), new Item_1.Item(560, 2)]; }, function () { return 50; }, function () { return 12939; });
    CombatSpells.SHADOW_RUSH = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { }, function (cast, castOn, damage) {
        if (castOn.isPlayer()) {
            var player = castOn;
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                return;
            }
            var decrease = Math.floor(0.1 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK)));
            player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
            player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
        }
    }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 378, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(379); }, function () { return 14; }, function () { return 31; }, function () { return [new Item_1.Item(556, 1), new Item_1.Item(566, 1), new Item_1.Item(562, 2), new Item_1.Item(560, 2)]; }, function () { return 52; }, function () { return 12987; });
    CombatSpells.BLOOD_RUSH = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { }, function (cast, castOn, damage) { cast.heal(Math.floor(damage * 0.10)); }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 372, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(373); }, function () { return 15; }, function () { return 33; }, function () {
        return [
            new Item_1.Item(565, 1),
            new Item_1.Item(562, 2),
            new Item_1.Item(560, 2),
        ];
    }, function () { return 56; }, function () { return 12901; });
    CombatSpells.ICE_RUSH = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.freeze(castOn, 5); }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 360, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(361); }, function () { return 18; }, function () { return 34; }, function () {
        return [
            new Item_1.Item(555, 2),
            new Item_1.Item(562, 2),
            new Item_1.Item(560, 2),
        ];
    }, function () { return 58; }, function () { return 12861; });
    CombatSpells.SMOKE_BURST = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.poisonEntity(castOn, CombatPoisonEffect_1.PoisonType.MILD); }, function () { return 1; }, function () { return null; }, function () { return new Graphic_1.Graphic(389); }, function () { return 13; }, function () { return 36; }, function () { return [new Item_1.Item(556, 2), new Item_1.Item(554, 2), new Item_1.Item(562, 4), new Item_1.Item(560, 2)]; }, function () { return 62; }, function () { return 12963; });
    CombatSpells.SHADOW_BURST = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) {
        if (castOn.isPlayer()) {
            var player = castOn;
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                return;
            }
            var decrease = Math.floor(0.1 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK));
            player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
            player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
        }
    }, function () { return 1; }, function () { return null; }, function () { return new Graphic_1.Graphic(382); }, function () { return 18; }, function () { return 37; }, function () { return [new Item_1.Item(556, 1), new Item_1.Item(566, 2), new Item_1.Item(562, 4), new Item_1.Item(560, 2)]; }, function () { return 64; }, function () { return 13011; });
    CombatSpells.BLOOD_BURST = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) { cast.heal(Math.floor(damage * 0.15)); }, function () { return 1; }, function () { return null; }, function () { return new Graphic_1.Graphic(376); }, function () { return 21; }, function () { return 39; }, function () { return [new Item_1.Item(565, 2), new Item_1.Item(562, 4), new Item_1.Item(560, 2)]; }, function () { return 68; }, function () { return 12919; });
    CombatSpells.ICE_BURST = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.freeze(castOn, 10); }, function () { return 1; }, function () { return null; }, function () { return new Graphic_1.Graphic(363); }, function () { return 22; }, function () { return 40; }, function () {
        return [
            new Item_1.Item(555, 4),
            new Item_1.Item(562, 4),
            new Item_1.Item(560, 2),
        ];
    }, function () { return 70; }, function () { return 12881; });
    CombatSpells.SMOKE_BLITZ = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { return null; }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.poisonEntity(castOn, CombatPoisonEffect_1.PoisonType.EXTRA); }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 386, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(387); }, function () { return 23; }, function () { return 42; }, function () { return [new Item_1.Item(556, 2), new Item_1.Item(554, 2), new Item_1.Item(565, 2), new Item_1.Item(560, 2)]; }, function () { return 74; }, function () { return 12951; });
    CombatSpells.SHADOW_BLITZ = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { return null; }, function (cast, castOn, damage) {
        if (castOn.isPlayer()) {
            var player = castOn;
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                return;
            }
            var decrease = Math.floor(0.15 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK)));
            player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
            player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
        }
    }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 380, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(381); }, function () { return 24; }, function () { return 43; }, function () { return [new Item_1.Item(556, 2), new Item_1.Item(566, 2), new Item_1.Item(565, 2), new Item_1.Item(560, 2)]; }, function () { return 76; }, function () { return 12999; });
    CombatSpells.BLOOD_BLITZ = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { return null; }, function (cast, castOn, damage) { cast.heal(Math.floor(damage * 0.20)); }, function () { return 0; }, function (cast, castOn) { return Projectile_1.Projectile.createProjectile(cast, castOn, 374, 0, 20, 43, 31); }, function () { return new Graphic_1.Graphic(375); }, function () { return 25; }, function () { return 45; }, function () { return [new Item_1.Item(565, 4), new Item_1.Item(560, 2)]; }, function () { return 80; }, function () { return 12911; });
    CombatSpells.ICE_BLITZ = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1978); }, function () { return new Graphic_1.Graphic(366, 6553600); }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.freeze(castOn, 15); }, function () { return 0; }, function (cast, castOn) { return null; }, function () { return new Graphic_1.Graphic(367); }, function () { return 26; }, function () { return 46; }, function () { return [new Item_1.Item(555, 3), new Item_1.Item(565, 2), new Item_1.Item(560, 2)]; }, function () { return 82; }, function () { return 12871; });
    CombatSpells.SMOKE_BARRAGE = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.poisonEntity(castOn, CombatPoisonEffect_1.PoisonType.SUPER); }, function () { return 1; }, function (cast, castOn) { return null; }, function () { return new Graphic_1.Graphic(391); }, function () { return 27; }, function () { return 48; }, function () { return [new Item_1.Item(556, 4), new Item_1.Item(554, 4), new Item_1.Item(565, 2), new Item_1.Item(560, 4)]; }, function () { return 86; }, function () { return 12975; });
    CombatSpells.SHADOW_BARRAGE = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) {
        if (castOn.isPlayer()) {
            var player = castOn;
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) < player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)) {
                return;
            }
            var decrease = Math.floor(0.15 * (player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK)));
            player.getSkillManager().setCurrentLevelCombat(Skill_1.Skill.ATTACK, player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK) - decrease);
            player.getSkillManager().updateSkill(Skill_1.Skill.ATTACK);
        }
    }, function () { return 1; }, function (cast, castOn) { return null; }, function () { return new Graphic_1.Graphic(383); }, function () { return 28; }, function () { return 49; }, function () { return [new Item_1.Item(556, 4), new Item_1.Item(566, 3), new Item_1.Item(565, 2), new Item_1.Item(560, 4)]; }, function () { return 88; }, function () { return 13023; });
    CombatSpells.BLOOD_BARRAGE = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) { cast.heal(Math.floor(damage * 0.20)); }, function () { return 1; }, function (cast, castOn) { return null; }, function () { return new Graphic_1.Graphic(377); }, function () { return 29; }, function () { return 51; }, function () { return [new Item_1.Item(560, 4), new Item_1.Item(566, 1), new Item_1.Item(565, 4)]; }, function () { return 92; }, function () { return 12929; });
    CombatSpells.ICE_BARRAGE = new CombatAncientSpellExtend(function () { return new Animation_1.Animation(1979); }, function () { return null; }, function (cast, castOn, damage) { CombatFactory_1.CombatFactory.freeze(castOn, 20); }, function () { return 1; }, function (cast, castOn) { return null; }, function () { return new Graphic_1.Graphic(369); }, function () { return 30; }, function () { return 52; }, function () { return [new Item_1.Item(555, 6), new Item_1.Item(565, 2), new Item_1.Item(560, 4)]; }, function () { return 94; }, function () { return 12891; }, function () { return Sound_1.Sound.ICA_BARRAGE_IMPACT; });
    CombatSpells.TRIDENT_OF_THE_SEAS = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(1167);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 1252, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(1253);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(1251, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 50;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return null;
        },
        levelRequired: function () {
            return 75;
        },
        spellId: function () {
            return 1;
        }
    });
    CombatSpells.TRIDENT_OF_THE_SWAMP = new CombatNormalSpell_1.CombatNormalSpell({
        castAnimation: function () {
            return new Animation_1.Animation(1167);
        },
        castProjectile: function (cast, castOn) {
            return Projectile_1.Projectile.createProjectile(cast, castOn, 1040, 0, 20, 43, 31);
        },
        endGraphic: function () {
            return new Graphic_1.Graphic(1042);
        },
        maximumHit: function () {
            return 20;
        },
        startGraphic: function () {
            return new Graphic_1.Graphic(665, GraphicHeight_1.GraphicHeight.HIGH);
        },
        baseExperience: function () {
            return 50;
        },
        equipmentRequired: function (player) {
            return null;
        },
        itemsRequired: function (player) {
            return null;
        },
        levelRequired: function () {
            return 75;
        },
        spellId: function () {
            return 1;
        }
    });
    return CombatSpells;
}());
//# sourceMappingURL=CombatSpells.js.map