import { atom } from "jotai";

export const url = "wss://blockchain-backend-e3ma.onrender.com/";
export const nodes = atom<number>();
export const reward = atom<number>(0.0);
export const status = atom<string>("disconnected");
