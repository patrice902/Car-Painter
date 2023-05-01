import { BuilderLayer } from "src/types/model";
import { BuilderLayerPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class LayerService extends BaseAPIService {
  static getLayerList = async (): Promise<BuilderLayer[]> =>
    this.requestWithAuth(`/layer`, "GET");

  static getLayerByID = async (id: number): Promise<BuilderLayer> =>
    this.requestWithAuth(`/layer/${id}`, "GET");

  static createLayer = async (
    payload: BuilderLayerPayload
  ): Promise<BuilderLayer> => this.requestWithAuth(`/layer`, "POST", payload);

  static updateLayer = async (
    id: number,
    payload: BuilderLayerPayload
  ): Promise<BuilderLayer> =>
    this.requestWithAuth(`/layer/${id}`, "PUT", payload);

  static deleteLayer = async (id: number) =>
    this.requestWithAuth(`/layer/${id}`, "DELETE");
}
