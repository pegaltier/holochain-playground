import { Dictionary } from "./common";
import { Cell } from "./cell";
import { hash } from "../processors/hash";

export class Conductor {
  readonly agentIds: string[];
  readonly cells: Dictionary<Cell> = {};

  constructor(protected seed: string) {
    this.agentIds = [this.buildAgentId(0)];
  }

  buildAgentId(index: number): string {
    const keySeed = `${this.seed}${index}`;

    return hash(keySeed);
  }

  static new(): Conductor {
    return new Conductor(Math.random().toString());
  }

  installDna(dna: string): void {
    console.log(this.agentIds[0]);
    this.cells[dna] = {
      dna,
      CAS: {},
      CASMeta: {},
      DHTOpTransforms: [],
      sourceChain: [],
      agentId: this.agentIds[0],
      peers: []
    };
  }
}
