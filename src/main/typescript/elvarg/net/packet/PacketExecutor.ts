import { Player } from "../../game/entity/impl/player/Player";
import { Packet } from './Packet';
export interface PacketExecutor {
    execute(player: Player, packet: Packet): void;
}