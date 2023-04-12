import { Packet } from '../packet/Packet';
import { IsaacRandom } from '../security/IsaacRandom'
import { NetworkConstants } from '../NetworkConstants'
import { Server, Socket } from 'socket.io';

export class PacketDecoder {
    private readonly random: IsaacRandom;
    private opcode: number;
    private size: number;
    private static readonly PACKET_SIZES = [
        // ...
    ];

    constructor(random: IsaacRandom, private io?: Server) {
        this.random = random;
        this.opcode = -1;
        this.size = -1;
    }

    public onConnection(socket: Socket): Packet {
        let session = socket.data[NetworkConstants.SESSION_KEY];
        if (session == null || session.getPlayer() == null) {
            return;
        }

        socket.on('packet', (data: Uint8Array) => {
            let opcode = this.opcode;
            let size = this.size;

            if (opcode == -1) {
                if (data.length >= 1) {
                    opcode = data[0];
                    opcode = opcode - this.random.nextInt() & 0xFF;
                    size = PacketDecoder.PACKET_SIZES[opcode];
                    this.opcode = opcode;
                    this.size = size;
                } else {
                    return;
                }
            }

            if (size == -1) {
                if (data.length >= 2) {
                    size = data[1] & 0xFF;
                    this.size = size;
                } else {
                    return;
                }
            }

            if (data.length >= size) {
                let packetData = data.slice(0, size);
                this.opcode = -1;
                this.size = -1;
                let packet = new Packet(opcode, Buffer.from(packetData));
                this.io.emit('packet', packet); // broadcast packet to all connected sockets
            }
        });
    }
}
