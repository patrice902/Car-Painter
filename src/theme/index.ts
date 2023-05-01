import { createTheme as createMuiTheme } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";
import { Overrides } from "@material-ui/core/styles/overrides";
import { ComponentsProps } from "@material-ui/core/styles/props";
import { Shadows } from "@material-ui/core/styles/shadows";

import breakpoints from "./breakpoints";
import overrides from "./overrides";
import props from "./props";
import shadows from "./shadows";
import typography from "./typography";
import variants from "./variants";

const createTheme = (name: string) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = variants[0];
  }

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints,
      overrides: overrides as Overrides,
      props: props as ComponentsProps,
      typography: typography as TypographyOptions,
      shadows: shadows as Shadows,
      palette: themeConfig.palette as PaletteOptions,
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
