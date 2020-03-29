import { DHTOp } from "./dht-op";

export enum NetworkMessageType {
  Publish
}

export interface NetworkMessageBody<T, P> {
  type: T;
  payload: P;
}

export type NetworkMessage = NetworkMessageBody<
  NetworkMessageType.Publish,
  DHTOp
>;

export type SendMessage = (
  dna: string,
  fromAgentId: string,
  toAgentId: string,
  message: NetworkMessage
) => Promise<void>;
