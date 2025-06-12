export interface Block {
  TimeStamp: number;
  nounce: string;
  PreviousBlockHash: string;
  CurrentBlockHash: string;
  Data: string;
}

export interface Blockchain {
  Blocks: Block[];
}
