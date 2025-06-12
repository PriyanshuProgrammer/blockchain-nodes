import crypto from "crypto";

function BlockMining(
  data: string,
  timeStamp: string,
  initialBits: string,
  previousHash: string,
) {
  let nounce: number = 0;
  console.log("mining started");
  while (true) {
    const str = data + nounce.toString() + timeStamp + previousHash;
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    if (hash.startsWith(initialBits)) {
      return {
        hash,
        nounce,
      };
    }
    nounce++;
  }
}

self.addEventListener("message", function (e) {
  const obj = BlockMining(
    e.data.data,
    e.data.timeStamp,
    e.data.initialBits,
    e.data.previousHash,
  );
  self.postMessage(obj);
});
