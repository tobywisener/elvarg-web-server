import { Misc } from "../Misc";
import { Client } from "../flood/Client";
const AsyncLock = require("async-lock");

var lock = new AsyncLock();

export class Flooder {
  clients: Map<string, Client> = new Map<string, Client>();
  private running: boolean = false;
  private lock = lock;

  start() {
    if (!this.running) {
      this.running = true;
      setInterval(this.run.bind(this), 300);
    }
  }

  stop() {
    this.running = false;
  }

  login(amount: number) {
    this.start();
    for (let i = 0; i < amount; i++) {
      try {
        let username = "bot" + this.clients.size.toString();
        let password = "bot";
        this.lock.acquire("lock", () => {
          this.clients.set(
            username,
            new Client(Misc.formatText(username), password)
          );
        });
        new Client(Misc.formatText(username), password).attemptLogin();
      } catch (e) {
        console.error(e);
      }
    }
  }

  run() {
    if (this.running) {
      try {
        this.lock.acquire("lock", () => {
          let keysToRemove = [];
          for (const [key, client] of this.clients) {
            try {
              client.process();
            } catch (e) {
              console.error(e);
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => this.clients.delete(key));
        });
      } catch (e) {
        console.error(e);
      }
      setTimeout(this.run.bind(this), 300);
    }
  }
}
