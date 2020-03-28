import { Playground } from "../types/playground";
import { Cell } from "../types/cell";
import { arrayToInt } from "./hash";

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
