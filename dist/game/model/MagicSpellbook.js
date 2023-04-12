"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicSpellbook = void 0;
var Autocasting_1 = require("../content/combat/magic/Autocasting");
var TeleportType_1 = require("../model/teleportation/TeleportType");
var Skill_1 = require("./Skill");
var MagicSpellbook = exports.MagicSpellbook = /** @class */ (function () {
    function MagicSpellbook(interfaceId, teleportType) {
        this.interfaceId = interfaceId;
        this.teleportType = teleportType;
    }
    MagicSpellbook.forId = function (id) {
        for (var book in MagicSpellbook) {
            if (MagicSpellbook[book].ordinal === id) {
                return MagicSpellbook[book];
            }
        }
        return MagicSpellbook.NORMAL;
    };
    MagicSpellbook.changeSpellbook = function (player, book) {
        if (book === player.getSpellbook()) {
            // Already using this spellbook
            return;
        }
        if (book === MagicSpellbook.LUNAR) {
            if (player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE) < 40) {
                player.getPacketSender().sendMessage("You need at least level 40 Defence to use the Lunar spellbook.");
                return;
            }
        }
        //Update spellbook
        player.setSpellbook(book);
        //Reset autocast
        Autocasting_1.Autocasting.setAutocast(player, null);
        //Send notification message
        player.getPacketSender().sendMessage("You have changed your magic spellbook.")
            //Send the new spellbook interface to the client side tabs
            .sendTabInterface(6, player.getSpellbook().getInterfaceId());
    };
    /**
     * Gets the interface to switch tab interface to.
     *
     * @return The interface id of said spellbook.
     */
    MagicSpellbook.prototype.getInterfaceId = function () {
        return this.interfaceId;
    };
    /**
     * Gets the spellbook's teleport type
     *
     * @return The teleport type of said spellbook.
     */
    MagicSpellbook.prototype.getTeleportType = function () {
        return this.teleportType;
    };
    /**
    * The spellbook's teleport type
    */
    MagicSpellbook.NORMAL = new MagicSpellbook(1151, TeleportType_1.TeleportType.NORMAL);
    MagicSpellbook.ANCIENT = new MagicSpellbook(12855, TeleportType_1.TeleportType.ANCIENT);
    MagicSpellbook.LUNAR = new MagicSpellbook(29999, TeleportType_1.TeleportType.LUNAR);
    return MagicSpellbook;
}());
//# sourceMappingURL=MagicSpellbook.js.map