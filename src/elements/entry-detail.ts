import { LitElement, html } from "lit-element";

import { pinToBoard } from "../blackboard/blackboard-mixin";
import { Playground } from "../state/playground";
import { selectActiveEntry } from '../state/selectors';

export class EntryDetail extends pinToBoard<Playground>(LitElement) {
  render() {
    return html`
      ${selectActiveEntry(this.state)
        ? html`
            <div class="column">
              <strong style="margin-bottom: 8px;">
                ${selectActiveEntry(this.state).entryAddress
                  ? "Header"
                  : "Entry"}
                Id
              </strong>
              <span style="margin-bottom: 16px;"
                >${this.state.activeEntryId}</span
              >
              <json-viewer .data=${selectActiveEntry(this.state)}></json-viewer>
            </div>
          `
        : html`
            <div class="column fill center-content">
              <span>Select entry to inspect</span>
            </div>
          `}
    `;
  }
}
