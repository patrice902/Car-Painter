const Font = require("../models/font.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FontService {
  static async getList() {
    const fonts = await Font.forge().fetchAll();
    return fonts;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const font = await Font.where({ id }).fetch();
    return font;
  }

  static async create(payload) {
    const font = await Font.forge(payload).save();
    return font;
  }

  static async updateById(id, payload) {
    const font = await this.getById(id);
    await font.save(payload);
    return font;
  }
}

module.exports = FontService;
