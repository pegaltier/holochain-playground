import { Dictionary } from "./common";
import { Cell, CellContents } from "./cell";
import { hash } from "../processors/hash";
import { SendMessage, NetworkMessage } from "./network";

export interface ConductorContents {
  agentIds: string[];
  cells: Dictionary<CellContents>;
  redundancyFactor: number;
  seed: string;
}

export class Conductor {
  agentIds: string[];
  readonly cells: Dictionary<Cell> = {};
  sendMessage: SendMessage;

  constructor(
    protected redundancyFactor: number,
    protected seed: string = Math.random().toString().substring(2)
  ) {
    this.agentIds = [this.buildAgentId(0)];
  }

  static from(contents: ConductorContents) {
    const conductor = new Conductor(contents.redundancyFactor, contents.seed);
    conductor.agentIds = contents.agentIds;
    for (const [key, cell] of Object.entries(contents.cells)) {
      conductor.cells[key] = Cell.from(conductor, cell);
    }

    return conductor;
  }

  buildAgentId(index: number): string {
    const keySeed = `${this.seed}${index}`;

    return hash(keySeed);
  }

  installDna(dna: string, peers: string[]): void {
    const agentId = this.agentIds[0];
    const cell = new Cell(this, dna, agentId, this.redundancyFactor, peers);
    this.cells[dna] = cell;
  }

  initDna(dna: string) {
    this.cells[dna].init();
  }

  inboundNetworkMessage(
    dna: string,
    fromAgentId: string,
    message: NetworkMessage
  ): any {
    return this.cells[dna].handleNetworkMessage(fromAgentId, message);
  }
}
