import { LitElement, property, html } from "lit-element";
import { Blackboard } from "./blackboard";

export class BlackboardContainer extends LitElement {
  @property({ type: Blackboard })
  blackboard: Blackboard<any>;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("pin-to-board", (e: CustomEvent) => {
      e.stopPropagation();
      e["blackboard"] = this.blackboard;
    });
  }

  render() {
    return html`<slot></slot>`;
  }
}
