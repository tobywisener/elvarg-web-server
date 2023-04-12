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
exports.WebHandler = void 0;
var Sound_1 = require("../../../../Sound");
var Sounds_1 = require("../../../../Sounds");
var GameObject_1 = require("../GameObject");
var Animation_1 = require("../../../../model/Animation");
var TaskManager_1 = require("../../../../task/TaskManager");
var TimedObjectReplacementTask_1 = require("../../../../task/impl/TimedObjectReplacementTask");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../../util/Misc");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var WEB_RESPAWN = 400;
var SLASH_SOUND = Sound_1.Sound.SLASH_WEB;
var FAIL_SLASH_SOUND = Sound_1.Sound.FAIL_SLASH_WEB;
var ITEM_ON_WEB_ANIMATION = new Animation_1.Animation(911);
var lastSlash;
var SHARP_ITEM_PATTERN = /(.*2h.*|.*sword.*|.*dagger.*|.*rapier.*|.*scimitar.*|.*halberd.*|.*spear.*|.*axe.*|.*excalibur.*|.*claws.*|.*whip.*)/i;
/**
 * Allows us to cut sticky webs to walk through - wilderness / mage arena.
 *  @author syuil (Michael)
 */
var WebHandler = /** @class */ (function () {
    function WebHandler() {
    }
    WebHandler.isSharpItem = function (item) {
        var sharpItemMatcher = SHARP_ITEM_PATTERN.exec(item.getDefinition().getName());
        return sharpItemMatcher != null || (item.getDefinition().getId() == ItemIdentifiers_1.ItemIdentifiers.KNIFE);
    };
    WebHandler.wieldingSharpItem = function (player) {
        var e_1, _a;
        try {
            for (var _b = __values(player.getEquipment().getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var t = _c.value;
                if (t != null && t.getId() > 0 && t.getAmount() > 0) {
                    var sharpItemMatcher = SHARP_ITEM_PATTERN.exec(t.getDefinition().getName());
                    if (sharpItemMatcher != null) {
                        return true;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    WebHandler.handleSlashWeb = function (player, web, itemOnWeb) {
        if (web == null)
            return;
        if (web.getDefinition().getName().toLowerCase() !== "web")
            return;
        var currentTime = Date.now();
        if (currentTime - lastSlash < 4000)
            return;
        player.performAnimation(itemOnWeb ? ITEM_ON_WEB_ANIMATION : new Animation_1.Animation(player.getAttackAnim()));
        var successfulSlashChance = Misc_1.Misc.randoms(2);
        if (successfulSlashChance < 2) {
            player.sendMessage("You slash the web apart.");
            Sounds_1.Sounds.sendSound(player, SLASH_SOUND);
            TaskManager_1.TaskManager.submit(new TimedObjectReplacementTask_1.TimedObjectReplacementTask(web, new GameObject_1.GameObject(ObjectIdentifiers_1.ObjectIdentifiers.SLASHED_WEB, web.getLocation(), web.getType(), web.getFace(), player.getPrivateArea()), WEB_RESPAWN));
        }
        else {
            Sounds_1.Sounds.sendSound(player, FAIL_SLASH_SOUND);
            player.sendMessage("You fail to slash the web.");
        }
        lastSlash = currentTime;
    };
    return WebHandler;
}());
exports.WebHandler = WebHandler;
//# sourceMappingURL=WebHandler.js.map