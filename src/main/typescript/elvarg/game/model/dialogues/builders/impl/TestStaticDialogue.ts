import { DialogueBuilder } from '../../../../model/dialogues/builders/DialogueBuilder'
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { PlayerDialogue } from '../../../../model/dialogues/entries/impl/PlayerDialogue'

export class TestStaticDialogue extends DialogueBuilder {
    constructor() {
      super();
      this.add(
        new PlayerDialogue(0, "Well this works just fine."),
        new PlayerDialogue(1, "Second test"),
        new NpcDialogue(2, 6797, "okay great.")
      );
    }
  }