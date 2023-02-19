import BaseAPIService from "./baseAPIService";

export default class BasePaintService extends BaseAPIService {
  static getBasePaintList = async () => this.requestWithAuth(`/base`, "GET");
  static getBasePaintByID = async (id) =>
    this.requestWithAuth(`/base/${id}`, "GET");
  static createBasePaint = async (payload) =>
    this.requestWithAuth(`/base`, "POST", payload);
  static updateBasePaint = async (id, payload) =>
    this.requestWithAuth(`/base/${id}`, "PUT", payload);
}
