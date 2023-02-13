import DateFnsUtils from "@date-io/date-fns";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import config from "config";
import React from "react";
import { initialize as initializeGA } from "react-ga";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import Routes from "./routes/Routes";
import createTheme from "./theme";

initializeGA(config.gaTrackingID);

function App() {
  const theme = useSelector((state) => state.themeReducer);

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s · Paint Builder · Trading Paints"
        defaultTitle="Paint Builder · Trading Paints"
      />
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
            <ThemeProvider theme={createTheme(theme.currentTheme)}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

export default App;
