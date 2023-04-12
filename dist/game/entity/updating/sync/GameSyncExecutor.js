"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSyncExecutor = void 0;
var async_1 = require("async");
var GameConstants_1 = require("../../../GameConstants");
var Phaser = require("phaser");
var GameSyncExecutor = /** @class */ (function () {
    /**
     * Creates a new `GameSyncExecutor`. It automatically determines how
     * many threads; if any, are needed for game synchronization.
     */
    function GameSyncExecutor() {
        this.service = GameConstants_1.GameConstants.CONCURRENCY ? this.create(navigator.hardwareConcurrency) : null;
        this.phaser = GameConstants_1.GameConstants.CONCURRENCY ? new Phaser.Game({}) : null;
    }
    /**
     * Submits `syncTask` to be executed as a synchronization task under
     * this executor. This method can and probably will block the calling thread
     * until it completes.
     *
     * @param syncTask the synchronization task to execute.
     */
    GameSyncExecutor.prototype.sync = function (syncTask) {
        var _this = this;
        if (this.service == null || this.phaser == null || !syncTask.isConcurrent()) {
            for (var index = 1; index < syncTask.getCapacity(); index++) {
                if (!syncTask.checkIndex(index)) {
                    continue;
                }
                syncTask.execute(index);
            }
            return;
        }
        this.phaser.bulkRegister(syncTask.getAmount());
        var _loop_1 = function (index) {
            if (!syncTask.checkIndex(index)) {
                return "continue";
            }
            var finalIndex = index;
            this_1.service.execute(function () {
                try {
                    syncTask.execute(finalIndex);
                }
                finally {
                    _this.phaser.arriveAndDeregister();
                }
            });
        };
        var this_1 = this;
        for (var index = 1; index < syncTask.getCapacity(); index++) {
            _loop_1(index);
        }
        this.phaser.arriveAndAwaitAdvance();
    };
    /**
     * Creates and configures the update service for this game sync executor.
     * The returned executor is <b>unconfigurable</b> meaning it's configuration
     * can no longer be modified.
     *
     * @param nThreads the amount of threads to create this service.
     * @return the newly created and configured service.
     */
    GameSyncExecutor.prototype.create = function (nThreads) {
        if (nThreads <= 1) {
            return null;
        }
        var executor = new async_1.ThreadPoolExecutor(nThreads, nThreads, 0, "GameSyncThread");
        executor.on("rejected", function (task) {
            console.warn("Task ".concat(task, " has been rejected from the GameSyncExecutor"));
        });
        return executor;
    };
    return GameSyncExecutor;
}());
exports.GameSyncExecutor = GameSyncExecutor;
//# sourceMappingURL=GameSyncExecutor.js.map