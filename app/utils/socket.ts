import { Block } from "./interface";

export function onCreateTransaction(socket: WebSocket | null, data: string) {
  if (!socket || !data.trim()) {
    console.error("Socket is not connected or data is empty");
    return;
  }
  socket.send(
    JSON.stringify({
      type: "create-transaction",
      data: data,
    }),
  );
}

export function onSuccessfullMining(socket: WebSocket | null, block: Block) {
  if (!socket) return;
  socket.send(
    JSON.stringify({
      type: "mining-successful",
      data: block,
    }),
  );
}
