import { LitElement, html } from "lit-element";
import { selectActiveConductor } from "../state/selectors";
import { Playground } from "../state/playground";
import { pinToBoard } from "../blackboard/blackboard-mixin";

export class TechnicalMode extends pinToBoard<Playground>(LitElement) {
  render() {
    return html`
      <div style="flex: 1;" class="column">
        ${selectActiveConductor(this.state)
          ? html` <conductor-detail class="fill"></conductor-detail> `
          : html`
              <div class="row fill center-content">
                <span>Select node to see its state</span>
              </div>
            `}
      </div>
      <div class="column" style="flex: 1;">
        <dht-graph style="flex: 1;"></dht-graph>
      </div>
    `;
  }
}
