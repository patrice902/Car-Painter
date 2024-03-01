const config = require("../config");

function generateRandomColor() {
  return [...Array(6)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

function getLayerUpdatingInfo(originLayer, layer) {
  const updatingInfo = { ...layer };

  if (layer.layer_data) {
    const payloadLayerData =
      typeof layer.layer_data === "string"
        ? JSON.parse(layer.layer_data)
        : layer.layer_data;

    updatingInfo.layer_data = JSON.stringify({
      ...JSON.parse(originLayer.layer_data),
      ...payloadLayerData,
    });
  }

  return updatingInfo;
}

function getSchemeUpdatingInfo(originScheme, scheme) {
  let updatingInfo = { ...scheme };

  if (scheme.guide_data) {
    const payloadGuideData =
      typeof scheme.guide_data === "string"
        ? JSON.parse(scheme.guide_data)
        : scheme.guide_data;

    updatingInfo.guide_data = JSON.stringify({
      ...JSON.parse(originScheme.guide_data),
      ...payloadGuideData,
    });
  }

  return updatingInfo;
}

function removeNumbersFromString(text) {
  return text.replace(/[0-9]/g, "");
}

function getAvatarURL(userId) {
  return `${config.parentAppURL}/scripts/image_driver.php?driver=${userId}`;
}

module.exports = {
  generateRandomColor,
  getLayerUpdatingInfo,
  getSchemeUpdatingInfo,
  removeNumbersFromString,
  getAvatarURL,
};
