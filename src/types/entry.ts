export interface EntryContent<E extends EntryType, P> {
  type: E;
  payload: P;
}

export type Entry =
  | EntryContent<EntryType.DNA, string>
  | EntryContent<EntryType.AgentId, string>
  | EntryContent<EntryType.CreateEntry, any>
  | EntryContent<EntryType.DeleteEntry, { deletedEntry: string }>
  | EntryContent<
      EntryType.LinkAdd,
      { base: string; target: string; tag: string }
    >
  | EntryContent<
      EntryType.LinkRemove,
      { base: string; target: string; tag: string; timestamp: number }
    >;

export enum EntryType {
  DNA = "DNA",
  AgentId = "AgentId",
  CreateEntry = "CreateEntry",
  DeleteEntry = "DeleteEntry",
  LinkAdd = "LinkAdd",
  LinkRemove = "LinkRemove",
  CapTokenGrant = "CapTokenGrant",
  CapTokenClaim = "CapTokenClaim"
}
