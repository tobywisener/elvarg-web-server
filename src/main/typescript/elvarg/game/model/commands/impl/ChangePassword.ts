import {Player} from '../../../entity/impl/player/Player';
import {Command} from '../../../model/commands/Command';
import {PasswordUtil} from '../../../../util/PasswordUtil';

export class ChangePassword implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        // Known exploit
        if (command.includes("\r") || command.includes("\n")) {
            return;
        }

        let pass = command.substring(parts[0].length + 1);
        if (pass.length > 3 && pass.length < 20) {
            this.changePassword(player, pass)
                .then(() => {
                    player.getPacketSender().sendMessage("Your password is now: " + pass);
                })
                .catch((err) => {
                    console.error(err);
                    player.getPacketSender().sendMessage("An error occurred while changing your password.");
                });
        } else {
            player.getPacketSender().sendMessage("Invalid password input.");
        }
    }

    private async changePassword(player: Player, pass: string): Promise<void> {
        const passwordHash = await PasswordUtil.generatePasswordHashWithSalt(pass);
        player.setPasswordHashWithSalt(passwordHash);
    }

    canUse(player: Player): boolean {
        return true;
    }
}