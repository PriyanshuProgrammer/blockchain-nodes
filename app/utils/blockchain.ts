import { type Block } from "./interface";
import Worker from "web-worker";
import { onSuccessfullMining } from "./socket";
let ws: WebSocket | null = null;

//vars
let worker: Worker | null = null;

function SetHash(block: Block, initialBits: string) {
  const previousHash = block.PreviousBlockHash;
  const data = block.Data;
  const timeStamp = block.TimeStamp;
  // mining process
  // 1. create a worker which will handle the mining process
  // 2. find a hash that starts with a certain number of zeros (initialBits)
  // 3. the worker will send the hash back to the main thread
  // 4. if someone else has created a block with the same data, the worker will stop mining
  worker = new Worker(new URL("./worker.ts", import.meta.url));
  worker.postMessage({
    previousHash,
    timeStamp,
    data,
    initialBits,
  });
  worker.addEventListener("message", (e) => {
    block.CurrentBlockHash = e.data.hash;
    block.nounce = e.data.nounce;
    onSuccessfullMining(ws, block);
    worker?.terminate();
  });
}

function NewBlock(data: string, previousHash: string, initialBits: string) {
  const block: Block = {
    Data: data,
    PreviousBlockHash: previousHash,
    TimeStamp: new Date().getTime(),
    CurrentBlockHash: "",
    nounce: "",
  };
  SetHash(block, initialBits);
}

function NewBlockGenesis(data: string, initialBits: string) {
  NewBlock(data, "0000000000000xxxxxxxxx", initialBits);
}

export function HandleBlockCreation(
  data: Array<string>,
  initialBits: string,
  socket: WebSocket | null,
  lastBlock?: Block,
) {
  const stringData = JSON.stringify(data);
  ws = socket;
  if (!lastBlock) NewBlockGenesis(stringData, initialBits);
  else NewBlock(stringData, lastBlock.CurrentBlockHash, initialBits);
}

export function stopMining() {
  if (worker) {
    worker.terminate();
  }
}
