import {
  LitElement,
  property,
  html,
  TemplateResult,
  css,
  query
} from "lit-element";
import "@authentic/mwc-card";
import "@material/mwc-select";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import "@alenaksu/json-viewer";
import "@material/mwc-tab-bar";
import "@material/mwc-tab";

import { Conductor } from "../types/conductor";
import { Cell, AGENT_HEADERS } from "../types/cell";
import { sharedStyles } from "./sharedStyles";
import { hash } from "../processors/hash";

export class ConductorDetail extends LitElement {
  @property()
  conductor: Conductor;

  @property()
  selectedDNA: string;

  @property()
  selectedTabIndex: number = 0;

  cell(): Cell {
    return this.conductor.cells[this.selectedDNA];
  }

  renderSourceChain() {
    return html`
      <div class="column">
        ${this.cell().sourceChain.map(
          header =>
            html`
              <span>${header}</span>
            `
        )}
      </div>
    `;
  }

  buildDHTShardJson() {
    const cell = this.cell();
    const dhtShard = {};

    for (const [_, dhtOp] of Object.entries(cell.DHTOpTransforms)) {
      dhtShard[hash(dhtOp.header)] = dhtOp.header;
    }

    for (const [hash, metadata] of Object.entries(cell.CASMeta)) {
      if (metadata[AGENT_HEADERS]) {
        dhtShard[hash] = metadata;
      } else {
        dhtShard[hash] = {
          entry: cell.CAS[hash],
          metadata: metadata
        };
      }
    }

    return dhtShard;
  }

  renderDHTShard() {
    return html`
      <div class="column">
        <json-viewer id="dht-shard"></json-viewer>
      </div>
    `;
  }

  updated(changedValues) {
    super.updated(changedValues);

    const dhtShard: any = this.shadowRoot.getElementById("dht-shard");
    if (dhtShard) dhtShard.data = this.buildDHTShardJson();
  }

  renderCell(): TemplateResult {
    return html`
      <div class="column">
        <mwc-tab-bar
          @MDCTabBar:activated=${e => (this.selectedTabIndex = e.detail.index)}
        >
          <mwc-tab label="Source Chain"></mwc-tab>
          <mwc-tab label="DHT Shard"></mwc-tab>
          <mwc-tab label="Commit entries"></mwc-tab>
        </mwc-tab-bar>
        <div style="padding: 16px;">
          ${this.selectedTabIndex === 0
            ? this.renderSourceChain()
            : this.selectedTabIndex === 1
            ? this.renderDHTShard()
            : html``}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }

        mwc-card {
          padding: 16px;
        }
      `
    ];
  }

  render() {
    return html`
      <mwc-card style="width: auto;" class="fill">
        <div class="column">
          <div class="column" style="padding: 16px;">
            <mwc-select label="DNAs">
              ${Object.keys(this.conductor.cells).map(
                dna => html`
                  <mwc-list-item ?selected=${dna === this.selectedDNA}>
                    ${dna}
                  </mwc-list-item>
                `
              )}
            </mwc-select>
            <h3>Agent Id</h3>
            <span>${this.cell().agentId}</span>
          </div>
          ${this.renderCell()}
        </div>
      </mwc-card>
    `;
  }
}
