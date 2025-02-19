import { ThreadPoolExecutor } from 'async';
import { GameConstants } from '../../../GameConstants';
import { GameSyncTask } from './GameSyncTask';
import * as Phaser from 'phaser';

export class GameSyncExecutor {

  /**
   * The executor that will execute the synchronization tasks. This value may
   * or may not be `null`.
   */
  private service: any;

  /**
   * The synchronizer that ensures that the thread waits until tasks are
   * completed before proceeding. This value may or may not be `null`.
   */
  private phaser: any;

  /**
   * Creates a new `GameSyncExecutor`. It automatically determines how
   * many threads; if any, are needed for game synchronization.
   */
  constructor() {
    this.service = GameConstants.CONCURRENCY ? this.create(navigator.hardwareConcurrency) : null;
    this.phaser = GameConstants.CONCURRENCY ? new Phaser.Game({}) : null;
  }

  /**
   * Submits `syncTask` to be executed as a synchronization task under
   * this executor. This method can and probably will block the calling thread
   * until it completes.
   *
   * @param syncTask the synchronization task to execute.
   */
  public sync(syncTask: GameSyncTask): void {
    if (this.service == null || this.phaser == null || !syncTask.isConcurrent()) {
      for (let index = 1; index < syncTask.getCapacity(); index++) {
        if (!syncTask.checkIndex(index)) {
          continue;
        }
        syncTask.execute(index);
      }
      return;
    }

    this.phaser.bulkRegister(syncTask.getAmount());
    for (let index = 1; index < syncTask.getCapacity(); index++) {
      if (!syncTask.checkIndex(index)) {
        continue;
      }
      const finalIndex = index;
      this.service.execute(() => {
        try {
          syncTask.execute(finalIndex);
        } finally {
          this.phaser.arriveAndDeregister();
        }
      });
    }
    this.phaser.arriveAndAwaitAdvance();
  }

  /**
   * Creates and configures the update service for this game sync executor.
   * The returned executor is <b>unconfigurable</b> meaning it's configuration
   * can no longer be modified.
   *
   * @param nThreads the amount of threads to create this service.
   * @return the newly created and configured service.
   */
  private create(nThreads: number): any {
    if (nThreads <= 1) {
      return null;
    }
    const executor = new ThreadPoolExecutor(nThreads, nThreads, 0, "GameSyncThread");
    executor.on("rejected", (task: any) => {
      console.warn(`Task ${task} has been rejected from the GameSyncExecutor`);
    });
    return executor;
  }
}