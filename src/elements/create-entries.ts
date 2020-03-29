import { LitElement, html, property, query, css } from "lit-element";
import "@material/mwc-textarea";
import "@material/mwc-button";
import "@material/mwc-textfield";
import "@material/mwc-dialog";
import "@material/mwc-radio";
import "@material/mwc-formfield";
import { sharedStyles } from "./sharedStyles";
import { Cell } from "../types/cell";
import { TextArea } from "@material/mwc-textarea";
import { TextFieldBase } from "@material/mwc-textfield/mwc-textfield-base";
import { EntryType, Entry } from "../types/entry";

import "@alenaksu/json-viewer";
import { entryToDHTOps, neighborhood } from "../types/dht-op";
import { hash } from "../processors/hash";

export class CreateEntries extends LitElement {
  @property()
  cell: Cell;

  @property()
  selectedEntryType: number = 0;

  @query("#create-entry-textarea")
  createTextarea: TextArea;

  @query("#update-entry-textarea")
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

  @query("#remove-from-address")
  removeFromAddress: TextFieldBase;
  @query("#remove-to-address")
  removeToAddress: TextFieldBase;
  @query("#remove-timestamp")
  removeTimestamp: TextFieldBase;

  @property()
  entryToCreate: { entry: Entry; replaces?: string } | undefined = undefined;

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
    this.setEntryValidity(this.removeFromAddress);
    this.setEntryValidity(this.removeToAddress);
    [
      this.createTextarea,
      this.updateTextarea,
      this.updateAddress,
      this.removeAddress,
      this.addFromAddress,
      this.addToAddress,
      this.removeFromAddress,
      this.removeToAddress
    ].forEach(ele => ele.setCustomValidity(""));
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        hr {
          width: 100%;
          opacity: 0.3;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        mwc-textfield,
        mwc-textarea {
          margin-bottom: 16px;
        }
        mwc-textarea {
          width: 100%;
        }
      `
    ];
  }

  renderCreateEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 0 ? "" : "display: none;"}
      >
        <h3>Create Entry</h3>
        <div class="column center-content">
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
            @click=${() =>
              (this.entryToCreate = {
                entry: {
                  type: EntryType.CreateEntry,
                  payload: this.createTextarea.value
                }
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderUpdateEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 1 ? "" : "display: none;"}
      >
        <h3>Update Entry</h3>
        <div class="column center-content">
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
            style="width: 35em"
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
            @click=${() =>
              (this.entryToCreate = {
                entry: {
                  type: EntryType.CreateEntry,
                  payload: this.createTextarea.value
                },
                replaces: this.updateAddress.value
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderRemoveEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 2 ? "" : "display: none;"}
      >
        <h3>Remove Entry</h3>
        <div class="column center-content">
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
            @click=${() =>
              (this.entryToCreate = {
                entry: {
                  type: EntryType.RemoveEntry,
                  payload: { deletedEntry: this.removeAddress.value }
                }
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderLinkEntries() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 3 ? "" : "display: none;"}
      >
        <h3>Link Entries</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="add-from-address"
            label="Base entry address"
            style="width: 35em"
            @input=${() => this.addFromAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="add-to-address"
            label="Target entry address"
            @input=${() => this.addToAddress.reportValidity()}
            style="width: 35em"
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="add-tag"
            label="Tag of the link"
            style="width: 35em"
          ></mwc-textfield>
          <mwc-button
            raised
            label="LINK"
            .disabled=${!(
              this.addFromAddress &&
              this.addFromAddress.validity.valid &&
              this.addToAddress &&
              this.addToAddress.validity.valid
            )}
            @click=${() =>
              (this.entryToCreate = {
                entry: {
                  type: EntryType.LinkAdd,
                  payload: {
                    base: this.addFromAddress.value,
                    target: this.addToAddress.value,
                    tag: this.addTag.value
                  }
                }
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderRemoveLink() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 4 ? "" : "display: none;"}
      >
        <h3>Remove Link</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="remove-from-address"
            label="Base entry address"
            style="width: 35em"
            @input=${() => this.removeFromAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="remove-to-address"
            label="Target entry address"
            @input=${() => this.removeToAddress.reportValidity()}
            style="width: 35em"
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="remove-timestamp"
            label="Timestamp of the link"
            style="width: 35em"
          ></mwc-textfield>
          <mwc-button
            raised
            label="REMOVE LINK"
            .disabled=${!(
              this.removeFromAddress &&
              this.removeFromAddress.validity.valid &&
              this.removeToAddress &&
              this.removeToAddress.validity.valid
            )}
            @click=${() =>
              (this.entryToCreate = {
                entry: {
                  type: EntryType.LinkRemove,
                  payload: {
                    base: this.removeFromAddress.value,
                    target: this.removeToAddress.value,
                    timestamp: parseInt(this.removeTimestamp.value)
                  }
                }
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  buildDHTOpsTransforms() {
    const dhtOps = entryToDHTOps(
      this.entryToCreate.entry,
      this.cell.newHeader(
        hash(this.entryToCreate.entry),
        this.entryToCreate.replaces
      )
    );

    return dhtOps.map(dhtOp => ({
      operation: dhtOp,
      neighborhood: neighborhood(dhtOp)
    }));
  }

  renderCommitDialog() {
    return html`
      <mwc-dialog .open=${!!this.entryToCreate} heading="Commit new entry">
        <div>
          This will create these DHT Operations on the given neighborhoods
        </div>

        <json-viewer .data=${this.buildDHTOpsTransforms()}></json-viewer>

        <mwc-button
          slot="secondaryAction"
          dialogAction="cancel"
          @click=${() => (this.entryToCreate = undefined)}
        >
          Cancel
        </mwc-button>
        <mwc-button
          slot="primaryAction"
          dialogAction="confirm"
          @click=${() => {
            this.cell.createEntry(
              this.entryToCreate.entry,
              this.entryToCreate.replaces
            );
            this.entryToCreate = undefined;
            this.dispatchEvent(
              new CustomEvent("entry-committed", {
                bubbles: true,
                composed: true
              })
            );
          }}
        >
          Commit entry
        </mwc-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      <div class="row">
        ${this.entryToCreate ? this.renderCommitDialog() : html``}
        <div class="column" style="margin-right: 16px;">
          <mwc-formfield label="Create Entry">
            <mwc-radio
              name="entryType"
              checked
              @change=${() => (this.selectedEntryType = 0)}
            ></mwc-radio>
          </mwc-formfield>
          <mwc-formfield label="Update Entry">
            <mwc-radio
              name="entryType"
              @change=${() => (this.selectedEntryType = 1)}
            ></mwc-radio>
          </mwc-formfield>
          <mwc-formfield label="Remove Entry">
            <mwc-radio
              name="entryType"
              @change=${() => (this.selectedEntryType = 2)}
            ></mwc-radio>
          </mwc-formfield>
          <mwc-formfield label="Link Entries">
            <mwc-radio
              name="entryType"
              @change=${() => (this.selectedEntryType = 3)}
            ></mwc-radio>
          </mwc-formfield>
          <mwc-formfield label="Remove Links">
            <mwc-radio
              name="entryType"
              @change=${() => (this.selectedEntryType = 4)}
            ></mwc-radio>
          </mwc-formfield>
        </div>
        <div class="fill" style="padding: 0 24px;">
          ${this.renderCreateEntry()} ${this.renderUpdateEntry()}
          ${this.renderRemoveEntry()} ${this.renderLinkEntries()}
          ${this.renderRemoveLink()}
        </div>
      </div>
    `;
  }
}
