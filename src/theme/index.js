import { createTheme as createMuiTheme } from "@material-ui/core/styles";

import breakpoints from "./breakpoints";
import overrides from "./overrides";
import props from "./props";
import shadows from "./shadows";
import typography from "./typography";
import variants from "./variants";

const createTheme = (name) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = variants[0];
  }

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints,
      overrides,
      props,
      typography,
      shadows,
      palette: themeConfig.palette,
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
    }
  );
};

export default createTheme;
