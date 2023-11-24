// Socket.IOでWebSocketサーバに接続する
import * as socketIo from 'socket.io-client';
export const WS_SERVER_PORT: number = 3333;
export const origin: string = `http://localhost:${WS_SERVER_PORT}`; // WebSocketプロトコル

// WebSocketでサーバに接続
export const socket = socketIo.connect(origin, {
    withCredentials: false
});
console.log("[Start] ws socket client for " + origin);