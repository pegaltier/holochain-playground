import { LitElement, html, query } from "lit-element";
import cytoscape from "cytoscape";
import { Dialog } from "@material/mwc-dialog";

import { dnaNodes } from "../processors/graph";
import { pinToBoard } from "../blackboard/blackboard-mixin";
import { Playground } from "../state/playground";
import { selectActiveCells } from "../state/selectors";
import { DHTOp, DHTOpType } from "../types/dht-op";
import { sharedStyles } from "./sharedStyles";

export class DHTGraph extends pinToBoard<Playground>(LitElement) {
  @query("#graph")
  element: HTMLElement;

  @query("#dht-help")
  dhtHelp: Dialog;

  static get styles() {
    return sharedStyles;
  }

  async firstUpdated() {
    const nodes = dnaNodes(selectActiveCells(this.state));

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
          `,
    });

    cy.on("tap", "node", (evt) => {
      this.blackboard.update("activeAgentId", evt.target.id());
      selectActiveCells(this.state).forEach((cell) =>
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

  highlightNodesWithEntry(cy, entryId: string) {
    selectActiveCells(this.state).forEach((cell) =>
      cy.getElementById(cell.agentId).removeClass("highlighted")
    );
    const cells = selectActiveCells(this.state).filter(
      (c) =>
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

  renderDHTHelp() {
    return html`
      <mwc-dialog id="dht-help" heading="DHT Help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            >DHT</a
          >, with ${this.state.conductors.length} nodes.
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
    return html`${this.renderDHTHelp()}
      <div id="graph" style="height: 100%"></div>

      <mwc-icon-button
        style="position: fixed; right: 36px; top: 36px;"
        icon="help_outline"
        @click=${() => (this.dhtHelp.open = true)}
      ></mwc-icon-button> `;
  }
}
