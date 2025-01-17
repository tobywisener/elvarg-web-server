import {Task} from "../Task";

export class ItemContainerTask extends Task {
    constructor(private readonly execFunc: Function) {
        super(1);
    }
    execute(): void {
        this.execFunc();
    }

}
