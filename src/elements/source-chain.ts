import { LitElement, property, html, PropertyValues, css } from "lit-element";
import { sourceChainNodes } from "../processors/graph";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { Cell } from "../types/cell";
import { sharedStyles } from './sharedStyles';
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
          display: flex;DeleteEntry
        }
      `
    ];
  }

  setupGraph() {
    const cy = cytoscape({
      container: this.shadowRoot.getElementById("source-chain-graph"),
      elements: sourceChainNodes(this.cell),
      layout: { name: "dagre" },
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            "background-color": "#666",
            width: "30px",
            height: "30px"
          }
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "target-arrow-shape": "triangle",
            "curve-style": "bezier"
          }
        }
      ]
    });
    cy.on("tap", "node", event => {
      this.selectedEntry = event.target.id();
    });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has("cell")) {
     this.setupGraph();
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
                <h4>${this.selectedEntry}</h4>
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
