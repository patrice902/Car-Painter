const s3 = require("../utils/s3");
const config = require("../config");

exports.up = async function (knex) {
  let templates2048DataFilePaths = [];
  const templates2048Params = {
    Bucket: config.bucketURL,
    Prefix: "templates2048/",
    Delimiter: "/data.json",
  };

  let continuationToken;
  do {
    const payload = { ...templates2048Params };
    if (continuationToken) {
      payload.ContinuationToken = continuationToken;
    }

    const templates2048Result = await s3.listObjectsV2(payload).promise();
    templates2048DataFilePaths = templates2048DataFilePaths.concat(
      templates2048Result.CommonPrefixes.map((item) => item.Prefix).filter(
        (item) => !item.includes("__old")
      )
    );
    continuationToken = templates2048Result.NextContinuationToken;
  } while (continuationToken);

  for (let filePath of templates2048DataFilePaths) {
    console.log("Reading: ", filePath);
    const fileResult = await s3
      .getObject({
        Bucket: config.bucketURL,
        Key: filePath,
      })
      .promise();
    const fileContent = JSON.parse(fileResult.Body);
    const folderDirectory = filePath
      .replaceAll("templates2048/", "")
      .replaceAll("/data.json", "")
      .replaceAll("_", " ");

    console.log("Updating car_make with folder_directory: ", folderDirectory);
    await knex("car_makes")
      .update({
        builder_layers_2048: JSON.stringify(fileContent),
      })
      .where({
        folder_directory: folderDirectory,
      });
  }
};

exports.down = function (knex) {};
