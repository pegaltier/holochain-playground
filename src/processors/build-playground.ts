import { Playground } from "../types/playground";
import { Conductor } from "../types/conductor";
import { SendMessage, NetworkMessage } from "../types/network";

export function buildPlayground(
  dna: string,
  numConductors: number
): Playground {
  const conductors: Conductor[] = [];

  const redundancyFactor = 3;

  const sendMessage: SendMessage = async (
    dna: string,
    fromAgentId: string,
    toAgentId: string,
    message: NetworkMessage
  ) => {
    const conductor = conductors.find(c =>
      c.agentIds.find(a => a === toAgentId)
    );
    if (conductor) conductor.inboundNetworkMessage(dna, fromAgentId, message);
  };

  for (let i = 0; i < numConductors; i++) {
    const conductor = new Conductor(sendMessage, redundancyFactor);
    conductors.push(conductor);
  }

  const peers = conductors.map(c => c.agentIds[0]);

  for (const conductor of conductors) {
    conductor.installDna(
      dna,
      peers.filter(p => p !== conductor.agentIds[0])
    );
  }

  return {
    conductors,
    redundancyFactor
  };
}
