import { Playground } from "../types/playground";
import { Cell } from "../types/cell";
import { distance } from "./hash";

export function dnaNodes(dna: string, playground: Playground) {
  const cells = playground.conductors
    .map(conductor => conductor.cells[dna])
    .filter(cell => !!cell);

  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    distance(a.agentId, b.agentId)
  );

  return sortedCells.map(cell => ({
    data: { id: cell.agentId }
  }));
}
