import BaseAPIService from "./baseAPIService";

export default class OverlayService extends BaseAPIService {
  static getOverlayList = async () => {
    return this.requestWithAuth(`/overlay`, "GET");
  };
  static getOverlayByID = async (id) => {
    return this.requestWithAuth(`/overlay/${id}`, "GET");
  };
  static createOverlay = async (payload) => {
    return this.requestWithAuth(`/overlay`, "POST", payload);
  };
  static updateOverlay = async (id, payload) => {
    return this.requestWithAuth(`/overlay/${id}`, "PUT", payload);
  };
  static deleteOverlay = async (id) => {
    return this.requestWithAuth(`/overlay/${id}`, "DELETE");
  };
  static uploadAndCreate = async (formData) => {
    return this.requestWithAuth(
      `/overlay/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  };
  static uploadAndUpdate = async (id, formData) => {
    return this.requestWithAuth(
      `/overlay/${id}/upload-and-update`,
      "PUT",
      formData,
      0,
      "multipart/form-data"
    );
  };
}
