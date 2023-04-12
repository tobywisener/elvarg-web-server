"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JacksonAttributeConverter = void 0;
var dynamodb_data_types_1 = require("dynamodb-data-types");
var Gson = require("gson");
var JacksonAttributeConverter = exports.JacksonAttributeConverter = /** @class */ (function () {
    function JacksonAttributeConverter(clazz) {
        this.clazz = clazz;
    }
    JacksonAttributeConverter.prototype.transformFrom = function (input) {
        return dynamodb_data_types_1.AttributeValue.builder()
            .s(JacksonAttributeConverter.gson.toJson(input))
            .build();
    };
    JacksonAttributeConverter.prototype.transformTo = function (input) {
        return JacksonAttributeConverter.gson.fromJson(input.s(), this.clazz);
    };
    JacksonAttributeConverter.prototype.type = function () {
        return dynamodb_data_types_1.EnhancedType.of(this.clazz);
    };
    JacksonAttributeConverter.prototype.attributeValueType = function () {
        return dynamodb_data_types_1.AttributeValueType.String;
    };
    JacksonAttributeConverter.gson = Gson.create();
    return JacksonAttributeConverter;
}());
//# sourceMappingURL=JacksonAttributeConverter.js.map