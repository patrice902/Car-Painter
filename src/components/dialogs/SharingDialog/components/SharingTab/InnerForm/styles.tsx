import { DialogContent } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import styled from "styled-components/macro";

export const CustomDialogContent = styled(DialogContent)`
  padding-right: 0;
`;

export const CustomAutocomplete = styled(Autocomplete)`
  .MuiInputLabel-outlined {
    transform: translate(14px, 12px) scale(1);
    &.MuiInputLabel-shrink {
      transform: translate(14px, -6px) scale(0.75);
    }
  }
  .MuiInputBase-root {
    padding-top: 0;
    padding-bottom: 0;
  }
`;
