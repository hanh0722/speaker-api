import { Server } from "socket.io";

let io: Server;

export const init = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      allowedHeaders: ['Content-Type', 'authorization'],
      credentials: true
    }
  });
  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Server is not connected');
  };
  return io;
};

