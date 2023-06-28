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
`;

export const Root = styled.div`
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;
