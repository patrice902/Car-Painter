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

const ConfigCatFlags = {
  EMERGENCY_SHUT_DOWN: "emergencyShutDown",
  DISABLE_APP_LOGIN: "disableAppLogin",
};

const TemplateVariables = {
  PROFILE_NAME: "%NAME%",
  PROFILE_AVATAR: "%AVATAR%",
  TWITTER_NAME: "%TWITTER_NAME%",
  FACEBOOK_NAME: "%FACEBOOK_NAME%",
  INSTAGRAM_NAME: "%INSTAGRAM_NAME%",
  TWITCH_NAME: "%TWITCH_NAME%",
  YOUTUBE_NAME: "%YOUTUBE_NAME%",
  WEBSITE_URL: "%WEBSITE_URL%",
  EMAIL: "%EMAIL%",
};

const UserMinimumFields = [
  "drivername",
  "clubname",
  "email",
  "id",
  "is_admin",
  "shorten_name",
  "website_url",
  "twitter_name",
  "facebook_name",
  "instagram_name",
  "twitch_name",
  "youtube_name",
  "staff_member",
  "active",
  "pro_user",
  "saved_colors",
];

module.exports = {
  StorageType,
  LayerTypes,
  ConfigCatFlags,
  TemplateVariables,
  UserMinimumFields,
};
