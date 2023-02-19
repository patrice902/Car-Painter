import BaseAPIService from "./baseAPIService";

export default class CarPinService extends BaseAPIService {
  static getCarPinList = async () => this.requestWithAuth(`/carPin`, "GET");
  static getCarPinListByUserID = async (userID) =>
    this.requestWithAuth(`/carPin/byUser/${userID}`, "GET");
  static createCarPin = async (payload) =>
    this.requestWithAuth(`/carPin`, "POST", payload);
  static getCarPin = async (ID) => this.requestWithAuth(`/carPin/${ID}`, "GET");
  static updateCarPin = async (ID, payload) =>
    this.requestWithAuth(`/carPin/${ID}`, "PUT", payload);
  static deleteCarPin = async (id) =>
    this.requestWithAuth(`/carPin/${id}`, "DELETE");
}
