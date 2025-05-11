import { WebSocketServer, WebSocket } from "ws";

interface Client {
  ws: WebSocket;
  chatId: string;
}

// Lưu trữ các client theo chatId
const clients: Map<string, Client[]> = new Map();

export function initializeWebSocketServer() {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");

    ws.on("message", (message: string | Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        const { chatId } = data;

        if (chatId) {
          const clientList = clients.get(chatId) || [];
          clientList.push({ ws, chatId });
          clients.set(chatId, clientList);

          console.log(`Client joined chat-${chatId}`);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      // Xóa client khỏi danh sách
      for (const [chatId, clientList] of Array.from(clients.entries())) {
        const updatedList = clientList.filter(
          (client: Client) => client.ws !== ws,
        );
        if (updatedList.length > 0) {
          clients.set(chatId, updatedList);
        } else {
          clients.delete(chatId);
        }
      }
      console.log("WebSocket connection closed");
    });
  });

  console.log("WebSocket server running on ws://localhost:8080");
}

export function broadcastMessage(chatId: string, message: unknown) {
  const clientList = clients.get(chatId) || [];
  clientList.forEach((client: Client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}
