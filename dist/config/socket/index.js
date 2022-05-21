"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocket = exports.init = void 0;
const socket_io_1 = require("socket.io");
let io;
const init = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            allowedHeaders: ['Content-Type', 'authorization'],
            credentials: true
        }
    });
    return io;
};
exports.init = init;
const getSocket = () => {
    if (!io) {
        throw new Error('Server is not connected');
    }
    ;
    return io;
};
exports.getSocket = getSocket;
