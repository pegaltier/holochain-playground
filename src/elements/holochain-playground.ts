import { LitElement, html, query, property } from "lit-element";

import "@material/mwc-icon-button";
import "@material/mwc-button";
import "@material/mwc-dialog";
import { Dialog } from "@material/mwc-dialog";

import { sharedStyles } from "./sharedStyles";
import { pinToBoard } from "../blackboard/blackboard-mixin";
import { Playground } from "../state/playground";
import {
  selectGlobalDHTOps,
  selectUniqueDHTOps,
  selectCellCount,
  selectActiveConductor,
} from "../state/selectors";
import { buildPlayground } from "../processors/build-playground";
import { hash } from "../processors/hash";
import { Blackboard } from "../blackboard/blackboard";

export class HolochainPlayground extends LitElement {
  @query("#dna-help")
  dnaHelp: Dialog;

  @property()
  playground = buildPlayground(hash("dna1"), 10);

  blackboard = new Blackboard(this.playground);

  static get styles() {
    return sharedStyles;
  }

  renderDNACard() {
    return html`
      <mwc-card style="width: auto; padding: 16px; padding-bottom: 0;">
        <div style="padding: 16px;" class="row center-content">
          <div class="column" style="flex: 1;">
            <h3>DNA: ${this.blackboard.state.activeDNA}</h3>
            <div class="row">
              <span>
                Nodes: ${selectCellCount(this.blackboard.state)}, Redundancy factor:
                ${this.blackboard.state.redundancyFactor}, Global DHT Ops:
                ${selectGlobalDHTOps(this.blackboard.state)}, Unique DHT Ops:
                ${selectUniqueDHTOps(this.blackboard.state)}</span
              >
            </div>
          </div>

          <mwc-icon-button
            icon="help_outline"
            @click=${() => (this.dnaHelp.open = true)}
          ></mwc-icon-button>
        </div>
      </mwc-card>
    `;
  }

  renderDNAHelp() {
    return html`
      <mwc-dialog id="dna-help" heading="DNA Help">
        <span>
          This panel contains general information for the current holochain
          <a
            href="https://developer.holochain.org/docs/concepts/2_application_architecture/"
            >DNA</a
          >, with ID: ${this.blackboard.state.activeDNA}.
          <br />
          <br />
          Having a redundancy factor of ${this.blackboard.state.redundancyFactor}, it will
          <strong
            >replicate every DHT Op in the ${this.blackboard.state.redundancyFactor} nodes
            that are closest to its neighborhood</strong
          >.
          <br />
          <br />
          The number of
          <strong
            >DHT Ops (DHT Operation Transforms) is a measure of the load that
            the DHT has to hold</strong
          >. A DHT Op is the command that a node receives to indicate it has to
          change something in its shard of the DHT. Example of DHT Ops are
          "StoreEntry", "RegisterAddLink".
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      <blackboard-container .blackboard=${this.blackboard}>
        ${this.renderDNAHelp()}
        <div class="row fill" style="height: 100%;">
          <div style="flex: 1;" class="column">
            ${this.renderDNACard()}
            ${selectActiveConductor(this.blackboard.state)
              ? html` <conductor-detail class="fill"></conductor-detail> `
              : html`
                  <div class="row fill center-content">
                    <span>Select node to see its state</span>
                  </div>
                `}
          </div>
          <div class="column" style="flex: 1;">
            <dht-graph style="flex: 1;"></dht-graph>
          </div></div
      ></blackboard-container>
    `;
  }
}
