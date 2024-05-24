const Font = require("../models/font.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class FontService {
  static async getList() {
    const fonts = await Font.query();
    return fonts;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const font = await Font.query.findById(id);
    return font;
  }

  static async create(payload) {
    const font = await Font.query().insert(payload);
    return font;
  }

  static async updateById(id, payload) {
    const font = await Font.query().patchAndFetchById(id, payload);
    return font;
  }
}

module.exports = FontService;
