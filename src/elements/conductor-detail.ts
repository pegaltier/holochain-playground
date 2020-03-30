import {
  LitElement,
  property,
  html,
  TemplateResult,
  css,
  PropertyValues,
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
import { Cell } from "../types/cell";
import { sharedStyles } from "./sharedStyles";
import { Dialog } from "@material/mwc-dialog";

export class ConductorDetail extends LitElement {
  @property()
  conductor: Conductor;

  @property()
  selectedDNA: string;

  @property()
  selectedEntry: string | undefined = undefined;

  @property()
  selectedTabIndex: number = 0;

  @query("#conductor-help")
  conductorHelp: Dialog;

  cell(): Cell {
    return this.conductor.cells[this.selectedDNA];
  }

  firstUpdated() {
    this.addEventListener("entry-committed", (e: CustomEvent) => {
      this.selectedTabIndex = 0;
      setTimeout(() => {
        this.selectedEntry = e.detail.entryId;
      });
    });
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

  renderAgentHelp() {
    return html`
      <mwc-dialog id="conductor-help" heading="Node Help">
        <span>
          You've selected the node or conductor with Agent ID
          ${this.cell().agentId}. Here you can see its internal state:
          <ul>
            <li>
              <strong>Source Chain</strong>: entries that this node has
              committed. Here you can see in grey the
              <a
                href="https://developer.holochain.org/docs/concepts/3_private_data/"
                >headers</a
              >
              of the entries, and in colors the entries themselves. When you
              select an entry, the other nodes that are holding the entry DHT
              will be hightlighted in the DHT.
            </li>
            <br />
            <li>
              <strong>DHT Shard</strong>: slice of the DHT that this node is
              holding. You can see the list of all the entries that this node is
              holding indexed by their hash, and metadata associated to those
              entries.
            </li>
            <br />
            <li>
              <strong>Commit Entries</strong>: here you can actually create
              entries yourself. They will be created on behalf of this node. Try
              it! You can create an entry and see where it lands on the DHT, and
              go to the DHT Shard of those nodes and check it's there.
            </li>
          </ul>
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
  }
  render() {
    return html`
      ${this.renderAgentHelp()}
      <mwc-card style="width: auto;" class="fill">
        <div class="column fill">
          <div class="row center-content" style="padding: 16px">
            <div class="column" style="flex: 1;">
              <h3>Agent Id</h3>
              <span>${this.cell().agentId}</span>
            </div>
            <mwc-icon-button
              icon="help_outline"
              @click=${() => (this.conductorHelp.open = true)}
            ></mwc-icon-button>
          </div>
          <div class="column fill">
            <mwc-tab-bar
              @MDCTabBar:activated=${e =>
                (this.selectedTabIndex = e.detail.index)}
              .activeIndex=${this.selectedTabIndex}
            >
              <mwc-tab label="Source Chain"></mwc-tab>
              <mwc-tab label="DHT Shard"></mwc-tab>
              <mwc-tab label="Commit entries"></mwc-tab>
            </mwc-tab-bar>
            <div style="padding: 16px;" class="column fill">
              ${this.selectedTabIndex === 0
                ? html`
                    <source-chain
                      class="fill"
                      .selectedEntry=${this.selectedEntry}
                      .cell=${this.cell()}
                    ></source-chain>
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