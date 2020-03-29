import { Playground } from "../types/playground";
import { Cell } from "../types/cell";
import { arrayToInt } from "./hash";
import { Header } from "../types/header";

export function dnaNodes(dna: string, playground: Playground) {
  const cells = playground.conductors
    .map(conductor => conductor.cells[dna])
    .filter(cell => !!cell);

  const sortedCells = cells.sort(
    (a: Cell, b: Cell) =>
      arrayToInt(new TextEncoder().encode(a.agentId)) -
      arrayToInt(new TextEncoder().encode(b.agentId))
  );

  return sortedCells.map(cell => ({
    data: { id: cell.agentId, label: `${cell.agentId.substr(0, 6)}...` }
  }));
}

export function sourceChainNodes(cell: Cell) {
  const nodes = [];

  const headersHashes = cell.sourceChain;

  for (const headerHash of headersHashes) {
    const header: Header = cell.CAS[headerHash];
    nodes.push({ data: { id: headerHash, data: header } });
    nodes.push({
      data: { id: header.entryAddress, data: cell.CAS[header.entryAddress] }
    });
    nodes.push({
      data: {
        id: `${headerHash}->${header.entryAddress}`,
        source: headerHash,
        target: header.entryAddress
      }
    });

    if (header.lastHeaderAddress) {
      nodes.push({
        data: {
          id: `${headerHash}->${header.lastHeaderAddress}`,
          source: headerHash,
          target: header.lastHeaderAddress
        }
      });
    }
  }

  return nodes;
}
