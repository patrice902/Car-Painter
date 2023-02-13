const s3 = require("../utils/s3");
const config = require("../config");

exports.up = async function (knex) {
  let templates2048BaseFolderPaths = [];
  const templates2048Params = {
    Bucket: config.bucketURL,
    Prefix: "templates2048/",
    Delimiter: "/bases/",
  };

  let continuationToken;
  do {
    const payload = { ...templates2048Params };
    if (continuationToken) {
      payload.ContinuationToken = continuationToken;
    }

    const templates2048Result = await s3.listObjectsV2(payload).promise();
    templates2048BaseFolderPaths = templates2048BaseFolderPaths.concat(
      templates2048Result.CommonPrefixes.map((item) => item.Prefix).filter(
        (item) => !item.includes("__old")
      )
    );
    continuationToken = templates2048Result.NextContinuationToken;
  } while (continuationToken);

  for (let folderPath of templates2048BaseFolderPaths) {
    const listResult = await s3
      .listObjectsV2({
        Bucket: config.bucketURL,
        Prefix: folderPath,
        Delimiter: "/",
      })
      .promise();
    const baseCount = listResult.CommonPrefixes.length;
    console.log(folderPath, ":", baseCount);

    const folderDirectory = folderPath
      .replaceAll("templates2048/", "")
      .replaceAll("/bases/", "")
      .replaceAll("_", " ");

    await knex("car_makes")
      .update({
        total_bases: baseCount,
      })
      .where({
        folder_directory: folderDirectory,
      });
  }
};

exports.down = function () {};
