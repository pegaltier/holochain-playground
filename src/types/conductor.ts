import { Dictionary } from "./common";
import { Cell } from "./cell";
import { hash } from "../processors/hash";
import { SendMessage, NetworkMessage } from "./network";

export class Conductor {
  agentIds: string[];
  readonly cells: Dictionary<Cell> = {};

  constructor(
    protected sendMessage: SendMessage,
    protected redundancyFactor: number,
    protected seed: string = Math.random()
      .toString()
      .substring(2)
  ) {
    this.agentIds = [this.buildAgentId(0)];
  }

  buildAgentId(index: number): string {
    const keySeed = `${this.seed}${index}`;

    return hash(keySeed);
  }

  installDna(dna: string, peers: string[]): void {
    const agentId = this.agentIds[0];
    const cell = new Cell(
      dna,
      agentId,
      this.sendMessage,
      this.redundancyFactor,
      peers
    );
    this.cells[dna] = cell;
  }

  inboundNetworkMessage(
    dna: string,
    fromAgentId: string,
    message: NetworkMessage
  ): void {
    return this.cells[dna].handleNetworkMessage(fromAgentId, message);
  }
}
