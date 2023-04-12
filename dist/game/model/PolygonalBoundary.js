"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonalBoundary = void 0;
var Boundary_1 = require("./Boundary");
var paper_1 = require("paper");
var PolygonalBoundary = /** @class */ (function (_super) {
    __extends(PolygonalBoundary, _super);
    function PolygonalBoundary(points) {
        var _this = _super.call(this, 0, 0, 0, 0, 0) || this;
        _this.polygon = new paper_1.Path();
        var xCoords = new Array(points.length);
        var yCoords = new Array(points.length);
        for (var i = 0; i < points.length; i++) {
            xCoords[i] = points[i][0];
            yCoords[i] = points[i][1];
        }
        _this.polygon = new paper_1.Path([xCoords, yCoords, points.length]);
        return _this;
    }
    PolygonalBoundary.prototype.inside = function (p) {
        return this.polygon.contains([p.getX(), p.getY()]);
    };
    return PolygonalBoundary;
}(Boundary_1.Boundary));
exports.PolygonalBoundary = PolygonalBoundary;
//# sourceMappingURL=PolygonalBoundary.js.map