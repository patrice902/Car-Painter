import { Theme } from "@material-ui/core";
import styled, { createGlobalStyle, ThemeProps } from "styled-components";

export const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)}px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

export const StyledLink = styled.a`
  color: #f48fb1;
  text-decoration: none;
`;

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

export const LogoWrapper = styled.div`
  width: 500px;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
`;
