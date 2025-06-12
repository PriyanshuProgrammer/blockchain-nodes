"use client";
import { useRef } from "react";
import { onCreateTransaction } from "../utils/socket";
import { useAtomValue } from "jotai";
import { nodes, reward, status } from "../utils/store";
import { Block } from "../utils/interface";

interface CreateBlockProps {
  socket: WebSocket | null;
  blocks: React.RefObject<Block[]>;
}

export default function CreateBlock(props: CreateBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const nodesCount = useAtomValue(nodes);
  const currentStatus = useAtomValue(status);
  const rewardVal = useAtomValue(reward);
  const { socket, blocks } = props;

  return (
    <div className="flex items-center justify-center bg-zinc-900 h-screen">
      <div className="flex flex-col gap-3 items-center justify-center">
        <h2 className="text-2xl text-red-900 mb-4">Status: {currentStatus}</h2>
        <h1 className="text-2xl text-white mb-4">Nodes: {nodesCount}</h1>
        <h1 className="text-2xl text-white mb-4">Create a transaction</h1>
        <input
          ref={inputRef}
          placeholder="Enter transaction data..."
          className="p-2 border-1 border-zinc-500 bg-transparent rounded-lg "
        ></input>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              onCreateTransaction(socket, inputRef.current?.value ?? "");
            }}
            className="p-2 border-1 border-zinc-500 bg-transparent rounded-lg hover:cursor-pointer hover:bg-zinc-800"
          >
            Create transaction
          </button>
          <button
            onClick={() => console.log(blocks.current)}
            className="p-2 border-1 border-zinc-500 bg-transparent rounded-lg hover:cursor-pointer hover:bg-zinc-800"
          >
            Print Blocks
          </button>
        </div>
        <h1 className="text-2xl text-white mb-4">Mine Reward: {rewardVal}</h1>
      </div>
    </div>
  );
}
