import { BuilderBase } from "src/types/model";
import { BuilderBasePayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class BasePaintService extends BaseAPIService {
  static getBasePaintList = async (): Promise<BuilderBase[]> =>
    this.requestWithAuth(`/base`, "GET");

  static getBasePaintByID = async (id: number): Promise<BuilderBase> =>
    this.requestWithAuth(`/base/${id}`, "GET");

  static createBasePaint = async (
    payload: BuilderBasePayload
  ): Promise<BuilderBase> => this.requestWithAuth(`/base`, "POST", payload);

  static updateBasePaint = async (
    id: number,
    payload: BuilderBasePayload
  ): Promise<BuilderBase> =>
    this.requestWithAuth(`/base/${id}`, "PUT", payload);
}
