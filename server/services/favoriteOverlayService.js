const FavoriteOverlay = require("../models/favoriteOverlay.model");

class FavoriteOverlayService {
  static async getList() {
    const list = await FavoriteOverlay.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await FavoriteOverlay.where({ user_id }).fetchAll();
    return list;
  }

  static async getListByOverlayId(overlay_id) {
    const list = await FavoriteOverlay.where({ overlay_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const favorite = await FavoriteOverlay.where({ id }).fetch();
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteOverlay.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    let favorite = await FavoriteOverlay.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    await FavoriteOverlay.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteOverlayService;
