import { Dialogue } from "../entries/Dialogue";
export abstract class DialogueBuilder {
    private readonly dialogues: Map<number, Dialogue>;

    constructor() {
        this.dialogues = new Map();
    }

    public add(...dialogues: Dialogue[]) {
        for (let dialogue of dialogues) {
            this.dialogues.set(dialogue.getIndex(), dialogue);
        }
        return this;
    }

    public getDialogues(): Map<number, Dialogue> {
        return this.dialogues;
    }
}