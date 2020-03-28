interface EntryContent<E extends EntryType, P> {
  type: E;
  payload: P;
}

export type Entry =
  | EntryContent<EntryType.DNA, string>
  | EntryContent<EntryType.AgentId, string>
  | EntryContent<EntryType.CreateEntry, any>
  | EntryContent<EntryType.DeleteEntry, string>
  | EntryContent<EntryType.UpdateEntry, { newEntry: any; replaces: string }>
  | EntryContent<
      EntryType.LinkAdd,
      { base: string; target: string; tag: string }
    >
  | EntryContent<
      EntryType.LinkRemove,
      { base: string; target: string; timestamp: number }
    >;

export enum EntryType {
  DNA,
  AgentId,
  CreateEntry,
  UpdateEntry,
  DeleteEntry,
  LinkAdd,
  LinkRemove,
  CapTokenGrant,
  CapTokenClaim
}
