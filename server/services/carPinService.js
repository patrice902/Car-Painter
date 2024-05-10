const CarPin = require("../models/carPin.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarPinService {
  static async getList() {
    const list = await CarPin.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    if (!checkSQLWhereInputValid(userid)) {
      throw new Error("SQL Injection attack detected.");
    }

    const list = await CarPin.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const carPin = await CarPin.where({ id }).fetch();
    return carPin;
  }

  static async create(payload) {
    let carPin = await CarPin.forge(payload).save();
    carPin = carPin.toJSON();
    carPin = this.getByID(carPin.id);
    return carPin;
  }

  static async updateById(id, payload) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    let carPin = await CarPin.where({ id }).fetch();
    await carPin.save(payload);
    carPin = this.getByID(id);
    return carPin;
  }

  static async deleteById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    await CarPin.where({ id }).destroy({ require: false });
    return true;
  }
}

module.exports = CarPinService;
