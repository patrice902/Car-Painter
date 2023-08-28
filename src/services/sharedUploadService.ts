import { SharedUpload } from "src/types/model";
import { SharedUploadPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class SharedUploadService extends BaseAPIService {
  static getSharedUploadList = async (): Promise<SharedUpload[]> =>
    this.requestWithAuth(`/shared-upload`, "GET");

  static getSharedUploadListByUserID = async (
    userID: number
  ): Promise<SharedUpload[]> =>
    this.requestWithAuth(`/shared-upload/byUser/${userID}`, "GET");

  static getSharedUploadListByUploadID = async (
    UploadID: number
  ): Promise<SharedUpload[]> =>
    this.requestWithAuth(`/shared-upload/byUpload/${UploadID}`, "GET");

  static createSharedUpload = async (
    payload: SharedUploadPayload
  ): Promise<SharedUpload> =>
    this.requestWithAuth(`/shared-upload`, "POST", payload);

  static getSharedUpload = async (id: number): Promise<SharedUpload> =>
    this.requestWithAuth(`/shared-upload/${id}`, "GET");

  static updateSharedUpload = async (
    id: number,
    payload: SharedUploadPayload
  ): Promise<SharedUpload> =>
    this.requestWithAuth(`/shared-upload/${id}`, "PUT", payload);

  static deleteSharedUpload = async (id: number) =>
    this.requestWithAuth(`/shared-upload/${id}`, "DELETE");
}
