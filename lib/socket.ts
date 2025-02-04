//export a function to export socket instance
//reconnection handling
//prevention of multiple initialization of sockets unlike the official docs

import { io, Socket } from "socket.io-client";

let socket: Socket;
const SocketURL = "http://localhost:3000";

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SocketURL, {
            transports: ["websocket"]
        })
    };

    return socket;

}