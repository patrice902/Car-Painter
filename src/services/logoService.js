import BaseAPIService from "./baseAPIService";

export default class LogoService extends BaseAPIService {
  static getLogoList = async () => this.requestWithAuth(`/logo`, "GET");
  static getLogoByID = async (id) => this.requestWithAuth(`/logo/${id}`, "GET");
  static createLogo = async (payload) =>
    this.requestWithAuth(`/logo`, "POST", payload);
  static updateLogo = async (id, payload) =>
    this.requestWithAuth(`/logo/${id}`, "PUT", payload);
  static deleteLogo = async (id) =>
    this.requestWithAuth(`/logo/${id}`, "DELETE");
  static uploadAndCreate = async (formData) =>
    this.requestWithAuth(
      `/logo/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  static uploadAndUpdate = async (id, formData) =>
    this.requestWithAuth(
      `/logo/${id}/upload-and-update`,
      "PUT",
      formData,
      0,
      "multipart/form-data"
    );
}
