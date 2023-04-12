import { PacketExecutor } from '../PacketExecutor';
import { Emotes } from '../../../game/content/Emotes';
import { ItemsKeptOnDeath } from '../../../game/content/ItemsKeptOnDeath';
import { PrayerHandler } from '../../../game/content/PrayerHandler';
import { ClanChatManager } from '../../../game/content/clan/ClanChatManager';
import { WeaponInterfaces } from '../../../game/content/combat/WeaponInterfaces';
import { Autocasting } from '../../../game/content/combat/magic/Autocasting';
import { EffectSpells } from '../../../game/content/combat/magic/EffectSpells';
import { MinigameHandler } from '../../../game/content/minigames/MinigameHandler';
import { Presetables } from '../../../game/content/presets/Presetables';
import { QuestHandler, Quests } from '../../../game/content/quests/QuestHandler';
import { Smithing } from '../../../game/content/skill/skillable/impl/Smithing';
import { Player } from '../../../game/entity/impl/player/Player';
import { Bank } from '../../../game/model/container/impl/Bank';
import { DialogueOption } from '../../../game/model/dialogues/DialogueOption';
import { BonusManager } from '../../../game/model/equipment/BonusManager';
import { PlayerRights } from '../../../game/model/rights/PlayerRights';
import { Packet } from '../Packet';
import { Dueling } from '../../../game/content/Duelling';

export class ButtonClickPacketListener implements PacketExecutor {
  public static readonly FIRST_DIALOGUE_OPTION_OF_FIVE: number = 2494;
  public static readonly SECOND_DIALOGUE_OPTION_OF_FIVE: number = 2495;
  public static readonly THIRD_DIALOGUE_OPTION_OF_FIVE: number = 2496;
  public static readonly FOURTH_DIALOGUE_OPTION_OF_FIVE: number = 2497;
  public static readonly FIFTH_DIALOGUE_OPTION_OF_FIVE: number = 2498;
  public static readonly FIRST_DIALOGUE_OPTION_OF_FOUR: number = 2482;
  public static readonly SECOND_DIALOGUE_OPTION_OF_FOUR: number = 2483;
  public static readonly THIRD_DIALOGUE_OPTION_OF_FOUR: number = 2484;
  public static readonly FOURTH_DIALOGUE_OPTION_OF_FOUR: number = 2485;
  public static readonly FIRST_DIALOGUE_OPTION_OF_THREE: number = 2471;
  public static readonly SECOND_DIALOGUE_OPTION_OF_THREE: number = 2472;
  public static readonly THIRD_DIALOGUE_OPTION_OF_THREE: number = 2473;
  public static readonly FIRST_DIALOGUE_OPTION_OF_TWO: number = 2461;
  public static readonly SECOND_DIALOGUE_OPTION_OF_TWO: number = 2462;
  private static readonly LOGOUT: number = 2458;
  private static readonly TOGGLE_RUN_ENERGY_ORB: number = 1050;
  private static readonly TOGGLE_RUN_ENERGY_SETTINGS: number = 42507;
  private static readonly OPEN_EQUIPMENT_SCREEN: number = 27653;
  private static readonly OPEN_PRICE_CHECKER: number = 27651;
  private static readonly OPEN_ITEMS_KEPT_ON_DEATH_SCREEN: number = 27654;
  private static readonly TOGGLE_AUTO_RETALIATE_328: number = 24115;
  private static readonly TOGGLE_AUTO_RETALIATE_425: number = 24041;
  private static readonly TOGGLE_AUTO_RETALIATE_3796: number = 24033;
  private static readonly TOGGLE_AUTO_RETALIATE_776: number = 24048;
  private static readonly TOGGLE_AUTO_RETALIATE_1698: number = 24017;
  private static readonly TOGGLE_AUTO_RETALIATE_1764: number = 24010;
  private static readonly TOGGLE_AUTO_RETALIATE_2276: number = 22845;
  private static readonly TOGGLE_AUTO_RETALIATE_5570: number = 24025;
  private static readonly DESTROY_ITEM: number = 14175;
  private static readonly CANCEL_DESTROY_ITEM: number = 14176;
  private static readonly PRICE_CHECKER_WITHDRAW_ALL: number = 18255;
  private static readonly PRICE_CHECKER_DEPOSIT_ALL: number = 18252;
  private static readonly TOGGLE_EXP_LOCK: number = 476;
  private static readonly OPEN_WORLD_MAP: number = 156;

  // Trade buttons
  private static readonly TRADE_ACCEPT_BUTTON_1: number = 3420;
  private static readonly TRADE_ACCEPT_BUTTON_2: number = 3546;
  // Duel buttons
  private static readonly DUEL_ACCEPT_BUTTON_1: number = 6674;
  private static readonly DUEL_ACCEPT_BUTTON_2: number = 6520;
  // Close buttons
  private static readonly CLOSE_BUTTON_1: number = 18247;
  private static readonly CLOSE_BUTTON_2: number = 38117;
  // Presets
  private static readonly OPEN_PRESETS: number = 31015;
  // Settings tab
  private static readonly OPEN_ADVANCED_OPTIONS: number = 42524;
  private static readonly OPEN_KEY_BINDINGS: number = 42552;

  public static handlers(player: Player, button: number): boolean {
    if (PrayerHandler.togglePrayer(player, button)) {
      return true;
    }
    if (Autocasting.handleWeaponInterface(player, button)
      || Autocasting.handleAutocastTab(player, button)
      || Autocasting.toggleAutocast(player, button)) {
      return true;
    }
    if (WeaponInterfaces.changeCombatSettings(player, button)) {
      BonusManager.update(player);
      return true;
    }
    if (EffectSpells.handleSpell(player, button)) {
      return true;
    }
    if (Bank.handleButton(player, button, 0)) {
      return true;
    }
    if (Emotes.doEmote(player, button)) {
      return true;
    }
    if (ClanChatManager.handleButton(player, button, 0)) {
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
    if (Smithing.handleButton(player, button)) {
      return true;
    }
    if (Presetables.handleButton(player, button)) {
      return true;
    }
    if (Quests.handleQuestButtonClick(player, button)) {
      return true;
    }
    if (MinigameHandler.handleButtonClick(player, button)) {
      return true;
    }
    return false;
  }

  execute(player: Player, packet: Packet): void {
    let button = packet.readInt();

    if (player.getHitpoints() <= 0 || player.isTeleporting) {
      return;
    }

    if (player.getRights() == PlayerRights.DEVELOPER) {
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
        Presetables.opens(player);
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
        } else {
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
        } else {
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
        BonusManager.open(player);
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
        ItemsKeptOnDeath.open(player);
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
        let item = player.getDestroyItem();
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
        } else {
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
        player.getDialogueManager().handleOption(DialogueOption.FIRST_OPTION);
        break;
      case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FIVE:
      case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_FOUR:
      case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_THREE:
      case ButtonClickPacketListener.SECOND_DIALOGUE_OPTION_OF_TWO:
        player.getDialogueManager().handleOption(DialogueOption.SECOND_OPTION);
        break;
      case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FIVE:
      case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_FOUR:
      case ButtonClickPacketListener.THIRD_DIALOGUE_OPTION_OF_THREE:
        player.getDialogueManager().handleOption(DialogueOption.THIRD_OPTION);
        break;
      case ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FIVE:
      case ButtonClickPacketListener.FOURTH_DIALOGUE_OPTION_OF_FOUR:
        player.getDialogueManager().handleOption(DialogueOption.FOURTH_OPTION);
        break;
      case ButtonClickPacketListener.FIFTH_DIALOGUE_OPTION_OF_FIVE:
        player.getDialogueManager().handleOption(DialogueOption.FIFTH_OPTION);
        break;
      default:
        // player.getPacketSender().sendMessage("Player "+player.getUsername()+", click button: "+button);
        break;
    }
  }
}
