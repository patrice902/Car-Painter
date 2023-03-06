const { LayerTypes } = require("../constants");
const Layer = require("../models/layer.model");
const { getLayerUpdatingInfo } = require("../utils/common");

class LayerService {
  static async getList() {
    const layers = await Layer.forge().fetchAll();
    return layers;
  }

  static async getById(id) {
    const layer = await Layer.where({ id }).fetch();
    return layer;
  }

  static async getListByUploadID(uploadID) {
    const layers = await Layer.where({
      layer_type: LayerTypes.UPLOAD,
      upload_id: uploadID,
    }).fetchAll({
      withRelated: ["scheme"],
    });
    return layers;
  }

  static async getListByMultiUploadIDs(uploadIDs) {
    const layers = await Layer.query((qb) =>
      qb
        .where({
          layer_type: LayerTypes.UPLOAD,
        })
        .andWhere("upload_id", "IN", uploadIDs)
    ).fetchAll({
      withRelated: ["scheme"],
    });
    return layers;
  }

  static async create(payload) {
    let scheme_layers = await Layer.where({
      scheme_id: payload.scheme_id,
    }).fetchAll();
    scheme_layers = scheme_layers.toJSON();
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
    const layer = await Layer.forge({
      ...payload,
      layer_data: JSON.stringify(layer_data),
    }).save(null, { method: "insert" });
    return layer;
  }

  static async updateById(id, payload) {
    const layer = await this.getById(id);
    const layerInfo = layer.toJSON();

    await layer.save(getLayerUpdatingInfo(layerInfo, payload), { patch: true });
    return layer;
  }

  static async bulkUpdate(payload) {
    const list = [];
    let promises = [];

    for (let item of payload) {
      promises.push(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          const layer = await this.getById(item.id);
          const layerInfo = layer.toJSON();

          await layer.save(getLayerUpdatingInfo(layerInfo, item), {
            patch: true,
          });
          list.push(layer);

          resolve();
        })
      );
    }
    await Promise.all(promises);

    return list;
  }

  static async deleteById(id) {
    await Layer.where({ id }).destroy({ require: false });
    return true;
  }

  static async deleteByMultiId(ids) {
    await Layer.where("id", "IN", ids).destroy({ require: false });
    return true;
  }

  static async deleteByUploadID(uploadID) {
    await Layer.where({
      layer_type: LayerTypes.UPLOAD,
      upload_id: uploadID,
    }).destroy({ require: false });
    return true;
  }

  static async deleteByMultiUploadIDs(uploadIDs) {
    await Layer.query((qb) =>
      qb
        .where({
          layer_type: LayerTypes.UPLOAD,
        })
        .andWhere("upload_id", "IN", uploadIDs)
    ).destroy({ require: false });
    return true;
  }

  static async deleteAllBySchemeId(scheme_id) {
    await Layer.where({
      scheme_id,
    }).destroy({ require: false });
    return true;
  }

  static async deleteByQuery(query) {
    await Layer.where(query).destroy({ require: false });
    return true;
  }
}

module.exports = LayerService;
