import { Cell } from "../types/cell";
import { arrayToInt, compareBigInts, distance } from "./hash";
import { Header } from "../types/header";
import { Entry } from "../types/entry";
import multihashes from "multihashes";

export function dnaNodes(cells: Cell[]) {
  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    compareBigInts(
      arrayToInt(multihashes.fromB58String(a.agentId)),
      arrayToInt(multihashes.fromB58String(b.agentId))
    )
  );

  const cellNodes = sortedCells.map(cell => ({
    data: { id: cell.agentId, label: `${cell.agentId.substr(0, 6)}...` }
  }));

  const edges = sortedCells.map(cell =>
    cell.getNeighbors().map(neighbor => ({
      data: {
        id: `${cell.agentId}->${neighbor}`,
        source: cell.agentId,
        target: neighbor
      }
    }))
  );

  return [...cellNodes, ...[].concat(...edges)];
}

export function sourceChainNodes(cell: Cell) {
  const nodes = [];

  const headersHashes = cell.sourceChain;

  for (const headerHash of headersHashes) {
    const header: Header = cell.CAS[headerHash];
    const entry: Entry = cell.CAS[header.entryAddress];
    nodes.push({ data: { id: headerHash, data: header } });
    nodes.push({
      data: { id: header.entryAddress, data: entry },
      classes: [entry.type]
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
