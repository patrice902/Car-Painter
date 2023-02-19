import BaseAPIService from "./baseAPIService";

export default class LayerService extends BaseAPIService {
  static getLayerList = async () => this.requestWithAuth(`/layer`, "GET");
  static getLayerByID = async (id) =>
    this.requestWithAuth(`/layer/${id}`, "GET");
  static createLayer = async (payload) =>
    this.requestWithAuth(`/layer`, "POST", payload);
  static updateLayer = async (id, payload) =>
    this.requestWithAuth(`/layer/${id}`, "PUT", payload);
  static deleteLayer = async (id) =>
    this.requestWithAuth(`/layer/${id}`, "DELETE");
}
