"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionLoader = void 0;
var DefinitionLoader = /** @class */ (function () {
    function DefinitionLoader() {
    }
    DefinitionLoader.prototype.run = function () {
        try {
            var start = Date.now();
            this.load();
            var elapsed = Date.now() - start;
            console.log("Loaded definitions for: ".concat(this.file(), ". It took ").concat(elapsed, " milliseconds."));
        }
        catch (e) {
            console.error(e);
            console.error("Error loading definitions for: ".concat(this.file()));
        }
    };
    return DefinitionLoader;
}());
exports.DefinitionLoader = DefinitionLoader;
//# sourceMappingURL=DefinitionLoader.js.map