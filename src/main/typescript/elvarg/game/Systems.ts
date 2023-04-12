import { NPC } from '../game/entity/impl/npc/NPC';
import requireAll from 'require-all';
import 'reflect-metadata';

export class Systems {
  public static init() {
    const npcOverrideClasses = requireAll({
      dirname: `${__dirname}/game/entity/impl/npc`,
      filter: /^(?!.*base).*\.js$/,
      recursive: true,
      map: (name, path) => require(path).default
    });

    const npcClasses = Object.values(npcOverrideClasses).filter((clazz: any) => Reflect.hasOwnMetadata('Ids', clazz.prototype));
    const implementationClasses = npcClasses.filter((clazz: any) => clazz.prototype instanceof NPC);
    NPC.initImplementations(implementationClasses);
  }
}
