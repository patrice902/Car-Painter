import { Theme } from "@material-ui/core";
import styled, { createGlobalStyle, ThemeProps } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props: ThemeProps<Theme>) =>
      props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }

  .muicc-colorbox-controls {
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  .muicc-colorbox-controls button {
    margin: 0;
  }

  .muicc-colorbox-controls .muicc-colorbox-error {
    display: none;
  }
`;

export const Root = styled.div`
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
`;
