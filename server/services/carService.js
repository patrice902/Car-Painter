const Car = require("../models/car.model");
const { checkSQLWhereInputValid } = require("../utils/common");

class CarService {
  static async getList() {
    const cars = await Car.query();
    return cars;
  }

  static async getById(id) {
    if (!checkSQLWhereInputValid(id)) {
      throw new Error("SQL Injection attack detected.");
    }

    const car = await Car.query().findById(id);
    return car;
  }

  static async getActiveCar(user_id, car_make) {
    if (
      !checkSQLWhereInputValid(user_id) ||
      !checkSQLWhereInputValid(car_make)
    ) {
      throw new Error("SQL Injection attack detected.");
    }

    const car = await Car.query()
      .where("user_id", user_id)
      .where("car_make", car_make)
      .where("in_downloader", 1);
    return car;
  }

  static async create(payload) {
    const car = await Car.query().insert(payload);
    return car;
  }

  static async updateById(id, payload) {
    const car = await Car.query().patchAndFetchById(id, payload);
    return car;
  }
}

module.exports = CarService;
