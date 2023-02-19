import BaseAPIService from "./baseAPIService";

export default class FontService extends BaseAPIService {
  static getFontList = async () => this.requestWithAuth(`/font`, "GET");
  static getFontByID = async (id) => this.requestWithAuth(`/font/${id}`, "GET");
  static createFont = async (payload) =>
    this.requestWithAuth(`/font`, "POST", payload);
  static updateFont = async (id, payload) =>
    this.requestWithAuth(`/font/${id}`, "PUT", payload);
}
