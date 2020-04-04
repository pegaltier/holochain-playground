import { Playground } from "./playground";

export const selectCellCount = (state: Playground) =>
  selectActiveCells(state).length;

export const selectActiveCells = (state: Playground) =>
  state.conductors.map((c) => c.cells[state.activeDNA]).filter((c) => !!c);

export const selectGlobalDHTOps = (state: Playground) => {
  let dhtOps = 0;

  for (const cell of selectActiveCells(state)) {
    dhtOps += Object.keys(cell.DHTOpTransforms).length;
  }

  return dhtOps;
};

export const selectActiveConductor = (state: Playground) =>
  state.activeAgentId
    ? state.conductors.find((conductor) =>
        conductor.agentIds.find((agentId) => agentId === state.activeAgentId)
      )
    : undefined;

export const selectActiveCell = (state: Playground) =>
  selectActiveConductor(state)
    ? Object.values(selectActiveConductor(state).cells).find(
        (cell) => cell.agentId === state.activeAgentId
      )
    : undefined;

export const selectUniqueDHTOps = (state: Playground) => {
  const globalDHTOps = {};

  for (const cell of selectActiveCells(state)) {
    for (const hash of Object.keys(cell.DHTOpTransforms)) {
      globalDHTOps[hash] = {};
    }
  }

  return Object.keys(globalDHTOps).length;
};
