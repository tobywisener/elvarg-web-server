"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundLoader = void 0;
var double_ended_queue_1 = require("double-ended-queue");
var timeunit_1 = require("timeunit");
var BackgroundLoaderThread = /** @class */ (function () {
    function BackgroundLoaderThread(runnable) {
        this.worker = new Worker(URL.createObjectURL(new Blob(["(".concat(runnable.run.toString(), ")()")], { type: 'text/javascript' })));
    }
    BackgroundLoaderThread.prototype.start = function () {
        // Não faz nada, o worker já está rodando
    };
    BackgroundLoaderThread.prototype.setName = function (name) {
        // Não faz nada, não temos acesso ao nome do worker
    };
    BackgroundLoaderThread.prototype.setDaemon = function (daemon) {
        // Não faz nada, não podemos mudar a natureza do worker
    };
    return BackgroundLoaderThread;
}());
var BackgroundLoaderThreadFactory = /** @class */ (function () {
    function BackgroundLoaderThreadFactory() {
    }
    BackgroundLoaderThreadFactory.prototype.createThread = function (runnable) {
        return new BackgroundLoaderThread(runnable);
    };
    return BackgroundLoaderThreadFactory;
}());
var BackgroundLoaderExecutorService = /** @class */ (function () {
    function BackgroundLoaderExecutorService() {
        this.terminated = false;
        this.threadFactory = new BackgroundLoaderThreadFactory();
    }
    BackgroundLoaderExecutorService.prototype.submit = function (runnable) {
        var thread = this.threadFactory.createThread(runnable);
        thread.start();
    };
    BackgroundLoaderExecutorService.prototype.isTerminated = function () {
        return this.terminated;
    };
    BackgroundLoaderExecutorService.prototype.shutdown = function () {
        this.terminated = true;
    };
    BackgroundLoaderExecutorService.prototype.awaitTermination = function (timeout, unit) {
        var millis = unit.toMillis(timeout);
        var remaining = millis;
        var terminated = true;
        while (remaining > 0) {
            try {
                this.awaitTermination(remaining, timeunit_1.TimeUnit.MILLISECONDS);
                terminated = true;
                break;
            }
            catch (e) {
                terminated = false;
                remaining -= millis - remaining;
            }
        }
        return terminated;
    };
    BackgroundLoaderExecutorService.prototype.execute = function (runnable) {
        this.submit(runnable);
    };
    return BackgroundLoaderExecutorService;
}());
var BackgroundLoader = /** @class */ (function () {
    function BackgroundLoader() {
        this.service = new BackgroundLoaderExecutorService();
        this.tasks = new double_ended_queue_1.ArrayDeque();
        this.isShutdown = false;
    }
    BackgroundLoader.prototype.init = function (backgroundTasks) {
        if (this.isShutdown || this.service.isTerminated()) {
            throw new Error("This background loader has been shutdown!");
        }
        this.tasks.addAll(backgroundTasks);
        var t;
        while ((t = this.tasks.poll()) != null) {
            this.service.execute(t);
        }
    };
    BackgroundLoader.prototype.awaitCompletion = function () {
        if (this.isShutdown) {
            throw new Error("This background loader has been shutdown!");
        }
        try {
            this.service.awaitTermination(1, timeunit_1.TimeUnit.HOURS);
        }
        catch (e) {
            console.log("The background service loader was interrupted. ".concat(e));
            return false;
        }
        this.isShutdown = true;
        return true;
    };
    BackgroundLoader.prototype.stop = function () {
        this.service.shutdown();
    };
    return BackgroundLoader;
}());
exports.BackgroundLoader = BackgroundLoader;
//# sourceMappingURL=BackgroundLoader.js.map