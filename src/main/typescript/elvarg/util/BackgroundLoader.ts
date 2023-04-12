import { ExecutorService } from 'executor-service'
import { Collection } from 'lodash'
import { ArrayDeque } from 'double-ended-queue'
import { TimeUnit } from 'timeunit'



interface Runnable {
  run(): void;
}

interface Thread {
  start(): void;
  setName(name: string): void;
  setDaemon(daemon: boolean): void;
}

interface ThreadFactory {
  createThread(runnable: Runnable): Thread;
}

interface ExecutorService {
  submit(runnable: Runnable): void;
}

class BackgroundLoaderThread implements Thread {
  private readonly worker: Worker;

  constructor(runnable: Runnable) {
    this.worker = new Worker(URL.createObjectURL(
      new Blob([`(${runnable.run.toString()})()`], { type: 'text/javascript' })
    ));
  }

  start() {
    // Não faz nada, o worker já está rodando
  }

  setName(name: string) {
    // Não faz nada, não temos acesso ao nome do worker
  }

  setDaemon(daemon: boolean) {
    // Não faz nada, não podemos mudar a natureza do worker
  }
}

class BackgroundLoaderThreadFactory implements ThreadFactory {
  createThread(runnable: Runnable): Thread {
    return new BackgroundLoaderThread(runnable);
  }
}

class BackgroundLoaderExecutorService implements ExecutorService {
  private readonly threadFactory: ThreadFactory;
  private terminated = false;

  constructor() {
    this.threadFactory = new BackgroundLoaderThreadFactory();
  }

  submit(runnable: Runnable) {
    const thread = this.threadFactory.createThread(runnable);
    thread.start();
  }

  isTerminated(): boolean {
    return this.terminated;
  }

  shutdown(): void {
    this.terminated = true;
  }

  awaitTermination(timeout: number, unit: TimeUnit): boolean {
    const millis = unit.toMillis(timeout);
    let remaining = millis;
    let terminated = true;

    while (remaining > 0) {
      try {
        this.awaitTermination(remaining, TimeUnit.MILLISECONDS);
        terminated = true;
        break;
      } catch (e) {
        terminated = false;
        remaining -= millis - remaining;
      }
    }

    return terminated;
  }

  execute(runnable: Runnable): void {
    this.submit(runnable);
  }

}

export class BackgroundLoader {

  private service = new BackgroundLoaderExecutorService();

  private tasks = new ArrayDeque<Worker>();
  private isShutdown = false;

  init(backgroundTasks: Collection<Worker>) {
    if (this.isShutdown || this.service.isTerminated()) {
      throw new Error("This background loader has been shutdown!");
    }
    this.tasks.addAll(backgroundTasks);
    let t: Runnable;
    while ((t = this.tasks.poll()) != null) {
      this.service.execute(t);
    }
  }

  awaitCompletion(): boolean {
    if (this.isShutdown) {
      throw new Error("This background loader has been shutdown!");
    }
    try {
      this.service.awaitTermination(1, TimeUnit.HOURS);
    } catch (e) {
      console.log(`The background service loader was interrupted. ${e}`);
      return false;
    }
    this.isShutdown = true;
    return true;
  }

  stop() {
    this.service.shutdown();
  }
}