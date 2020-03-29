import { Dictionary } from "./common";
import { Cell } from "./cell";
import { hash } from "../processors/hash";
import { Entry, EntryType } from "./entry";
import { Header } from "./header";
import { entryToDHTOps } from "./dht-op";

export class Conductor {
  agentIds: string[];
  readonly cells: Dictionary<Cell> = {};

  constructor(protected seed: string) {
    this.agentIds = [this.buildAgentId(0)];
  }

  buildAgentId(index: number): string {
    const keySeed = `${this.seed}${index}`;

    return hash(keySeed);
  }

  static new(): Conductor {
    return new Conductor(
      Math.random()
        .toString()
        .substring(2)
    );
  }

  installDna(dna: string): void {
    const agentId = this.agentIds[0];
    const cell = {
      dna,
      CAS: {},
      CASMeta: {},
      DHTOpTransforms: [],
      sourceChain: [],
      agentId: agentId,
      peers: []
    };
    this.cells[dna] = cell;

    this.createEntry(cell, { type: EntryType.DNA, payload: dna });
    this.createEntry(cell, { type: EntryType.AgentId, payload: agentId });
  }

  createEntry(cell: Cell, entry: Entry) {
    const entryId = hash(entry);

    cell.CAS[entryId] = entry;

    const header = this.createHeader(cell, entryId);
    const dhtOps = entryToDHTOps(entry, header);
  }

  createHeader(cell: Cell, entryId: string): Header {
    const lastHeaderAddress =
      cell.sourceChain.length > 0
        ? cell.sourceChain[cell.sourceChain.length - 1]
        : undefined;

    const header: Header = {
      agentId: cell.agentId,
      entryAddress: entryId,
      timestamp: Date.now(),
      lastHeaderAddress
    };

    const headerId = hash(header);

    cell.CAS[headerId] = header;
    cell.sourceChain.push(headerId);

    return header;
  }

  joinNetwork() {}
}
