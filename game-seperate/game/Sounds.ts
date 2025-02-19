
import { Player } from '../game/entity/impl/player/Player'
import { Sound } from '../game/Sound'
export class Sounds {
    public static sendSound(player: Player, sound: Sound) {
        if (!player || !sound || player.isPlayerBot()) {
            return;
        }

        this.sendSound(player, sound)
    }

    public static sendSoundEffect(player: Player, soundId: number, loopType: number, delay: number, volume: number) {
        player.getPacketSender().sendSoundEffect(soundId, loopType, delay, volume);
    }
}
