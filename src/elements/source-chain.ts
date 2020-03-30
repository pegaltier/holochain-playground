import { LitElement, property, html, PropertyValues, css } from "lit-element";
import { sourceChainNodes } from "../processors/graph";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { Cell } from "../types/cell";
import { sharedStyles } from "./sharedStyles";
cytoscape.use(dagre); // register extension

export class SourceChain extends LitElement {
  @property()
  cell: Cell;

  @property()
  selectedEntry: string | undefined = undefined;

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `
    ];
  }

  setupGraph() {
    const cy = cytoscape({
      container: this.shadowRoot.getElementById("source-chain-graph"),
      elements: sourceChainNodes(this.cell),
      layout: { name: "dagre" },
      style: `
        node {
          width: 30px;
          height: 30px;
          background-color: grey;
        }

        edge {
          width: 4;
          target-arrow-shape: triangle;
          curve-style: bezier;
        }

        .selected {
          border-width: 4px;
          border-color: black;
          border-style: solid;
        }

        .DNA {
          background-color: green;
        }
        .AgentId {
          background-color: lime;
        }
        .CreateEntry {
          background-color: blue;
        }
        .RemoveEntry {
          background-color: red;
        }
        .UpdateEntry {
          background-color: cyan;
        }
        .LinkAdd {
          background-color: purple;
        }
        .LinkRemove {
          background-color: purple;
        }
      `
    });
    cy.on("tap", "node", event => {
      this.selectedEntry = event.target.id();
      cy.filter("node").removeClass("selected");
      cy.getElementById(this.selectedEntry).addClass("selected");

      this.dispatchEvent(
        new CustomEvent("entry-selected", {
          bubbles: true,
          composed: true,
          detail: { entryId: this.selectedEntry }
        })
      );
    });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has("cell")) {
      this.setupGraph();
      this.selectedEntry = undefined;
    }

    if (changedValues.has("selectedEntry")) {
      const entryViewer = this.shadowRoot.getElementById("selected-entry");
      if (entryViewer) {
        (entryViewer as any).data = this.selectedEntry
          ? this.cell.CAS[this.selectedEntry]
          : undefined;
      }
    }
  }

  render() {
    return html`
      <div class="row fill">
        <div style="width: 400px; height: 99%" id="source-chain-graph"></div>
        ${this.selectedEntry
          ? html`
              <div class="column">
                <strong style="margin-bottom: 8px;">
                  ${this.cell.CAS[this.selectedEntry].entryAddress
                    ? "Header"
                    : "Entry"}
                  Id
                </strong>
                <span style="margin-bottom: 16px;">${this.selectedEntry}</span>
                <json-viewer id="selected-entry"></json-viewer>
              </div>
            `
          : html`
              <div class="column fill center-content">
                <span>Select entry to inspect</span>
              </div>
            `}
      </div>
    `;
  }
}
