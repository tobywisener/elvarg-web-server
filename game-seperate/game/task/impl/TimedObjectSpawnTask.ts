import { GameObject } from "../../entity/impl/object/GameObject";
import { ObjectManager } from "../../entity/impl/object/ObjectManager";
import { Action } from '../../model/Action';
import { Task } from "../Task";
export class TimedObjectSpawnTask extends Task {
    private temp: GameObject;
    private ticks: number;
    private action: Action;
    public static tick = 0;

    constructor(temp: GameObject, ticks: number, action: Action) {
        super();
        this.temp = temp;
        this.action = action;
        this.ticks = ticks;
    }

    execute() {
        if (TimedObjectSpawnTask.tick === 0) {
            ObjectManager.register(this.temp, true);
        } else if (TimedObjectSpawnTask.tick >= this.ticks) {
            ObjectManager.deregister(this.temp, true);

            if (this.action != null) {
                this.action.execute();
            }

            stop();
        }
        TimedObjectSpawnTask.tick++;
    }

    onExecute() {

    }
}