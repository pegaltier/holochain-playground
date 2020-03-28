import { Playground } from "../types/playground";
import { Conductor } from "../types/conductor";

export async function buildPlayground(
  dna: string,
  numConductors: number
): Promise<Playground> {
  const conductors = [];

  for (let i = 0; i < numConductors; i++) {
    const conductor = Conductor.new();
    conductor.installDna(dna);
    conductors.push(conductor);
  }

  return {
    conductors
  };
}
