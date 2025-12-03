import io from "socket.io-client";
import { notifyAlert } from "./notifications";

const SOCKET_URL = "https://clinvet-backend.onrender.com";

let socket;

export function initSocket() {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,

    path: "/socket.io",
  });

  socket.on("connect", () => {
    console.log("Socket conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado:", reason);
  });

  socket.on("new_alert", async (alert) => {
    console.log("Novo alerta recebido via socket:", alert);
    await notifyAlert(alert);
  });

  return socket;
}

export function getSocket() {
  return socket;
}
