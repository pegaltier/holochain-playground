import { css } from "lit-element";

export const sharedStyles = css`
  .row {
    display: flex;
    flex-direction: row;
  }
  .column {
    display: flex;
    flex-direction: column;
  }
  .fill {
    flex: 1;
  }
  .center-content {
    align-items: center;
    justify-content: center;
  }
`;
