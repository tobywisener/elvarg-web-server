import { DialogueOption } from "./DialogueOption";

export interface DialogueOptionAction {
    executeOption(option: DialogueOption): void;
}