import { TimeUnit } from 'timeunit'
import  schedule  from 'node-schedule';


export class GameLogic {
    private static logicService: schedule = GameLogic.createLogicService();

    public static async submit(t: () => void) {
        try {
            await GameLogic.logicService.schedule(t, 0, TimeUnit.MILLISECONDS);
        } catch (e) {
            console.error(e);
        }
    }

    private static createLogicService(): schedule {
        const executor = new schedule(1);
        executor.setRejectedExecutionHandler(new schedule());
        executor.setKeepAliveTime(45, TimeUnit.SECONDS);
        executor.allowCoreThreadTimeOut(true);
        return schedule.unconfigurableScheduledExecutorService(executor);
    }
}