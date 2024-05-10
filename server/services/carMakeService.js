const CarMake = require("../models/carMake.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarMakeService {
  static async getList() {
    const carMakes = await CarMake.forge().fetchAll({
      withRelated: ["bases"],
    });
    return carMakes;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const carMake = await CarMake.where({ id }).fetch({
      withRelated: ["bases"],
    });
    return carMake;
  }

  static async create(payload) {
    const carMake = await CarMake.forge(payload).save();
    return carMake;
  }

  static async updateById(id, payload) {
    const carMake = await this.getById(id);
    await carMake.save(payload);
    return carMake;
  }
}

module.exports = CarMakeService;
