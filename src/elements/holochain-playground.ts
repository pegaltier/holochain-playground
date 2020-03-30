import { LitElement, html, css, property, query } from "lit-element";
import cytoscape from "cytoscape";

import "@material/mwc-icon-button";
import "@material/mwc-button";
import "@material/mwc-dialog";

import { Playground } from "../types/playground";
import { dnaNodes } from "../processors/graph";
import { buildPlayground } from "../processors/build-playground";
import { sharedStyles } from "./sharedStyles";
import { Conductor } from "../types/conductor";
import { hash } from "../processors/hash";
import { Cell } from "../types/cell";
import { DHTOp, DHTOpType } from "../types/dht-op";
import { Dialog } from "@material/mwc-dialog";

export class HolochainPlayground extends LitElement {
  @property()
  selectedDNA = hash("dna1");

  @property()
  playground: Playground = buildPlayground(this.selectedDNA, 10);

  @property()
  selectedConductor: Conductor;

  @query("#graph")
  element: HTMLElement;

  @query("#dna-help")
  dnaHelp: Dialog;

  @query("#dht-help")
  dhtHelp: Dialog;

  highlightNodesWithEntry(cy, entryId: string) {
    this.getActiveCells().forEach(cell =>
      cy.getElementById(cell.agentId).removeClass("highlighted")
    );
    const cells = this.getActiveCells().filter(
      c =>
        !!Object.values(c.DHTOpTransforms).find(
          (dhtOp: DHTOp) =>
            dhtOp.type === DHTOpType.StoreEntry &&
            dhtOp.header.entryAddress === entryId
        )
    );

    for (const cell of cells) {
      cy.getElementById(cell.agentId).addClass("highlighted");
    }
  }

  async firstUpdated() {
    const nodes = dnaNodes(this.getActiveCells());

    const cy = cytoscape({
      container: this.shadowRoot.getElementById("graph"),
      boxSelectionEnabled: true,

      elements: nodes,
      layout: { name: "circle" },
      style: `
        node {
          background-color: grey;
          label: data(label);
          font-size: 20px;
          width: 30px;
          height: 30px;
        }

        .selected {
          border-width: 4px;
          border-color: black;
          border-style: solid;
        }

        .highlighted {
          background-color: yellow;
        }

        edge {
          width: 1;
          line-style: dotted;
        }
      `
    });

    cy.on("tap", "node", evt => {
      this.selectedConductor = this.playground.conductors.find(conductor =>
        conductor.agentIds.find(agentId => agentId === evt.target.id())
      );
      this.getActiveCells().forEach(cell =>
        cy.getElementById(cell.agentId).removeClass("selected")
      );
      cy.getElementById(evt.target.id()).addClass("selected");

      this.highlightNodesWithEntry(cy, null);
    });

    this.addEventListener("entry-committed", (e: CustomEvent) => {
      this.requestUpdate();
      this.highlightNodesWithEntry(cy, e.detail.entryId);
    });
    this.addEventListener("entry-selected", (e: CustomEvent) =>
      this.highlightNodesWithEntry(cy, e.detail.entryId)
    );
  }

  static get styles() {
    return sharedStyles;
  }

  getNodes() {
    return this.getActiveCells().length;
  }

  getActiveCells(): Cell[] {
    return this.playground.conductors
      .map(c => c.cells[this.selectedDNA])
      .filter(c => !!c);
  }

  getGlobalDHTOps() {
    let dhtOps = 0;

    for (const cell of this.getActiveCells()) {
      dhtOps += Object.keys(cell.DHTOpTransforms).length;
    }

    return dhtOps;
  }

  getUniqueDHTOps() {
    const globalDHTOps = {};

    for (const cell of this.getActiveCells()) {
      for (const hash of Object.keys(cell.DHTOpTransforms)) {
        globalDHTOps[hash] = {};
      }
    }

    return Object.keys(globalDHTOps).length;
  }

  renderDNACard() {
    return html`
      <mwc-card style="width: auto; padding: 16px; padding-bottom: 0;">
        <div style="padding: 16px;" class="row center-content">
          <div class="column" style="flex: 1;">
            <h3>DNA: ${this.selectedDNA}</h3>
            <div class="row">
              <span
                >Nodes: ${this.getNodes()}, Redundancy factor:
                ${this.playground.redundancyFactor}, Global DHT Ops:
                ${this.getGlobalDHTOps()}, Unique DHT Ops:
                ${this.getUniqueDHTOps()}</span
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
          >, with ID: ${this.selectedDNA}.
          <br />
          <br />
          Having a redundancy factor of ${this.playground.redundancyFactor}, it
          will
          <strong
            >replicate every DHT Op in the ${this.playground.redundancyFactor}
            nodes that are closest to its neighborhood</strong
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

  renderDHTHelp() {
    return html`
      <mwc-dialog id="dht-help" heading="DHT Help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            >DHT</a
          >, with ${this.playground.conductors.length} nodes.
          <br />
          <br />
          In the DHT, all nodes have a <strong>public and private key</strong>.
          The public key is visible and shared througout the network, but
          private keys never leave their nodes. This public key is of 256 bits
          an it's actually the node's ID, which you can see labeled besides the
          nodes (encoded in base58 strings).
          <br />
          <br />
          If you pay attention, you will see that
          <strong>all nodes in the DHT are ordered alphabetically</strong>. This
          is because the nodes organize themselves in neighborhoods: they are
          more connected with the nodes that are closest to their ID, and less
          connected with the nodes that are far.
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      ${this.renderDNAHelp()} ${this.renderDHTHelp()}
      <div class="row fill" style="height: 100%;">
        <div style="flex: 1;" class="column">
          ${this.renderDNACard()}
          ${this.selectedConductor
            ? html`
                <conductor-detail
                  class="fill"
                  .conductor=${this.selectedConductor}
                  .selectedDNA=${this.selectedDNA}
                ></conductor-detail>
              `
            : html`
                <div class="row fill center-content">
                  <span>Select node to see its state</span>
                </div>
              `}
        </div>
        <div class="column" style="flex: 1;">
          <div id="graph" style="height: 100%"></div>

          <mwc-icon-button
            style="position: fixed; right: 36px; top: 36px;"
            icon="help_outline"
            @click=${() => (this.dhtHelp.open = true)}
          ></mwc-icon-button>
        </div>
      </div>
    `;
  }
}
