import { GraphicHeight } from "./GraphicHeight";
import { Priority } from "./Priority";
export class Graphic {
    public id: number;
    public delay: number;
    public height: GraphicHeight;
    public priority: Priority;

    constructor(id: number, delay?: number, height: GraphicHeight = GraphicHeight.LOW) {
        this.id = id;
        this.delay = delay ?? -1;
        this.height = height;
        this.priority = Priority.LOW;
      }

    public getId(): number {
        return this.id;
    }

    /**
* Gets the graphic's wait delay.
*
* @return delay.
*/
    public getDelay(): number {
        return this.delay;
    }

    /**
     * Gets the graphic's height level to be displayed in.
     *
     * @return The height level.
     */
    public getHeight(): GraphicHeight {
        return this.height;
    }

    /**
     * Gets the priority of this graphic.
     *
     * @return the priority.
     */
    public getPriority(): Priority {
        return this.priority;
    }
}