import { CssBaseline, Typography } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import TradingPaintsBigWhiteLogo from "src/assets/tradingpaints-logo-big-white.svg";

import {
  GlobalStyle,
  LogoWrapper,
  Root,
  StyledLink,
  Wrapper,
} from "./Maintenance.style";

export const Maintenance = React.memo(() => (
  <Root>
    <CssBaseline />
    <GlobalStyle />
    <Wrapper>
      <Helmet title="Maintenance" />
      <LogoWrapper>
        <img
          src={TradingPaintsBigWhiteLogo}
          alt="TradingPaintsLogo"
          width="100%"
        />
      </LogoWrapper>
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        Paint Builder is under maintenance.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        Paint Builder is temporarily closed for updates and will return soon.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        <StyledLink
          href="https://twitter.com/tradingpaints"
          target="_blank"
          rel="noreferrer"
        >
          Follow @tradingpaints
        </StyledLink>{" "}
        for updates.
      </Typography>
    </Wrapper>
  </Root>
));

export default Maintenance;
