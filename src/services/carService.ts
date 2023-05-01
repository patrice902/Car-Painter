import { Car } from "src/types/model";
import { CarPayload, GetCarRaceResponse } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class CarService extends BaseAPIService {
  static getCarList = async (): Promise<Car[]> =>
    this.requestWithAuth(`/car`, "GET");

  static getCarByID = async (id: number): Promise<Car> =>
    this.requestWithAuth(`/car/${id}`, "GET");

  static getActiveCar = async (
    userID: number,
    carMakeID: number
  ): Promise<Car[]> =>
    this.requestWithAuth(
      `/car/active?userID=${userID}&carMake=${carMakeID}`,
      "GET"
    );

  static getCarRace = async (
    builderID: number,
    number: number
  ): Promise<GetCarRaceResponse> =>
    this.directRequestWithAuth(
      `https://www.tradingpaints.com/builder.php?cmd=loadrace&builder_id=${builderID}&number=${number}`,
      "GET"
    );

  static setCarRace = async (payload: FormData) =>
    this.directRequestWithAuth(
      `https://www.tradingpaints.com/builder.php?cmd=set`,
      "POST",
      payload,
      0,
      "multipart/form-data"
    );

  static createCar = async (payload: CarPayload): Promise<Car> =>
    this.requestWithAuth(`/car`, "POST", payload);

  static updateCar = async (id: number, payload: CarPayload): Promise<Car> =>
    this.requestWithAuth(`/car/${id}`, "PUT", payload);
}
