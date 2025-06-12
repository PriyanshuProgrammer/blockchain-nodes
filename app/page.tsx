"use client";
import CreateBlock from "./components/createBlock";
import { useEffect, useRef, useState } from "react";
import { nodes, url, reward, status } from "./utils/store";
import { useSetAtom } from "jotai";
import { HandleBlockCreation, stopMining } from "./utils/blockchain";
import { Block } from "./utils/interface";

export default function Home() {
  //states
  const [socket, setSocket] = useState<WebSocket | null>(null);

  //refs
  const blocks = useRef<Block[]>([]);

  // atoms states
  const setNodes = useSetAtom(nodes);
  const setReward = useSetAtom(reward);
  const setStatus = useSetAtom(status);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setStatus("Connection Established");
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      const type = eventData.type;
      const data = eventData.data;
      // Handle different message types
      switch (type) {
        case "nodes":
          setNodes(data);
          break;
        case "create-block":
          setStatus("Mining Completed, Creating Block...");
          const reward = eventData.reward;
          if (reward === "0.0") {
            stopMining();
            setStatus("Mining Completed , no reward received.");
            return;
          } else
            setStatus(
              "Congratulations, you mined first, mining reward: " + reward,
            );
          setReward((prev) => prev + parseFloat(reward));
          blocks.current = [...blocks.current, data];
          break;
        case "start-mining-block":
          setStatus("Mining Block...");
          const initialBits = eventData.initialBits;
          HandleBlockCreation(
            data,
            initialBits,
            ws,
            blocks.current[blocks.current.length - 1],
          );
          break;
        default:
          console.log("Unknown message type:", type);
      }
    };
    setSocket(ws);
  }, []);

  return <CreateBlock blocks={blocks} socket={socket} />;
}
