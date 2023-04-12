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
exports.DynamoDBPlayerPersistence = void 0;
var PlayerBot_1 = require("../../../playerbot/PlayerBot");
var PlayerPersistence_1 = require("../PlayerPersistence");
var PlayerSave_1 = require("../PlayerSave");
var AWS = require("aws-sdk");
var dynamodb_enhanced_1 = require("dynamodb-enhanced");
var PlayerSaveRecord_1 = require("./PlayerSaveRecord");
var tableschema_1 = require("tableschema");
var DynamoDBPlayerPersistence = exports.DynamoDBPlayerPersistence = /** @class */ (function (_super) {
    __extends(DynamoDBPlayerPersistence, _super);
    function DynamoDBPlayerPersistence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DynamoDBPlayerPersistence.prototype.save = function (player) {
        if (player instanceof PlayerBot_1.PlayerBot) {
            return;
        }
        var playerSave = PlayerSave_1.PlayerSave.fromPlayer(player);
        var playerTable = DynamoDBPlayerPersistence.enhancedClient.table(DynamoDBPlayerPersistence.playerTableName, DynamoDBPlayerPersistence.PLAYER_SAVE_TABLE_SCHEMA);
        playerTable.putItem({
            username: player.username,
            playerSave: playerSave,
            timestamp: new Date().toISOString()
        });
    };
    DynamoDBPlayerPersistence.prototype.load = function (username) {
        var playerTable = DynamoDBPlayerPersistence.enhancedClient.table(DynamoDBPlayerPersistence.playerTableName, DynamoDBPlayerPersistence.PLAYER_SAVE_TABLE_SCHEMA);
        var playerSaveRecord = playerTable.getItem({ partitionKey: { username: username } });
        if (!playerSaveRecord) {
            return null;
        }
        return playerSaveRecord.playerSave;
    };
    DynamoDBPlayerPersistence.prototype.exists = function (username) {
        // Have to do it properly later. Have to make sure we dont block main loop
        return true;
    };
    DynamoDBPlayerPersistence.dynamoDbClient = new AWS.DynamoDB({ region: "eu-west-1" });
    DynamoDBPlayerPersistence.enhancedClient = new dynamodb_enhanced_1.DynamoDbEnhancedClient({ client: DynamoDBPlayerPersistence.dynamoDbClient });
    DynamoDBPlayerPersistence.playerTableName = process.env.PLAYER_TABLE_NAME;
    DynamoDBPlayerPersistence.PLAYER_SAVE_TABLE_SCHEMA = tableschema_1.TableSchema.fromObject(PlayerSaveRecord_1.PlayerSaveRecord);
    return DynamoDBPlayerPersistence;
}(PlayerPersistence_1.PlayerPersistence));
//# sourceMappingURL=DynamoDBPlayerPersistence.js.map