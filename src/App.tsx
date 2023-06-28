import DateFnsUtils from "@date-io/date-fns";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  ConfigCatProvider,
  createConsoleLogger,
  LogLevel,
} from "configcat-react";
import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import { ThemeProvider } from "styled-components";

import config from "./config";
import Routes from "./routes/Routes";
import createTheme from "./theme";

const devMode = config.env === "development";

function App() {
  const theme = useSelector((state: RootState) => state.themeReducer);
  const logger = createConsoleLogger(LogLevel.Info);

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s · Paint Builder · Trading Paints"
        defaultTitle="Paint Builder · Trading Paints"
      />
      <ConfigCatProvider
        sdkKey={config.configCatKey ?? ""}
        options={{ logger: devMode ? logger : undefined }}
      >
        <StylesProvider injectFirst>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
              <ThemeProvider theme={createTheme(theme.currentTheme)}>
                <Routes />
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </ConfigCatProvider>
    </React.Fragment>
  );
}

export default App;
