import io from "socket.io-client";
import { notifyAlert } from "./notifications";

const SOCKET_URL = "http://192.168.10.113:3000";

let socket;

export function initSocket() {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Socket conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado:", reason);
  });

  // evento do backend quando novo alerta é criado
  socket.on("new_alert", async (alert) => {
    console.log("Novo alerta recebido via socket:", alert);
    await notifyAlert(alert);
  });

  return socket;
}

export function getSocket() {
  return socket;
}
