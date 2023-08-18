const FavoriteUpload = require("../models/favoriteUpload.model");

class FavoriteUploadService {
  static async getList() {
    const list = await FavoriteUpload.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await FavoriteUpload.where({ user_id }).fetchAll();
    return list;
  }

  static async getListByUploadId(upload_id) {
    const list = await FavoriteUpload.where({ upload_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const favorite = await FavoriteUpload.where({ id }).fetch();
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteUpload.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    let favorite = await FavoriteUpload.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    await FavoriteUpload.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteUploadService;
