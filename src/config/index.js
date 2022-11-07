const config = {
  env: process.env.NODE_ENV,
  assetsURL:
    process.env.REACT_APP_ASSET_URL ||
    (process.env.NODE_ENV !== "development"
      ? "/assets"
      : "http://192.168.101.9:3000/assets"),
  legacyAssetURL: "https://www.tradingpaints.com/builder",
  parentAppURL: process.env.REACT_APP_PARENT_APP_URL,
  backendURL:
    process.env.NODE_ENV !== "development" ? "/" : "http://192.168.101.9:3000",
  apiURL:
    process.env.NODE_ENV !== "development"
      ? "/api"
      : "http://192.168.101.9:3000/api",
  gaTrackingID: process.env.REACT_APP_GA_TRACKING_ID,
};

export default config;
