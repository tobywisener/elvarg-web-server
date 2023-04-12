import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { Player } from "../../../../entity/impl/player/Player";
import { AnimationLoop } from "../../../../model/AnimationLoop";
import { Animation } from "../../../../model/Animation";
import { CreationMenu, CreationMenuAction } from "../../../../model/menu/CreationMenu";
import { ItemCreationSkillable } from "./ItemCreationSkillable";
import { RequiredItem } from "../../../../model/RequiredItem";
import { Item } from "../../../../model/Item";
import { Skill } from "../../../../model/Skill";


class CraftingCreationMenuAction implements CreationMenuAction{
    constructor(private func: Function){
        
    }

    execute(item: number, amount: number): void {
        this.func(item, amount)
    }
    
}

class Crafting extends ItemIdentifiers {
    public static craftGem(player: Player, itemUsed: number, itemUsedWith: number): boolean {
        if (itemUsed == ItemIdentifiers.CHISEL || itemUsedWith == ItemIdentifiers.CHISEL) {
            let gem = CraftableGem.map.get(itemUsed == ItemIdentifiers.CHISEL ? itemUsedWith : itemUsed);
            if (gem) {
                player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to cut?", [gem.getCut().getId()], new CraftingCreationMenuAction((itemId, amount) => {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable([new RequiredItem(new Item(ItemIdentifiers.CHISEL), false), new RequiredItem(gem.getUncut(), true)], gem.getCut(), amount, gem.getAnimationLoop(), gem.getLevel(), gem.getExp(), Skill.CRAFTING));
                })));
                return true;
            }
        }
        return false;
    }
    
}

export class CraftableGem {
    public static readonly G1 = new CraftableGem(
      new Item(ItemIdentifiers.OPAL), new Item(ItemIdentifiers.UNCUT_OPAL), 1, 15,
      new AnimationLoop(new Animation(890), 3)
    );
    public static readonly G2 = new CraftableGem(
      new Item(ItemIdentifiers.JADE), new Item(ItemIdentifiers.UNCUT_JADE), 13, 20,
      new AnimationLoop(new Animation(891), 3)
    );
    public static readonly G3 = new CraftableGem(
      new Item(ItemIdentifiers.RED_TOPAZ), new Item(ItemIdentifiers.UNCUT_RED_TOPAZ), 16, 25,
      new AnimationLoop(new Animation(892), 3)
    );
    public static readonly G4 = new CraftableGem(
      new Item(ItemIdentifiers.SAPPHIRE), new Item(ItemIdentifiers.UNCUT_SAPPHIRE), 20, 50,
      new AnimationLoop(new Animation(888), 3)
    );
    public static readonly G5 = new CraftableGem(
      new Item(ItemIdentifiers.EMERALD), new Item(ItemIdentifiers.UNCUT_EMERALD), 27, 68,
      new AnimationLoop(new Animation(889), 3)
    );
    public static readonly G6 = new CraftableGem(
      new Item(ItemIdentifiers.RUBY), new Item(ItemIdentifiers.UNCUT_RUBY), 34, 85,
      new AnimationLoop(new Animation(887), 3)
    );
    public static readonly G7 = new CraftableGem(
      new Item(ItemIdentifiers.DIAMOND), new Item(ItemIdentifiers.UNCUT_DIAMOND), 43, 108,
      new AnimationLoop(new Animation(886), 3)
    );
    public static readonly G8 = new CraftableGem(
      new Item(ItemIdentifiers.DRAGONSTONE), new Item(ItemIdentifiers.UNCUT_DRAGONSTONE), 55, 138,
      new AnimationLoop(new Animation(885), 3)
    );
    public static readonly G9 = new CraftableGem(
      new Item(ItemIdentifiers.ONYX), new Item(ItemIdentifiers.UNCUT_ONYX), 67, 168,
      new AnimationLoop(new Animation(885), 3)
    );
    public static readonly G10 = new CraftableGem(
      new Item(ItemIdentifiers.ZENYTE), new Item(ItemIdentifiers.UNCUT_ZENYTE), 89, 200,
      new AnimationLoop(new Animation(885), 3)
    );
  
    public static readonly map = new Map<number, CraftableGem>();
  
    static {
      for (let c of Object.values(CraftableGem)) {
        CraftableGem.map.set(c.getUncut().getId(), c);
      }
    }
  
    private readonly cut: Item;
    private readonly uncut: Item;
    private readonly level: number;
    private readonly exp: number;
    private readonly animLoop: AnimationLoop;
  
    constructor(cut: Item, uncut: Item, level: number, exp: number, animLoop: AnimationLoop){
        this.cut = cut;
        this.uncut = uncut;
        this.exp = exp;
        this.animLoop = animLoop;
    }


    getCut(): Item {
        return this.cut;
    }

    getUncut(): Item {
        return this.uncut;
    }

    getLevel(): number {
        return this.level;
    }

    getExp(): number {
        return this.exp;
    }

    getAnimationLoop(): AnimationLoop {
        return this.animLoop;
    }
}
 
