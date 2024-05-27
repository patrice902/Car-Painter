const CarPin = require("../models/carPin.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarPinService {
  static async getList() {
    const list = await CarPin.query();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await CarPin.query().where("userid", userid);
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const carPin = await CarPin.query().findById(id);
    return carPin;
  }

  static async create(payload) {
    const carPin = await CarPin.query().insert(payload);
    return carPin;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const carPin = await CarPin.query().patchAndFetchById(id, payload);
    return carPin;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await CarPin.query().deleteById(id);
    return true;
  }
}

module.exports = CarPinService;
