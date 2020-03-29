import {
  LitElement,
  property,
  html,
  TemplateResult,
  css,
  PropertyValues
} from "lit-element";
import "@authentic/mwc-card";
import "@material/mwc-select";
import "@material/mwc-list";
import "@material/mwc-list/mwc-list-item";
import "@alenaksu/json-viewer";
import "@material/mwc-tab-bar";
import "@material/mwc-tab";

import { Conductor } from "../types/conductor";
import { Cell } from "../types/cell";
import { sharedStyles } from "./sharedStyles";

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
        <div class="column fill">
          <div class="column" style="padding: 16px;">
            <h3>Agent Id</h3>
            <span>${this.cell().agentId}</span>
          </div>
          <div class="column fill">
            <mwc-tab-bar
              @MDCTabBar:activated=${e =>
                (this.selectedTabIndex = e.detail.index)}
            >
              <mwc-tab label="Source Chain"></mwc-tab>
              <mwc-tab label="DHT Shard"></mwc-tab>
              <mwc-tab label="Commit entries"></mwc-tab>
            </mwc-tab-bar>
            <div style="padding: 16px;" class="column fill">
              ${this.selectedTabIndex === 0
                ? html`
                    <source-chain class="fill" .cell=${this.cell()}></source-chain>
                  `
                : this.selectedTabIndex === 1
                ? html`
                    <dht-shard .cell=${this.cell()}></dht-shard>
                  `
                : html`
                    <create-entries .cell=${this.cell()}></create-entries>
                  `}
            </div>
          </div>
        </div>
      </mwc-card>
    `;
  }
}
