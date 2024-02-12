const config = {
  env: process.env.NODE_ENV,
  localEnv: Boolean(process.env.REACT_APP_LOCAL_ENV),
  configCatKey: process.env.REACT_APP_CONFIGCAT_KEY,
  recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  recaptchaSecretKey: process.env.REACT_APP_LOCAL_ENV
    ? process.env.REACT_APP_RECAPTCHA_SECRET_KEY
    : "",
  assetsURL:
    process.env.REACT_APP_ASSET_URL ||
    (process.env.NODE_ENV !== "development"
      ? "/assets"
      : "http://localhost:3000/assets"),
  legacyAssetURL: "https://paintbuilder-assets.tradingpaints.gg/legacy",
  parentAppURL: process.env.REACT_APP_PARENT_APP_URL,
  backendURL:
    process.env.NODE_ENV !== "development" ? "/" : "http://localhost:3000",
  apiURL:
    process.env.NODE_ENV !== "development"
      ? "/api"
      : "http://localhost:3000/api",
  cryptoKey: process.env.REACT_APP_CRYPTO_HASHING_KEY || "SECRET_KEY",
  changeLogAssetPath:
    process.env.REACT_APP_CHANGELOG_PATH || "/data/changelog.md",
  helpLink: {
    menu:
      process.env.REACT_APP_HELP_LINK_MENU ||
      "https://help.tradingpaints.com/kb/en/paint-builder-337264",
    legacyProjects:
      process.env.REACT_APP_HELP_LINK_LEGACY_PROJECTS ||
      "https://help.tradingpaints.com/kb/guide/en/about-legacy-projects-UNQoD95JTD/Steps/2522705",
    racingNumbers:
      process.env.REACT_APP_HELP_LINK_RACING_NUMBERS ||
      "https://help.tradingpaints.com/kb/guide/en/what-is-a-custom-number-paint-and-how-do-they-work-wideJuBrE5/Steps/2458158",
  },
};

export default config;
