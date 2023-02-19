import BaseAPIService from "./baseAPIService";

export default class CarMakeService extends BaseAPIService {
  static getCarMakeList = async () => this.requestWithAuth(`/carMake`, "GET");
  static getCarMakeByID = async (id) =>
    this.requestWithAuth(`/carMake/${id}`, "GET");
  static createCarMake = async (payload) =>
    this.requestWithAuth(`/carMake`, "POST", payload);
  static updateCarMake = async (id, payload) =>
    this.requestWithAuth(`/carMake/${id}`, "PUT", payload);
}
