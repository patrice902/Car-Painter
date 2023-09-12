import { BuilderUploadWithUser } from "src/types/model";
import { BuilderUploadPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class UploadService extends BaseAPIService {
  static getUploadList = async (): Promise<BuilderUploadWithUser[]> =>
    this.requestWithAuth(`/upload`, "GET");

  static getUploadListByUserID = async (
    userID: number
  ): Promise<BuilderUploadWithUser[]> =>
    this.requestWithAuth(`/upload/byUserID/${userID}`, "GET");

  static getUploadByID = async (id: number): Promise<BuilderUploadWithUser> =>
    this.requestWithAuth(`/upload/${id}`, "GET");

  static createUpload = async (
    payload: BuilderUploadPayload
  ): Promise<BuilderUploadWithUser> =>
    this.requestWithAuth(`/upload`, "POST", payload);

  static updateUpload = async (
    id: number,
    payload: BuilderUploadPayload
  ): Promise<BuilderUploadWithUser> =>
    this.requestWithAuth(`/upload/${id}`, "PUT", payload);

  static deleteUpload = async (id: number, deleteFromAll: boolean) =>
    this.requestWithAuth(`/upload/${id}`, "DELETE", {
      deleteFromAll,
    });

  static deleteLegacyByUserID = async (
    userID: number,
    deleteFromAll: boolean
  ) =>
    this.requestWithAuth(`/upload/byUserID/${userID}/removeLegacy`, "DELETE", {
      deleteFromAll,
    });

  static uploadFiles = async (
    formData: FormData
  ): Promise<BuilderUploadWithUser[]> =>
    this.requestWithAuth(
      `/upload/uploadFiles`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
}
