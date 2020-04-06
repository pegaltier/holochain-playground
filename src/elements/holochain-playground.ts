import { LitElement, html, query, property } from "lit-element";

import "@material/mwc-icon-button";
import "@material/mwc-button";
import "@material/mwc-dialog";
import "@material/mwc-switch";
import "@material/mwc-formfield";
import "@material/mwc-top-app-bar-fixed";
import { Dialog } from "@material/mwc-dialog";

import { sharedStyles } from "./sharedStyles";
import { buildPlayground } from "../processors/build-playground";
import { hash } from "../processors/hash";
import { Blackboard } from "../blackboard/blackboard";

export class HolochainPlayground extends LitElement {
  @property({ type: Object })
  playground = buildPlayground(hash("dna1"), 10);

  @property({ type: Boolean })
  technicalMode: boolean = false;

  blackboard = new Blackboard(this.playground);

  static get styles() {
    return sharedStyles;
  }

  firstUpdated() {
    this.blackboard.subscribe(() => this.requestUpdate());
  }

  render() {
    return html`
      <blackboard-container .blackboard=${this.blackboard} class="fill column">
        <mwc-top-app-bar-fixed>
          <span slot="title">DNA: ${this.blackboard.state.activeDNA}</span>

          <mwc-formfield label="Technical mode" slot="actionItems">
            <mwc-switch
              .checked=${this.technicalMode}
              @change=${() => (this.technicalMode = !this.technicalMode)}
            ></mwc-switch>
          </mwc-formfield>
        </mwc-top-app-bar-fixed>
        <div class="row fill">
          ${this.technicalMode
            ? html` <technical-mode class="fill"></technical-mode> `
            : html` <designer-mode class="fill"></designer-mode> `}
        </div>
      </blackboard-container>
    `;
  }
}
