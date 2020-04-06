import { pinToBoard } from "../blackboard/blackboard-mixin";
import { Playground } from "../state/playground";
import { LitElement, html, css } from "lit-element";
import cytoscape from "cytoscape";
import klay from "cytoscape-klay";
import { allEntries } from "../processors/graph";
import { selectActiveCells } from "../state/selectors";
import { sharedStyles } from "./sharedStyles";

cytoscape.use(klay);

export class EntryGraph extends pinToBoard<Playground>(LitElement) {
  cy;

  firstUpdated() {
    this.cy = cytoscape({
      container: this.shadowRoot.getElementById("entry-graph"),
      elements: allEntries(selectActiveCells(this.state)),
      boxSelectionEnabled: false,
      layout: { name: "klay" },
      style: `
              node {
                background-color: grey;
                font-size: 6px;
                width: 15px;
                height: 15px;
              }
      
              edge {
                label: data(label);
                width: 2;
                target-arrow-shape: triangle;
                curve-style: bezier;
              }
              
              edge[label] {
                font-size: 4px;
                text-rotation: autorotate;
                text-margin-x: 0px;
                text-margin-y: -5px;
                text-valign: top;
                text-halign: center;        
              }
      
              .selected {
                border-width: 2px;
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
      
              .implicit {
                width: 1;
                line-style: dotted;
              }

              .update-link {
                width: 1;
                line-style: dashed;
              }
              .updated {
                opacity: 0.5;
              }
              .deleted {
                opacity: 0.3;
              }
            `,
    });

    this.cy.on("tap", "node", (event) => {
      const selectedEntryId = event.target.id();
      this.blackboard.update("activeEntryId", selectedEntryId);
    });


  }

  updated(changedValues) {
    super.updated(changedValues);

    this.cy.remove("nodes");
    this.cy.remove("edges");
    this.cy.add(allEntries(selectActiveCells(this.state)));
    this.cy
      .layout({ name: "klay", options: { klay: { edgeSpacingFactor: 20 } } })
      .run();

    this.cy.filter("node").removeClass("selected");
    this.cy.getElementById(this.state.activeEntryId).addClass("selected");
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-card style="width: auto;" class="fill">
        <div id="entry-graph" class="fill"></div>
      </mwc-card>
    `;
  }
}
