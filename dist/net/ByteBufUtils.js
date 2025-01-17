"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteBufUtils = void 0;
var stringbuilder_1 = require("stringbuilder");
var ByteBufUtils = /** @class */ (function () {
    function ByteBufUtils() {
    }
    ByteBufUtils.getMedium = function (buffer) {
        var short1 = buffer[0] << 8;
        var short2 = buffer[1];
        return (short1 | short2);
    };
    ByteBufUtils.getStrings = function (buffer, terminator) {
        if (terminator === void 0) { terminator = "\0"; }
        var str = "";
        var b;
        while ((b = buffer[0]) !== terminator.charCodeAt(0)) {
            str += String.fromCharCode(b);
            buffer = buffer.slice(1);
        }
        return str;
    };
    ByteBufUtils.getBytes = function (buffer, length) {
        var data = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
            data[i] = buffer[i];
        }
        return data;
    };
    ByteBufUtils.getString = function (buffer, terminator) {
        var os = new Uint8Array(0);
        var i = 0;
        while (i < buffer.length) {
            var read = buffer[i] & 0xFF;
            i++;
            if (read === terminator.charCodeAt(0)) {
                break;
            }
            os.set([read], os.length);
        }
        return new TextDecoder().decode(os);
    };
    ByteBufUtils.getHost = function (channel) {
        var url = new URL(channel.url);
        var hostname = url.hostname, port = url.port;
        return "".concat(hostname, ":").concat(port);
    };
    ByteBufUtils.readString = function (buf) {
        var temp;
        var builder = new stringbuilder_1.StringBuilder();
        for (var i = 0; i < buf.length && (temp = buf[i]) !== 10; i++) {
            builder.append(String.fromCharCode(temp));
        }
        return builder.toString();
    };
    ByteBufUtils.J_STRING_TERMINATOR = '\n';
    return ByteBufUtils;
}());
exports.ByteBufUtils = ByteBufUtils;
//TODO: Trocar ByteBuf e ByteBuffer pro Buffer
//# sourceMappingURL=ByteBufUtils.js.map