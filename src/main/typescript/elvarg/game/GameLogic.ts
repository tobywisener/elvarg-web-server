import { TimeUnit } from 'timeunit';
import { Agenda } from 'agenda';


export class GameLogic {
    private static logicService: Agenda = GameLogic.createLogicService();

    public static async submit(t: () => void) {
        try {
            // @ts-ignore
            GameLogic.logicService.define('job', { priority: 'high' }, (job, done) => {
                t();
                done();
            });

            await GameLogic.logicService.schedule(
                new Date(Date.now() + 1), // Date to run the job
                'job', // Name of the job
                {}
            );
        } catch (e) {
            console.error(e);
        }
    }

    private static createLogicService(): Agenda {
        const executor = new Agenda({ maxConcurrency: 1 });
        executor.defaultConcurrency = (concurrency: number) =>
            executor.maxConcurrency(concurrency);
        executor.defaultLockLifetime(45 * 1000);
        executor.define('job', { concurrency: 1 }, (_, done) => {
            done();
        });
        return executor;
    }
}
