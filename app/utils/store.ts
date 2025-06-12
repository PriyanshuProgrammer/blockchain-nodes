import { atom } from "jotai";

export const url = "ws://localhost:8080";
export const nodes = atom<number>();
export const reward = atom<number>(0.0);
export const status = atom<string>("disconnected");
