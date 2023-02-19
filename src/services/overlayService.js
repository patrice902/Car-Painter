import BaseAPIService from "./baseAPIService";

export default class OverlayService extends BaseAPIService {
  static getOverlayList = async () => this.requestWithAuth(`/overlay`, "GET");
  static getOverlayByID = async (id) =>
    this.requestWithAuth(`/overlay/${id}`, "GET");
  static createOverlay = async (payload) =>
    this.requestWithAuth(`/overlay`, "POST", payload);
  static updateOverlay = async (id, payload) =>
    this.requestWithAuth(`/overlay/${id}`, "PUT", payload);
  static deleteOverlay = async (id) =>
    this.requestWithAuth(`/overlay/${id}`, "DELETE");
  static uploadAndCreate = async (formData) =>
    this.requestWithAuth(
      `/overlay/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
  static uploadAndUpdate = async (id, formData) =>
    this.requestWithAuth(
      `/overlay/${id}/upload-and-update`,
      "PUT",
      formData,
      0,
      "multipart/form-data"
    );
}
