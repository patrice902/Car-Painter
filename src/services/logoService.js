import BaseAPIService from "./baseAPIService";

export default class LogoService extends BaseAPIService {
  static getLogoList = async () => {
    return this.requestWithAuth(`/logo`, "GET");
  };
  static getLogoByID = async (id) => {
    return this.requestWithAuth(`/logo/${id}`, "GET");
  };
  static createLogo = async (payload) => {
    return this.requestWithAuth(`/logo`, "POST", payload);
  };
  static updateLogo = async (id, payload) => {
    return this.requestWithAuth(`/logo/${id}`, "PUT", payload);
  };
  static uploadAndCreate = async (formData) => {
    return this.requestWithAuth(
      `/logo/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  };
}
