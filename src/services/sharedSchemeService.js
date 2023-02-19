import BaseAPIService from "./baseAPIService";

export default class SharedSchemeService extends BaseAPIService {
  static getSharedSchemeList = async () =>
    this.requestWithAuth(`/shared`, "GET");
  static getSharedSchemeListByUserID = async (userID) =>
    this.requestWithAuth(`/shared/byUser/${userID}`, "GET");
  static getSharedSchemeListBySchemeID = async (schemeID) =>
    this.requestWithAuth(`/shared/byScheme/${schemeID}`, "GET");
  static createSharedScheme = async (payload) =>
    this.requestWithAuth(`/shared`, "POST", payload);
  static getSharedScheme = async (schemeID) =>
    this.requestWithAuth(`/shared/${schemeID}`, "GET");
  static updateSharedScheme = async (schemeID, payload) =>
    this.requestWithAuth(`/shared/${schemeID}`, "PUT", payload);
  static deleteSharedScheme = async (id) =>
    this.requestWithAuth(`/shared/${id}`, "DELETE");
}
