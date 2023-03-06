import BaseAPIService from "./baseAPIService";

export default class UploadService extends BaseAPIService {
  static getUploadList = async () => this.requestWithAuth(`/upload`, "GET");
  static getUploadListByUserID = async (userID) =>
    this.requestWithAuth(`/upload/byUserID/${userID}`, "GET");
  static getUploadByID = async (id) =>
    this.requestWithAuth(`/upload/${id}`, "GET");
  static createUpload = async (payload) =>
    this.requestWithAuth(`/upload`, "POST", payload);
  static updateUpload = async (id, payload) =>
    this.requestWithAuth(`/upload/${id}`, "PUT", payload);
  static deleteUpload = async (id, deleteFromAll) =>
    this.requestWithAuth(`/upload/${id}`, "DELETE", {
      deleteFromAll,
    });
  static deleteLegacyByUserID = async (userID, deleteFromAll) =>
    this.requestWithAuth(`/upload/byUserID/${userID}/removeLegacy`, "DELETE", {
      deleteFromAll,
    });
  static uploadFiles = async (formData) =>
    this.requestWithAuth(
      `/upload/uploadFiles`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
}
