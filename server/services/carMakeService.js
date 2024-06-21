const CarMake = require("../models/carMake.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarMakeService {
  static async getList() {
    const carMakes = await CarMake.query().withGraphFetched("bases");
    return carMakes;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const carMake = await CarMake.query()
      .findById(id)
      .withGraphFetched("bases");
    return carMake;
  }

  static async create(payload) {
    const carMake = await CarMake.query().insert(payload);
    return carMake;
  }

  static async updateById(id, payload) {
    await CarMake.query().patchAndFetchById(id, payload);
    return await this.getById(id);
  }
}

module.exports = CarMakeService;
