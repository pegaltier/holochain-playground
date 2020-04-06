import { SendMessage, NetworkMessage } from "../types/network";
import { Conductor } from "../types/conductor";

export function hookUpConductors(conductors: Conductor[]) {
  const sendMessage: SendMessage = (
    dna: string,
    fromAgentId: string,
    toAgentId: string,
    message: NetworkMessage
  ) => {
    const conductor = conductors.find((c) =>
      c.agentIds.find((a) => a === toAgentId)
    );
    if (conductor)
      return conductor.inboundNetworkMessage(dna, fromAgentId, message);
  };

  for (const conductor of conductors) {
    conductor.sendMessage = sendMessage;
  }
}
