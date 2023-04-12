import {Socket, Server} from 'socket.io';
import { LoginResponsePacket } from '../login/LoginResponsePacket';
import { LoginResponses } from '../login/LoginResponses';

/**
Encodes login.
@author Swiffy
*/

const io = new Server();
export class LoginEncoder {

    protected encode(msg: LoginResponsePacket) {
        io.on('connection', (socket: Socket) => {
            socket.emit('message', msg.getResponse());

            if (msg.getResponse() == LoginResponses.LOGIN_SUCCESSFUL) {
                socket.emit('message', msg.getRights());
            }
        })
    }
}