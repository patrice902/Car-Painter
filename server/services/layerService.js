const { LayerTypes } = require("../constants");
const Layer = require("../models/layer.model");
const {
  getLayerUpdatingInfo,
  checkSQLWhereInputValid,
} = require("../utils/common");

class LayerService {
  static async getList() {
    const layers = await Layer.query();
    return layers;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const layer = await Layer.query().findById(id);
    return layer;
  }

  static async getListByUploadID(upload_id) {
    if (!checkSQLWhereInputValid(upload_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const layers = await Layer.query()
      .where("layer_type", LayerTypes.UPLOAD)
      .where("upload_id", upload_id)
      .patchAndFetchById("scheme");
    return layers;
  }

  static async getListByMultiUploadIDs(uploadIDs) {
    if (!uploadIDs || !Array.isArray(uploadIDs) || !uploadIDs.length) {
      throw new Error("Invalid input.");
    }

    for (let id of uploadIDs) {
      if (!checkSQLWhereInputValid(id)) {
        throw new Error("SQL Injection attack detected.");
      }
    }

    const layers = await Layer.query()
      .where("layer_type", LayerTypes.UPLOAD)
      .where("upload_id", "IN", uploadIDs)
      .patchAndFetchById("scheme");
    return layers;
  }

  static async create(payload) {
    if (!checkSQLWhereInputValid(payload.scheme_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let scheme_layers = await Layer.query().where(
      "scheme_id",
      payload.scheme_id
    );
    let layer_data = JSON.parse(payload.layer_data);
    let layerName = layer_data.name;
    let number = 0;

    for (let layerItem of scheme_layers) {
      let item_layer_data = layerItem.layer_data
        ? JSON.parse(layerItem.layer_data)
        : null;
      if (item_layer_data && item_layer_data.name.indexOf(layerName) === 0) {
        const extraSpace = item_layer_data.name.substr(layerName.length);
        if (!isNaN(extraSpace)) {
          number = extraSpace === "" ? 1 : parseInt(extraSpace) + 1;
        }
      }
    }
    if (number) layerName = `${layerName} ${number}`;
    layer_data.name = layerName;
    const layer = await Layer.query().insert({
      ...payload,
      layer_data: JSON.stringify(layer_data),
    });
    return layer;
  }

  static async updateById(id, payload) {
    const layer = await Layer.query().findById(id);

    return await Layer.query().patchAndFetchById(
      id,
      getLayerUpdatingInfo(layer, payload)
    );
  }

  static async bulkUpdate(payload) {
    const list = [];
    let promises = [];

    for (let item of payload) {
      promises.push(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          try {
            const layer = await Layer.query().findById(item.id);

            list.push(
              await Layer.query().patchAndFetchById(
                item.id,
                getLayerUpdatingInfo(layer, item)
              )
            );
          } catch (error) {
            console.log(error);
          }

          resolve();
        })
      );
    }
    await Promise.all(promises);

    return list;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Layer.query().deleteById(id);

    return true;
  }

  static async deleteByMultiId(ids) {
    if (!ids || !Array.isArray(ids) || !ids.length) {
      throw new Error("Invalid input.");
    }

    for (let id of ids) {
      if (!checkSQLWhereInputValid(id)) {
        throw new Error("SQL Injection attack detected.");
      }
    }

    await Layer.query().delete().where("id", "IN", ids);

    return true;
  }

  static async deleteByUploadID(upload_id) {
    if (!checkSQLWhereInputValid(upload_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Layer.query()
      .delete()
      .where("layer_type", LayerTypes.UPLOAD)
      .where("upload_id", upload_id);

    return true;
  }

  static async deleteByUploadIDAndScheme(uploadID, schemeIDs) {
    if (!checkSQLWhereInputValid(uploadID)) {
      throw new Error("SQL Injection attack detected.");
    }

    if (!schemeIDs || !Array.isArray(schemeIDs) || !schemeIDs.length) {
      throw new Error("Invalid input.");
    }

    for (let id of schemeIDs) {
      if (!checkSQLWhereInputValid(id)) {
        throw new Error("SQL Injection attack detected.");
      }
    }

    await Layer.query()
      .where("layer_type", LayerTypes.UPLOAD)
      .where("upload_id", uploadID)
      .where("scheme_id", "IN", schemeIDs)
      .delete();

    return true;
  }

  static async deleteByMultiUploadIDs(uploadIDs) {
    if (!uploadIDs || !Array.isArray(uploadIDs) || !uploadIDs.length) {
      throw new Error("Invalid input.");
    }

    for (let id of uploadIDs) {
      if (!checkSQLWhereInputValid(id)) {
        throw new Error("SQL Injection attack detected.");
      }
    }

    await Layer.query()
      .where("layer_type", LayerTypes.UPLOAD)
      .where("upload_id", "IN", uploadIDs)
      .delete();

    return true;
  }

  static async deleteAllBySchemeId(scheme_id) {
    if (!checkSQLWhereInputValid(scheme_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Layer.query().where("scheme_id", scheme_id).delete();

    return true;
  }

  static async deleteCarLayersInScheme(scheme_id) {
    if (!checkSQLWhereInputValid(scheme_id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await Layer.query()
      .where("scheme_id", scheme_id)
      .where("layer_type", LayerTypes.CAR)
      .delete();

    return true;
  }
}

module.exports = LayerService;
