import { LitElement, html, css, property, query } from "lit-element";
import cytoscape from "cytoscape";
import avsdf from "cytoscape-avsdf";

import { Playground } from "../types/playground";
import { dnaNodes } from "../processors/graph";
import { buildPlayground } from "../processors/build-playground";
import { sharedStyles } from "./sharedStyles";

export class HolochainPlayground extends LitElement {
  @property()
  playground: Playground;

  @property()
  selectedDNA: string;

  @query("#graph")
  element: HTMLElement;

  async firstUpdated() {
    this.selectedDNA = "dna1";
    this.playground = await buildPlayground(this.selectedDNA, 10);

    cytoscape.use(avsdf);
    cytoscape({
      container: this.shadowRoot.getElementById("graph"),
      elements: dnaNodes(this.selectedDNA, this.playground),
      layout: { name: "avsdf" },
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(label)",
            "font-size": "8px",
            width: "15px",
            height: "15px"
          }
        }
      ]
    });
  }

  static get styles() {
    return sharedStyles;
  }

  render() {
    return html`
      <div class="row fill" style="height: 100%;">
        <div id="graph" style="flex: 800px;"></div>
      </div>
    `;
  }
}
