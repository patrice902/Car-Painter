import { CarPin } from "src/types/model";
import { CarPinPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class CarPinService extends BaseAPIService {
  static getCarPinList = async (): Promise<CarPin[]> =>
    this.requestWithAuth(`/carPin`, "GET");

  static getCarPinListByUserID = async (userID: number): Promise<CarPin[]> =>
    this.requestWithAuth(`/carPin/byUser/${userID}`, "GET");

  static createCarPin = async (payload: CarPinPayload): Promise<CarPin> =>
    this.requestWithAuth(`/carPin`, "POST", payload);

  static getCarPin = async (id: number): Promise<CarPin> =>
    this.requestWithAuth(`/carPin/${id}`, "GET");

  static updateCarPin = async (
    id: number,
    payload: CarPinPayload
  ): Promise<CarPin> => this.requestWithAuth(`/carPin/${id}`, "PUT", payload);

  static deleteCarPin = async (id: number) =>
    this.requestWithAuth(`/carPin/${id}`, "DELETE");
}
