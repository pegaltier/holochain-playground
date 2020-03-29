import { LitElement, html, property, query, css } from "lit-element";
import "@material/mwc-textarea";
import "@material/mwc-button";
import "@material/mwc-textfield";
import { sharedStyles } from "./sharedStyles";
import { Cell } from "../types/cell";
import { TextArea } from "@material/mwc-textarea";
import { TextFieldBase } from "@material/mwc-textfield/mwc-textfield-base";

export class CreateEntries extends LitElement {
  @property()
  cell: Cell;

  @query("#create-entry-textarea")
  createTextarea: TextArea;

  @query("#create-entry-textarea")
  updateTextarea: TextArea;

  @query("#update-entry-address")
  updateAddress: TextFieldBase;

  @query("#remove-entry-address")
  removeAddress: TextFieldBase;
  @query("#add-from-address")
  addFromAddress: TextFieldBase;
  @query("#add-to-address")
  addToAddress: TextFieldBase;
  @query("#add-tag")
  addTag: TextFieldBase;

  setEntryValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      if (newValue.length === 46) {
        const entry = this.cell.getEntry(newValue);
        if (entry) return { valid: true };
      }
      element.setCustomValidity("Entry does not exist");

      return {
        valid: false
      };
    };
  }

  setJsonValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      console.log(newValue, nativeValidity);

      if (newValue === "") return { valid: false };
      try {
        const json = JSON.parse(newValue);
        element.setCustomValidity("");

        this.requestUpdate();
        return {
          valid: true
        };
      } catch (e) {
        element.setCustomValidity("Bad JSON input");
        this.requestUpdate();
        return { valid: false };
      }
    };
  }

  firstUpdated() {
    this.setJsonValidity(this.createTextarea);
    this.setJsonValidity(this.updateTextarea);
    this.setEntryValidity(this.updateAddress);
    this.setEntryValidity(this.removeAddress);
    this.setEntryValidity(this.addFromAddress);
    this.setEntryValidity(this.addToAddress);
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        mwc-textfield,
        mwc-textarea {
          margin-right: 16px;
        }
      `
    ];
  }

  renderCreateEntry() {
    return html`
      <div class="column">
        <h3>Create Entry</h3>
        <div class="row center-content">
          <mwc-textarea
            outlined
            id="create-entry-textarea"
            style="flex: 1;"
            fullwidth
            required
            @input=${() => this.createTextarea.reportValidity()}
            placeholder="Input JSON of entry"
          ></mwc-textarea>
          <mwc-button
            raised
            label="CREATE"
            .disabled=${!(
              this.createTextarea && this.createTextarea.validity.valid
            )}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderUpdateEntry() {
    return html`
      <div class="column">
        <h3>Update Entry</h3>
        <div class="row center-content">
          <mwc-textarea
            outlined
            id="update-entry-textarea"
            style="flex: 1;"
            fullwidth
            required
            @input=${() => this.updateTextarea.reportValidity()}
            placeholder="Input JSON of entry"
          ></mwc-textarea>
          <mwc-textfield
            outlined
            id="update-entry-address"
            label="Entry to update"
            style="width: 10em"
            @input=${() => this.updateAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-button
            raised
            label="UPDATE"
            .disabled=${!(
              this.updateTextarea &&
              this.updateTextarea.validity.valid &&
              this.updateAddress &&
              this.updateAddress.validity.valid
            )}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderRemoveEntry() {
    return html`
      <div class="column">
        <h3>Remove Entry</h3>
        <div class="row center-content">
          <mwc-textfield
            outlined
            id="remove-entry-address"
            label="Entry address to remove"
            style="width: 35em"
            @input=${() => this.removeAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-button
            raised
            label="REMOVE"
            .disabled=${!(
              this.removeAddress && this.removeAddress.validity.valid
            )}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderLinkEntries() {
    return html`
      <div class="column">
        <h3>Link Entries</h3>
        <div class="row center-content">
          <mwc-textfield
            outlined
            id="add-from-address"
            label="Base entry address"
            style="width: 14em"
            @input=${() => this.addFromAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="add-to-address"
            label="Target entry address"
            @input=${() => this.addToAddress.reportValidity()}
            style="width: 14em"
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="add-tag-address"
            label="Tag of the link"
            style="width: 14em"
          ></mwc-textfield>
          <mwc-button
            raised
            label="LINK"
            .disabled=${!(
              this.addFromAddress && this.addFromAddress.validity.valid
            )}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="column">
        ${this.renderCreateEntry()} ${this.renderUpdateEntry()}
        ${this.renderRemoveEntry()} ${this.renderLinkEntries()}
      </div>
    `;
  }
}
