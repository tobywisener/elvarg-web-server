import { Task } from './Task';
 
export class TaskManager {
    private static pendingTasks: Task[] = [];
    private static activeTasks: Task[] = [];
    
    private constructor() {
        throw new Error("This class cannot be instantiated!");
    }
    
    public static process(): void {
        try {
            let t: Task;
            while ((t = TaskManager.pendingTasks.shift()) != null) {
                if (t.isRunning()) {
                    TaskManager.activeTasks.push(t);
                }
            }
    
            for (let i = 0; i < TaskManager.activeTasks.length; i++) {
                t = TaskManager.activeTasks[i];
                if (!t.tick()) {
                    TaskManager.activeTasks.splice(i, 1);
                    i--;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    
    public static submit(task: Task): void {
        if (task.isRunning()) {
            return;
        }
    
        task.setRunning(true);
    
        if (task.isImmediate()) {
            task.execute();
        }
    
        TaskManager.pendingTasks.push(task);
    }

    public static cancelTask(keys: any[]): void {
        for (const key of keys) {
        TaskManager.cancelTask(key);
        }
    }
        
    
    public static cancelTasks(key: Object): void {
            try {
                TaskManager.pendingTasks.filter(t => t.key === key).forEach(t => t.stop());
                TaskManager.activeTasks.filter(t => t.key === key).forEach(t => t.stop());
            } catch (e) {
                console.error(e);
            }
    }
        
    public static getTaskAmount(): number {
            return (TaskManager.pendingTasks.length + TaskManager.activeTasks.length);
    }
}
