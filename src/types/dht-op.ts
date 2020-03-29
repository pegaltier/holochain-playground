import { Header } from "./header";
import { Entry } from "./entry";

export enum DHTOpType {
  StoreHeader,
  StoreEntry,
  RegisterAgentActivity,
  RegisterUpdatedTo,
  RegisterDeletedBy,
  RegisterAddLink,
  RegisterRemoveLink
}

export interface DHTOpContent<T, P> {
  header: Header;
  type: T;
  payload: P;
}

export type DHTOp =
  | DHTOpContent<DHTOpType.StoreHeader, void>
  | DHTOpContent<DHTOpType.StoreEntry, Entry>
  | DHTOpContent<DHTOpType.RegisterAgentActivity, void>
  | DHTOpContent<DHTOpType.RegisterUpdatedTo, Entry>
  | DHTOpContent<DHTOpType.RegisterAddLink, Entry>
  | DHTOpContent<DHTOpType.RegisterRemoveLink, Entry>
  | DHTOpContent<DHTOpType.RegisterDeletedBy, Entry>;

export function entryToDHTOps(entry: Entry, header: Header): DHTOp[] {
  return [];
}

export function neighborhood(dhtOp: DHTOp): string {
  return "";
}
