"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
var World_1 = require("../World");
var Projectile = /** @class */ (function () {
    function Projectile(start, end, lockon, projectileId, delay, speed, startHeight, endHeight, privateArea) {
        this.start = start;
        this.lockon = lockon;
        this.end = end;
        this.projectileId = projectileId;
        this.delay = delay;
        this.speed = speed;
        this.startHeight = startHeight;
        this.endHeight = endHeight;
        this.privateArea = privateArea;
    }
    Projectile.createProjectile = function (source, victim, projectileId, delay, speed, startHeight, endHeight) {
        return new Projectile(source.getLocation(), victim.getLocation(), victim, projectileId, delay, speed, startHeight, endHeight, source.getPrivateArea());
    };
    Projectile.prototype.sendProjectile = function () {
        var e_1, _a;
        try {
            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                if (player == null) {
                    continue;
                }
                if (player.getPrivateArea() != this.privateArea) {
                    continue;
                }
                if (!this.start.isViewableFrom(player.getLocation())) {
                    continue;
                }
                player.getPacketSender().sendProjectile(this.start, this.end, 0, this.speed, this.projectileId, this.startHeight, this.endHeight, this.lockon, this.delay);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return Projectile;
}());
exports.Projectile = Projectile;
//# sourceMappingURL=Projectile.js.map