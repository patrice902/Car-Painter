import BaseAPIService from "./baseAPIService";

export default class SchemeService extends BaseAPIService {
  static getSchemeList = async () => this.requestWithAuth(`/scheme`, "GET");
  static getSchemeListByUserID = async (userID) =>
    this.requestWithAuth(`/scheme/?userID=${userID}`, "GET");
  static getSchemeListByUploadID = async (uploadID) =>
    this.requestWithAuth(`/scheme/byUpload/${uploadID}`, "GET");
  static createScheme = async (carMakeID, name, userID, legacy_mode) =>
    this.requestWithAuth(`/scheme`, "POST", {
      carMakeID,
      name,
      userID,
      legacy_mode,
    });
  static getScheme = async (schemeID) =>
    this.requestWithAuth(`/scheme/${schemeID}`, "GET");
  static updateScheme = async (schemeID, payload) =>
    this.requestWithAuth(`/scheme/${schemeID}`, "PUT", payload);
  static deleteScheme = async (id) =>
    this.requestWithAuth(`/scheme/${id}`, "DELETE");
  static cloneScheme = async (id) =>
    this.requestWithAuth(`/scheme/clone/${id}`, "POST");
  static renewCarMakeLayers = async (id) =>
    this.requestWithAuth(`/scheme/renewCarMakeLayers/${id}`, "POST");

  static uploadThumbnail = async (formData) =>
    this.requestWithAuth(
      `/scheme/thumbnail`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
}
