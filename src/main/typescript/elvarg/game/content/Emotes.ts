import { CombatFactory } from "./combat/CombatFactory";
import { SkillManager } from "./skill/SkillManager";
import { Player } from "../entity/impl/player/Player";
import { Animation } from "../model/Animation";
import { Graphic } from "../model/Graphic";
import { Skill } from "../model/Skill";
import { Skillcape } from "../model/Skillcape";
import { Equipment } from "../model/container/impl/Equipment";
import { Misc } from "../../util/Misc";


export class Emotes {

    public static doEmote(player: Player, button: number): boolean {
        const data: EmoteData | null = EmoteData.forId(button);
        if (data != null) {
            Emotes.animation(player, data.animation, data.graphic);
            return true;
        }

        // Skill cape button
        if (button == 19052) {
            const cape: Skillcape | null =
                Skillcape.forId(player.getEquipment().getItems()[Equipment.CAPE_SLOT].getId());
            if (cape != null) {
                if (cape != Skillcape.QUEST_POINT) {
                    if (cape < Skillcape.QUEST_POINT) {
                        // Check if player is maxed in skill
                        const skill: Skill = Object.values(Skill)[cape.getDelay()];
                        const level: number = SkillManager.getMaxAchievingLevel(skill);
                        if (player.getSkillManager().getMaxLevel(skill) < level) {
                            player.getPacketSender().sendMessage(
                                `You need ${Misc.anOrA(skill.toString())} ${Misc.formatPlayerName(
                                    skill.toString().toLowerCase()
                                )} level of at least ${level} to do this emote.`
                            );
                            return false;
                        }
                    } else {
                        // Custom capes..
                        /*if(cape == Skillcape.MAX_CAPE) {
                          //Check if all level 99s
                          for(Skill skill : Skill.values()) {
                            int level = SkillManager.getMaxAchievingLevel(skill);
                            if (player.getSkillManager().getMaxLevel(skill) < level) {
                              player.getPacketSender().sendMessage("You need "+Misc.anOrA(skill.getName())+" " + Misc.formatPlayerName(skill.getName().toLowerCase()) + " level of at least "+ level + " to do this emote.");
                              return false;
                            }
                          }
                        }*/
                    }
                }
                Emotes.animation(player, cape.getAnimation(), cape.getGraphic());
            }
            return true;
        }
        return false;
    }

    private static animation(player: Player, anim: Animation | null, graphic: Graphic | null): void {
        if (CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot do this right now.");
            return;
        }

        //Stop skilling..
        player.getSkillManager().stopSkillable();

        //Stop movement..
        player.getMovementQueue().reset();

        if (anim !== null) {
            player.performAnimation(anim);
        }
        if (graphic !== null) {
            player.performGraphic(graphic);
        }
    }


}

export interface EmoteDataInterface {
    button: number;
    animation: Animation;
    graphic: Graphic | null;
}

const EMOTES = {
    YES: [168, new Animation(855), null],
    NO: [169, new Animation(856), null],
    BOW: [164, new Animation(858), null],
    ANGRY: [165, new Animation(859), null],
    THINK: [162, new Animation(857), null],
    WAVE: [163, new Animation(863), null],
    SHRUG: [13370, new Animation(2113), null],
    CHEER: [171, new Animation(862), null],
    BECKON: [167, new Animation(864), null],
    LAUGH: [170, new Animation(861), null],
    JUMP_FOR_JOY: [13366, new Animation(2109), null],
    YAWN: [13368, new Animation(2111), null],
    DANCE: [166, new Animation(866), null],
    JIG: [13363, new Animation(2106), null],
    SPIN: [13364, new Animation(2107), null],
    HEADBANG: [13365, new Animation(2108), null],
    CRY: [161, new Animation(860), null],
    KISS: [11100, new Animation(1374), new Graphic(574, 25)],
    PANIC: [13362, new Animation(2105), null],
    RASPBERRY: [13367, new Animation(2110), null],
    CRAP: [172, new Animation(865), null],
    SALUTE: [13369, new Animation(2112), null],
    GOBLIN_BOW: [13383, new Animation(2127), null],
    GOBLIN_SALUTE: [13384, new Animation(2128), null],
    GLASS_BOX: [667, new Animation(1131), null],
    CLIMB_ROPE: [6503, new Animation(1130), null],
    LEAN: [6506, new Animation(1129), null],
    GLASS_WALL: [666, new Animation(1128), null],
    ZOMBIE_WALK: [18464, new Animation(3544), null],
    ZOMBIE_DANCE: [18465, new Animation(3543), null],
    SCARED: [15166, new Animation(2836), null],
    RABBIT_HOP: [18686, new Animation(6111), null]
    /*ZOMBIE_HAND: [15166, new Animation(7272), new Graphic(1244)],
    SAFETY_FIRST: [6540, new Animation(8770), new Graphic(1553)],
    AIR_GUITAR: [11101, new Animation(2414), new Graphic(1537)],
    SNOWMAN_DANCE: [11102, new Animation(7531), null],
    FREEZE: [11103, new Animation(11044), new Graphic(1973)],*/
}

export class EmoteData {
    public static emotes = new Map<number, EmoteData>();

    static {
        for (const t of Object.values(EmoteData)) {
            const { button } = t;
            EmoteData.emotes.set(button, t);
        }
    }

    public animation: Animation;
    public graphic: Graphic;
    private button: number;

    constructor(button: number, animation: Animation, graphic: Graphic) {
        this.button = button;
        this.animation = animation;
        this.graphic = graphic;
    }

    public static forId(button: number): EmoteData | undefined {
        return EmoteData.emotes.get(button);
    }
}








