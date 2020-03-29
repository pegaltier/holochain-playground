export interface EntryContent<E extends EntryType, P> {
  type: E;
  payload: P;
}

export type Entry =
  | EntryContent<EntryType.DNA, string>
  | EntryContent<EntryType.AgentId, string>
  | EntryContent<EntryType.CreateEntry, any>
  | EntryContent<EntryType.RemoveEntry, { deletedEntry: string }>
  | EntryContent<
      EntryType.LinkAdd,
      { base: string; target: string; tag: string }
    >
  | EntryContent<
      EntryType.LinkRemove,
      { base: string; target: string; timestamp: number }
    >;

export enum EntryType {
  DNA = "DNA",
  AgentId = "AgentId",
  CreateEntry = "CreateEntry",
  RemoveEntry = "RemoveEntry",
  LinkAdd = "LinkAdd",
  LinkRemove = "LinkRemove",
  CapTokenGrant = "CapTokenGrant",
  CapTokenClaim = "CapTokenClaim"
}
