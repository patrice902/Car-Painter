const SharedUpload = require("../models/sharedUpload.model");

class SharedUploadService {
  static async getList() {
    const list = await SharedUpload.forge().fetchAll({
      withRelated: ["upload"],
    });
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await SharedUpload.where({ user_id }).fetchAll({
      withRelated: ["upload"],
    });
    return list;
  }

  static async getListByUploadId(upload_id) {
    const list = await SharedUpload.where({ upload_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const favorite = await SharedUpload.where({ id }).fetch({
      withRelated: ["upload"],
    });
    return favorite;
  }

  static async create(payload) {
    let favorite = await SharedUpload.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    let favorite = await SharedUpload.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    await SharedUpload.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = SharedUploadService;
