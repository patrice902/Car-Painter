const mdb = require("knex-mariadb");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  parentAppURL:
    process.env.REACT_APP_PARENT_APP_URL || "https://www.tradingpaints.com",
  port: process.env.PORT || 3000,
  configCatKey: process.env.REACT_APP_CONFIGCAT_KEY,
  md5Salt: process.env.MD5_SALT,
  database: {
    client: process.env.DB_CLIENT === "mysql" ? process.env.DB_CLIENT : mdb,
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || "3306",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8mb4",
    },
    migrations: {
      tableName: "migrations",
      directory: `${process.cwd()}/server/migrations`,
    },
    seeds: {
      tableName: "seeds",
      directory: `${process.cwd()}/server/seeds`,
    },
    debug: false,
  },
  awsKey: process.env.AWS_API_KEY,
  awsSecret: process.env.AWS_API_SECRET,
  awsRegion: process.env.AWS_REGION,
  bucketURL: process.env.BUCKET_URL,
  storageType: process.env.STORAGE_TYPE || "S3",
  cryptoKey: process.env.REACT_APP_CRYPTO_HASHING_KEY || "SECRET_KEY",
};
