import { Header } from "./header";
import { Entry, EntryType, EntryContent } from "./entry";
import { hash } from "../processors/hash";

export enum DHTOpType {
  StoreHeader,
  StoreEntry,
  RegisterAgentActivity,
  RegisterUpdatedTo,
  RegisterDeletedBy,
  RegisterAddLink,
  RegisterRemoveLink
}

export interface DHTOpContent<T, E> {
  header: Header;
  type: T;
  entry: E;
}

export type DHTOp =
  | DHTOpContent<DHTOpType.StoreHeader, void>
  | DHTOpContent<
      DHTOpType.StoreEntry,
      { entry: Entry; replaces: string | undefined }
    >
  | DHTOpContent<DHTOpType.RegisterAgentActivity, void>
  | DHTOpContent<
      DHTOpType.RegisterUpdatedTo,
      { newEntry: Entry; replaces: string }
    >
  | DHTOpContent<
      DHTOpType.RegisterDeletedBy,
      EntryContent<EntryType.DeleteEntry, string>
    >
  | DHTOpContent<
      DHTOpType.RegisterAddLink,
      EntryContent<
        EntryType.LinkAdd,
        { base: string; target: string; tag: string }
      >
    >
  | DHTOpContent<
      DHTOpType.RegisterRemoveLink,
      EntryContent<
        EntryType.LinkRemove,
        { base: string; target: string; timestamp: number }
      >
    >;

export function entryToDHTOps(entry: Entry, header: Header): DHTOp[] {
  let additionalDHTOps = [];
  switch (entry.type) {
    case EntryType.CreateEntry:
      if (entry.payload.replaces) {
        additionalDHTOps = [
          {
            header,
            type: DHTOpType.RegisterUpdatedTo,
            entry: {
              newEntry: entry.payload.entry,
              replaces: entry.payload.replaces
            }
          }
        ];
      }
      break;
    case EntryType.DeleteEntry:
      additionalDHTOps = [
        {
          header,
          type: DHTOpType.RegisterDeletedBy,
          entry: entry
        }
      ];
      break;
    case EntryType.LinkAdd:
      additionalDHTOps = [
        {
          header,
          type: DHTOpType.RegisterAddLink,
          entry: entry
        }
      ];
      break;
    case EntryType.LinkRemove:
      additionalDHTOps = [
        {
          header,
          type: DHTOpType.RegisterRemoveLink,
          entry: entry
        }
      ];
      break;
  }

  const replaces =
    entry.type === EntryType.CreateEntry && entry.payload.replaces;
  return [
    ...additionalDHTOps,
    { header, type: DHTOpType.RegisterAgentActivity, entry: null },
    {
      header,
      type: DHTOpType.StoreEntry,
      entry: { entry, replaces: replaces ? replaces : undefined }
    },
    { header, type: DHTOpType.StoreHeader, entry: null }
  ];
}

export function neighborhood(dhtOp: DHTOp): string {
  switch (dhtOp.type) {
    case DHTOpType.StoreHeader:
      return hash(dhtOp.header);
    case DHTOpType.StoreEntry:
      return dhtOp.header.entryAddress;
    case DHTOpType.RegisterUpdatedTo:
      return dhtOp.entry.replaces;
    case DHTOpType.RegisterAgentActivity:
      return dhtOp.header.agentId;
    case DHTOpType.RegisterAddLink:
      return dhtOp.entry.payload.base;
    case DHTOpType.RegisterRemoveLink:
      return dhtOp.entry.payload.base;
    case DHTOpType.RegisterDeletedBy:
      return dhtOp.entry.payload;
  }
}
