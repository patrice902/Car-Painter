import { CarMake } from "src/types/model";
import { CarMakePayload, CarMakeWithBases } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class CarMakeService extends BaseAPIService {
  static getCarMakeList = async (): Promise<CarMakeWithBases[]> =>
    this.requestWithAuth(`/carMake`, "GET");

  static getCarMakeByID = async (id: number): Promise<CarMakeWithBases> =>
    this.requestWithAuth(`/carMake/${id}`, "GET");

  static createCarMake = async (payload: CarMakePayload): Promise<CarMake> =>
    this.requestWithAuth(`/carMake`, "POST", payload);

  static updateCarMake = async (
    id: number,
    payload: CarMakePayload
  ): Promise<CarMake> => this.requestWithAuth(`/carMake/${id}`, "PUT", payload);
}
