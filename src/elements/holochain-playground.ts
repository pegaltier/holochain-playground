import { LitElement, html, css, property, query } from "lit-element";
import cytoscape from "cytoscape";

import { Playground } from "../types/playground";
import { dnaNodes } from "../processors/graph";
import { buildPlayground } from "../processors/build-playground";
import { sharedStyles } from "./sharedStyles";
import { Conductor } from "../types/conductor";
import { hash } from "../processors/hash";
import { Cell } from "../types/cell";
import { DHTOp, DHTOpType } from "../types/dht-op";

export class HolochainPlayground extends LitElement {
  @property()
  selectedDNA = hash("dna1");

  @property()
  playground: Playground = buildPlayground(this.selectedDNA, 10);

  @property()
  selectedConductor: Conductor;

  @query("#graph")
  element: HTMLElement;

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
          label: data(label);
          font-size: 20px;
          width: 30px;
          height: 30px;
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
      this.highlightNodesWithEntry(cy, null);
    });

    this.addEventListener("entry-committed", () => this.requestUpdate());
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
        <div style="padding: 16px;" class="row">
          <div class="column">
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
        </div>
      </mwc-card>
    `;
  }

  render() {
    return html`
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
        </div>
      </div>
    `;
  }
}
