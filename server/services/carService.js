const Car = require("../models/car.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarService {
  static async getList() {
    const cars = await Car.forge().fetchAll();
    return cars;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const car = await Car.where({ id }).fetch();
    return car;
  }

  static async getActiveCar(user_id, car_make) {
    if (
      !checkSQLWhereInputValid(user_id) ||
      !checkSQLWhereInputValid(car_make)
    ) {
      throw new Error("SQL Injection attack detected.");
    }

    const car = await Car.where({
      user_id,
      car_make,
      in_downloader: 1,
    }).fetch();
    return car;
  }

  static async create(payload) {
    const car = await Car.forge(payload).save();
    return car;
  }

  static async updateById(id, payload) {
    const car = await this.getById(id);
    await car.save(payload);
    return car;
  }
}

module.exports = CarService;
