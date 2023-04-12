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
exports.Lanthus = void 0;
var CastleWars_1 = require("../../../../content/minigames/impl/CastleWars");
var NPC_1 = require("../NPC");
var Item_1 = require("../../../../model/Item");
var Shop_1 = require("../../../../model/container/shop/Shop");
var ShopManager_1 = require("../../../../model/container/shop/ShopManager");
var ShopCurrencies_1 = require("../../../../model/container/shop/currency/ShopCurrencies");
var DialogueChainBuilder_1 = require("../../../../model/dialogues/builders/DialogueChainBuilder");
var EndDialogue_1 = require("../../../../model/dialogues/entries/impl/EndDialogue");
var ItemStatementDialogue_1 = require("../../../../model/dialogues/entries/impl/ItemStatementDialogue");
var NpcDialogue_1 = require("../../../../model/dialogues/entries/impl/NpcDialogue");
var OptionsDialogue_1 = require("../../../../model/dialogues/entries/impl/OptionsDialogue");
var PlayerDialogue_1 = require("../../../../model/dialogues/entries/impl/PlayerDialogue");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var DialogueExpression_1 = require("../../../../model/dialogues/DialogueExpression");
var LanthusDialogue = /** @class */ (function () {
    function LanthusDialogue(execFunc) {
        this.execFunc = execFunc;
    }
    LanthusDialogue.prototype.execute = function (player) {
        this.execFunc();
    };
    return LanthusDialogue;
}());
var Lanthus = exports.Lanthus = /** @class */ (function (_super) {
    __extends(Lanthus, _super);
    function Lanthus(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.message = "Lanthus gives you a Castlewars Manual.";
        _this.buildDialogues();
        CastleWars_1.CastleWars.LOBBY_AREA.setLanthus(_this);
        return _this;
    }
    Lanthus.prototype.firstOptionClick = function (player, npc) {
        player.getDialogueManager().startDialog(this.dialogueBuilder, 0);
    };
    Lanthus.prototype.secondOptionClick = function (player, npc) { };
    Lanthus.prototype.thirdOptionClick = function (player, npc) {
        ShopManager_1.ShopManager.opens(player, Lanthus.CASTLE_WARS_SHOP.getId());
    };
    Lanthus.prototype.forthOptionClick = function (player, npc) { };
    Lanthus.prototype.useItemOnNpc = function (player, npc, itemId, slot) { };
    Lanthus.prototype.buildDialogues = function () {
        this.dialogueBuilder = new DialogueChainBuilder_1.DialogueChainBuilder();
        this.dialogueBuilder.add(new NpcDialogue_1.NpcDialogue(0, NpcIdentifiers_1.NpcIdentifiers.LANTHUS, "Good day, how may I help you?"), new OptionsDialogue_1.OptionsDialogue(1, null, new Map([
            [
                "What is this place?",
                new LanthusDialogue(function (player) { return player.getDialogueManager().startDialogue(2); }),
            ],
            [
                "What do you have for trade?",
                new LanthusDialogue(function (player) {
                    ShopManager_1.ShopManager.opens(player, Lanthus.CASTLE_WARS_SHOP.getId());
                }),
            ],
            [
                "Do you have a manual? I'd like to learn how to play!",
                new LanthusDialogue(function (player) { return player.getDialogueManager().startDialogue(4); }),
            ],
        ])), new PlayerDialogue_1.PlayerDialogue(2, "What is this place?"), new NpcDialogue_1.NpcDialogue(3, NpcIdentifiers_1.NpcIdentifiers.LANTHUS, "This is the great Castle Wars arena! Here you can " +
            "fight for the glory of Saradomin or Zamorak.", (this.player.getDialogueManager().startDialog(this.dialogueBuilder, 1))), new PlayerDialogue_1.PlayerDialogue(4, "Do you have a manual? I'd like to learn how to play!"), new NpcDialogue_1.NpcDialogue(5, NpcIdentifiers_1.NpcIdentifiers.LANTHUS, "Sure, here you go.", new ItemStatementDialogue_1.ItemStatementDialogue.send(this.player, "", [this.message], CastleWars_1.CastleWars.MANUAL.getId(), 200)), new EndDialogue_1.EndDialogue(6));
    };
    Lanthus.CASTLE_WARS_SHOP = new Shop_1.Shop("Castle Wars Ticket Exchange", [
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_HELM_RED, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_PLATE_RED, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SWORD_RED, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SHIELD_RED, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_LEGS_RED, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_HELM_WHITE, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_PLATE_WHITE, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SWORD_WHITE, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SHIELD_WHITE, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_LEGS_WHITE, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_HELM_GOLD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_PLATE_GOLD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SWORD_GOLD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_SHIELD_GOLD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_LEGS_GOLD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_HOOD, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_CLOAK, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_HOOD_2, Shop_1.Shop.INFINITY),
        new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CASTLEWARS_CLOAK_2, Shop_1.Shop.INFINITY),
    ], ShopCurrencies_1.ShopCurrencies.CASTLE_WARS_TICKET);
    (function () {
        ShopManager_1.ShopManager.shops.set(Lanthus.CASTLE_WARS_SHOP.getId(), Lanthus.CASTLE_WARS_SHOP);
    })();
    return Lanthus;
}(NPC_1.NPC));
var LanthusExpression = /** @class */ (function (_super) {
    __extends(LanthusExpression, _super);
    function LanthusExpression(n1) {
        return _super.call(this, n1) || this;
    }
    return LanthusExpression;
}(DialogueExpression_1.DialogueExpression));
//# sourceMappingURL=Lanthus.js.map