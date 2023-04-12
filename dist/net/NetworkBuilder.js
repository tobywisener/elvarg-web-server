"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkBuilder = void 0;
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var ChannelPipelineHandler_1 = require("../net/channel/ChannelPipelineHandler");
var NetworkBuilder = /** @class */ (function () {
    function NetworkBuilder() {
        var _this = this;
        this.channelInitializer = new ChannelPipelineHandler_1.ChannelPipelineHandler();
        var httpServer = (0, http_1.createServer)();
        this.io = new socket_io_1.Server(httpServer, {
        /* opções do servidor */
        });
        this.io.on("connection", function (socket) {
            _this.channelInitializer.initChannel(socket);
        });
    }
    NetworkBuilder.prototype.initialize = function (port) {
        var httpServer = (0, http_1.createServer)();
        httpServer.listen(port, function () {
            console.log("Servidor iniciado na porta ".concat(port));
        });
    };
    return NetworkBuilder;
}());
exports.NetworkBuilder = NetworkBuilder;
//# sourceMappingURL=NetworkBuilder.js.map