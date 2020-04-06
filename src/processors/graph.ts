import { Cell, CRUDStatus, EntryMetadata } from "../types/cell";
import { arrayToInt, compareBigInts, distance } from "./hash";
import { Header } from "../types/header";
import { Entry, EntryType } from "../types/entry";
import multihashes from "multihashes";
import { Dictionary } from "../types/common";

export function dnaNodes(cells: Cell[]) {
  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    compareBigInts(
      arrayToInt(multihashes.fromB58String(a.agentId)),
      arrayToInt(multihashes.fromB58String(b.agentId))
    )
  );

  const cellNodes = sortedCells.map((cell) => ({
    data: { id: cell.agentId, label: `${cell.agentId.substr(0, 6)}...` },
  }));

  const edges = sortedCells.map((cell) =>
    cell.getNeighbors().map((neighbor) => ({
      data: {
        id: `${cell.agentId}->${neighbor}`,
        source: cell.agentId,
        target: neighbor,
      },
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
      classes: [entry.type],
    });
    nodes.push({
      data: {
        id: `${headerHash}->${header.entryAddress}`,
        source: headerHash,
        target: header.entryAddress,
      },
    });

    if (header.lastHeaderAddress) {
      nodes.push({
        data: {
          id: `${headerHash}->${header.lastHeaderAddress}`,
          source: headerHash,
          target: header.lastHeaderAddress,
        },
      });
    }
  }

  return nodes;
}

export function allEntries(cells: Cell[]) {
  const entries: Dictionary<Entry> = {};
  const metadata: Dictionary<EntryMetadata> = {};

  for (const cell of cells) {
    for (const [key, entry] of Object.entries(cell.CASMeta)) {
      if (
        cell.CAS[key] &&
        (cell.CAS[key].type === EntryType.CreateEntry ||
          cell.CAS[key].type === EntryType.AgentId)
      ) {
        entries[key] = cell.CAS[key] as Entry;
        metadata[key] = cell.CASMeta[key] as EntryMetadata;
      }
    }
  }

  const linksEdges = [];
  const entryNodes = [];

  for (const [key, entry] of Object.entries(entries)) {
    entryNodes.push({
      data: { id: key, data: entry, label: `${key.substr(0, 6)}...` },
      classes: [entry.type] as string[],
    });
    const implicitLinks = getImplicitLinks(Object.keys(entries), entry.payload);

    for (const implicitLink of implicitLinks) {
      linksEdges.push({
        data: {
          id: `${key}->${implicitLink}`,
          source: key,
          target: implicitLink,
        },
        classes: ["implicit"],
      });
    }
  }

  for (const [key, entry] of Object.entries(metadata)) {
    for (const link of entry.LINKS_TO) {
      linksEdges.push({
        data: {
          id: `${key}->${link.target}`,
          source: key,
          target: link.target,
          label: `${link.type},${link.tag}`,
        },
        classes: ["explicit"],
      });
    }

    if (entry.REPLACED_BY && entry.REPLACED_BY.length > 0) {
      entryNodes.find((node) => node.data.id === key).classes.push("updated");
      for (const replacedBy of entry.REPLACED_BY) {
        linksEdges.push({
          data: {
            id: `${key}-replaced-by-${replacedBy}`,
            source: key,
            target: replacedBy,
            label: "replaced by",
          },
          classes: ["update-link"],
        });
      }
    }

    if (entry.DELETED_BY) {
      entryNodes.find((node) => node.data.id === key).classes.push("deleted");
    }
  }

  return [...entryNodes, ...linksEdges];
}

export function getImplicitLinks(
  allEntryIds: string[],
  payload: any
): string[] {
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string") {
      return allEntryIds.includes(value) ? [value] : [];
    }
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
    ) {
      return value.filter((v) => allEntryIds.includes(v));
    }
    if (typeof value === "object") {
      return getImplicitLinks(allEntryIds, value);
    }
  }
}
