"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
var Region = /** @class */ (function () {
    function Region(regionId, terrainFile, objectFile) {
        this.clips = new Array(4).fill([]);
        this.regionId = regionId;
        this.terrainFile = terrainFile;
        this.objectFile = objectFile;
    }
    Region.prototype.getRegionId = function () {
        return this.regionId;
    };
    Region.prototype.getTerrainFile = function () {
        return this.terrainFile;
    };
    Region.prototype.getObjectFile = function () {
        return this.objectFile;
    };
    Region.prototype.getClip = function (x, y, height) {
        var regionAbsX = (this.regionId >> 8) * 64;
        var regionAbsY = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        return this.clips[height][x - regionAbsX][y - regionAbsY];
    };
    Region.prototype.addClip = function (x, y, height, shift) {
        var regionAbsX = (this.regionId >> 8) * 64;
        var regionAbsY = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        this.clips[height][x - regionAbsX][y - regionAbsY] |= shift;
    };
    Region.prototype.removeClip = function (x, y, height, shift) {
        var regionAbsX = (this.regionId >> 8) * 64;
        var regionAbsY = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        this.clips[height][x - regionAbsX][y - regionAbsY] &= ~shift;
    };
    Region.prototype.getLocalPosition = function (position) {
        var absX = position.getX();
        var absY = position.getY();
        var regionAbsX = (this.regionId >> 8) * 64;
        var regionAbsY = (this.regionId & 0xff) * 64;
        var localX = absX - regionAbsX;
        var localY = absY - regionAbsY;
        return [localX, localY];
    };
    Region.prototype.isLoaded = function () {
        return this.loaded;
    };
    Region.prototype.setLoaded = function (loaded) {
        this.loaded = loaded;
    };
    return Region;
}());
exports.Region = Region;
//# sourceMappingURL=Region.js.map