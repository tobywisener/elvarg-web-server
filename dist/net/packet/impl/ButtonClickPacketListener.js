"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonClickPacketListener = void 0;
var Emotes_1 = require("../../../game/content/Emotes");
var ItemsKeptOnDeath_1 = require("../../../game/content/ItemsKeptOnDeath");
var PrayerHandler_1 = require("../../../game/content/PrayerHandler");
var ClanChatManager_1 = require("../../../game/content/clan/ClanChatManager");
var WeaponInterfaces_1 = require("../../../game/content/combat/WeaponInterfaces");
var Autocasting_1 = require("../../../game/content/combat/magic/Autocasting");
var EffectSpells_1 = require("../../../game/content/combat/magic/EffectSpells");
var MinigameHandler_1 = require("../../../game/content/minigames/MinigameHandler");
var Presetables_1 = require("../../../game/content/presets/Presetables");
var QuestHandler_1 = require("../../../game/content/quests/QuestHandler");
var Smithing_1 = require("../../../game/content/skill/skillable/impl/Smithing");
var Bank_1 = require("../../../game/model/container/impl/Bank");
var DialogueOption_1 = require("../../../game/model/dialogues/DialogueOption");
var BonusManager_1 = require("../../../game/model/equipment/BonusManager");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var ButtonClickPacketListener = exports.ButtonClickPacketListener = /** @class */ (function () {
    function ButtonClickPacketListener() {
    }
    ButtonClickPacketListener.handlers = function (player, button) {
        if (PrayerHandler_1.PrayerHandler.togglePrayer(player, button)) {
            return true;
        }
        if (Autocasting_1.Autocasting.handleWeaponInterface(player, button)
            || Autocasting_1.Autocasting.handleAutocastTab(player, button)
            || Autocasting_1.Autocasting.toggleAutocast(player, button)) {
            return true;
        }
        if (WeaponInterfaces_1.WeaponInterfaces.changeCombatSettings(player, button)) {
            BonusManager_1.BonusManager.update(player);
            return true;
        }
        if (EffectSpells_1.EffectSpells.handleSpell(player, button)) {
            return true;
        }
        if (Bank_1.Bank.handleButton(player, button, 0)) {
            return true;
        }
        if (Emotes_1.Emotes.doEmote(player, button)) {
            return true;
        }
        if (ClanChatManager_1.ClanChatManager.handleButton(player, button, 0)) {
            return true;
        }
        if (player.getSkillManager().pressedSkill(button)) {
            return true;
        }
        if (player.getQuickPrayers().handleButton(button)) {
            return true;
        }
        if (player.getDueling().checkRules(button)) {
            return true;
        }
        if (Smithing_1.Smithing.handleButton(player, button)) {
            return true;
        }
        if (Presetables_1.Presetables.handleButton(player, button)) {
            return true;
        }
        if (QuestHandler_1.Quests.handleQuestButtonClick(player, button)) {
            return true;
        }
        if (MinigameHandler_1.MinigameHandler.handleButtonClick(player, button)) {
            return true;
        }
        return false;
    };
    ButtonClickPacketListener.prototype.execute = function (player, packet) {
        var button = packet.readInt();
        if (player.getHitpoints() <= 0 || player.isTeleporting) {
            return;
        }
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Button clicked: " + button.toString() + ".");
        }
        if (ButtonClickPacketListener.handlers(player, button)) {
            return;
        }
        switch (button) {
            case ButtonClickPacketListener.OPEN_PRESETS:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                Presetables_1.Presetables.opens(player);
                break;
            case ButtonClickPacketListener.OPEN_WORLD_MAP:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                player.getPacketSender().sendInterface(54000);
                break;
            case ButtonClickPacketListener.LOGOUT:
                if (player.canLogout()) {
                    player.requestLogout();
                }
                else {
                    player.getPacketSender().sendMessage("You cannot log out at the moment.");
                }
                break;
            case ButtonClickPacketListener.TOGGLE_RUN_ENERGY_ORB:
            case ButtonClickPacketListener.TOGGLE_RUN_ENERGY_SETTINGS:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                if (player.getRunEnergy() > 0) {
                    player.setRunning(!player.isRunningReturn());
                }
                else {
                    player.setRunning(false);
                }
                player.getPacketSender().sendRunStatus();
                break;
            case ButtonClickPacketListener.OPEN_ADVANCED_OPTIONS:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                player.getPacketSender().sendInterface(23000);
                break;
            case ButtonClickPacketListener.OPEN_KEY_BINDINGS:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                player.getPacketSender().sendInterface(53000);
                break;
            case ButtonClickPacketListener.OPEN_EQUIPMENT_SCREEN:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                BonusManager_1.BonusManager.open(player);
                break;
            case ButtonClickPacketListener.OPEN_PRICE_CHECKER:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                player.getPriceChecker().open();
                break;
            case ButtonClickPacketListener.OPEN_ITEMS_KEPT_ON_DEATH_SCREEN:
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                ItemsKeptOnDeath_1.ItemsKeptOnDeath.open(player);
                break;
            case ButtonClickPacketListener.PRICE_CHECKER_WITHDRAW_ALL:
                player.getPriceChecker().withdrawAll();
                break;
            case ButtonClickPacketListener.PRICE_CHECKER_DEPOSIT_ALL:
                player.getPriceChecker().depositAll();
                break;
            case ButtonClickPacketListener.TRADE_ACCEPT_BUTTON_1:
            case ButtonClickPacketListener.TRADE_ACCEPT_BUTTON_2:
                player.getTrading().acceptTrade();
                break;
            case ButtonClickPacketListener.DUEL_ACCEPT_BUTTON_1:
            case ButtonClickPacketListener.DUEL_ACCEPT_BUTTON_2:
                player.getDueling().acceptDuel();
                break;
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_328:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_425:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_3796:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_776:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_1764:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_2276:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_5570:
            case ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_1698:
                player.setAutoRetaliate(!player.autoRetaliateReturn());
                break;
            case ButtonClickPacketListener.DESTROY_ITEM:
                var item = player.getDestroyItem();
                player.getPacketSender().sendInterfaceRemoval();
                if (item != -1) {
                    player.getInventory().deleteNumber(item, player.getInventory().getAmount(item));
                }
                break;
            case ButtonClickPacketListener.CANCEL_DESTROY_ITEM:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            case ButtonClickPacketListener.TOGGLE_EXP_LOCK:
                player.setExperienceLocked(!player.experienceLockedReturn());
                if (player.experienceLockedReturn()) {
                    player.getPacketSender().sendMessage("Your experience is now @red@locked.");
                }
                else {
                    player.getPacketSender().sendMessage("Your experience is now @red@unlocked.");
                }
                break;
            case ButtonClickPacketListener.CLOSE_BUTTON_1:
            case ButtonClickPacketListener.CLOSE_BUTTON_2:
            case 16999:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            case ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_FIVE:
            case ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_FOUR:
            case ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_THREE:
            case ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_TWO:
                player.getDialogueManager().handleOption(DialogueOption_1.DialogueOption.FIRST_OPTION);
                break;
            case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FIVE:
            case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FOUR:
            case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_THREE:
            case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_TWO:
                player.getDialogueManager().handleOption(DialogueOption_1.DialogueOption.SECOND_OPTION);
                break;
            case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FIVE:
            case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FOUR:
            case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_THREE:
                player.getDialogueManager().handleOption(DialogueOption_1.DialogueOption.THIRD_OPTION);
                break;
            case ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FIVE:
            case ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FOUR:
                player.getDialogueManager().handleOption(DialogueOption_1.DialogueOption.FOURTH_OPTION);
                break;
            case ButtonClickPacketListener.FIFTH_DIALOGUE_OPTION_OF_FIVE:
                player.getDialogueManager().handleOption(DialogueOption_1.DialogueOption.FIFTH_OPTION);
                break;
            default:
                // player.getPacketSender().sendMessage("Player "+player.getUsername()+", click button: "+button);
                break;
        }
    };
    ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_FIVE = 2494;
    ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FIVE = 2495;
    ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FIVE = 2496;
    ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FIVE = 2497;
    ButtonClickPacketListener.FIFTH_DIALOGUE_OPTION_OF_FIVE = 2498;
    ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_FOUR = 2482;
    ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FOUR = 2483;
    ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FOUR = 2484;
    ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FOUR = 2485;
    ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_THREE = 2471;
    ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_THREE = 2472;
    ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_THREE = 2473;
    ButtonClickPacketListener.FIRST_DIALOGUE_OPTION_OF_TWO = 2461;
    ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_TWO = 2462;
    ButtonClickPacketListener.LOGOUT = 2458;
    ButtonClickPacketListener.TOGGLE_RUN_ENERGY_ORB = 1050;
    ButtonClickPacketListener.TOGGLE_RUN_ENERGY_SETTINGS = 42507;
    ButtonClickPacketListener.OPEN_EQUIPMENT_SCREEN = 27653;
    ButtonClickPacketListener.OPEN_PRICE_CHECKER = 27651;
    ButtonClickPacketListener.OPEN_ITEMS_KEPT_ON_DEATH_SCREEN = 27654;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_328 = 24115;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_425 = 24041;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_3796 = 24033;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_776 = 24048;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_1698 = 24017;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_1764 = 24010;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_2276 = 22845;
    ButtonClickPacketListener.TOGGLE_AUTO_RETALIATE_5570 = 24025;
    ButtonClickPacketListener.DESTROY_ITEM = 14175;
    ButtonClickPacketListener.CANCEL_DESTROY_ITEM = 14176;
    ButtonClickPacketListener.PRICE_CHECKER_WITHDRAW_ALL = 18255;
    ButtonClickPacketListener.PRICE_CHECKER_DEPOSIT_ALL = 18252;
    ButtonClickPacketListener.TOGGLE_EXP_LOCK = 476;
    ButtonClickPacketListener.OPEN_WORLD_MAP = 156;
    // Trade buttons
    ButtonClickPacketListener.TRADE_ACCEPT_BUTTON_1 = 3420;
    ButtonClickPacketListener.TRADE_ACCEPT_BUTTON_2 = 3546;
    // Duel buttons
    ButtonClickPacketListener.DUEL_ACCEPT_BUTTON_1 = 6674;
    ButtonClickPacketListener.DUEL_ACCEPT_BUTTON_2 = 6520;
    // Close buttons
    ButtonClickPacketListener.CLOSE_BUTTON_1 = 18247;
    ButtonClickPacketListener.CLOSE_BUTTON_2 = 38117;
    // Presets
    ButtonClickPacketListener.OPEN_PRESETS = 31015;
    // Settings tab
    ButtonClickPacketListener.OPEN_ADVANCED_OPTIONS = 42524;
    ButtonClickPacketListener.OPEN_KEY_BINDINGS = 42552;
    return ButtonClickPacketListener;
}());
//# sourceMappingURL=ButtonClickPacketListener.js.map