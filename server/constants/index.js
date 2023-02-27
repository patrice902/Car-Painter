const StorageType = {
  S3: "S3", // AWS S3 Bucket
  SPACE: "SPACE", // Digital Ocean Space
  LOCAL: "LOCAL", // Local
};

const LayerTypes = {
  TEXT: 1,
  LOGO: 2,
  BASE: 3,
  OVERLAY: 4,
  UPLOAD: 5,
  CAR: 6,
  SHAPE: 7,
};

module.exports = {
  StorageType,
  LayerTypes,
};
