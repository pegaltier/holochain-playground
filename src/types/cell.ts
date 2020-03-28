import { Dictionary } from "./common";

export interface Cell {
  dna: string;
  agentId: string;
  sourceChain: string[];
  CAS: Dictionary<any>;
  CASMeta: Dictionary<Dictionary<any>>;
  DHTOpTransforms: string[];

  peers: string[];
}
