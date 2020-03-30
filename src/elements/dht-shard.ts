import { LitElement, property, PropertyValues, html } from "lit-element";
import { Cell, AGENT_HEADERS, HEADERS } from "../types/cell";
import { sharedStyles } from "./sharedStyles";

export class DHTShard extends LitElement {
  @property()
  cell: Cell;

  static style() {
    return sharedStyles;
  }

  buildDHTShardJson() {
    const dhtShard = {};

    const processHeaders = (headerAddresses: string[]) =>
      headerAddresses.reduce(
        (acc, next) => ({ ...acc, [next]: this.cell.CAS[next] }),
        {}
      );

    for (const [hash, metadata] of Object.entries(this.cell.CASMeta)) {
      if (metadata[AGENT_HEADERS]) {
        dhtShard[hash] = {
          [AGENT_HEADERS]: processHeaders(metadata[AGENT_HEADERS])
        };
      } else {
        dhtShard[hash] = {
          entry: this.cell.CAS[hash],
          metadata: {
            ...metadata,
            HEADERS: processHeaders(metadata[HEADERS])
          }
        };
      }
    }

    return dhtShard;
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    const dhtShard: any = this.shadowRoot.getElementById("dht-shard");
    if (dhtShard) dhtShard.data = this.buildDHTShardJson();
  }

  render() {
    return html`
      <div class="column">
        <span><strong>Entries with associated metadata, and agent ids with all their headers</strong></span>
        <json-viewer id="dht-shard" style="margin-top: 16px;"></json-viewer>
      </div>
    `;
  }
}
