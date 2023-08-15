const FavoriteLogo = require("../models/favoriteLogo.model");

class FavoriteLogoService {
  static async getList() {
    const list = await FavoriteLogo.forge().fetchAll();
    return list;
  }

  static async getListByUserId(user_id) {
    const list = await FavoriteLogo.where({ user_id }).fetchAll();
    return list;
  }

  static async getListByLogoId(logo_id) {
    const list = await FavoriteLogo.where({ logo_id }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const favorite = await FavoriteLogo.where({ id }).fetch();
    return favorite;
  }

  static async create(payload) {
    let favorite = await FavoriteLogo.forge(payload).save();
    favorite = favorite.toJSON();
    favorite = this.getByID(favorite.id);
    return favorite;
  }

  static async updateById(id, payload) {
    let favorite = await FavoriteLogo.where({ id }).fetch();
    await favorite.save(payload);
    favorite = this.getByID(id);
    return favorite;
  }

  static async deleteById(id) {
    await FavoriteLogo.where({ id }).destroy({
      require: false,
    });
    return true;
  }
}

module.exports = FavoriteLogoService;
