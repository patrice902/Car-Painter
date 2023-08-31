const configcat = require("configcat-node");
const config = require("../config");
const logger = configcat.createConsoleLogger(configcat.LogLevel.Info);

const configCatClient = configcat.getClient(
  config.configCatKey,
  configcat.PollingMode.AutoPoll,
  {
    logger,
  }
);

module.exports = configCatClient;
