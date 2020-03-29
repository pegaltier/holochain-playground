export interface Header {
  entryAddress: string;
  lastHeaderAddress: string | undefined;
  replacedEntryAddress: string | undefined;
  agentId: string;
  timestamp: number;
}
