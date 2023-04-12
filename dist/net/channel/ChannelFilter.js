"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelFilter = void 0;
var ByteBufUtils_1 = require("../ByteBufUtils");
var NetworkConstants_1 = require("../NetworkConstants");
var LoginDecoder_1 = require("../codec/LoginDecoder");
var LoginResponses_1 = require("../login/LoginResponses");
var multiset_1 = require("multiset");
var ChannelFilter = /** @class */ (function () {
    function ChannelFilter() {
        var _this = this;
        this.connections = new multiset_1.Multiset();
        var options = {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        };
        var io = require("socket.io")(this.server, options);
        this.server.on('connection', function (socket) {
            _this.onConnection(socket);
        });
    }
    ChannelFilter.prototype.onConnection = function (socket) {
        var host = ByteBufUtils_1.ByteBufUtils.getHost(socket.conn.remoteAddress);
        // if this local then, do nothing and proceed to next handler in the pipeline.
        if (host.toLowerCase() === "127.0.0.1") {
            return;
        }
        // add the host
        this.connections.add(host);
        // evaluate the amount of connections from this host.
        if (this.connections.count(host) > NetworkConstants_1.NetworkConstants.CONNECTION_LIMIT) {
            LoginDecoder_1.LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_CONNECTION_LIMIT);
            return;
        }
        //CHECK BANS
        // Nothing went wrong, so register the channel and forward the event to next handler in the
        // pipeline.
    };
    ChannelFilter.prototype.start = function () {
        console.log('Server started');
    };
    ChannelFilter.prototype.stop = function () {
        console.log('Server stopped');
    };
    return ChannelFilter;
}());
exports.ChannelFilter = ChannelFilter;
//# sourceMappingURL=ChannelFilter.js.map