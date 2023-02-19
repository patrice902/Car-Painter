import BaseAPIService from "./baseAPIService";

export default class CarService extends BaseAPIService {
  static getCarList = async () => this.requestWithAuth(`/car`, "GET");
  static getCarByID = async (id) => this.requestWithAuth(`/car/${id}`, "GET");
  static getActiveCar = async (userID, carMakeID) =>
    this.requestWithAuth(
      `/car/active?userID=${userID}&carMake=${carMakeID}`,
      "GET"
    );
  static getCarRace = async (builderID, number) =>
    this.directRequestWithAuth(
      `https://www.tradingpaints.com/builder.php?cmd=loadrace&builder_id=${builderID}&number=${number}`,
      "GET"
    );
  static setCarRace = async (payload) =>
    this.directRequestWithAuth(
      `https://www.tradingpaints.com/builder.php?cmd=set`,
      "POST",
      payload,
      0,
      "multipart/form-data"
    );
  static createCar = async (payload) =>
    this.requestWithAuth(`/car`, "POST", payload);
  static updateCar = async (id, payload) =>
    this.requestWithAuth(`/car/${id}`, "PUT", payload);
}
