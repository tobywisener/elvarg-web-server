export abstract class DefinitionLoader implements Runnable {
    abstract load(): void;
    abstract file(): string;
    run() {
        try {
            const start = Date.now();
            this.load();
            const elapsed = Date.now() - start;
            console.log(`Loaded definitions for: ${this.file()}. It took ${elapsed} milliseconds.`);
        } catch (e) {
            console.error(e);
            console.error(`Error loading definitions for: ${this.file()}`);
        }
    }
}

interface Runnable {

    run();
}