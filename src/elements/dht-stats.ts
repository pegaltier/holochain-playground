import { pinToBoard } from "../blackboard/blackboard-mixin";
import { Playground } from "../state/playground";
import { LitElement, html, query } from "lit-element";
import {
  selectCellCount,
  selectGlobalDHTOps,
  selectUniqueDHTOps,
} from "../state/selectors";
import { sharedStyles } from "./sharedStyles";
import { Dialog } from "@material/mwc-dialog";

export class DHTStats extends pinToBoard<Playground>(LitElement) {
  @query("#stats-help")
  statsHelp: Dialog;

  static get styles() {
    return sharedStyles;
  }

  renderStatsHelp() {
    return html`
      <mwc-dialog id="stats-help" heading="DHT Statistics Help">
        <span>
          This panel contains statistics for the current state of the DHT.
          <br />
          <br />
          Having a redundancy factor of ${this.state.redundancyFactor}, it will
          <strong
            >replicate every DHT Op in the ${this.state.redundancyFactor} nodes
            that are closest to its neighborhood</strong
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

  render() {
    return html`
      ${this.renderStatsHelp()}
      <div class="column" style="position: relative;">
        <mwc-icon-button
          style="position: absolute; right: 8px; top: 8px;"
          icon="help_outline"
          @click=${() => (this.statsHelp.open = true)}
        ></mwc-icon-button>

        <span>Nodes: ${selectCellCount(this.state)}</span>
        <span>Redundancy factor: ${this.state.redundancyFactor}</span>
        <span>Global DHT Ops: ${selectGlobalDHTOps(this.state)}</span>
        <span>Unique DHT Ops: ${selectUniqueDHTOps(this.state)}</span>
      </div>
    `;
  }
}
