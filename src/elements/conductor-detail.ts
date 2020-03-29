import { LitElement, property, html, TemplateResult, css } from "lit-element";
import "@authentic/mwc-card";
import "@material/mwc-select";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";

import { Conductor } from "../types/conductor";
import { Cell } from "../types/cell";
import { sharedStyles } from "./sharedStyles";

export class ConductorDetail extends LitElement {
  @property()
  conductor: Conductor;

  @property()
  selectedDNA: string;

  cell(): Cell {
    return this.conductor.cells[this.selectedDNA];
  }

  renderSourceChain() {
    return html`
      <div class="column">
        <h3>Source Chain</h3>

        ${this.cell().sourceChain.map(
          header =>
            html`
              <span>${header}</span>
            `
        )}
      </div>
    `;
  }

  renderDHTShard() {
    return html`
      <h3>DHT Shard</h3>
      <div class="column">
        ${Object.entries(this.cell().DHTOpTransforms).map(
          ([dhtOpHash, dhtOp]) =>
            html`
              ${dhtOpHash}
            `
        )}
      </div>
    `;
  }

  renderCell(): TemplateResult {
    return html`
      <div class="column">
        <h3>Agent Id</h3>
        <span>${this.cell().agentId}</span>
        <div class="row">
          ${this.renderSourceChain()} ${this.renderDHTShard()}
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
          ${this.renderCell()}
        </div>
      </mwc-card>
    `;
  }
}
